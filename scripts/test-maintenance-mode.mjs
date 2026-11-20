import assert from "node:assert/strict";
import { onRequest } from "../functions/_middleware.js";

function makeContext(url, {
  mode = "false", method = "GET", accept = "text/html",
  nextStatus = 200, throwOnOriginal = false
} = {}) {
  const request = new Request(url, { method, headers: { Accept: accept } });
  const forwarded = [];
  return {
    request,
    env: { CEE_MAINTENANCE_MODE: mode },
    forwarded,
    next: async nextRequest => {
      const activeRequest = nextRequest || request;
      const pathname = new URL(activeRequest.url).pathname;
      forwarded.push(pathname);
      if (throwOnOriginal && pathname === new URL(url).pathname) throw new Error("simulated page failure");
      return new Response(`<!doctype html><main>Page for ${pathname}</main>`, {
        status: pathname === new URL(url).pathname ? nextStatus : 200,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }
  };
}

const normal = makeContext("https://cee.test/pages/lista.html");
const normalResponse = await onRequest(normal);
assert.equal(normalResponse.status, 200, "The site must work normally when maintenance is disabled");
assert.deepEqual(normal.forwarded, ["/pages/lista.html"]);

const page = makeContext("https://cee.test/pages/lista.html", { mode: "true" });
const pageResponse = await onRequest(page);
assert.equal(pageResponse.status, 503, "Public HTML routes must return HTTP 503 during maintenance");
assert.deepEqual(page.forwarded, ["/maintenance.html"], "Public HTML routes must serve the maintenance document");
assert.equal(pageResponse.headers.get("Retry-After"), "300");
assert.match(pageResponse.headers.get("X-Robots-Tag") || "", /noindex/);
assert.equal(await pageResponse.text().then(text => text.includes("Page for /maintenance.html")), true);

const directPage = makeContext("https://cee.test/maintenance.html", { mode: "true" });
const directResponse = await onRequest(directPage);
assert.equal(directResponse.status, 503, "The maintenance document must report HTTP 503 even when opened directly");
assert.deepEqual(directPage.forwarded, ["/maintenance.html"]);

const api = makeContext("https://cee.test/api/asistente", { mode: "true", accept: "application/json" });
const apiResponse = await onRequest(api);
assert.equal(apiResponse.status, 503, "API requests must be paused during maintenance");
assert.equal((await apiResponse.json()).code, "MAINTENANCE_MODE");
assert.deepEqual(api.forwarded, [], "API requests must not reach the application handler during maintenance");

const asset = makeContext("https://cee.test/css/styles.css", { mode: "true", accept: "text/css,*/*" });
const assetResponse = await onRequest(asset);
assert.equal(assetResponse.status, 200, "Static assets must remain available so the maintenance page can be styled");
assert.deepEqual(asset.forwarded, ["/css/styles.css"]);

const head = makeContext("https://cee.test/pages/proyecto.html", { mode: "1", method: "HEAD" });
const headResponse = await onRequest(head);
assert.equal(headResponse.status, 503, "HEAD document requests must receive the maintenance status");
assert.equal(await headResponse.text(), "", "HEAD responses must not contain a body");

for (const [status, path] of [[403, "/403.html"], [404, "/404.html"], [500, "/500.html"]]) {
  const direct = makeContext(`https://cee.test${path}`);
  const response = await onRequest(direct);
  assert.equal(response.status, status, `Direct ${path} must return HTTP ${status}`);
  assert.equal(response.headers.get("Content-Type"), "text/html; charset=utf-8");
  assert.match(response.headers.get("X-Robots-Tag") || "", /noindex/);
  assert.equal(await response.text().then(body => body.includes(`Page for ${path}`)), true);
}

const forbidden = makeContext("https://cee.test/private.html", { nextStatus: 403 });
const forbiddenResponse = await onRequest(forbidden);
assert.equal(forbiddenResponse.status, 403, "An HTML 403 must use the custom forbidden page");
assert.ok(forbidden.forwarded.includes("/403.html"));

const notFound = makeContext("https://cee.test/missing.html", { nextStatus: 404 });
const notFoundResponse = await onRequest(notFound);
assert.equal(notFoundResponse.status, 404, "An HTML 404 must use the custom not-found page");
assert.ok(notFound.forwarded.includes("/404.html"));

const serverError = makeContext("https://cee.test/failing.html", { throwOnOriginal: true });
const serverErrorResponse = await onRequest(serverError);
assert.equal(serverErrorResponse.status, 500, "A thrown HTML request error must use the custom server-error page");
assert.ok(serverError.forwarded.includes("/500.html"));

const apiForbidden = makeContext("https://cee.test/api/asistente", {
  accept: "application/json", nextStatus: 403
});
const apiForbiddenResponse = await onRequest(apiForbidden);
assert.equal(apiForbiddenResponse.status, 403, "API errors must preserve their JSON HTTP status");
assert.match(apiForbiddenResponse.headers.get("Content-Type") || "", /text\/html/, false);

console.log("MIDDLEWARE TESTS PASSED: maintenance, API pause, static assets, HEAD, custom 403/404/500 pages, status preservation and thrown HTML errors.");
