"use client";

import { MapPin, Clock, Phone, Landmark, TreePine, Coffee, ShoppingBag, Film, Star } from "lucide-react";

export function ShowroomSection() {
  return (
    <section id="showroom" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-jet-primary/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full">
                <MapPin className="w-4 h-4" />
                Visit Our Showroom
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-jet-navy leading-tight">
                Experience HP at{" "}
                <span className="text-gradient">Sector 17</span>
              </h2>
            </div>

            <p className="text-jet-gray text-lg leading-relaxed">
              Step into our showroom at the heart of Chandigarh —{" "}
              <span className="font-semibold text-jet-navy">SCO-12, 1st Floor, Sector-17-E</span>, 
              right above the iconic Indian Coffee House and steps from the historic Neelam Cinema. 
              Since 1989, we've been Chandigarh's trusted destination for HP printers and computing solutions.
            </p>

            <div className="bg-jet-cream rounded-2xl p-6 border border-jet-border space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-jet-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-jet-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-jet-navy">Jetage Computer Traders</h3>
                  <p className="text-jet-gray text-sm mt-1">
                    SCO-12, 1st Floor, Sector-17-E<br />
                    Chandigarh - 160017<br />
                    <span className="text-jet-primary font-medium">Above Indian Coffee House</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-jet-gray" />
                  <span className="text-sm text-jet-slate">Mon-Sat: 10AM - 8PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-jet-gray" />
                  <span className="text-sm text-jet-slate">+91 98149 58295</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-jet-navy">The Heart of Chandigarh</h3>
              <p className="text-jet-gray text-sm leading-relaxed">
                Sector 17 Plaza isn't just a market — it's Chandigarh's living heritage. Designed by Le Corbusier 
                in the 1950s, this tree-lined pedestrian plaza with its iconic fountains has been the city's 
                cultural and commercial heartbeat for over seven decades.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Landmark, label: "Le Corbusier's Vision", desc: "UNESCO heritage architecture" },
                  { icon: TreePine, label: "Tree-Lined Plaza", desc: "Pedestrian-only shopping heaven" },
                  { icon: Coffee, label: "Indian Coffee House", desc: "Historic intellectual hub" },
                  { icon: Film, label: "Neelam Cinema", desc: "Chandigarh's first theatre" },
                  { icon: ShoppingBag, label: "Premium Brands", desc: "From local to international" },
                  { icon: MapPin, label: "City Center", desc: "Walking distance to Capitol Complex" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-jet-cream border border-jet-border/50">
                    <item.icon className="w-4 h-4 text-jet-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-jet-navy">{item.label}</p>
                      <p className="text-xs text-jet-gray">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-jet-primary/10 to-jet-accent/10 rounded-3xl blur-2xl" />

            <div className="relative bg-white rounded-3xl shadow-premium border border-jet-border overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-jet-light to-white relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-jet-primary/10 rounded-2xl flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-jet-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-jet-navy">SCO-12, Sector-17-E</p>
                      <p className="text-sm text-jet-gray">Chandigarh</p>
                    </div>
                    <a 
                      href="https://maps.google.com/?q=SCO-12+Sector-17-E+Chandigarh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-jet-primary text-white rounded-full text-sm font-semibold hover:bg-jet-primary-dark transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      Get Directions
                    </a>
                  </div>
                </div>

                <div className="absolute top-4 right-4 w-16 h-16 bg-jet-accent/10 rounded-full" />
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-jet-primary/10 rounded-full" />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-jet-navy">Jetage Computer Traders</p>
                    <p className="text-sm text-jet-gray">Authorized HP World Partner</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-jet-gold">★</span>
                    <span className="text-sm font-bold text-jet-navy">4.5</span>
                    <span className="text-xs text-jet-gray">(232 reviews)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["HP Printers", "Laptops", "Desktops", "Accessories", "After Sales"].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-jet-cream text-jet-slate text-xs rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-jet-navy text-white rounded-2xl p-4 shadow-premium">
              <p className="text-xs text-gray-400">Established</p>
              <p className="text-2xl font-bold">1989</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}