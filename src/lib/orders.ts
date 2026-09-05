import "server-only";
import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import { rupeesToPaise, splitGst, type OrderItem, type OrderTotals } from "./money";

// Re-exported so server callers have one import for orders + money.
export { GST_RATE, gstContainedIn, rupeesToPaise, formatPaise, totalsFor, splitGst, SUPPLY_STATE } from "./money";
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
  buyerGstin: string | null;
  placeOfSupply: string;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
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
  buyerGstin?: string | null;
}): Promise<{ id: number; orderNo: string; publicToken: string }> {
  const orderNo = await nextOrderNo();
  // 256 bits. This token is the entirety of the buyer's authentication, so it
  // has to be unguessable rather than merely unique.
  const publicToken = randomBytes(32).toString("hex");

  // The place of supply is the delivery state, and it decides whether this is
  // a CGST+SGST sale or an IGST one. Frozen onto the row: it is a fact about
  // the sale on the day, and a later address edit must not restate the tax.
  const split = splitGst(input.totals.gstPaise, input.shipAddress.state);

  // One statement, so it is atomic.
  //
  // This used to be an INSERT followed by a loop of item inserts. Over the
  // HTTP driver each of those is a separate round trip with no transaction
  // around them, so a failure partway through left an order row with some of
  // its lines missing — and that order can still be paid. Chaining the writes
  // as CTEs means Postgres either applies all of it or none of it.
  const itemsJson = JSON.stringify(
    input.items.map((i) => ({
      product_id: i.productId,
      sku: i.sku,
      name: i.name,
      image: i.image,
      qty: i.qty,
      unit_price_paise: i.unitPricePaise,
      line_total_paise: i.lineTotalPaise,
    })),
  );

  const [order] = (await sql`
    WITH new_order AS (
      INSERT INTO orders (
        order_no, public_token, email, phone, customer_name, ship_address,
        subtotal_paise, gst_paise, shipping_paise, total_paise, note,
        place_of_supply, cgst_paise, sgst_paise, igst_paise, buyer_gstin
      ) VALUES (
        ${orderNo}, ${publicToken}, ${input.email}, ${input.phone}, ${input.customerName},
        ${JSON.stringify(input.shipAddress)},
        ${input.totals.subtotalPaise}, ${input.totals.gstPaise},
        ${input.totals.shippingPaise}, ${input.totals.totalPaise}, ${input.note ?? null},
        ${input.shipAddress.state}, ${split.cgstPaise}, ${split.sgstPaise}, ${split.igstPaise},
        ${input.buyerGstin ?? null}
      )
      RETURNING id, order_no, public_token
    ),
    new_items AS (
      INSERT INTO order_items
        (order_id, product_id, sku, name, image, qty, unit_price_paise, line_total_paise)
      SELECT o.id, x.product_id, x.sku, x.name, x.image, x.qty, x.unit_price_paise, x.line_total_paise
      FROM new_order o, jsonb_to_recordset(${itemsJson}::jsonb) AS x(
        product_id text, sku text, name text, image text,
        qty integer, unit_price_paise bigint, line_total_paise bigint
      )
    ),
    new_event AS (
      INSERT INTO order_events (order_id, type, note)
      SELECT id, 'placed', 'Order placed' FROM new_order
    )
    SELECT id, order_no, public_token FROM new_order
  `) as { id: number; order_no: string; public_token: string }[];

  return { id: order.id, orderNo: order.order_no, publicToken: order.public_token };
}

/**
 * How many orders this address has placed recently.
 *
 * Throttling is keyed on email rather than IP on purpose: an IP address is
 * personal data under the DPDP Act, and storing one to rate-limit would create
 * a new category of data to disclose and retain. The email is already on the
 * order.
 */
export async function recentOrderCount(email: string, minutes = 60): Promise<number> {
  const [row] = (await sql`
    SELECT count(*)::int AS n FROM orders
    WHERE lower(email) = lower(${email})
      AND created_at > now() - (${minutes} || ' minutes')::interval
  `) as { n: number }[];
  return row.n;
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
  buyer_gstin: string | null;
  place_of_supply: string;
  cgst_paise: string | number;
  sgst_paise: string | number;
  igst_paise: string | number;
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
  buyerGstin: r.buyer_gstin,
  placeOfSupply: r.place_of_supply,
  cgstPaise: Number(r.cgst_paise),
  sgstPaise: Number(r.sgst_paise),
  igstPaise: Number(r.igst_paise),
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

/**
 * The orders list, optionally filtered by status and free-text search.
 *
 * Search covers order number, name, email and phone, because those are the
 * four things a customer actually says on the phone — and the digits are
 * stripped from the phone on both sides, so "98149 58295" finds an order
 * stored as "9814958295".
 */
export async function adminListOrders(status = "", search = ""): Promise<AdminOrderRow[]> {
  const q = search.trim();
  const like = q ? `%${q.toLowerCase()}%` : null;
  // Only useful if the search actually looks like part of a number; a bare
  // "%%" here would match every row's phone and defeat the other clauses.
  const digits = q.replace(/[^0-9]/g, "");
  const phoneLike = digits.length >= 3 ? `%${digits}%` : null;

  const rows = (await sql`
    SELECT o.id, o.order_no, o.customer_name, o.email, o.phone, o.status,
           o.total_paise, o.created_at,
           (SELECT coalesce(sum(qty), 0) FROM order_items WHERE order_id = o.id) AS item_count
    FROM orders o
    WHERE (${status || null}::text IS NULL OR o.status = ${status || null})
      AND (
        ${like}::text IS NULL
        OR lower(o.order_no)      LIKE ${like}
        OR lower(o.customer_name) LIKE ${like}
        OR lower(o.email)         LIKE ${like}
        OR (${phoneLike}::text IS NOT NULL AND o.phone LIKE ${phoneLike})
      )
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
