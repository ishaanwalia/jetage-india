"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, ChevronRight, MessageCircle, Shield, Truck, MapPin } from "lucide-react";
import Link from "next/link";
import { ScrambleText } from "./TextScramble";
import { Typewriter } from "./Typewriter";
import { MagneticButton } from "./MagneticButton";

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
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
      setMousePos({ x: clientX, y: clientY });
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
      {/* 3D Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(8,145,178,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            x: useTransform(mouseX, [-0.5, 0.5], [-30, 30]),
            y: useTransform(mouseY, [-0.5, 0.5], [-30, 30]),
            transform: "translateZ(-100px)",
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
            x: useTransform(mouseX, [-0.5, 0.5], [20, -20]),
            y: useTransform(mouseY, [-0.5, 0.5], [20, -20]),
            transform: "translateZ(-200px)",
          }}
          animate={{ 
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 3D Grid Plane */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(8,145,178,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(8,145,178,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: "rotateX(60deg) translateZ(-300px)",
            transformOrigin: "center bottom",
          }}
        />

        {/* Floating 3D Cards */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-2xl border border-jet-primary/20 bg-jet-bg-card/50 backdrop-blur-sm"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              transform: `translateZ(${-50 - i * 30}px)`,
            }}
            animate={{
              y: [0, -20, 0],
              rotateY: [0, 360],
              rotateX: [0, 15, 0],
            }}
            transition={{
              y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 15 + i * 2, repeat: Infinity, ease: "linear" },
              rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-0 w-full"
        style={{ y, opacity, scale }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8" style={{ transform: "translateZ(50px)" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jet-primary/10 text-jet-primary text-sm font-medium border border-jet-primary/20 hover:border-jet-primary/40 transition-all cursor-default group">
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <ScrambleText text="Trusted Since 1989" triggerOnView />
              </div>
            </motion.div>

            <motion.h1 
              className="text-5xl lg:text-7xl xl:text-8xl font-bold text-jet-text leading-[0.95] tracking-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              style={{ transform: "translateZ(30px)" }}
            >
              Premium HP
              <span className="block text-gradient-gold glow-text">
                <Typewriter texts={["Products", "Laptops", "Printers", "Desktops"]} speed={100} pauseDuration={3000} />
              </span>
              <span className="block text-jet-text-dim text-3xl lg:text-4xl xl:text-5xl mt-4 font-medium">
                Delivered to You
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg lg:text-xl text-jet-text-dim max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{ transform: "translateZ(20px)" }}
            >
              Authorized HP World Partner with 35+ years of expertise. From laptops to printers, 
              find the perfect tech with best prices and instant WhatsApp support.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{ transform: "translateZ(40px)" }}
            >
              <MagneticButton strength={0.2}>
                <Link 
                  href="#products"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-jet-primary text-jet-bg rounded-full font-bold hover:bg-jet-accent transition-all duration-300 shadow-glow hover:shadow-premium-hover text-lg relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">Explore Products</span>
                  <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
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

            <motion.div 
              className="flex items-center gap-8 pt-4 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              {[
                { icon: Shield, label: "Authorized Dealer" },
                { icon: Truck, label: "All India Delivery" },
                { icon: MapPin, label: "Sector-17-E, Chandigarh" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-jet-text-muted group cursor-default">
                  <item.icon className="w-5 h-5 text-jet-primary group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-jet-text transition-colors">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - 3D Product Showcase */}
          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.5, duration: 1.2, type: "spring" }}
            style={{ 
              transformStyle: "preserve-3d",
              transform: "translateZ(0px)",
            }}
          >
            {/* 3D Card Stack */}
            <div className="relative w-full max-w-lg mx-auto" style={{ transformStyle: "preserve-3d" }}>
              {/* Back Card */}
              <motion.div
                className="absolute inset-0 bg-jet-bg-card rounded-3xl border border-jet-border shadow-premium"
                style={{ 
                  transform: "translateZ(-60px) rotateY(-8deg) rotateX(5deg)",
                  opacity: 0.6,
                }}
                animate={{
                  rotateY: [-8, -5, -8],
                  rotateX: [5, 3, 5],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Middle Card */}
              <motion.div
                className="absolute inset-0 bg-jet-bg-card rounded-3xl border border-jet-border shadow-premium"
                style={{ 
                  transform: "translateZ(-30px) rotateY(-4deg) rotateX(2deg)",
                  opacity: 0.8,
                }}
                animate={{
                  rotateY: [-4, -2, -4],
                  rotateX: [2, 1, 2],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Front Card - Main */}
              <motion.div
                className="relative bg-jet-bg-card rounded-3xl shadow-premium border border-jet-border p-8 backdrop-blur-sm"
                style={{ 
                  transform: "translateZ(0px)",
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ 
                  rotateY: 5, 
                  rotateX: -5,
                  scale: 1.02,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-jet-primary/20 via-jet-accent/20 to-jet-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="aspect-[4/3] bg-gradient-to-br from-jet-bg-elevated to-jet-bg rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(8,145,178,0.15),transparent_50%)]" />
                  
                  {/* 3D Floating Product Image */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotateY: [0, 5, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <img 
                      src="https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08107847.png"
                      alt="HP OmniBook X"
                      className="w-44 h-auto object-contain drop-shadow-2xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </motion.div>
                  
                  <div className="absolute top-4 right-4 bg-jet-success/20 text-jet-success px-3 py-1 rounded-full text-xs font-bold border border-jet-success/30 z-10">In Stock</div>
                  <div className="absolute top-4 left-4 bg-jet-primary/10 text-jet-primary px-3 py-1 rounded-full text-xs font-bold border border-jet-primary/20 z-10">New Arrival</div>
                  <div className="absolute bottom-4 left-4 bg-jet-primary/20 text-jet-primary px-3 py-1 rounded-full text-xs font-bold border border-jet-primary/30 z-10">Best Price</div>
                </div>

                <div className="mt-5 space-y-3" style={{ transform: "translateZ(20px)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-jet-text">HP OmniBook X</span>
                    <span className="px-2 py-0.5 bg-jet-primary/10 text-jet-primary text-xs rounded-full font-semibold border border-jet-primary/20">AI PC</span>
                  </div>
                  <p className="text-sm text-jet-text-muted">Intel Core Ultra • AI NPU • 16GB LPDDR5X</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-jet-text">₹1,12,999</span>
                    <span className="text-sm text-jet-text-muted line-through">₹1,45,999</span>
                    <span className="text-xs text-jet-success font-semibold bg-jet-success/10 px-2 py-0.5 rounded-full">Save 23%</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a 
                      href="/products/hp-envy-x360-13/"
                      className="flex-1 text-center py-2.5 bg-jet-primary text-white rounded-xl font-bold text-sm hover:bg-jet-primary-dim transition-all"
                    >
                      View Details
                    </a>
                    <a 
                      href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I'm%20interested%20in%20HP%20OmniBook%20X"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-jet-whatsapp/10 text-jet-whatsapp border border-jet-whatsapp/20 rounded-xl font-bold text-sm hover:bg-jet-whatsapp hover:text-white transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Quote
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Floating Stats */}
              <motion.div 
                className="absolute -bottom-4 -left-6 bg-jet-bg-card rounded-2xl shadow-premium p-4 border border-jet-border"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-jet-whatsapp/10 rounded-full flex items-center justify-center border border-jet-whatsapp/20">
                    <MessageCircle className="w-5 h-5 text-jet-whatsapp" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-jet-text">WhatsApp Order</p>
                    <p className="text-xs text-jet-text-muted">Instant Response</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -top-4 -right-4 bg-jet-bg-card rounded-2xl shadow-premium p-4 border border-jet-border"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-jet-primary/10 rounded-full flex items-center justify-center border border-jet-primary/20">
                    <svg className="w-5 h-5 text-jet-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-jet-text">4.5/5 Rating</p>
                    <p className="text-xs text-jet-text-muted">232+ Reviews</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}