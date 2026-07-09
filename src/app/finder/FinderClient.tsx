"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Building2,
  Briefcase,
  Palette,
  CircleDot,
  Circle,
  Wifi,
  Copy,
  FileStack,
  Scaling,
  MessageCircle,
  RotateCcw,
  ArrowLeft,
  Check,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FinderAnswers,
  FinderMatch,
  findPrinters,
  buildFinderWhatsAppMessage,
  VOLUME_PAGES,
} from "@/lib/finder";

type Step = 0 | 1 | 2 | 3 | 4;

interface Option {
  value: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}

const QUESTIONS: { key: keyof FinderAnswers; title: string; subtitle: string; options: Option[]; multi?: boolean }[] = [
  {
    key: "place",
    title: "Where will it print?",
    subtitle: "This decides how tough the printer needs to be.",
    options: [
      { value: "home", label: "At home", hint: "Study, school projects, occasional documents", icon: Home },
      { value: "office", label: "Small office", hint: "Invoices, letters, everyday paperwork", icon: Building2 },
      { value: "business", label: "Busy business", hint: "Heavy daily printing, multiple users", icon: Briefcase },
    ],
  },
  {
    key: "color",
    title: "Colour or black & white?",
    subtitle: "Colour needs decide the technology.",
    options: [
      { value: "color", label: "Colour matters", hint: "Photos, projects, marketing material", icon: Palette },
      { value: "mixed", label: "Mostly B&W", hint: "Documents first, occasional colour", icon: CircleDot },
      { value: "mono", label: "Only black & white", hint: "Text documents, bills, forms", icon: Circle },
    ],
  },
  {
    key: "volume",
    title: "How much will you print?",
    subtitle: "Be honest — running cost depends on this the most.",
    options: [
      { value: "low", label: "A little", hint: "Under 100 pages a month", icon: FileStack },
      { value: "medium", label: "Regularly", hint: "100–500 pages a month", icon: FileStack },
      { value: "high", label: "A lot", hint: "500–2,000 pages a month", icon: FileStack },
      { value: "veryhigh", label: "Non-stop", hint: "2,000+ pages a month", icon: FileStack },
    ],
  },
  {
    key: "needs",
    title: "Any must-haves?",
    subtitle: "Pick all that apply — or none.",
    multi: true,
    options: [
      { value: "wifi", label: "Wi-Fi printing", hint: "Print from phones and laptops", icon: Wifi },
      { value: "duplex", label: "Auto two-sided", hint: "Saves half your paper", icon: Copy },
      { value: "aio", label: "Scan & copy", hint: "All-in-one machine", icon: Copy },
      { value: "a3", label: "A3 size", hint: "Large-format documents", icon: Scaling },
    ],
  },
  {
    key: "budget",
    title: "What's your budget?",
    subtitle: "We'll flag it if spending slightly more saves money long-term.",
    options: [
      { value: "b1", label: "Under ₹10,000", hint: "Entry level", icon: FileStack },
      { value: "b2", label: "₹10,000 – ₹20,000", hint: "Most popular range", icon: FileStack },
      { value: "b3", label: "₹20,000 – ₹35,000", hint: "Serious workhorses", icon: FileStack },
      { value: "b4", label: "₹35,000+", hint: "No compromises", icon: FileStack },
    ],
  },
];

export function FinderClient() {
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Partial<FinderAnswers>>({ needs: [] });
  const [showResults, setShowResults] = useState(false);

  const question = QUESTIONS[step];

  const complete = showResults && answers.place && answers.color && answers.volume && answers.budget;
  const matches: FinderMatch[] = useMemo(
    () => (complete ? findPrinters(answers as FinderAnswers) : []),
    [complete, answers]
  );

  const select = (value: string) => {
    if (question.multi) {
      const current = (answers.needs as string[]) || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, needs: next });
      return;
    }
    const next = { ...answers, [question.key]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep((step + 1) as Step);
    } else {
      setShowResults(true);
    }
  };

  const advance = () => {
    if (step < QUESTIONS.length - 1) setStep((step + 1) as Step);
    else setShowResults(true);
  };

  const goBack = () => {
    if (showResults) setShowResults(false);
    else if (step > 0) setStep((step - 1) as Step);
  };

  const restart = () => {
    setAnswers({ needs: [] });
    setStep(0);
    setShowResults(false);
  };

  const whatsappHref = complete
    ? `https://wa.me/919814958295?text=${buildFinderWhatsAppMessage(answers as FinderAnswers, matches)}`
    : "";

  return (
    <main className="min-h-screen bg-jet-bg flex flex-col">
      <Navbar />

      <div className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20 mb-4">
              <Sparkles className="w-4 h-4" />
              Printer Finder
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-jet-text">
              {showResults ? "Your matches" : "Meet your printer in 5 questions"}
            </h1>
          </div>

          {/* Progress rail */}
          {!showResults && (
            <div className="flex items-center gap-2 mb-10 max-w-md mx-auto">
              {QUESTIONS.map((q, i) => (
                <div key={q.key} className="flex-1 h-1.5 rounded-full bg-jet-bg-elevated overflow-hidden">
                  <motion.div
                    className="h-full bg-jet-primary rounded-full"
                    initial={false}
                    animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-jet-text mb-2">{question.title}</h2>
                  <p className="text-jet-text-dim text-sm">{question.subtitle}</p>
                </div>

                <div className={`grid gap-4 ${question.options.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                  {question.options.map((opt) => {
                    const Icon = opt.icon;
                    const selected = question.multi
                      ? ((answers.needs as string[]) || []).includes(opt.value)
                      : answers[question.key] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => select(opt.value)}
                        className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-premium-hover ${
                          selected
                            ? "border-jet-primary bg-jet-primary/5"
                            : "border-jet-border bg-jet-bg-card hover:border-jet-primary/40"
                        }`}
                      >
                        {selected && (
                          <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-jet-primary text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <Icon className={`w-7 h-7 mb-3 ${selected ? "text-jet-primary" : "text-jet-text-muted group-hover:text-jet-primary"} transition-colors`} />
                        <div className="font-bold text-jet-text mb-1">{opt.label}</div>
                        <div className="text-xs text-jet-text-dim leading-relaxed">{opt.hint}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-10">
                  <button
                    onClick={goBack}
                    disabled={step === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-jet-text-dim border border-jet-border hover:border-jet-primary/40 hover:text-jet-primary transition-all disabled:opacity-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  {question.multi && (
                    <button
                      onClick={advance}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-jet-primary text-white hover:bg-jet-primary-dim transition-all"
                    >
                      {((answers.needs as string[]) || []).length ? "Continue" : "Skip — no must-haves"}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {matches.length === 0 ? (
                  <div className="text-center py-12 bg-jet-bg-card rounded-2xl border border-jet-border">
                    <p className="text-jet-text font-semibold mb-2">No exact match in stock right now.</p>
                    <p className="text-jet-text-dim text-sm mb-6 max-w-md mx-auto">
                      Your combination is unusual — but we source the full HP range. Tell us what you
                      need on WhatsApp and we&apos;ll find it for you.
                    </p>
                    <a
                      href={`https://wa.me/919814958295?text=${complete ? buildFinderWhatsAppMessage(answers as FinderAnswers, []) : ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-jet-whatsapp text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Ask on WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {matches.map((match, i) => (
                      <motion.div
                        key={match.product.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 120, damping: 16 }}
                        className={`relative flex flex-col sm:flex-row gap-5 p-6 rounded-2xl border-2 bg-jet-bg-card ${
                          i === 0 ? "border-jet-primary shadow-premium" : "border-jet-border"
                        }`}
                      >
                        {i === 0 && (
                          <span className="absolute -top-3 left-6 px-3 py-1 bg-jet-primary text-white text-xs font-bold rounded-full">
                            Best match
                          </span>
                        )}
                        <Link
                          href={`/products/${match.product.id}/`}
                          className="shrink-0 w-full sm:w-36 h-36 bg-jet-bg-elevated rounded-xl border border-jet-border flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={match.product.image}
                            alt={match.product.name}
                            loading="lazy"
                            className="object-contain max-h-28 w-auto"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/300x200/e2e8f0/64748b?text=${encodeURIComponent(match.product.shortName)}`;
                            }}
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${match.product.id}/`}>
                            <h3 className="font-bold text-jet-text hover:text-jet-primary transition-colors">
                              {match.product.name}
                            </h3>
                          </Link>
                          <div className="flex items-baseline gap-2 mt-1 mb-3">
                            <span className="text-lg font-bold text-jet-text">
                              ₹{match.product.price.toLocaleString("en-IN")}
                            </span>
                            <span className="text-sm text-jet-text-muted line-through">
                              ₹{match.product.mrp.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <ul className="space-y-1.5">
                            {match.reasons.map((reason) => (
                              <li key={reason} className="flex items-start gap-2 text-sm text-jet-text-dim">
                                <Check className="w-4 h-4 text-jet-success shrink-0 mt-0.5" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-3 pt-4"
                    >
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-jet-whatsapp text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Send my matches on WhatsApp
                      </a>
                      <Link
                        href="/cost-calculator/"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-jet-bg-card text-jet-primary border border-jet-primary/30 rounded-xl font-bold text-sm hover:bg-jet-primary hover:text-white transition-all"
                      >
                        See 3-year running costs
                      </Link>
                    </motion.div>
                  </div>
                )}

                <div className="flex justify-center gap-6 mt-8">
                  <button
                    onClick={goBack}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-jet-text-dim hover:text-jet-primary transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change answers
                  </button>
                  <button
                    onClick={restart}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-jet-text-dim hover:text-jet-primary transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Start over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  );
}
