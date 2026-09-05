import "server-only";
import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import { rupeesToPaise, type OrderItem, type OrderTotals } from "./money";

// Re-exported so server callers have one import for orders + money.
export { GST_RATE, gstContainedIn, rupeesToPaise, formatPaise, totalsFor } from "./money";
export type { OrderItem, OrderTotals } from "./money";

/**
 * Orders: money, creation, and lookup.
 *
 * Two rules hold this together.
 *
 * 1. **Prices come from the database, never from the cart.** The browser sends
 *    product ids and quantities; everything with a rupee sign attached is read
 *    back from `products` server-side. A cart lives in localStorage, so a
 *    posted price is a number the buyer can edit.
 *
 * 2. **Money is integer paise.** The catalogue stores whole rupees; the ×100
 *    happens once, here, at order creation. Razorpay charges in paise, so
 *    there is no second conversion anywhere and no float to round wrongly.
 */

const sql = neon(process.env.DATABASE_URL!);

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface Order {
  id: number;
  orderNo: string;
  publicToken: string;
  email: string;
  phone: string;
  customerName: string;
  shipAddress: ShipAddress;
  status: string;
  subtotalPaise: number;
  gstPaise: number;
  shippingPaise: number;
  totalPaise: number;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  note: string | null;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
}

export interface ShipAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

/**
 * Turns a posted cart into priced lines, reading every price from the database.
 *
 * Quantities are clamped rather than rejected: a buyer who fat-fingers 999 into
 * a quantity box should see a sane cart, not an error page. Unknown or
 * unpublished product ids are dropped silently — they cannot be bought, and
 * naming them tells a prober which ids exist.
 */
export async function priceCart(lines: CartLine[]): Promise<OrderItem[]> {
  const ids = [...new Set(lines.map((l) => l.productId))].filter(Boolean);
  if (ids.length === 0) return [];

  const rows = (await sql`
    SELECT id, name, sku, price, image
    FROM products
    WHERE id = ANY(${ids}) AND status = 'published'
  `) as { id: string; name: string; sku: string; price: number; image: string }[];

  const byId = new Map(rows.map((r) => [r.id, r]));
  const items: OrderItem[] = [];

  for (const line of lines) {
    const p = byId.get(line.productId);
    if (!p) continue;
    const qty = Math.min(Math.max(Math.floor(line.quantity) || 0, 1), 99);
    const unit = rupeesToPaise(p.price);
    items.push({
      productId: p.id,
      sku: p.sku,
      name: p.name,
      image: p.image,
      qty,
      unitPricePaise: unit,
      lineTotalPaise: unit * qty,
    });
  }
  return items;
}

/** JI-26-000123 — quotable over the phone, which is how these get chased up. */
async function nextOrderNo(): Promise<string> {
  const [{ n }] = (await sql`SELECT nextval('order_no_seq')::int AS n`) as { n: number }[];
  const yy = String(new Date().getFullYear()).slice(-2);
  return `JI-${yy}-${String(n).padStart(6, "0")}`;
}

export async function createOrder(input: {
  items: OrderItem[];
  totals: OrderTotals;
  email: string;
  phone: string;
  customerName: string;
  shipAddress: ShipAddress;
  note?: string;
}): Promise<{ id: number; orderNo: string; publicToken: string }> {
  const orderNo = await nextOrderNo();
  // 256 bits. This token is the entirety of the buyer's authentication, so it
  // has to be unguessable rather than merely unique.
  const publicToken = randomBytes(32).toString("hex");

  const [order] = (await sql`
    INSERT INTO orders (
      order_no, public_token, email, phone, customer_name, ship_address,
      subtotal_paise, gst_paise, shipping_paise, total_paise, note
    ) VALUES (
      ${orderNo}, ${publicToken}, ${input.email}, ${input.phone}, ${input.customerName},
      ${JSON.stringify(input.shipAddress)},
      ${input.totals.subtotalPaise}, ${input.totals.gstPaise},
      ${input.totals.shippingPaise}, ${input.totals.totalPaise}, ${input.note ?? null}
    )
    RETURNING id, order_no, public_token
  `) as { id: number; order_no: string; public_token: string }[];

  for (const i of input.items) {
    await sql`
      INSERT INTO order_items (order_id, product_id, sku, name, image, qty, unit_price_paise, line_total_paise)
      VALUES (${order.id}, ${i.productId}, ${i.sku}, ${i.name}, ${i.image}, ${i.qty},
              ${i.unitPricePaise}, ${i.lineTotalPaise})
    `;
  }

  await addOrderEvent(order.id, "placed", { note: "Order placed" });

  return { id: order.id, orderNo: order.order_no, publicToken: order.public_token };
}

export async function addOrderEvent(
  orderId: number,
  type: string,
  opts: { note?: string; isPublic?: boolean } = {},
) {
  await sql`
    INSERT INTO order_events (order_id, type, note, is_public)
    VALUES (${orderId}, ${type}, ${opts.note ?? null}, ${opts.isPublic ?? true})
  `;
}

export async function attachRazorpayOrder(orderId: number, razorpayOrderId: string) {
  await sql`
    UPDATE orders SET razorpay_order_id = ${razorpayOrderId}, updated_at = now()
    WHERE id = ${orderId}
  `;
}

/* ------------------------------------------------------------------ reads -- */

type OrderRow = {
  id: number;
  order_no: string;
  public_token: string;
  email: string;
  phone: string;
  customer_name: string;
  ship_address: ShipAddress;
  status: string;
  subtotal_paise: string | number;
  gst_paise: string | number;
  shipping_paise: string | number;
  total_paise: string | number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  note: string | null;
  created_at: string;
  paid_at: string | null;
};

// bigint columns arrive from the driver as strings. Coercing at the boundary
// keeps Number() out of every call site — and every one of those is a place
// someone would otherwise forget.
const toOrder = (r: OrderRow, items: OrderItem[]): Order => ({
  id: r.id,
  orderNo: r.order_no,
  publicToken: r.public_token,
  email: r.email,
  phone: r.phone,
  customerName: r.customer_name,
  shipAddress: r.ship_address,
  status: r.status,
  subtotalPaise: Number(r.subtotal_paise),
  gstPaise: Number(r.gst_paise),
  shippingPaise: Number(r.shipping_paise),
  totalPaise: Number(r.total_paise),
  razorpayOrderId: r.razorpay_order_id,
  razorpayPaymentId: r.razorpay_payment_id,
  note: r.note,
  createdAt: r.created_at,
  paidAt: r.paid_at,
  items,
});

async function itemsFor(orderId: number): Promise<OrderItem[]> {
  const rows = (await sql`
    SELECT product_id, sku, name, image, qty, unit_price_paise, line_total_paise
    FROM order_items WHERE order_id = ${orderId} ORDER BY id
  `) as {
    product_id: string | null;
    sku: string;
    name: string;
    image: string;
    qty: number;
    unit_price_paise: string;
    line_total_paise: string;
  }[];
  return rows.map((r) => ({
    productId: r.product_id,
    sku: r.sku,
    name: r.name,
    image: r.image,
    qty: r.qty,
    unitPricePaise: Number(r.unit_price_paise),
    lineTotalPaise: Number(r.line_total_paise),
  }));
}

export async function getOrderByToken(token: string): Promise<Order | null> {
  // Length-check first: without it any string reaches the database as a
  // lookup, which turns this public endpoint into a free query generator.
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const rows = (await sql`SELECT * FROM orders WHERE public_token = ${token}`) as OrderRow[];
  if (!rows[0]) return null;
  return toOrder(rows[0], await itemsFor(rows[0].id));
}

export async function getOrderById(id: number): Promise<Order | null> {
  const rows = (await sql`SELECT * FROM orders WHERE id = ${id}`) as OrderRow[];
  if (!rows[0]) return null;
  return toOrder(rows[0], await itemsFor(rows[0].id));
}

/** Used by the "email me my orders" flow. Newest first, capped. */
export async function getOrdersByEmail(
  email: string,
): Promise<{ orderNo: string; publicToken: string; totalPaise: number; status: string; createdAt: string }[]> {
  const rows = (await sql`
    SELECT order_no, public_token, total_paise, status, created_at
    FROM orders WHERE lower(email) = lower(${email})
    ORDER BY created_at DESC LIMIT 50
  `) as { order_no: string; public_token: string; total_paise: string; status: string; created_at: string }[];
  return rows.map((r) => ({
    orderNo: r.order_no,
    publicToken: r.public_token,
    totalPaise: Number(r.total_paise),
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function getPublicEvents(orderId: number) {
  return (await sql`
    SELECT type, note, created_at FROM order_events
    WHERE order_id = ${orderId} AND is_public
    ORDER BY created_at
  `) as { type: string; note: string | null; created_at: string }[];
}

/* ------------------------------------------------------------------ admin -- */

export type AdminOrderRow = {
  id: number;
  orderNo: string;
  customerName: string;
  email: string;
  phone: string;
  status: string;
  totalPaise: number;
  itemCount: number;
  createdAt: string;
};

export async function adminListOrders(status = ""): Promise<AdminOrderRow[]> {
  const rows = (await sql`
    SELECT o.id, o.order_no, o.customer_name, o.email, o.phone, o.status,
           o.total_paise, o.created_at,
           (SELECT coalesce(sum(qty), 0) FROM order_items WHERE order_id = o.id) AS item_count
    FROM orders o
    WHERE ${status || null}::text IS NULL OR o.status = ${status || null}
    ORDER BY o.created_at DESC
    LIMIT 200
  `) as Record<string, string>[];

  return rows.map((r) => ({
    id: Number(r.id),
    orderNo: r.order_no,
    customerName: r.customer_name,
    email: r.email,
    phone: r.phone,
    status: r.status,
    totalPaise: Number(r.total_paise),
    itemCount: Number(r.item_count),
    createdAt: r.created_at,
  }));
}

/** Every event on an order, internal notes included. Admin only. */
export async function adminGetEvents(orderId: number) {
  return (await sql`
    SELECT type, note, is_public, created_at FROM order_events
    WHERE order_id = ${orderId} ORDER BY created_at
  `) as { type: string; note: string | null; is_public: boolean; created_at: string }[];
}

export async function adminSetStatus(orderId: number, status: string, note?: string) {
  // Whitelist rather than trusting the posted value — this reaches a CHECK
  // constraint either way, but a 500 is a worse answer than doing nothing.
  const allowed = ["pending", "paid", "packed", "shipped", "delivered", "cancelled", "refunded"];
  if (!allowed.includes(status)) return;

  await sql`UPDATE orders SET status = ${status}, updated_at = now() WHERE id = ${orderId}`;
  await addOrderEvent(orderId, status, { note: note?.trim() || `Marked ${status}` });
}

export type CustomerRow = {
  email: string;
  name: string;
  phone: string;
  orders: number;
  paidOrders: number;
  lifetimePaise: number;
  lastOrderAt: string;
};

/**
 * The customer list, derived from orders rather than stored.
 *
 * There is no customers table on purpose: with guest checkout the orders *are*
 * the customer record, and a separate table would be a second copy of the same
 * personal data to keep correct and to delete on request. Lifetime value
 * counts paid orders only — an abandoned checkout is not revenue.
 */
export async function adminListCustomers(): Promise<CustomerRow[]> {
  const rows = (await sql`
    SELECT lower(email)                                                    AS email,
           (array_agg(customer_name ORDER BY created_at DESC))[1]          AS name,
           (array_agg(phone         ORDER BY created_at DESC))[1]          AS phone,
           count(*)                                                        AS orders,
           count(*) FILTER (WHERE status NOT IN ('pending','cancelled'))   AS paid_orders,
           coalesce(sum(total_paise) FILTER
             (WHERE status NOT IN ('pending','cancelled')), 0)             AS lifetime_paise,
           max(created_at)                                                 AS last_order_at
    FROM orders
    GROUP BY lower(email)
    ORDER BY max(created_at) DESC
    LIMIT 500
  `) as Record<string, string>[];

  return rows.map((r) => ({
    email: r.email,
    name: r.name,
    phone: r.phone,
    orders: Number(r.orders),
    paidOrders: Number(r.paid_orders),
    lifetimePaise: Number(r.lifetime_paise),
    lastOrderAt: r.last_order_at,
  }));
}

/** Headline numbers for the CMS dashboard. */
export async function getOrderStats() {
  const [s] = (await sql`
    SELECT count(*)                                          AS total,
           count(*) FILTER (WHERE status = 'pending')        AS pending,
           count(*) FILTER (WHERE status = 'paid')           AS paid,
           coalesce(sum(total_paise) FILTER
             (WHERE status NOT IN ('pending','cancelled')), 0) AS revenue_paise
    FROM orders
  `) as Record<string, string>[];
  return {
    total: Number(s.total),
    pending: Number(s.pending),
    paid: Number(s.paid),
    revenuePaise: Number(s.revenue_paise),
  };
}
