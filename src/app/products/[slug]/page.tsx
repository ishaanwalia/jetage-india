"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Printer, Wifi, Usb, EthernetPort, Check, X, ChevronLeft, MessageCircle, Phone, Truck, Shield, Award, Zap, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { products } from "@/lib/data/products";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";

export default function ProductPage() {
  const params = useParams();
  const productId = params.slug as string;
  const product = products.find(p => p.id === productId);

  const heroRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      gsap.from(".product-hero-content", {
        y: 40, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2
      });
      gsap.from(".product-hero-image", {
        scale: 0.95, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.3
      });
      gsap.from(".spec-row", {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: specsRef.current, start: "top 80%" }
      });
    });
    return () => ctx.revert();
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen bg-jet-cream pt-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-jet-navy mb-4">Product Not Found</h1>
          <p className="text-jet-gray mb-8">The printer you're looking for doesn't exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-jet-primary text-white rounded-full font-semibold">
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

  const specs = [
    { label: "Print Speed", value: product.speed, icon: Zap },
    { label: "Connectivity", value: product.connectivity.join(", "), icon: Wifi },
    { label: "Auto Duplex", value: product.duplex ? "Yes" : "No", icon: product.duplex ? Check : X },
    { label: "Duty Cycle", value: product.dutyCycle, icon: Award },
    { label: "Ideal For", value: product.idealFor, icon: Shield },
    { label: "SKU", value: product.sku, icon: Printer },
  ];

  const categoryLabel = product.category === "color-laser" ? "Color Laser" : product.category === "laser" ? "Laser" : "InkJet";

  return (
    <main className="min-h-screen bg-jet-cream">
      <Navbar />

      <div className="pt-28 pb-4 bg-white border-b border-jet-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-jet-gray">
            <Link href="/" className="hover:text-jet-primary transition-colors">Home</Link>
            <ArrowRight className="w-3 h-3" />
            <Link href="/#products" className="hover:text-jet-primary transition-colors">Products</Link>
            <ArrowRight className="w-3 h-3" />
            <span className="text-jet-navy font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <section ref={heroRef} className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="product-hero-image relative">
              <div className="aspect-square bg-gradient-to-br from-jet-light to-white rounded-3xl border border-jet-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,150,214,0.08),transparent_60%)]" />
                <Printer className="w-40 h-40 text-jet-primary/15" strokeWidth={0.5} />

                {product.badge && (
                  <div className="absolute top-6 left-6 px-4 py-2 bg-jet-primary text-white font-semibold rounded-full">
                    {product.badge}
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-6 right-6 px-4 py-2 bg-jet-accent text-white font-semibold rounded-full">
                    {discount}% OFF
                  </div>
                )}
              </div>
            </div>

            <div className="product-hero-content space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full mb-4">
                  {categoryLabel}
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-jet-navy leading-tight">
                  {product.name}
                </h1>
                <p className="text-jet-gray mt-3 leading-relaxed">{product.description}</p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-jet-navy">₹{product.price.toLocaleString()}</span>
                <span className="text-xl text-jet-gray line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="px-3 py-1 bg-jet-success/10 text-jet-success text-sm font-semibold rounded-full">
                  Save ₹{(product.mrp - product.price).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-2 bg-jet-cream text-jet-slate text-sm rounded-xl font-medium">
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
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-jet-whatsapp text-white rounded-xl font-semibold text-lg hover:bg-[#128C7E] transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-6 h-6" />
                  Order on WhatsApp
                </a>
                <a
                  href="tel:+919814958295"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-jet-navy text-white rounded-xl font-semibold text-lg hover:bg-jet-slate transition-all"
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
                  <div key={i} className="text-center p-4 bg-jet-cream rounded-xl border border-jet-border">
                    <item.icon className="w-6 h-6 text-jet-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-jet-navy">{item.label}</p>
                    <p className="text-xs text-jet-gray">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={specsRef} className="py-16 bg-jet-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-jet-navy mb-8">Technical Specifications</h2>

          <div className="bg-white rounded-3xl border border-jet-border overflow-hidden">
            {specs.map((spec, i) => (
              <div 
                key={i} 
                className={`spec-row flex items-center gap-4 p-6 ${i !== specs.length - 1 ? 'border-b border-jet-border' : ''}`}
              >
                <div className="w-12 h-12 bg-jet-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <spec.icon className="w-6 h-6 text-jet-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-jet-gray">{spec.label}</p>
                  <p className="text-lg font-semibold text-jet-navy">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-jet-navy mb-8">You May Also Like</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-jet-navy">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Visit Our Showroom</h2>
          <p className="text-gray-300">
            See this printer in person at our SCO-12, Sector-17-E showroom in Chandigarh. 
            Our experts will help you choose the perfect printer for your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://maps.google.com/?q=SCO-12+Sector-17-E+Chandigarh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-jet-primary text-white rounded-full font-semibold hover:bg-jet-primary-dark transition-all"
            >
              <MapPin className="w-5 h-5" />
              Get Directions
            </a>
            <a 
              href="tel:+919814958295"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all"
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