import test from "node:test";
import assert from "node:assert/strict";

import { formatDate, formatDateTime, formatTaxDate } from "./dates";
import { financialYear } from "./fy";

// 20:00 UTC on the 8th is 01:30 IST on the 9th. Every assertion below uses a
// moment in that window, because that window is the bug: it is the only time
// the two timezones disagree about the date, and it is five and a half hours
// of every single day.
const LATE_NIGHT = new Date("2026-09-08T20:00:00Z");

test("a late-night order is filed under the Indian date, not the UTC one", () => {
  assert.equal(formatTaxDate(LATE_NIGHT), "09/09/2026");
  // en-IN abbreviates September as "Sept" — which is what the admin tables
  // already printed, so this helper changes the timezone and nothing else.
  assert.equal(formatDate(LATE_NIGHT), "9 Sept 2026");
});

test("the tax date is the form both documents print", () => {
  // Invoice and sales register are read side by side; dd/mm/yyyy in both.
  assert.equal(formatTaxDate(new Date("2026-04-01T06:00:00Z")), "01/04/2026");
  assert.equal(formatTaxDate("2026-12-25T18:30:00Z"), "26/12/2026");
});

test("date and time carry the same shift", () => {
  const s = formatDateTime(LATE_NIGHT);
  assert.match(s, /9 Sept 2026/);
  assert.match(s, /1:30/);
});

test("options still pass through, and stay in IST", () => {
  assert.equal(
    formatDate(LATE_NIGHT, { day: "numeric", month: "long", year: "numeric" }),
    "9 September 2026",
  );
});

test("the financial year turns over at Indian midnight, not UTC's", () => {
  // 19:30 UTC on 31 March is 01:00 IST on 1 April — the first sale of the new
  // year. Read in UTC it lands in the year that just closed, which is a number
  // out of the wrong series in the one place an officer looks.
  assert.equal(financialYear(new Date("2027-03-31T19:30:00Z")), "27-28");
  // And the other side of it: 18:00 UTC on 31 March is still 23:30 IST on the
  // 31st, so it belongs to the closing year.
  assert.equal(financialYear(new Date("2027-03-31T18:00:00Z")), "26-27");
});
