"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl p-4 w-72 mb-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Chat with us</h4>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Hi! How can we help you today? Get instant quotes on HP products.
          </p>
          <a
            href="https://wa.me/91XXXXXXXXXX?text=Hi, I need a quote for HP products"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 text-white text-center py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Start Chat
          </a>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="whatsapp-btn"
        aria-label={isOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">WhatsApp Us</span>
      </button>
    </div>
  );
}