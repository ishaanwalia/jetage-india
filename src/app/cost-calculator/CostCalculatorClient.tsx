"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, MessageCircle, TrendingDown, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { threeYearTotals } from "@/lib/finder";
import { getProductById } from "@/lib/data/products";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function CostCalculatorClient() {
  const [pagesPerMonth, setPagesPerMonth] = useState(300);
  const [colorPercent, setColorPercent] = useState(20);

  const totals = useMemo(
    () => threeYearTotals(pagesPerMonth, colorPercent / 100),
    [pagesPerMonth, colorPercent]
  );

  const sorted = [...totals].sort((a, b) => a.total - b.total);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];
  const savings = mostExpensive.total - cheapest.total;
  const maxTotal = mostExpensive.total;
  const winnerProduct = getProductById(cheapest.tech.exampleProductId);

  const whatsappMessage = encodeURIComponent(
    [
      "Hi Jetage, I used the Cost Calculator on your website.",
      "",
      `My printing: ~${pagesPerMonth.toLocaleString("en-IN")} pages/month, ${colorPercent}% colour.`,
      `Best option for me: ${cheapest.tech.name} — approx ${inr(cheapest.total)} total over 3 years.`,
      winnerProduct ? `Suggested model: ${winnerProduct.name}` : "",
      "",
      "Please share your best price and availability.",
    ]
      .filter(Boolean)
      .join("\n")
  );

  return (
    <main className="min-h-screen bg-jet-bg flex flex-col">
      <Navbar />

      <div className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20 mb-4">
              <Calculator className="w-4 h-4" />
              True Cost Calculator
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-jet-text mb-3">
              The sticker price is half the story
            </h1>
            <p className="text-jet-text-dim max-w-xl mx-auto">
              Ink and toner decide what a printer really costs. Slide to your monthly
              printing and see the honest 3-year comparison.
            </p>
          </div>

          {/* Controls */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div className="p-6 bg-jet-bg-card rounded-2xl border border-jet-border">
              <div className="flex items-baseline justify-between mb-4">
                <label htmlFor="pages" className="text-sm font-semibold text-jet-text-dim">
                  Pages per month
                </label>
                <span className="text-2xl font-bold text-jet-text tabular-nums">
                  {pagesPerMonth.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                id="pages"
                type="range"
                min={50}
                max={3000}
                step={50}
                value={pagesPerMonth}
                onChange={(e) => setPagesPerMonth(Number(e.target.value))}
                className="w-full accent-[#0891b2]"
              />
              <div className="flex justify-between text-xs text-jet-text-muted mt-2">
                <span>50</span>
                <span>3,000</span>
              </div>
            </div>

            <div className="p-6 bg-jet-bg-card rounded-2xl border border-jet-border">
              <div className="flex items-baseline justify-between mb-4">
                <label htmlFor="color" className="text-sm font-semibold text-jet-text-dim">
                  Colour printing
                </label>
                <span className="text-2xl font-bold text-jet-text tabular-nums">{colorPercent}%</span>
              </div>
              <input
                id="color"
                type="range"
                min={0}
                max={100}
                step={5}
                value={colorPercent}
                onChange={(e) => setColorPercent(Number(e.target.value))}
                className="w-full accent-[#0891b2]"
              />
              <div className="flex justify-between text-xs text-jet-text-muted mt-2">
                <span>All B&W</span>
                <span>All colour</span>
              </div>
            </div>
          </div>

          {/* Savings headline */}
          <motion.div
            key={savings}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-10 p-6 bg-jet-primary/5 rounded-2xl border border-jet-primary/20"
          >
            <div className="inline-flex items-center gap-2 text-jet-primary text-sm font-semibold mb-1">
              <TrendingDown className="w-4 h-4" />
              Choosing right saves you
            </div>
            <div className="text-4xl md:text-5xl font-bold text-jet-text tabular-nums">
              {inr(savings)}
            </div>
            <div className="text-sm text-jet-text-dim mt-1">
              over 3 years — {cheapest.tech.name} vs {mostExpensive.tech.name} at your volume
            </div>
          </motion.div>

          {/* Comparison bars */}
          <div className="space-y-5 mb-12">
            {totals.map((t) => {
              const isWinner = t.tech.id === cheapest.tech.id;
              const barWidth = Math.max(8, (t.total / maxTotal) * 100);
              const purchaseWidth = (t.purchase / t.total) * 100;
              return (
                <div
                  key={t.tech.id}
                  className={`p-5 rounded-2xl border-2 bg-jet-bg-card ${
                    isWinner ? "border-jet-primary" : "border-jet-border"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                    <div>
                      <span className="font-bold text-jet-text">{t.tech.name}</span>
                      <span className="text-xs text-jet-text-muted ml-2">{t.tech.tagline}</span>
                      {isWinner && (
                        <span className="ml-3 px-2.5 py-0.5 bg-jet-primary text-white text-xs font-bold rounded-full">
                          Cheapest overall
                        </span>
                      )}
                    </div>
                    <span className="text-xl font-bold text-jet-text tabular-nums">{inr(t.total)}</span>
                  </div>
                  <div className="h-4 rounded-full bg-jet-bg-elevated overflow-hidden">
                    <motion.div
                      className="h-full rounded-full flex overflow-hidden"
                      initial={false}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ type: "spring", stiffness: 90, damping: 20 }}
                    >
                      <div className="h-full bg-jet-navy/70" style={{ width: `${purchaseWidth}%` }} />
                      <div className="h-full flex-1 bg-gradient-to-r from-jet-primary to-jet-accent" />
                    </motion.div>
                  </div>
                  <div className="flex gap-5 mt-2 text-xs text-jet-text-dim">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-jet-navy/70 inline-block" />
                      Printer {inr(t.purchase)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-jet-primary inline-block" />
                      Ink / toner {inr(t.consumables)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Winner CTA */}
          {winnerProduct && (
            <div className="flex flex-col sm:flex-row items-center gap-5 p-6 bg-jet-bg-card rounded-2xl border border-jet-border mb-8">
              <Link
                href={`/products/${winnerProduct.id}/`}
                className="shrink-0 w-28 h-28 bg-jet-bg-elevated rounded-xl border border-jet-border flex items-center justify-center overflow-hidden"
              >
                <img
                  src={winnerProduct.image}
                  alt={winnerProduct.name}
                  loading="lazy"
                  className="object-contain max-h-24 w-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/300x200/e2e8f0/64748b?text=${encodeURIComponent(winnerProduct.shortName)}`;
                  }}
                />
              </Link>
              <div className="flex-1 text-center sm:text-left">
                <div className="text-xs font-semibold text-jet-primary uppercase tracking-wide mb-1">
                  Our pick for your usage
                </div>
                <Link href={`/products/${winnerProduct.id}/`}>
                  <h3 className="font-bold text-jet-text hover:text-jet-primary transition-colors">
                    {winnerProduct.name}
                  </h3>
                </Link>
                <div className="text-lg font-bold text-jet-text mt-1">
                  {inr(winnerProduct.price)}
                  <span className="text-sm text-jet-text-muted line-through ml-2">
                    {inr(winnerProduct.mrp)}
                  </span>
                </div>
              </div>
              <Link
                href={`/products/${winnerProduct.id}/`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-jet-bg-elevated text-jet-primary border border-jet-primary/30 rounded-xl font-semibold text-sm hover:bg-jet-primary hover:text-white transition-all"
              >
                View printer
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/919814958295?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-jet-whatsapp text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Get my best price on WhatsApp
            </a>
            <Link
              href="/finder/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-jet-bg-card text-jet-primary border border-jet-primary/30 rounded-xl font-bold text-sm hover:bg-jet-primary hover:text-white transition-all"
            >
              Not sure which model? Try the Finder
            </Link>
          </div>

          <p className="text-xs text-jet-text-muted text-center mt-8 max-w-lg mx-auto">
            Estimates use typical genuine-HP consumable costs per page and current Jetage
            prices for representative models. Actual costs vary with usage and paper.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
