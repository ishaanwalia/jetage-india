"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Calendar, Package, MapPin, Star } from "lucide-react";

const stats = [
  { icon: Calendar, value: 35, suffix: "+", label: "Years of Trust", color: "text-blue-600" },
  { icon: Package, value: 25000, suffix: "+", label: "Products Sold", color: "text-green-600" },
  { icon: MapPin, value: 500, suffix: "+", label: "Cities Served", color: "text-orange-600" },
  { icon: Star, value: 4.8, suffix: "/5", label: "Customer Rating", color: "text-yellow-600" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current * 10) / 10);
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-3xl sm:text-4xl font-bold text-gray-900">
      {value % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-16 bg-gray-50" aria-label="Company statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm mb-4 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}