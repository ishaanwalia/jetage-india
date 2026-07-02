"use client";

import { useEffect, useState, useCallback } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function useTextScramble(text: string, trigger: boolean = true, speed: number = 30) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = useCallback(() => {
    if (!trigger || isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, trigger, speed, isScrambling]);

  useEffect(() => {
    if (trigger) {
      const cleanup = scramble();
      return cleanup;
    }
  }, [trigger, scramble]);

  return { displayText, scramble, isScrambling };
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  triggerOnView?: boolean;
}

export function ScrambleText({ text, className = "", triggerOnHover = false, triggerOnView = false }: ScrambleTextProps) {
  const [triggered, setTriggered] = useState(!triggerOnView);
  const [hovered, setHovered] = useState(false);
  const { displayText, scramble } = useTextScramble(text, triggerOnHover ? hovered : triggered);

  useEffect(() => {
    if (triggerOnView) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTriggered(true);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      const el = document.getElementById(`scramble-${text.replace(/\s/g, "-")}`);
      if (el) observer.observe(el);

      return () => observer.disconnect();
    }
  }, [triggerOnView, text]);

  return (
    <span
      id={`scramble-${text.replace(/\s/g, "-")}`}
      className={`inline-block ${className}`}
      onMouseEnter={() => {
        setHovered(true);
        scramble();
      }}
      onMouseLeave={() => setHovered(false)}
    >
      {displayText}
    </span>
  );
}