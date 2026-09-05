import Link from "next/link";
import { Download, Search } from "lucide-react";
import { adminListOrders, formatPaise } from "@/lib/orders";

const FILTERS = ["", "pending", "paid", "packed", "shipped", "delivered", "cancelled"] as const;

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  paid: "bg-green-50 text-green-800 border-green-200",
  packed: "bg-blue-50 text-blue-800 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-800 border-indigo-200",
  delivered: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-red-50 text-red-700 border-red-200",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; updated?: string; q?: string }>;
}) {
  const { status = "", updated, q = "" } = await searchParams;
  const orders = await adminListOrders(status, q);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-jet-primary">Sales</span>
          <h1 className="mt-2 text-3xl font-bold text-jet-text">Orders</h1>
          <p className="mt-2 text-jet-text-muted">{orders.length} shown</p>
        </div>
        {/* Plain link, not a form: the accountant wants this monthly and a
            bookmarkable URL with dates in it is the whole feature. */}
        <a
          href="/admin/orders-export"
          className="inline-flex items-center gap-2 rounded-xl border border-jet-border bg-white px-5 py-3 text-sm font-semibold text-jet-text-dim transition-colors hover:border-jet-primary/40 hover:text-jet-primary"
        >
          <Download className="h-4 w-4" /> Sales register (CSV)
        </a>
      </div>

      {updated && (
        <p role="status" className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Order updated.
        </p>
      )}

      {/* GET, so the search lives in the URL and survives a refresh — and the
          desk can bookmark or send a link to a specific customer's orders. */}
      <form method="get" className="mb-4">
        {status && <input type="hidden" name="status" value={status} />}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-jet-text-muted" aria-hidden />
          <label htmlFor="q" className="sr-only">Search orders</label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Order number, name, email or phone"
            className="w-full rounded-xl border border-jet-border bg-white py-3 pl-10 pr-4 text-sm text-jet-text placeholder:text-jet-text-muted focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary"
          />
        </div>
      </form>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f || "all"}
            // Keep the search term when switching status, or filtering
            // silently throws away what they just typed.
            href={
              f
                ? `/admin/orders?status=${f}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                : q
                  ? `/admin/orders?q=${encodeURIComponent(q)}`
                  : "/admin/orders"
            }
            aria-current={status === f ? "page" : undefined}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              status === f
                ? "border-jet-primary bg-jet-primary text-white"
                : "border-jet-border bg-white text-jet-text-dim hover:border-jet-primary/40"
            }`}
          >
            {f || "All"}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-jet-border bg-white px-5 py-8 text-center text-jet-text-muted">
          {q ? `Nothing matches "${q}".` : `No orders ${status ? `with status "${status}"` : ""} yet.`}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-jet-border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-jet-border bg-jet-bg-elevated text-left">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-jet-text">Order</th>
                <th scope="col" className="px-4 py-3 font-semibold text-jet-text">Customer</th>
                <th scope="col" className="px-4 py-3 font-semibold text-jet-text">Status</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-jet-text">Total</th>
                <th scope="col" className="px-4 py-3 font-semibold text-jet-text">Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-jet-border last:border-0 hover:bg-jet-bg-elevated">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-semibold text-jet-primary hover:underline">
                      {o.orderNo}
                    </Link>
                    <p className="text-xs text-jet-text-muted">{o.itemCount} item{o.itemCount === 1 ? "" : "s"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-jet-text">{o.customerName}</p>
                    <p className="text-xs text-jet-text-muted">{o.email} · {o.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[o.status] ?? ""}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-jet-text whitespace-nowrap">
                    {formatPaise(o.totalPaise)}
                  </td>
                  <td className="px-4 py-3 text-jet-text-muted whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
