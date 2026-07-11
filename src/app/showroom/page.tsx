import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { CinematicImage } from "@/components/CinematicImage";
import { CinematicMap } from "@/components/CinematicMap";
import {
  MapPin, Clock, Phone, MessageCircle, Landmark, TreePine,
  Coffee, Film, Star, Navigation, Car, Train
} from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visit Our Showroom | Jetage India",
  description: "Visit our HP World showroom at SCO-12, Sector-17-E, Chandigarh. Experience HP products hands-on. Open Mon-Sat 10AM-8PM. Get directions and plan your visit.",
  keywords: "HP showroom Chandigarh, Jetage showroom, HP World Sector 17, visit HP dealer Chandigarh, HP products showroom, SCO-12 Sector 17",
  alternates: {
    canonical: "https://www.jetageindia.in/showroom",
  },
  openGraph: {
    title: "Visit Our Showroom | Jetage India - HP World Sector 17",
    description: "Experience HP products at our Sector 17 showroom. SCO-12, 1st Floor, Chandigarh. Open Mon-Sat 10AM-8PM.",
    url: "https://www.jetageindia.in/showroom",
    type: "website",
  },
};

export default function ShowroomPage() {
  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />

      {/* Hero — cinematic showroom backdrop */}
      <div className="relative pt-36 pb-24 overflow-hidden border-b border-jet-border noise-bg">
        <div className="absolute inset-0">
          <img
            src="/showroom/showroom4.jpeg"
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
                Visit Us
              </span>
              <h1 className="text-4xl lg:text-7xl font-bold text-white glow-text">
                Experience HP at <span className="text-gradient-gold">Sector 17</span>
              </h1>
              <p className="text-slate-300 max-w-3xl mx-auto text-xl leading-relaxed">
                Step into our showroom at the heart of Chandigarh — right above the iconic Indian Coffee House.
                Since 1989, we've been the city's trusted destination for HP products.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Location Info + Map */}
      <section className="py-16 bg-jet-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Reveal direction="left">
              <div className="space-y-8">
                <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8 shadow-premium">
                  <h2 className="text-2xl font-bold text-jet-text mb-6">Jetage Computer Traders</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-jet-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-jet-text">Address</p>
                        <p className="text-jet-text-dim">SCO-12, 1st Floor, Sector-17-E</p>
                        <p className="text-jet-text-dim">Chandigarh - 160017</p>
                        <p className="text-jet-primary text-sm mt-1">Above Indian Coffee House</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-jet-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-jet-text">Business Hours</p>
                        <p className="text-jet-text-dim">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                        <p className="text-jet-text-dim">Sunday: Closed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-jet-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-jet-text">Contact</p>
                        <p className="text-jet-text-dim">+91 98149 58295</p>
                        <p className="text-jet-text-dim">info@jetageindia.in</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8">
                  <h3 className="text-xl font-bold text-jet-text mb-4">Getting Here</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Car className="w-5 h-5 text-jet-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-jet-text text-sm">By Car</p>
                        <p className="text-jet-text-dim text-sm">Parking available at Sector 17 Plaza. 2-minute walk from parking.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Train className="w-5 h-5 text-jet-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-jet-text text-sm">By Bus</p>
                        <p className="text-jet-text-dim text-sm">Sector 17 ISBT is 500m away. Auto-rickshaws available at the stand.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Navigation className="w-5 h-5 text-jet-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-jet-text text-sm">Landmarks</p>
                        <p className="text-jet-text-dim text-sm">Above Indian Coffee House, near Neelam Cinema & Sector 17 Plaza.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* === EMBEDDED MAP (exact same as homepage) === */}
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
                    <div className="flex flex-wrap gap-2">
                      {["HP Printers", "Laptops", "Desktops", "Monitors", "Accessories"].map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-jet-bg-elevated text-jet-text-dim text-xs rounded-full font-medium border border-jet-border">
                          {tag}
                        </span>
                      ))}
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
                <div className="absolute -bottom-4 -left-4 bg-jet-bg-card text-jet-text rounded-2xl p-4 shadow-premium border border-jet-border">
                  <p className="text-xs text-jet-text-muted">Established</p>
                  <p className="text-2xl font-bold text-jet-primary">1989</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Step Inside — showroom gallery */}
      <section className="py-16 bg-jet-bg-elevated">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up" className="text-center mb-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-jet-text">
              Step <span className="text-gradient-gold">Inside</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.1} className="text-center mb-12">
            <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
              A look around our HP World showroom — every product on display is live and ready to demo.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            <CinematicImage
              src="/showroom/showroom3.jpeg"
              alt="HP accessories and product display wall at Jetage HP World showroom, Sector 17 Chandigarh"
              className="md:col-span-2 aspect-[16/10]"
              caption="The accessories wall"
              subcaption="Printers, ink, and genuine HP accessories"
            />
            <CinematicImage
              src="/showroom/entrance2.jpeg"
              alt="Entrance signage for Jetage HP World laptops and printers showroom, Sector 17 Chandigarh"
              className="md:row-span-2 aspect-[3/4] md:aspect-auto md:h-full"
              caption="Find us on the plaza"
              subcaption="1st floor, above Indian Coffee House"
              delay={0.15}
            />
            <CinematicImage
              src="/showroom/showroom1.jpeg"
              alt="HP laptop demo zone with live display units at Jetage showroom Chandigarh"
              className="aspect-[16/10]"
              caption="Laptop demo zone"
              subcaption="Touch, type, and test before you buy"
              delay={0.1}
            />
            <CinematicImage
              src="/showroom/showroom2.jpeg"
              alt="HP workstation and design laptop corner at Jetage HP World showroom Chandigarh"
              className="aspect-[16/10]"
              caption="Design & workstation corner"
              subcaption="High-performance HP machines on display"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-jet-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up" className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-jet-text">
              What to <span className="text-gradient-gold">Expect</span>
            </h2>
          </Reveal>
          <StaggerReveal className="grid md:grid-cols-3 gap-6" direction="up" stagger={0.1}>
            {[
              { title: "Hands-On Experience", desc: "Touch, feel, and test HP products before you buy. Our demo units are ready for you to explore." },
              { title: "Expert Consultation", desc: "Our trained staff will understand your needs and recommend the perfect product — no upselling, ever." },
              { title: "Instant Quotes", desc: "Get best-price quotes on the spot. We match online prices and offer exclusive in-store deals." },
              { title: "Same-Day Pickup", desc: "Most products are in stock. Walk out with your purchase or arrange delivery at your convenience." },
              { title: "Setup Assistance", desc: "We help with initial setup, driver installation, and connecting to your network." },
              { title: "After-Sales Support", desc: "Visit us for warranty claims, servicing coordination, and troubleshooting help." },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all hover:shadow-premium">
                <div className="w-10 h-10 bg-jet-primary/10 rounded-xl flex items-center justify-center mb-4 border border-jet-primary/20">
                  <span className="text-jet-primary font-bold">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-lg font-bold text-jet-text mb-2">{item.title}</h3>
                <p className="text-jet-text-dim text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-jet-bg-elevated">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl lg:text-5xl font-bold text-jet-text">
            Plan Your <span className="text-gradient-gold">Visit</span>
          </h2>
          <p className="text-jet-text-dim text-lg">
            Can't make it to the showroom? No problem. We offer the same expert service and pricing via WhatsApp,
            with All India Delivery to your doorstep.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="https://www.google.com/maps/dir/HP+World+-+Sector+17E,+1st+Floor,+SCO+12,+Shopping+Plaza,+17E,+Sector+17,+Chandigarh,+160017/HP+World+-+Sector+17E,+1st+Floor,+SCO+12,+Shopping+Plaza,+17E,+Sector+17,+Chandigarh,+160017/@30.8959353,77.0679584,15z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390fed0a8f6e1ac9:0xfd75de97e90ec3f0!2m2!1d76.780592!2d30.7401467!1m5!1m1!1s0x390fed0a8f6e1ac9:0xfd75de97e90ec3f0!2m2!1d76.780592!2d30.7401467?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-jet-primary text-white rounded-full font-bold hover:bg-jet-primary-dim transition-all shadow-glow"
            >
              <MapPin className="w-5 h-5" />
              Get Directions
            </a>
            <a
              href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20visit%20your%20showroom"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-jet-whatsapp text-white rounded-full font-bold hover:bg-[#128C7E] transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Schedule Visit
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}