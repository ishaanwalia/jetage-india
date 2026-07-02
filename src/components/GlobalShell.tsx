"use client";

import { CartDrawer } from "@/components/CartDrawer";

export function GlobalShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}
