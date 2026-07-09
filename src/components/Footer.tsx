"use client";

import { MapPin, Phone, Mail, MessageCircle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ScrambleText } from "./TextScramble";

export function Footer() {
  const quickLinks = [
    { label: "All Products", href: "/products/" },
    { label: "Printers", href: "/category/printer/" },
    { label: "Accessories", href: "/category/accessory/" },
  ];

  const supportLinks = [
    { label: "Contact Us", href: "/contact/" },
    { label: "Shipping & Returns", href: "/shipping/" },
    { label: "Warranty Info", href: "/warranty/" },
    { label: "Privacy Policy", href: "/privacy/" },
    { label: "Terms of Service", href: "/terms/" },
    { label: "Blogs", href: "/blogs/" },
  ];

  const externalLinks = [
    { label: "HP Support", href: "https://support.hp.com/in-en" },
    { label: "HP Drivers", href: "https://support.hp.com/in-en/drivers" },
    { label: "HP Warranty Check", href: "https://support.hp.com/in-en/warranty" },
  ];

  return (
    <footer className="bg-jet-bg-elevated border-t border-jet-border relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-jet-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/LogoJ.png" alt="Jetage India" className="w-12 h-12 rounded-xl" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-jet-text leading-tight">Jetage</span>
                <span className="text-[10px] text-jet-text-muted tracking-[0.2em] uppercase font-medium">India</span>
              </div>
            </div>
            <p className="text-jet-text-dim text-sm leading-relaxed">
              Authorized HP World Partner since 1989. Visit our showroom at SCO-12, 
              Sector-17-E, Chandigarh — above the iconic Indian Coffee House.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-jet-text-muted group">
                <MapPin className="w-4 h-4 text-jet-primary group-hover:scale-110 transition-transform" />
                <span>SCO-12, 1st Floor, Sector-17-E, Chandigarh</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-jet-text-muted group">
                <Clock className="w-4 h-4 text-jet-primary group-hover:scale-110 transition-transform" />
                <span>Mon-Sat: 10AM - 8PM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-jet-text">
              <ScrambleText text="Quick Links" triggerOnHover />
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-jet-text-dim hover:text-jet-primary transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-bold text-lg mt-8 mb-4 text-jet-text">HP Resources</h4>
            <ul className="space-y-3">
              {externalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-jet-text-dim hover:text-jet-primary transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-jet-text">
              <ScrambleText text="Support" triggerOnHover />
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-jet-text-dim hover:text-jet-primary transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-jet-text">
              <ScrambleText text="Contact Us" triggerOnHover />
            </h4>
            <div className="space-y-4">
              <a href="tel:+919814958295" className="flex items-center gap-3 text-jet-text-dim hover:text-jet-text transition-colors group">
                <div className="w-10 h-10 bg-jet-bg-card rounded-lg flex items-center justify-center border border-jet-border group-hover:border-jet-primary/40 transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-jet-text-muted">Call Us</p>
                  <p className="text-sm text-jet-text">+91 98149 58295</p>
                </div>
              </a>

              <a href="https://wa.me/919814958295" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-jet-text-dim hover:text-jet-whatsapp transition-colors group">
                <div className="w-10 h-10 bg-jet-whatsapp/10 rounded-lg flex items-center justify-center border border-jet-whatsapp/20 group-hover:bg-jet-whatsapp/20 transition-all">
                  <MessageCircle className="w-4 h-4 text-jet-whatsapp" />
                </div>
                <div>
                  <p className="text-xs text-jet-text-muted">WhatsApp</p>
                  <p className="text-sm text-jet-text">+91 98149 58295</p>
                </div>
              </a>

              <a href="mailto:info@jetageindia.in" className="flex items-center gap-3 text-jet-text-dim hover:text-jet-primary transition-colors group">
                <div className="w-10 h-10 bg-jet-bg-card rounded-lg flex items-center justify-center border border-jet-border group-hover:border-jet-primary/40 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-jet-text-muted">Email</p>
                  <p className="text-sm text-jet-text">info@jetageindia.in</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-jet-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-jet-text-muted text-sm">
            © 1989-{new Date().getFullYear()} Jetage Computer Traders. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-jet-text-muted">
            <Link href="/privacy/" className="hover:text-jet-primary transition-colors">Privacy</Link>
            <Link href="/terms/" className="hover:text-jet-primary transition-colors">Terms</Link>
            <Link href="/shipping/" className="hover:text-jet-primary transition-colors">Shipping</Link>
            <Link href="/warranty/" className="hover:text-jet-primary transition-colors">Warranty</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}