import { neon } from "@neondatabase/serverless";
import { getCurrentUser } from "@/lib/auth";
import { formatTaxDate } from "@/lib/dates";
import { apportionGst } from "@/lib/money";

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
 * The HSN column carries whatever was snapshotted onto the order line at the
 * sale. It is blank for anything sold before a code was set on the product, and
 * blank now for any product that still has none — deliberately, because HSN has
 * to come from the accountant or HP's price list, and inventing 8443 for
 * everything would put a wrong code on a real tax invoice. Codes are set per
 * product in the CMS, or in the HSN column of the bulk sheet.
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
    SELECT o.invoice_no, o.order_no, o.created_at, o.paid_at, o.status, o.customer_name, o.email, o.phone,
           o.ship_address, o.place_of_supply, o.buyer_gstin,
           o.subtotal_paise, o.gst_paise, o.cgst_paise, o.sgst_paise, o.igst_paise,
           o.total_paise, o.razorpay_payment_id,
           i.sku, i.hsn, i.name AS item_name, i.qty, i.unit_price_paise, i.line_total_paise
    FROM orders o
    JOIN order_items i ON i.order_id = o.id
    WHERE o.status NOT IN ('pending', 'cancelled')
      AND o.created_at >= ${from}::date
      AND o.created_at <  ${to}::date + interval '1 day'
    ORDER BY o.created_at, o.id, i.id
  `) as Record<string, string>[];

  const header = [
    "Invoice No", "Order No", "Order Date", "Paid Date", "Status",
    "Customer", "Buyer GSTIN", "Email", "Phone", "Ship City", "Ship State", "PIN", "Place of Supply",
    "Item", "SKU", "HSN", "Qty",
    "Rate (incl GST)", "Line Total (incl GST)", "Taxable Value", "GST Rate",
    "CGST", "SGST/UTGST", "IGST", "Order Total", "Payment Ref",
  ];

  /**
   * Fold the flat join back into orders, so every line takes its share of the
   * tax from the same helper the invoice uses.
   *
   * This used to round each line independently against its share of the order
   * total, which the comment here claimed summed back exactly and did not —
   * roundings are under no obligation to add up. A register that is a paise
   * off the payments it is meant to explain is a morning of somebody's life,
   * and the invoice for the same sale would have shown different figures.
   * apportionGst gives the last line the residual, so both documents reconcile
   * to the order by construction and to each other by using one function.
   */
  const lineTaxOf = new Map<
    (typeof rows)[number],
    { taxable: number; gst: number; cgst: number; sgst: number; igst: number }
  >();

  const byOrder = new Map<string, (typeof rows)[number][]>();
  for (const r of rows) {
    const lines = byOrder.get(r.order_no) ?? [];
    lines.push(r);
    byOrder.set(r.order_no, lines);
  }

  for (const lines of byOrder.values()) {
    const totals = lines.map((r) => Number(r.line_total_paise));
    // Every head is apportioned the same way. Two of the three are always zero
    // — a sale is either intra-state or inter-state, never both.
    const gst = apportionGst(totals, Number(lines[0].gst_paise));
    const cgst = apportionGst(totals, Number(lines[0].cgst_paise));
    const sgst = apportionGst(totals, Number(lines[0].sgst_paise));
    const igst = apportionGst(totals, Number(lines[0].igst_paise));
    lines.forEach((r, i) =>
      lineTaxOf.set(r, {
        taxable: gst[i].taxablePaise,
        gst: gst[i].gstPaise,
        cgst: cgst[i].gstPaise,
        sgst: sgst[i].gstPaise,
        igst: igst[i].gstPaise,
      }),
    );
  }

  const body = rows.map((r) => {
    const addr = (r.ship_address ?? {}) as unknown as {
      city?: string; state?: string; pincode?: string;
    };

    const lineTotal = Number(r.line_total_paise);
    const tax = lineTaxOf.get(r)!;

    return [
      r.invoice_no ?? "",
      r.order_no,
      formatTaxDate(r.created_at),
      r.paid_at ? formatTaxDate(r.paid_at) : "",
      r.status,
      r.customer_name, r.buyer_gstin ?? "", r.email, r.phone,
      addr.city ?? "", addr.state ?? "", addr.pincode ?? "",
      r.place_of_supply,
      r.item_name, r.sku,
      r.hsn ?? "", // blank when the product carries no code — see the note above
      r.qty,
      rs(r.unit_price_paise),
      rs(lineTotal),
      rs(tax.taxable),
      "18%",
      rs(tax.cgst),
      rs(tax.sgst),
      rs(tax.igst),
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
