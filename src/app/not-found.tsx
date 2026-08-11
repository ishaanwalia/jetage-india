import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Search, Home, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-jet-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-32 text-center">
        <div className="max-w-lg mx-auto space-y-6">
          <p className="text-7xl font-bold text-gradient-gold">404</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-jet-text">
            This page took a wrong turn
          </h1>
          <p className="text-jet-text-dim">
            The page you're looking for doesn't exist or may have moved. Try browsing our products, or reach out and we'll help you find what you need.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/products/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-jet-primary text-jet-bg rounded-full font-bold hover:bg-jet-accent transition-all"
            >
              <Search className="w-4 h-4" />
              Browse Products
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-jet-bg-card text-jet-text border border-jet-border rounded-full font-bold hover:border-jet-primary/40 transition-all"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <a
              href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20was%20looking%20for%20something%20on%20your%20site%20and%20hit%20a%20dead%20link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-jet-whatsapp/10 text-jet-whatsapp border border-jet-whatsapp/20 rounded-full font-bold hover:bg-jet-whatsapp hover:text-jet-text transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
