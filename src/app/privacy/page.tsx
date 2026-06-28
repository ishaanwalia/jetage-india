import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";
import { Shield, Lock, Eye, Server, UserCheck, Mail } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: "We collect personal information that you voluntarily provide when contacting us via WhatsApp, phone, or email. This includes your name, phone number, email address, shipping address, and product inquiries. We also collect non-personal information such as browser type, IP address, and pages visited for analytics purposes."
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: "Your information is used to process orders, provide customer support, send order updates, and improve our services. We use your contact details to respond to inquiries and deliver products. We never sell or rent your personal information to third parties."
    },
    {
      icon: Eye,
      title: "Data Sharing",
      content: "We share your information only with trusted shipping partners to deliver your orders. We may also share data with HP for warranty registration purposes. All third parties are contractually obligated to protect your data and use it only for the specified purposes."
    },
    {
      icon: Server,
      title: "Data Security",
      content: "We implement appropriate security measures including encryption, secure servers, and access controls to protect your personal information. While we strive for complete security, no method of transmission over the internet is 100% secure."
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time. To exercise these rights, contact us via WhatsApp or email at info@jetageindia.in."
    },
    {
      icon: Mail,
      title: "Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at info@jetageindia.in or via WhatsApp at +91 98149 58295. Our showroom is located at SCO-12, 1st Floor, Sector-17-E, Chandigarh."
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
                Privacy <span className="text-gradient-gold">Policy</span>
              </h1>
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
                Last updated: June 2026. We are committed to protecting your personal information and being transparent about how we use it.
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
