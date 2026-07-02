import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { ShowroomMap } from "@/components/ShowroomMap";
import {
  Award, Clock, MapPin, Phone, MessageCircle, Shield,
  Truck, Zap, Users, Star, TrendingUp, Globe, Check
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />

      {/* Hero */}
      <div className="pt-28 pb-16 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center space-y-4">
              <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                Since 1989
              </span>
              <h1 className="text-4xl lg:text-7xl font-bold text-jet-text">
                The Jetage <span className="text-gradient-gold">Story</span>
              </h1>
              <p className="text-jet-text-dim max-w-3xl mx-auto text-xl leading-relaxed">
                For over three decades, Jetage Computer Traders has been Chandigarh's most trusted destination
                for HP products. From a small shop in Sector 17 to an Authorized HP World Partner serving all of India.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Stats */}
      <section className="py-16 bg-jet-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-6" direction="up" stagger={0.15}>
            {[
              { icon: Clock, value: 35, suffix: "+", label: "Years of Trust" },
              { icon: TrendingUp, value: 10000, suffix: "+", label: "Products Sold" },
              { icon: Globe, value: 25, suffix: "+", label: "Cities Served" },
              { icon: Star, value: 4.5, suffix: "", label: "Customer Rating", decimals: 1 },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-3 p-6 rounded-2xl bg-jet-bg-card border border-jet-border">
                <stat.icon className="w-8 h-8 text-jet-primary mx-auto" />
                <div className="text-4xl font-bold text-jet-text">
                  <Counter end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                </div>
                <p className="text-jet-text-muted text-sm">{stat.label}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-jet-bg-elevated">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal direction="left">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-5xl font-bold text-jet-text">
                  From Sector 17 to <span className="text-gradient-gold">All of India</span>
                </h2>
                <div className="space-y-4 text-jet-text-dim leading-relaxed">
                  <p>
                    Founded in 1989 by visionary entrepreneurs, Jetage Computer Traders started as a modest
                    computer shop in the heart of Chandigarh's iconic Sector 17 market. Above the historic
                    Indian Coffee House, we began our journey with a simple mission: provide genuine technology
                    products with honest pricing and exceptional service.
                  </p>
                  <p>
                    As HP's presence grew in India, so did our partnership. Today, we are proud to be an
                    <strong className="text-jet-text"> Authorized HP World Partner</strong>, offering the complete
                    range of HP products from entry-level printers to high-performance workstations.
                  </p>
                  <p>
                    Our showroom at SCO-12, 1st Floor, Sector-17-E remains our flagship location, but our
                    reach now extends across India through our WhatsApp ordering system and All India Delivery network.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-jet-primary/10 to-transparent rounded-3xl blur-2xl" />
                <div className="relative bg-jet-bg-card rounded-3xl border border-jet-border p-8 shadow-premium">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-jet-primary/10 rounded-2xl flex items-center justify-center border border-jet-primary/20">
                        <MapPin className="w-7 h-7 text-jet-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-jet-text">Flagship Showroom</p>
                        <p className="text-sm text-jet-text-muted">SCO-12, 1st Floor, Sector-17-E, Chandigarh</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-jet-primary/10 rounded-2xl flex items-center justify-center border border-jet-primary/20">
                        <Award className="w-7 h-7 text-jet-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-jet-text">Authorized HP World Partner</p>
                        <p className="text-sm text-jet-text-muted">Genuine products with full warranty</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-jet-primary/10 rounded-2xl flex items-center justify-center border border-jet-primary/20">
                        <Phone className="w-7 h-7 text-jet-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-jet-text">+91 98149 58295</p>
                        <p className="text-sm text-jet-text-muted">Mon-Sat: 10AM - 8PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-jet-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up" className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-jet-text">
              Our <span className="text-gradient-gold">Values</span>
            </h2>
          </Reveal>
          <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" direction="up" stagger={0.1}>
            {[
              { icon: Shield, title: "Genuine Products Only", desc: "We never sell grey market or refurbished items as new. Every product comes with authentic HP warranty." },
              { icon: Zap, title: "Best Price Guarantee", desc: "We match and beat competitor prices. Our direct HP partnership allows us to offer exclusive deals." },
              { icon: Users, title: "Expert Guidance", desc: "Our team has 35+ years of combined experience. We help you choose the right product, not the most expensive one." },
              { icon: Truck, title: "All India Delivery", desc: "Fast, insured shipping to every corner of India. Special handling for fragile components." },
              { icon: MessageCircle, title: "WhatsApp Support", desc: "Get instant quotes, place orders, and track delivery — all through WhatsApp. No app downloads needed." },
              { icon: Clock, title: "After-Sales Care", desc: "We don't disappear after the sale. Installation help, troubleshooting, and warranty assistance included." },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all hover:shadow-premium">
                <div className="w-12 h-12 bg-jet-primary/10 rounded-xl flex items-center justify-center mb-4 border border-jet-primary/20">
                  <item.icon className="w-6 h-6 text-jet-primary" />
                </div>
                <h3 className="text-lg font-bold text-jet-text mb-2">{item.title}</h3>
                <p className="text-jet-text-dim text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-jet-bg-elevated">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal direction="left">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-5xl font-bold text-jet-text">
                  Why Customers <span className="text-gradient-gold">Choose Us</span>
                </h2>
                <div className="space-y-4">
                  {[
                    "Authorized HP World Partner with direct manufacturer support",
                    "Instant WhatsApp ordering — no website registration needed",
                    "Price matching against Amazon, Flipkart, and local dealers",
                    "Free consultation to find the perfect product for your needs",
                    "All India delivery with insurance and tracking",
                    "Dedicated after-sales support for installation and troubleshooting",
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-jet-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-jet-success/20">
                        <Check className="w-3.5 h-3.5 text-jet-success" />
                      </div>
                      <p className="text-jet-text-dim">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8 shadow-premium">
                <h3 className="text-2xl font-bold text-jet-text mb-6">Visit Our Showroom</h3>
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-jet-bg-elevated to-jet-bg rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <MapPin className="w-12 h-12 text-jet-primary mx-auto" />
                      <p className="font-bold text-jet-text">SCO-12, Sector-17-E</p>
                      <p className="text-sm text-jet-text-muted">Chandigarh - 160017</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="https://maps.google.com/?q=SCO-12+Sector-17-E+Chandigarh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-jet-primary text-white rounded-xl font-bold hover:bg-jet-primary-dim transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      Directions
                    </a>
                    <a
                      href="https://wa.me/919814958295"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-jet-whatsapp text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* === EMBEDDED MAP SECTION === */}
      <ShowroomMap variant="about" />

      <Footer />
      <WhatsAppButton />
    </main>
  );
}