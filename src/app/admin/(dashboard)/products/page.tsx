import Link from "next/link";
import { Plus, Search, Star } from "lucide-react";
import { adminListProducts } from "@/lib/cms";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saved?: string; deleted?: string }>;
}) {
  const { q = "", saved, deleted } = await searchParams;
  const products = await adminListProducts(q);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-jet-primary">Catalogue</span>
          <h1 className="mt-2 text-3xl font-bold text-jet-text">Products</h1>
          <p className="mt-2 text-jet-text-muted">{products.length} shown</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-jet-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-jet-primary-dim"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      {(saved || deleted) && (
        <p
          role="status"
          className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {saved ? "Product saved and published to the live site." : "Product deleted."}
        </p>
      )}

      {/* GET form, so the search term lives in the URL and survives a refresh. */}
      <form method="get" className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-jet-text-muted" />
          <label htmlFor="q" className="sr-only">
            Search products
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search by name, SKU, or spec…"
            className="w-full rounded-xl border border-jet-border bg-jet-bg-card py-3 pl-10 pr-4 text-sm focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary/20"
          />
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-jet-border bg-jet-bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-jet-border bg-jet-bg-elevated text-left">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold text-jet-text">Name</th>
                <th scope="col" className="px-5 py-3 font-semibold text-jet-text">Category</th>
                <th scope="col" className="px-5 py-3 font-semibold text-jet-text">Price</th>
                <th scope="col" className="px-5 py-3 font-semibold text-jet-text">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jet-border">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-jet-bg-elevated">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium text-jet-text hover:text-jet-primary"
                    >
                      {product.name}
                    </Link>
                    <span className="block text-xs text-jet-text-muted">/{product.id}</span>
                  </td>
                  <td className="px-5 py-3 capitalize text-jet-text-muted">
                    {product.category.replace(/-/g, " ")}
                  </td>
                  <td className="px-5 py-3 tabular-nums text-jet-text">{inr(product.price)}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          product.status === "draft"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.status === "draft" ? "Draft" : "Live"}
                      </span>
                      {product.featured && (
                        <Star className="h-3.5 w-3.5 fill-jet-primary text-jet-primary" />
                      )}
                    </span>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-jet-text-muted">
                    No products match &ldquo;{q}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
