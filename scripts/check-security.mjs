import fs from "node:fs";
import { execFileSync } from "node:child_process";

const failures = [];
const headersPath = "_headers";
if (!fs.existsSync(headersPath)) {
  failures.push("Falta _headers para configurar cabeceras de seguridad de Cloudflare Pages.");
} else {
  const headers = fs.readFileSync(headersPath, "utf8");
  const required = [
    ["CSP por defecto", /Content-Security-Policy:\s*[^\n]*default-src 'self'/i],
    ["scripts solo del mismo origen", /Content-Security-Policy:\s*[^\n]*script-src 'self'/i],
    ["beacon de Cloudflare limitado a su archivo oficial", /script-src 'self' https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js(?:;|\s)/i],
    ["Cloudflare Web Analytics permitido en connect-src", /connect-src 'self' https:\/\/cloudflareinsights\.com(?:;|\s)/i],
    ["bloqueo de scripts inline", /Content-Security-Policy:\s*[^\n]*script-src-attr 'none'/i],
    ["bloqueo de objetos", /Content-Security-Policy:\s*[^\n]*object-src 'none'/i],
    ["bloqueo de framing", /Content-Security-Policy:\s*[^\n]*frame-ancestors 'none'/i],
    ["protección MIME", /X-Content-Type-Options:\s*nosniff/i],
    ["política de referrer", /Referrer-Policy:\s*strict-origin-when-cross-origin/i],
    ["política de permisos", /Permissions-Policy:/i],
    ["HSTS", /Strict-Transport-Security:\s*max-age=/i]
  ];
  for (const [label, pattern] of required) if (!pattern.test(headers)) failures.push(`_headers: falta ${label}.`);
}

if (!fs.existsSync("SECURITY.md")) failures.push("Falta SECURITY.md con las pautas de seguridad web.");
else {
  const guide = fs.readFileSync("SECURITY.md", "utf8");
  for (const term of ["2FA", "force-push", "Secret scanning", "Push protection"])
    if (!guide.includes(term)) failures.push(`SECURITY.md: falta la pauta ${term}.`);
}

if (!fs.existsSync("js/search.js")) failures.push("Falta js/search.js.");
else {
  const search = fs.readFileSync("js/search.js", "utf8");
  if (/\.innerHTML\s*=|insertAdjacentHTML\s*\(|document\.write\s*\(/.test(search))
    failures.push("Buscador: no insertar contenido dinámico mediante sinks HTML inseguros.");
  if (!/\.textContent\s*=/.test(search) || !/replaceChildren\s*\(/.test(search))
    failures.push("Buscador: los resultados deben construirse con nodos DOM y textContent.");
}

const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
const textExtensions = /\.(?:html|css|js|mjs|json|md|svg|yml|yaml|txt|toml|xml|pem|key)$/i;
const privateKey = /-----BEGIN (?:OPENSSH |RSA |EC |DSA )?PRIVATE KEY-----/;
for (const file of tracked) {
  if (!textExtensions.test(file) || !fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, "utf8");
  if (privateKey.test(content)) failures.push(`Posible material de clave privada incluido en el repositorio: ${file}`);
}

if (failures.length) {
  console.error("SECURITY CHECKS FAILED");
  for (const failure of failures) console.error(" - " + failure);
  process.exit(1);
}
console.log(`SECURITY CHECKS PASSED: CSP including Cloudflare Analytics, HTTP security headers, safe search rendering and no tracked private-key material (${tracked.length} tracked files checked).`);
