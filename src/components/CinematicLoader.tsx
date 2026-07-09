"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@react-three/drei";

const MIN_DISPLAY_MS = 1800;
const SESSION_KEY = "jetage-intro-shown";

const letters = "JETAGE".split("");

export function CinematicLoader() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Only show the full intro once per session; skip entirely for reduced motion.
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    if (reducedMotion || alreadyShown) return;
    setVisible(true);
    document.documentElement.style.overflow = "hidden";
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_MS);
    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Ratchet displayed progress upward toward real asset progress.
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setDisplayProgress((current) => {
        const target = active ? Math.max(progress, current) : 100;
        const next = current + (target - current) * 0.12 + 0.3;
        return Math.min(next, target, 100);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [visible, progress, active]);

  const done = visible && minTimeElapsed && displayProgress >= 99.5 && !active;

  useEffect(() => {
    if (!done) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    const timer = setTimeout(() => {
      setVisible(false);
      document.documentElement.style.overflow = "";
    }, 350);
    return () => clearTimeout(timer);
  }, [done]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-jet-bg"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 grid-pattern opacity-40" />

          <div className="relative flex flex-col items-center gap-8">
            <div className="flex items-end overflow-hidden">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="text-5xl sm:text-7xl font-bold tracking-tight text-jet-text"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.15 + i * 0.07,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
              <motion.span
                className="text-5xl sm:text-7xl font-bold text-jet-primary"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4, type: "spring" }}
              >
                .
              </motion.span>
            </div>

            <motion.p
              className="text-xs sm:text-sm tracking-[0.4em] uppercase text-jet-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Authorized HP World Partner
            </motion.p>

            <div className="w-56 sm:w-72 flex flex-col items-center gap-3">
              <div className="w-full h-[2px] bg-jet-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-jet-primary to-jet-accent rounded-full"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
              <motion.span
                className="text-xs font-mono text-jet-text-muted tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {Math.round(displayProgress)}%
              </motion.span>
            </div>
          </div>

          <motion.p
            className="absolute bottom-10 text-[11px] tracking-[0.3em] uppercase text-jet-text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            Since 1989 — Chandigarh, India
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
