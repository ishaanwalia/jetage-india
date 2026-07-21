import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { CinematicImage } from "@/components/CinematicImage";
import { CinematicMap } from "@/components/CinematicMap";
import { TiltCard } from "@/components/TiltCard";
import {
  Award, Clock, MapPin, Phone, MessageCircle, Shield,
  Truck, Zap, Users, Star, TrendingUp, Globe, Check, Quote
} from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Jetage India",
  description: "Founded in 1989, Jetage Computer Traders is Chandigarh's most trusted HP dealer. Learn about our journey from Sector 17 to becoming an Authorized HP World Partner serving all of India.",
  keywords: "Jetage India history, HP dealer Chandigarh, Authorized HP World Partner, Jetage Computer Traders, Sector 17 Chandigarh, HP dealer since 1989",
  alternates: {
    canonical: "https://www.jetageindia.in/about",
  },
  openGraph: {
    title: "About Jetage India | Authorized HP Dealer Since 1989",
    description: "Discover the story of Jetage Computer Traders — Chandigarh's trusted HP dealer since 1989. From Sector 17 to All India delivery.",
    url: "https://www.jetageindia.in/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />

      {/* Hero — cinematic showroom backdrop */}
      <div className="relative pt-36 pb-24 overflow-hidden border-b border-jet-border noise-bg">
        <div className="absolute inset-0">
          <img
            src="/showroom/showroom3.jpeg"
            alt=""
            className="w-full h-full object-cover img-grade animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-jet-navy/85 via-jet-navy/75 to-jet-navy/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,145,178,0.20),transparent_65%)]" />
          <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(2,6,23,0.75)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center space-y-4">
              <span className="inline-block px-4 py-1.5 bg-white/10 text-jet-accent text-sm font-semibold rounded-full border border-jet-accent/30 backdrop-blur-sm">
                Since 1989
              </span>
              <h1 className="text-4xl lg:text-7xl font-bold text-white glow-text">
                The Jetage <span className="text-gradient-gold">Story</span>
              </h1>
              <p className="text-slate-300 max-w-3xl mx-auto text-xl leading-relaxed">
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
              { icon: Clock, value: 37, suffix: "+", label: "Years of Trust" },
              { icon: TrendingUp, value: 50000, suffix: "+", label: "Products Sold" },
              { icon: Globe, value: 50, suffix: "+", label: "Cities Served" },
              { icon: Star, value: 4.5, suffix: "", label: "Customer Rating", decimals: 1 },
            ].map((stat, i) => (
              <div key={i} className="h-full flex flex-col items-center justify-center text-center space-y-3 p-4 sm:p-6 rounded-2xl bg-jet-bg-card border border-jet-border">
                <stat.icon className="w-8 h-8 text-jet-primary mx-auto" />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-jet-text break-words">
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
                        <p className="text-sm text-jet-text-muted">Mon-Sat: 10AM - 7PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="py-16 bg-jet-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up" className="text-center mb-12">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                Founder's Message
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold text-jet-text">
                A Message from Our <span className="text-gradient-gold">Founder</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <TiltCard tiltAmount={6} className="rounded-3xl lg:flex-1 lg:min-h-0">
                <CinematicImage
                  src="/showroom/founder1.jpeg"
                  alt="Sanjeev Walia, Founder and Owner of Jetage Computer Traders, at the HP World showroom in Sector 17 Chandigarh"
                  className="aspect-[3/4] lg:aspect-auto lg:h-full"
                  imgClassName="object-top"
                  caption="Sanjeev Walia"
                  subcaption="Founder & Owner · Since 1989"
                />
              </TiltCard>
              <TiltCard tiltAmount={6} className="rounded-3xl">
                <CinematicImage
                  src="/showroom/founder2.jpeg"
                  alt="Sanjeev Walia inside the Jetage HP World showroom, Chandigarh"
                  className="aspect-[4/3]"
                  imgClassName="object-top"
                  caption="At the Sector 17 showroom"
                  subcaption="HP World – Authorized Partner"
                  delay={0.15}
                />
              </TiltCard>
            </div>

            <Reveal direction="up" className="lg:col-span-3">
              <div className="relative bg-jet-bg-card rounded-3xl border border-jet-border p-8 lg:p-10 shadow-premium card-glow">
                <Quote className="w-10 h-10 text-jet-primary/25 mb-4" />
                <div className="space-y-4 text-jet-text-dim leading-relaxed">
                  <p className="font-semibold text-jet-text">Dear Valued Customers, Partners & Friends,</p>
                  <p>
                    It is with immense pride and gratitude that I welcome you to Jetage India.
                  </p>
                  <p>
                    Since establishing Jetage Computer Traders in 1989, our journey has been defined by one
                    simple promise — to deliver trustworthy technology solutions with honesty, expertise, and
                    genuine care. What began as a small showroom in Chandigarh has now grown into a trusted
                    name across the nation, thanks to the confidence you have placed in us for over three and
                    a half decades.
                  </p>
                  <p>
                    At Jetage, we don't just sell computers and printers — we help individuals, businesses,
                    and institutions make the right technology choices for their needs. Whether it's a
                    student's first laptop, a professional's powerful workstation, or a business's complete
                    IT setup, our mission has always been to provide quality products, honest advice, and
                    lifelong support.
                  </p>
                  <p>
                    As we step into a new era of technology with AI-powered devices, high-performance laptops,
                    and advanced printing solutions, our commitment remains unchanged: to be your reliable
                    technology partner for generations to come.
                  </p>
                  <p>
                    Thank you for being part of our journey. We look forward to serving you with the same
                    passion, integrity, and dedication for many more years.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-jet-border">
                  <p className="text-jet-text-dim text-sm">Warm regards,</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gradient-gold italic mt-1">Sanjeev Walia</p>
                  <p className="text-jet-text font-semibold mt-1">Founder & Owner</p>
                  <p className="text-jet-text-muted text-sm">Jetage Computer Traders (Since 1989)</p>
                  <span className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-jet-primary/10 text-jet-primary text-xs font-semibold rounded-full border border-jet-primary/20">
                    <Award className="w-3.5 h-3.5" />
                    HP World – Authorized Partner
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-jet-bg-elevated">
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
              { icon: Users, title: "Expert Guidance", desc: "Our team has 37+ years of combined experience. We help you choose the right product, not the most expensive one." },
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

      {/* Why Choose Us + Map */}
      <section className="py-16 bg-jet-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
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

            {/* === EMBEDDED MAP (same as homepage) === */}
            <Reveal direction="right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-jet-primary/10 to-transparent rounded-3xl blur-2xl" />
                <div className="relative bg-jet-bg-card rounded-3xl shadow-premium border border-jet-border overflow-hidden">
                  <CinematicMap className="aspect-[4/3]" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-jet-text">Jetage Computer Traders</p>
                        <p className="text-sm text-jet-text-muted">Authorized HP World Partner</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-jet-primary fill-jet-primary" />
                        <span className="text-sm font-bold text-jet-text">4.5</span>
                        <span className="text-xs text-jet-text-muted">(232 reviews)</span>
                      </div>
                    </div>
                    <a
                      href="https://www.google.com/maps/dir/HP+World+-+Sector+17E,+1st+Floor,+SCO+12,+Shopping+Plaza,+17E,+Sector+17,+Chandigarh,+160017/HP+World+-+Sector+17E,+1st+Floor,+SCO+12,+Shopping+Plaza,+17E,+Sector+17,+Chandigarh,+160017/@30.8959353,77.0679584,15z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390fed0a8f6e1ac9:0xfd75de97e90ec3f0!2m2!1d76.780592!2d30.7401467!1m5!1m1!1s0x390fed0a8f6e1ac9:0xfd75de97e90ec3f0!2m2!1d76.780592!2d30.7401467?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-jet-primary text-jet-bg rounded-xl text-sm font-bold hover:bg-jet-accent transition-all shadow-glow"
                    >
                      <MapPin className="w-4 h-4" />
                      Get Directions on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}