"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { searchProducts } from "@/lib/products";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof searchProducts>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) {
      const timeout = setTimeout(() => {
        setResults(searchProducts(query).slice(0, 6));
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
      onClick={onClose}
      role="dialog"
      aria-label="Search products"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search HP printers, accessories..."
            className="flex-1 outline-none text-lg text-gray-900 placeholder-gray-400"
            aria-label="Search query"
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  router.push(`/products/${product.slug}`);
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-gray-400">
                    {product.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.subcategory}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{product.price.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No products found for "{query}"</p>
            <p className="text-sm mt-1">Try searching for "printer", "laser", or "mouse"</p>
          </div>
        )}

        {query.length < 2 && (
          <div className="p-6 text-center text-gray-400">
            <p className="text-sm">Type at least 2 characters to search</p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {["Laser", "Smart Tank", "Mouse", "Keyboard"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}