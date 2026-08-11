import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, Newspaper, Package, Settings, ExternalLink } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "../actions";
import AdminNav from "./AdminNav";

/**
 * Guarded CMS shell.
 *
 * The guard sits in the layout so every page beneath it inherits it, and the
 * login route deliberately lives outside this group — putting it inside would
 * make the redirect loop on itself. Each server action re-checks the session
 * independently; this guard protects the UI, not the endpoints.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "CMS | Jetage India" },
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/blogs", label: "Articles" },
  { href: "/admin/settings", label: "Settings" },
];

const mobileIcons = [LayoutDashboard, Package, Newspaper, Settings];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-[100dvh] bg-jet-bg-elevated">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-jet-border bg-jet-navy lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-jet-primary text-sm font-bold text-white">
            J
          </span>
          <span className="font-semibold text-white">CMS</span>
        </div>

        <AdminNav items={navItems} />

        <div className="mt-auto space-y-3 border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <div className="px-3 pb-1">
            <p className="truncate text-xs text-white/40">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-red-500/15 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
        {/* Mobile bar — the sidebar is desktop-only. */}
        <header className="flex h-16 items-center justify-between border-b border-jet-border bg-jet-bg-card px-4 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-jet-primary text-sm font-bold text-white">
              J
            </span>
            <span className="font-semibold text-jet-text">CMS</span>
          </Link>
          <nav className="flex gap-1">
            {navItems.map(({ href, label }, i) => {
              const Icon = mobileIcons[i];
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  className="rounded-lg p-2 text-jet-text-muted hover:bg-jet-bg-elevated hover:text-jet-primary"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
