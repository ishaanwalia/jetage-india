"use client";

import { MapPin, Phone, Mail, MessageCircle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-jet-navy text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Logo size="md" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Authorized HP printer dealer since 1989. Visit our showroom at SCO-12, 
              Sector-17-E, Chandigarh — above the iconic Indian Coffee House.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-jet-primary flex-shrink-0" />
                <span>SCO-12, 1st Floor, Sector-17-E, Chandigarh</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-jet-primary flex-shrink-0" />
                <span>Mon-Sat: 10AM - 8PM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["All Products", "Laser Printers", "Color Laser", "InkJet Printers", "About Jetage"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-jet-primary transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {["Warranty Info", "Driver Downloads", "Installation Help", "Troubleshooting", "Bulk Orders"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-jet-primary transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a href="tel:+919814958295" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Call Us</p>
                  <p className="text-sm">+91 98149 58295</p>
                </div>
              </a>

              <a href="https://wa.me/919814958295" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-jet-whatsapp transition-colors">
                <div className="w-10 h-10 bg-jet-whatsapp/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-jet-whatsapp" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                  <p className="text-sm">+91 98149 58295</p>
                </div>
              </a>

              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm">info@jetageindia.in</p>
                </div>
              </div>

              <a 
                href="https://maps.google.com/?q=SCO-12+Sector-17-E+Chandigarh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-jet-primary transition-colors pt-2"
              >
                <div className="w-10 h-10 bg-jet-primary/20 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-jet-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Get Directions</p>
                  <p className="text-sm">Google Maps</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 1989-{new Date().getFullYear()} Jetage Computer Traders. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Authorized HP World Partner • SCO-12, Sector-17-E, Chandigarh
          </p>
        </div>
      </div>
    </footer>
  );
}