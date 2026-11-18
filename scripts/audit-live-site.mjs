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
              selectors: violation.nodes.slice(0, 5).map(node => node.target)
            }))
          }
        };
        results.push(item);
        if (!response?.ok()) failures.push(`${viewport.name} ${route}: HTTP ${response?.status()}`);
        if (layout.documentWidth > layout.viewportWidth + 1) failures.push(`${viewport.name} ${route}: horizontal overflow ${layout.documentWidth}px > ${layout.viewportWidth}px`);
        if (layout.mainCount !== 1) failures.push(`${viewport.name} ${route}: expected one main landmark, found ${layout.mainCount}`);
        if (pageErrors.length) failures.push(`${viewport.name} ${route}: JavaScript page errors: ${pageErrors.join("; ")}`);
      } catch (error) {
        failures.push(`${viewport.name} ${route}: ${error.message}`);
        results.push({ route, viewport: viewport.name, error: error.message });
      }
      page.removeAllListeners("pageerror");
    }
    await context.close();
  }
} finally {
  await browser.close();
}

fs.mkdirSync("audit-results", { recursive: true });
fs.writeFileSync("audit-results/accessibility-responsive.json", JSON.stringify({
  generatedAt: new Date().toISOString(), base, routes: routes.length, viewports: viewports.map(v => v.name),
  summary: {
    pagesTested: results.length,
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
