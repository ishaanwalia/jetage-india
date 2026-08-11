"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Newspaper, Package, Settings } from "lucide-react";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/admin": LayoutDashboard,
  "/admin/products": Package,
  "/admin/blogs": Newspaper,
  "/admin/settings": Settings,
};

export default function AdminNav({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4" aria-label="CMS sections">
      {items.map(({ href, label }) => {
        const Icon = icons[href] ?? LayoutDashboard;
        // Exact match for the dashboard root, prefix match for the rest.
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-white/10 text-jet-accent" : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
