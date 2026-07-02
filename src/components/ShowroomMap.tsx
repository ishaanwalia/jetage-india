"use client";

import { MapPin, Clock, Phone, Navigation, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";

interface ShowroomMapProps {
  variant?: "about" | "showroom";
}

export function ShowroomMap({ variant = "about" }: ShowroomMapProps) {
  const isShowroom = variant === "showroom";

  return (
    <section className={`py-16 ${isShowroom ? "bg-jet-bg-elevated" : "bg-jet-bg"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal direction="up">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
              Visit Us
            </span>
            <h2 className="mt-2 text-3xl lg:text-5xl font-bold text-jet-text">
              Experience HP at <span className="text-gradient-gold">Sector 17</span>
            </h2>
            <p className="mt-4 text-lg text-jet-text-dim max-w-2xl mx-auto">
              Step into our showroom at the heart of Chandigarh — right above the iconic Indian Coffee House.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info Panel */}
          <Reveal direction="left" className="lg:col-span-2">
            <div className="bg-jet-bg-card rounded-3xl border border-jet-border p-8 shadow-premium h-full">
              <h3 className="text-xl font-bold text-jet-text mb-6">
                Jetage Computer Traders
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-jet-primary/10 rounded-xl flex items-center justify-center border border-jet-primary/20 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-jet-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-jet-text">Address</p>
                    <p className="text-jet-text-dim text-sm">SCO-12, 1st Floor, Sector-17-E</p>
                    <p className="text-jet-text-dim text-sm">Chandigarh - 160017</p>
                    <p className="text-jet-primary text-sm mt-1">Above Indian Coffee House</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-jet-primary/10 rounded-xl flex items-center justify-center border border-jet-primary/20 flex-shrink-0">
                    <Clock className="w-5 h-5 text-jet-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-jet-text">Business Hours</p>
                    <p className="text-jet-text-dim text-sm">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p className="text-jet-text-dim text-sm">Sunday: Closed</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-jet-primary/10 rounded-xl flex items-center justify-center border border-jet-primary/20 flex-shrink-0">
                    <Phone className="w-5 h-5 text-jet-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-jet-text">Contact</p>
                    <p className="text-jet-text-dim text-sm">+91 98149 58295</p>
                    <p className="text-jet-text-dim text-sm">info@jetageindia.in</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-jet-border space-y-3">
                <a
                  href="https://www.google.com/maps/dir//SCO-12,+1st+Floor,+Sector-17-E,+Chandigarh,+160017"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-jet-primary text-white rounded-xl font-bold hover:bg-jet-primary-dim transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
                <a
                  href="https://www.google.com/maps/place/SCO-12,+Sector+17+E,+Chandigarh,+160017"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-jet-bg-elevated text-jet-text border border-jet-border rounded-xl font-bold hover:border-jet-border-strong transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </Reveal>

          {/* Embedded Map */}
          <Reveal direction="right" className="lg:col-span-3">
            <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden shadow-premium border border-jet-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1234!2d76.8031!3d30.7353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0e0e0e0e0e%3A0x0!2sSCO-12%2C+Sector+17+E%2C+Chandigarh!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "100%" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jetage Showroom Location - SCO-12, Sector-17-E, Chandigarh"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}