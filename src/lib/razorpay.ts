import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Razorpay.
 *
 * No SDK. Order creation is one authenticated POST and the two signature
 * checks are HMACs — the `razorpay` npm package would add a dependency to wrap
 * `fetch` and `node:crypto`, both of which are already here.
 *
 * The whole point of this file is the webhook. A payment provider being wired
 * up is not a checkout: the gap is always order creation → hosted checkout →
 * *signature-verified webhook* → order marked paid → confirmation email.
 * Without the webhook, a buyer who closes the tab has a paid order that still
 * reads as pending, and a spoofed client callback can mark an unpaid one paid.
 *
 * Degrades deliberately: with no keys set the site still records the order and
 * tells the buyer the counter will call to collect payment. That keeps
 * checkout demonstrable before the live merchant account is switched on.
 */

export const razorpayConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

/** Safe to send to the browser — the key id is public by design. */
export const razorpayKeyId = () => process.env.RAZORPAY_KEY_ID ?? null;

type RazorpayOrder = { id: string; amount: number; currency: string; status: string };

/**
 * Creates the order at Razorpay. Amount is in paise, which is also how orders
 * are stored — no conversion here, so no rounding step to get wrong.
 */
export async function createRazorpayOrder(opts: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder | null> {
  if (!razorpayConfigured()) return null;

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Basic ${auth}` },
    body: JSON.stringify({
      amount: opts.amountPaise,
      currency: "INR",
      // Razorpay rejects receipts over 40 characters.
      receipt: opts.receipt.slice(0, 40),
      notes: opts.notes ?? {},
    }),
  });

  if (!res.ok) {
    throw new Error(`Razorpay order failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  return (await res.json()) as RazorpayOrder;
}

/** Constant-time compare that cannot throw on a length mismatch. */
function safeEqualHex(a: string, b: string) {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/**
 * Verifies the payload Razorpay Checkout hands back to the browser. This
 * confirms the browser is reporting a real payment — but it is NOT what marks
 * an order paid. It only decides whether to show the buyer a success screen.
 * The webhook is the source of truth, because the browser may never come back.
 */
export function verifyCheckoutSignature(p: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret)
    .update(`${p.razorpay_order_id}|${p.razorpay_payment_id}`)
    .digest("hex");
  return safeEqualHex(expected, p.razorpay_signature);
}

/**
 * Verifies a webhook. The HMAC is computed over the EXACT raw request body —
 * parsing and re-serialising the JSON first changes the bytes and the signature
 * will never match again, which is the classic reason webhooks "randomly" fail.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}
