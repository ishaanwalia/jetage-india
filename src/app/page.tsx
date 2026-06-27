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
  Wifi
} from "lucide-react";
import Link from "next/link";
import { products, categories, getFeaturedProducts } from "@/lib/data/products";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShowroomSection } from "@/components/ShowroomSection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const featuredProducts = getFeaturedProducts().slice(0, 6);
  const printerProducts = products.filter(p => p.category === "printer").slice(0, 4);
  const laptopProducts = products.filter(p => p.category === "laptop").slice(0, 3);
  const desktopProducts = products.filter(p => p.category === "desktop").slice(0, 2);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(".hero-title", {
        y: 80, opacity: 0, duration: 1.4, ease: "power4.out", delay: 0.3,
      });
      gsap.from(".hero-subtitle", {
        y: 50, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.6,
      });
      gsap.from(".hero-cta", {
        y: 40, opacity: 0, duration: 1, ease: "power3.out", delay: 0.9,
      });
      gsap.from(".hero-stats", {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 1.2,
      });

      // Stats counter animation
      gsap.from(".stat-item", {
        y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
      });

      // Categories reveal
      gsap.from(".category-card", {
        y: 80, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: categoriesRef.current, start: "top 80%" },
      });

      // Horizontal scroll section — THE ZERA EFFECT
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

      // Featured products
      gsap.from(".featured-header", {
        y: 50, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: featuredRef.current, start: "top 80%" },
      });
      gsap.from(".featured-card", {
        y: 60, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: featuredRef.current, start: "top 75%" },
      });

      // Why cards
      gsap.from(".why-card", {
        y: 80, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: whyRef.current, start: "top 75%" },
      });

      // CTA
      gsap.from(".cta-content", {
        y: 60, opacity: 0, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: ctaRef.current, start: "top 80%" },
      });
    });

    return () => ctx.revert();
  }, []);

  const filteredProducts = activeCategory === "all" 
    ? products.slice(0, 8) 
    : products.filter(p => p.category === activeCategory).slice(0, 8);

  return (
    <main className="min-h-screen bg-jet-bg noise-bg">
      {/* Custom cursor glow — follows mouse */}
      <div 
        className="fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-20 blur-3xl transition-transform duration-100 ease-out hidden lg:block"
        style={{
          background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)",
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
      />

      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-24 lg:pt-0"
      >
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-jet-primary/5 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-jet-primary/3 rounded-full blur-[150px] animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-jet-primary/2 rounded-full blur-[200px]" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-50" />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-jet-primary/40 rounded-full animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + i}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jet-primary/10 text-jet-primary text-sm font-medium border border-jet-primary/20">
                <Sparkles className="w-4 h-4" />
                Trusted Since 1989
              </div>

              <h1 className="hero-title text-5xl lg:text-7xl xl:text-8xl font-bold text-jet-text leading-[0.95] tracking-tight">
                Premium HP
                <span className="block text-gradient-gold glow-text">Products</span>
                <span className="block text-jet-text-dim text-3xl lg:text-4xl xl:text-5xl mt-4 font-medium">Delivered to You</span>
              </h1>

              <p className="hero-subtitle text-lg lg:text-xl text-jet-text-dim max-w-lg leading-relaxed">
                Authorized HP World Partner with 35+ years of expertise. From laptops to printers, 
                find the perfect tech with best prices and instant WhatsApp support.
              </p>

              <div className="hero-cta flex flex-wrap gap-4">
                <Link 
                  href="#products"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-jet-primary text-jet-bg rounded-full font-bold hover:bg-jet-accent transition-all duration-300 shadow-glow hover:shadow-premium-hover text-lg"
                >
                  Explore Products
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20inquire%20about%20HP%20products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-jet-bg-card text-jet-whatsapp border border-jet-whatsapp/30 rounded-full font-bold hover:bg-jet-whatsapp hover:text-white transition-all duration-300 text-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Order
                </a>
              </div>

              <div className="hero-stats flex items-center gap-8 pt-4 flex-wrap">
                {[
                  { icon: Shield, label: "Authorized Dealer" },
                  { icon: Truck, label: "All India Delivery" },
                  { icon: MapPin, label: "Sector-17-E, Chandigarh" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-jet-text-muted">
                    <item.icon className="w-5 h-5 text-jet-primary" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-image relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Orbital rings */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute inset-8 border border-jet-primary/10 rounded-full" />
                  <div className="absolute inset-16 border border-jet-primary/5 rounded-full" />
                  <div className="absolute inset-24 border border-jet-primary/10 rounded-full" />
                </div>
                
                {/* Center glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-jet-primary/20 to-transparent rounded-full blur-2xl" />

                {/* Product showcase card */}
                <div className="relative bg-jet-bg-card rounded-3xl shadow-premium border border-jet-border p-8 transform rotate-2 hover:rotate-0 transition-transform duration-700 backdrop-blur-sm">
                  <div className="aspect-[4/3] bg-gradient-to-br from-jet-bg-elevated to-jet-bg rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,168,76,0.1),transparent_50%)]" />
                    <Laptop className="w-32 h-32 text-jet-primary/40" strokeWidth={0.8} />
                    <div className="absolute top-4 right-4 bg-jet-success/20 text-jet-success px-3 py-1 rounded-full text-xs font-bold border border-jet-success/30">In Stock</div>
                    <div className="absolute bottom-4 left-4 bg-jet-primary/20 text-jet-primary px-3 py-1 rounded-full text-xs font-bold border border-jet-primary/30">Best Price</div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="h-3 bg-jet-bg-elevated rounded-full w-3/4" />
                    <div className="h-3 bg-jet-bg-elevated rounded-full w-1/2" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 w-20 bg-jet-primary rounded-lg" />
                      <div className="h-8 w-8 bg-jet-bg-elevated rounded-lg border border-jet-border" />
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
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
                      <Star className="w-5 h-5 text-jet-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-jet-text">4.5/5 Rating</p>
                      <p className="text-xs text-jet-text-muted">232+ Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-jet-text-muted">
          <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-jet-border rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-jet-primary rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section ref={statsRef} className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-jet-bg via-jet-bg-elevated to-jet-bg" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, value: "35+", label: "Years Experience", suffix: "yrs" },
              { icon: Printer, value: "10,000+", label: "Products Sold", suffix: "" },
              { icon: Globe, value: "25+", label: "Cities Served", suffix: "" },
              { icon: Star, value: "4.5", label: "Customer Rating", suffix: "/5" },
            ].map((stat, i) => (
              <div key={i} className="stat-item text-center space-y-4 p-6 rounded-2xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all duration-500 hover:shadow-premium">
                <div className="w-14 h-14 mx-auto bg-jet-primary/10 rounded-2xl flex items-center justify-center border border-jet-primary/20">
                  <stat.icon className="w-7 h-7 text-jet-primary" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-jet-text">
                  {stat.value}<span className="text-jet-primary">{stat.suffix}</span>
                </div>
                <p className="text-jet-text-muted text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES SECTION ==================== */}
      <section ref={categoriesRef} className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
              Browse by Category
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
              Everything <span className="text-gradient-gold">HP</span>
            </h2>
            <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
              From powerful workstations to everyday essentials — find your perfect HP product.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, i) => {
              const icons: Record<string, any> = { Laptop, Monitor, Printer, MonitorSmartphone: Monitor, Mouse };
              const Icon = icons[cat.icon] || Printer;
              return (
                <Link 
                  key={cat.id}
                  href={`/category/${cat.id}/`}
                  className="category-card group p-8 rounded-3xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all duration-500 hover:shadow-premium-hover text-center space-y-4"
                >
                  <div className="w-16 h-16 mx-auto bg-jet-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-jet-primary group-hover:scale-110 transition-all duration-500 border border-jet-primary/20">
                    <Icon className="w-8 h-8 text-jet-primary group-hover:text-jet-bg transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-jet-text group-hover:text-jet-primary transition-colors">{cat.name}</h3>
                    <p className="text-jet-text-muted text-sm mt-1">{cat.description}</p>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-jet-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== HORIZONTAL SCROLL SECTION — ZERA STYLE ==================== */}
      <section ref={horizontalRef} className="relative bg-jet-bg-elevated overflow-hidden">
        <div className="h-screen flex flex-col justify-center">
          <div className="px-6 lg:px-8 mb-12">
            <div className="max-w-7xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20 mb-4">
                Featured Collection
              </span>
              <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
                Scroll to <span className="text-gradient-gold">Explore</span>
              </h2>
              <p className="text-jet-text-dim mt-4 text-lg">Drag or scroll to browse our handpicked selection</p>
            </div>
          </div>
          
          <div className="horizontal-scroll-container flex gap-8 px-6 lg:px-8 will-change-transform">
            {featuredProducts.map((product, i) => (
              <div key={product.id} className="flex-shrink-0 w-[400px] lg:w-[500px]">
                <ProductCard product={product} featured />
              </div>
            ))}
            
            {/* End card */}
            <div className="flex-shrink-0 w-[400px] lg:w-[500px] flex items-center justify-center">
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
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRODUCT GRID WITH FILTER ==================== */}
      <section ref={featuredRef} id="products" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="featured-header text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
              Our Collection
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
              All <span className="text-gradient-gold">Products</span>
            </h2>
            <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
              Handpicked selection with exclusive Jetage pricing. Filter by category below.
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {[
              { id: "all", label: "All" },
              { id: "laptop", label: "Laptops" },
              { id: "desktop", label: "Desktops" },
              { id: "printer", label: "Printers" },
              { id: "monitor", label: "Monitors" },
              { id: "accessory", label: "Accessories" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeCategory === cat.id 
                    ? "bg-jet-primary text-jet-bg border-jet-primary shadow-glow" 
                    : "bg-jet-bg-card text-jet-text-dim border-jet-border hover:border-jet-primary/40 hover:text-jet-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              href="/products/"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-jet-bg-card text-jet-primary border-2 border-jet-primary/30 rounded-full font-bold hover:bg-jet-primary hover:text-jet-bg transition-all duration-300"
            >
              View All Products
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== LAPTOP SHOWCASE — Special animated section ==================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-jet-bg via-jet-bg-elevated to-jet-bg" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-jet-primary/5 rounded-full blur-[200px]" />
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-jet-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium border border-purple-500/20">
                <Cpu className="w-4 h-4" />
                New Arrival
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold text-jet-text leading-tight">
                HP <span className="text-gradient-gold">OmniBook X</span>
                <span className="block text-2xl lg:text-3xl text-jet-text-dim mt-4 font-medium">AI-Powered. Ultra-Thin. Unstoppable.</span>
              </h2>

              <p className="text-jet-text-dim text-lg leading-relaxed">
                The next evolution of HP Envy. Intel Core Ultra processors with dedicated AI NPU. 
                3K OLED touchscreen. All-day battery. This is not just a laptop — it's your AI companion.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Cpu, label: "Intel Core Ultra", desc: "AI NPU Built-in" },
                  { icon: Monitor, label: "3K OLED", desc: "Touch Display" },
                  { icon: HardDrive, label: "1TB SSD", desc: "NVMe Storage" },
                  { icon: Wifi, label: "Wi-Fi 7", desc: "Next-Gen Wireless" },
                ].map((spec, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-jet-bg-card border border-jet-border hover:border-jet-primary/30 transition-all">
                    <spec.icon className="w-6 h-6 text-jet-primary mb-2" />
                    <p className="text-jet-text font-semibold text-sm">{spec.label}</p>
                    <p className="text-jet-text-muted text-xs">{spec.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20inquire%20about%20HP%20OmniBook%20X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-jet-primary text-jet-bg rounded-full font-bold hover:bg-jet-accent transition-all shadow-glow"
                >
                  <MessageCircle className="w-5 h-5" />
                  Get Quote on WhatsApp
                </a>
                <span className="inline-flex items-center gap-2 px-6 py-4 text-jet-text-dim">
                  <span className="text-2xl font-bold text-jet-text">₹136,499</span>
                  <span className="text-sm line-through">₹199,146</span>
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-jet-primary/20 via-purple-500/10 to-transparent rounded-3xl blur-3xl" />
              
              <div className="relative bg-jet-bg-card rounded-3xl border border-jet-border p-8 shadow-premium">
                <div className="aspect-[4/3] bg-gradient-to-br from-jet-bg-elevated to-jet-bg rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,76,0.1),transparent_60%)]" />
                  <Laptop className="w-48 h-48 text-jet-primary/30" strokeWidth={0.5} />
                  
                  {/* Floating spec badges */}
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
            </div>
          </div>
        </div>
      </section>

      <ShowroomSection />

      {/* ==================== WHY JETAGE ==================== */}
      <section ref={whyRef} id="about" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
              Why Jetage
            </span>
            <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
              The Jetage <span className="text-gradient-gold">Advantage</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: "Authorized HP World",
                description: "Genuine HP products with full manufacturer warranty and official support. No grey market risks."
              },
              {
                icon: Phone,
                title: "WhatsApp Ordering",
                description: "Order instantly via WhatsApp. Get quotes, place orders, and track delivery — all on your phone."
              },
              {
                icon: Zap,
                title: "Best Price Guarantee",
                description: "We match and beat competitor prices. Exclusive deals you won't find on Amazon or Flipkart."
              },
              {
                icon: Shield,
                title: "Expert Consultation",
                description: "35+ years of tech expertise. We help you choose the right product for your exact needs."
              },
              {
                icon: Truck,
                title: "All India Delivery",
                description: "Fast, insured shipping across India. Special handling for fragile components."
              },
              {
                icon: Clock,
                title: "After-Sales Support",
                description: "Dedicated support for installation, setup, and troubleshooting. We're just a message away."
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="why-card group p-8 rounded-3xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all duration-500 hover:shadow-premium"
              >
                <div className="w-14 h-14 bg-jet-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-jet-primary group-hover:scale-110 transition-all duration-500 border border-jet-primary/20">
                  <item.icon className="w-7 h-7 text-jet-primary group-hover:text-jet-bg transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-jet-text mb-3 group-hover:text-jet-primary transition-colors">{item.title}</h3>
                <p className="text-jet-text-dim leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MARQUEE BRANDS ==================== */}
      <section className="py-16 border-y border-jet-border overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center gap-16 px-8">
              {["HP World Authorized", "Genuine Products", "35+ Years Trust", "All India Delivery", "WhatsApp Support", "Best Price Guarantee", "Expert Consultation", "After-Sales Service"].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-jet-text-muted">
                  <div className="w-2 h-2 bg-jet-primary rounded-full" />
                  <span className="text-lg font-semibold tracking-wide">{text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section ref={ctaRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-jet-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-jet-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <div className="cta-content space-y-6">
            <h2 className="text-4xl lg:text-7xl font-bold text-jet-text leading-tight">
              Ready to Find Your
              <span className="block text-gradient-gold glow-text">Perfect HP?</span>
            </h2>
            <p className="text-lg text-jet-text-dim max-w-2xl mx-auto">
              Get personalized recommendations, instant quotes, and exclusive pricing via WhatsApp. 
              Our team responds within minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a 
                href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20need%20help%20choosing%20an%20HP%20product"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-jet-whatsapp text-white rounded-full font-bold hover:bg-[#128C7E] transition-all duration-300 text-lg shadow-lg"
              >
                <MessageCircle className="w-6 h-6" />
                Chat on WhatsApp
              </a>
              <a 
                href="tel:+919814958295"
                className="inline-flex items-center gap-3 px-8 py-4 bg-jet-bg-card text-jet-text border border-jet-border rounded-full font-bold hover:border-jet-primary/40 hover:text-jet-primary transition-all duration-300 text-lg"
              >
                <Phone className="w-6 h-6" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}