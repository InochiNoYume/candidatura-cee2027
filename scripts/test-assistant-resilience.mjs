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
    assert.match(String(url), /generativelanguage\.googleapis\.com/);
    geminiCalls += 1;
    return providerJson(successPayload);
  });
  assert.equal(success.provider, "gemini");
  assert.equal(geminiCalls, 1, "A successful request must not retry");


  const listPayload = {
    candidates: [{
      content: { parts: [{ text: JSON.stringify({
        scope: "in_scope",
        answer: "La lista está integrada por ocho cargos y sus responsables."
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
    const sent = JSON.parse(options.body);
    listPrompt = sent.contents[0].parts[0].text;
    assert.match(listPrompt, /https:\\/\\/cee\\.test\\/pages\\/lista/);
    assert.match(listPrompt, /ÍNDICE COMPLETO DE PÁGINAS OFICIALES/);
    assert.match(listPrompt, /https:\\/\\/cee\\.test\\/pages\\/privacidad/);
    return providerJson(listPayload);
  }, undefined, "¿Quiénes integran la lista del CEE 2027?");
  assert.equal(listResult.sources.length, 1, "A list question must return its verified source");
  assert.equal(listResult.sources[0].title, "Nuestra lista");
  assert.equal(listResult.sources[0].url, "https://cee.test/pages/lista");

  const recovered = await run("Gemini transient error then success", 200, async url => {
    assert.match(String(url), /generativelanguage\.googleapis\.com/);
    geminiCalls += 1;
    return geminiCalls === 1
      ? providerJson({ error: { status: "UNAVAILABLE" } }, 503)
      : providerJson(successPayload);
  });
  assert.equal(recovered.provider, "gemini");
  assert.equal(geminiCalls, 2, "A transient 503 should retry once");

  await run("Gemini authentication error", 503, async url => {
    geminiCalls += 1;
    return providerJson({ error: { status: "UNAUTHENTICATED" } }, 401);
  }, "GEMINI_REQUEST_FAILED");
  assert.equal(geminiCalls, 1, "A 401 must not be retried");

  await run("Gemini malformed response", 502, async url => {
    geminiCalls += 1;
    return providerJson({ candidates: [{ content: { parts: [{ text: "not-json" }] } }] });
  }, "GEMINI_INVALID_RESPONSE");
  assert.equal(geminiCalls, 1, "An invalid model response must not be retried");

  await run("Gemini transient service exhausted", 503, async url => {
    geminiCalls += 1;
    return providerJson({ error: { status: "UNAVAILABLE" } }, 503);
  }, "GEMINI_REQUEST_FAILED");
  assert.equal(geminiCalls, 2, "A transient error must stop after two attempts");

  console.log("GEMINI RESILIENCE TESTS PASSED: success, list source routing, canonical URL normalization, full page index, transient retry, auth handling, invalid response validation and bounded retry exhaustion.");
} finally {
  globalThis.fetch = originalFetch;
}
