import fs from "node:fs";
const failures = [];
const endpoint = fs.readFileSync("functions/api/asistente.js", "utf8");
const client = fs.readFileSync("js/main.js", "utf8");
const styles = fs.readFileSync("css/styles.css", "utf8");
const privacy = fs.readFileSync("pages/privacidad.html", "utf8");
for (const [label, pattern] of [
  ["Gemini API secret", /env\.GEMINI_API_KEY/],
  ["modelo Gemini Flash-Lite", /gemini-3\.5-flash-lite/],
  ["endpoint Gemini", /generativelanguage\.googleapis\.com\/v1beta\/models/],
  ["clave en cabecera servidor", /"x-goog-api-key": env\.GEMINI_API_KEY/],
  ["filtro de alcance", /out_of_scope/],
  ["ámbito web", /ÁMBITO:/],
  ["respuesta fija fuera de alcance", /especializado exclusivamente en la información de esta página web/],
  ["JSON estructurado", /responseMimeType: "application\/json"[\s\S]*responseSchema:/],
  ["límite de tokens", /maxOutputTokens: MAX_OUTPUT_TOKENS/],
  ["validación de origen", /request\.headers\.get\("Origin"\)/],
  ["límite de caracteres", /question\.length > 300/],
  ["máximo de 55 palabras", /slice\(0, 55\)/],
  ["límite de cuerpo en bytes", /new TextEncoder\(\)\.encode\(rawBody\)\.byteLength > 2048/],
  ["límite de mapa", /requestWindows\.size > 1000/]
]) if (!pattern.test(endpoint)) failures.push("Function: falta " + label);
for (const [label, pattern] of [
  ["interfaz", /cee-assistant-launcher/],
  ["endpoint del navegador", /fetch\("\/api\/asistente"/],
  ["máximo de entrada", /maxlength="300"/i],
  ["renderizado seguro", /message\.textContent\s*=\s*text/],
  ["aviso de privacidad", /No compartas datos personales/],
  ["efecto pointer", /addEventListener\("pointermove"/]
]) if (!pattern.test(client)) failures.push("Cliente: falta " + label);
for (const [label, pattern] of [
  ["movimiento reducido", /prefers-reduced-motion:\s*reduce/],
  ["panel adaptable", /\.cee-assistant-panel/],
  ["canvas no bloquea interacción", /\.cee-pointer-trail\s*\{[^}]*pointer-events:\s*none/s]
]) if (!pattern.test(styles)) failures.push("CSS: falta " + label);
if (!/Google Gemini API/.test(privacy) || !/Google AI Studio/.test(privacy)) failures.push("Privacidad: falta explicar Gemini y enlazar sus condiciones de datos.");
if (/localStorage|sessionStorage/.test(client)) failures.push("El asistente no debe guardar conversaciones en el navegador.");
if (/GROQ_API_KEY|api\.groq\.com|GroqCloud/.test(endpoint + privacy)) failures.push("Quedó una referencia activa a Groq en la Function o privacidad.");
if (failures.length) { console.error("ASSISTANT CHECKS FAILED"); failures.forEach(x => console.error(" - " + x)); process.exit(1); }
console.log("ASSISTANT CHECKS PASSED: Gemini, token budget, scope guard, privacy and safe rendering.");
