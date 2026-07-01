"use client";

import { motion } from "framer-motion";
import { products } from "@/lib/products";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const featured = products.filter(p => p.isBestseller || p.isNew).slice(0, 8);

  return (
    <section className="py-20 bg-white" aria-labelledby="featured-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 id="featured-heading" className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="mt-2 text-gray-600">Handpicked best sellers and new arrivals</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-blue-600 font-medium"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}