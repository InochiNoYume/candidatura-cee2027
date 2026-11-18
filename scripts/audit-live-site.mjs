import fs from "node:fs";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = "https://inochinoyume.github.io/Web-CEE2027/";
const routes = [
  "", "pages/lista.html", "pages/proyecto.html", "pages/agenda.html",
  "pages/transparencia.html", "pages/noticias.html", "pages/galeria.html",
  "pages/escucha.html", "pages/preguntas.html", "pages/contacto.html",
  "pages/actas.html", "pages/informes.html", "pages/comunidad-tp.html",
  "pages/memoria.html", "pages/privacidad.html", "pages/buscar.html", "404.html"
];
const viewports = [
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false, hasTouch: false }
];
const browser = await chromium.launch({ headless: true });
const results = [];
const failures = [];

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
        await page.waitForTimeout(250);
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
              help: violation.help, nodes: violation.nodes.length,
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
  const missingPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const missingResponse = await missingPage.goto(new URL("__cee_audit_missing_route__", base).href, { waitUntil: "domcontentloaded", timeout: 45000 });
  const missingTitle = await missingPage.title();
  const missingHeading = await missingPage.locator("h1").first().textContent().catch(() => "");
  if (missingResponse?.status() !== 404) failures.push(`Ruta inexistente: se esperaba HTTP 404 y se recibió ${missingResponse?.status()}`);
  if (!/Página no encontrada/i.test(missingTitle) || !/no está disponible/i.test(missingHeading || "")) failures.push("Ruta inexistente: GitHub Pages no mostró la página 404 personalizada");
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
    failures
  },
  results
}, null, 2));
console.log(`Responsive audit: ${results.length} page/viewport combinations; ${results.reduce((sum, item) => sum + (item.accessibility?.violations || 0), 0)} axe violations; ${failures.length} blocking failures.`);
if (failures.length) {
  for (const failure of failures) console.error(" - " + failure);
  process.exitCode = 1;
}
