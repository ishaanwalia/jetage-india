"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useSpring } from "framer-motion";
import { Clock, Printer, Globe, Star } from "lucide-react";

// FIX 1: Use ComponentType instead of ElementType
interface StatCard3DProps {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
  sub?: string;
  decimals?: number;
  index: number;
}

function AnimatedCounter3D({ value, suffix = "", prefix = "", decimals = 0, duration = 2 }: {
  value: number; suffix?: string; prefix?: string; decimals?: number; duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (isInView) springValue.set(value);
  }, [isInView, springValue, value]);

  // FIX 2: Use on("change") listener instead of display.get()
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [springValue]);

  const formatted = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.round(displayValue).toString();

  return (
    <span ref={ref} className="inline-block">
      <motion.span
        className="inline-block font-bold"
        initial={{ rotateX: 90, opacity: 0 }}
        animate={isInView ? { rotateX: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: "bottom" }}
      >
        {prefix}{formatted}{suffix}
      </motion.span>
    </span>
  );
}

function StatCard3D({ icon: Icon, value, suffix, label, sub = "", decimals = 0, index }: StatCard3DProps) {
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

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.8, type: "spring" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="text-center space-y-4 p-6 rounded-2xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all duration-500 hover:shadow-premium group cursor-default relative overflow-hidden"
        animate={{
          rotateY: isHovered ? mousePos.x * 20 : 0,
          rotateX: isHovered ? -mousePos.y * 20 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
          style={{
            background: isHovered
              ? `radial-gradient(400px circle at ${50 + mousePos.x * 100}% ${50 + mousePos.y * 100}%, rgba(8,145,178,0.1), transparent 50%)`
              : "none",
          }}
        />
        <motion.div 
          className="w-14 h-14 mx-auto bg-jet-primary/10 rounded-2xl flex items-center justify-center border border-jet-primary/20 group-hover:bg-jet-primary group-hover:scale-110 transition-all duration-500"
          style={{ transform: "translateZ(30px)" }}
        >
          <Icon className="w-7 h-7 text-jet-primary group-hover:text-jet-bg transition-colors" />
        </motion.div>
        <div className="text-4xl lg:text-5xl font-bold text-jet-text" style={{ transform: "translateZ(20px)" }}>
          <AnimatedCounter3D value={value} suffix={suffix} decimals={decimals} />
          <span className="text-jet-primary">{sub}</span>
        </div>
        <p className="text-jet-text-muted text-sm" style={{ transform: "translateZ(10px)" }}>{label}</p>
      </motion.div>
    </motion.div>
  );
}

export function Stats3D() {
  const stats = [
    { icon: Clock, value: 37, suffix: "+", label: "Years Experience", sub: "yrs" },
    { icon: Printer, value: 50000, suffix: "+", label: "Products Sold", sub: "" },
    { icon: Globe, value: 50, suffix: "+", label: "Cities Served", sub: "" },
    { icon: Star, value: 4.5, suffix: "", label: "Customer Rating", sub: "/5", decimals: 1 },
  ];

  return (
    <section className="py-20 relative" style={{ perspective: "1000px" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-jet-bg via-jet-bg-elevated to-jet-bg" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" style={{ transformStyle: "preserve-3d" }}>
          {stats.map((stat, i) => (
            <StatCard3D key={i} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}