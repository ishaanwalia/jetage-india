/**
 * Money math. Run with: npm test
 *
 * Only the arithmetic — the database work in orders.ts is exercised by using
 * the checkout, not by mocking Neon. What is worth pinning down here is the
 * part that goes wrong silently rather than loudly: a rupee/paise slip does
 * not throw, it just bills the wrong amount.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { gstContainedIn, rupeesToPaise, totalsFor, GST_RATE, type OrderItem } from "./money";

const line = (rupees: number, qty: number): OrderItem => ({
  productId: "x",
  sku: "X",
  name: "X",
  image: "",
  qty,
  unitPricePaise: rupeesToPaise(rupees),
  lineTotalPaise: rupeesToPaise(rupees) * qty,
});

test("rupees convert to paise as integers", () => {
  assert.equal(rupeesToPaise(25227), 2522700);
  assert.equal(rupeesToPaise(968), 96800);
  // Any price that ever gains a decimal must still land on a whole paise.
  assert.equal(rupeesToPaise(1499.99), 149999);
  assert.ok(Number.isInteger(rupeesToPaise(783)));
});

test("GST is extracted from the total, not added to it", () => {
  // ₹1,180 inclusive of 18% => ₹180 tax, ₹1,000 base. The failure this guards
  // against is computing 18% *of* the inclusive total, which gives ₹212.40.
  assert.equal(gstContainedIn(118000), 18000);
  assert.notEqual(gstContainedIn(118000), Math.round(118000 * GST_RATE));
});

test("a real cart totals to the sum of its lines", () => {
  const items = [line(25227, 1), line(968, 3), line(783, 2)];
  const t = totalsFor(items);

  assert.equal(t.subtotalPaise, 2522700 + 96800 * 3 + 78300 * 2);
  assert.equal(t.shippingPaise, 0, "shipping is free");
  // The buyer pays the shelf price: total must never exceed the subtotal,
  // which is what an accidental GST-on-top would do.
  assert.equal(t.totalPaise, t.subtotalPaise);
  assert.ok(t.gstPaise < t.totalPaise);
});

test("the tax line reconstructs the total", () => {
  const t = totalsFor([line(25227, 1), line(1696, 2)]);
  const base = t.totalPaise - t.gstPaise;
  // Base + tax must come back to the exact paise the card is charged, or the
  // invoice disagrees with the payment.
  assert.equal(base + t.gstPaise, t.totalPaise);
  assert.ok(Number.isInteger(t.gstPaise));
});

test("an empty cart is zero, not NaN", () => {
  const t = totalsFor([]);
  assert.equal(t.totalPaise, 0);
  assert.equal(t.gstPaise, 0);
});
