"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import type { CategoryInfo, Product } from "@/lib/cms";

export const MAX_COMPARE = 3;

interface CompareContextType {
  ids: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  isFull: boolean;
  /** Full catalogue, fetched once server-side in the root layout — every
   *  client component that needs product data reads it from here instead of
   *  importing a static file or calling the (server-only) DB layer itself. */
  products: Product[];
  categories: CategoryInfo[];
  getProduct: (id: string) => Product | undefined;
}

const CompareContext = createContext<CompareContextType | null>(null);

const COMPARE_STORAGE_KEY = "jetage-compare";

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CompareProvider({
  children,
  products,
  categories,
}: {
  children: React.ReactNode;
  products: Product[];
  categories: CategoryInfo[];
}) {
  // Start empty and load after mount so server-rendered HTML always matches
  // the first client render (avoids hydration mismatches).
  const [ids, setIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIds(loadFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore storage errors
    }
  }, [ids, isHydrated]);

  const toggle = useCallback((productId: string) => {
    setIds((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, productId];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const getProduct = useCallback((id: string) => productMap.get(id), [productMap]);

  return (
    <CompareContext.Provider
      value={{
        ids,
        toggle,
        remove,
        clear,
        has,
        isFull: ids.length >= MAX_COMPARE,
        products,
        categories,
        getProduct,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
