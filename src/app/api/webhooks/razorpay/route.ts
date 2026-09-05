import { NextResponse, after } from "next/server";
import { neon } from "@neondatabase/serverless";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { addOrderEvent } from "@/lib/orders";
import { notifyOrderPaid } from "@/lib/order-mail";

/**
 * Razorpay webhook. This — not the browser — is what marks an order paid.
 *
 * Three things here are load-bearing:
 *
 * 1. The signature is computed over the RAW body. `req.json()` would parse and
 *    discard the exact bytes, and the HMAC would never match again. This is
 *    the usual reason webhooks "randomly" fail.
 * 2. It is idempotent. Razorpay retries on any non-2xx and can deliver the
 *    same event twice; marking an order paid must be safe to repeat, and the
 *    confirmation email must not go out twice.
 * 3. Once the signature is valid it always returns 200, even if our own
 *    follow-up work fails. A non-2xx makes Razorpay retry for hours over a
 *    problem that is ours, not theirs.
 */

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    // Never say more than this — a detailed error tells a prober what to fix.
    console.warn("[razorpay] rejected webhook with bad or missing signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  const rzpOrderId = payment?.order_id;
  if (!rzpOrderId) return NextResponse.json({ ok: true, ignored: "no order id" });

  try {
    if (event.event === "payment.captured" || event.event === "order.paid") {
      // Idempotent by construction: the WHERE clause only matches an order
      // still pending, so a replayed event updates no rows — and the email
      // below never fires a second time.
      const updated = (await sql`
        UPDATE orders
        SET status = 'paid',
            razorpay_payment_id = ${payment?.id ?? null},
            paid_at = now(),
            updated_at = now()
        WHERE razorpay_order_id = ${rzpOrderId} AND status = 'pending'
        RETURNING id, order_no
      `) as { id: number; order_no: string }[];

      const order = updated[0];
      if (!order) return NextResponse.json({ ok: true, duplicate: true });

      await addOrderEvent(order.id, "paid", { note: "Payment received" });

      // After the 200, not before it. Razorpay gives a webhook only a few
      // seconds before it calls the delivery failed and starts retrying — and
      // an SMTP handshake here has been measured at ten. Holding the response
      // open for the email is how you turn one payment into a retry storm.
      after(async () => {
        await notifyOrderPaid(order.id).catch((err) =>
          console.error("[razorpay] confirmation email failed", err),
        );
      });
    }

    if (event.event === "payment.failed") {
      const rows = (await sql`
        SELECT id FROM orders WHERE razorpay_order_id = ${rzpOrderId} LIMIT 1
      `) as { id: number }[];
      if (rows[0]) {
        // Internal only. A failed attempt is normal — a buyer retrying with a
        // second card should not see "payment failed" on their timeline.
        await addOrderEvent(rows[0].id, "payment_failed", {
          note: "A payment attempt failed",
          isPublic: false,
        });
      }
    }
  } catch (err) {
    // Our problem, not Razorpay's. Log loudly, acknowledge, reconcile by hand.
    console.error("[razorpay] webhook processing failed", err);
  }

  return NextResponse.json({ ok: true });
}

/** Razorpay only ever POSTs here. Answering a GET makes a mistyped URL obvious
 *  in the dashboard instead of looking like a dead endpoint. */
export function GET() {
  return NextResponse.json({ ok: true, endpoint: "razorpay webhook", method: "POST" });
}
