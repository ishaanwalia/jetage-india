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

export function ProductsClient() {
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
            {/* Search */}
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
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-jet-bg-card border border-jet-border rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-all ${viewMode === "grid" ? "bg-jet-primary text-white" : "text-jet-text-muted hover:text-jet-text"}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-all ${viewMode === "list" ? "bg-jet-primary text-white" : "text-jet-text-muted hover:text-jet-text"}`}
                aria-label="List view"
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${showFilters ? "bg-jet-primary text-white border-jet-primary" : "bg-jet-bg-card text-jet-text border-jet-border hover:border-jet-primary/40"}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-jet-accent rounded-full" />
              )}
            </button>
          </div>
        </Reveal>

        {/* Active Filters */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-jet-text-muted">Active:</span>
                {activeCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-jet-primary/10 text-jet-primary text-sm rounded-full border border-jet-primary/20">
                    {categories.find(c => c.id === activeCategory)?.name}
                    <button onClick={() => setActiveCategory("all")} className="hover:text-jet-accent">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {activeSubCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-jet-primary/10 text-jet-primary text-sm rounded-full border border-jet-primary/20">
                    {subCategoryLabelMap[activeSubCategory] || activeSubCategory}
                    <button onClick={() => setActiveSubCategory(null)} className="hover:text-jet-accent">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-jet-primary/10 text-jet-primary text-sm rounded-full border border-jet-primary/20">
                    &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")} className="hover:text-jet-accent">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-jet-primary/10 text-jet-primary text-sm rounded-full border border-jet-primary/20">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                    <button onClick={() => setPriceRange([0, 50000])} className="hover:text-jet-accent">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
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

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-jet-bg-card border border-jet-border rounded-2xl p-6 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-jet-text mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setActiveCategory("all"); setActiveSubCategory(null); }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === "all" ? "bg-jet-primary text-white" : "bg-jet-bg-elevated text-jet-text-dim border border-jet-border hover:border-jet-primary/40"}`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); setActiveSubCategory(null); }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-jet-primary text-white" : "bg-jet-bg-elevated text-jet-text-dim border border-jet-border hover:border-jet-primary/40"}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategories */}
                {availableSubCategories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-jet-text mb-3">Subcategories</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveSubCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSubCategory === null ? "bg-jet-primary text-white" : "bg-jet-bg-elevated text-jet-text-dim border border-jet-border hover:border-jet-primary/40"}`}
                      >
                        All
                      </button>
                      {availableSubCategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setActiveSubCategory(sub)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSubCategory === sub ? "bg-jet-primary text-white" : "bg-jet-bg-elevated text-jet-text-dim border border-jet-border hover:border-jet-primary/40"}`}
                        >
                          {subCategoryLabelMap[sub] || sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-semibold text-jet-text mb-3">Price Range</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-32 px-4 py-2 bg-jet-bg-elevated border border-jet-border rounded-lg text-jet-text focus:outline-none focus:border-jet-primary/40"
                      placeholder="Min"
                    />
                    <span className="text-jet-text-muted">to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-32 px-4 py-2 bg-jet-bg-elevated border border-jet-border rounded-lg text-jet-text focus:outline-none focus:border-jet-primary/40"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-jet-text-muted">
            Showing <span className="text-jet-text font-semibold">{sortedProducts.length}</span> of {products.length} products
          </p>
          {searchQuery && sortedProducts.length === 0 && (
            <p className="text-sm text-jet-text-muted">
              No products found for &quot;{searchQuery}&quot;
            </p>
          )}
        </div>

        {/* Product Grid */}
        <motion.div
          layout
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
        >
          <AnimatePresence mode="popLayout">
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} viewMode={viewMode} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-jet-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-jet-text mb-2">No products found</h3>
            <p className="text-jet-text-dim mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-jet-primary text-white rounded-xl font-bold hover:bg-jet-primary-dim transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}