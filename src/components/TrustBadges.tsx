"use client";

import { motion } from "framer-motion";
import { Shield, Truck, RotateCcw, Headphones, Award, Lock } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "HP Authorized",
    description: "100% genuine HP products with official warranty",
  },
  {
    icon: Truck,
    title: "All-India Delivery",
    description: "Fast shipping to 500+ cities across India",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle-free return policy",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "WhatsApp & call support for setup help",
  },
  {
    icon: Award,
    title: "35+ Years Trust",
    description: "Serving customers since 1989",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "UPI, Cards, Net Banking - all secure",
  },
];

export default function TrustBadges() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800" aria-label="Trust badges">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">Why Choose JetAge India?</h2>
          <p className="mt-2 text-blue-100">Your trusted HP partner for over 3 decades</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-3">
                <badge.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{badge.title}</h3>
              <p className="text-blue-200 text-xs leading-relaxed">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}