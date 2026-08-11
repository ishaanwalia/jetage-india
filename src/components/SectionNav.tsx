"use client";

import { useEffect, useRef, useState } from "react";

interface Section {
  id: string;
  label: string;
}

/**
 * Fixed right-edge rail of tick marks, one per page section — the current
 * section's tick grows and lights up (same idea as the message-navigation
 * rail in chat UIs). Click a tick to jump to that section.
 */
export function SectionNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const closest = visible.reduce((a, b) =>
            Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top) ? a : b
          );
          setActiveId(closest.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    elements.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3"
    >
      {sections.map((s) => {
        const isActive = s.id === activeId;
        return (
          <button
            key={s.id}
            onClick={() =>
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            aria-label={`Jump to ${s.label}`}
            aria-current={isActive}
            className="group relative flex items-center justify-end py-1"
          >
            <span
              className={`absolute right-full mr-3 whitespace-nowrap text-xs font-semibold text-jet-text bg-jet-bg-card border border-jet-border rounded-lg px-2.5 py-1 shadow-premium transition-all duration-200 ${
                isActive
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-1 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block h-0.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-8 bg-jet-primary"
                  : "w-4 bg-jet-border-strong group-hover:w-6 group-hover:bg-jet-primary/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
