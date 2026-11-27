import assert from "node:assert/strict";
import { onRequest } from "../functions/api/asistente.js";

const originalFetch = globalThis.fetch;
let geminiCalls = 0;
const successPayload = {
  candidates: [{
    content: { parts: [{ text: JSON.stringify({
      scope: "in_scope",
      answer: "El proyecto contempla cinco ejes de trabajo."
    }) }] },
    urlContextMetadata: {
      urlMetadata: [{
        retrievedUrl: "https://cee.test/pages/proyecto.html",
        urlRetrievalStatus: "URL_RETRIEVAL_STATUS_SUCCESS"
      }]
    }
  }]
};
function staticPage() { return new Response("<main><h1>Nuestra lista</h1><p>Agustina Pérez y el equipo de candidatura.</p></main>", { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }); }
function providerJson(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
async function run(name, expectedStatus, fetchImpl, expectedCode, question = "¿Cuáles son los ejes del proyecto?") {
  geminiCalls = 0;
  globalThis.fetch = fetchImpl;
  try {
    const request = new Request("https://cee.test/api/asistente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://cee.test",
        "CF-Connecting-IP": "192.0.2." + (name.length + 10)
      },
      body: JSON.stringify({ question })
    });
    const response = await onRequest({
      request,
      env: { GEMINI_API_KEY: "test-gemini-key" }
    });
    const payload = await response.json();
    assert.equal(response.status, expectedStatus, name + ": HTTP status");
    if (expectedCode) assert.equal(payload.code, expectedCode, name + ": error code");
    return payload;
  } finally {
    globalThis.fetch = originalFetch;
  }
}
try {
  const success = await run("Gemini success", 200, async url => {
    if (!String(url).includes("generativelanguage.googleapis.com")) return staticPage();
    geminiCalls += 1;
    return providerJson(successPayload);
  });
  assert.equal(success.provider, "gemini");
  assert.equal(geminiCalls, 1, "A successful request must not retry");

  let multiTopicPrompt = "";
  await run("Multi-topic source selection", 200, async (url, options) => {
    if (!String(url).includes("generativelanguage.googleapis.com")) return staticPage();
    multiTopicPrompt = JSON.parse(options.body).contents[0].parts[0].text;
    return providerJson({
      candidates: [{
        content: { parts: [{ text: JSON.stringify({ scope: "in_scope", answer: "La lista y la fecha se publican en sus secciones correspondientes." }) }] },
        urlContextMetadata: {
          urlMetadata: [
            { retrievedUrl: "https://cee.test/pages/lista.html", urlRetrievalStatus: "URL_RETRIEVAL_STATUS_SUCCESS" },
            { retrievedUrl: "https://cee.test/pages/agenda.html", urlRetrievalStatus: "URL_RETRIEVAL_STATUS_SUCCESS" }
          ]
        }
      }]
    });
  }, undefined, "¿Quiénes integran la lista y qué fechas de votación y presentación tienen?");
  assert.ok(multiTopicPrompt.includes("https://cee.test/pages/lista"), "A multi-topic question must include the list page");
  assert.ok(multiTopicPrompt.includes("https://cee.test/pages/agenda"), "A multi-topic question must include the agenda page");

  const listPayload = {
    candidates: [{
      content: { parts: [{ text: JSON.stringify({
        scope: "in_scope",
        answer: "La lista está integrada por ocho cargos.\n\n- **Presidenta:** Agustina Pérez.\n- **Vicepresidenta:** Catalina Chandía."
      }) }] },
      urlContextMetadata: {
        urlMetadata: [{
          retrievedUrl: "https://cee.test/pages/lista",
          urlRetrievalStatus: "URL_RETRIEVAL_STATUS_SUCCESS"
        }]
      }
    }]
  };
  let listPrompt = "";
  const listResult = await run("List page source and canonical URL", 200, async (url, options) => {
    if (!String(url).includes("generativelanguage.googleapis.com")) return staticPage();
    const sent = JSON.parse(options.body);
    listPrompt = sent.contents[0].parts[0].text;
    assert.ok(listPrompt.includes("https://cee.test/pages/lista"));
    assert.match(listPrompt, /ÍNDICE COMPLETO DE PÁGINAS OFICIALES/);
    assert.ok(listPrompt.includes("https://cee.test/pages/terminos-privacidad"));
    return providerJson(listPayload);
  }, undefined, "¿Quiénes integran la lista del CEE 2027?");
  assert.equal(Object.hasOwn(listResult, "sources"), false, "The public response must not expose a sources section");
  assert.ok(listResult.answer.includes("Agustina Pérez"), "The answer must still use the verified list content");
  assert.ok(listResult.answer.includes("\n- **Presidenta:**"), "Structured Markdown line breaks must be preserved");

  const recovered = await run("Gemini transient error then success", 200, async url => {
    if (!String(url).includes("generativelanguage.googleapis.com")) return staticPage();
    geminiCalls += 1;
    return geminiCalls === 1
      ? providerJson({ error: { status: "UNAVAILABLE" } }, 503)
      : providerJson(successPayload);
  });
  assert.equal(recovered.provider, "gemini");
  assert.equal(geminiCalls, 2, "A transient 503 should retry once");

  await run("Gemini authentication error", 503, async url => {
    if (!String(url).includes("generativelanguage.googleapis.com")) return staticPage();
    geminiCalls += 1;
    return providerJson({ error: { status: "UNAUTHENTICATED" } }, 401);
  }, "GEMINI_REQUEST_FAILED");
  assert.equal(geminiCalls, 1, "A 401 must not be retried");

  await run("Gemini malformed response", 502, async url => {
    if (!String(url).includes("generativelanguage.googleapis.com")) return staticPage();
    geminiCalls += 1;
    return providerJson({ candidates: [{ content: { parts: [{ text: "not-json" }] } }] });
  }, "GEMINI_INVALID_RESPONSE");
  assert.equal(geminiCalls, 1, "An invalid model response must not be retried");

  await run("Gemini transient service exhausted", 503, async url => {
    if (!String(url).includes("generativelanguage.googleapis.com")) return staticPage();
    geminiCalls += 1;
    return providerJson({ error: { status: "UNAVAILABLE" } }, 503);
  }, "GEMINI_REQUEST_FAILED");
  assert.equal(geminiCalls, 3, "A transient error must stop after three attempts");

  console.log("GEMINI RESILIENCE TESTS PASSED: success, internal source grounding, canonical URL normalization, full page index, transient retry, auth handling, invalid response validation and bounded retry exhaustion.");
} finally {
  globalThis.fetch = originalFetch;
}
