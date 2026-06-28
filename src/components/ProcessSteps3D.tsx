"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Search, Package, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "001",
    title: "Inquiry",
    desc: "Contact us via WhatsApp or visit our showroom. Share your requirements and budget.",
    icon: MessageSquare,
    details: ["Share your requirements", "Get instant recommendations", "Receive best-price quotes"]
  },
  {
    number: "002",
    title: "Selection",
    desc: "Our experts help you choose the perfect HP product based on your needs.",
    icon: Search,
    details: ["Compare specifications", "Hands-on demo at showroom", "Expert consultation included"]
  },
  {
    number: "003",
    title: "Order",
    desc: "Confirm your order with payment. We offer multiple payment options.",
    icon: Package,
    details: ["Secure payment options", "Order confirmation", "Invoice & warranty card"]
  },
  {
    number: "004",
    title: "Delivery",
    desc: "Fast, insured delivery across India. Track your shipment in real-time.",
    icon: Truck,
    details: ["All India shipping", "Real-time tracking", "Careful packaging"]
  },
  {
    number: "005",
    title: "Support",
    desc: "Lifetime after-sales support. Installation help and warranty assistance.",
    icon: CheckCircle,
    details: ["Installation guidance", "Driver setup help", "Warranty claim support"]
  }
];

export function ProcessSteps3D() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-20 relative overflow-hidden" style={{ perspective: "1200px" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
            How It Works
          </span>
          <h2 className="text-4xl lg:text-6xl font-bold text-jet-text">
            Simple <span className="text-gradient-gold">Process</span>
          </h2>
          <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
            From inquiry to delivery — we make buying HP products effortless
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Steps List */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.button
                key={i}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  activeStep === i 
                    ? "bg-jet-bg-card border-jet-primary/30 shadow-premium" 
                    : "bg-jet-bg-elevated border-jet-border hover:border-jet-border-strong"
                }`}
                onClick={() => setActiveStep(i)}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                    activeStep === i 
                      ? "bg-jet-primary text-jet-bg border-jet-primary" 
                      : "bg-jet-bg-card text-jet-text-muted border-jet-border"
                  }`}>
                    <span className="font-bold text-sm">{step.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${activeStep === i ? "text-jet-primary" : "text-jet-text"}`}>
                      {step.title}
                    </h3>
                    <p className="text-jet-text-dim text-sm mt-1">{step.desc}</p>
                  </div>
                  <step.icon className={`w-5 h-5 ${activeStep === i ? "text-jet-primary" : "text-jet-text-muted"}`} />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right - 3D Active Step Display */}
          <div className="relative" style={{ perspective: "1000px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, rotateY: -30, x: 50 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: 30, x: -50 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="bg-jet-bg-card rounded-3xl border border-jet-border p-8 shadow-premium relative overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Background number */}
                <div className="absolute -right-4 -top-4 text-[120px] font-bold text-jet-primary/5 select-none">
                  {steps[activeStep].number}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-jet-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-jet-primary/20">
                    {(() => {
                      const Icon = steps[activeStep].icon;
                      return <Icon className="w-8 h-8 text-jet-primary" />;
                    })()}
                  </div>

                  <h3 className="text-2xl font-bold text-jet-text mb-4">
                    {steps[activeStep].title}
                  </h3>

                  <p className="text-jet-text-dim mb-6 leading-relaxed">
                    {steps[activeStep].desc}
                  </p>

                  <div className="space-y-3">
                    {steps[activeStep].details.map((detail, j) => (
                      <motion.div
                        key={j}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.1 }}
                      >
                        <div className="w-6 h-6 bg-jet-success/10 rounded-full flex items-center justify-center border border-jet-success/20">
                          <CheckCircle className="w-3.5 h-3.5 text-jet-success" />
                        </div>
                        <span className="text-jet-text-dim">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 3D decorative elements */}
                <div className="absolute bottom-4 right-4 w-20 h-20 border border-jet-primary/10 rounded-full" />
                <div className="absolute bottom-8 right-8 w-12 h-12 border border-jet-primary/20 rounded-full" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
