import assert from "node:assert/strict";
import { onRequest } from "../functions/api/asistente.js";

const originalFetch = globalThis.fetch;
let scenario = "";
let geminiCalls = 0;
let groqCalls = 0;
const html = "<html><main><h1>Proyecto y ejes</h1><p>El proyecto del CEE contempla medio ambiente, infraestructura, deportes e identidad técnico-profesional.</p></main></html>";

function providerJson(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
function geminiSuccess() {
  return providerJson({
    candidates: [{
      content: { parts: [{ text: JSON.stringify({ scope: "in_scope", answer: "El proyecto contempla cinco ejes de trabajo." }) }] },
      urlContextMetadata: {
        urlMetadata: [{
          retrievedUrl: "https://cee.test/pages/proyecto.html",
          urlRetrievalStatus: "URL_RETRIEVAL_STATUS_SUCCESS"
        }]
      }
    }]
  });
}
function groqSuccess() {
  return providerJson({
    choices: [{
      message: {
        content: JSON.stringify({ scope: "in_scope", answer: "El proyecto contempla cinco ejes de trabajo." })
      }
    }]
  });
}

async function run(name, expectedStatus, expectedProvider, fetchImpl) {
  scenario = name;
  geminiCalls = 0;
  groqCalls = 0;
  globalThis.fetch = fetchImpl;
  try {
    const request = new Request("https://cee.test/api/asistente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://cee.test",
        "CF-Connecting-IP": "192.0.2." + (name.length + 10)
      },
      body: JSON.stringify({ question: "¿Cuáles son los ejes del proyecto?" })
    });
    const response = await onRequest({
      request,
      env: { GEMINI_API_KEY: "test-gemini-key", GROQ_API_KEY: "test-groq-key" }
    });
    const payload = await response.json();
    assert.equal(response.status, expectedStatus, name + ": HTTP status");
    if (expectedProvider) assert.equal(payload.provider, expectedProvider, name + ": provider");
    return payload;
  } finally {
    globalThis.fetch = originalFetch;
  }
}

try {
  await run("Gemini success", 200, "gemini", async url => {
    if (String(url).includes("generativelanguage.googleapis.com")) {
      geminiCalls += 1;
      return geminiSuccess();
    }
    throw new Error("Unexpected request in Gemini success test");
  });
  assert.equal(geminiCalls, 1, "Gemini success should not call Groq or retry");

  const fallback503 = await run("Gemini transient failure falls back", 200, "groq", async (url, options) => {
    const target = String(url);
    if (target.includes("generativelanguage.googleapis.com")) {
      geminiCalls += 1;
      return providerJson({ error: { status: "UNAVAILABLE" } }, 503);
    }
    if (target.includes("api.groq.com")) {
      groqCalls += 1;
      return groqSuccess();
    }
    if (target.startsWith("https://cee.test/")) return new Response(html, { headers: { "Content-Type": "text/html" } });
    throw new Error("Unexpected URL " + target);
  });
  assert.equal(fallback503.fallback, true);
  assert.equal(geminiCalls, 2, "Gemini 503 should be retried once");
  assert.equal(groqCalls, 1, "Groq should be called after Gemini retries");

  const fallback401 = await run("Gemini authentication failure falls back", 200, "groq", async url => {
    const target = String(url);
    if (target.includes("generativelanguage.googleapis.com")) {
      geminiCalls += 1;
      return providerJson({ error: { status: "UNAUTHENTICATED" } }, 401);
    }
    if (target.includes("api.groq.com")) {
      groqCalls += 1;
      return groqSuccess();
    }
    if (target.startsWith("https://cee.test/")) return new Response(html, { headers: { "Content-Type": "text/html" } });
    throw new Error("Unexpected URL " + target);
  });
  assert.equal(fallback401.fallback, true);
  assert.equal(geminiCalls, 1, "Gemini 401 should not be retried");
  assert.equal(groqCalls, 1, "Groq should still run after Gemini 401");

  const bothUnavailable = await run("Both providers unavailable", 503, null, async url => {
    const target = String(url);
    if (target.includes("generativelanguage.googleapis.com")) {
      geminiCalls += 1;
      return providerJson({ error: { status: "UNAVAILABLE" } }, 503);
    }
    if (target.includes("api.groq.com")) {
      groqCalls += 1;
      return providerJson({ error: { message: "temporary unavailable" } }, 503);
    }
    if (target.startsWith("https://cee.test/")) return new Response(html, { headers: { "Content-Type": "text/html" } });
    throw new Error("Unexpected URL " + target);
  });
  assert.equal(bothUnavailable.code, "AI_PROVIDERS_UNAVAILABLE");
  assert.equal(geminiCalls, 2, "Gemini retry count");
  assert.equal(groqCalls, 2, "Groq should retry one transient 503");

  console.log("ASSISTANT RESILIENCE TESTS PASSED: Gemini primary, transient retry, auth-error failover, Groq retry and safe dual-provider failure.");
} finally {
  globalThis.fetch = originalFetch;
}
