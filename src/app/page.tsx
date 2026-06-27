"use client";

import { useEffect, useRef } from "react";
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
  MapPin
} from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/data/products";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 60, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.2,
      });
      gsap.from(".hero-subtitle", {
        y: 40, opacity: 0, duration: 1, ease: "power3.out", delay: 0.5,
      });
      gsap.from(".hero-cta", {
        y: 30, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.8,
      });
      gsap.from(".hero-image", {
        scale: 0.9, opacity: 0, duration: 1.4, ease: "power4.out", delay: 0.4,
      });
      gsap.from(".stat-item", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
      });
      gsap.from(".products-header", {
        y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: productsRef.current, start: "top 80%" },
      });
      gsap.from(".why-card", {
        y: 60, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: whyRef.current, start: "top 75%" },
      });
      gsap.from(".cta-content", {
        y: 50, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ctaRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  const featuredProducts = products.slice(0, 6);
  const laserProducts = products.filter(p => p.category === "laser").slice(0, 4);
  const colorProducts = products.filter(p => p.category === "color-laser").slice(0, 3);

  return (
    <main className="min-h-screen bg-jet-cream">
      <Navbar />
      
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-jet-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-jet-primary/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-jet-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jet-primary/10 text-jet-primary text-sm font-medium">
                <Award className="w-4 h-4" />
                Trusted Since 1989
              </div>
              <h1 className="hero-title text-5xl lg:text-7xl font-bold text-jet-navy leading-tight">
                Premium HP
                <span className="block text-gradient">Printers</span>
                Delivered
              </h1>
              <p className="hero-subtitle text-lg lg:text-xl text-jet-gray max-w-lg leading-relaxed">
                Authorized HP dealer with 35+ years of expertise. From home offices to enterprises, 
                find the perfect printer with best prices and instant WhatsApp support.
              </p>
              <div className="hero-cta flex flex-wrap gap-4">
                <Link href="#products" className="inline-flex items-center gap-2 px-8 py-4 bg-jet-primary text-white rounded-full font-semibold hover:bg-jet-primary-dark transition-all duration-300 shadow-premium hover:shadow-premium-hover">
                  Explore Printers
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <a href="https://wa.me/919814958295?text=Hi%20Jet%20Age%2C%20I%20want%20to%20inquire%20about%20HP%20printers" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-jet-whatsapp text-white rounded-full font-semibold hover:bg-[#128C7E] transition-all duration-300">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Order
                </a>
              </div>
              <div className="hero-cta flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-jet-gray">
                  <Shield className="w-5 h-5 text-jet-success" />
                  <span>Authorized Dealer</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-jet-gray">
                  <Truck className="w-5 h-5 text-jet-primary" />
                  <span>All India Delivery</span>
                </div>
              </div>
            </div>

            <div className="hero-image relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-jet-primary/20 to-transparent rounded-3xl blur-2xl" />
                <div className="relative bg-white rounded-3xl shadow-premium p-8 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                  <div className="aspect-[4/3] bg-gradient-to-br from-jet-light to-white rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,150,214,0.1),transparent_50%)]" />
                    <Printer className="w-32 h-32 text-jet-primary/80" strokeWidth={1} />
                    <div className="absolute top-4 right-4 bg-jet-success/10 text-jet-success px-3 py-1 rounded-full text-xs font-semibold">In Stock</div>
                    <div className="absolute bottom-4 left-4 bg-jet-primary/10 text-jet-primary px-3 py-1 rounded-full text-xs font-semibold">Best Price</div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="h-3 bg-jet-border rounded-full w-3/4" />
                    <div className="h-3 bg-jet-border rounded-full w-1/2" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 w-20 bg-jet-primary rounded-lg" />
                      <div className="h-8 w-8 bg-jet-border rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-premium p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-jet-whatsapp/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-jet-whatsapp" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-jet-navy">WhatsApp Order</p>
                      <p className="text-xs text-jet-gray">Instant Response</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-premium p-4 animate-float" style={{ animationDelay: "1s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-jet-primary/10 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-jet-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-jet-navy">4.9/5 Rating</p>
                      <p className="text-xs text-jet-gray">500+ Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-jet-gray">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-jet-border rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-jet-primary rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, value: "35+", label: "Years Experience", suffix: "yrs" },
              { icon: Printer, value: "10,000+", label: "Printers Sold", suffix: "" },
              { icon: MapPin, value: "25+", label: "Cities Served", suffix: "" },
              { icon: Star, value: "4.9", label: "Customer Rating", suffix: "/5" },
            ].map((stat, i) => (
              <div key={i} className="stat-item text-center space-y-3">
                <div className="w-14 h-14 mx-auto bg-jet-primary/10 rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-jet-primary" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-jet-navy">
                  {stat.value}<span className="text-jet-primary">{stat.suffix}</span>
                </div>
                <p className="text-jet-gray text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={productsRef} id="products" className="py-24 bg-jet-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="products-header text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full">
              Our Collection
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-jet-navy">
              Featured <span className="text-gradient">HP Printers</span>
            </h2>
            <p className="text-jet-gray max-w-2xl mx-auto text-lg">
              Handpicked selection of HP's best-selling laser, color laser, and inkjet printers 
              with exclusive Jet Age pricing.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {["All", "Laser", "Color Laser", "InkJet"].map((cat, i) => (
              <button key={cat} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${i === 0 ? "bg-jet-primary text-white shadow-premium" : "bg-white text-jet-slate hover:bg-jet-primary/10 hover:text-jet-primary"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-jet-primary border-2 border-jet-primary rounded-full font-semibold hover:bg-jet-primary hover:text-white transition-all duration-300">
              View All Products
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-jet-navy/10 text-jet-navy text-sm font-semibold rounded-full">
                Monochrome
              </span>
              <h2 className="text-4xl font-bold text-jet-navy">Laser Printers</h2>
              <p className="text-jet-gray max-w-lg">
                Crisp black & white printing for documents, reports, and everyday business needs.
              </p>
            </div>
            <Link href="/category/laser" className="inline-flex items-center gap-2 text-jet-primary font-semibold hover:gap-3 transition-all">
              View All Laser <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {laserProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-jet-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-jet-accent/10 text-jet-accent text-sm font-semibold rounded-full">
                Vibrant Color
              </span>
              <h2 className="text-4xl font-bold text-jet-navy">Color Laser Printers</h2>
              <p className="text-jet-gray max-w-lg">
                Professional color output for marketing materials, presentations, and creative work.
              </p>
            </div>
            <Link href="/category/color-laser" className="inline-flex items-center gap-2 text-jet-accent font-semibold hover:gap-3 transition-all">
              View All Color <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colorProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
      </section>

      <section ref={whyRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full">
              Why Jet Age
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-jet-navy">
              The Jet Age <span className="text-gradient">Advantage</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Award, title: "Authorized HP Dealer", description: "Genuine HP products with full manufacturer warranty and official support. No grey market risks." },
              { icon: Phone, title: "WhatsApp Ordering", description: "Order instantly via WhatsApp. Get quotes, place orders, and track delivery — all on your phone." },
              { icon: Zap, title: "Best Price Guarantee", description: "We match and beat competitor prices. Exclusive deals you won't find on Amazon or Flipkart." },
              { icon: Shield, title: "Expert Consultation", description: "35+ years of printer expertise. We help you choose the right printer for your exact needs." },
              { icon: Truck, title: "All India Delivery", description: "Fast, insured shipping across India. Special handling for fragile printer components." },
              { icon: Clock, title: "After-Sales Support", description: "Dedicated support for installation, driver setup, and troubleshooting. We're just a message away." }
            ].map((item, i) => (
              <div key={i} className="why-card group p-8 rounded-3xl bg-jet-cream hover:bg-white border border-transparent hover:border-jet-primary/20 transition-all duration-500 hover:shadow-premium">
                <div className="w-14 h-14 bg-jet-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-jet-primary group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-jet-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-jet-navy mb-3">{item.title}</h3>
                <p className="text-jet-gray leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="py-24 bg-jet-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-jet-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-jet-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <div className="cta-content space-y-6">
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Ready to Find Your
              <span className="block text-jet-primary">Perfect Printer?</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get personalized recommendations, instant quotes, and exclusive pricing via WhatsApp. 
              Our team responds within minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="https://wa.me/919814958295?text=Hi%20Jet%20Age%2C%20I%20need%20help%20choosing%20an%20HP%20printer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-jet-whatsapp text-white rounded-full font-semibold hover:bg-[#128C7E] transition-all duration-300 text-lg">
                <MessageCircle className="w-6 h-6" />
                Chat on WhatsApp
              </a>
              <a href="tel:+919814958295" className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 text-lg">
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