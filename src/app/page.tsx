"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Printer, 
  Zap, 
  Shield, 
  Truck, 
  Phone, 
  MessageCircle, 
  ChevronRight,
  Star,
  Award,
  Clock,
  MapPin,
  Laptop,
  Monitor,
  Mouse,
  ArrowRight,
  TrendingUp,
  Users,
  Globe,
  Sparkles,
  Cpu,
  HardDrive,
  Wifi,
  ChevronDown,
  Eye
} from "lucide-react";
import Link from "next/link";
import { products, categories, getFeaturedProducts } from "@/lib/data/products";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShowroomSection } from "@/components/ShowroomSection";
import { ParticleBackground } from "@/components/ParticleBackground";
import { SpotlightCard } from "@/components/SpotlightCard";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { Counter } from "@/components/Counter";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Typewriter } from "@/components/Typewriter";
import { ScrambleText } from "@/components/TextScramble";
import { Marquee } from "@/components/Marquee";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroLoaded, setHeroLoaded] = useState(false);

  const featuredProducts = getFeaturedProducts().slice(0, 6);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    // Hero entrance
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll section
      const horizontalSection = horizontalRef.current;
      if (horizontalSection) {
        const scrollContainer = horizontalSection.querySelector(".horizontal-scroll-container");
        if (scrollContainer) {
          gsap.to(scrollContainer, {
            x: () => -(scrollContainer.scrollWidth - window.innerWidth + 100),
            ease: "none",
            scrollTrigger: {
              trigger: horizontalSection,
              start: "top top",
              end: () => `+=${scrollContainer.scrollWidth - window.innerWidth + 100}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  const filteredProducts = activeCategory === "all" 
    ? products.slice(0, 8) 
    : products.filter(p => p.category === activeCategory).slice(0, 8);

  const categoryIcons: Record<string, any> = { 
    Laptop, Monitor, Printer, MonitorSmartphone: Monitor, Mouse 
  };

  return (
    <main className="min-h-screen bg-jet-bg noise-bg relative">
      <ParticleBackground />
      
      {/* Custom cursor glow */}
      <div 
        className="fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-20 blur-3xl transition-transform duration-150 ease-out hidden lg:block"
        style={{
          background: "radial-gradient(circle, rgba(201,168,76,0.25) 0%, transparent 70%)",
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
      />

      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-36 lg:pt-8"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-jet-primary/5 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-jet-primary/3 rounded-full blur-[150px] animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-jet-primary/2 rounded-full blur-[200px]" />
          <div className="absolute inset-0 grid-pattern opacity-50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-0 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Reveal direction="up" delay={0.2}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jet-primary/10 text-jet-primary text-sm font-medium border border-jet-primary/20 hover:border-jet-primary/40 transition-all cursor-default group">
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <ScrambleText text="Trusted Since 1989" triggerOnView />
                </div>
              </Reveal>

              <Reveal direction="up" delay={0.4}>
                <h1 className={`text-5xl lg:text-7xl xl:text-8xl font-bold text-jet-text leading-[0.95] tracking-tight transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  Premium HP
                  <span className="block text-gradient-gold glow-text">
                    <Typewriter texts={["Products", "Laptops", "Printers", "Desktops"]} speed={100} pauseDuration={3000} />
                  </span>
                  <span className="block text-jet-text-dim text-3xl lg:text-4xl xl:text-5xl mt-4 font-medium">
                    Delivered to You
                  </span>
                </h1>
              </Reveal>

              <Reveal direction="up" delay={0.6}>
                <p className="text-lg lg:text-xl text-jet-text-dim max-w-lg leading-relaxed">
                  Authorized HP World Partner with 35+ years of expertise. From laptops to printers, 
                  find the perfect tech with best prices and instant WhatsApp support.
                </p>
              </Reveal>

              <Reveal direction="up" delay={0.8}>
                <div className="flex flex-wrap gap-4">
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
                </div>
              </Reveal>

              <Reveal direction="up" delay={1.0}>
                <div className="flex items-center gap-8 pt-4 flex-wrap">
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
                </div>
              </Reveal>
            </div>

            <div className="relative hidden lg:block">
              <TiltCard tiltAmount={8} glareOpacity={0.1}>
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute inset-8 border border-jet-primary/10 rounded-full" />
                    <div className="absolute inset-16 border border-jet-primary/5 rounded-full" />
                    <div className="absolute inset-24 border border-jet-primary/10 rounded-full" />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-jet-primary/20 to-transparent rounded-full blur-2xl" />

                  <div className="relative bg-jet-bg-card rounded-3xl shadow-premium border border-jet-border p-8 backdrop-blur-sm">
                    <div className="aspect-[4/3] bg-gradient-to-br from-jet-bg-elevated to-jet-bg rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,168,76,0.1),transparent_50%)]" />
                      <Laptop className="w-32 h-32 text-jet-primary/40 animate-pulse-slow" strokeWidth={0.8} />
                      <div className="absolute top-4 right-4 bg-jet-success/20 text-jet-success px-3 py-1 rounded-full text-xs font-bold border border-jet-success/30">In Stock</div>
                      <div className="absolute bottom-4 left-4 bg-jet-primary/20 text-jet-primary px-3 py-1 rounded-full text-xs font-bold border border-jet-primary/30">Best Price</div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="h-3 bg-jet-bg-elevated rounded-full w-3/4 animate-shimmer" />
                      <div className="h-3 bg-jet-bg-elevated rounded-full w-1/2 animate-shimmer" style={{ animationDelay: "0.5s" }} />
                      <div className="flex gap-2 mt-4">
                        <div className="h-8 w-20 bg-jet-primary rounded-lg animate-pulse-slow" />
                        <div className="h-8 w-8 bg-jet-bg-elevated rounded-lg border border-jet-border" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -left-6 bg-jet-bg-card rounded-2xl shadow-premium p-4 border border-jet-border animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-jet-whatsapp/10 rounded-full flex items-center justify-center border border-jet-whatsapp/20">
                        <MessageCircle className="w-5 h-5 text-jet-whatsapp" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-jet-text">WhatsApp Order</p>
                        <p className="text-xs text-jet-text-muted">Instant Response</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-4 -right-4 bg-jet-bg-card rounded-2xl shadow-premium p-4 border border-jet-border animate-float-delayed">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-jet-primary/10 rounded-full flex items-center justify-center border border-jet-primary/20">
                        <Star className="w-5 h-5 text-jet-primary fill-jet-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-jet-text">4.5/5 Rating</p>
                        <p className="text-xs text-jet-text-muted">232+ Reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-jet-bg via-jet-bg-elevated to-jet-bg" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-6" direction="up" stagger={0.15}>
            {[
              { icon: Clock, value: 35, suffix: "+", label: "Years Experience", sub: "yrs" },
              { icon: Printer, value: 10000, suffix: "+", label: "Products Sold", sub: "" },
              { icon: Globe, value: 25, suffix: "+", label: "Cities Served", sub: "" },
              { icon: Star, value: 4.5, suffix: "", label: "Customer Rating", sub: "/5", decimals: 1 },
            ].map((stat, i) => (
              <SpotlightCard key={i}>
                <div className="text-center space-y-4 p-6 rounded-2xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all duration-500 hover:shadow-premium group cursor-default">
                  <div className="w-14 h-14 mx-auto bg-jet-primary/10 rounded-2xl flex items-center justify-center border border-jet-primary/20 group-hover:scale-110 group-hover:bg-jet-primary transition-all duration-500">
                    <stat.icon className="w-7 h-7 text-jet-primary group-hover:text-jet-bg transition-colors" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold text-jet-text">
                    <Counter end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                    <span className="text-jet-primary">{stat.sub}</span>
                  </div>
                  <p className="text-jet-text-muted text-sm">{stat.label}</p>
                </div>
              </SpotlightCard>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ==================== CATEGORIES SECTION ==================== */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up" className="text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
              Browse by Category
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
              Everything <span className="text-gradient-gold">HP</span>
            </h2>
            <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
              From powerful workstations to everyday essentials — find your perfect HP product.
            </p>
          </Reveal>

          <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-5 gap-5" direction="scale" stagger={0.1}>
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.icon] || Printer;
              return (
                <TiltCard key={cat.id} tiltAmount={6}>
                  <Link 
                    href={`/category/${cat.id}/`}
                    className="group block p-8 rounded-3xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all duration-500 hover:shadow-premium-hover text-center space-y-4 h-full"
                  >
                    <div className="w-16 h-16 mx-auto bg-jet-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-jet-primary group-hover:scale-110 transition-all duration-500 border border-jet-primary/20">
                      <Icon className="w-8 h-8 text-jet-primary group-hover:text-jet-bg transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-jet-text group-hover:text-jet-primary transition-colors">{cat.name}</h3>
                      <p className="text-jet-text-muted text-sm mt-1">{cat.description}</p>
                      <p className="text-jet-primary text-xs font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {cat.count} products
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-jet-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </TiltCard>
              );
            })}
          </StaggerReveal>
        </div>
      </section>

      {/* ==================== HORIZONTAL SCROLL SECTION ==================== */}
      <section ref={horizontalRef} className="relative bg-jet-bg-elevated overflow-hidden">
        <div className="h-screen flex flex-col justify-center">
          <div className="px-6 lg:px-8 mb-10">
            <div className="max-w-7xl mx-auto">
              <Reveal direction="left">
                <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20 mb-4">
                  Featured Collection
                </span>
              </Reveal>
              <Reveal direction="left" delay={0.1}>
                <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
                  Scroll to <span className="text-gradient-gold">Explore</span>
                </h2>
              </Reveal>
              <Reveal direction="left" delay={0.2}>
                <p className="text-jet-text-dim mt-4 text-lg">Drag or scroll to browse our handpicked selection</p>
              </Reveal>
            </div>
          </div>
          
          <div className="horizontal-scroll-container flex gap-8 px-6 lg:px-8 will-change-transform">
            {featuredProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[400px] lg:w-[500px]">
                <ProductCard product={product} featured />
              </div>
            ))}
            
            <div className="flex-shrink-0 w-[400px] lg:w-[500px] flex items-center justify-center">
              <TiltCard tiltAmount={5}>
                <Link 
                  href="/products/"
                  className="group flex flex-col items-center justify-center gap-4 p-12 rounded-3xl bg-jet-bg-card border border-jet-border hover:border-jet-primary/40 transition-all duration-500 hover:shadow-premium h-full w-full"
                >
                  <div className="w-20 h-20 rounded-full bg-jet-primary/10 flex items-center justify-center group-hover:bg-jet-primary group-hover:scale-110 transition-all duration-500 border border-jet-primary/20">
                    <ArrowRight className="w-8 h-8 text-jet-primary group-hover:text-jet-bg transition-colors" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-jet-text group-hover:text-jet-primary transition-colors">View All</h3>
                    <p className="text-jet-text-muted mt-2">{products.length}+ Products</p>
                  </div>
                </Link>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRODUCT GRID WITH FILTER ==================== */}
      <section id="products" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up" className="text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
              Our Collection
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
              All <span className="text-gradient-gold">Products</span>
            </h2>
            <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
              Handpicked selection with exclusive Jetage pricing. Filter by category below.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.2} className="flex justify-center gap-3 mb-10 flex-wrap">
            {[
              { id: "all", label: "All" },
              { id: "laptop", label: "Laptops" },
              { id: "desktop", label: "Desktops" },
              { id: "printer", label: "Printers" },
              { id: "monitor", label: "Monitors" },
              { id: "accessory", label: "Accessories" },
            ].map((cat) => (
              <MagneticButton key={cat.id} strength={0.15}>
                <button
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    activeCategory === cat.id 
                      ? "bg-jet-primary text-jet-bg border-jet-primary shadow-glow scale-105" 
                      : "bg-jet-bg-card text-jet-text-dim border-jet-border hover:border-jet-primary/40 hover:text-jet-primary"
                  }`}
                >
                  {cat.label}
                </button>
              </MagneticButton>
            ))}
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <Reveal key={product.id} direction="up" delay={i * 0.05}>
                <ProductCard product={product} compact />
              </Reveal>
            ))}
          </div>

          <Reveal direction="up" delay={0.3} className="text-center mt-12">
            <MagneticButton strength={0.2}>
              <Link 
                href="/products/"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-jet-bg-card text-jet-primary border-2 border-jet-primary/30 rounded-full font-bold hover:bg-jet-primary hover:text-jet-bg transition-all duration-300"
              >
                View All Products
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ==================== LAPTOP SHOWCASE ==================== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-jet-bg via-jet-bg-elevated to-jet-bg" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-jet-primary/5 rounded-full blur-[200px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Reveal direction="up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium border border-purple-500/20">
                  <Cpu className="w-4 h-4 animate-pulse" />
                  New Arrival
                </div>
              </Reveal>
              
              <Reveal direction="up" delay={0.1}>
                <h2 className="text-4xl lg:text-6xl font-bold text-jet-text leading-tight">
                  HP <span className="text-gradient-gold">OmniBook X</span>
                  <span className="block text-2xl lg:text-3xl text-jet-text-dim mt-4 font-medium">
                    <Typewriter texts={["AI-Powered.", "Ultra-Thin.", "Unstoppable."]} speed={60} pauseDuration={1500} />
                  </span>
                </h2>
              </Reveal>

              <Reveal direction="up" delay={0.2}>
                <p className="text-jet-text-dim text-lg leading-relaxed">
                  The next evolution of HP Envy. Intel Core Ultra processors with dedicated AI NPU. 
                  3K OLED touchscreen. All-day battery. This is not just a laptop — it's your AI companion.
                </p>
              </Reveal>

              <StaggerReveal className="grid grid-cols-2 gap-4" direction="scale" stagger={0.1}>
                {[
                  { icon: Cpu, label: "Intel Core Ultra", desc: "AI NPU Built-in" },
                  { icon: Monitor, label: "3K OLED", desc: "Touch Display" },
                  { icon: HardDrive, label: "1TB SSD", desc: "NVMe Storage" },
                  { icon: Wifi, label: "Wi-Fi 7", desc: "Next-Gen Wireless" },
                ].map((spec, i) => (
                  <TiltCard key={i} tiltAmount={4}>
                    <div className="p-4 rounded-2xl bg-jet-bg-card border border-jet-border hover:border-jet-primary/30 transition-all group cursor-default">
                      <spec.icon className="w-6 h-6 text-jet-primary mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-jet-text font-semibold text-sm">{spec.label}</p>
                      <p className="text-jet-text-muted text-xs">{spec.desc}</p>
                    </div>
                  </TiltCard>
                ))}
              </StaggerReveal>

              <Reveal direction="up" delay={0.4}>
                <div className="flex flex-wrap gap-4">
                  <MagneticButton strength={0.2}>
                    <a 
                      href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20inquire%20about%20HP%20OmniBook%20X"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-jet-primary text-jet-bg rounded-full font-bold hover:bg-jet-accent transition-all shadow-glow"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Get Quote on WhatsApp
                    </a>
                  </MagneticButton>
                  <span className="inline-flex items-center gap-2 px-6 py-4 text-jet-text-dim">
                    <span className="text-2xl font-bold text-jet-text">₹136,499</span>
                    <span className="text-sm line-through">₹199,146</span>
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal direction="left" delay={0.3}>
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-br from-jet-primary/20 via-purple-500/10 to-transparent rounded-3xl blur-3xl animate-pulse-slow" />
                
                <TiltCard tiltAmount={10} glareOpacity={0.15}>
                  <div className="relative bg-jet-bg-card rounded-3xl border border-jet-border p-8 shadow-premium">
                    <div className="aspect-[4/3] bg-gradient-to-br from-jet-bg-elevated to-jet-bg rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,76,0.1),transparent_60%)]" />
                      <Laptop className="w-48 h-48 text-jet-primary/30 animate-float" strokeWidth={0.5} />
                      
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-jet-primary/20 text-jet-primary text-xs font-bold rounded-full border border-jet-primary/30 backdrop-blur-sm">
                        Copilot+ PC
                      </div>
                      <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30 backdrop-blur-sm">
                        AI Ready
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div>
                        <p className="text-jet-text font-bold">HP OmniBook X Flip 14</p>
                        <p className="text-jet-text-muted text-sm">Next Gen AI PC</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-jet-primary fill-jet-primary" />
                        <span className="text-jet-text font-bold">4.8</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ShowroomSection />

      {/* ==================== WHY JETAGE ==================== */}
      <section id="about" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up" className="text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
              Why Jetage
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
              The Jetage <span className="text-gradient-gold">Advantage</span>
            </h2>
          </Reveal>

          <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" direction="up" stagger={0.1}>
            {[
              { icon: Award, title: "Authorized HP World", description: "Genuine HP products with full manufacturer warranty and official support. No grey market risks." },
              { icon: Phone, title: "WhatsApp Ordering", description: "Order instantly via WhatsApp. Get quotes, place orders, and track delivery — all on your phone." },
              { icon: Zap, title: "Best Price Guarantee", description: "We match and beat competitor prices. Exclusive deals you won't find on Amazon or Flipkart." },
              { icon: Shield, title: "Expert Consultation", description: "35+ years of tech expertise. We help you choose the right product for your exact needs." },
              { icon: Truck, title: "All India Delivery", description: "Fast, insured shipping across India. Special handling for fragile components." },
              { icon: Clock, title: "After-Sales Support", description: "Dedicated support for installation, setup, and troubleshooting. We're just a message away." }
            ].map((item, i) => (
              <SpotlightCard key={i}>
                <div className="group p-8 rounded-3xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all duration-500 hover:shadow-premium h-full cursor-default">
                  <div className="w-14 h-14 bg-jet-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-jet-primary group-hover:scale-110 transition-all duration-500 border border-jet-primary/20">
                    <item.icon className="w-7 h-7 text-jet-primary group-hover:text-jet-bg transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-jet-text mb-3 group-hover:text-jet-primary transition-colors">{item.title}</h3>
                  <p className="text-jet-text-dim leading-relaxed">{item.description}</p>
                </div>
              </SpotlightCard>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ==================== MARQUEE BRANDS ==================== */}
      <section className="py-14 border-y border-jet-border overflow-hidden">
        <Marquee speed={25} pauseOnHover>
          {["HP World Authorized", "Genuine Products", "35+ Years Trust", "All India Delivery", "WhatsApp Support", "Best Price Guarantee", "Expert Consultation", "After-Sales Service"].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-jet-text-muted hover:text-jet-primary transition-colors cursor-default">
              <div className="w-2 h-2 bg-jet-primary rounded-full animate-pulse" />
              <span className="text-lg font-semibold tracking-wide">{text}</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-jet-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-jet-primary/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <Reveal direction="scale" className="space-y-6">
            <h2 className="text-4xl lg:text-7xl font-bold text-jet-text leading-tight">
              Ready to Find Your
              <span className="block text-gradient-gold glow-text">
                <ScrambleText text="Perfect HP?" triggerOnView />
              </span>
            </h2>
            <p className="text-lg text-jet-text-dim max-w-2xl mx-auto">
              Get personalized recommendations, instant quotes, and exclusive pricing via WhatsApp. 
              Our team responds within minutes.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <MagneticButton strength={0.25}>
                <a 
                  href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20need%20help%20choosing%20an%20HP%20product"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-jet-whatsapp text-white rounded-full font-bold hover:bg-[#128C7E] transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:shadow-jet-whatsapp/20"
                >
                  <MessageCircle className="w-6 h-6" />
                  Chat on WhatsApp
                </a>
              </MagneticButton>
              
              <MagneticButton strength={0.25}>
                <a 
                  href="tel:+919814958295"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-jet-bg-card text-jet-text border border-jet-border rounded-full font-bold hover:border-jet-primary/40 hover:text-jet-primary transition-all duration-300 text-lg"
                >
                  <Phone className="w-6 h-6" />
                  Call Us
                </a>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}