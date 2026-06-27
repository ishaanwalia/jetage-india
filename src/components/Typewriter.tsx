"use client";

import { useEffect, useState, useRef } from "react";

interface TypewriterProps {
  texts: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export function Typewriter({ 
  texts, 
  className = "", 
  speed = 80, 
  deleteSpeed = 40,
  pauseDuration = 2000 
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const currentText = texts[currentIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length - 1));
        if (displayText.length === 1) {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }, deleteSpeed);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length + 1));
        if (displayText.length === currentText.length) {
          timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts, speed, deleteSpeed, pauseDuration, isVisible]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {displayText}
      <span className="animate-pulse text-jet-primary">|</span>
    </span>
  );
}