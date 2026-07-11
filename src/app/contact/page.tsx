import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Phone, Mail, MapPin, Clock, MessageCircle, Globe, Navigation, Car, Train } from "lucide-react";
import { CinematicMap } from "@/components/CinematicMap";

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      value: "+91 98149 58295",
      href: "tel:+919814958295",
      desc: "Mon-Sat, 10AM - 7PM",
      color: "text-jet-primary"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+91 98149 58295",
      href: "https://wa.me/919814958295",
      desc: "Instant replies during business hours",
      color: "text-jet-whatsapp"
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@jetageindia.in",
      href: "mailto:info@jetageindia.in",
      desc: "We respond within 24 hours",
      color: "text-jet-primary"
    },
    {
      icon: MapPin,
      title: "Showroom",
      value: "SCO-12, Sector-17-E, Chandigarh",
      href: "https://maps.google.com/?q=SCO-12+Sector-17-E+Chandigarh",
      desc: "Above Indian Coffee House",
      color: "text-jet-primary"
    }
  ];

  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />
      
      <div className="pt-28 pb-16 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center space-y-4">
              <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                Get in Touch
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-jet-text">
                Contact <span className="text-gradient-gold">Jetage</span>
              </h1>
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
                Have questions about HP products? Need a quote? Our team is ready to help via WhatsApp, phone, or email.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        {/* Contact Cards */}
        <StaggerReveal className="grid md:grid-cols-2 gap-6 mb-12" direction="up" stagger={0.1}>
          {contactMethods.map((method, i) => (
            <a
              key={i}
              href={method.href}
              target={method.href.startsWith("http") ? "_blank" : undefined}
              rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group block h-full bg-jet-bg-card rounded-3xl border border-jet-border p-6 hover:border-jet-border-strong hover:shadow-premium transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-jet-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-jet-primary/20 group-hover:bg-jet-primary group-hover:scale-110 transition-all">
                  <method.icon className={`w-6 h-6 ${method.color} group-hover:text-jet-bg transition-colors`} />
                </div>
                <div>
                  <p className="text-sm text-jet-text-muted mb-1">{method.title}</p>
                  <p className="text-lg font-bold text-jet-text group-hover:text-jet-primary transition-colors">{method.value}</p>
                  <p className="text-sm text-jet-text-dim mt-1">{method.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </StaggerReveal>

        {/* Business Hours */}
        <Reveal direction="up" className="mb-12">
          <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8">
            <h2 className="text-2xl font-bold text-jet-text mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-jet-primary" />
              Business Hours
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-jet-bg-elevated rounded-xl border border-jet-border">
                <p className="font-bold text-jet-text">Monday - Saturday</p>
                <p className="text-jet-text-dim">10:00 AM - 7:00 PM</p>
              </div>
              <div className="p-4 bg-jet-bg-elevated rounded-xl border border-jet-border">
                <p className="font-bold text-jet-text">Sunday</p>
                <p className="text-jet-text-dim">Closed</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Location */}
        <Reveal direction="up">
          <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8">
            <h2 className="text-2xl font-bold text-jet-text mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-jet-primary" />
              Visit Our Showroom
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-jet-border">
                  <CinematicMap className="aspect-video" />
                </div>
                <a 
                  href="https://maps.google.com/?q=SCO-12+Sector-17-E+Chandigarh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-jet-primary text-white rounded-xl font-bold hover:bg-jet-primary-dim transition-all"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </a>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-jet-text">Getting Here</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-jet-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-jet-text text-sm">By Car</p>
                      <p className="text-jet-text-dim text-sm">Parking at Sector 17 Plaza. 2-min walk.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Train className="w-5 h-5 text-jet-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-jet-text text-sm">By Bus</p>
                      <p className="text-jet-text-dim text-sm">Sector 17 ISBT is 500m away.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-jet-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-jet-text text-sm">Landmark</p>
                      <p className="text-jet-text-dim text-sm">Above Indian Coffee House, near Neelam Cinema.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
