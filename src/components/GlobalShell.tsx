"use client";

import { CartDrawer } from "@/components/CartDrawer";
import { CompareTray } from "@/components/CompareTray";
import { CompareProvider } from "@/context/CompareContext";

export function GlobalShell({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      {children}
      <CartDrawer />
      <CompareTray />
    </CompareProvider>
  );
}
