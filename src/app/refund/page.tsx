import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import { XCircle, RotateCcw, IndianRupee, Ban, Clock } from "lucide-react";
import type { Metadata } from "next";

/**
 * Cancellation & Refund Policy.
 *
 * Exists as its own page because a payment aggregator's checklist asks for one
 * by name, and its crawler looks for a link that says so. The same terms were
 * already published across /terms and /shipping, but split across two pages
 * with no matching link text, they may as well not be there.
 *
 * The wording is lifted from those pages rather than rewritten, so there is
 * one version of each promise. If a period changes, it has to change in all
 * three places — noted here because that is exactly how policy pages drift
 * apart and start contradicting each other.
 */

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description:
    "How to cancel a Jetage India order, what can be returned, and how long a refund takes. 7-day returns on defective items, refunds in 5-7 business days.",
  alternates: { canonical: "/refund/" },
};

const sections = [
  {
    icon: XCircle,
    title: "Cancelling before dispatch",
    content:
      "You can cancel any order before it leaves our counter. Call +91 98149 58295 with your order number and we will cancel it and refund the full amount, including GST. Most orders are packed the next working day, so the sooner you call, the simpler it is. If the order has already shipped, it is treated as a return instead.",
  },
  {
    icon: RotateCcw,
    title: "Returns after delivery",
    content:
      "Products may be returned within 7 days of delivery if defective or damaged. Products must be in original packaging with all accessories, manuals and warranty cards.",
  },
  {
    icon: Ban,
    title: "What cannot be returned",
    content:
      "Software, opened consumables such as ink and toner, and customised orders cannot be returned. This is because a cartridge cannot be resold once its seal is broken. If a sealed cartridge is the wrong one for your printer, call us before opening it and we will exchange it.",
  },
  {
    icon: IndianRupee,
    title: "How refunds are paid",
    content:
      "Refunds are processed within 5-7 business days after the product has been inspected. The refund goes back to the payment method used for the order — a card or UPI payment is reversed to the same card or account. Bank processing can add a further 2-3 days at their end.",
  },
  {
    icon: Clock,
    title: "Warranty is separate",
    content:
      "A fault that appears after the 7-day return window is a warranty matter, not a refund. All products carry HP's manufacturer warranty and claims are handled through HP directly. We will help you raise one — bring the product and the invoice to the showroom.",
  },
];

export default function RefundPage() {
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
                Cancellation &amp; <span className="text-gradient-gold">Refund Policy</span>
              </h1>
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
                How to cancel an order, what can be sent back, and how long the money takes to
                return.
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

        <Reveal direction="up" className="mt-12">
          <div className="bg-jet-primary/5 rounded-3xl border border-jet-primary/20 p-8 text-center">
            <h2 className="text-xl font-bold text-jet-text mb-3">Cancelling or returning something?</h2>
            <p className="text-jet-text-dim mb-6">
              Call the showroom with your order number and we will sort it out on the phone.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+919814958295"
                className="px-6 py-3 rounded-xl bg-jet-primary text-white font-semibold hover:bg-jet-primary-dim transition-colors"
              >
                +91 98149 58295
              </a>
              <Link
                href="/orders/"
                className="px-6 py-3 rounded-xl border border-jet-border text-jet-text-dim font-semibold hover:border-jet-primary/40 hover:text-jet-primary transition-colors"
              >
                Find your order
              </Link>
            </div>
            <p className="mt-6 text-sm text-jet-text-muted">
              Jetage Computer Traders · SCO-12, 1st Floor, Sector 17-E, Chandigarh 160017 ·
              Mon&ndash;Sat, 10am&ndash;8pm
            </p>
          </div>
        </Reveal>
      </div>

      <Footer />
    </main>
  );
}
