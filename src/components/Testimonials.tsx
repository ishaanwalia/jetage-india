"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Small Business Owner",
    location: "Chandigarh",
    rating: 5,
    text: "Best HP dealer in Tricity! Got HP LaserJet M126nw at unbeatable price. Delivery was next day. Highly recommended!",
    product: "HP LaserJet Pro MFP M126nw",
  },
  {
    name: "Priya Sharma",
    role: "Freelance Designer",
    location: "Mohali",
    rating: 5,
    text: "Bought HP Smart Tank 790 for my design work. The print quality is amazing and the team helped me set it up remotely.",
    product: "HP Smart Tank 790",
  },
  {
    name: "Amit Singh",
    role: "IT Manager",
    location: "Panchkula",
    rating: 5,
    text: "Ordered 5 HP Color LaserJet Pro 3203dw for our office. Bulk pricing was excellent and all units work perfectly.",
    product: "HP Color LaserJet Pro 3203dw",
  },
  {
    name: "Sneha Gupta",
    role: "Student",
    location: "Delhi",
    rating: 4,
    text: "Great prices for students! Ordered HP DeskJet 4926 and got it delivered to Delhi in 3 days. WhatsApp support is super helpful.",
    product: "HP DeskJet Ink Advantage 4926",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="testimonials-heading" className="text-3xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-gray-600">Real reviews from verified buyers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-6 relative"
            >
              <Quote className="w-8 h-8 text-blue-200 absolute top-4 right-4" />
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.role}, {testimonial.location}</p>
                <p className="text-xs text-blue-600 mt-1 font-medium">Bought: {testimonial.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}