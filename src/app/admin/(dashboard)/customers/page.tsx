import { adminListCustomers, formatPaise } from "@/lib/orders";

export const dynamic = "force-dynamic";

/**
 * Customers, derived from orders.
 *
 * No customers table exists and none should: with guest checkout the orders
 * are the customer record. A second table would be a second copy of the same
 * personal data to keep accurate and to erase on request.
 */
export default async function AdminCustomersPage() {
  const customers = await adminListCustomers();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-jet-primary">Sales</span>
        <h1 className="mt-2 text-3xl font-bold text-jet-text">Customers</h1>
        <p className="mt-2 text-jet-text-muted">
          {customers.length} {customers.length === 1 ? "person has" : "people have"} ordered. Grouped by email.
        </p>
      </div>

      {customers.length === 0 ? (
        <p className="rounded-xl border border-jet-border bg-white px-5 py-8 text-center text-jet-text-muted">
          Nobody has ordered yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-jet-border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-jet-border bg-jet-bg-elevated text-left">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-jet-text">Customer</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-jet-text">Orders</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-jet-text">Lifetime value</th>
                <th scope="col" className="px-4 py-3 font-semibold text-jet-text">Last order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.email} className="border-b border-jet-border last:border-0 hover:bg-jet-bg-elevated">
                  <td className="px-4 py-3">
                    <p className="font-medium text-jet-text">
                      {c.name}
                      {c.paidOrders > 1 && (
                        <span className="ml-2 rounded bg-jet-primary/10 px-1.5 py-0.5 text-xs font-semibold text-jet-primary">
                          repeat
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-jet-text-muted">
                      <a href={`mailto:${c.email}`} className="hover:text-jet-primary">{c.email}</a>
                      {" · "}
                      <a href={`tel:${c.phone}`} className="hover:text-jet-primary">{c.phone}</a>
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right text-jet-text">
                    {c.paidOrders}
                    {c.orders > c.paidOrders && (
                      <span className="block text-xs text-jet-text-muted">
                        +{c.orders - c.paidOrders} unpaid
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-jet-text whitespace-nowrap">
                    {formatPaise(c.lifetimePaise)}
                  </td>
                  <td className="px-4 py-3 text-jet-text-muted whitespace-nowrap">
                    {new Date(c.lastOrderAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
