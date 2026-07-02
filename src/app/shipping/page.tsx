import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Truck, Package, Clock, MapPin, Shield, RotateCcw, Phone, MessageCircle } from "lucide-react";

export default function ShippingPage() {
  const deliveryZones = [
    { zone: "Chandigarh Tricity", time: "Same Day - 2 Days", cost: "Free above ₹5,000" },
    { zone: "North India (Punjab, Haryana, Delhi, UP)", time: "2-4 Days", cost: "Free above ₹10,000" },
    { zone: "West & Central India", time: "3-5 Days", cost: "Free above ₹15,000" },
    { zone: "East & South India", time: "4-7 Days", cost: "Free above ₹20,000" },
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
                Shipping & <span className="text-gradient-gold">Returns</span>
              </h1>
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
                Fast, reliable delivery across India with easy returns. We partner with trusted logistics providers to ensure your products arrive safely.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        {/* Delivery Info */}
        <Reveal direction="up" className="mb-12">
          <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8">
            <h2 className="text-2xl font-bold text-jet-text mb-6 flex items-center gap-3">
              <Truck className="w-6 h-6 text-jet-primary" />
              Delivery Information
            </h2>
            <div className="space-y-4">
              {deliveryZones.map((zone, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-jet-bg-elevated rounded-xl border border-jet-border">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-jet-primary flex-shrink-0" />
                    <span className="text-jet-text font-medium">{zone.zone}</span>
                  </div>
                  <div className="flex items-center gap-6 mt-2 sm:mt-0">
                    <span className="flex items-center gap-2 text-sm text-jet-text-dim">
                      <Clock className="w-4 h-4" />
                      {zone.time}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-jet-success font-medium">
                      <Package className="w-4 h-4" />
                      {zone.cost}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Process Steps */}
        <StaggerReveal className="grid md:grid-cols-3 gap-6 mb-12" direction="up" stagger={0.1}>
          {[
            { icon: Package, title: "Order Placed", desc: "Confirm your order via WhatsApp or phone. We verify stock and send confirmation." },
            { icon: Truck, title: "Shipped", desc: "Products are carefully packed and dispatched within 24 hours of payment confirmation." },
            { icon: Shield, title: "Delivered", desc: "Receive your product with invoice and warranty card. Inspect before accepting." },
          ].map((step, i) => (
            <div key={i} className="bg-jet-bg-card rounded-2xl border border-jet-border p-6 text-center hover:border-jet-border-strong transition-all">
              <div className="w-14 h-14 bg-jet-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-jet-primary/20">
                <step.icon className="w-7 h-7 text-jet-primary" />
              </div>
              <h3 className="text-lg font-bold text-jet-text mb-2">{step.title}</h3>
              <p className="text-jet-text-dim text-sm">{step.desc}</p>
            </div>
          ))}
        </StaggerReveal>

        {/* Returns Policy */}
        <Reveal direction="up">
          <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8">
            <h2 className="text-2xl font-bold text-jet-text mb-6 flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-jet-primary" />
              Returns & Exchange Policy
            </h2>
            <div className="space-y-4 text-jet-text-dim">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-jet-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-jet-success/20">
                  <span className="text-jet-success text-xs font-bold">1</span>
                </div>
                <p><strong className="text-jet-text">7-Day Return Window:</strong> Products can be returned within 7 days of delivery if defective, damaged, or incorrect.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-jet-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-jet-success/20">
                  <span className="text-jet-success text-xs font-bold">2</span>
                </div>
                <p><strong className="text-jet-text">Original Packaging:</strong> Items must be returned in original packaging with all accessories, manuals, and warranty cards.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-jet-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-jet-success/20">
                  <span className="text-jet-success text-xs font-bold">3</span>
                </div>
                <p><strong className="text-jet-text">Non-Returnable Items:</strong> Software, opened consumables (ink/toner), and customized orders cannot be returned.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-jet-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-jet-success/20">
                  <span className="text-jet-success text-xs font-bold">4</span>
                </div>
                <p><strong className="text-jet-text">Refund Process:</strong> Refunds are processed within 5-7 business days after product inspection. Original payment method is preferred.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Contact CTA */}
        <Reveal direction="up" className="mt-12">
          <div className="bg-jet-primary/5 rounded-3xl border border-jet-primary/20 p-8 text-center">
            <h3 className="text-xl font-bold text-jet-text mb-4">Need Help with Your Order?</h3>
            <p className="text-jet-text-dim mb-6">Our support team is available Monday to Saturday, 10 AM to 8 PM.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://wa.me/919814958295" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-jet-whatsapp text-white rounded-full font-bold hover:bg-[#128C7E] transition-all">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Support
              </a>
              <a href="tel:+919814958295" className="inline-flex items-center gap-2 px-6 py-3 bg-jet-bg-card text-jet-text border border-jet-border rounded-full font-bold hover:border-jet-primary/40 transition-all">
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
