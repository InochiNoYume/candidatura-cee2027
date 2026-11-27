import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const failures = [];
const htmlFiles = [];
const voidTags = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
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
const pagesRoutes = JSON.parse(read("_routes.json"));
if (pagesRoutes.version !== 1 || !pagesRoutes.include?.includes("/*")) {
  failures.push("Cloudflare Pages: _routes.json debe incluir las rutas dinámicas del sitio.");
}
for (const route of ["/assets/*", "/css/*", "/js/*", "/robots.txt", "/sitemap.xml"]) {
  if (!pagesRoutes.exclude?.includes(route)) failures.push(`Cloudflare Pages: falta excluir el recurso estático ${route} de las invocaciones de Functions.`);
}
const idsByFile = new Map();

function checkBalanced(source, file, pairs, label) {
  let quote = "", escaped = false, comment = false;
  const stack = [];
  for (let i = 0; i < source.length; i++) {
    const c = source[i], next = source[i + 1];
    if (comment) {
      if (c === "*" && next === "/") { comment = false; i++; }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === quote) quote = "";
      continue;
    }
    if (c === "/" && next === "*") { comment = true; i++; continue; }
    if (c === "'" || c === '"' || c === "`") { quote = c; continue; }
    if (pairs.open.has(c)) stack.push({ char:c, line:source.slice(0,i).split("\n").length });
    else if (pairs.close.has(c)) {
      const last = stack.pop();
      if (!last || pairs.close.get(c) !== last.char) {
        failures.push(`${file}: ${label} delimitador "${c}" inesperado en línea ${source.slice(0,i).split("\n").length}`);
        return;
      }
    }
  }
  if (comment) failures.push(`${file}: comentario CSS sin cerrar`);
  if (quote) failures.push(`${file}: cadena sin cerrar`);
  if (stack.length) failures.push(`${file}: ${label} sin cerrar desde línea ${stack.at(-1).line}`);
}

for (const file of htmlFiles) {
  const html = read(file);
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
  const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (duplicates.length) failures.push(`${file}: IDs duplicados: ${duplicates.join(", ")}`);
  idsByFile.set(path.resolve(file), new Set(ids));
  if (!/<html\b[^>]*lang=["']es["']/i.test(html)) failures.push(`${file}: falta lang="es" en <html>`);
  if (!/<meta\b[^>]*name=["']viewport["']/i.test(html)) failures.push(`${file}: falta meta viewport responsive`);
  if ((html.match(/<main\b/gi) || []).length !== 1) failures.push(`${file}: debe contener exactamente un <main>`);
  if (!["403.html", "404.html", "500.html", "maintenance.html"].includes(path.basename(file))) {
    for (const tag of ["header", "footer"]) {
      if ((html.match(new RegExp("<" + tag + "\\b", "gi")) || []).length !== 1)
        failures.push(`${file}: debe contener exactamente un <${tag}>`);
    }
    if (!/<button\b[^>]*class=["'][^"']*\bmenu-toggle\b/i.test(html)) failures.push(`${file}: falta botón del menú móvil`);
    if (!/<nav\b[^>]*id=["']site-nav["']/i.test(html)) failures.push(`${file}: falta navegación #site-nav`);
    if (!/<script(?=[^>]*src=["'][^"']*main[.]js["'])(?=[^>]*defer)[^>]*>/i.test(html)) failures.push(`${file}: main.js debe cargarse con defer`);
  }
  const tagStack = [];
  for (const match of html.matchAll(/<!--[\s\S]*?-->|<![^>]*>|<\/?([a-z][\w:-]*)\b[^>]*>/gi)) {
    const token = match[0];
    if (token.startsWith("<!") || token.startsWith("<!--")) continue;
    const name = match[1].toLowerCase();
    if (token.startsWith("</")) {
      const open = tagStack.pop();
      if (!open || open.name !== name) {
        failures.push(`${file}: cierre HTML inesperado </${name}> (se esperaba ${open ? "</"+open.name+">" : "ninguno"})`);
        break;
      }
    } else if (!voidTags.has(name) && !/\/\s*>$/.test(token)) {
      tagStack.push({name});
    }
  }
  if (tagStack.length) failures.push(`${file}: etiqueta HTML sin cerrar <${tagStack.at(-1).name}>`);
  for (const image of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(image[1])) failures.push(`${file}: imagen sin atributo alt`);
  }
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const raw = match[1].trim();
    if (!raw) continue;
    if (raw.startsWith("#")) {
      let fragment;
      try { fragment = decodeURIComponent(raw.slice(1)); }
      catch { failures.push(`${file}: ancla local mal codificada: ${raw}`); continue; }
      if (fragment && !idsByFile.get(path.resolve(file)).has(fragment))
        failures.push(`${file}: ancla local inexistente: ${raw}`);
      continue;
    }
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
    const [pathname, fragment] = raw.split("#", 2);
    let clean;
    try { clean = decodeURIComponent((pathname || "").split("?")[0]); }
    catch { failures.push(`${file}: URL local mal codificada: ${raw}`); continue; }
    const target = path.resolve(clean.startsWith("/") ? "." : path.dirname(file), clean.replace(/^\/+/, "") || path.basename(file));
    if (!fs.existsSync(target)) {
      failures.push(`${file}: destino local inexistente: ${raw}`);
      continue;
    }
    if (fragment && fs.statSync(target).isFile() && target.endsWith(".html")) {
      const targetIds = idsByFile.get(target) || new Set([...read(target).matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]));
      let decodedFragment;
      try { decodedFragment = decodeURIComponent(fragment); }
      catch { failures.push(`${file}: ancla mal codificada: ${raw}`); continue; }
      if (!targetIds.has(decodedFragment)) failures.push(`${file}: ancla inexistente: ${raw}`);
    }
  }
}

const requiredPages = [
  "index.html","pages/lista.html","pages/proyecto.html","pages/agenda.html",
  "pages/transparencia.html","pages/noticias.html","pages/galeria.html",
  "pages/escucha.html","pages/preguntas.html","pages/contacto.html",
  "pages/actas.html","pages/informes.html","pages/comunidad-tp.html",
  "pages/memoria.html","pages/terminos-privacidad.html","pages/buscar.html","404.html"
];
for (const file of requiredPages) if (!fs.existsSync(file)) failures.push(`Falta página requerida: ${file}`);

/* Regresión del asistente Gemini: cobertura de secciones, variantes del filtro y página 404. */
const assistantSource = read("functions/api/asistente.js");
for (const term of ['"ejes"', '"elecciones"']) {
  if (!assistantSource.includes(term)) failures.push(`Asistente Gemini: falta reconocer la variante ${term}`);
}
if (/return\s+\[\.\.\.selected\]\.slice\(0,\s*10\)/.test(assistantSource))
  failures.push("Asistente Gemini: el límite de diez páginas deja fuera secciones de la web.");
const sourceInventory = assistantSource.match(/const SOURCE_PAGES = \[([\s\S]*?)\];/);
if (!sourceInventory || (sourceInventory[1].match(/\.html/g) || []).length !== 16)
  failures.push("Asistente Gemini: el inventario de fuentes debe contener las 16 páginas públicas.");
if (!sourceInventory?.[1].includes("pages/terminos-privacidad.html") || sourceInventory?.[1].includes("pages/privacidad.html"))
  failures.push("Asistente Gemini: debe usar la página canónica de términos y privacidad, no la ruta antigua.");
if (!/toda la web|resumen general|que ofrece esta web/.test(assistantSource))
  failures.push("Asistente Gemini: falta reconocer consultas generales sobre toda la web.");
if (!/<script\b(?=[^>]*src=["']js\/main\.js["'])(?=[^>]*defer)[^>]*>/i.test(read("404.html")))
  failures.push("Página 404: debe cargar main.js para mostrar el asistente global.");


const errorPages = [
  ["403.html", "Acceso no autorizado"],
  ["404.html", "Página no encontrada"],
  ["500.html", "Error del servidor"]
];
for (const [file, expectedTitle] of errorPages) {
  const html = read(file);
  if (!html.toLowerCase().includes(expectedTitle.toLowerCase())) failures.push(`${file}: falta el mensaje principal esperado`);
  if (!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) failures.push(`${file}: debe impedir la indexación`);
}
 
const maintenancePage = read("maintenance.html");
if (!maintenancePage.includes("Estamos trabajando para volver pronto.") ||
    !maintenancePage.includes('name="robots" content="noindex,nofollow"') ||
    !maintenancePage.includes("¿Crees que esto es un error?") ||
    !maintenancePage.includes("Instagram oficial de la candidatura") ||
    !maintenancePage.includes("https://www.instagram.com/candidatura_cee2027.ceat/") ||
    maintenancePage.includes("Correo de la candidatura") ||
    maintenancePage.includes("Próximamente") ||
    maintenancePage.includes("ceat.liceomh") ||
    maintenancePage.includes("mailto:")) {
  failures.push("Mantenimiento: falta el mensaje principal, noindex o el canal oficial actualizado de la candidatura.");
}

const listPage = read("pages/lista.html");
const projectPage = read("pages/proyecto.html");
const faqPage = read("pages/preguntas.html");
const homePage = read("index.html");
const contactPage = read("pages/contacto.html");
const escuchaPage = read("pages/escucha.html");
const officialInstagram = "https://www.instagram.com/candidatura_cee2027.ceat/";
const officialForm = "https://forms.gle/98kiwQV8nJ6j6F3B6";
if (!contactPage.includes(officialInstagram) || contactPage.includes("Enlace pendiente de confirmación") || contactPage.includes("mailto:") || contactPage.includes("Correo de la candidatura"))
  failures.push("Contacto: Instagram oficial debe estar publicado y no debe aparecer un correo de candidatura.");
if (!escuchaPage.includes(officialForm) || !escuchaPage.includes("Formulario oficial disponible") || escuchaPage.includes("Formulario externo pendiente de enlace"))
  failures.push("CEAT Te Escucha: debe enlazar el formulario oficial confirmado.");
if (!read("404.html").includes("pages/contacto.html"))
  failures.push("404: debe ofrecer acceso a la página de contacto.");
if (!listPage.includes("Agustina Pérez") || listPage.includes("Agustina Almirón") || !listPage.includes('<span class="role">Presidenta</span><h3>Agustina Pérez</h3>') || !listPage.includes('aria-label="Rango 8 de 8"') || !listPage.includes('★★★★★★★★'))
  failures.push("La tarjeta pública debe respetar el nombre confirmado de la presidenta (Agustina Pérez) y el sistema de estrellas de rango (8 de 8).");
if (!projectPage.includes("Eje complementario") || !projectPage.includes("Los ejes 1 al 4 corresponden"))
  failures.push("Proyecto: el eje 5 debe estar identificado como complementario y separado de los cuatro ejes oficiales.");
if (!faqPage.includes("cuatro ejes") || !faqPage.includes("quinto eje complementario"))
  failures.push("Preguntas frecuentes: debe distinguir los cuatro ejes oficiales del quinto complementario.");
if (!homePage.includes("04 + 01") || !homePage.includes("Cuatro ejes oficiales y uno complementario"))
  failures.push("Inicio: debe mostrar cuatro ejes oficiales y uno complementario.");

const navigationSource = read("js/main.js");
if (!navigationSource.includes("split(/" + String.fromCharCode(92) + "s+/)"))
  failures.push("Filtros: la separación de categorías debe usar espacios en blanco correctamente.");
const requiredNavigationPages = [
  "lista.html","proyecto.html","agenda.html","transparencia.html","actas.html",
  "informes.html","memoria.html","comunidad-tp.html","noticias.html","galeria.html",
  "preguntas.html","buscar.html","contacto.html","terminos-privacidad.html","escucha.html"
];
for (const file of requiredNavigationPages) {
  if (!fs.existsSync(path.join("pages",file))) failures.push(`Menú: destino inexistente pages/${file}`);
  if (!navigationSource.includes(file)) failures.push(`Menú: falta el destino ${file} en js/main.js`);
}
for (const label of ["La candidatura","Gestión y transparencia","Comunidad estudiantil","Actualidad y recursos"]) {
  if (!navigationSource.includes(label)) failures.push(`Menú: falta la categoría "${label}"`);
}
for (const token of ['nav.classList.toggle("open")','document.body.classList.toggle("menu-open",opened)','document.body.classList.remove("menu-open")','menuButton.setAttribute("aria-expanded",String(opened))','event.key === "Escape"']) {
  if (!navigationSource.includes(token)) failures.push(`Menú: falta comportamiento requerido ${token}`);
}

const layoutSource = read("css/layout.css");
for (const selector of [".nav-dropdown-panel",".nav-panel-items",".menu-toggle.is-open",".footer-group","body.menu-open",".site-footer .footer-links"]) {
  if (!layoutSource.includes(selector)) failures.push(`Estilos de navegación: falta ${selector}`);
}
if (!/\.site-header \.menu-toggle span\s*\{[^}]*margin:\s*0\s*!important/s.test(layoutSource))
  failures.push("Menú móvil: falta neutralizar los márgenes heredados de las barras del icono");
if (!/\.site-header \.menu-toggle span\s*\{[^}]*flex:\s*0 0 2px\s*!important/s.test(layoutSource))
  failures.push("Menú móvil: las tres barras no tienen altura fija");
if (!/@media\s*\(max-width:\s*1240px\)[\s\S]*?\.menu-toggle\s*\{[^}]*display:\s*flex\s*!important/s.test(layoutSource))
  failures.push("Menú móvil: falta mostrar el botón bajo 1240px");

for (const file of ["css/styles.css","css/layout.css"]) {
  const source = read(file);
  checkBalanced(source, file, {open:new Set(["{","(","["]),close:new Map([["}","{"],[")","("],["]","["]])}, "CSS");
}
for (const file of ["css/styles.css","css/layout.css","js/main.js","js/search.js","assets/icons/favicon.svg"])
  if (!fs.existsSync(file)) failures.push(`Falta recurso requerido: ${file}`);

try {
  execFileSync("node", ["--check", "js/main.js"], { stdio: "pipe" });
  execFileSync("node", ["--check", "js/search.js"], { stdio: "pipe" });
  execFileSync("node", ["--check", "scripts/check-site.mjs"], { stdio: "pipe" });
} catch (error) {
  failures.push("Error de sintaxis JavaScript: " + (error.stderr?.toString() || error.message));
}


/* Auditoría ampliada: metadatos, accesibilidad básica, recursos CSS y rutas del menú dinámico. */
for (const file of htmlFiles) {
  const html = read(file);
  if (!/<title>\s*[^<]+<\/title>/i.test(html)) failures.push(`${file}: falta un título de página`);
  if (file !== "404.html" && !/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+["']/i.test(html))
    failures.push(`${file}: falta una meta description`);
  if (file !== "404.html" && !/<a\b[^>]*class=["'][^"']*skip-link[^"']*["'][^>]*href=["']#contenido["']/i.test(html))
    failures.push(`${file}: falta el enlace para saltar al contenido`);
  if (!["403.html", "404.html", "500.html", "maintenance.html"].includes(path.basename(file)) && !/<button\b[^>]*class=[^>]*menu-toggle[^>]*aria-expanded=["']false["'][^>]*aria-controls=["']site-nav["']/i.test(html))
    failures.push(`${file}: botón de menú sin estado ARIA inicial o controles`);
  for (const link of html.matchAll(/<a\b([^>]*?)>/gi)) {
    const attrs = link[1];
    if (/target=["']_blank["']/i.test(attrs) && !/rel=["'][^"']*noopener/i.test(attrs))
      failures.push(`${file}: enlace target="_blank" sin rel="noopener"`);
  }
}

/* Comprueba también recursos locales referenciados desde CSS. */
for (const file of ["css/styles.css","css/layout.css"]) {
  const css = read(file);
  for (const match of css.matchAll(/url\(\s*["']?([^"'\)]+)["']?\s*\)/gi)) {
    const raw = match[1].trim();
    if (!raw || /^(?:https?:|data:|#)/i.test(raw)) continue;
    const target = path.resolve(path.dirname(file), raw.split("?")[0]);
    if (!fs.existsSync(target)) failures.push(`${file}: recurso CSS inexistente: ${raw}`);
  }
}

/* Las rutas que genera JavaScript no aparecen como enlaces estáticos en el HTML. */
for (const match of navigationSource.matchAll(/item\(["']([^"']+)["']/g)) {
  const destination = match[1];
  const [page, fragment] = destination.split("#", 2);
  const target = path.resolve("pages", page);
  if (!fs.existsSync(target)) {
    failures.push(`Menú dinámico: destino inexistente ${destination}`);
  } else if (fragment && target.endsWith(".html")) {
    const targetIds = new Set([...read(target).matchAll(/\bid=["']([^"']+)["']/g)].map(item => item[1]));
    if (!targetIds.has(fragment)) failures.push(`Menú dinámico: ancla inexistente ${destination}`);
  }
}

/* Rendimiento de imágenes y búsqueda tolerante a tildes. */
for (const file of ["pages/galeria.html","pages/proyecto.html"]) {
  const html = read(file);
  for (const image of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\bloading=["']lazy["']/i.test(image[1])) failures.push(`${file}: imagen de contenido sin loading="lazy"`);
    if (!/\bdecoding=["']async["']/i.test(image[1])) failures.push(`${file}: imagen de contenido sin decoding="async"`);
  }
}
const searchSource = read("js/search.js");
if (!searchSource.includes('.normalize("NFD")') || !searchSource.includes("0300") || !searchSource.includes("036f"))
  failures.push("Buscador: falta normalización de tildes para búsquedas más flexibles");

if (failures.length) {
  console.error("SITE CHECKS FAILED");
  for (const failure of failures) console.error(" - " + failure);
  process.exit(1);
}
console.log(`SITE CHECKS PASSED: ${htmlFiles.length} HTML pages, balanced HTML/CSS, mobile navigation, responsive metadata, image alt text, unique IDs, local links/anchors and JavaScript syntax.`);
