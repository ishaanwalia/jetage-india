"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ShoppingCart, Eye, Scale, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCompare } from "@/context/CompareContext";

export interface Product {
  id: string;
  name: string;
  shortName: string;
  category: string;
  subCategory: string;
  price: number;
  mrp: number;
  sku: string;
  speed: string;
  connectivity: string[];
  duplex: boolean;
  dutyCycle: string;
  idealFor: string;
  description: string;
  features: string[];
  image: string;
  images: string[];
  badge?: string;
  specs?: Record<string, string>;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { toggle, has, isFull } = useCompare();
  const inCompare = has(product.id);

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const whatsappLink = `https://wa.me/919814958295?text=Hi%20Jetage%2C%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20(SKU%3A%20${product.sku})`;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      shortName: product.shortName,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      sku: product.sku,
    });
  };

  const categoryColors: Record<string, string> = {
    "laser": "bg-cyan-50 text-cyan-700 border-cyan-200",
    "color-laser": "bg-orange-50 text-orange-700 border-orange-200",
    "inkjet": "bg-blue-50 text-blue-700 border-blue-200",
    "officejet": "bg-teal-50 text-teal-700 border-teal-200",
    "smart-tank": "bg-cyan-50 text-cyan-700 border-cyan-200",
    "deskjet": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "consumer": "bg-gray-50 text-gray-700 border-gray-200",
    "premium": "bg-purple-50 text-purple-700 border-purple-200",
    "gaming": "bg-red-50 text-red-700 border-red-200",
    "professional": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "input": "bg-gray-50 text-gray-700 border-gray-200",
    "mouse": "bg-pink-50 text-pink-700 border-pink-200",
    "keyboard": "bg-violet-50 text-violet-700 border-violet-200",
    "combo": "bg-amber-50 text-amber-700 border-amber-200",
  };

  const categoryLabelMap: Record<string, string> = {
    "laser": "Laser Printer",
    "color-laser": "Color Laser",
    "inkjet": "InkJet",
    "officejet": "OfficeJet",
    "smart-tank": "Smart Tank",
    "deskjet": "DeskJet",
    "consumer": "Consumer",
    "premium": "Premium",
    "gaming": "Gaming",
    "professional": "Professional",
    "input": "Input Device",
    "mouse": "Mouse",
    "keyboard": "Keyboard",
    "combo": "Combo",
  };

  return (
    <div
      className="group card-glow bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className="relative aspect-square bg-gray-50 p-4 flex items-center justify-center">
        {product.badge && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-cyan-600 text-white text-xs font-bold rounded-full z-10">
            {product.badge}
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-full z-10 border border-red-200">
            -{discount}%
          </div>
        )}

        <button
          onClick={() => toggle(product.id)}
          disabled={!inCompare && isFull}
          title={inCompare ? "Remove from comparison" : isFull ? "Comparison is full (3 max)" : "Add to comparison"}
          className={`absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            inCompare
              ? "bg-cyan-600 text-white border-cyan-600"
              : "bg-white/90 text-gray-500 border-gray-200 hover:text-cyan-600 hover:border-cyan-300 disabled:opacity-40"
          }`}
        >
          {inCompare ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
          Compare
        </button>
        
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="object-contain max-h-[200px] w-auto transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/300x200/e2e8f0/64748b?text=${encodeURIComponent(product.shortName)}`;
          }}
        />

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <Link 
              href={`/products/${product.id}/`} 
              className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${categoryColors[product.subCategory] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
              {categoryLabelMap[product.subCategory] || product.subCategory}
            </span>
          </div>

          <h3 className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors line-clamp-2 text-sm leading-snug">
            {product.name}
          </h3>

          {product.speed && product.speed !== "N/A" && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{product.speed}</span>
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 mt-auto">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-cyan-600 border border-cyan-200 rounded-xl font-semibold text-sm hover:bg-cyan-600 hover:text-white transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Get Quote
          </a>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-50 text-cyan-600 border border-cyan-200 rounded-xl font-semibold text-sm hover:bg-cyan-600 hover:text-white transition-all"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}