import assert from "node:assert/strict";
import { onRequest } from "../functions/_middleware.js";

function makeContext(url, { mode = "false", method = "GET", accept = "text/html" } = {}) {
  const request = new Request(url, { method, headers: { Accept: accept } });
  const forwarded = [];
  return {
    request,
    env: { CEE_MAINTENANCE_MODE: mode },
    forwarded,
    next: async nextRequest => {
      const activeRequest = nextRequest || request;
      forwarded.push(new URL(activeRequest.url).pathname);
      return new Response("<!doctype html><main>Maintenance test</main>", {
        status: 200,
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
assert.equal(await pageResponse.text().then(text => text.includes("Maintenance test")), true);

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

console.log("MAINTENANCE MODE TESTS PASSED: disabled mode, HTML rewrite, direct maintenance route, API pause, static assets and HEAD responses.");
