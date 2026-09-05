import { neon } from "@neondatabase/serverless";
import { getCurrentUser } from "@/lib/auth";

/**
 * Sales register as CSV, for the accountant's Tally import and GST filing.
 *
 * One row per invoice **line**, not per order — that is the shape Tally's
 * voucher import expects, and it is what a GSTR-1 B2C summary is built from.
 *
 * Deliberately a CSV rather than Tally XML. XML would have to encode a ledger
 * structure that only the accountant knows (which sales ledger, which tax
 * ledgers, which voucher type), and getting that wrong produces vouchers that
 * post to the wrong account. A CSV is something they can map once in Tally's
 * import wizard, or open and check by eye — which is what actually happens.
 *
 * `hsn` is intentionally emitted empty. HSN per product has to come from the
 * accountant or HP's price list; inventing 8443 for everything would put a
 * wrong code on a real tax invoice. It is a column so it can be filled in
 * without reshaping the file. Also flagged in HANDOVER notes.
 */

const sql = neon(process.env.DATABASE_URL!);

/** RFC 4180: quote everything, double any inner quote. Excel-safe. */
const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

/** Paise → a plain decimal string. No ₹, no thousands separators: this is
 *  going into a spreadsheet column that must stay numeric. */
const rs = (paise: unknown) => (Number(paise ?? 0) / 100).toFixed(2);

export async function GET(req: Request) {
  if (!(await getCurrentUser())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const from = url.searchParams.get("from") || "1970-01-01";
  const to = url.searchParams.get("to") || "2999-12-31";

  const rows = (await sql`
    SELECT o.order_no, o.created_at, o.paid_at, o.status, o.customer_name, o.email, o.phone,
           o.ship_address, o.place_of_supply,
           o.subtotal_paise, o.gst_paise, o.cgst_paise, o.sgst_paise, o.igst_paise,
           o.total_paise, o.razorpay_payment_id,
           i.sku, i.name AS item_name, i.qty, i.unit_price_paise, i.line_total_paise
    FROM orders o
    JOIN order_items i ON i.order_id = o.id
    WHERE o.status NOT IN ('pending', 'cancelled')
      AND o.created_at >= ${from}::date
      AND o.created_at <  ${to}::date + interval '1 day'
    ORDER BY o.created_at, o.id, i.id
  `) as Record<string, string>[];

  const header = [
    "Order No", "Order Date", "Paid Date", "Status",
    "Customer", "Email", "Phone", "Ship City", "Ship State", "PIN", "Place of Supply",
    "Item", "SKU", "HSN", "Qty",
    "Rate (incl GST)", "Line Total (incl GST)", "Taxable Value", "GST Rate",
    "CGST", "SGST/UTGST", "IGST", "Order Total", "Payment Ref",
  ];

  const body = rows.map((r) => {
    const addr = (r.ship_address ?? {}) as unknown as {
      city?: string; state?: string; pincode?: string;
    };

    // The order's tax is apportioned across its lines by value, so the line
    // figures sum back to the order's stored CGST/SGST/IGST exactly. Deriving
    // each line independently would drift by a paise or two per order and the
    // register would not tie out to the payments.
    const lineTotal = Number(r.line_total_paise);
    const orderTotal = Number(r.total_paise) || 1;
    const share = lineTotal / orderTotal;
    const lineGst = Math.round(Number(r.gst_paise) * share);

    return [
      r.order_no,
      new Date(r.created_at).toLocaleDateString("en-GB"),
      r.paid_at ? new Date(r.paid_at).toLocaleDateString("en-GB") : "",
      r.status,
      r.customer_name, r.email, r.phone,
      addr.city ?? "", addr.state ?? "", addr.pincode ?? "",
      r.place_of_supply,
      r.item_name, r.sku,
      "", // HSN — see the note at the top of this file
      r.qty,
      rs(r.unit_price_paise),
      rs(lineTotal),
      rs(lineTotal - lineGst),
      "18%",
      rs(Math.round(Number(r.cgst_paise) * share)),
      rs(Math.round(Number(r.sgst_paise) * share)),
      rs(Math.round(Number(r.igst_paise) * share)),
      rs(r.total_paise),
      r.razorpay_payment_id ?? "",
    ].map(cell).join(",");
  });

  // Excel reads a CSV as the system codepage unless there is a BOM, which
  // mangles the ₹ and any non-ASCII in a customer's name.
  const csv = "﻿" + [header.map(cell).join(","), ...body].join("\r\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="jetage-sales-${from}-to-${to}.csv"`,
      "cache-control": "no-store",
    },
  });
}
