"use client";

import { MapPin, Clock, Phone, Landmark, TreePine, Coffee, Film, Star } from "lucide-react";

export function ShowroomSection() {
  return (
    <section id="showroom" className="py-24 bg-jet-bg-elevated relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-jet-primary/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                <MapPin className="w-4 h-4" />
                Visit Our Showroom
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-jet-text leading-tight">
                Experience HP at{" "}
                <span className="text-gradient-gold">Sector 17</span>
              </h2>
            </div>

            <p className="text-jet-text-dim text-lg leading-relaxed">
              Step into our showroom at the heart of Chandigarh —{" "}
              <span className="font-bold text-jet-text">SCO-12, 1st Floor, Sector-17-E</span>, 
              right above the iconic Indian Coffee House. Since 1989, we've been Chandigarh's trusted destination for HP products.
            </p>

            <div className="bg-jet-bg-card rounded-2xl p-6 border border-jet-border space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-jet-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-jet-primary/20">
                  <MapPin className="w-6 h-6 text-jet-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-jet-text">Jetage Computer Traders</h3>
                  <p className="text-jet-text-dim text-sm mt-1">
                    SCO-12, 1st Floor, Sector-17-E<br />
                    Chandigarh - 160017<br />
                    <span className="text-jet-primary font-medium">Above Indian Coffee House</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-jet-text-muted" />
                  <span className="text-sm text-jet-text-dim">Mon-Sat: 10AM - 8PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-jet-text-muted" />
                  <span className="text-sm text-jet-text-dim">+91 98149 58295</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Landmark, label: "Le Corbusier's Vision", desc: "UNESCO heritage architecture" },
                { icon: TreePine, label: "Tree-Lined Plaza", desc: "Pedestrian-only shopping" },
                { icon: Coffee, label: "Indian Coffee House", desc: "Historic intellectual hub" },
                { icon: Film, label: "Neelam Cinema", desc: "Chandigarh's first theatre" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-jet-bg-card border border-jet-border hover:border-jet-border-strong transition-all">
                  <item.icon className="w-4 h-4 text-jet-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-jet-text">{item.label}</p>
                    <p className="text-xs text-jet-text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-jet-primary/10 to-transparent rounded-3xl blur-2xl" />
            <div className="relative bg-jet-bg-card rounded-3xl shadow-premium border border-jet-border overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-jet-bg-elevated to-jet-bg relative overflow-hidden flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-jet-primary/10 rounded-2xl flex items-center justify-center border border-jet-primary/20">
                    <MapPin className="w-10 h-10 text-jet-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-jet-text">SCO-12, Sector-17-E</p>
                    <p className="text-sm text-jet-text-muted">Chandigarh</p>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=SCO-12+Sector-17-E+Chandigarh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-jet-primary text-jet-bg rounded-full text-sm font-bold hover:bg-jet-accent transition-all shadow-glow"
                  >
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-jet-text">Jetage Computer Traders</p>
                    <p className="text-sm text-jet-text-muted">Authorized HP World Partner</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-jet-primary fill-jet-primary" />
                    <span className="text-sm font-bold text-jet-text">4.5</span>
                    <span className="text-xs text-jet-text-muted">(232 reviews)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["HP Printers", "Laptops", "Desktops", "Monitors", "Accessories"].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-jet-bg-elevated text-jet-text-dim text-xs rounded-full font-medium border border-jet-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-jet-bg-card text-jet-text rounded-2xl p-4 shadow-premium border border-jet-border">
              <p className="text-xs text-jet-text-muted">Established</p>
              <p className="text-2xl font-bold text-jet-primary">1989</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}