"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, ChevronDown, Laptop, Monitor, Printer, Mouse } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";

const categories = [
  { id: "laptop", name: "Laptops", icon: Laptop, href: "/category/laptop/" },
  { id: "desktop", name: "Desktops", icon: Monitor, href: "/category/desktop/" },
  { id: "printer", name: "Printers", icon: Printer, href: "/category/printer/" },
  { id: "monitor", name: "Monitors", icon: Monitor, href: "/category/monitor/" },
  { id: "accessory", name: "Accessories", icon: Mouse, href: "/category/accessory/" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? "glass-strong py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <Logo size="md" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-jet-text-dim hover:text-jet-primary transition-colors">
              Home
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-jet-text-dim hover:text-jet-primary transition-colors"
              >
                Products
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 glass-strong rounded-2xl overflow-hidden shadow-premium-hover">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={cat.href}
                      onClick={() => setIsCategoryOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-jet-text-dim hover:text-jet-primary hover:bg-jet-primary/5 transition-all"
                    >
                      <cat.icon className="w-4 h-4" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/#showroom" className="px-4 py-2 text-sm font-medium text-jet-text-dim hover:text-jet-primary transition-colors">
              Showroom
            </Link>
            <Link href="/#about" className="px-4 py-2 text-sm font-medium text-jet-text-dim hover:text-jet-primary transition-colors">
              About
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20inquire%20about%20HP%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-jet-whatsapp/10 text-jet-whatsapp border border-jet-whatsapp/20 rounded-full text-sm font-semibold hover:bg-jet-whatsapp hover:text-white transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-jet-bg-card border border-jet-border"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-jet-text" />
            ) : (
              <Menu className="w-5 h-5 text-jet-text" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-6 border-t border-jet-border space-y-2 bg-jet-bg-card/95 backdrop-blur-xl rounded-2xl px-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-jet-text-dim font-medium hover:text-jet-primary transition-colors py-2">
              Home
            </Link>
            <div className="py-2">
              <p className="text-xs text-jet-text-muted uppercase tracking-wider mb-2">Products</p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-jet-text-dim hover:text-jet-primary transition-colors"
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link href="/#showroom" onClick={() => setIsMobileMenuOpen(false)} className="block text-jet-text-dim font-medium hover:text-jet-primary transition-colors py-2">
              Showroom
            </Link>
            <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="block text-jet-text-dim font-medium hover:text-jet-primary transition-colors py-2">
              About
            </Link>
            <div className="pt-4 border-t border-jet-border">
              <a
                href="https://wa.me/919814958295"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-jet-whatsapp text-white rounded-full text-sm font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Order
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}