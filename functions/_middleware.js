const MAINTENANCE_PATH = "/maintenance.html";
const ERROR_PATHS = new Map([
  [403, "/403.html"],
  [404, "/404.html"],
  [500, "/500.html"]
]);
const ENABLED_VALUES = new Set(["true", "1", "on"]);
const ERROR_STATUS_TEXT = {
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
  503: "Service Unavailable"
};

function responseHeaders(source, status) {
  const headers = new Headers(source || {});
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-store, max-age=0");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Vary", "Accept");
  headers.delete("Content-Length");
  headers.delete("Content-Encoding");
  headers.delete("Content-Range");
  if (status === 503) headers.set("Retry-After", "300");
  else headers.delete("Retry-After");
  return headers;
}

function maintenanceResponse(body, contentType = "application/json; charset=utf-8") {
  const headers = new Headers({
    "Content-Type": contentType,
    "Cache-Control": "no-store, max-age=0",
    "Retry-After": "300",
    "X-Robots-Tag": "noindex, nofollow",
    "X-Content-Type-Options": "nosniff",
    "Vary": "Accept"
  });
  return new Response(body, { status: 503, statusText: ERROR_STATUS_TEXT[503], headers });
}

async function errorPageResponse(context, request, status) {
  const path = ERROR_PATHS.get(status);
  const pageUrl = new URL(path, request.url);
  let pageResponse;
  try {
    pageResponse = await context.next(new Request(pageUrl, {
      method: "GET",
      headers: { Accept: "text/html" }
    }));
  } catch {
    pageResponse = null;
  }

  const fallback = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Error ${status} | CEE 2027</title><body><main><h1>Error ${status}</h1><p>No fue posible completar la solicitud.</p><a href="/">Volver al inicio</a></main></body></html>`;
  const body = pageResponse?.ok ? pageResponse.body : fallback;
  return new Response(request.method === "HEAD" ? null : body, {
    status,
    statusText: ERROR_STATUS_TEXT[status],
    headers: responseHeaders(pageResponse?.headers, status)
  });
}

async function maintenancePageResponse(context, request) {
  const pageUrl = new URL(MAINTENANCE_PATH, request.url);
  let pageResponse;
  try {
    pageResponse = await context.next(new Request(pageUrl, {
      method: "GET",
      headers: { Accept: "text/html" }
    }));
  } catch {
    pageResponse = null;
  }
  const fallback = '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Mantenimiento | CEE 2027</title><body><main><h1>Estamos en mantenimiento.</h1><p>Inténtalo nuevamente más tarde.</p></main></body></html>';
  return new Response(request.method === "HEAD" ? null : (pageResponse?.ok ? pageResponse.body : fallback), {
    status: 503,
    statusText: ERROR_STATUS_TEXT[503],
    headers: responseHeaders(pageResponse?.headers, 503)
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const isApi = url.pathname === "/api" || url.pathname.startsWith("/api/");
  const isDocument = request.method === "GET" || request.method === "HEAD";
  const acceptsHtml = (request.headers.get("Accept") || "").toLowerCase().includes("text/html");
  const enabled = ENABLED_VALUES.has(String(env.CEE_MAINTENANCE_MODE || "").trim().toLowerCase());

  // Durante el mantenimiento, las APIs se pausan con JSON y las páginas HTML con HTTP 503.
  if (enabled && isApi) {
    return maintenanceResponse(JSON.stringify({
      error: "El sitio está temporalmente en mantenimiento. Inténtalo nuevamente más tarde.",
      code: "MAINTENANCE_MODE"
    }), "application/json; charset=utf-8");
  }
  if (enabled && isDocument && acceptsHtml) return maintenancePageResponse(context, request);

  // Los endpoints API conservan sus respuestas JSON y sus códigos HTTP.
  if (!isDocument || !acceptsHtml || isApi) return context.next();

  // Abrir directamente una página de error también debe devolver su código HTTP real.
  if (url.pathname === "/403.html") return errorPageResponse(context, request, 403);
  if (url.pathname === "/404.html") return errorPageResponse(context, request, 404);
  if (url.pathname === "/500.html") return errorPageResponse(context, request, 500);

  try {
    const response = await context.next();
    if (ERROR_PATHS.has(response.status)) return errorPageResponse(context, request, response.status);
    return response;
  } catch {
    return errorPageResponse(context, request, 500);
  }
}
