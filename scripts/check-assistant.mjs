import fs from "node:fs";

const failures = [];
const endpoint = fs.readFileSync("functions/api/asistente.js", "utf8");
const client = fs.readFileSync("js/main.js", "utf8");
const styles = fs.readFileSync("css/styles.css", "utf8");
const privacy = fs.readFileSync("pages/privacidad.html", "utf8");

for (const [label, pattern] of [
  ["Gemini API secret", /env\.GEMINI_API_KEY/],
  ["modelo Gemini Flash", /gemini-3\.8-flash/],
  ["llamada a Gemini en servidor", /generativelanguage\.googleapis\.com\/v1beta\/models/],
  ["clave solo en cabecera del servidor", /"x-goog-api-key":\s*env\.GEMINI_API_KEY/],
  ["filtro de alcance", /out_of_scope/],
  ["lista de temas permitidos", /Temas permitidos:/],
  ["respuesta fija fuera de alcance", /especializado exclusivamente en la información de esta página web/],
  ["salida JSON estructurada", /responseMimeType:\s*"application\/json"/],
  ["validación de origen", /request\.headers\.get\("Origin"\)/],
  ["límite de pregunta", /question\.length\s*>\s*300/],
  ["control de tamaño", /Content-Length/],
  ["límite del cuerpo leído", /rawBody\.length\s*>\s*2048/],
  ["mapa de límites acotado", /requestWindows\.size\s*>\s*1000/],
  ["respuestas sin caché", /"Cache-Control":\s*"no-store"/],
  ["contexto editorial oficial", /CONTEXTO OFICIAL/]
]) if (!pattern.test(endpoint)) failures.push("Function: falta " + label);

for (const [label, pattern] of [
  ["interfaz del asistente", /cee-assistant-launcher/],
  ["envío al endpoint del servidor", /fetch\("\/api\/asistente"/],
  ["límite de entrada visible", /maxlength="300"/i],
  ["renderizado seguro de respuestas", /message\.textContent\s*=\s*text/],
  ["aviso de privacidad", /No compartas datos personales/],
  ["rastro pointer", /addEventListener\("pointermove"/]
]) if (!pattern.test(client)) failures.push("Cliente: falta " + label);

for (const [label, pattern] of [
  ["estilos de movimiento reducido", /prefers-reduced-motion:\s*reduce/],
  ["panel móvil adaptable", /\.cee-assistant-panel/],
  ["canvas sin capturar eventos", /\.cee-pointer-trail\s*\{[^}]*pointer-events:\s*none/s]
]) if (!pattern.test(styles)) failures.push("CSS: falta " + label);

if (!/Google Gemini API/.test(privacy) || !/dirección IP/.test(privacy) || !/mejorar sus productos/.test(privacy)) failures.push("Privacidad: falta explicar Gemini, el tratamiento de preguntas, IP y uso de datos del nivel gratuito.");
if (/localStorage|sessionStorage/.test(client)) failures.push("Cliente: el asistente no debe persistir preguntas ni conversaciones.");
if (/env\.AI\.run|Cloudflare Workers AI/.test(endpoint + privacy)) failures.push("No debe quedar una dependencia activa de Workers AI en el asistente.");
if (failures.length) {
  console.error("ASSISTANT CHECKS FAILED");
  failures.forEach(failure => console.error(" - " + failure));
  process.exit(1);
}
console.log("ASSISTANT CHECKS PASSED: Gemini server-side, scope guard, input validation, privacy safeguards, safe rendering, pointer trail and reduced-motion support.");
