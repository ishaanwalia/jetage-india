"use client";

import { Printer, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-jet-navy text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-jet-primary rounded-xl flex items-center justify-center">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">Jet Age</p>
                <p className="text-xs text-gray-400 tracking-widest uppercase">Computer Traders</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Authorized HP printer dealer since 1989. Delivering genuine products, 
              expert advice, and unmatched after-sales support across India.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-jet-primary" />
              <span>Chandigarh, India</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["All Products", "Laser Printers", "Color Laser", "InkJet Printers", "About Us"].map((link) => (
                <li key={link}><Link href="#" className="text-gray-400 hover:text-jet-primary transition-colors text-sm">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {["Warranty Info", "Driver Downloads", "Installation Help", "Troubleshooting", "Bulk Orders"].map((link) => (
                <li key={link}><Link href="#" className="text-gray-400 hover:text-jet-primary transition-colors text-sm">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a href="tel:+919814958295" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                <div><p className="text-xs text-gray-500">Call Us</p><p className="text-sm">+91 98149 58295</p></div>
              </a>
              <a href="https://wa.me/919814958295" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-jet-whatsapp transition-colors">
                <div className="w-10 h-10 bg-jet-whatsapp/20 rounded-lg flex items-center justify-center"><MessageCircle className="w-4 h-4 text-jet-whatsapp" /></div>
                <div><p className="text-xs text-gray-500">WhatsApp</p><p className="text-sm">+91 98149 58295</p></div>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><Mail className="w-4 h-4" /></div>
                <div><p className="text-xs text-gray-500">Email</p><p className="text-sm">info@jetageindia.in</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 1989-{new Date().getFullYear()} Jet Age Computer Traders. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Authorized HP Dealer • Genuine Products Guaranteed</p>
        </div>
      </div>
    </footer>
  );
}