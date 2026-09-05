import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getOrderById, adminGetEvents, adminSetStatus, formatPaise } from "@/lib/orders";

export const dynamic = "force-dynamic";

const NEXT_STATUS = ["paid", "packed", "shipped", "delivered", "cancelled", "refunded"];

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  const events = await adminGetEvents(orderId);
  const a = order.shipAddress;

  async function updateStatus(formData: FormData) {
    "use server";
    // The layout guard protects the UI; a server action is reachable without
    // it, so the session is re-checked here.
    if (!(await getCurrentUser())) redirect("/admin/login");
    await adminSetStatus(orderId, String(formData.get("status") ?? ""), String(formData.get("note") ?? ""));
    redirect(`/admin/orders/${orderId}?updated=1`);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-jet-text-muted hover:text-jet-primary">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-jet-text">{order.orderNo}</h1>
          <p className="mt-1 text-jet-text-muted capitalize">
            {order.status} · {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>
        <a
          href={`/order/${order.publicToken}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-jet-border px-4 py-2.5 text-sm font-medium text-jet-text-dim hover:border-jet-primary/40"
        >
          <ExternalLink className="h-4 w-4" /> Buyer&rsquo;s view
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-jet-border bg-white p-5">
          <h2 className="mb-3 font-semibold text-jet-text">Customer</h2>
          <p className="text-sm text-jet-text">{order.customerName}</p>
          <p className="text-sm text-jet-text-muted">
            <a href={`mailto:${order.email}`} className="hover:text-jet-primary">{order.email}</a>
          </p>
          <p className="text-sm text-jet-text-muted">
            <a href={`tel:${order.phone}`} className="hover:text-jet-primary">{order.phone}</a>
          </p>
          <address className="mt-3 not-italic text-sm leading-relaxed text-jet-text-dim">
            {a.line1}{a.line2 && <><br />{a.line2}</>}<br />
            {a.city}, {a.state} {a.pincode}
          </address>
          {order.note && (
            <p className="mt-3 rounded-lg bg-jet-bg-elevated px-3 py-2 text-sm text-jet-text-dim">
              <strong className="text-jet-text">Note:</strong> {order.note}
            </p>
          )}
        </section>

        <section className="rounded-xl border border-jet-border bg-white p-5">
          <h2 className="mb-3 font-semibold text-jet-text">Payment</h2>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-jet-text-muted">Subtotal</dt><dd>{formatPaise(order.subtotalPaise)}</dd></div>
            <div className="flex justify-between"><dt className="text-jet-text-muted">Delivery</dt><dd>Free</dd></div>
            <div className="flex justify-between"><dt className="text-jet-text-muted">GST inside total</dt><dd>{formatPaise(order.gstPaise)}</dd></div>
            <div className="flex justify-between border-t border-jet-border pt-2 font-bold"><dt>Total</dt><dd>{formatPaise(order.totalPaise)}</dd></div>
          </dl>
          <p className="mt-3 break-all text-xs text-jet-text-muted">
            Razorpay order: {order.razorpayOrderId ?? "—"}<br />
            Payment: {order.razorpayPaymentId ?? "—"}<br />
            Paid at: {order.paidAt ? new Date(order.paidAt).toLocaleString("en-IN") : "—"}
          </p>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-jet-border bg-white p-5">
        <h2 className="mb-3 font-semibold text-jet-text">Items</h2>
        <ul className="divide-y divide-jet-border">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-4 py-2.5 text-sm">
              <span className="text-jet-text">
                {i.name}
                <span className="block text-xs text-jet-text-muted">{i.sku} · Qty {i.qty} · {formatPaise(i.unitPricePaise)} each</span>
              </span>
              <span className="whitespace-nowrap font-semibold">{formatPaise(i.lineTotalPaise)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-jet-border bg-white p-5">
        <h2 className="mb-3 font-semibold text-jet-text">Update status</h2>
        <form action={updateStatus} className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="status" className="mb-1 block text-xs font-medium text-jet-text-muted">Status</label>
            <select id="status" name="status" defaultValue="packed" className="rounded-lg border border-jet-border px-3 py-2 text-sm">
              {NEXT_STATUS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="note" className="mb-1 block text-xs font-medium text-jet-text-muted">
              Note <span className="font-normal">(shown to the buyer)</span>
            </label>
            <input id="note" name="note" placeholder="e.g. Dispatched via Delhivery, AWB 1234" className="w-full rounded-lg border border-jet-border px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="rounded-lg bg-jet-primary px-5 py-2 text-sm font-semibold text-white hover:bg-jet-primary-dim">
            Update
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-jet-border bg-white p-5">
        <h2 className="mb-3 font-semibold text-jet-text">Timeline</h2>
        <ol className="space-y-2.5">
          {events.map((e, i) => (
            <li key={i} className="text-sm">
              <p className="text-jet-text">
                {e.note ?? e.type}
                {!e.is_public && <span className="ml-2 rounded bg-jet-bg-elevated px-1.5 py-0.5 text-xs text-jet-text-muted">internal</span>}
              </p>
              <p className="text-xs text-jet-text-muted">{new Date(e.created_at).toLocaleString("en-IN")}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
