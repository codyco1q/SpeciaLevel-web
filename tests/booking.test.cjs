const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

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

const { createBookingSchema, isWeekday, BOOKING_TIME_SLOTS } = loadSource("lib/validations/booking.ts");

// Calculate next upcoming weekday for tests (avoid weekend failures)
function getNextWeekday() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const validDate = getNextWeekday();

test("weekday helper correctly rejects weekends and accepts weekdays", () => {
  // Monday: 2026-10-26
  assert.equal(isWeekday("2026-10-26"), true);
  // Friday: 2026-10-30
  assert.equal(isWeekday("2026-10-30"), true);
  // Saturday: 2026-10-31
  assert.equal(isWeekday("2026-10-31"), false);
  // Sunday: 2026-11-01
  assert.equal(isWeekday("2026-11-01"), false);
});

test("booking schema validates required fields and time slots correctly", () => {
  const schema = createBookingSchema();

  const validBooking = {
    firstName: "Sarah",
    lastName: "Connor",
    email: "sarah@cyberdyne.com",
    phone: "+1 555 123 4567",
    date: validDate,
    timeSlot: "10:00 AM ET",
  };

  const parsed = schema.safeParse(validBooking);
  assert.equal(parsed.success, true);

  // Invalid time slot
  assert.equal(schema.safeParse({ ...validBooking, timeSlot: "8:00 AM ET" }).success, false);
  // Invalid weekend date
  assert.equal(schema.safeParse({ ...validBooking, date: "2026-10-31" }).success, false);
  // Invalid email
  assert.equal(schema.safeParse({ ...validBooking, email: "invalid-email" }).success, false);
  // Too short phone
  assert.equal(schema.safeParse({ ...validBooking, phone: "123" }).success, false);
  // Too short name
  assert.equal(schema.safeParse({ ...validBooking, firstName: "A" }).success, false);
});

test("booking delivery saves to local storage and handles Brevo notifications", async () => {
  let writes = 0;
  let adminNotified = 0;
  let userConfirmed = 0;
  let telegramNotified = 0;

  const bookings = loadSource("lib/bookings.ts", {
    "server-only": {},
    "node:fs/promises": {
      mkdir: async () => {},
      appendFile: async () => { writes++; },
    },
    "./brevo": {
      sendBookingNotificationToAdmin: async () => { adminNotified++; return { success: true }; },
      sendBookingConfirmationToUser: async () => { userConfirmed++; return { success: true }; },
    },
    "./telegram": {
      sendBookingNotificationToTelegram: async () => { telegramNotified++; return { success: true }; },
    },
  });

  const sampleBooking = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    date: validDate,
    timeSlot: "02:00 PM ET",
    locale: "en",
    submittedAt: new Date().toISOString(),
  };

  const success = await bookings.deliverBooking(sampleBooking);
  assert.equal(success, true);
  assert.equal(writes, 1);
  assert.equal(adminNotified, 1);
  assert.equal(userConfirmed, 1);
  assert.equal(telegramNotified, 1);
});
