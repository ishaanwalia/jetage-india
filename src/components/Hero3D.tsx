"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Typewriter } from "./Typewriter";
import { MagneticButton } from "./MagneticButton";
import { Laptop3DViewer } from "./Laptop3DViewer";

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / innerWidth);
      mouseY.set((clientY - innerHeight / 2) / innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-36 lg:pt-12"
      style={{ perspective: "1200px" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(8,145,178,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            x: useTransform(mouseX, [-0.5, 0.5], [-30, 30]),
            y: useTransform(mouseY, [-0.5, 0.5], [-30, 30]),
            transform: "translateZ(-100px)",
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)",
            filter: "blur(50px)",
            x: useTransform(mouseX, [-0.5, 0.5], [20, -20]),
            y: useTransform(mouseY, [-0.5, 0.5], [20, -20]),
            transform: "translateZ(-80px)",
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-0 w-full"
        style={{ y, opacity, scale }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8" style={{ transform: "translateZ(50px)" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jet-primary/10 text-jet-primary text-sm font-medium border border-jet-primary/20 hover:border-jet-primary/40 transition-all cursor-default group">
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
              Authorized HP World Partner with 35+ years of expertise. Experience premium HP products in stunning 3D.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <MagneticButton strength={0.2}>
                <Link 
                  href="#products"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-jet-primary text-jet-bg rounded-full font-bold hover:bg-jet-accent transition-all duration-300 shadow-glow hover:shadow-premium-hover text-lg relative overflow-hidden"
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
                  className="inline-flex items-center gap-3 px-8 py-4 bg-jet-bg-card text-jet-whatsapp border border-jet-whatsapp/30 rounded-full font-bold hover:bg-jet-whatsapp hover:text-white transition-all duration-300 text-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Order
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div 
            className="relative flex items-center justify-center"
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