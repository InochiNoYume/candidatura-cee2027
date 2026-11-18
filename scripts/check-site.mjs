import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const failures = [];
const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", "_site"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && full.endsWith(".html")) htmlFiles.push(full);
  }
}
walk(".");
const read = file => fs.readFileSync(file, "utf8");
const idsByFile = new Map();

for (const file of htmlFiles) {
  const html = read(file);
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
  const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (duplicates.length) failures.push(`${file}: IDs duplicados: ${duplicates.join(", ")}`);
  idsByFile.set(path.resolve(file), new Set(ids));
  if (!/<html\b[^>]*lang=["']es["']/i.test(html)) failures.push(`${file}: falta lang="es" en <html>`);
  if ((html.match(/<main\b/gi) || []).length !== 1) failures.push(`${file}: debe contener exactamente un <main>`);
  if (file !== "404.html") {
    for (const tag of ["header", "footer"]) {
      if ((html.match(new RegExp("<" + tag + "\\b", "gi")) || []).length !== 1)
        failures.push(`${file}: debe contener exactamente un <${tag}>`);
    }
  }

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const raw = match[1].trim();
    if (!raw || /^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(raw)) continue;
    const [pathname, fragment] = raw.split("#", 2);
    const clean = decodeURIComponent((pathname || "").split("?")[0]);
    const target = path.resolve(path.dirname(file), clean || path.basename(file));
    if (!fs.existsSync(target)) {
      failures.push(`${file}: destino local inexistente: ${raw}`);
      continue;
    }
    if (fragment && fs.statSync(target).isFile() && target.endsWith(".html")) {
      const targetIds = idsByFile.get(target) || new Set([...read(target).matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]));
      if (!targetIds.has(decodeURIComponent(fragment))) failures.push(`${file}: ancla inexistente: ${raw}`);
    }
  }
}

const requiredPages = [
  "index.html","pages/lista.html","pages/proyecto.html","pages/agenda.html",
  "pages/transparencia.html","pages/noticias.html","pages/galeria.html",
  "pages/escucha.html","pages/preguntas.html","pages/contacto.html",
  "pages/actas.html","pages/informes.html","pages/comunidad-tp.html",
  "pages/memoria.html","pages/privacidad.html","pages/buscar.html","404.html"
];
for (const file of requiredPages) if (!fs.existsSync(file)) failures.push(`Falta página requerida: ${file}`);

const navigationSource = read("js/main.js");
const requiredNavigationPages = [
  "lista.html","proyecto.html","agenda.html","transparencia.html","actas.html",
  "informes.html","memoria.html","comunidad-tp.html","noticias.html","galeria.html",
  "preguntas.html","buscar.html","contacto.html","privacidad.html","escucha.html"
];
for (const file of requiredNavigationPages) {
  if (!fs.existsSync(path.join("pages",file))) failures.push(`Menú: destino inexistente pages/${file}`);
  if (!navigationSource.includes(file)) failures.push(`Menú: falta el destino ${file} en js/main.js`);
}
for (const label of ["La candidatura","Gestión y transparencia","Comunidad estudiantil","Actualidad y recursos"]) {
  if (!navigationSource.includes(label)) failures.push(`Menú: falta la categoría "${label}"`);
}
if (!navigationSource.includes("aria-expanded") || !navigationSource.includes("Escape"))
  failures.push("Menú: faltan controles básicos de accesibilidad/teclado");
const layoutSource = read("css/layout.css");
for (const selector of [".nav-dropdown-panel",".nav-panel-items",".menu-toggle.is-open",".footer-group"]) {
  if (!layoutSource.includes(selector)) failures.push(`Estilos de navegación: falta ${selector}`);
}

for (const file of ["css/styles.css","css/layout.css","js/main.js","js/search.js","assets/icons/favicon.svg"])
  if (!fs.existsSync(file)) failures.push(`Falta recurso requerido: ${file}`);

try {
  execFileSync("node", ["--check", "js/main.js"], { stdio: "pipe" });
  execFileSync("node", ["--check", "js/search.js"], { stdio: "pipe" });
} catch (error) {
  failures.push("Error de sintaxis JavaScript: " + (error.stderr?.toString() || error.message));
}

if (failures.length) {
  console.error("SITE CHECKS FAILED");
  for (const failure of failures) console.error(" - " + failure);
  process.exit(1);
}
console.log(`SITE CHECKS PASSED: ${htmlFiles.length} HTML pages, required files, local links, anchors, unique IDs and JavaScript syntax.`);
