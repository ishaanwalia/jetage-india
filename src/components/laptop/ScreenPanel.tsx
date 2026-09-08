"use client";

import { Award, Clock, Phone, Shield, Truck, Zap } from "lucide-react";
import { YEARS_TRADING } from "@/lib/business";

const ADVANTAGES = [
  {
    icon: Award,
    title: "Authorized HP World",
    description:
      "Genuine HP products with full manufacturer warranty and official support. No grey market risks.",
  },
  {
    icon: Phone,
    title: "WhatsApp Ordering",
    description:
      "Order instantly via WhatsApp. Get quotes, place orders, and track delivery — all on your phone.",
  },
  {
    icon: Zap,
    title: "Best Price Guarantee",
    description:
      "We match and beat competitor prices. Exclusive deals you won't find on Amazon or Flipkart.",
  },
  {
    icon: Shield,
    title: "Expert Consultation",
    description: `${YEARS_TRADING}+ years of tech expertise. We help you choose the right product for your exact needs.`,
  },
  {
    icon: Truck,
    title: "All India Delivery",
    description:
      "Fast, insured shipping across India. Special handling for fragile components.",
  },
  {
    icon: Clock,
    title: "After-Sales Support",
    description:
      "Dedicated support for installation, setup, and troubleshooting. We're just a message away.",
  },
];

/**
 * What the viewer sees through the laptop's display as it opens up into the
 * page — Act II of the scroll story.
 *
 * This is the Jetage Advantage section, which used to sit further down the page
 * and now lives only here: the scroll story earns it a better slot than a row
 * of cards two thirds of the way down. Authored at viewport size so the scene
 * can put it on the glass with one uniform scale.
 */
export function ScreenPanel() {
  return (
    // pt-32 clears the fixed navbar: at full-screen this panel IS the viewport,
    // so anything at the top would sit under the header.
    <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-jet-bg px-8 pb-10 pt-32">
      {/* --panel-in is written by the scene each frame. Everything below reads
          it with a per-item offset, which is what gives the stagger — and the
          heading rides further than the cards, so they part company slightly
          on the way in rather than moving as one slab. */}
      <div
        className="space-y-3 text-center"
        style={{
          opacity: "calc(var(--panel-in, 0) * 2.2)",
          transform: "translateY(calc((1 - var(--panel-in, 0)) * 46px))",
        }}
      >
        <span className="inline-block rounded-full border border-jet-primary/20 bg-jet-primary/10 px-4 py-1.5 text-sm font-semibold text-jet-primary">
          Why Jetage
        </span>
        <h2 className="text-4xl font-bold text-jet-text lg:text-6xl">
          The Jetage <span className="text-gradient-gold">Advantage</span>
        </h2>
      </div>

      <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADVANTAGES.map((item, i) => (
          <div
            key={item.title}
            className="rounded-2xl border border-jet-border bg-jet-bg-card p-5 text-left will-change-transform"
            style={
              {
                "--i": i,
                opacity: "calc((var(--panel-in, 0) - var(--i) * 0.07) * 3)",
                transform:
                  "translateY(calc((1 - var(--panel-in, 0)) * (26px + var(--i) * 10px)))",
              } as React.CSSProperties
            }
          >
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-jet-primary/20 bg-jet-primary/10">
              <item.icon className="h-5 w-5 text-jet-primary" />
            </span>
            <h3 className="text-lg font-bold text-jet-text">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-jet-text-dim">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
