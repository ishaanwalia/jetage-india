"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Truck, Shield, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero-gradient min-h-[600px] flex items-center relative overflow-hidden" aria-label="Hero section">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Authorized HP Dealer Since 1989
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Genuine HP Products at{" "}
              <span className="text-cyan-300">Best Prices</span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-8 max-w-lg">
              Chandigarh's most trusted HP dealer. Printers, laptops, accessories with 
              all-India delivery and expert support.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/91XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
              >
                WhatsApp Quote
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 mt-10">
              <div className="flex items-center gap-2 text-white/80">
                <Truck className="w-5 h-5" />
                <span className="text-sm">All-India Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="w-5 h-5" />
                <span className="text-sm">HP Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-5 h-5" />
                <span className="text-sm">Same Day Dispatch</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="w-full aspect-square bg-white/10 backdrop-blur-sm rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-6xl">🖨️</span>
                  </div>
                  <p className="text-lg font-semibold">HP Printers & Accessories</p>
                  <p className="text-sm text-blue-200">25+ Products Available</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}