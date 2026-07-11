"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CinematicImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  caption?: string;
  subcaption?: string;
  kenBurns?: boolean;
  delay?: number;
  children?: ReactNode;
}

export function CinematicImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  caption,
  subcaption,
  kenBurns = false,
  delay = 0,
  children,
}: CinematicImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const zoom = zoomRef.current;
    if (!frame || !zoom) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline({
      delay,
      scrollTrigger: {
        trigger: frame,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
    tl.fromTo(
      frame,
      { clipPath: "inset(14% 10% 14% 10% round 1.5rem)", opacity: 0 },
      { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", opacity: 1, duration: 1.2, ease: "power3.out" },
      0
    ).fromTo(
      zoom,
      { scale: 1.18 },
      { scale: 1, duration: 1.6, ease: "power3.out", clearProps: "transform" },
      0
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [delay]);

  return (
    <div
      ref={frameRef}
      className={`group relative overflow-hidden rounded-3xl border border-jet-border shadow-premium img-shine card-glow ${className}`}
    >
      <div ref={zoomRef} className="absolute inset-0">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover img-grade ${
            kenBurns
              ? "animate-kenburns"
              : "transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          } ${imgClassName}`}
        />
      </div>
      {/* Warm-highlight / cyan-shadow grade */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-[linear-gradient(150deg,rgba(255,180,90,0.10),transparent_40%,rgba(8,145,178,0.14))]" />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_90px_rgba(15,23,42,0.35)] rounded-3xl" />
      {(caption || subcaption) && (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-900/75 via-slate-900/30 to-transparent px-5 pt-12 pb-4 transition-transform duration-500 group-hover:-translate-y-0.5">
          {caption && <p className="text-white font-bold text-sm lg:text-base drop-shadow">{caption}</p>}
          {subcaption && <p className="text-cyan-200/90 text-xs lg:text-sm mt-0.5">{subcaption}</p>}
        </div>
      )}
      {children && <div className="absolute inset-0 z-20">{children}</div>}
    </div>
  );
}
