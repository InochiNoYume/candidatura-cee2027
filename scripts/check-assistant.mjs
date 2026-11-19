import fs from "node:fs";
const failures = [];
const endpoint = fs.readFileSync("functions/api/asistente.js", "utf8");
const client = fs.readFileSync("js/main.js", "utf8");
const styles = fs.readFileSync("css/styles.css", "utf8");
const privacy = fs.readFileSync("pages/privacidad.html", "utf8");
const readme = fs.readFileSync("README.md", "utf8");
const functionReadme = fs.readFileSync("functions/README.md", "utf8");
const requiredEndpoint = [
  "env.GEMINI_API_KEY", "gemini-3.5-flash-lite",
  "generativelanguage.googleapis.com/v1beta/models", "tools: [{ url_context: {} }]",
  "function selectSources(question)", "MAX_ANSWER_WORDS = 130",
  "ÍNDICE COMPLETO DE PÁGINAS OFICIALES", "PÁGINAS PRIORITARIAS PARA ESTA PREGUNTA",
  "pathname.replace(/\\.html$/i, \"\")", "const allSourceUrls = SOURCE_PAGES.map(toPublicUrl)",
  "maxOutputTokens: MAX_OUTPUT_TOKENS", "question.length > 500",
  "getRetrievedSources(candidate, selectedPaths, siteOrigin)",
  "pages/comunidad-tp.html", "pages/buscar.html", "requestWindows.size > 1000",
  "const OUT_OF_SCOPE_MESSAGES = [", "const FALLBACK_SOURCE_PAGES = [",
  "function outOfScopeMessage()", "async function fetchGeminiWithRetry",
  "GEMINI_TIMEOUT_MS = 20000", "PROVIDER_ATTEMPTS = 2",
  "TRANSIENT_GEMINI_STATUSES", "AbortSignal.timeout(GEMINI_TIMEOUT_MS)",
  "responseSchema:", "GEMINI_SOURCES_UNAVAILABLE",
  "CEE assistant request completed", "Gemini response validation failed"
];
for (const status of [400,401,403,404,408,413,415,429,500,502,503,504]) {
  if (!client.includes(status + ":")) failures.push("El cliente debe tener un mensaje de respaldo para HTTP " + status + ".");
}
if (!client.includes("fallbackErrors")) failures.push("El cliente debe traducir los errores HTTP a mensajes claros.");
for (const item of requiredEndpoint) if (!endpoint.includes(item)) failures.push("Function: falta " + item);
for (const item of [
  'fetch("/api/asistente"', 'maxlength="500"', "addAssistantSources(payload.sources)",
  "url.origin !== window.location.origin", "const sourcePath = url.pathname.replace(", "renderAssistantText(message,text,isUser)",
  "No compartas datos personales", "fallbackErrors"
]) if (!client.includes(item)) failures.push("Cliente: falta " + item);
if (!styles.includes(".cee-assistant-panel") || !styles.includes(".cee-assistant-sources") || !styles.includes("prefers-reduced-motion: reduce")) failures.push("CSS: falta estilo del asistente, fuentes o movimiento reducido.");
if (!privacy.includes("Google Gemini API") || !privacy.includes("ai.google.dev/gemini-api/terms") || !privacy.includes("contexto de URL")) failures.push("Privacidad: falta explicar Gemini URL Context y sus condiciones.");
if (/localStorage|sessionStorage/.test(client)) failures.push("El asistente no debe guardar conversaciones en el navegador.");
if (!readme.includes("únicamente Google Gemini") || !functionReadme.includes("exclusivamente Gemini")) failures.push("La documentación debe indicar que Gemini es el único proveedor.");
if (failures.length) { console.error("ASSISTANT CHECKS FAILED"); failures.forEach(x => console.error(" - " + x)); process.exit(1); }
console.log("ASSISTANT CHECKS PASSED: Gemini-only, URL Context, retry limits, response validation, source routing, privacy and safe rendering.");
