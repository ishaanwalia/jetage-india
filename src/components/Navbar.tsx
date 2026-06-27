"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#products", label: "Products" },
    { href: "#showroom", label: "Showroom" },
    { href: "#about", label: "About" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "glass border-b border-jet-border/50 py-3 shadow-sm" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <Logo size="md" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-jet-slate hover:text-jet-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-jet-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20inquire%20about%20HP%20printers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-jet-whatsapp text-white rounded-full text-sm font-semibold hover:bg-[#128C7E] transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-jet-cream border border-jet-border"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-jet-navy" />
            ) : (
              <Menu className="w-5 h-5 text-jet-navy" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-6 border-t border-jet-border space-y-4 bg-white/90 backdrop-blur-lg rounded-2xl px-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-jet-slate font-medium hover:text-jet-primary transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-jet-border">
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
            <div className="flex items-center gap-2 text-sm text-jet-gray pt-2">
              <MapPin className="w-4 h-4 text-jet-primary" />
              <span>SCO-12, Sector-17-E, Chandigarh</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}