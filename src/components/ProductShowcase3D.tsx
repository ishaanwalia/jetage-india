"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data/products";
import { ChevronRight, MessageCircle } from "lucide-react";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "50%"]);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["-50%", "50%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const whatsappLink = `https://wa.me/919814958295?text=Hi%20Jetage%2C%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`;

  // Get proper alt text
  const altText = product.category === "printer" 
    ? getPrinterAltText(product) 
    : getProductAltText(product);

  return (
    <motion.div
      ref={cardRef}
      className="relative perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <motion.div
        className="relative bg-jet-bg-card rounded-3xl border border-jet-border overflow-hidden"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02, z: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* 3D Glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: isHovered
              ? `radial-gradient(600px circle at calc(50% + ${glowX.get()}px) calc(50% + ${glowY.get()}px), rgba(8,145,178,0.15), transparent 40%)`
              : "none",
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Floating shadow */}
        <motion.div
          className="absolute -inset-1 bg-jet-primary/20 rounded-3xl blur-xl -z-10"
          style={{
            opacity: isHovered ? 0.3 : 0,
            transform: isHovered ? "translateZ(-20px)" : "translateZ(-50px)",
          }}
        />

        {/* Product Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-jet-bg-elevated to-jet-bg p-6 flex items-center justify-center overflow-hidden">
          {product.badge && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-jet-primary text-white text-xs font-bold rounded-full z-10">
              {product.badge}
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full z-10 border border-red-500/20">
              -{discount}%
            </div>
          )}
          
          <motion.div
            style={{ transform: "translateZ(40px)" }}
            animate={{ y: isHovered ? -5 : 0 }}
          >
            <Image
              src={product.image}
              alt={altText}
              width={200}
              height={150}
              className="object-contain max-h-[150px] w-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3" style={{ transform: "translateZ(30px)" }}>
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
              style={{ transform: "translateZ(20px)" }}
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-jet-whatsapp/10 text-jet-whatsapp border border-jet-whatsapp/20 rounded-xl font-semibold text-sm hover:bg-jet-whatsapp hover:text-white transition-all"
              style={{ transform: "translateZ(20px)" }}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" style={{ perspective: "1000px" }}>
          {featuredProducts.map((product, i) => (
            <Product3DCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
