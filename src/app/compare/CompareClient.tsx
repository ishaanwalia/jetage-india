"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, X, MessageCircle, Share2, Check, Minus, Plus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCompare } from "@/context/CompareContext";
import { getProductById, Product } from "@/lib/data/products";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function parsePpm(speed: string): number {
  const match = speed.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function parseDuty(dutyCycle: string): number {
  const match = dutyCycle.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

interface Row {
  label: string;
  values: (p: Product) => string;
  /** index/indices of the winning product(s), or null when no winner applies */
  winners?: (list: Product[]) => number[];
}

const ROWS: Row[] = [
  {
    label: "Price",
    values: (p) => inr(p.price),
    winners: (list) => {
      const min = Math.min(...list.map((p) => p.price));
      return list.flatMap((p, i) => (p.price === min ? [i] : []));
    },
  },
  {
    label: "Print speed",
    values: (p) => (p.speed && p.speed !== "N/A" ? p.speed : "—"),
    winners: (list) => {
      const max = Math.max(...list.map((p) => parsePpm(p.speed)));
      if (max === 0) return [];
      return list.flatMap((p, i) => (parsePpm(p.speed) === max ? [i] : []));
    },
  },
  {
    label: "Auto duplex",
    values: (p) => (p.duplex ? "Yes" : "No"),
    winners: (list) =>
      list.some((p) => p.duplex) && !list.every((p) => p.duplex)
        ? list.flatMap((p, i) => (p.duplex ? [i] : []))
        : [],
  },
  {
    label: "Monthly duty cycle",
    values: (p) => p.dutyCycle || "—",
    winners: (list) => {
      const max = Math.max(...list.map((p) => parseDuty(p.dutyCycle)));
      if (max === 0) return [];
      return list.flatMap((p, i) => (parseDuty(p.dutyCycle) === max ? [i] : []));
    },
  },
  { label: "Connectivity", values: (p) => p.connectivity.join(", ") || "—" },
  { label: "Functions", values: (p) => p.specs?.["Functions"] || "—" },
  { label: "Paper size", values: (p) => p.specs?.["Paper Size"] || "—" },
  { label: "Resolution", values: (p) => p.resolution || "—" },
  { label: "Paper capacity", values: (p) => p.paperCapacity || "—" },
  { label: "First page out", values: (p) => p.firstPageOut || "—" },
  { label: "Warranty", values: (p) => p.warranty || "—" },
  { label: "Ideal for", values: (p) => p.idealFor || "—" },
];

export function CompareClient() {
  const { ids, remove, clear, toggle } = useCompare();
  const [hydrated, setHydrated] = useState(false);

  // Support deep links: /compare/?p=id1,id2,id3 seeds the selection.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get("p") || "")
      .split(",")
      .filter((id) => id && getProductById(id));
    if (fromUrl.length >= 2) {
      const current = new Set(ids);
      fromUrl.slice(0, 3).forEach((id) => {
        if (!current.has(id)) toggle(id);
      });
      ids.forEach((id) => {
        if (!fromUrl.includes(id)) remove(id);
      });
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = useMemo(
    () => ids.map((id) => getProductById(id)).filter((p): p is Product => Boolean(p)),
    [ids]
  );

  const shareUrl = `https://www.jetageindia.in/compare/?p=${ids.join(",")}`;
  const whatsappMessage = encodeURIComponent(
    [
      "Hi Jetage, I'm comparing these printers on your website:",
      "",
      ...items.map((p, i) => `${i + 1}. ${p.name} — ${inr(p.price)}`),
      "",
      `Comparison link: ${shareUrl}`,
      "",
      "Which one would you recommend for me? Please share your best price.",
    ].join("\n")
  );

  return (
    <main className="min-h-screen bg-jet-bg flex flex-col">
      <Navbar />

      <div className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20 mb-4">
              <Scale className="w-4 h-4" />
              Side-by-Side Comparison
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-jet-text">
              {items.length >= 2 ? "Spec for spec, honestly" : "Compare printers"}
            </h1>
          </div>

          {hydrated && items.length < 2 ? (
            <div className="text-center py-16 bg-jet-bg-card rounded-2xl border border-jet-border max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-jet-bg-elevated flex items-center justify-center mx-auto border border-jet-border mb-4">
                <Scale className="w-7 h-7 text-jet-text-muted" />
              </div>
              <p className="text-jet-text font-semibold mb-2">
                {items.length === 1 ? "Add one more printer to compare" : "Nothing to compare yet"}
              </p>
              <p className="text-jet-text-dim text-sm mb-6 max-w-sm mx-auto">
                Tap the <Plus className="w-3.5 h-3.5 inline -mt-0.5" /> compare button on any
                product card to add it here. Pick 2 or 3.
              </p>
              <Link
                href="/products/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-jet-primary text-white rounded-xl font-bold text-sm hover:bg-jet-primary-dim transition-all"
              >
                Browse printers
              </Link>
            </div>
          ) : items.length >= 2 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Product headers */}
              <div className="overflow-x-auto pb-2">
                <table className="w-full border-collapse min-w-[640px]">
                  <thead>
                    <tr>
                      <th className="w-40 md:w-48" aria-label="Specification" />
                      {items.map((p) => (
                        <th key={p.id} className="p-3 align-bottom">
                          <div className="relative bg-jet-bg-card rounded-2xl border border-jet-border p-4 text-center">
                            <button
                              onClick={() => remove(p.id)}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-jet-bg-elevated text-jet-text-muted flex items-center justify-center hover:text-red-500 transition-colors"
                              aria-label={`Remove ${p.shortName}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <Link href={`/products/${p.id}/`}>
                              <div className="h-28 flex items-center justify-center mb-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  loading="lazy"
                                  className="object-contain max-h-24 w-auto mx-auto"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://placehold.co/200x150/e2e8f0/64748b?text=${encodeURIComponent(p.shortName)}`;
                                  }}
                                />
                              </div>
                              <div className="font-bold text-sm text-jet-text leading-snug hover:text-jet-primary transition-colors">
                                {p.shortName}
                              </div>
                            </Link>
                            <div className="text-lg font-bold text-jet-text mt-1">{inr(p.price)}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((row) => {
                      const winners = row.winners ? row.winners(items) : [];
                      return (
                        <tr key={row.label} className="border-t border-jet-border">
                          <td className="py-3.5 pr-4 text-sm font-semibold text-jet-text-dim align-top">
                            {row.label}
                          </td>
                          {items.map((p, i) => {
                            const isWinner = winners.includes(i) && winners.length < items.length;
                            return (
                              <td key={p.id} className="py-3.5 px-3 text-sm align-top">
                                <span
                                  className={`inline-flex items-start gap-1.5 ${
                                    isWinner ? "text-jet-primary font-bold" : "text-jet-text"
                                  }`}
                                >
                                  {isWinner && <Check className="w-4 h-4 shrink-0 mt-0.5" />}
                                  {row.values(p)}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <a
                  href={`https://wa.me/919814958295?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-jet-whatsapp text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask which one suits me
                </a>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: "Printer comparison — Jetage India", url: shareUrl });
                    } else {
                      navigator.clipboard?.writeText(shareUrl);
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-jet-bg-card text-jet-primary border border-jet-primary/30 rounded-xl font-bold text-sm hover:bg-jet-primary hover:text-white transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share this comparison
                </button>
                <button
                  onClick={clear}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-jet-bg-elevated text-jet-text-muted border border-jet-border rounded-xl font-semibold text-sm hover:text-red-500 hover:border-red-500/30 transition-all"
                >
                  <Minus className="w-4 h-4" />
                  Clear all
                </button>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>

      <Footer />
    </main>
  );
}
