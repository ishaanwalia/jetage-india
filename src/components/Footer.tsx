"use client";

import { MapPin, Phone, Mail, MessageCircle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-jet-bg-elevated border-t border-jet-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Logo size="md" />
            <p className="text-jet-text-dim text-sm leading-relaxed">
              Authorized HP World Partner since 1989. Visit our showroom at SCO-12, 
              Sector-17-E, Chandigarh — above the iconic Indian Coffee House.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-jet-text-muted">
                <MapPin className="w-4 h-4 text-jet-primary flex-shrink-0" />
                <span>SCO-12, 1st Floor, Sector-17-E, Chandigarh</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-jet-text-muted">
                <Clock className="w-4 h-4 text-jet-primary flex-shrink-0" />
                <span>Mon-Sat: 10AM - 8PM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-jet-text">Quick Links</h4>
            <ul className="space-y-3">
              {["All Products", "Laptops", "Desktops", "Printers", "Monitors", "Accessories"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-jet-text-dim hover:text-jet-primary transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-jet-text">Support</h4>
            <ul className="space-y-3">
              {["Warranty Info", "Driver Downloads", "Installation Help", "Troubleshooting", "Bulk Orders"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-jet-text-dim hover:text-jet-primary transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-jet-text">Contact Us</h4>
            <div className="space-y-4">
              <a href="tel:+919814958295" className="flex items-center gap-3 text-jet-text-dim hover:text-jet-text transition-colors">
                <div className="w-10 h-10 bg-jet-bg-card rounded-lg flex items-center justify-center border border-jet-border">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-jet-text-muted">Call Us</p>
                  <p className="text-sm text-jet-text">+91 98149 58295</p>
                </div>
              </a>

              <a href="https://wa.me/919814958295" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-jet-text-dim hover:text-jet-whatsapp transition-colors">
                <div className="w-10 h-10 bg-jet-whatsapp/10 rounded-lg flex items-center justify-center border border-jet-whatsapp/20">
                  <MessageCircle className="w-4 h-4 text-jet-whatsapp" />
                </div>
                <div>
                  <p className="text-xs text-jet-text-muted">WhatsApp</p>
                  <p className="text-sm text-jet-text">+91 98149 58295</p>
                </div>
              </a>

              <div className="flex items-center gap-3 text-jet-text-dim">
                <div className="w-10 h-10 bg-jet-bg-card rounded-lg flex items-center justify-center border border-jet-border">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-jet-text-muted">Email</p>
                  <p className="text-sm text-jet-text">info@jetageindia.in</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-jet-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-jet-text-muted text-sm">
            © 1989-{new Date().getFullYear()} Jetage Computer Traders. All rights reserved.
          </p>
          <p className="text-jet-text-muted text-sm">
            Authorized HP World Partner • SCO-12, Sector-17-E, Chandigarh
          </p>
        </div>
      </div>
    </footer>
  );
}