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

// NEW 3D COMPONENTS
import { Hero3D } from "@/components/Hero3D";
import { Stats3D } from "@/components/Stats3D";
import { CategoryGrid3D } from "@/components/CategoryGrid3D";
import { Marquee3D } from "@/components/Marquee3D";
import { ProcessSteps3D } from "@/components/ProcessSteps3D";
import { ProductShowcase3D } from "@/components/ProductShowcase3D";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CinematicLoader } from "@/components/CinematicLoader";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const featuredProducts = getFeaturedProducts().slice(0, 6);

  const filteredProducts = activeCategory === "all" 
    ? products.slice(0, 8) 
    : products.filter(p => p.category === activeCategory).slice(0, 8);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

  return (
    <main className="min-h-screen bg-jet-bg noise-bg relative">
      <CinematicLoader />
      <ParticleBackground />
      <Navbar />

      {/* ==================== 3D HERO SECTION ==================== */}
      <Hero3D />

      {/* ==================== 3D STATS SECTION ==================== */}
      <Stats3D />

      {/* ==================== 3D CATEGORIES SECTION ==================== */}
      <CategoryGrid3D />

      {/* ==================== DECISION TOOLS ==================== */}
      <section className="py-16 px-6 lg:px-8 bg-jet-bg">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/finder/"
                className="group relative overflow-hidden p-8 bg-jet-bg-card rounded-2xl border border-jet-border hover:border-jet-primary/40 hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1"
              >
                <Sparkles className="w-8 h-8 text-jet-primary mb-4" />
                <h3 className="text-xl font-bold text-jet-text mb-2 group-hover:text-jet-primary transition-colors">
                  Not sure which printer? Answer 5 questions.
                </h3>
                <p className="text-sm text-jet-text-dim mb-4 max-w-md">
                  The Printer Finder matches your usage, volume and budget to the right
                  machine — with honest reasons why.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-jet-primary">
                  Find my printer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                href="/cost-calculator/"
                className="group relative overflow-hidden p-8 bg-jet-bg-card rounded-2xl border border-jet-border hover:border-jet-primary/40 hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1"
              >
                <TrendingUp className="w-8 h-8 text-jet-primary mb-4" />
                <h3 className="text-xl font-bold text-jet-text mb-2 group-hover:text-jet-primary transition-colors">
                  The sticker price is half the story.
                </h3>
                <p className="text-sm text-jet-text-dim mb-4 max-w-md">
                  Ink decides what a printer really costs. Compare the true 3-year cost of
                  Smart Tank vs InkJet vs Laser for your usage.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-jet-primary">
                  Calculate my real cost
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== HORIZONTAL SCROLL SECTION ==================== */}
      <section ref={horizontalRef} className="relative bg-jet-bg-elevated overflow-hidden">
        <div className="h-screen flex flex-col pt-32 pb-8">
          <div className="px-6 lg:px-8 mb-8 mt-auto">
            <div className="max-w-7xl mx-auto">
              <Reveal direction="left">
                <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20 mb-4">
                  Featured Collection
                </span>
              </Reveal>
              <Reveal direction="left" delay={0.1}>
                <h2 className="text-3xl lg:text-5xl font-bold text-jet-text">
                  Scroll to <span className="text-gradient-gold">Explore</span>
                </h2>
              </Reveal>
              <Reveal direction="left" delay={0.2}>
                <p className="text-jet-text-dim mt-3">Drag or scroll to browse our handpicked selection</p>
              </Reveal>
            </div>
          </div>
          
          <div className="horizontal-scroll-container flex gap-6 px-6 lg:px-8 will-change-transform mb-auto">
            {featuredProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[70vw] sm:w-[300px] xl:w-[280px] 2xl:w-[320px]">
                <ProductCard product={product} />              </div>
            ))}

            <div className="flex-shrink-0 w-[70vw] sm:w-[300px] xl:w-[280px] 2xl:w-[320px] flex items-center justify-center">
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

      {/* ==================== 3D PRODUCT SHOWCASE ==================== */}
      <ProductShowcase3D />

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
              { id: "printer", label: "Printers" },
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
                <ProductCard product={product} />              </Reveal>
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

      {/* ==================== 3D PROCESS STEPS ==================== */}
      <ProcessSteps3D />

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
              { icon: Shield, title: "Expert Consultation", description: "37+ years of tech expertise. We help you choose the right product for your exact needs." },
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

      {/* ==================== TESTIMONIALS ==================== */}
      <TestimonialsSection />

      {/* ==================== 3D MARQUEE ==================== */}
      <Marquee3D />

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-jet-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-jet-primary/5 rounded-full blur-[120px]" />
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
                  className="btn-sheen inline-flex items-center gap-3 px-8 py-4 bg-jet-whatsapp text-white rounded-full font-bold hover:bg-[#128C7E] transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:shadow-jet-whatsapp/20"
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
