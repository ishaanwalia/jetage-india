"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Check } from "lucide-react";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <article className="product-card group" aria-label={`${product.name} product card`}>
      {/* Image Container - FIXED: No more "Image unavailable" placeholder */}
      <div className="product-card-image relative">
        {/* Badge */}
        <span className={`badge-${product.isNew ? 'new' : product.isBestseller ? 'bestseller' : 'popular'}`}>
          {product.badge}
        </span>

        {/* Stock Indicator */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
          <span className={`text-xs font-medium ${product.stock > 10 ? 'text-green-700' : 'text-orange-700'}`}>
            {product.stock > 10 ? 'In Stock' : 'Low Stock'}
          </span>
        </div>

        {/* Product Image with proper fallback */}
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <div className="relative w-full h-full flex items-center justify-center p-6">
            <Image
              src={product.images[0]}
              alt={`${product.name} - ${product.shortSpecs[0]}`}
              width={300}
              height={300}
              className="object-contain max-h-[200px] w-auto transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                // Fallback to a colored placeholder with product initial
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center shadow-lg">
                      <span class="text-4xl font-bold text-white">${product.name.charAt(0)}</span>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </Link>

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.subcategory}</p>
        
        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.shortSpecs.slice(0, 2).map((spec, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {spec}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline flex-wrap gap-1">
          <span className="price-current">₹{product.price.toLocaleString("en-IN")}</span>
          <span className="price-original">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          <span className="price-discount">{discount}% off</span>
        </div>

        {/* WhatsApp Order Button */}
        <a
          href={`https://wa.me/91XXXXXXXXXX?text=Hi, I want to order ${product.name} (₹${product.price})`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
          </svg>
          WhatsApp Order
        </a>
      </div>
    </article>
  );
}