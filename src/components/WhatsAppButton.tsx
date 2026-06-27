"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const quickMessages = [
    "Hi, I want to buy a printer",
    "What's the best printer for home use?",
    "I need a quote for bulk order",
    "Do you deliver to my city?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-jet-border overflow-hidden">
          <div className="bg-jet-whatsapp p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Jet Age Support</p>
                  <p className="text-green-100 text-xs">Typically replies in minutes</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-sm text-jet-gray mb-3">Choose a quick message or type your own:</p>
            {quickMessages.map((msg, i) => (
              <a key={i} href={`https://wa.me/919814958295?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer" className="block p-3 bg-jet-cream rounded-xl text-sm text-jet-slate hover:bg-jet-primary/10 hover:text-jet-primary transition-all">
                {msg}
              </a>
            ))}
            <a href="https://wa.me/919814958295" target="_blank" rel="noopener noreferrer" className="block w-full text-center p-3 bg-jet-whatsapp text-white rounded-xl font-semibold text-sm hover:bg-[#128C7E] transition-all mt-2">
              Open WhatsApp
            </a>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${isOpen ? "bg-jet-slate rotate-90" : "bg-jet-whatsapp"}`}>
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
}