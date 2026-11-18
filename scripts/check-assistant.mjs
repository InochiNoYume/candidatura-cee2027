import fs from "node:fs";
const failures = [];
const endpoint = fs.readFileSync("functions/api/asistente.js", "utf8");
const client = fs.readFileSync("js/main.js", "utf8");
const styles = fs.readFileSync("css/styles.css", "utf8");
const privacy = fs.readFileSync("pages/privacidad.html", "utf8");
for (const [label, pattern] of [
  ["Groq API secret", /env\.GROQ_API_KEY/],
  ["modelo GPT OSS 20B", /openai\/gpt-oss-20b/],
  ["endpoint Groq", /api\.groq\.com\/openai\/v1\/chat\/completions/],
  ["clave en cabecera servidor", /"Authorization": "Bearer " \+ env\.GROQ_API_KEY/],
  ["filtro de alcance", /out_of_scope/],
  ["ámbito web", /ÁMBITO:/],
  ["respuesta fija fuera de alcance", /especializado exclusivamente en la información de esta página web/],
  ["JSON Schema estricto", /type: "json_schema"[\s\S]*strict: true/],
  ["límite de tokens", /max_completion_tokens: MAX_OUTPUT_TOKENS/],
  ["razonamiento bajo", /reasoning_effort: "low"/],
  ["sin razonamiento de salida", /include_reasoning: false/],
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
if (!/GroqCloud API/.test(privacy) || !/30 días/.test(privacy) || !/no utiliza los datos de clientes para entrenar/.test(privacy)) failures.push("Privacidad: falta explicar Groq y su retención.");
if (/localStorage|sessionStorage/.test(client)) failures.push("El asistente no debe guardar conversaciones en el navegador.");
if (/GEMINI_API_KEY|generativelanguage\.googleapis\.com|env\.AI\.run/.test(endpoint + privacy)) failures.push("Quedó una referencia a proveedor anterior.");
if (failures.length) { console.error("ASSISTANT CHECKS FAILED"); failures.forEach(x => console.error(" - " + x)); process.exit(1); }
console.log("ASSISTANT CHECKS PASSED: Groq, low token budget, scope guard, privacy and safe rendering.");
