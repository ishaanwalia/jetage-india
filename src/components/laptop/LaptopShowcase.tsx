"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

import { ChevronRight, MessageCircle, MousePointer2, Sparkles } from "lucide-react";
import { LAPTOP_VARIANTS, type LaptopVariant } from "@/lib/laptop-variants";
import { YEARS_TRADING } from "@/lib/business";
import { MagneticButton } from "@/components/MagneticButton";
import { Typewriter } from "@/components/Typewriter";
import { ScreenPanel } from "./ScreenPanel";
import { StatsPanel } from "./StatsPanel";

// three + drei is a ~300KB gzip chunk; keep it out of the initial bundle.
const LaptopScene = dynamic(() => import("./LaptopScene").then((m) => m.LaptopScene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[62%] max-w-2xl aspect-[16/10] rounded-3xl bg-jet-bg-elevated/70 animate-pulse-slow border border-jet-border" />
    </div>
  ),
});

export function LaptopShowcase() {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const spin = useRef(0);
  const portalRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<LaptopVariant>(LAPTOP_VARIANTS[0]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [noWebGL, setNoWebGL] = useState(false);
  const [arrived, setArrived] = useState(false);

  /**
   * Everything below that used to ask "is motion suppressed?" is really asking
   * "is there a scroll story to tell?", and there is not one without a laptop
   * to tell it with. Two very different reasons, one layout.
   */
  const still = reducedMotion || noWebGL;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /**
   * No WebGL, no scene — and without this, no sign of it either.
   *
   * When the context cannot be created, three throws inside r3f's layout
   * effect, so `configure()` never runs and the <canvas> is left at its default
   * 300x150 with no width or height. Nothing is drawn and nothing is logged
   * where a visitor would see it: the hero's right-hand half is simply empty,
   * and the eleven screens of scroll it owns still scroll, past a story that is
   * never going to play. Cheaper to ask first and lay the page out honestly.
   */
  useEffect(() => {
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) setNoWebGL(true);
    // Contexts are a scarce per-page resource; give this one straight back.
    else gl.getExtension("WEBGL_lose_context")?.loseContext();
  }, []);

  // No ScrollTrigger here on purpose. The scene already runs a frame loop, so
  // it reads the wrapper's scroll position itself and drives the 3D, the hero
  // copy and the portal from that one number in a single frame.

  const pick = (next: LaptopVariant) => {
    if (next.id === variant.id) return;
    setVariant(next);
    // A full turn on the swap, so the finish change reads as a deliberate beat.
    if (!reducedMotion) {
      gsap.to(spin, {
        current: spin.current + Math.PI * 2,
        duration: 1.1,
        ease: "power3.inOut",
      });
    }
  };

  /**
   * The scene's opening frame, rendered out of the same GLB and baked to a
   * transparent WebP. Not decoration: without it the hero is a column of copy
   * against half a screen of nothing, which is what "the 3D is broken" looked
   * like in the first place. Lid closed, because that is where the story
   * starts and it is the honest still of a thing that does not move here.
   */
  const poster = (
    <Image
      src="/hero/laptop-closed.webp"
      alt="HP OMEN laptop in the Shadow finish, lid closed"
      width={1200}
      height={426}
      priority
      className="h-auto w-full"
    />
  );

  const picker = (
    <div className="flex flex-wrap items-center gap-2">
      {LAPTOP_VARIANTS.map((v) => {
        const active = v.id === variant.id;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => pick(v)}
            aria-pressed={active}
            className={`group inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              active
                ? "border-jet-primary/50 bg-jet-primary/10 text-jet-primary"
                : "border-jet-border bg-jet-bg-card/70 text-jet-text-dim hover:border-jet-primary/30 hover:text-jet-text"
            }`}
          >
            <span
              className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-inner"
              style={{ background: v.chassis }}
              aria-hidden="true"
            />
            {v.name}
          </button>
        );
      })}
    </div>
  );

  return (
    <section
      id="hero"
      aria-label="Explore HP laptops in 3D"
      className="relative bg-jet-bg"
    >
      <div ref={wrap} className={still ? "relative" : "relative h-[1150vh]"}>
        <div
          className={`${
            still ? "relative" : "sticky top-0"
          } flex h-screen w-full items-center overflow-hidden pt-24 pb-10`}
        >
          {/* Ambient wash — cheap stand-in for a bloom pass, and it recolours
              with the variant so the whole frame shifts, not just the shell. */}
          <div
            className="pointer-events-none absolute inset-0 transition-all duration-700"
            style={{
              background: `radial-gradient(60% 55% at 62% 42%, ${variant.accent}22 0%, transparent 70%)`,
            }}
          />

          {noWebGL && (
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] items-center pr-6 lg:flex xl:pr-10">
              {poster}
            </div>
          )}

          {!noWebGL && (
            <div className="absolute inset-0">
              <LaptopScene
                spin={spin}
                variant={variant}
                reducedMotion={reducedMotion}
                wrapRef={wrap}
                portalRef={portalRef}
                copyRef={copyRef}
                hintRef={hintRef}
                onPanelArrive={setArrived}
              />
            </div>
          )}

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="relative max-w-xl">
              <div ref={copyRef} className="space-y-5 will-change-transform">
                <div
                  onDoubleClick={() => router.push("/admin/")}
                  className="group inline-flex cursor-default items-center gap-2 rounded-full border border-jet-primary/20 bg-jet-primary/10 px-4 py-2 text-sm font-medium text-jet-primary transition-all hover:border-jet-primary/40"
                >
                  <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  <span>Trusted Since 1989</span>
                </div>

                <h1 className="text-4xl font-bold leading-[0.95] tracking-tight text-jet-text sm:text-5xl lg:text-7xl">
                  Premium HP
                  <span className="block text-gradient-gold glow-text">
                    <Typewriter
                      texts={["Products", "Laptops", "Gaming", "Desktops"]}
                      speed={100}
                      pauseDuration={3000}
                    />
                  </span>
                  <span className="mt-4 block text-2xl font-medium text-jet-text-dim sm:text-3xl lg:text-4xl">
                    Delivered to You
                  </span>
                </h1>

                {/* The 3D sentence is a promise, so it is only made when the
                    page can keep it. */}
                <p className="max-w-lg text-lg leading-relaxed text-jet-text-dim lg:text-xl">
                  Authorized HP World Partner with {YEARS_TRADING}+ years of expertise.{" "}
                  {noWebGL
                    ? "Genuine HP laptops, desktops, printers and accessories, delivered across India."
                    : "Explore our featured laptop in interactive 3D, right here on the homepage."}
                </p>

                <div className="flex flex-wrap gap-4">
                  <MagneticButton strength={0.2}>
                    <Link
                      href="/products/"
                      className="group btn-sheen inline-flex items-center gap-3 rounded-full bg-jet-primary px-8 py-4 text-lg font-bold text-jet-bg shadow-glow transition-all duration-300 hover:bg-jet-accent"
                    >
                      Explore Products
                      <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </MagneticButton>
                  <MagneticButton strength={0.2}>
                    <a
                      href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20inquire%20about%20HP%20laptops"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-full border border-jet-whatsapp/30 bg-jet-bg-card px-8 py-4 text-lg font-bold text-jet-whatsapp transition-all duration-300 hover:bg-jet-whatsapp hover:text-jet-text"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp Order
                    </a>
                  </MagneticButton>
                </div>

                {!noWebGL && <div className="pt-1">{picker}</div>}

                {noWebGL && <div className="pt-4 lg:hidden">{poster}</div>}
              </div>
            </div>
          </div>

          {/* Act II, riding on the glass. The scene writes this element's
              transform every frame so it sits exactly on the display, growing
              with it until it IS the viewport. Authored at viewport size so one
              uniform scale works.

              Deliberately NOT aria-hidden: this is the only place the Jetage
              Advantage now lives, so it has to be real content for readers and
              for search, not decoration. Reduced motion gets it in plain flow
              below instead — the animation must never be the only way to read
              the business. */}
          {!still && (
            <div
              ref={portalRef}
              className="pointer-events-none absolute inset-0 z-20 opacity-0 will-change-transform"
            >
              {/*
                Which of these the viewer gets is decided in CSS, not in React.
                It used to be a matchMedia in the page, and on a real phone that
                state never became true — so the display kept the desktop panel
                and showed six advantage cards cropped into a portrait screen
                with no way to scroll them. A media query in a stylesheet cannot
                fail to apply the way one behind hydration can.

                Both are in the markup on both viewports. That is deliberate:
                the advantage copy stays in the HTML for crawlers even where it
                is not drawn, which a conditional render would have removed.
              */}
              <ScreenPanel className="hidden sm:flex" />
              <StatsPanel className="flex sm:hidden" active={arrived} />
            </div>
          )}

          {!still && (
            <div ref={hintRef} className="jet-scroll-hint pointer-events-none absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-jet-border bg-jet-bg-card/80 px-5 py-2.5 text-sm font-medium text-jet-text-dim backdrop-blur-md">
              <MousePointer2 className="h-4 w-4" />
              Scroll to open
            </div>
          )}
        </div>
      </div>

      {/* Without the scroll story there is no screen to reveal it in, so the
          advantages simply sit on the page. Not on a phone: there the page is
          already putting them below the hero, and rendering them here as well
          would print the whole section twice. */}
      {still && (
        <div className="py-16">
          <ScreenPanel inFlow />
        </div>
      )}
    </section>
  );
}
