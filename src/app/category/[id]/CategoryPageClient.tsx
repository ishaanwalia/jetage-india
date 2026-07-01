"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Layers,
  ChevronRight,
  PackageOpen,
  SearchX,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";

interface CategoryPageClientProps {
  id: string;
}

// ─── Subcategory mapping ───
const subCategoryMap: Record<string, Record<string, string>> = {
  printer: {
    laser: "Laser Printers",
    "color-laser": "Color Laser",
    inkjet: "InkJet Printers",
    officejet: "OfficeJet",
    "smart-tank": "Smart Tank",
    deskjet: "DeskJet",
  },
  accessory: {
    mouse: "Mouse",
    keyboard: "Keyboard",
    combo: "Combos",
  },
};

const categoryNames: Record<string, string> = {
  printer: "Printers",
  accessory: "Accessories",
};

const categoryDescriptions: Record<string, string> = {
  printer:
    "High-quality HP printers for home, office, and enterprise — Laser, Color Laser, InkJet, Smart Tank & OfficeJet.",
  accessory:
    "Genuine HP keyboards, mice, and essential combos designed for comfort, precision, and durability.",
};

const categoryMeta: Record<string, { icon: string; tagline: string }> = {
  printer: { icon: "Printer", tagline: "Print with confidence" },
  accessory: { icon: "Mouse", tagline: "Precision in every click" },
};

// ─── Sort options ───
const sortOptions = [
  { value: "featured", label: "Featured", icon: "★" },
  { value: "price-low", label: "Price: Low to High", icon: "↑" },
  { value: "price-high", label: "Price: High to Low", icon: "↓" },
  { value: "name", label: "Name: A-Z", icon: "A" },
  { value: "discount", label: "Biggest Savings", icon: "%" },
];

export default function CategoryPageClient({ id }: CategoryPageClientProps) {
  const [sortBy, setSortBy] = useState("featured");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ─── Derived data ───
  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === id),
    [id]
  );

  const availableSubCategories = useMemo(() => {
    const subs = new Set(categoryProducts.map((p) => p.subCategory));
    return Array.from(subs);
  }, [categoryProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    if (activeSubCategory !== "all") {
      result = result.filter((p) => p.subCategory === activeSubCategory);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "discount":
        result.sort(
          (a, b) =>
            (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp
        );
        break;
      default:
        // featured: badge products first, then by price desc
        result.sort((a, b) => {
          const aBadge = a.badge ? 1 : 0;
          const bBadge = b.badge ? 1 : 0;
          if (bBadge !== aBadge) return bBadge - aBadge;
          return b.price - a.price;
        });
    }
    return result;
  }, [categoryProducts, sortBy, activeSubCategory]);

  const totalSavings = useMemo(() => {
    return filteredProducts.reduce(
      (acc, p) => acc + (p.mrp - p.price),
      0
    );
  }, [filteredProducts]);

  const handleSubCategoryToggle = useCallback((sub: string) => {
    setActiveSubCategory((prev) => (prev === sub ? "all" : sub));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveSubCategory("all");
    setSortBy("featured");
  }, []);

  const hasActiveFilters = activeSubCategory !== "all";

  return (
    <main className="min-h-screen bg-jet-bg relative">
      {/* ─── Subtle ambient background ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative pt-28 pb-12 lg:pb-16 bg-jet-bg-elevated border-b border-jet-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Reveal direction="up">
            <div className="text-center space-y-5">
              {/* Category badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20"
              >
                <Layers className="w-4 h-4" />
                Category
              </motion.div>

              {/* Title */}
              <h1 className="text-5xl lg:text-7xl font-bold text-jet-text tracking-tight leading-[0.95]">
                {categoryNames[id] || id}
              </h1>

              {/* Description */}
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg lg:text-xl leading-relaxed">
                {categoryDescriptions[id] ||
                  `Browse our ${categoryNames[id]} collection`}
              </p>

              {/* Stats row */}
              <div className="flex items-center justify-center gap-6 pt-2 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-jet-bg-card rounded-full border border-jet-border">
                  <PackageOpen className="w-4 h-4 text-jet-primary" />
                  <span className="text-sm font-semibold text-jet-text">
                    {filteredProducts.length}
                  </span>
                  <span className="text-sm text-jet-text-muted">
                    {filteredProducts.length === 1 ? "product" : "products"}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-jet-success/5 rounded-full border border-jet-success/20">
                    <Tag className="w-4 h-4 text-jet-success" />
                    <span className="text-sm font-semibold text-jet-success">
                      Up to ₹{Math.max(...filteredProducts.map((p) => p.mrp - p.price)).toLocaleString()} off
                    </span>
                  </div>
                )}

                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-jet-bg-card rounded-full border border-jet-border text-sm text-jet-text-muted hover:text-jet-primary hover:border-jet-primary/30 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear filters
                  </motion.button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FILTER & SORT BAR
          ═══════════════════════════════════════════ */}
      <section className="sticky top-[72px] z-30 bg-jet-bg/90 backdrop-blur-xl border-b border-jet-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Subcategory filters */}
            <div className="hidden lg:flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
              <MagneticButton strength={0.15}>
                <button
                  onClick={() => setActiveSubCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border whitespace-nowrap ${
                    activeSubCategory === "all"
                      ? "bg-jet-primary text-white border-jet-primary shadow-glow"
                      : "bg-jet-bg-card text-jet-text-dim border-jet-border hover:border-jet-primary/40 hover:text-jet-primary"
                  }`}
                >
                  All
                </button>
              </MagneticButton>

              {availableSubCategories.map((sub) => {
                const subMap = subCategoryMap[id] || {};
                const label = subMap[sub] || sub;
                const count = categoryProducts.filter(
                  (p) => p.subCategory === sub
                ).length;
                const isActive = activeSubCategory === sub;

                return (
                  <MagneticButton key={sub} strength={0.15}>
                    <button
                      onClick={() => handleSubCategoryToggle(sub)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border whitespace-nowrap flex items-center gap-2 ${
                        isActive
                          ? "bg-jet-primary text-white border-jet-primary shadow-glow"
                          : "bg-jet-bg-card text-jet-text-dim border-jet-border hover:border-jet-primary/40 hover:text-jet-primary"
                      }`}
                    >
                      {label}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-jet-bg-elevated text-jet-text-muted"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  </MagneticButton>
                );
              })}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-jet-bg-card border border-jet-border rounded-xl text-sm font-semibold text-jet-text-dim hover:border-jet-primary/40 transition-all"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-jet-primary rounded-full" />
              )}
            </button>

            {/* Right: Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-jet-text-muted hidden sm:block" />
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-jet-bg-card border border-jet-border rounded-xl text-jet-text focus:outline-none focus:border-jet-primary/40 transition-all text-sm font-medium cursor-pointer hover:border-jet-border-strong"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jet-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Mobile filters expand */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setActiveSubCategory("all");
                      setShowMobileFilters(false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                      activeSubCategory === "all"
                        ? "bg-jet-primary text-white border-jet-primary"
                        : "bg-jet-bg-card text-jet-text-dim border-jet-border"
                    }`}
                  >
                    All
                  </button>
                  {availableSubCategories.map((sub) => {
                    const subMap = subCategoryMap[id] || {};
                    const label = subMap[sub] || sub;
                    return (
                      <button
                        key={sub}
                        onClick={() => {
                          handleSubCategoryToggle(sub);
                          setShowMobileFilters(false);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                          activeSubCategory === sub
                            ? "bg-jet-primary text-white border-jet-primary"
                            : "bg-jet-bg-card text-jet-text-dim border-jet-border"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRODUCT GRID
          ═══════════════════════════════════════════ */}
      <section className="py-10 lg:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Results count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-jet-text-muted">
              Showing{" "}
              <span className="font-semibold text-jet-text">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
              {activeSubCategory !== "all" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="text-jet-primary font-medium">
                    {subCategoryMap[id]?.[activeSubCategory] ||
                      activeSubCategory}
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.04,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <ProductCard product={product} compact />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 mx-auto bg-jet-bg-elevated rounded-2xl flex items-center justify-center mb-6 border border-jet-border">
                <SearchX className="w-10 h-10 text-jet-text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-jet-text mb-3">
                No products found
              </h3>
              <p className="text-jet-text-dim max-w-md mx-auto mb-8">
                Try adjusting your filters or browse a different category.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-jet-primary text-white rounded-full font-bold hover:bg-jet-primary-dim transition-all shadow-glow"
                >
                  Clear Filters
                </button>
                <Link
                  href="/products/"
                  className="px-6 py-3 bg-jet-bg-card text-jet-text border border-jet-border rounded-full font-bold hover:border-jet-primary/40 transition-all"
                >
                  Browse All
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CROSS-SELL: OTHER CATEGORIES
          ═══════════════════════════════════════════ */}
      <section className="py-16 bg-jet-bg-elevated border-t border-jet-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-jet-text">
                Explore Other{" "}
                <span className="text-gradient-gold">Categories</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(categoryNames)
              .filter(([key]) => key !== id)
              .map(([key, name], i) => (
                <Reveal key={key} direction="up" delay={i * 0.08}>
                  <Link
                    href={`/category/${key}/`}
                    className="group block p-6 rounded-2xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all duration-500 hover:shadow-premium text-center"
                  >
                    <h3 className="font-bold text-jet-text group-hover:text-jet-primary transition-colors text-lg">
                      {name}
                    </h3>
                    <p className="text-sm text-jet-text-muted mt-1">
                      {
                        products.filter((p) => p.category === key).length
                      }{" "}
                      products
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-jet-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Browse
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}