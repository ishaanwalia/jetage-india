"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { categories } from "@/lib/products";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterSidebarProps {
  categories: typeof categories;
}

export default function FilterSidebar({ categories: cats }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <aside className="space-y-6" aria-label="Product filters">
      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button className="flex items-center gap-2 w-full bg-gray-100 px-4 py-3 rounded-lg font-medium">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </button>
      </div>

      <div className="hidden lg:block space-y-6">
        {/* Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => router.push("/products?" + createQueryString("category", "all"))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentCategory === "all"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Products
            </button>
            {cats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => router.push("/products?" + createQueryString("category", cat.id))}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentCategory === cat.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
          <div className="space-y-2">
            {[
              { label: "Under ₹5,000", min: 0, max: 5000 },
              { label: "₹5,000 - ₹15,000", min: 5000, max: 15000 },
              { label: "₹15,000 - ₹30,000", min: 15000, max: 30000 },
              { label: "Above ₹30,000", min: 30000, max: 100000 },
            ].map((range) => (
              <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
          <select
            className="w-full border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => router.push("/products?" + createQueryString("sort", e.target.value))}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </aside>
  );
}