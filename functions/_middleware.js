const MAINTENANCE_PATH = "/maintenance.html";
const ENABLED_VALUES = new Set(["true", "1", "on"]);

function maintenanceHeaders(source) {
  const headers = new Headers(source || {});
  headers.set("Cache-Control", "no-store, max-age=0");
  headers.set("Retry-After", "300");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Vary", "Accept");
  return headers;
}

function maintenanceResponse(body, contentType = "application/json; charset=utf-8") {
  const headers = maintenanceHeaders();
  headers.set("Content-Type", contentType);
  return new Response(body, { status: 503, headers });
}

export async function onRequest(context) {
  const { request, env } = context;
  const enabled = ENABLED_VALUES.has(String(env.CEE_MAINTENANCE_MODE || "").trim().toLowerCase());
  if (!enabled) return context.next();

  const url = new URL(request.url);

  // Las funciones API no deben seguir procesando solicitudes durante el mantenimiento.
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
    return maintenanceResponse(JSON.stringify({
      error: "El sitio está temporalmente en mantenimiento. Inténtalo nuevamente más tarde.",
      code: "MAINTENANCE_MODE"
    }));
  }

  // La página de mantenimiento también devuelve HTTP 503 si se visita directamente.
  if (url.pathname === MAINTENANCE_PATH) {
    const response = await context.next();
    return new Response(request.method === "HEAD" ? null : response.body, {
      status: 503,
      statusText: "Service Unavailable",
      headers: maintenanceHeaders(response.headers)
    });
  }

  const acceptsHtml = (request.headers.get("Accept") || "").toLowerCase().includes("text/html");
  const isDocument = request.method === "GET" || request.method === "HEAD";
  if (!isDocument || !acceptsHtml) return context.next();

  // Se conserva la disponibilidad de CSS, imágenes, fuentes y otros recursos estáticos.
  const maintenanceUrl = new URL(MAINTENANCE_PATH, url.origin);
  const maintenanceRequest = new Request(maintenanceUrl, {
    method: "GET",
    headers: { Accept: "text/html" }
  });
  const response = await context.next(maintenanceRequest);
  return new Response(request.method === "HEAD" ? null : response.body, {
    status: 503,
    statusText: "Service Unavailable",
    headers: maintenanceHeaders(response.headers)
  });
}
