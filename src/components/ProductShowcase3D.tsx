"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { products } from "@/lib/data/products";
import { ChevronRight, MessageCircle } from "lucide-react";
import { ProductImage3D } from "./ProductImage3D";

interface Product3DCardProps {
  product: typeof products[0];
  index: number;
}

// Generate descriptive alt text for printers
function getPrinterAltText(product: typeof products[0]): string {
  const parts: string[] = [];
  parts.push(product.name);
  
  if (product.subCategory === "laser") {
    parts.push("monochrome laser printer");
  } else if (product.subCategory === "color-laser") {
    parts.push("color laser printer");
  } else if (product.subCategory === "inkjet") {
    parts.push("inkjet printer");
  }
  
  if (product.duplex) {
    parts.push("with automatic duplex printing");
  }
  
  if (product.connectivity.includes("Wi-Fi")) {
    parts.push("wireless connectivity");
  }
  
  parts.push(product.speed);
  
  if (product.features.some(f => f.toLowerCase().includes("scan") || f.toLowerCase().includes("copy"))) {
    parts.push("all-in-one MFP");
  }
  
  return parts.join(" - ");
}

// Generate descriptive alt text for non-printer products
function getProductAltText(product: typeof products[0]): string {
  return `${product.name} - ${product.description.substring(0, 80)}`;
}

function Product3DCard({ product, index }: Product3DCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const whatsappLink = `https://wa.me/919814958295?text=Hi%20Jetage%2C%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`;

  // Get proper alt text
  const altText = product.category === "printer" 
    ? getPrinterAltText(product) 
    : getProductAltText(product);

  // Build image array
  const allImages = Array.from(new Set([product.image, ...product.images])).filter(Boolean);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative bg-jet-bg-card rounded-3xl border border-jet-border overflow-hidden"
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Floating shadow */}
        <motion.div
          className="absolute -inset-1 bg-jet-primary/20 rounded-3xl blur-xl -z-10"
          animate={{ opacity: isHovered ? 0.3 : 0 }}
        />

        {/* Product Image with 3D Viewer */}
        <div className="relative aspect-[4/3] p-4">
          {product.badge && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-jet-primary text-white text-xs font-bold rounded-full z-20">
              {product.badge}
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full z-20 border border-red-500/20">
              -{discount}%
            </div>
          )}
          
          <ProductImage3D
            images={allImages}
            alt={altText}
            className="w-full h-full"
            compact
            enableRotation
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <span className="inline-block px-2.5 py-1 bg-jet-primary/10 text-jet-primary text-xs font-semibold rounded-full border border-jet-primary/20">
            {product.idealFor}
          </span>
          
          <h3 className="font-bold text-jet-text group-hover:text-jet-primary transition-colors text-lg leading-snug">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-jet-text">&#8377;{product.price.toLocaleString()}</span>
            <span className="text-sm text-jet-text-muted line-through">&#8377;{product.mrp.toLocaleString()}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Link
              href={`/products/${product.id}/`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-jet-bg-elevated text-jet-text border border-jet-border rounded-xl font-semibold text-sm hover:bg-jet-primary hover:text-white hover:border-jet-primary transition-all"
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-jet-whatsapp/10 text-jet-whatsapp border border-jet-whatsapp/20 rounded-xl font-semibold text-sm hover:bg-jet-whatsapp hover:text-white transition-all"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProductShowcase3D() {
  const featuredProducts = products.filter(p => p.badge).slice(0, 4);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
            3D Experience
          </span>
          <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
            Featured <span className="text-gradient-gold">Products</span>
          </h2>
          <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
            Hover over the cards to experience the 3D tilt effect
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, i) => (
            <Product3DCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
