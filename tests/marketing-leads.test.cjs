const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

// Exercise the real TypeScript modules with isolated storage/network boundaries.
function loadSource(file, mocks = {}) {
  const source = readFileSync(path.join(__dirname, "..", file), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const fixture = { exports: {} };
  const scopedRequire = name => Object.hasOwn(mocks, name) ? mocks[name] : require(name);
  new Function("require", "module", "exports", compiled)(scopedRequire, fixture, fixture.exports);
  return fixture.exports;
}

const schema = loadSource("lib/validations/marketing-leads.ts");
const valid = {
  name: "Test Visitor",
  email: "visitor@example.com",
  company: "Test Company",
  packageOfInterest: "marketing",
};

function route(saveMarketingLead) {
  return loadSource("app/api/public/leads/route.ts", {
    "next/server": { NextResponse: { json: (body, init) => Response.json(body, init) } },
    "@/lib/marketing-leads": { saveMarketingLead },
    "@/lib/validations/marketing-leads": schema,
  });
}
const request = body => new Request("http://localhost/api/public/leads", { method: "POST", body: JSON.stringify(body) });

test("malformed JSON and invalid lead fields never reach storage", async () => {
  let writes = 0;
  const api = route(async () => { writes++; });
  const malformed = new Request("http://localhost/api/public/leads", { method: "POST", body: "{" });
  assert.equal((await api.POST(malformed)).status, 400);
  for (const payload of [null, [], {}, { ...valid, email: "invalid" }, { ...valid, name: "x" }, { ...valid, packageOfInterest: "invalid-package" }]) {
    assert.equal((await api.POST(request(payload))).status, 400);
  }
  assert.equal(writes, 0);
});

test("valid lead is saved once, strips extra fields, and does not echo personal data", async () => {
  const saved = [];
  const api = route(async lead => saved.push(lead));
  const response = await api.POST(request({ ...valid, locale: "ar", admin: true }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(saved.length, 1);
  assert.equal(saved[0].locale, "ar");
  assert.equal(saved[0].admin, undefined);
  assert.ok(!Number.isNaN(Date.parse(saved[0].submittedAt)));

  // Test optional company field
  const leadWithoutCompany = { name: "Solo Founder", email: "solo@example.com", packageOfInterest: "marketing" };
  const response2 = await api.POST(request(leadWithoutCompany));
  assert.equal(response2.status, 200);
  assert.equal(saved.length, 2);
  assert.equal(saved[1].name, "Solo Founder");
  assert.equal(saved[1].company, undefined);
});

test("storage failure reports unavailable instead of success", async () => {
  const api = route(async () => { throw new Error("Storage unavailable (test)"); });
  const response = await api.POST(request(valid));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, false);
});

test("local-only delivery archives exactly once and makes no network requests", async () => {
  const previousApi = process.env.MARKETING_LEADS_API_URL;
  const previousWebhook = process.env.MARKETING_LEADS_WEBHOOK_URL;
  delete process.env.MARKETING_LEADS_API_URL;
  delete process.env.MARKETING_LEADS_WEBHOOK_URL;
  let writes = 0;
  try {
    const delivery = loadSource("lib/marketing-leads.ts", {
      "server-only": {},
      "node:fs/promises": { mkdir: async () => {}, appendFile: async () => { writes++; } },
      "./brevo": {
        sendContactNotificationToAdmin: async () => ({ success: true }),
        sendContactConfirmationToUser: async () => ({ success: true }),
      },
      "./telegram": {
        sendContactNotificationToTelegram: async () => ({ success: true }),
      },
    });
    assert.equal(await delivery.deliverMarketingLead({ ...valid, locale: "en", submittedAt: new Date().toISOString() }), true);
    assert.equal(writes, 1);
  } finally {
    if (previousApi !== undefined) process.env.MARKETING_LEADS_API_URL = previousApi;
    if (previousWebhook !== undefined) process.env.MARKETING_LEADS_WEBHOOK_URL = previousWebhook;
  }
});

test("failed local storage plus a rejected webhook cannot report success", async () => {
  const previousApi = process.env.MARKETING_LEADS_API_URL;
  const previousWebhook = process.env.MARKETING_LEADS_WEBHOOK_URL;
  const previousFetch = global.fetch;
  delete process.env.MARKETING_LEADS_API_URL;
  process.env.MARKETING_LEADS_WEBHOOK_URL = "https://example.com/test-webhook";
  let completed = false;
  global.fetch = async () => {
    await new Promise(resolve => setTimeout(resolve, 10));
    completed = true;
    return { ok: false, status: 500 };
  };
  try {
    const delivery = loadSource("lib/marketing-leads.ts", {
      "server-only": {},
      "node:fs/promises": { mkdir: async () => {}, appendFile: async () => { throw new Error("Storage unavailable (test)"); } },
      "./brevo": {
        sendContactNotificationToAdmin: async () => ({ success: false, error: "Failed" }),
        sendContactConfirmationToUser: async () => ({ success: false, error: "Failed" }),
      },
      "./telegram": {
        sendContactNotificationToTelegram: async () => ({ success: false, error: "Failed" }),
      },
    });
    assert.equal(await delivery.deliverMarketingLead({ ...valid, locale: "en", submittedAt: new Date().toISOString() }), false);
    assert.equal(completed, true);
  } finally {
    global.fetch = previousFetch;
    if (previousApi !== undefined) process.env.MARKETING_LEADS_API_URL = previousApi;
    if (previousWebhook === undefined) delete process.env.MARKETING_LEADS_WEBHOOK_URL;
    else process.env.MARKETING_LEADS_WEBHOOK_URL = previousWebhook;
  }
});
