"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Printer, Scan, Palette, Mouse, LayoutGrid, ArrowRight } from "lucide-react";

const categoryData = [
  {
    id: "inkjet-printers",
    name: "Inkjet Printers",
    description: "Smart Tank & DeskJet series",
    icon: Printer,
    count: 7,
    color: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-50",
  },
  {
    id: "laser-printers",
    name: "Laser Printers",
    description: "Monochrome laser MFPs",
    icon: Scan,
    count: 8,
    color: "from-gray-600 to-gray-400",
    bgColor: "bg-gray-50",
  },
  {
    id: "color-laser",
    name: "Color Laser",
    description: "Professional color printing",
    icon: Palette,
    count: 4,
    color: "from-purple-500 to-pink-400",
    bgColor: "bg-purple-50",
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Mice, keyboards & combos",
    icon: Mouse,
    count: 6,
    color: "from-orange-500 to-yellow-400",
    bgColor: "bg-orange-50",
  },
];

export default function Categories() {
  return (
    <section className="py-20 bg-gray-50" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="categories-heading" className="text-3xl font-bold text-gray-900">
            Shop by Category
          </h2>
          <p className="mt-2 text-gray-600">Find the perfect HP product for your needs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products?category=${category.id}`}>
                <div className={`${category.bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {category.count} products
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}