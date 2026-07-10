"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Laptop, Monitor, Printer, Mouse, ArrowRight } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/data/products";

const countFor = (id: string) => products.filter((p) => p.category === id).length;

const categories = [
  { id: "printer", name: "Printers", icon: Printer, description: "Laser, Color Laser, InkJet, Smart Tank & OfficeJet", count: countFor("printer"), color: "#0891b2" },
  { id: "accessory", name: "Accessories", icon: Mouse, description: "Keyboards, Mice & Combos", count: countFor("accessory"), color: "#06b6d4" },
];

function CategoryCard3D({ category, index }: { category: typeof categories[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const Icon = category.icon;

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, y: 60, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.7, type: "spring" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
      style={{ perspective: "1000px" }}
    >
      <Link href={`/category/${category.id}/`}>
        <motion.div
          className="group block p-8 rounded-3xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all duration-500 text-center space-y-4 h-full relative overflow-hidden"
          animate={{
            rotateY: isHovered ? mousePos.x * 15 : 0,
            rotateX: isHovered ? -mousePos.y * 15 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ 
            transformStyle: "preserve-3d",
            boxShadow: isHovered 
              ? `0 25px 50px -12px rgba(8,145,178,0.25), 0 0 0 1px ${category.color}30`
              : "0 4px 30px -4px rgba(8,145,178,0.08)",
          }}
        >
          {/* Background glow on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at ${50 + mousePos.x * 100}% ${50 + mousePos.y * 100}%, ${category.color}15, transparent 50%)`,
            }}
          />

          {/* 3D Icon Container */}
          <motion.div 
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center border transition-all duration-500 relative"
            style={{ 
              transform: "translateZ(40px)",
              backgroundColor: `${category.color}15`,
              borderColor: `${category.color}30`,
            }}
            whileHover={{
              backgroundColor: category.color,
              scale: 1.1,
            }}
          >
            <Icon 
              className="w-10 h-10 transition-colors duration-500" 
              style={{ color: category.color }}
            />
            
            {/* Floating particles around icon */}
            {isHovered && (
              <>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, (i - 1.5) * 30],
                      y: [0, -30 - i * 10],
                    }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </>
            )}
          </motion.div>

          <div style={{ transform: "translateZ(30px)" }}>
            <h3 className="text-2xl font-bold text-jet-text group-hover:text-jet-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-jet-text-muted text-sm mt-2">{category.description}</p>
          </div>

          <motion.div 
            className="flex items-center justify-center gap-1 text-jet-primary text-sm font-semibold"
            style={{ transform: "translateZ(20px)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          >
            {category.count} products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.div>

          {/* Bottom 3D line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl"
            style={{ 
              backgroundColor: category.color,
              transform: "translateZ(10px)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function CategoryGrid3D() {
  return (
    <section className="py-20 relative" style={{ perspective: "1200px" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
            Browse by Category
          </span>
          <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
            Everything <span className="text-gradient-gold">HP</span>
          </h2>
          <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
            Genuine HP printers and accessories at the best prices. Find your perfect product today.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto" style={{ transformStyle: "preserve-3d" }}>
          {categories.map((cat, i) => (
            <CategoryCard3D key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
