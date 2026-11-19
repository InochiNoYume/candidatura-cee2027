import fs from "node:fs";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = (process.env.CEE_AUDIT_BASE_URL || "https://candidatura-cee2027.pages.dev/").replace(/\/?$/, "/");
const routes = [
  "", "pages/lista.html", "pages/proyecto.html", "pages/agenda.html",
  "pages/transparencia.html", "pages/noticias.html", "pages/galeria.html",
  "pages/escucha.html", "pages/preguntas.html", "pages/contacto.html",
  "pages/actas.html", "pages/informes.html", "pages/comunidad-tp.html",
  "pages/memoria.html", "pages/privacidad.html", "pages/buscar.html", "404.html"
];
const viewports = [
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "tablet", width: 768, height: 900, isMobile: false, hasTouch: false },
  { name: "small-laptop", width: 1024, height: 900, isMobile: false, hasTouch: false },
  { name: "nav-breakpoint", width: 1240, height: 900, isMobile: false, hasTouch: false },
  { name: "desktop", width: 1280, height: 900, isMobile: false, hasTouch: false },
  { name: "wide-desktop", width: 1440, height: 900, isMobile: false, hasTouch: false }
];
const browser = await chromium.launch({ headless: true });
const results = [];
const failures = [];
const assistantResults = [];
const screenshotResults = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, isMobile: viewport.isMobile, hasTouch: viewport.hasTouch });
    const page = await context.newPage();
    for (const route of routes) {
      const url = new URL(route, base).href;
      const pageErrors = [];
      page.on("pageerror", error => pageErrors.push(error.message));
      let response;
      try {
        response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        await page.locator("body").waitFor();
        // Espera a que terminen las animaciones .reveal para auditar los colores finales, no estados transitorios.
        await page.waitForTimeout(850);
        const layout = await page.evaluate(() => ({
          title: document.title,
          viewportWidth: document.documentElement.clientWidth,
          documentWidth: document.documentElement.scrollWidth,
          mainCount: document.querySelectorAll("main").length,
          imagesWithoutAlt: [...document.images].filter(image => !image.hasAttribute("alt")).length
        }));
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
          .analyze();
        // Prueba funcional de cada filtro: compara lo visible con sus categorías reales.
        const filterChecks = await page.evaluate(() => {
          const groups = [...document.querySelectorAll("[data-filter-group]")];
          return groups.map(group => {
            const name = group.getAttribute("data-filter-group");
            const buttons = [...group.querySelectorAll("[data-filter]")];
            const items = [...document.querySelectorAll('[data-filter-item="' + name + '"]')];
            const errors = [];
            for (const button of buttons) {
              const value = button.getAttribute("data-filter");
              button.click();
              const visible = items.filter(item => !item.hidden);
              const expected = items.filter(item => {
                if (name === "news") return value === "all";
                const categories = (item.getAttribute("data-category") || "").trim().split(/\s+/).filter(Boolean);
                return value === "all" || categories.includes(value);
              });
              if (visible.length !== expected.length) {
                errors.push('"' + value + '": visibles ' + visible.length + ', esperados ' + expected.length);
              }
              if (visible.some(item => !expected.includes(item)) || expected.some(item => !visible.includes(item))) {
                errors.push('"' + value + '": los elementos visibles no coinciden con las categorías');
              }
              if (button.getAttribute("aria-pressed") !== "true") errors.push('"' + value + '": aria-pressed no se actualizó');
              if (buttons.some(other => other !== button && other.getAttribute("aria-pressed") === "true")) {
                errors.push('"' + value + '": hay más de un filtro marcado como activo');
              }
              const empty = document.querySelector('[data-filter-empty="' + name + '"]');
              if (empty && name !== "news" && empty.hidden !== (expected.length > 0)) {
                errors.push('"' + value + '": el mensaje de estado vacío no coincide');
              }
            }
            buttons.find(button => button.getAttribute("data-filter") === "all")?.click();
            return { name, errors };
          });
        });
        for (const check of filterChecks) {
          if (check.errors.length) failures.push(`${viewport.name} ${route}: filtro ${check.name}: ${check.errors.join("; ")}`);
        }

        // Comprueba el menú responsive, los desplegables y el cierre mediante Escape.
        const navigationErrors = await page.evaluate(() => {
          const errors = [];
          const nav = document.querySelector(".site-nav");
          const menuButton = document.querySelector(".menu-toggle");
          const dropdown = nav?.querySelector("details.nav-dropdown");
          if (window.matchMedia("(min-width: 1241px)").matches && nav && nav.scrollWidth > nav.clientWidth + 2) {
            errors.push("la navegación horizontal desborda su espacio disponible");
          }
          if (dropdown) {
            const summary = dropdown.querySelector("summary");
            const pseudoArrow = summary ? getComputedStyle(summary, "::after").content : "none";
            if (pseudoArrow !== "none" && pseudoArrow !== "normal") errors.push("el desplegable muestra una flecha CSS duplicada");
            dropdown.open = false;
            dropdown.querySelector("summary")?.click();
            if (!dropdown.open) errors.push("el desplegable no se abre");
          }
          if (window.matchMedia("(max-width: 1240px)").matches && menuButton && nav) {
            if (!nav.classList.contains("open")) menuButton.click();
            if (!nav.classList.contains("open") || menuButton.getAttribute("aria-expanded") !== "true") {
              errors.push("el menú móvil no actualiza su estado abierto");
            }
          }
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
          if (dropdown?.open) errors.push("Escape no cierra el desplegable");
          if (window.matchMedia("(max-width: 1240px)").matches && nav &&
              (nav.classList.contains("open") || menuButton?.getAttribute("aria-expanded") !== "false")) {
            errors.push("Escape no cierra el menú móvil o no actualiza aria-expanded");
          }
          return errors;
        });
        for (const error of navigationErrors) failures.push(`${viewport.name} ${route}: navegación: ${error}`);

        // Comprueba la presencia y accesibilidad básica del asistente global y del canvas de partículas.
        const assistantChecks = await page.evaluate(() => {
          const errors = [];
          const launcher = document.querySelector(".cee-assistant-launcher");
          const panel = document.querySelector("#cee-assistant-panel");
          const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          const trail = document.querySelector(".cee-pointer-trail");
          if (!launcher) errors.push("no aparece el botón del Asistente CEE");
          if (!panel) errors.push("no aparece el panel del Asistente CEE");
          if (!reduceMotion && !trail) errors.push("no aparece el canvas de partículas aunque el movimiento está permitido");
          if (reduceMotion && trail && getComputedStyle(trail).display !== "none") errors.push("el rastro de partículas no respeta prefers-reduced-motion");
          if (launcher && !/Asistente CEE/.test(launcher.textContent)) errors.push("el botón no muestra el nombre Asistente CEE");
          if (panel && !/Asistente CEE/.test(panel.querySelector("#cee-assistant-title")?.textContent || "")) errors.push("el panel no muestra el título Asistente CEE");
          if (launcher && panel) {
            window.scrollTo(0, 650);
            launcher.click();
            if (panel.hidden || launcher.getAttribute("aria-expanded") !== "true") errors.push("el asistente no abre o no actualiza aria-expanded");
            const input = panel.querySelector("#cee-assistant-input");
            if (!input || Number(input.getAttribute("maxlength")) !== 500) errors.push("el campo del asistente no limita la pregunta a 500 caracteres");
            panel.querySelector(".cee-assistant-close")?.click();
            if (!panel.hidden || launcher.getAttribute("aria-expanded") !== "false") errors.push("el asistente no cierra correctamente");
            const topButton = document.querySelector(".back-to-top");
            if (topButton && getComputedStyle(topButton).visibility === "visible") {
              const a = launcher.getBoundingClientRect(), b = topButton.getBoundingClientRect();
              if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
                errors.push("el botón Asistente CEE se superpone con Volver arriba");
              }
              if (b.bottom > a.top) errors.push("Volver arriba no está visualmente encima del Asistente CEE");
            }
            if (!launcher.querySelector(".cee-assistant-launcher-icon svg")) errors.push("falta la mascota gatito del Asistente CEE");
            if (launcher.querySelector(".cee-assistant-launcher-icon svg") &&
                getComputedStyle(launcher.querySelector(".cee-assistant-launcher-icon svg")).animationName !== "cee-cat-float" &&
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              errors.push("la mascota no tiene la animación flotante esperada");
            }
          }
          return errors;
        });
        for (const error of assistantChecks) failures.push(`${viewport.name} ${route}: asistente/efectos: ${error}`);

        // Comprueba que el buscador devuelve páginas reales y gestiona búsquedas sin resultados.
        if (route === "pages/buscar.html") {
          const searchInput = page.locator("#site-search");
          await searchInput.fill("proyecto");
          await page.waitForFunction(() => document.querySelectorAll("#search-results a").length > 0, null, { timeout: 5000 });
          const hasProject = await page.locator("#search-results").innerText();
          if (!/Proyecto y ejes/i.test(hasProject)) failures.push(`${viewport.name} ${route}: el buscador no encuentra el proyecto`);
          await searchInput.fill("cee-audit-sin-resultados-xyz");
          const noResults = await page.locator("#search-status").innerText();
          if (!/No encontramos resultados/i.test(noResults)) failures.push(`${viewport.name} ${route}: no informa correctamente una búsqueda vacía`);
        }
        const item = {
          route, viewport: viewport.name, status: response?.status() ?? null,
          ...layout, pageErrors,
          accessibility: {
            violations: axe.violations.length,
            impactCounts: axe.violations.reduce((counts, violation) => {
              counts[violation.impact || "unknown"] = (counts[violation.impact || "unknown"] || 0) + 1;
              return counts;
            }, {}),
            details: axe.violations.map(violation => ({
              id: violation.id, impact: violation.impact, description: violation.description,
              help: violation.help, nodeCount: violation.nodes.length,
              nodes: violation.nodes.map(node => ({ target: node.target, html: node.html, failureSummary: node.failureSummary }))
            }))
          }
        };
        results.push(item);
        const expectedStatus = 200;
        if (response?.status() !== expectedStatus) failures.push(`${viewport.name} ${route}: expected HTTP ${expectedStatus}, got ${response?.status()}`);
        if (route === "404.html" && !/Página no encontrada/i.test(layout.title)) failures.push(`${viewport.name} 404.html: el título no identifica la página no encontrada`);
        if (layout.documentWidth > layout.viewportWidth + 1) failures.push(`${viewport.name} ${route}: horizontal overflow ${layout.documentWidth}px > ${layout.viewportWidth}px`);
        if (layout.mainCount !== 1) failures.push(`${viewport.name} ${route}: expected one main landmark, found ${layout.mainCount}`);
        if (pageErrors.length) failures.push(`${viewport.name} ${route}: JavaScript page errors: ${pageErrors.join("; ")}`);
        if (axe.violations.length) failures.push(`${viewport.name} ${route}: ${axe.violations.length} violaciones de accesibilidad (${axe.violations.map(v => v.id).join(", ")})`);
      } catch (error) {
        failures.push(`${viewport.name} ${route}: ${error.message}`);
        results.push({ route, viewport: viewport.name, error: error.message });
      }
      page.removeAllListeners("pageerror");
    }
    await context.close();
  }
  // Prueba real del endpoint Gemini en el Preview: una consulta del proyecto y otra fuera de alcance.
  const assistantTests = [
    {
      name: "five-axes",
      question: "¿Cuáles son los cinco ejes del proyecto CEE 2027?",
      expectedTopic: /ambiente|sustentabilidad/i
    },
    {
      name: "team-members-and-roles",
      question: "¿Quiénes integran la lista y qué cargos ocupa cada persona?",
      expectedTopic: /lista|integrantes|cargo|publicad|información/i
    },
    {
      name: "agenda-and-dates",
      question: "¿Qué fechas y actividades aparecen en la agenda de la candidatura?",
      expectedTopic: /agenda|noviembre|diciembre|fecha|calendario/i
    },
    {
      name: "transparency",
      question: "¿Qué información, actas o informes de transparencia están publicados?",
      expectedTopic: /transparencia|actas|informes|documentos/i
    },
    {
      name: "student-audience",
      question: "Soy estudiante: ¿cómo puedo participar, hacer propuestas o comunicar una inquietud?",
      expectedTopic: /particip|propuesta|voz|escucha|estudiant/i
    },
    {
      name: "teacher-audience",
      question: "Soy profesor: ¿qué información institucional de la candidatura puedo consultar en esta web?",
      expectedTopic: /web|cee|información|documentos|propuesta|agenda/i
    },
    {
      name: "out-of-scope",
      question: "¿Cuál es la capital de Francia?",
      expectedTopic: /cee 2027|web|sitio|asistente/i
    }
  ];
  for (const test of assistantTests) {
    try {
      const response = await fetch(new URL("api/asistente", base), { method: "POST", headers: { "Content-Type": "application/json", "Origin": new URL(base).origin }, body: JSON.stringify({ question: test.question }), signal: AbortSignal.timeout(55000) });
      const payload = await response.json().catch(() => ({}));
      const answer = typeof payload?.answer === "string" ? payload.answer.trim() : "";
      const answerMatchesExpectedTopic = test.expectedTopic.test(answer);
      const valid = response.ok && payload?.provider === "gemini" && answer.length > 0 &&
        answerMatchesExpectedTopic && !Object.hasOwn(payload || {}, "sources");
      assistantResults.push({
        name: test.name, status: response.status, provider: payload?.provider || null,
        answerPresent: answer.length > 0, answerMatchesExpectedTopic,
        answerLength: answer.length, sourceMetadataExposed: Object.hasOwn(payload || {}, "sources"),
        code: payload?.code || null, passed: valid
      });
      if (!valid) failures.push("Gemini Preview " + test.name + ": HTTP " + response.status +
        ", provider " + (payload?.provider || "none") + ", topicMatch " + answerMatchesExpectedTopic +
        ", code " + (payload?.code || "none"));
    } catch (error) {
      assistantResults.push({ name: test.name, passed: false, error: error.message });
      failures.push("Gemini Preview " + test.name + ": " + error.message);
    }
  }

  // Capturas para revisión visual manual de las cuatro páginas principales en móvil, tablet y escritorio.
  const screenshotRoutes = [{ name: "home", route: "" }, { name: "lista", route: "pages/lista.html" }, { name: "proyecto", route: "pages/proyecto.html" }, { name: "escucha", route: "pages/escucha.html" }];
  const screenshotViewports = [
    { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
    { name: "tablet", width: 768, height: 900, isMobile: false, hasTouch: false },
    { name: "desktop", width: 1280, height: 900, isMobile: false, hasTouch: false },
    { name: "wide-desktop", width: 1440, height: 900, isMobile: false, hasTouch: false }
  ];
  fs.mkdirSync("audit-results/screenshots", { recursive: true });
  for (const viewport of screenshotViewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.isMobile, hasTouch: viewport.hasTouch });
    const page = await context.newPage();
    for (const route of screenshotRoutes) {
      try {
        await page.goto(new URL(route.route, base).href, { waitUntil: "networkidle", timeout: 45000 });
        // Activa los elementos con reveal/IntersectionObserver antes de capturar la página completa.
        const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < pageHeight; y += Math.max(500, viewport.height - 120)) {
          await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
          await page.waitForTimeout(120);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
        const file = "audit-results/screenshots/" + route.name + "-" + viewport.name + ".png";
        await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
        screenshotResults.push({ page: route.name, viewport: viewport.name, file, passed: true });
      } catch (error) {
        screenshotResults.push({ page: route.name, viewport: viewport.name, passed: false, error: error.message });
        failures.push("Captura visual " + route.name + " " + viewport.name + ": " + error.message);
      }
    }
    await context.close();
  }
  const missingPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const missingResponse = await missingPage.goto(new URL("__cee_audit_missing_route__", base).href, { waitUntil: "domcontentloaded", timeout: 45000 });
  const missingTitle = await missingPage.title();
  const missingHeading = await missingPage.locator("h1").first().textContent().catch(() => "");
  if (missingResponse?.status() !== 404) failures.push(`Ruta inexistente: se esperaba HTTP 404 y se recibió ${missingResponse?.status()}`);
  if (!/Página no encontrada/i.test(missingTitle) || !/no está disponible/i.test(missingHeading || "")) failures.push("Ruta inexistente: Cloudflare Pages no mostró la página 404 personalizada");
  results.push({ route: "__cee_audit_missing_route__", viewport: "desktop", status: missingResponse?.status() ?? null, title: missingTitle, heading: missingHeading });
  await missingPage.close();
} finally {
  await browser.close();
}

fs.mkdirSync("audit-results", { recursive: true });
fs.writeFileSync("audit-results/accessibility-responsive.json", JSON.stringify({
  generatedAt: new Date().toISOString(), base, routes: routes.length, viewports: viewports.map(v => v.name),
  summary: {
    pagesTested: results.length - 1,
    missingRouteStatus: results.find(item => item.route === "__cee_audit_missing_route__")?.status ?? null,
    accessibilityViolations: results.reduce((sum, item) => sum + (item.accessibility?.violations || 0), 0),
    pagesWithAccessibilityIssues: results.filter(item => (item.accessibility?.violations || 0) > 0).length,
    geminiTestsPassed: assistantResults.filter(item => item.passed).length,
    geminiTestsTotal: assistantResults.length,
    screenshotsPassed: screenshotResults.filter(item => item.passed).length,
    screenshotsTotal: screenshotResults.length,
    failures
  },
  assistantResults,
  screenshotResults,
  results
}, null, 2));
console.log(`Responsive audit: ${results.length} page/viewport combinations; ${results.reduce((sum, item) => sum + (item.accessibility?.violations || 0), 0)} axe violations; ${failures.length} blocking failures.`);
if (failures.length) {
  for (const failure of failures) console.error(" - " + failure);
  process.exitCode = 1;
}
