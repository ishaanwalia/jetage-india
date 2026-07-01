"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section className="py-16 bg-gray-900" aria-label="Newsletter signup">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Get Best Price Alerts</h2>
        <p className="text-gray-400 mb-6">
          Subscribe for exclusive deals on HP products. No spam, ever.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={submitted}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {submitted ? (
              <>
                <Check className="w-4 h-4" />
                Subscribed!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Subscribe
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}