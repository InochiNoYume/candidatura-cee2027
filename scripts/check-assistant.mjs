import fs from "node:fs";
const failures = [];
const endpoint = fs.readFileSync("functions/api/asistente.js", "utf8");
const client = fs.readFileSync("js/main.js", "utf8");
const styles = fs.readFileSync("css/styles.css", "utf8");
const privacy = fs.readFileSync("pages/privacidad.html", "utf8");
const requiredEndpoint = [
  "env.GEMINI_API_KEY", "gemini-3.5-flash-lite", "generativelanguage.googleapis.com/v1beta/models",
  "tools: [{ url_context: {} }]", "function selectSources(question)", "MAX_ANSWER_WORDS = 130",
  "maxOutputTokens: MAX_OUTPUT_TOKENS", "question.length > 500", "getRetrievedSources(candidate, selectedPaths, siteOrigin)",
  'Gemini devolvió un error HTTP ' ,
  'Gemini no encontró el modelo configurado (HTTP 404)',
  "pages/comunidad-tp.html", "pages/buscar.html", "requestWindows.size > 1000",
  "const OUT_OF_SCOPE_MESSAGES = [", "const FALLBACK_SOURCE_PAGES = [",
  "function outOfScopeMessage()", "const hasSiteSignal = SITE_TERMS.some(term => matchesTerm(normalized, term))",
  "if (!hasSiteSignal) return [...FALLBACK_SOURCE_PAGES]",
  "Evalúa el SENTIDO de la pregunta, no solo sus palabras exactas",
  "Solo marca out_of_scope cuando la consulta sea claramente ajena",
  "Incluso las preguntas sin palabras clave del sitio pasan por Gemini",
  "function normalizeSourcePath(value, siteOrigin)", "decodeURIComponent(url.pathname)",
  "const allowed = new Set(selectedPaths.map(path => normalizeSourcePath(path, siteOrigin)))",
  "const canonicalUrl = path === \"/\" ? siteOrigin + \"/\" : siteOrigin + path"
];
for (const item of requiredEndpoint) if (!endpoint.includes(item)) failures.push("Function: falta " + item);
for (const item of [
  'fetch("/api/asistente"', 'maxlength="500"', "addAssistantSources(payload.sources)",
  "url.origin !== window.location.origin", "message.textContent = text", "No compartas datos personales"
]) if (!client.includes(item)) failures.push("Cliente: falta " + item);
if (!styles.includes(".cee-assistant-panel") || !styles.includes(".cee-assistant-sources") || !styles.includes("prefers-reduced-motion: reduce")) failures.push("CSS: falta estilo del asistente, fuentes o movimiento reducido.");
if (!privacy.includes("Google Gemini API") || !privacy.includes("ai.google.dev/gemini-api/terms") || !privacy.includes("contexto de URL")) failures.push("Privacidad: falta explicar Gemini URL Context y sus condiciones.");
if (endpoint.includes("if (!selectedPaths.length) return json({ answer:")) failures.push("El filtro local no debe rechazar preguntas antes de que Gemini interprete su contexto.");
if (!/OUT_OF_SCOPE_MESSAGES\\s*=\\s*\\[/.test(endpoint) || !endpoint.includes("outOfScopeMessage()")) failures.push("Faltan mensajes alternativos de alcance.");
if (/localStorage|sessionStorage/.test(client)) failures.push("El asistente no debe guardar conversaciones en el navegador.");
if (/GROQ_API_KEY|api.groq.com|GroqCloud/.test(endpoint + privacy)) failures.push("Quedó una referencia activa a Groq.");
if (failures.length) { console.error("ASSISTANT CHECKS FAILED"); failures.forEach(x => console.error(" - " + x)); process.exit(1); }
console.log("ASSISTANT CHECKS PASSED: Gemini URL Context, page routing, source links, detailed summaries, privacy and safe rendering.");
