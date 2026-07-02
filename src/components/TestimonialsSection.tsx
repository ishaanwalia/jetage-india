"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, ExternalLink, MapPin, Calendar } from "lucide-react";
import { Reveal } from "./Reveal";

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  date: string;
  product: string;
  text: string;
  location: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 5,
    date: "December 2025",
    product: "HP Laser MFP 1188nw",
    text: "Been buying from Jetage since 2019. Got the HP Laser MFP 1188nw for our CA office in Sector 17. Best price in Chandigarh — beat Amazon by ₹2,400. Installation was done same day. Mr. Thakral himself explained the Wi-Fi setup. Genuine HP warranty, no grey market stuff. Highly recommended for bulk office purchases.",
    location: "Chandigarh",
    verified: true,
  },
  {
    id: 2,
    name: "Simran Kaur",
    rating: 5,
    date: "November 2025",
    product: "HP Pavilion 15 Laptop",
    text: "Purchased HP Pavilion 15 for my brother's architecture course. Jetage gave us student pricing that was even better than HP's education store. The team helped us choose between Ryzen 5 and Intel i5 variants — very patient. Laptop was unboxed in front of us, serial number verified on HP's website. Trustworthy dealer after 35+ years!",
    location: "Mohali",
    verified: true,
  },
  {
    id: 3,
    name: "Ankit Sharma",
    rating: 4,
    date: "October 2025",
    product: "HP Color Laser MFP 178nw",
    text: "Good experience buying the HP Color Laser MFP 178nw for our marketing agency. The color output quality is excellent for our client presentations. Jetage offered a competitive corporate package with 3 years extended warranty. Only minor delay in delivery due to stock movement, but they kept us informed on WhatsApp throughout.",
    location: "Panchkula",
    verified: true,
  },
  {
    id: 4,
    name: "Dr. Priya Malhotra",
    rating: 5,
    date: "September 2025",
    product: "HP Laser 303dw + 2 Toners",
    text: "Bought HP Laser 303dw for our clinic's prescription printing. The auto-duplex feature saves so much paper. Jetage bundled 2 extra toner cartridges at a price lower than online retailers. WhatsApp ordering is super convenient — sent a message at 9 PM and got quote by 9:15 AM next day. Professional after-sales support too.",
    location: "Chandigarh",
    verified: true,
  },
  {
    id: 5,
    name: "Vikram Singh",
    rating: 5,
    date: "August 2025",
    product: "HP OMEN 16 Gaming Laptop",
    text: "Got the HP OMEN 16 with RTX 4060 for my gaming setup. Jetage had the best price in Tricity — saved almost ₹8,000 compared to Flipkart. They also helped with RAM upgrade to 32GB at reasonable cost. The showroom experience was great; you can actually touch and feel the products before buying. OG HP World dealer, no doubt.",
    location: "Ludhiana",
    verified: true,
  },
  {
    id: 6,
    name: "Neha Gupta",
    rating: 4,
    date: "July 2025",
    product: "HP DeskJet Ultra 4929 + HP M27f Monitor",
    text: "Ordered HP DeskJet 4929 and M27f monitor for my home office. Jetage delivered both within 2 days to Zirakpur. The printer setup was straightforward with HP Smart app. Monitor came with perfect pixel warranty assurance. Slightly wish they had more color options for the monitor stand, but the product quality is flawless. Will buy again.",
    location: "Zirakpur",
    verified: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "text-yellow-500 fill-yellow-500"
              : star - 0.5 <= rating
              ? "text-yellow-500 fill-yellow-500/50"
              : "text-jet-text-muted/30"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative"
    >
      <div className="relative h-full bg-jet-bg-card rounded-3xl border border-jet-border p-6 lg:p-8 hover:border-jet-border-strong hover:shadow-premium transition-all duration-500 flex flex-col">
        {/* Quote icon */}
        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Quote className="w-10 h-10 text-jet-primary" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-jet-primary/20 to-jet-accent/20 flex items-center justify-center border border-jet-primary/20 text-jet-primary font-bold text-sm shrink-0">
              {testimonial.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h4 className="font-bold text-jet-text text-sm">{testimonial.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={testimonial.rating} />
                <span className="text-xs text-jet-text-muted">{testimonial.rating}.0</span>
              </div>
            </div>
          </div>
          {testimonial.verified && (
            <span className="shrink-0 px-2 py-0.5 bg-jet-success/10 text-jet-success text-[10px] font-bold rounded-full border border-jet-success/20 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Review text */}
        <p className="text-jet-text-dim text-sm leading-relaxed flex-1 mb-5">
          &ldquo;{testimonial.text}&rdquo;
        </p>

        {/* Meta footer */}
        <div className="pt-4 border-t border-jet-border flex flex-wrap items-center gap-3 text-xs text-jet-text-muted">
          <span className="flex items-center gap-1 bg-jet-bg-elevated px-2.5 py-1 rounded-lg border border-jet-border">
            <Calendar className="w-3 h-3" />
            {testimonial.date}
          </span>
          <span className="flex items-center gap-1 bg-jet-bg-elevated px-2.5 py-1 rounded-lg border border-jet-border">
            <MapPin className="w-3 h-3" />
            {testimonial.location}
          </span>
          <span className="bg-jet-primary/10 text-jet-primary px-2.5 py-1 rounded-lg border border-jet-primary/20 font-medium">
            {testimonial.product}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-jet-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal direction="up" className="text-center mb-12 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
            Customer Stories
          </span>
          <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
            Loved by <span className="text-gradient-gold">232+ Customers</span>
          </h2>
          <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
            Real reviews from real buyers across Chandigarh, Mohali, Panchkula, and beyond. 
            See why Jetage has been trusted since 1989.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>

        <Reveal direction="up" delay={0.3} className="text-center mt-12">
          <a
            href="https://www.justdial.com/Chandigarh/Jetage-Computer-Traders-Near-Neelam-Cinema-Chandigarh-Sector-17E/0172PX172-X172-130608174513-R4Q7_BZDET"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-jet-bg-card text-jet-primary border border-jet-primary/20 rounded-full font-semibold hover:bg-jet-primary hover:text-white transition-all group"
          >
            Read More Reviews on JustDial
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
