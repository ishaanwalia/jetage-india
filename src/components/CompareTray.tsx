"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, ArrowRight } from "lucide-react";
import { useCompare, MAX_COMPARE } from "@/context/CompareContext";
import { getProductById } from "@/lib/data/products";

export function CompareTray() {
  const { ids, remove, clear } = useCompare();
  const pathname = usePathname();

  // The tray duplicates controls that already exist on the compare page itself.
  const hidden = ids.length === 0 || pathname.startsWith("/compare");

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-4"
        >
          <div className="max-w-2xl mx-auto flex items-center gap-3 p-3 bg-jet-bg-card rounded-2xl border border-jet-border-strong shadow-premium-hover">
            <div className="hidden sm:flex items-center gap-2 pl-2 pr-1 text-jet-primary">
              <Scale className="w-5 h-5" />
              <span className="text-sm font-bold whitespace-nowrap">
                {ids.length}/{MAX_COMPARE}
              </span>
            </div>

            <div className="flex-1 flex items-center gap-2 overflow-x-auto">
              {ids.map((id) => {
                const product = getProductById(id);
                if (!product) return null;
                return (
                  <div
                    key={id}
                    className="relative shrink-0 w-14 h-14 bg-jet-bg-elevated rounded-xl border border-jet-border flex items-center justify-center"
                    title={product.shortName}
                  >
                    <img
                      src={product.image}
                      alt={product.shortName}
                      className="object-contain max-h-11 w-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/100x100/e2e8f0/64748b?text=${encodeURIComponent(product.shortName.slice(0, 8))}`;
                      }}
                    />
                    <button
                      onClick={() => remove(id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-jet-navy text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                      aria-label={`Remove ${product.shortName} from comparison`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={clear}
              className="hidden sm:block text-xs font-semibold text-jet-text-muted hover:text-red-500 transition-colors whitespace-nowrap"
            >
              Clear
            </button>

            <Link
              href="/compare/"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                ids.length >= 2
                  ? "bg-jet-primary text-white hover:bg-jet-primary-dim"
                  : "bg-jet-bg-elevated text-jet-text-muted pointer-events-none"
              }`}
            >
              Compare
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
