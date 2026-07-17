"use client";

import { motion } from "framer-motion";

const items = [
  "HP World Authorized",
  "Genuine Products",
  "37+ Years Trust",
  "All India Delivery",
  "WhatsApp Support",
  "Best Price Guarantee",
  "Expert Consultation",
  "After-Sales Service",
  "Authorized Dealer",
  "SCO-12 Sector-17",
];

export function Marquee3D() {
  return (
    <section className="py-14 border-y border-jet-border overflow-hidden relative">
      {/* Single calm row — steady dots, no tilt, no duplicate layer */}
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex items-center gap-8"
          animate={{ x: [0, -1920] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...items, ...items, ...items].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-jet-text-muted hover:text-jet-primary transition-colors cursor-default shrink-0">
              <div className="w-2 h-2 bg-jet-primary rounded-full" />
              <span className="text-lg font-semibold tracking-wide whitespace-nowrap">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Gradient masks */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-jet-bg to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-jet-bg to-transparent pointer-events-none z-10" />
    </section>
  );
}
