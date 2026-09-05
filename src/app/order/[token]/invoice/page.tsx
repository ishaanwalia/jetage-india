import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByToken, formatPaise } from "@/lib/orders";
import { SELLER, sellerIsInvoiceReady } from "@/lib/business";
import { PrintButton } from "./PrintButton";

/**
 * The tax invoice, as a printable page.
 *
 * Print-to-PDF rather than a PDF library. Every browser and every phone can
 * already save a page as PDF, it renders identically for the buyer and the
 * accountant, and it costs no dependency — `@react-pdf/renderer` would add
 * several megabytes to produce the same A4 sheet.
 *
 * Only rendered once the order is actually paid and the seller GSTIN is
 * configured. An invoice for an unpaid order is a document claiming money
 * changed hands when it has not.
 */

export const metadata: Metadata = {
  title: "Tax invoice",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();

  if (!sellerIsInvoiceReady()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="mb-3 text-2xl font-bold text-jet-text">Invoice not available yet</h1>
        <p className="text-jet-text-dim">
          We can&rsquo;t issue a tax invoice until our GSTIN is configured. Please call{" "}
          <a href="tel:+919814958295" className="font-medium text-jet-primary hover:underline">
            +91 98149 58295
          </a>{" "}
          and we&rsquo;ll email it to you.
        </p>
      </div>
    );
  }

  if (order.status === "pending" || order.status === "cancelled") {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="mb-3 text-2xl font-bold text-jet-text">No invoice for this order</h1>
        <p className="text-jet-text-dim">
          An invoice is issued once payment is received. This order is {order.status}.
        </p>
      </div>
    );
  }

  const taxable = order.totalPaise - order.gstPaise;
  const intraState = order.igstPaise === 0;
  const a = order.shipAddress;

  return (
    <div className="mx-auto max-w-[820px] px-6 py-10 print:px-0 print:py-0">
      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <article className="border border-jet-border bg-white p-8 text-[13px] leading-relaxed text-black print:border-0 print:p-0">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b-2 border-black pb-4">
          <div>
            <h1 className="text-xl font-bold">{SELLER.legalName}</h1>
            <p className="text-[12px] text-neutral-600">trading as {SELLER.tradingAs}</p>
            <address className="mt-2 not-italic text-[12px]">
              {SELLER.address.map((line) => <span key={line} className="block">{line}</span>)}
              <span className="block">{SELLER.phone} · {SELLER.email}</span>
            </address>
            <p className="mt-2 text-[12px]">
              <strong>GSTIN:</strong> {SELLER.gstin}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold uppercase tracking-wide">Tax Invoice</p>
            <p className="mt-2 text-[12px]"><strong>Order:</strong> {order.orderNo}</p>
            <p className="text-[12px]">
              <strong>Date:</strong>{" "}
              {new Date(order.paidAt ?? order.createdAt).toLocaleDateString("en-GB")}
            </p>
            {order.razorpayPaymentId && (
              <p className="text-[12px]"><strong>Payment:</strong> {order.razorpayPaymentId}</p>
            )}
          </div>
        </header>

        <section className="mb-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Billed to
            </h2>
            <address className="not-italic">
              <strong>{order.customerName}</strong><br />
              {a.line1}{a.line2 && <><br />{a.line2}</>}<br />
              {a.city}, {a.state} {a.pincode}<br />
              {order.phone}
              {order.buyerGstin && (
                <><br /><strong>GSTIN:</strong> {order.buyerGstin}</>
              )}
            </address>
          </div>
          <div className="sm:text-right">
            <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Place of supply
            </h2>
            <p>{order.placeOfSupply || a.state}</p>
            <p className="mt-1 text-[12px] text-neutral-600">
              {intraState ? "Intra-state supply — CGST + SGST/UTGST" : "Inter-state supply — IGST"}
            </p>
          </div>
        </section>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-y border-black text-[11px] uppercase tracking-wider">
              <th scope="col" className="py-2 pr-2 font-bold">Description</th>
              <th scope="col" className="py-2 px-2 font-bold">HSN</th>
              <th scope="col" className="py-2 px-2 text-right font-bold">Qty</th>
              <th scope="col" className="py-2 px-2 text-right font-bold">Rate</th>
              <th scope="col" className="py-2 pl-2 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i, idx) => (
              <tr key={idx} className="border-b border-neutral-200 align-top">
                <td className="py-2 pr-2">
                  {i.name}
                  <span className="block text-[11px] text-neutral-500">{i.sku}</span>
                </td>
                {/* Blank until HSN codes are entered per product — an invented
                    code on a real tax invoice is worse than an empty cell. */}
                <td className="py-2 px-2 text-neutral-400">—</td>
                <td className="py-2 px-2 text-right">{i.qty}</td>
                <td className="py-2 px-2 text-right">{formatPaise(i.unitPricePaise)}</td>
                <td className="py-2 pl-2 text-right">{formatPaise(i.lineTotalPaise)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="mt-4 flex justify-end">
          <dl className="w-full max-w-xs space-y-1">
            <div className="flex justify-between">
              <dt>Taxable value</dt><dd>{formatPaise(taxable)}</dd>
            </div>
            {intraState ? (
              <>
                <div className="flex justify-between">
                  <dt>CGST @ 9%</dt><dd>{formatPaise(order.cgstPaise)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>SGST/UTGST @ 9%</dt><dd>{formatPaise(order.sgstPaise)}</dd>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <dt>IGST @ 18%</dt><dd>{formatPaise(order.igstPaise)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Delivery</dt><dd>Free</dd>
            </div>
            <div className="flex justify-between border-t-2 border-black pt-2 text-base font-bold">
              <dt>Total</dt><dd>{formatPaise(order.totalPaise)}</dd>
            </div>
          </dl>
        </section>

        <footer className="mt-8 border-t border-neutral-300 pt-4 text-[11px] text-neutral-600">
          <p>
            Prices are inclusive of GST. This is a computer-generated invoice and does not
            require a signature.
          </p>
          <p className="mt-1">
            Goods once sold are covered by the manufacturer&rsquo;s warranty. See
            jetageindia.in/warranty for details.
          </p>
        </footer>
      </article>
    </div>
  );
}
