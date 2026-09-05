import "server-only";
import { getOrderById, getOrdersByEmail, formatPaise, type Order } from "@/lib/orders";
import { sendMail, INTERNAL_RECIPIENTS } from "@/lib/mail";

/**
 * Order email.
 *
 * Plain template strings rather than a React Email component per message: a
 * receipt is a table and a total, and three more .tsx files to render one
 * would be machinery around nothing. `LeadNotification.tsx` stays as it is.
 *
 * Every address in these mails is escaped — a buyer's name goes into HTML we
 * send to ourselves, and a name with an angle bracket in it should not be able
 * to rewrite the counter's copy of the order.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jetageindia.in";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const orderUrl = (token: string) => `${SITE}/order/${token}/`;

function itemsTable(order: Order): string {
  const rows = order.items
    .map(
      (i) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee">
          ${esc(i.name)}<br><span style="color:#777;font-size:12px">${esc(i.sku)} &middot; Qty ${i.qty}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">
          ${formatPaise(i.lineTotalPaise)}
        </td>
      </tr>`,
    )
    .join("");

  return `<table style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows}
    <tr><td style="padding:12px 0 0">Subtotal</td>
        <td style="padding:12px 0 0;text-align:right">${formatPaise(order.subtotalPaise)}</td></tr>
    <tr><td style="padding:2px 0;color:#777">Delivery</td>
        <td style="padding:2px 0;text-align:right;color:#777">Free</td></tr>
    <tr><td style="padding:2px 0;color:#777">Includes GST (18%)</td>
        <td style="padding:2px 0;text-align:right;color:#777">${formatPaise(order.gstPaise)}</td></tr>
    <tr><td style="padding:10px 0;font-weight:700;border-top:2px solid #111">Total</td>
        <td style="padding:10px 0;text-align:right;font-weight:700;border-top:2px solid #111">
          ${formatPaise(order.totalPaise)}</td></tr>
  </table>`;
}

function shell(heading: string, intro: string, order: Order, cta: string): string {
  const a = order.shipAddress;
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
    <h1 style="font-size:20px;margin:0 0 4px">${esc(heading)}</h1>
    <p style="color:#555;margin:0 0 20px;font-size:14px">${intro}</p>
    <p style="font-size:14px;margin:0 0 20px">
      <strong>Order ${esc(order.orderNo)}</strong>
    </p>
    ${itemsTable(order)}
    <p style="font-size:13px;color:#555;line-height:1.6;margin:22px 0 0">
      <strong style="color:#111">Delivering to</strong><br>
      ${esc(order.customerName)}<br>
      ${esc(a.line1)}${a.line2 ? `<br>${esc(a.line2)}` : ""}<br>
      ${esc(a.city)}, ${esc(a.state)} ${esc(a.pincode)}<br>
      ${esc(order.phone)}
    </p>
    <p style="margin:24px 0">
      <a href="${orderUrl(order.publicToken)}"
         style="background:#111;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-size:14px;display:inline-block">
        ${esc(cta)}</a>
    </p>
    <p style="font-size:12px;color:#888;border-top:1px solid #eee;padding-top:14px;margin-top:24px">
      Jetage India &middot; Trusted since 1989<br>
      Keep this email — the link above is how you track this order.
    </p>
  </div>`;
}

function plain(order: Order, heading: string): string {
  return [
    heading,
    ``,
    `Order ${order.orderNo}`,
    ...order.items.map((i) => `  ${i.qty} x ${i.name} — ${formatPaise(i.lineTotalPaise)}`),
    ``,
    `Total: ${formatPaise(order.totalPaise)} (includes GST ${formatPaise(order.gstPaise)}, free delivery)`,
    ``,
    `Track this order: ${orderUrl(order.publicToken)}`,
  ].join("\n");
}

/** Sent as soon as the order row exists — before payment is attempted. */
export async function notifyOrderPlaced(orderId: number) {
  const order = await getOrderById(orderId);
  if (!order) return;

  await sendMail({
    to: order.email,
    subject: `Your Jetage order ${order.orderNo}`,
    text: plain(order, "Thanks — we have your order."),
    html: shell(
      "Thanks — we have your order.",
      "We'll confirm again as soon as payment is complete. If you closed the payment window, the counter will call you to finish it.",
      order,
      "Track this order",
    ),
  });

  await sendMail({
    to: INTERNAL_RECIPIENTS,
    replyTo: order.email,
    subject: `New order ${order.orderNo} — ${formatPaise(order.totalPaise)} (awaiting payment)`,
    text: plain(order, `New order from ${order.customerName} (${order.email}, ${order.phone})`),
    html: shell(
      `New order from ${order.customerName}`,
      `${esc(order.email)} &middot; ${esc(order.phone)} &middot; awaiting payment`,
      order,
      "Open order",
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
    text: plain(order, "Payment received. Your order is confirmed."),
    html: shell(
      "Payment received.",
      "Your order is confirmed and we're getting it ready. We'll email again when it ships.",
      order,
      "Track this order",
    ),
  });

  await sendMail({
    to: INTERNAL_RECIPIENTS,
    replyTo: order.email,
    subject: `PAID ${order.orderNo} — ${formatPaise(order.totalPaise)}`,
    text: plain(order, `Payment captured for ${order.customerName}`),
    html: shell(
      `Payment captured — ${order.customerName}`,
      `${esc(order.email)} &middot; ${esc(order.phone)}`,
      order,
      "Open order",
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
  const orders = await getOrdersByEmail(email);
  if (orders.length === 0) return;

  const rows = orders
    .map(
      (o) => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">
        <a href="${orderUrl(o.publicToken)}" style="color:#111;font-weight:600">${esc(o.orderNo)}</a><br>
        <span style="color:#777;font-size:12px">
          ${new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          &middot; ${esc(o.status)}</span>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-size:14px">
        ${formatPaise(o.totalPaise)}</td>
    </tr>`,
    )
    .join("");

  await sendMail({
    to: email,
    subject: `Your Jetage orders`,
    text: orders.map((o) => `${o.orderNo} — ${formatPaise(o.totalPaise)} — ${orderUrl(o.publicToken)}`).join("\n"),
    html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
      <h1 style="font-size:20px;margin:0 0 4px">Your orders</h1>
      <p style="color:#555;font-size:14px;margin:0 0 20px">
        Every order placed with this email address. These links don't expire — bookmark the ones you're watching.</p>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="font-size:12px;color:#888;border-top:1px solid #eee;padding-top:14px;margin-top:24px">
        Jetage India &middot; If you didn't ask for this email, you can ignore it.</p>
    </div>`,
  });
}
