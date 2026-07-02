"use client";

import { type ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}

export function Marquee({ 
  children, 
  className = "", 
  speed = 30,
  direction = "left",
  pauseOnHover = true
}: MarqueeProps) {
  return (
    <div 
      className={`overflow-hidden ${className}`}
      style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
    >
      <div 
        className={`flex whitespace-nowrap ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        <div className="flex items-center gap-16 px-8">
          {children}
        </div>
        <div className="flex items-center gap-16 px-8" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}