"use client";

import { CartDrawer } from "@/components/CartDrawer";
import { CompareTray } from "@/components/CompareTray";
import { CompareProvider } from "@/context/CompareContext";
import type { CategoryInfo, Product } from "@/lib/cms";

export function GlobalShell({
  children,
  products,
  categories,
}: {
  children: React.ReactNode;
  products: Product[];
  categories: CategoryInfo[];
}) {
  return (
    <CompareProvider products={products} categories={categories}>
      {children}
      <CartDrawer />
      <CompareTray />
    </CompareProvider>
  );
}
