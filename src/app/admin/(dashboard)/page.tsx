import Link from "next/link";
import { ArrowRight, FileText, Package, Plus, Star } from "lucide-react";
import { adminListBlogs, adminListProducts, getDashboardStats } from "@/lib/cms";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminDashboard() {
  const [stats, products, blogs, user] = await Promise.all([
    getDashboardStats(),
    adminListProducts(),
    adminListBlogs(),
    getCurrentUser(),
  ]);

  const recentProducts = products.slice(-5).reverse();
  const recentBlogs = blogs.slice(0, 5);

  const tiles = [
    { label: "Products", value: Number(stats.products), sub: `${stats.product_drafts} drafts`, href: "/admin/products" },
    { label: "Featured", value: Number(stats.featured), sub: "on the homepage", href: "/admin/products" },
    { label: "Articles", value: Number(stats.blogs), sub: `${stats.blog_drafts} drafts`, href: "/admin/blogs" },
    { label: "Categories", value: Number(stats.categories), sub: "product groups", href: "/admin/products" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-jet-primary">Overview</span>
        <h1 className="mt-2 text-3xl font-bold text-jet-text">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-2 text-jet-text-muted">
          Everything published here goes live on the site within a second — no redeploy needed.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="rounded-2xl border border-jet-border bg-jet-bg-card p-5 transition-shadow hover:shadow-premium-hover"
          >
            <p className="text-sm text-jet-text-muted">{tile.label}</p>
            <p className="mt-2 text-3xl font-bold text-jet-text">{tile.value}</p>
            <p className="mt-1 text-xs text-jet-text-muted">{tile.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-jet-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-jet-primary-dim"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-jet-primary px-5 py-3 text-sm font-semibold text-jet-primary transition-colors hover:bg-jet-primary hover:text-white"
        >
          <Plus className="h-4 w-4" /> New article
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentPanel
          title="Recently added products"
          href="/admin/products"
          icon={<Package className="h-4 w-4" />}
          items={recentProducts.map((p) => ({
            id: p.id,
            href: `/admin/products/${p.id}`,
            title: p.name,
            meta: p.category.replace(/-/g, " "),
            badge: p.status === "draft" ? "Draft" : p.featured ? "Featured" : null,
          }))}
        />
        <RecentPanel
          title="Recent articles"
          href="/admin/blogs"
          icon={<FileText className="h-4 w-4" />}
          items={recentBlogs.map((b) => ({
            id: b.slug,
            href: `/admin/blogs/${b.slug}`,
            title: b.title,
            meta: b.date,
            badge: b.status === "draft" ? "Draft" : b.featured ? "Featured" : null,
          }))}
        />
      </div>
    </div>
  );
}

function RecentPanel({
  title,
  href,
  icon,
  items,
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
  items: { id: string; href: string; title: string; meta: string; badge: string | null }[];
}) {
  return (
    <section className="rounded-2xl border border-jet-border bg-jet-bg-card">
      <header className="flex items-center justify-between border-b border-jet-border px-5 py-4">
        <h2 className="flex items-center gap-2 font-semibold text-jet-text">
          {icon} {title}
        </h2>
        <Link href={href} className="text-sm font-medium text-jet-primary hover:underline">
          View all
        </Link>
      </header>
      <ul className="divide-y divide-jet-border">
        {items.length === 0 && <li className="px-5 py-6 text-sm text-jet-text-muted">Nothing yet.</li>}
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-jet-bg-elevated"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-jet-text">
                  {item.title}
                </span>
                <span className="block truncate text-xs capitalize text-jet-text-muted">
                  {item.meta}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      item.badge === "Draft"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-jet-primary/10 text-jet-primary"
                    }`}
                  >
                    {item.badge === "Featured" && <Star className="mr-0.5 inline h-2.5 w-2.5" />}
                    {item.badge}
                  </span>
                )}
                <ArrowRight className="h-4 w-4 text-jet-border-strong" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
