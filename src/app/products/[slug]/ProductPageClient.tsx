"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { 
  Check, 
  ChevronLeft, 
  MessageCircle, 
  Phone,
  Truck,
  Shield,
  Award,
  Zap,
  ArrowRight,
  Star,
  MapPin,
  Copy,
  CheckCheck,
  Eye
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data/products";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";

interface ProductPageClientProps {
  slug: string;
}

export default function ProductPageClient({ slug }: ProductPageClientProps) {
  const product = products.find(p => p.id === slug);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const heroRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      gsap.from(".product-hero-content", {
        y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2
      });
      gsap.from(".product-hero-image", {
        scale: 0.95, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.3
      });
      gsap.from(".spec-row", {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: specsRef.current, start: "top 80%" }
      });
      gsap.from(".related-card", {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".related-section", start: "top 85%" }
      });
    });
    return () => ctx.revert();
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen bg-jet-bg pt-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-jet-text mb-4">Product Not Found</h1>
          <p className="text-jet-text-dim mb-8">The product you are looking for does not exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-jet-primary text-jet-bg rounded-full font-bold hover:bg-jet-accent transition-all">
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const whatsappLink = `https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20buy%20${encodeURIComponent(product.name)}%20(SKU%3A%20${product.sku})`;

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const categoryLabelMap: Record<string, string> = {
    "laser": "Laser Printer",
    "color-laser": "Color Laser",
    "inkjet": "InkJet",
    "consumer": "Consumer",
    "premium": "Premium",
    "gaming": "Gaming",
    "professional": "Professional",
    "input": "Input Device",
  };

  const categoryLabel = categoryLabelMap[product.subCategory] || product.subCategory;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`HP ${product.name} - ₹${product.price.toLocaleString()} | SKU: ${product.sku} | Jetage India`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-jet-bg noise-bg">
      {/* Custom cursor glow */}
      <div 
        className="fixed pointer-events-none z-50 w-80 h-80 rounded-full opacity-15 blur-3xl transition-transform duration-100 ease-out hidden lg:block"
        style={{
          background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)",
          left: mousePos.x - 160,
          top: mousePos.y - 160,
        }}
      />

      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-28 pb-4 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-jet-text-muted">
            <Link href="/" className="hover:text-jet-primary transition-colors">Home</Link>
            <ArrowRight className="w-3 h-3" />
            <Link href="/#products" className="hover:text-jet-primary transition-colors">Products</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-jet-text font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* ==================== PRODUCT HERO ==================== */}
      <section ref={heroRef} className="py-12 lg:py-20 bg-jet-bg-elevated">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="product-hero-image relative">
              <div className="aspect-square bg-gradient-to-br from-jet-bg-card to-jet-bg rounded-3xl border border-jet-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,76,0.08),transparent_60%)]" />
                
                {!imageError ? (
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-contain max-h-[350px] w-auto z-10"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-jet-primary/10 flex items-center justify-center z-10">
                    <span className="text-5xl font-bold text-jet-primary">{product.shortName.charAt(0)}</span>
                  </div>
                )}

                {product.badge && (
                  <div className="absolute top-6 left-6 px-4 py-2 bg-jet-primary text-jet-bg font-bold rounded-full z-10">
                    {product.badge}
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-6 right-6 px-4 py-2 bg-red-500/20 text-red-400 font-bold rounded-full z-10 border border-red-500/30">
                    {discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-3 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 aspect-video bg-jet-bg-card rounded-xl border border-jet-border flex items-center justify-center hover:border-jet-primary/40 transition-all cursor-pointer">
                    <Eye className="w-5 h-5 text-jet-text-muted" />
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="product-hero-content space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="inline-block px-3 py-1 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                    {categoryLabel}
                  </span>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1 bg-jet-bg-card text-jet-text-muted text-sm rounded-full border border-jet-border hover:border-jet-primary/40 transition-all"
                  >
                    {copied ? <CheckCheck className="w-3.5 h-3.5 text-jet-success" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Share"}
                  </button>
                </div>
                
                <h1 className="text-3xl lg:text-5xl font-bold text-jet-text leading-tight">
                  {product.name}
                </h1>
                <p className="text-jet-text-dim mt-4 leading-relaxed text-lg">{product.description}</p>
              </div>

              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-4xl lg:text-5xl font-bold text-jet-text">₹{product.price.toLocaleString()}</span>
                <span className="text-xl text-jet-text-muted line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="px-3 py-1 bg-jet-success/10 text-jet-success text-sm font-bold rounded-full border border-jet-success/20">
                  Save ₹{(product.mrp - product.price).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-2 bg-jet-bg-card text-jet-text-dim text-sm rounded-xl font-medium border border-jet-border">
                    <Check className="w-4 h-4 text-jet-success" />
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-jet-whatsapp text-white rounded-xl font-bold text-lg hover:bg-[#128C7E] transition-all hover:scale-[1.02] shadow-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  Order on WhatsApp
                </a>
                <a
                  href="tel:+919814958295"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-jet-bg-card text-jet-text border border-jet-border rounded-xl font-bold text-lg hover:border-jet-primary/40 hover:text-jet-primary transition-all"
                >
                  <Phone className="w-6 h-6" />
                  Call to Order
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Shield, label: "HP Warranty", desc: "Genuine product" },
                  { icon: Truck, label: "Fast Delivery", desc: "All India shipping" },
                  { icon: Award, label: "Since 1989", desc: "35+ years trust" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 bg-jet-bg-card rounded-xl border border-jet-border hover:border-jet-border-strong transition-all">
                    <item.icon className="w-6 h-6 text-jet-primary mx-auto mb-2" />
                    <p className="text-sm font-bold text-jet-text">{item.label}</p>
                    <p className="text-xs text-jet-text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SPECS & DETAILS TABS ==================== */}
      <section ref={specsRef} className="py-16 bg-jet-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {[
              { id: "specs", label: "Specifications" },
              { id: "features", label: "Key Features" },
              { id: "shipping", label: "Shipping & Returns" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all border ${
                  activeTab === tab.id
                    ? "bg-jet-primary text-jet-bg border-jet-primary"
                    : "bg-jet-bg-card text-jet-text-dim border-jet-border hover:border-jet-primary/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "specs" && (
            <div className="bg-jet-bg-card rounded-3xl border border-jet-border overflow-hidden">
              {product.specs && Object.entries(product.specs).map(([key, value], i) => (
                <div 
                  key={i} 
                  className={`spec-row flex items-center gap-4 p-6 ${i !== Object.entries(product.specs!).length - 1 ? 'border-b border-jet-border' : ''}`}
                >
                  <div className="w-12 h-12 bg-jet-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-jet-primary/20">
                    <Zap className="w-6 h-6 text-jet-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-jet-text-muted">{key}</p>
                    <p className="text-lg font-bold text-jet-text">{value}</p>
                  </div>
                </div>
              ))}
              {!product.specs && (
                <div className="p-8 text-center text-jet-text-muted">
                  Specifications coming soon. Contact us on WhatsApp for details.
                </div>
              )}
            </div>
          )}

          {activeTab === "features" && (
            <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-jet-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-jet-primary/20">
                      <Check className="w-4 h-4 text-jet-primary" />
                    </div>
                    <p className="text-jet-text font-medium">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8 space-y-6">
              <div className="flex items-start gap-4">
                <Truck className="w-6 h-6 text-jet-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-jet-text font-bold mb-1">All India Delivery</h4>
                  <p className="text-jet-text-dim">We ship to all major cities across India. Delivery typically takes 3-7 business days depending on your location.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-jet-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-jet-text font-bold mb-1">HP Warranty</h4>
                  <p className="text-jet-text-dim">All products come with genuine HP manufacturer warranty. We assist with warranty claims and service center coordination.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle className="w-6 h-6 text-jet-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-jet-text font-bold mb-1">WhatsApp Support</h4>
                  <p className="text-jet-text-dim">Get instant support for installation, driver setup, and troubleshooting via WhatsApp. We typically respond within minutes.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== RELATED PRODUCTS ==================== */}
      {relatedProducts.length > 0 && (
        <section className="related-section py-16 bg-jet-bg-elevated">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-jet-text mb-8">You May Also Like</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <div key={p.id} className="related-card">
                  <ProductCard product={p} compact />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== SHOWROOM CTA ==================== */}
      <section className="py-16 bg-jet-bg">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-jet-text">Visit Our Showroom</h2>
          <p className="text-jet-text-dim">
            See this product in person at our SCO-12, Sector-17-E showroom in Chandigarh. 
            Our experts will help you choose the perfect product for your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://maps.google.com/?q=SCO-12+Sector-17-E+Chandigarh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-jet-primary text-jet-bg rounded-full font-bold hover:bg-jet-accent transition-all shadow-glow"
            >
              <MapPin className="w-5 h-5" />
              Get Directions
            </a>
            <a 
              href="tel:+919814958295"
              className="inline-flex items-center gap-2 px-6 py-3 bg-jet-bg-card text-jet-text border border-jet-border rounded-full font-bold hover:border-jet-primary/40 transition-all"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}