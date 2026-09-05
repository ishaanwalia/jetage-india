import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import { SELLER } from "@/lib/business";
import { PrintButton } from "@/app/order/[token]/invoice/PrintButton";

/**
 * Packing slip — what goes in the parcel, and the label that goes on it.
 *
 * Deliberately **no prices**. A packing slip is checked by whoever packs the
 * box and often read by whoever receives it; the money belongs on the invoice,
 * which the buyer already has by email. Printing amounts on the outside of a
 * parcel is also how a courier learns which boxes are worth ₹25,000.
 *
 * Big tick boxes and big quantities because this is read at arm's length over
 * a counter, not on a monitor. One A4 sheet: the top half is the address label
 * to cut out and tape on, the bottom half is the contents to check against.
 */

export const dynamic = "force-dynamic";

export const metadata = { title: "Packing slip", robots: { index: false, follow: false } };

export default async function PackingSlipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  const a = order.shipAddress;
  const totalUnits = order.items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="mx-auto max-w-[800px]">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <a href={`/admin/orders/${orderId}`} className="text-sm text-jet-text-muted hover:text-jet-primary">
          ← Back to order
        </a>
        <PrintButton />
      </div>

      <article className="border border-jet-border bg-white p-8 text-black print:border-0 print:p-0">
        {/* ---- the bit you cut out and stick on the parcel ---- */}
        <section className="border-2 border-dashed border-neutral-400 p-6 print:border-black">
          <div className="mb-4 flex items-start justify-between gap-6">
            <div className="text-[11px] leading-snug text-neutral-600">
              <strong className="text-black">From</strong><br />
              {SELLER.legalName}<br />
              {SELLER.address.join(", ")}<br />
              {SELLER.phone}
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Order</p>
              <p className="text-xl font-bold">{order.orderNo}</p>
            </div>
          </div>

          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Deliver to
          </p>
          {/* Oversized on purpose — this is the bit a courier reads. */}
          <address className="not-italic text-[19px] font-semibold leading-snug">
            {order.customerName}<br />
            {a.line1}
            {a.line2 && <><br />{a.line2}</>}
            <br />
            {a.city}, {a.state}
            <br />
            <span className="text-[24px] font-bold tracking-wide">{a.pincode}</span>
            <br />
            <span className="text-[17px]">{order.phone}</span>
          </address>
        </section>

        {/* ---- the bit the packer checks against ---- */}
        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <h1 className="text-lg font-bold">Packing slip</h1>
            <p className="text-[12px] text-neutral-600">
              {order.items.length} line{order.items.length === 1 ? "" : "s"} · {totalUnits} unit
              {totalUnits === 1 ? "" : "s"}
            </p>
          </div>

          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-y border-black text-[11px] uppercase tracking-wider">
                <th scope="col" className="w-12 py-2 pr-2 font-bold">✓</th>
                <th scope="col" className="py-2 pr-2 font-bold">Item</th>
                <th scope="col" className="py-2 px-2 font-bold">SKU</th>
                <th scope="col" className="w-20 py-2 pl-2 text-right font-bold">Qty</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((i, idx) => (
                <tr key={idx} className="border-b border-neutral-200">
                  <td className="py-3 pr-2">
                    <span className="inline-block h-5 w-5 border-2 border-neutral-500" aria-hidden />
                  </td>
                  <td className="py-3 pr-2">{i.name}</td>
                  <td className="py-3 px-2 font-mono text-[12px] text-neutral-600">{i.sku}</td>
                  <td className="py-3 pl-2 text-right text-[18px] font-bold">{i.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {order.note && (
            <p className="mt-4 border-l-4 border-black bg-neutral-100 px-4 py-3 text-[13px]">
              <strong>Delivery note from the customer:</strong> {order.note}
            </p>
          )}

          {order.buyerGstin && (
            <p className="mt-4 text-[12px]">
              <strong>Business order.</strong> Buyer GSTIN {order.buyerGstin} — the tax invoice
              must go in the parcel.
            </p>
          )}

          <div className="mt-8 flex gap-10 text-[12px] text-neutral-600">
            <span>Packed by ______________________</span>
            <span>Date ______________</span>
          </div>
        </section>
      </article>
    </div>
  );
}
