"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Grid3X3, LayoutList, X, Package } from "lucide-react";
import { products, categories } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState("featured");
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [activeCategory, searchQuery, priceRange]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "price-low": return sorted.sort((a, b) => a.price - b.price);
      case "price-high": return sorted.sort((a, b) => b.price - a.price);
      case "name": return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default: return sorted;
    }
  }, [filteredProducts, sortBy]);

  const clearFilters = useCallback(() => {
    setActiveCategory("all");
    setSearchQuery("");
    setPriceRange([0, 50000]);
    setSortBy("featured");
  }, []);

  const hasActiveFilters = activeCategory !== "all" || searchQuery !== "" || priceRange[0] > 0 || priceRange[1] < 50000;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="pt-28 pb-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                All Products
              </h1>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Browse our complete catalog of {products.length}+ genuine HP products. Filter by category, search by name, or sort by price.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>

          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 ${viewMode === "grid" ? "bg-cyan-600 text-white" : "text-gray-400"}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 ${viewMode === "list" ? "bg-cyan-600 text-white" : "text-gray-400"}`}
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === "all"
                ? "bg-cyan-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-cyan-300"
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-cyan-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-cyan-300"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <span className="text-sm text-gray-500 font-medium">Price Range:</span>
          <input
            type="range"
            min={0}
            max={50000}
            step={1000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="flex-1 accent-cyan-600"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">₹{priceRange[0].toLocaleString()}</span>
            <span className="text-gray-300">-</span>
            <span className="text-sm font-semibold text-gray-900">₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-cyan-600 hover:underline">
              Clear all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-all"
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