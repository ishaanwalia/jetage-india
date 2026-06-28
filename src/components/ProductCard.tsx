"use client";

import { useState } from "react";
import { Wifi, Usb, EthernetPort, ChevronRight, MessageCircle, Check, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
  compact?: boolean;
  featured?: boolean;
}

// Generate descriptive alt text for printers
function getPrinterAltText(product: Product): string {
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
function getProductAltText(product: Product): string {
  return `${product.name} - ${product.description.substring(0, 80)}`;
}

export function ProductCard({ product, compact = false, featured = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const whatsappLink = `https://wa.me/919814958295?text=Hi%20Jetage%2C%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20(SKU%3A%20${product.sku})`;

  // Get proper alt text
  const altText = product.category === "printer" 
    ? getPrinterAltText(product) 
    : getProductAltText(product);

  const getConnectivityIcon = (conn: string) => {
    if (conn === "Wi-Fi" || conn === "Wi-Fi 6" || conn === "Wi-Fi 6E") return <Wifi className="w-3 h-3" />;
    if (conn === "Ethernet") return <EthernetPort className="w-3 h-3" />;
    if (conn === "USB" || conn === "USB 2.0" || conn === "USB 3.2" || conn === "USB-C" || conn === "USB-C Charging") return <Usb className="w-3 h-3" />;
    return null;
  };

  const categoryColors: Record<string, string> = {
    "laser": "bg-jet-primary/10 text-jet-primary border-jet-primary/20",
    "color-laser": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "inkjet": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "consumer": "bg-jet-primary/10 text-jet-primary border-jet-primary/20",
    "premium": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "gaming": "bg-red-500/10 text-red-500 border-red-500/20",
    "professional": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "input": "bg-jet-primary/10 text-jet-primary border-jet-primary/20",
  };

  const categoryLabelMap: Record<string, string> = {
    "laser": "Laser Printer",
    "color-laser": "Color Laser",
    "inkjet": "InkJet",
    "consumer": "Consumer",
    "premium": "Premium",
    "gaming": "Gaming",
    "professional": "Professional",
    "input": "Input Device",
  };

  const categoryLabel = categoryLabelMap[product.subCategory] || product.subCategory;

  if (compact) {
    return (
      <div 
        className="group bg-jet-bg-card rounded-2xl border border-jet-border overflow-hidden hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-1 hover:border-jet-border-strong"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] bg-gradient-to-br from-jet-bg-elevated to-jet-bg p-4 flex items-center justify-center overflow-hidden">
          {product.badge && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-jet-primary text-white text-xs font-bold rounded-full z-10">
              {product.badge}
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full z-10 border border-red-500/20">
              -{discount}%
            </div>
          )}
          
          {!imageError ? (
            <Image 
              src={product.image} 
              alt={altText}
              width={200}
              height={150}
              className="object-contain max-h-[120px] w-auto group-hover:scale-110 transition-transform duration-700"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-jet-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-jet-primary">{product.shortName.charAt(0)}</span>
            </div>
          )}
          
          {isHovered && (
            <div className="absolute inset-0 bg-jet-bg/60 backdrop-blur-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Link href={`/products/${product.id}/`} className="w-10 h-10 rounded-full bg-jet-primary text-white flex items-center justify-center hover:scale-110 transition-transform">
                <Eye className="w-4 h-4" />
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-jet-whatsapp text-white flex items-center justify-center hover:scale-110 transition-transform">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2.5 py-1 rounded-full font-medium border ${categoryColors[product.subCategory] || "bg-jet-text-muted/10 text-jet-text-muted border-jet-text-muted/20"}`}>
              {product.idealFor}
            </span>
          </div>

          <h3 className="font-bold text-jet-text group-hover:text-jet-primary transition-colors line-clamp-2 text-sm leading-snug">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-jet-text-muted">
            {product.connectivity.slice(0, 3).map((conn, i) => (
              <span key={i} className="flex items-center gap-1">{getConnectivityIcon(conn)}</span>
            ))}
            <span className="truncate">{product.speed}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-jet-text">&#8377;{product.price.toLocaleString()}</span>
            <span className="text-sm text-jet-text-muted line-through">&#8377;{product.mrp.toLocaleString()}</span>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-jet-bg-elevated text-jet-primary border border-jet-primary/20 rounded-xl font-semibold text-sm hover:bg-jet-primary hover:text-white transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Get Quote
          </a>
        </div>
      </div>
    );
  }

  if (featured) {
    return (
      <div 
        className="group relative bg-jet-bg-card rounded-3xl border border-jet-border overflow-hidden hover:shadow-premium-hover transition-all duration-700 hover:-translate-y-2 hover:border-jet-border-strong"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[16/10] bg-gradient-to-br from-jet-bg-elevated via-jet-bg-card to-jet-bg p-8 flex items-center justify-center overflow-hidden">
          {product.badge && (
            <div className="absolute top-5 left-5 px-4 py-1.5 bg-jet-primary text-white text-sm font-bold rounded-full z-10">
              {product.badge}
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-5 right-5 px-4 py-1.5 bg-red-500/10 text-red-500 text-sm font-bold rounded-full z-10 border border-red-500/20">
              Save {discount}%
            </div>
          )}

          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.08),transparent_70%)]" />
          </div>

          {!imageError ? (
            <Image 
              src={product.image} 
              alt={altText}
              width={300}
              height={220}
              className="object-contain max-h-[200px] w-auto group-hover:scale-110 transition-transform duration-700 z-10"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-jet-primary/10 flex items-center justify-center z-10">
              <span className="text-4xl font-bold text-jet-primary">{product.shortName.charAt(0)}</span>
            </div>
          )}
          
          {isHovered && (
            <div className="absolute inset-0 bg-jet-bg/60 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <Link href={`/products/${product.id}/`} className="px-6 py-3 rounded-full bg-jet-primary text-white font-semibold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
                <Eye className="w-4 h-4" />
                View Details
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-jet-whatsapp text-white font-semibold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          )}
        </div>

        <div className="p-6 lg:p-8 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${categoryColors[product.subCategory] || "bg-jet-text-muted/10 text-jet-text-muted border-jet-text-muted/20"}`}>
              {product.idealFor}
            </span>
            <span className="px-3 py-1 bg-jet-bg-elevated text-jet-text-muted text-xs rounded-full font-medium border border-jet-border">
              {categoryLabel}
            </span>
            {product.duplex && (
              <span className="px-3 py-1 bg-jet-success/10 text-jet-success text-xs rounded-full font-medium flex items-center gap-1 border border-jet-success/20">
                <Check className="w-3 h-3" /> Auto Duplex
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-jet-text group-hover:text-jet-primary transition-colors leading-tight">
            {product.name}
          </h3>

          <p className="text-jet-text-dim text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {product.features.slice(0, 3).map((feature, i) => (
              <span key={i} className="text-xs text-jet-text-dim bg-jet-bg-elevated px-3 py-1.5 rounded-lg font-medium border border-jet-border">
                {feature}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-jet-text">&#8377;{product.price.toLocaleString()}</span>
              <span className="text-sm text-jet-text-muted line-through">&#8377;{product.mrp.toLocaleString()}</span>
            </div>
            <span className="text-xs text-jet-success font-semibold bg-jet-success/10 px-2 py-1 rounded-full border border-jet-success/20">{discount}% off</span>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href={`/products/${product.id}/`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-jet-bg-elevated text-jet-text border border-jet-border rounded-xl font-semibold text-sm hover:bg-jet-primary hover:text-white hover:border-jet-primary transition-all"
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-jet-whatsapp/10 text-jet-whatsapp border border-jet-whatsapp/20 rounded-xl font-semibold text-sm hover:bg-jet-whatsapp hover:text-white transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group bg-jet-bg-card rounded-3xl border border-jet-border overflow-hidden hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 hover:border-jet-border-strong"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[16/10] bg-gradient-to-br from-jet-bg-elevated to-jet-bg p-8 flex items-center justify-center overflow-hidden">
        {product.badge && (
          <div className="absolute top-4 left-4 px-4 py-1.5 bg-jet-primary text-white text-sm font-bold rounded-full z-10">
            {product.badge}
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-4 right-4 px-4 py-1.5 bg-red-500/10 text-red-500 text-sm font-bold rounded-full z-10 border border-red-500/20">
            Save {discount}%
          </div>
        )}

        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.08),transparent_70%)]" />
        </div>

        {!imageError ? (
          <Image 
            src={product.image} 
            alt={altText}
            width={280}
            height={200}
            className="object-contain max-h-[180px] w-auto group-hover:scale-110 transition-transform duration-700"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-jet-primary/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-jet-primary">{product.shortName.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="p-6 lg:p-8 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${categoryColors[product.subCategory] || "bg-jet-text-muted/10 text-jet-text-muted border-jet-text-muted/20"}`}>
            {product.idealFor}
          </span>
          <span className="px-3 py-1 bg-jet-bg-elevated text-jet-text-muted text-xs rounded-full font-medium border border-jet-border">
            {categoryLabel}
          </span>
        </div>

        <h3 className="text-xl font-bold text-jet-text group-hover:text-jet-primary transition-colors leading-tight">
          {product.name}
        </h3>

        <p className="text-jet-text-dim text-sm leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-jet-text">&#8377;{product.price.toLocaleString()}</span>
            <span className="text-sm text-jet-text-muted line-through">&#8377;{product.mrp.toLocaleString()}</span>
          </div>
          <span className="text-xs text-jet-success font-semibold bg-jet-success/10 px-2 py-1 rounded-full border border-jet-success/20">{discount}% off</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href={`/products/${product.id}/`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-jet-bg-elevated text-jet-text border border-jet-border rounded-xl font-semibold text-sm hover:bg-jet-primary hover:text-white hover:border-jet-primary transition-all"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-jet-whatsapp/10 text-jet-whatsapp border border-jet-whatsapp/20 rounded-xl font-semibold text-sm hover:bg-jet-whatsapp hover:text-white transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
