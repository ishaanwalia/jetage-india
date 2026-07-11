"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430!2d76.780592!3d30.7401467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0a8f6e1ac9%3A0xfd75de97e90ec3f0!2sHP%20World%20-%20Sector%2017E!5e0!3m2!1sen!2sin!4v1700000000000";

const HOLD_MS = 1600; // how long the entrance shot holds before the wipe
const WIPE_MS = 1400; // duration of the cinematic wipe

/**
 * Google Maps embed with a cinematic intro: a graded shot of the showroom
 * entrance holds on screen, then wipes away to reveal the live map.
 */
export function CinematicMap({ className = "aspect-[4/3]" }: { className?: string }) {
  const startedRef = useRef(false);
  const [phase, setPhase] = useState<"hold" | "wipe" | "done">("hold");

  const reveal = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setTimeout(() => setPhase("wipe"), HOLD_MS);
  };

  useEffect(() => {
    if (phase !== "wipe") return;
    const t = setTimeout(() => setPhase("done"), WIPE_MS + 100);
    return () => clearTimeout(t);
  }, [phase]);

  // Fallback in case the iframe load event never fires
  useEffect(() => {
    const t = setTimeout(reveal, 4500);
    return () => clearTimeout(t);
  }, []);

  const wiping = phase === "wipe";

  return (
    <div className={`relative overflow-hidden bg-jet-bg-elevated ${className}`}>
      <iframe
        src={MAP_EMBED_SRC}
        width="100%"
        height="100%"
        style={{ border: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Jetage India Showroom Location - SCO-12, Sector-17-E, Chandigarh"
        onLoad={reveal}
      />

      {phase !== "done" && (
        <>
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            style={{
              clipPath: wiping ? "inset(0% 0% 0% 100%)" : "inset(0% 0% 0% 0%)",
              transition: `clip-path ${WIPE_MS}ms cubic-bezier(0.77, 0, 0.18, 1)`,
            }}
          >
            <img
              src="/showroom/entrance2.jpeg"
              alt="Entrance signage of Jetage HP World showroom, Sector 17 Chandigarh"
              className="w-full h-full object-cover img-grade animate-kenburns"
            />
            {/* Navy/cyan duotone grade + vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-slate-900/40" />
            <div className="absolute inset-0 mix-blend-overlay bg-[linear-gradient(150deg,rgba(34,211,238,0.18),transparent_50%,rgba(8,145,178,0.2))]" />
            <div className="absolute inset-0 shadow-[inset_0_0_110px_rgba(2,6,23,0.6)]" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300" />
              </span>
              <div>
                <p className="text-white text-sm font-bold drop-shadow flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-300" />
                  Locating our showroom…
                </p>
                <p className="text-cyan-200/90 text-xs">SCO-12, 1st Floor, Sector-17-E, Chandigarh</p>
              </div>
            </div>
          </div>

          {/* Leading cyan edge that travels with the wipe */}
          <div
            className="absolute top-0 bottom-0 w-[3px] z-20 pointer-events-none bg-gradient-to-b from-transparent via-cyan-300 to-transparent shadow-[0_0_18px_rgba(34,211,238,0.9)]"
            style={{
              left: wiping ? "100%" : "0%",
              opacity: wiping ? 1 : 0,
              transition: `left ${WIPE_MS}ms cubic-bezier(0.77, 0, 0.18, 1), opacity 300ms ease`,
            }}
          />
        </>
      )}
    </div>
  );
}
