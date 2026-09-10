"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Printer, 
  Zap, 
  Shield, 
  Truck, 
  Phone, 
  MessageCircle,
  Star,
  Award,
  Clock,
  MapPin,
  Laptop,
  Monitor,
  Mouse,
  ArrowRight,
  TrendingUp,
  Users,
  Globe,
  Sparkles,
  Cpu,
  HardDrive,
  Wifi,
  ChevronDown,
  Eye
} from "lucide-react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShowroomSection } from "@/components/ShowroomSection";
import { ParticleBackground } from "@/components/ParticleBackground";
import { SpotlightCard } from "@/components/SpotlightCard";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { Counter } from "@/components/Counter";
import { Reveal, StaggerReveal } from "@/components/Reveal";
import { Typewriter } from "@/components/Typewriter";
import { ScrambleText } from "@/components/TextScramble";
import { Marquee } from "@/components/Marquee";
import { SectionNav } from "@/components/SectionNav";
import { YEARS_TRADING } from "@/lib/business";

const HOME_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "categories", label: "Categories" },
  { id: "tools", label: "Finder & Calculator" },
  { id: "featured", label: "Featured" },
  { id: "process", label: "How It Works" },
  { id: "showroom", label: "Showroom" },
  { id: "testimonials", label: "Reviews" },
  { id: "cta", label: "Get Started" },
];

// NEW 3D COMPONENTS
import { LaptopShowcase } from "@/components/laptop/LaptopShowcase";
import { Stats3D } from "@/components/Stats3D";
import { CategoryGrid3D } from "@/components/CategoryGrid3D";
import { Marquee3D } from "@/components/Marquee3D";
import { ProcessSteps3D } from "@/components/ProcessSteps3D";
import { TestimonialsSection } from "@/components/TestimonialsSection";

// SSR'd (unlike LaptopShowcase) so the loader is the first thing painted — it exists
// to cover the page mounting behind it, so it can't itself pop in late.
const CinematicLoader = dynamic(() =>
  import("@/components/CinematicLoader").then((m) => m.CinematicLoader)
);

/** Kept in step with CinematicLoader without pulling it out of its lazy chunk. */
const INTRO_DONE = "jetage:intro-done";

gsap.registerPlugin(ScrollTrigger);

export function HomeClient() {
  const horizontalRef = useRef<HTMLDivElement>(null);

  const { products } = useCompare();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);

  useEffect(() => {
    let ctx: gsap.Context | undefined;

    /**
     * Built after the intro curtain lifts, not on mount.
     *
     * This is the pinned trigger, and pinning is the expensive kind: on every
     * refresh it measures and re-lays-out its spacer, and invalidateOnRefresh
     * re-runs the two functions below, each of which reads scrollWidth and
     * forces synchronous layout. Registering it while the document was locked
     * meant doing all of that against a page of zero scrollable height, and
     * then doing the whole thing again for real once the curtain lifted.
     *
     * Waiting costs nothing visible — this section is most of a page further
     * down than anyone has scrolled by the time the intro ends.
     */
    const build = () => {
      if (ctx) return;
      ctx = gsap.context(() => {
      const horizontalSection = horizontalRef.current;
      if (horizontalSection) {
        const scrollContainer = horizontalSection.querySelector(".horizontal-scroll-container");
        if (scrollContainer) {
          gsap.to(scrollContainer, {
            x: () => -(scrollContainer.scrollWidth - window.innerWidth + 100),
            ease: "none",
            scrollTrigger: {
              trigger: horizontalSection,
              start: "top top",
              // Same horizontal distance, but on phones it's covered over
              // roughly half the vertical scroll — full pin duration there
              // was ~2 extra screens of dead scrolling to clear the row.
              end: () => {
                const distance = scrollContainer.scrollWidth - window.innerWidth + 100;
                const mobileFactor = window.innerWidth < 768 ? 0.55 : 1;
                return `+=${distance * mobileFactor}`;
              },
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      }
      });

      // Everything that is not this trigger — the Reveals, the article and
      // product page fades — did register during the intro, against maxScroll
      // 0. One refresh here re-measures them against the real page. It is the
      // same work that used to happen anyway; the difference is that it happens
      // once, at a known moment, rather than being provoked mid-scroll.
      ScrollTrigger.refresh();
    };

    /**
     * After the browser has painted, not in the same tick as the signal.
     *
     * Building this forces a synchronous layout of a 24,000px document with a
     * pinned section in it, and the intro lifting is the exact moment the hero
     * is due to paint. Running one on top of the other put a multi-second task
     * in front of Largest Contentful Paint and cost about three seconds of it.
     * Two frames of daylight is enough for the paint to land first; the
     * horizontal row is most of a page below anything that can be scrolled to
     * in that time.
     */
    const buildAfterPaint = () =>
      requestAnimationFrame(() => requestAnimationFrame(build));

    if (document.documentElement.dataset.intro === "done") {
      buildAfterPaint();
    } else {
      window.addEventListener(INTRO_DONE, buildAfterPaint, { once: true });
    }

    // The loader is a lazy chunk, and if it ever fails to arrive the event
    // never fires. Waiting forever would cost the horizontal row its pin, which
    // is a visible thing to lose over an invisible optimisation — so this backs
    // it up. build() is idempotent, so whichever gets there first wins.
    const fallback = window.setTimeout(build, 8000);

    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener(INTRO_DONE, buildAfterPaint);
      ctx?.revert();
    };
  }, []);

  return (
    <main className="min-h-screen bg-jet-bg noise-bg relative">
      <CinematicLoader />
      <ParticleBackground />
      <Navbar />
      <SectionNav sections={HOME_SECTIONS} />

      {/* ==================== 3D HERO SECTION ==================== */}
      {/* Owns its own #hero anchor — it spans three screens of pinned scroll. */}
      <LaptopShowcase />

      {/* ==================== 3D STATS SECTION ==================== */}
      {/* Desktop only. On a phone these same four counters are what the
          laptop's display carries, and running them here as well would be the
          same numbers twice on one page. Hidden in CSS rather than dropped in
          React so the decision matches the one the display makes. */}
      <div className="hidden sm:block">
        <Stats3D />
      </div>

      {/* ==================== 3D CATEGORIES SECTION ==================== */}
      <div id="categories">
        <CategoryGrid3D />
      </div>

      {/* ==================== DECISION TOOLS ==================== */}
      <section id="tools" className="py-16 px-6 lg:px-8 bg-jet-bg">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/finder/"
                className="group relative overflow-hidden p-8 bg-jet-bg-card rounded-2xl border border-jet-border hover:border-jet-primary/40 hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1"
              >
                <Sparkles className="w-8 h-8 text-jet-primary mb-4" />
                <h3 className="text-xl font-bold text-jet-text mb-2 group-hover:text-jet-primary transition-colors">
                  Not sure which printer? Answer 5 questions.
                </h3>
                <p className="text-sm text-jet-text-dim mb-4 max-w-md">
                  The Printer Finder matches your usage, volume and budget to the right
                  machine — with honest reasons why.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-jet-primary">
                  Find my printer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                href="/cost-calculator/"
                className="group relative overflow-hidden p-8 bg-jet-bg-card rounded-2xl border border-jet-border hover:border-jet-primary/40 hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1"
              >
                <TrendingUp className="w-8 h-8 text-jet-primary mb-4" />
                <h3 className="text-xl font-bold text-jet-text mb-2 group-hover:text-jet-primary transition-colors">
                  The sticker price is half the story.
                </h3>
                <p className="text-sm text-jet-text-dim mb-4 max-w-md">
                  Ink decides what a printer really costs. Compare the true 3-year cost of
                  Smart Tank vs InkJet vs Laser for your usage.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-jet-primary">
                  Calculate my real cost
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== HORIZONTAL SCROLL SECTION ==================== */}
      <section id="featured" ref={horizontalRef} className="relative bg-jet-bg-elevated overflow-hidden">
        <div className="h-screen flex flex-col justify-center gap-6 pt-24 pb-10">
          <div className="px-6 lg:px-8 flex-shrink-0">
            <div className="max-w-7xl mx-auto">
              <Reveal direction="left">
                <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20 mb-3">
                  Featured Collection
                </span>
              </Reveal>
              <Reveal direction="left" delay={0.1}>
                <h2 className="text-3xl lg:text-5xl font-bold text-jet-text">
                  Scroll to <span className="text-gradient-gold">Explore</span>
                </h2>
              </Reveal>
              <Reveal direction="left" delay={0.2}>
                <p className="text-jet-text-dim mt-2">Drag or scroll to browse our handpicked selection</p>
              </Reveal>
            </div>
          </div>

          <div className="horizontal-scroll-container flex gap-6 px-6 lg:px-8 will-change-transform flex-shrink-0">
            {featuredProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[70vw] sm:w-[300px] xl:w-[280px] 2xl:w-[320px]">
                <ProductCard product={product} compact />
              </div>
            ))}

            <div className="flex-shrink-0 w-[70vw] sm:w-[300px] xl:w-[280px] 2xl:w-[320px] flex items-center justify-center">
              <TiltCard tiltAmount={5}>
                <Link
                  href="/products/"
                  className="group flex flex-col items-center justify-center gap-3 p-8 rounded-3xl bg-jet-bg-card border border-jet-border hover:border-jet-primary/40 transition-all duration-500 hover:shadow-premium h-full w-full"
                >
                  <div className="w-14 h-14 rounded-full bg-jet-primary/10 flex items-center justify-center group-hover:bg-jet-primary group-hover:scale-110 transition-all duration-500 border border-jet-primary/20">
                    <ArrowRight className="w-6 h-6 text-jet-primary group-hover:text-jet-bg transition-colors" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-jet-text group-hover:text-jet-primary transition-colors">View All</h3>
                    <p className="text-jet-text-muted mt-1 text-sm">{products.length}+ Products</p>
                  </div>
                </Link>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3D PROCESS STEPS ==================== */}
      <div id="process">
        <ProcessSteps3D />
      </div>

      <div id="showroom">
        <ShowroomSection />
      </div>

      {/* ==================== TESTIMONIALS ==================== */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* ==================== 3D MARQUEE ==================== */}
      <Marquee3D />

      {/* ==================== CTA SECTION ==================== */}
      <section id="cta" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-jet-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-jet-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <Reveal direction="scale" className="space-y-6">
            <h2 className="text-4xl lg:text-7xl font-bold text-jet-text leading-tight">
              Ready to Find Your
              <span className="block text-gradient-gold glow-text">
                <ScrambleText text="Perfect HP?" triggerOnView />
              </span>
            </h2>
            <p className="text-lg text-jet-text-dim max-w-2xl mx-auto">
              Get personalized recommendations, instant quotes, and exclusive pricing via WhatsApp. 
              Our team responds within minutes.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <MagneticButton strength={0.25}>
                <a 
                  href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20need%20help%20choosing%20an%20HP%20product"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sheen inline-flex items-center gap-3 px-8 py-4 bg-jet-whatsapp text-jet-text rounded-full font-bold hover:bg-[#128C7E] transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:shadow-jet-whatsapp/20"
                >
                  <MessageCircle className="w-6 h-6" />
                  Chat on WhatsApp
                </a>
              </MagneticButton>
              
              <MagneticButton strength={0.25}>
                <a 
                  href="tel:+919814958295"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-jet-bg-card text-jet-text border border-jet-border rounded-full font-bold hover:border-jet-primary/40 hover:text-jet-primary transition-all duration-300 text-lg"
                >
                  <Phone className="w-6 h-6" />
                  Call Us
                </a>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
