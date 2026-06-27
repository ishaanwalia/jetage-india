"use client";

import { useState, useEffect } from "react";
import { Printer, Menu, X, MessageCircle } from "lucide-react";
import Link from "next/link";

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
    { href: "#", label: "About" },
    { href: "#", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "glass border-b border-jet-border/50 py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isScrolled ? "bg-jet-primary" : "bg-jet-primary/90"}`}>
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-jet-navy">Jet Age</span>
              <span className="text-[10px] tracking-widest uppercase text-jet-gray">Computer Traders</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-medium text-jet-slate hover:text-jet-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="https://wa.me/919814958295?text=Hi%20Jet%20Age%2C%20I%20want%20to%20inquire%20about%20HP%20printers" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-jet-whatsapp text-white rounded-full text-sm font-semibold hover:bg-[#128C7E] transition-all">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-jet-cream">
            {isMobileMenuOpen ? <X className="w-5 h-5 text-jet-navy" /> : <Menu className="w-5 h-5 text-jet-navy" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-6 border-t border-jet-border space-y-4">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-jet-slate font-medium hover:text-jet-primary transition-colors">
                {link.label}
              </Link>
            ))}
            <a href="https://wa.me/919814958295" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-jet-whatsapp text-white rounded-full text-sm font-semibold">
              <MessageCircle className="w-4 h-4" />
              WhatsApp Order
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}