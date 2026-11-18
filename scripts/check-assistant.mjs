import fs from "node:fs";

const failures = [];
const endpoint = fs.readFileSync("functions/api/asistente.js", "utf8");
const client = fs.readFileSync("js/main.js", "utf8");
const styles = fs.readFileSync("css/styles.css", "utf8");
const privacy = fs.readFileSync("pages/privacidad.html", "utf8");

for (const [label, pattern] of [
  ["binding de Workers AI", /env\.AI\.run\s*\(/],
  ["modelo Gemma 4 vigente", /@cf\/google\/gemma-4-26b-a4b-it/],
  ["validación de origen", /request\.headers\.get\("Origin"\)/],
  ["límite de pregunta", /question\.length\s*>\s*300/],
  ["control de tamaño", /Content-Length/],
  ["límite del cuerpo leído", /rawBody\.length\s*>\s*2048/],
  ["mapa de límites acotado", /requestWindows\.size\s*>\s*1000/],
  ["respuestas sin caché", /"Cache-Control":\s*"no-store"/],
  ["contexto editorial oficial", /CONTEXTO OFICIAL/],
  ["respuesta con límite de tokens", /max_completion_tokens:\s*190/]
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

if (!/Cloudflare Workers AI/.test(privacy) || !/dirección IP/.test(privacy) || !/(datos personales|información personal)/.test(privacy)) failures.push("Privacidad: falta explicar el tratamiento de preguntas, IP y datos personales.");
if (/localStorage|sessionStorage/.test(client)) failures.push("Cliente: el asistente no debe persistir preguntas ni conversaciones.");
if (failures.length) {
  console.error("ASSISTANT CHECKS FAILED");
  failures.forEach(failure => console.error(" - " + failure));
  process.exit(1);
}
console.log("ASSISTANT CHECKS PASSED: Workers AI binding, model, input validation, privacy safeguards, safe rendering, pointer trail and reduced-motion support.");
