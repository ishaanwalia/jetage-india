"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Typewriter } from "./Typewriter";
import { MagneticButton } from "./MagneticButton";
import { YEARS_TRADING } from "@/lib/business";

// three.js + @react-three/fiber/drei are a ~300KB gzip chunk — keep them
// out of the initial homepage bundle and stream in only once this mounts.
const Laptop3DViewer = dynamic(
  () => import("./Laptop3DViewer").then((m) => m.Laptop3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] sm:h-[480px] lg:h-[640px] relative flex items-center justify-center">
        <div className="w-3/4 h-3/4 rounded-2xl bg-jet-bg-elevated animate-pulse-slow border border-jet-border" />
      </div>
    ),
  }
);

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-visible pt-24 lg:pt-12"
      style={{ perspective: "1200px" }}
    >
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
        {/* Static ambient glows — no per-frame animation cost */}
        <div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(8,145,178,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-12 lg:py-0 w-full"
        style={{ y, opacity, scale }}
      >
        <div className="grid lg:grid-cols-2 gap-1 lg:gap-8 items-center">
          <div className="space-y-8" style={{ transform: "translateZ(50px)" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div
                onDoubleClick={() => router.push("/admin/")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jet-primary/10 text-jet-primary text-sm font-medium border border-jet-primary/20 hover:border-jet-primary/40 transition-all cursor-default group"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Trusted Since 1989</span>
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-jet-text leading-[0.95] tracking-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              Premium HP
              <span className="block text-gradient-gold glow-text">
                <Typewriter texts={["Products", "Laptops", "Gaming", "Desktops"]} speed={100} pauseDuration={3000} />
              </span>
              <span className="block text-jet-text-dim text-2xl sm:text-3xl lg:text-4xl xl:text-5xl mt-4 font-medium">
                Delivered to You
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg lg:text-xl text-jet-text-dim max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Authorized HP World Partner with {YEARS_TRADING}+ years of expertise. Explore our featured laptop in interactive 3D, right here on the homepage.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <MagneticButton strength={0.2}>
                <Link
                  href="/products/"
                  className="group btn-sheen inline-flex items-center gap-3 px-8 py-4 bg-jet-primary text-jet-bg rounded-full font-bold hover:bg-jet-accent transition-all duration-300 shadow-glow hover:shadow-premium-hover text-lg relative overflow-hidden"
                >
                  Explore Products
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <a 
                  href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20inquire%20about%20HP%20products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-jet-bg-card text-jet-whatsapp border border-jet-whatsapp/30 rounded-full font-bold hover:bg-jet-whatsapp hover:text-jet-text transition-all duration-300 text-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Order
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div
            className="relative flex items-center justify-center overflow-visible -mt-6 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2, type: "spring" }}
          >
            <Laptop3DViewer />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}