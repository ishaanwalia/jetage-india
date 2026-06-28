import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { FileText, ShoppingCart, RotateCcw, Truck, CreditCard, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: "By accessing and using the Jetage India website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of the changes."
    },
    {
      icon: ShoppingCart,
      title: "Orders & Pricing",
      content: "All prices are listed in Indian Rupees (INR) and are subject to change without notice. Product availability is subject to stock levels. We reserve the right to refuse or cancel any order for any reason, including pricing errors or suspected fraud. Orders are confirmed only after payment verification."
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      content: "We accept payments via UPI, bank transfer, and cash on delivery for select orders. Full payment must be received before shipping. For bulk orders, a 50% advance may be required. All prices include applicable GST unless otherwise stated."
    },
    {
      icon: Truck,
      title: "Shipping & Delivery",
      content: "We deliver across India. Delivery times vary by location and typically range from 3-7 business days. Shipping costs are calculated at checkout based on weight and destination. Risk of loss passes to the buyer upon delivery. We are not responsible for delays caused by carriers or force majeure events."
    },
    {
      icon: RotateCcw,
      title: "Returns & Refunds",
      content: "Products may be returned within 7 days of delivery if defective or damaged. Products must be in original packaging with all accessories. Refunds are processed within 5-7 business days after inspection. Software, consumables, and opened items are non-returnable. Warranty claims are handled through HP directly."
    },
    {
      icon: AlertTriangle,
      title: "Limitation of Liability",
      content: "Jetage Computer Traders' liability is limited to the purchase price of the product. We are not liable for indirect, incidental, or consequential damages. All products are covered by HP's manufacturer warranty. We act as an authorized reseller and are not responsible for manufacturer defects."
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
                Legal
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-jet-text">
                Terms of <span className="text-gradient-gold">Service</span>
              </h1>
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
                Last updated: June 2026. Please read these terms carefully before using our services.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {sections.map((section, i) => (
            <Reveal key={i} direction="up" delay={i * 0.1}>
              <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8 hover:border-jet-border-strong transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-jet-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-jet-primary/20">
                    <section.icon className="w-6 h-6 text-jet-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-jet-text mb-3">{section.title}</h2>
                    <p className="text-jet-text-dim leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
