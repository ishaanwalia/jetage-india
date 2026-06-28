"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import { products, categories } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal, StaggerReveal } from "@/components/Reveal";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

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
                Browse our complete catalog of HP products. Filter by category, search by name, or sort by price.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <Reveal direction="up" delay={0.1}>
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jet-text-muted" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-jet-bg-card border border-jet-border rounded-xl text-jet-text placeholder-jet-text-muted focus:outline-none focus:border-jet-primary/40 transition-all"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-jet-text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-jet-bg-card border border-jet-border rounded-xl text-jet-text focus:outline-none focus:border-jet-primary/40 transition-all"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-jet-bg-card border border-jet-border rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-jet-primary text-white" : "text-jet-text-muted hover:text-jet-text"}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-jet-primary text-white" : "text-jet-text-muted hover:text-jet-text"}`}
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Category Filters */}
        <Reveal direction="up" delay={0.2}>
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory("all")}
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
                onClick={() => setActiveCategory(cat.id)}
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

        {/* Results Count */}
        <div className="mb-6 text-sm text-jet-text-muted">
          Showing {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
          {activeCategory !== "all" && ` in ${categories.find(c => c.id === activeCategory)?.name}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {sortedProducts.map((product, i) => (
              <Reveal key={product.id} direction="up" delay={i * 0.03}>
                <ProductCard product={product} compact={viewMode === "grid"} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-jet-text mb-4">No products found</p>
            <p className="text-jet-text-dim mb-8">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              className="px-6 py-3 bg-jet-primary text-white rounded-full font-bold hover:bg-jet-primary-dim transition-all"
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
