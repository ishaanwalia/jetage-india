import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { ShowroomMap } from "@/components/ShowroomMap";
import {
  MapPin, Clock, Phone, MessageCircle, Landmark, TreePine,
  Coffee, Film, Star, Navigation, Car, Train
} from "lucide-react";

export default function ShowroomPage() {
  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />

      {/* Hero */}
      <div className="pt-28 pb-16 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center space-y-4">
              <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                Visit Us
              </span>
              <h1 className="text-4xl lg:text-7xl font-bold text-jet-text">
                Experience HP at <span className="text-gradient-gold">Sector 17</span>
              </h1>
              <p className="text-jet-text-dim max-w-3xl mx-auto text-xl leading-relaxed">
                Step into our showroom at the heart of Chandigarh — right above the iconic Indian Coffee House.
                Since 1989, we've been the city's trusted destination for HP products.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Location Info */}
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

            {/* === EMBEDDED MAP (replaces the old placeholder card) === */}
            <Reveal direction="right">
              <div className="space-y-8">
                <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-2 shadow-premium">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1234!2d76.8031!3d30.7353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0e0e0e0e0e%3A0x0!2sSCO-12%2C+Sector+17+E%2C+Chandigarh!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Jetage Showroom Location - SCO-12, Sector-17-E, Chandigarh"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-bold text-jet-text">Jetage Computer Traders</p>
                      <p className="text-sm text-jet-text-muted">Authorized HP World Partner</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-jet-primary fill-jet-primary" />
                      <span className="text-sm font-bold text-jet-text">4.5</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Landmark, label: "Heritage Location", desc: "UNESCO City of Design" },
                    { icon: TreePine, label: "Tree-Lined Plaza", desc: "Pedestrian-friendly" },
                    { icon: Coffee, label: "Indian Coffee House", desc: "Historic landmark below" },
                    { icon: Film, label: "Neelam Cinema", desc: "Chandigarh's first theatre" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all">
                      <item.icon className="w-5 h-5 text-jet-primary mb-2" />
                      <p className="text-sm font-bold text-jet-text">{item.label}</p>
                      <p className="text-xs text-jet-text-muted">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-jet-bg-elevated">
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
      <section className="py-16 bg-jet-bg">
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
              href="https://www.google.com/maps/dir//SCO-12,+1st+Floor,+Sector-17-E,+Chandigarh,+160017"
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