"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Grid3X3, LayoutList, X, Tag, Package, Check } from "lucide-react";
import { products, categories } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { motion, AnimatePresence } from "framer-motion";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HP Products | Printers, Laptops & Accessories | Jetage India",
  description: "Browse genuine HP printers, laptops, desktops, monitors and accessories at best prices. Authorized HP World Partner with All India delivery. WhatsApp ordering available.",
  keywords: "HP printers India, HP laptops Chandigarh, HP accessories, HP monitors, HP products online, genuine HP dealer, HP ink cartridges",
  alternates: {
    canonical: "https://www.jetageindia.in/products",
  },
  openGraph: {
    title: "HP Products | Printers, Laptops & Accessories | Jetage India",
    description: "Genuine HP products at best prices. Printers, laptops, monitors & accessories. Authorized dealer with All India delivery.",
    url: "https://www.jetageindia.in/products",
    type: "website",
  },
};

// Simple stock indicator component
function StockBadge({ inStock = true }: { inStock?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      inStock 
        ? "bg-green-500/10 text-green-400 border border-green-500/20" 
        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
    }`}>
      <Check className="w-3 h-3" />
      {inStock ? "In Stock" : "Low Stock"}
    </span>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Available subcategories for the active category
  const availableSubCategories = useMemo(() => {
    if (activeCategory === "all") {
      const allSubs = new Set<string>();
      products.forEach(p => allSubs.add(p.subCategory));
      return Array.from(allSubs);
    }
    const subs = new Set<string>();
    products.filter(p => p.category === activeCategory).forEach(p => subs.add(p.subCategory));
    return Array.from(subs);
  }, [activeCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const matchesSubCategory = !activeSubCategory || product.subCategory === activeSubCategory;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSubCategory && matchesSearch && matchesPrice;
    });
  }, [activeCategory, activeSubCategory, searchQuery, priceRange]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "price-low": return sorted.sort((a, b) => a.price - b.price);
      case "price-high": return sorted.sort((a, b) => b.price - a.price);
      case "name": return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "discount": return sorted.sort((a, b) => ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp));
      default: // featured: badge products first
        return sorted.sort((a, b) => {
          const aBadge = a.badge ? 1 : 0;
          const bBadge = b.badge ? 1 : 0;
          if (bBadge !== aBadge) return bBadge - aBadge;
          return b.price - a.price;
        });
    }
  }, [filteredProducts, sortBy]);

  const clearFilters = useCallback(() => {
    setActiveCategory("all");
    setActiveSubCategory(null);
    setSearchQuery("");
    setPriceRange([0, 50000]);
    setSortBy("featured");
  }, []);

  const hasActiveFilters = activeCategory !== "all" || activeSubCategory !== null || searchQuery !== "" || priceRange[0] > 0 || priceRange[1] < 50000 || sortBy !== "featured";

  const totalSavings = useMemo(() => {
    return sortedProducts.reduce((acc, p) => acc + (p.mrp - p.price), 0);
  }, [sortedProducts]);

  const subCategoryLabelMap: Record<string, string> = {
    "laser": "Laser Printer",
    "color-laser": "Color Laser",
    "inkjet": "InkJet",
    "officejet": "OfficeJet",
    "smart-tank": "Smart Tank",
    "deskjet": "DeskJet",
    "mouse": "Mouse",
    "keyboard": "Keyboard",
    "combo": "Combo",
  };

  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />
      
      {/* Header */}
      <div className="pt-28 pb-8 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center space-y-4">
              <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                Our Collection
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-jet-text">
                All <span className="text-gradient-gold">Products</span>
              </h1>
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
                Browse our complete catalog of 26+ genuine HP products. Filter by category, search by name, or sort by price. Press <kbd className="px-1.5 py-0.5 bg-jet-bg-card rounded text-xs border border-jet-border">/</kbd> to search.
              </p>
              
              {/* Stats */}
              <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-jet-bg-card rounded-full border border-jet-border">
                  <Package className="w-4 h-4 text-jet-primary" />
                  <span className="text-sm font-semibold text-jet-text">{products.length}</span>
                  <span className="text-sm text-jet-text-muted">products</span>
                </div>
                {totalSavings > 0 && sortedProducts.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-jet-success/5 rounded-full border border-jet-success/20">
                    <Tag className="w-4 h-4 text-jet-success" />
                    <span className="text-sm font-semibold text-jet-success">
                      Up to ₹{Math.max(...sortedProducts.map(p => p.mrp - p.price)).toLocaleString()} off
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <Reveal direction="up" delay={0.1}>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search with autocomplete suggestions */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jet-text-muted" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products... (Press / to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-jet-bg-card border border-jet-border rounded-xl text-jet-text placeholder-jet-text-muted focus:outline-none focus:border-jet-primary/40 transition-all"
                aria-label="Search products"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-jet-bg-elevated flex items-center justify-center hover:bg-jet-primary/10 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 text-jet-text-muted" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-jet-text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-jet-bg-card border border-jet-border rounded-xl text-jet-text focus:outline-none focus:border-jet-primary/40 transition-all"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
                <option value="discount">Biggest Savings</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-jet-bg-card border border-jet-border rounded-xl p-1" role="group" aria-label="View mode">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-jet-primary text-white" : "text-jet-text-muted hover:text-jet-text"}`}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-jet-primary text-white" : "text-jet-text-muted hover:text-jet-text"}`}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                hasActiveFilters && !showFilters
                  ? "bg-jet-primary/10 text-jet-primary border-jet-primary/30"
                  : "bg-jet-bg-card text-jet-text-dim border-jet-border"
              }`}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-jet-primary rounded-full" />}
            </button>
          </div>
        </Reveal>

        {/* Active Filters Bar */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex flex-wrap items-center gap-2 p-4 bg-jet-bg-card rounded-xl border border-jet-border">
                <span className="text-sm text-jet-text-muted">Active filters:</span>
                {activeCategory !== "all" && (
                  <button
                    onClick={() => { setActiveCategory("all"); setActiveSubCategory(null); }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-jet-primary/10 text-jet-primary text-sm rounded-full border border-jet-primary/20 hover:bg-jet-primary/20 transition-colors"
                  >
                    Category: {categories.find(c => c.id === activeCategory)?.name}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {activeSubCategory && (
                  <button
                    onClick={() => setActiveSubCategory(null)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-jet-primary/10 text-jet-primary text-sm rounded-full border border-jet-primary/20 hover:bg-jet-primary/20 transition-colors"
                  >
                    Type: {subCategoryLabelMap[activeSubCategory] || activeSubCategory}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-jet-primary/10 text-jet-primary text-sm rounded-full border border-jet-primary/20 hover:bg-jet-primary/20 transition-colors"
                  >
                    Search: "{searchQuery}"
                    <X className="w-3 h-3" />
                  </button>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                  <button
                    onClick={() => setPriceRange([0, 50000])}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-jet-primary/10 text-jet-primary text-sm rounded-full border border-jet-primary/20 hover:bg-jet-primary/20 transition-colors"
                  >
                    Price: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-jet-text-muted hover:text-jet-primary transition-colors underline"
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filters */}
        <Reveal direction="up" delay={0.2}>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => { setActiveCategory("all"); setActiveSubCategory(null); }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                activeCategory === "all"
                  ? "bg-jet-primary text-white border-jet-primary shadow-glow"
                  : "bg-jet-bg-card text-jet-text-dim border-jet-border hover:border-jet-primary/40 hover:text-jet-primary"
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setActiveSubCategory(null); }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  activeCategory === cat.id
                    ? "bg-jet-primary text-white border-jet-primary shadow-glow"
                    : "bg-jet-bg-card text-jet-text-dim border-jet-border hover:border-jet-primary/40 hover:text-jet-primary"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </Reveal>

        {/* Subcategory Filters */}
        <AnimatePresence>
          {(activeCategory !== "all" || showFilters) && availableSubCategories.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex flex-wrap gap-2">
                {availableSubCategories.map((sub) => {
                  const count = activeCategory === "all" 
                    ? products.filter(p => p.subCategory === sub).length
                    : products.filter(p => p.category === activeCategory && p.subCategory === sub).length;
                  const isActive = activeSubCategory === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => setActiveSubCategory(isActive ? null : sub)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        isActive
                          ? "bg-jet-primary/20 text-jet-primary border-jet-primary/30"
                          : "bg-jet-bg-elevated text-jet-text-dim border-jet-border hover:border-jet-primary/30 hover:text-jet-primary"
                      }`}
                    >
                      {subCategoryLabelMap[sub] || sub}
                      <span className={`ml-1.5 text-xs ${isActive ? "text-jet-primary/70" : "text-jet-text-muted"}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price Range Filter (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 mb-6 p-4 bg-jet-bg-card rounded-xl border border-jet-border">
          <span className="text-sm text-jet-text-muted font-medium">Price Range:</span>
          <div className="flex items-center gap-3 flex-1">
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1 accent-jet-primary"
              aria-label="Maximum price"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-jet-text-muted">₹{priceRange[0].toLocaleString()}</span>
              <span className="text-jet-text-muted">-</span>
              <span className="text-sm font-semibold text-jet-text">₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Results Count & Info */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-jet-text-muted">
            Showing <span className="font-semibold text-jet-text">{sortedProducts.length}</span> {sortedProducts.length === 1 ? "product" : "products"}
            {activeCategory !== "all" && ` in ${categories.find(c => c.id === activeCategory)?.name}`}
            {activeSubCategory && ` — ${subCategoryLabelMap[activeSubCategory] || activeSubCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-jet-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {sortedProducts.map((product, i) => (
              <Reveal key={product.id} direction="up" delay={i * 0.02}>
                <ProductCard product={product} compact={viewMode === "grid"} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-jet-bg-elevated rounded-2xl flex items-center justify-center mb-6 border border-jet-border">
              <Search className="w-10 h-10 text-jet-text-muted" />
            </div>
            <p className="text-2xl font-bold text-jet-text mb-4">No products found</p>
            <p className="text-jet-text-dim mb-8 max-w-md mx-auto">Try adjusting your search terms, filters, or price range. We have 26+ genuine HP products available.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-jet-primary text-white rounded-full font-bold hover:bg-jet-primary-dim transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
