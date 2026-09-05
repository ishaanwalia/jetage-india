import "server-only";
import { createHash } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { render } from "@react-email/render";
import { getOrderById, getOrdersByEmail, formatPaise, type Order } from "@/lib/orders";
import { sendMail, INTERNAL_RECIPIENTS } from "@/lib/mail";
import { OrderEmail } from "@/emails/OrderEmail";
import { OrderLinksEmail } from "@/emails/OrderLinksEmail";

/**
 * Order email.
 *
 * Rendered from React Email components in `src/emails/`, the same way the
 * enquiry notification is — one house style across everything that leaves
 * info@jetageindia.in, and React escapes every interpolated value, so a
 * buyer's name cannot inject markup into the counter's copy of the order.
 *
 * Every message still carries a plain-text part. Some clients prefer it, some
 * corporate filters strip HTML outright, and a receipt that arrives blank is
 * worse than a plain one.
 */

const sql = neon(process.env.DATABASE_URL!);

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jetageindia.in";
const orderUrl = (token: string) => `${SITE}/order/${token}/`;
const invoiceUrl = (token: string) => `${SITE}/order/${token}/invoice/`;

/**
 * Takes a send slot, or refuses. Returns true if the caller may send.
 *
 * In the database rather than in memory because this runs on serverless: each
 * instance has its own memory, several are warm at once, and an in-process Map
 * would let the limit be bypassed simply by arriving at a different one.
 *
 * The key is hashed. This table's job is to prevent abuse, and it should not
 * become a second list of every address that has touched the site.
 */
async function claimEmailSlot(key: string, minutes: number): Promise<boolean> {
  const hash = createHash("sha256").update(key).digest("hex");
  // One statement, so two simultaneous requests cannot both win: the second
  // one's WHERE clause sees the first one's timestamp.
  const rows = (await sql`
    INSERT INTO email_throttle (key_hash, last_sent_at) VALUES (${hash}, now())
    ON CONFLICT (key_hash) DO UPDATE SET last_sent_at = now()
    WHERE email_throttle.last_sent_at < now() - (${minutes} || ' minutes')::interval
    RETURNING key_hash
  `) as { key_hash: string }[];
  return rows.length > 0;
}

/** The text/plain alternative. Every HTML mail below ships with one. */
function plain(order: Order, heading: string, withInvoice = false): string {
  return [
    heading,
    ``,
    `Order ${order.orderNo}`,
    ...order.items.map((i) => `  ${i.qty} x ${i.name} — ${formatPaise(i.lineTotalPaise)}`),
    ``,
    `Total: ${formatPaise(order.totalPaise)} (includes GST ${formatPaise(order.gstPaise)}, free delivery)`,
    ``,
    `Track this order: ${orderUrl(order.publicToken)}`,
    ...(withInvoice ? [`Tax invoice: ${invoiceUrl(order.publicToken)}`] : []),
  ].join("\n");
}

/** The props both recipients share — only the wording differs. */
function baseProps(order: Order) {
  return {
    orderNo: order.orderNo,
    items: order.items.map((i) => ({
      name: i.name,
      sku: i.sku,
      qty: i.qty,
      lineTotalPaise: i.lineTotalPaise,
    })),
    subtotalPaise: order.subtotalPaise,
    gstPaise: order.gstPaise,
    totalPaise: order.totalPaise,
    customerName: order.customerName,
    phone: order.phone,
    address: order.shipAddress,
    buyerGstin: order.buyerGstin,
    ctaUrl: orderUrl(order.publicToken),
  };
}

/** Sent as soon as the order row exists — before payment is attempted. */
export async function notifyOrderPlaced(orderId: number) {
  const order = await getOrderById(orderId);
  if (!order) return;

  await sendMail({
    to: order.email,
    subject: `Your Jetage order ${order.orderNo}`,
    text: plain(order, "Thanks — we have your order."),
    html: await render(
      <OrderEmail
        {...baseProps(order)}
        heading="Thanks — we have your order"
        intro="We'll confirm again as soon as payment is complete. If you closed the payment window, the counter will call you to finish it."
        ctaLabel="Track this order"
      />,
    ),
  });

  await sendMail({
    to: INTERNAL_RECIPIENTS,
    replyTo: order.email,
    subject: `New order ${order.orderNo} — ${formatPaise(order.totalPaise)} (awaiting payment)`,
    text: plain(order, `New order from ${order.customerName} (${order.email}, ${order.phone})`),
    html: await render(
      <OrderEmail
        {...baseProps(order)}
        heading={`New order — ${order.customerName}`}
        intro={`${order.email} · ${order.phone} · awaiting payment. Call them if it stays unpaid.`}
        ctaLabel="Open order"
      />,
    ),
  });
}

/** Sent from the webhook, once the payment is actually captured. */
export async function notifyOrderPaid(orderId: number) {
  const order = await getOrderById(orderId);
  if (!order) return;

  await sendMail({
    to: order.email,
    subject: `Payment received — Jetage order ${order.orderNo}`,
    text: plain(order, "Payment received. Your order is confirmed.", true),
    html: await render(
      <OrderEmail
        {...baseProps(order)}
        heading="Payment received"
        intro="Your order is confirmed and we're getting it ready. We'll email again when it ships."
        ctaLabel="Track this order"
        invoiceUrl={invoiceUrl(order.publicToken)}
      />,
    ),
  });

  await sendMail({
    to: INTERNAL_RECIPIENTS,
    replyTo: order.email,
    subject: `PAID ${order.orderNo} — ${formatPaise(order.totalPaise)}`,
    text: plain(order, `Payment captured for ${order.customerName}`, true),
    html: await render(
      <OrderEmail
        {...baseProps(order)}
        heading={`Paid — ${order.customerName}`}
        intro={`${order.email} · ${order.phone} · ready to pack.`}
        ctaLabel="Open order"
        invoiceUrl={invoiceUrl(order.publicToken)}
      />,
    ),
  });
}

/**
 * The whole of "log in and see my orders": we email the links.
 *
 * Controlling the inbox is the authentication, which is what a password reset
 * reduces to anyway — so there is no password here, no session, and no reset
 * flow to support. Returns void deliberately: the caller must give the same
 * answer whether or not the address is known, or this becomes a way to test
 * which email addresses have bought from us.
 */
export async function emailOrderLinks(email: string): Promise<void> {
  // Throttle first, before touching anything else.
  //
  // This form is unauthenticated and makes the server send mail, so without a
  // limit anyone can point a loop at it and use Jetage's mailbox to hammer a
  // customer's inbox — and burn the sending reputation of the domain that also
  // carries the order confirmations. One mail per address per ten minutes is
  // far more than a real person needs.
  if (!(await claimEmailSlot(`orderlinks:${email.toLowerCase()}`, 10))) return;

  const orders = await getOrdersByEmail(email);
  if (orders.length === 0) return;

  const rows = orders.map((o) => ({
    orderNo: o.orderNo,
    url: orderUrl(o.publicToken),
    totalPaise: o.totalPaise,
    status: o.status,
    createdAt: o.createdAt,
  }));

  await sendMail({
    to: email,
    subject: "Your Jetage orders",
    text: rows.map((o) => `${o.orderNo} — ${formatPaise(o.totalPaise)} — ${o.url}`).join("\n"),
    html: await render(<OrderLinksEmail orders={rows} />),
  });
}
