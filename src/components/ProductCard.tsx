"use client";

import { Printer, Wifi, Usb, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Product {
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
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const whatsappLink = `https://wa.me/919814958295?text=Hi%20Jet%20Age%2C%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20(SKU%3A%20${product.sku})`;

  if (compact) {
    return (
      <div className="group bg-white rounded-2xl border border-jet-border overflow-hidden hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-1">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-jet-light to-white p-6 flex items-center justify-center">
          {product.badge && <div className="absolute top-3 left-3 px-3 py-1 bg-jet-primary text-white text-xs font-semibold rounded-full">{product.badge}</div>}
          {discount > 0 && <div className="absolute top-3 right-3 px-3 py-1 bg-jet-accent text-white text-xs font-semibold rounded-full">-{discount}%</div>}
          <Printer className="w-20 h-20 text-jet-primary/30 group-hover:text-jet-primary/50 transition-colors" strokeWidth={1} />
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs text-jet-gray">
            <span className="px-2 py-0.5 bg-jet-primary/10 text-jet-primary rounded-full">{product.idealFor}</span>
            <span>{product.speed}</span>
          </div>
          <h3 className="font-bold text-jet-navy group-hover:text-jet-primary transition-colors line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 text-xs text-jet-gray">
            {product.connectivity.includes("Wi-Fi") && <Wifi className="w-3.5 h-3.5" />}
            {product.connectivity.includes("USB") && <Usb className="w-3.5 h-3.5" />}
            <span>{product.connectivity.join(" + ")}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-jet-navy">₹{product.price.toLocaleString()}</span>
            <span className="text-sm text-jet-gray line-through">₹{product.mrp.toLocaleString()}</span>
          </div>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-jet-whatsapp text-white rounded-xl font-semibold text-sm hover:bg-[#128C7E] transition-all">
            <MessageCircle className="w-4 h-4" />
            Get Quote
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-3xl border border-jet-border overflow-hidden hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-[16/10] bg-gradient-to-br from-jet-light to-white p-8 flex items-center justify-center overflow-hidden">
        {product.badge && <div className="absolute top-4 left-4 px-4 py-1.5 bg-jet-primary text-white text-sm font-semibold rounded-full z-10">{product.badge}</div>}
        {discount > 0 && <div className="absolute top-4 right-4 px-4 py-1.5 bg-jet-accent text-white text-sm font-semibold rounded-full z-10">Save {discount}%</div>}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,150,214,0.08),transparent_70%)]" />
        </div>
        <Printer className="w-28 h-28 text-jet-primary/20 group-hover:text-jet-primary/40 group-hover:scale-110 transition-all duration-700" strokeWidth={0.8} />
      </div>
      <div className="p-6 lg:p-8 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 bg-jet-primary/10 text-jet-primary text-xs font-semibold rounded-full">{product.idealFor}</span>
          <span className="px-3 py-1 bg-jet-cream text-jet-gray text-xs rounded-full">
            {product.category === "color-laser" ? "Color Laser" : product.category === "laser" ? "Laser" : "InkJet"}
          </span>
        </div>
        <h3 className="text-xl font-bold text-jet-navy group-hover:text-jet-primary transition-colors">{product.name}</h3>
        <p className="text-jet-gray text-sm leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex flex-wrap gap-2">
          {product.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs text-jet-slate bg-jet-cream px-3 py-1.5 rounded-lg">{feature}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-jet-navy">₹{product.price.toLocaleString()}</span>
            <span className="text-sm text-jet-gray line-through">₹{product.mrp.toLocaleString()}</span>
          </div>
          <span className="text-xs text-jet-success font-semibold">{discount}% off</span>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href={`/products/${product.id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-jet-navy text-white rounded-xl font-semibold text-sm hover:bg-jet-slate transition-all">
            Details
            <ChevronRight className="w-4 h-4" />
          </Link>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-jet-whatsapp text-white rounded-xl font-semibold text-sm hover:bg-[#128C7E] transition-all">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}