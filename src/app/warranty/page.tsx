import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Shield, Wrench, Clock, FileCheck, AlertCircle, Phone, MessageCircle, Check } from "lucide-react";

export default function WarrantyPage() {
  const warrantyTypes = [
    {
      title: "HP Manufacturer Warranty",
      desc: "All HP products come with standard manufacturer warranty. Duration varies by product category:",
      items: [
        "Laptops & Desktops: 1 Year Onsite Warranty",
        "Printers: 1 Year Limited Warranty",
        "Monitors: 3 Years Warranty",
        "Accessories: 1 Year Warranty",
      ]
    },
    {
      title: "Extended Warranty Options",
      desc: "Upgrade your protection with HP Care Pack services:",
      items: [
        "Extend up to 3 years total coverage",
        "Accidental Damage Protection available",
        "Next Business Day onsite service",
        "24/7 phone support included",
      ]
    },
    {
      title: "What's Covered",
      desc: "Standard warranty covers manufacturing defects and hardware failures:",
      items: [
        "Manufacturing defects in materials and workmanship",
        "Hardware component failures under normal use",
        "Onsite service for eligible products",
        "Phone and online technical support",
      ]
    },
    {
      title: "What's Not Covered",
      desc: "Warranty does not cover the following:",
      items: [
        "Physical damage, drops, or liquid spills",
        "Damage from unauthorized repairs or modifications",
        "Consumables like ink cartridges and toner",
        "Software issues and virus damage",
      ]
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
                Support
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-jet-text">
                Warranty <span className="text-gradient-gold">Information</span>
              </h1>
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
                All products come with genuine HP manufacturer warranty. We assist with warranty claims and service coordination.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <StaggerReveal className="space-y-6" direction="up" stagger={0.1}>
          {warrantyTypes.map((type, i) => (
            <div key={i} className="bg-jet-bg-card rounded-3xl border border-jet-border p-8 hover:border-jet-border-strong transition-all">
              <h2 className="text-xl font-bold text-jet-text mb-3">{type.title}</h2>
              <p className="text-jet-text-dim mb-4">{type.desc}</p>
              <ul className="space-y-2">
                {type.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-jet-success flex-shrink-0 mt-0.5" />
                    <span className="text-jet-text-dim">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </StaggerReveal>

        {/* Claim Process */}
        <Reveal direction="up" className="mt-12">
          <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8">
            <h2 className="text-2xl font-bold text-jet-text mb-6 flex items-center gap-3">
              <Wrench className="w-6 h-6 text-jet-primary" />
              How to Claim Warranty
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Phone, step: "1", title: "Contact Us", desc: "Call or WhatsApp us with your product details and issue description." },
                { icon: FileCheck, step: "2", title: "Diagnosis", desc: "Our team will diagnose the issue and determine warranty eligibility." },
                { icon: Shield, step: "3", title: "Service", desc: "We coordinate with HP service centers for repair or replacement." },
              ].map((s, i) => (
                <div key={i} className="text-center p-6 bg-jet-bg-elevated rounded-2xl border border-jet-border">
                  <div className="w-12 h-12 bg-jet-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-jet-primary/20">
                    <s.icon className="w-6 h-6 text-jet-primary" />
                  </div>
                  <span className="text-jet-primary font-bold text-sm">Step {s.step}</span>
                  <h3 className="text-lg font-bold text-jet-text mt-2">{s.title}</h3>
                  <p className="text-jet-text-dim text-sm mt-2">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Important Note */}
        <Reveal direction="up" className="mt-8">
          <div className="bg-amber-500/5 rounded-2xl border border-amber-500/20 p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-jet-text mb-2">Important Note</h3>
              <p className="text-jet-text-dim text-sm">
                Always keep your original invoice and warranty card safe. These are required for all warranty claims. 
                Register your product on HP's official website to activate warranty coverage. We can assist you with the registration process.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}

