"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function Reveal({ 
  children, 
  className = "", 
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 60,
  once = true
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration,
      delay,
      ease: "power3.out",
    };

    switch (direction) {
      case "up": fromVars.y = distance; break;
      case "down": fromVars.y = -distance; break;
      case "left": fromVars.x = distance; break;
      case "right": fromVars.x = -distance; break;
      case "scale": fromVars.scale = 0.8; break;
      case "fade": break;
    }

    const tween = gsap.from(el, {
      ...fromVars,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: once ? "play none none none" : "play reverse play reverse",
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [direction, delay, duration, distance, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  childClassName?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
  stagger?: number;
  duration?: number;
  distance?: number;
}

export function StaggerReveal({
  children,
  className = "",
  childClassName = "",
  direction = "up",
  stagger = 0.1,
  duration = 0.6,
  distance = 40,
}: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const children = containerRef.current.children;
    if (!children.length) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration,
      stagger,
      ease: "power3.out",
    };

    switch (direction) {
      case "up": fromVars.y = distance; break;
      case "down": fromVars.y = -distance; break;
      case "left": fromVars.x = distance; break;
      case "right": fromVars.x = -distance; break;
      case "scale": fromVars.scale = 0.85; break;
    }

    const tween = gsap.from(children, {
      ...fromVars,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    return () => { tween.kill(); };
  }, [direction, stagger, duration, distance]);

  return (
    <div ref={containerRef} className={className}>
      {Array.isArray(children) 
        ? children.map((child, i) => (
            <div key={i} className={childClassName}>
              {child}
            </div>
          ))
        : children
      }
    </div>
  );
}