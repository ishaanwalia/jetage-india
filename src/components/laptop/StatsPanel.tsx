"use client";

import { StatsGrid } from "@/components/Stats3D";
import { YEARS_TRADING } from "@/lib/business";

/**
 * What the display shows on phones — the counters, rather than the advantages.
 *
 * The two swap places on a phone. A six-card advantage grid inside a portrait
 * display is a wall of small print you have to squint through, while four
 * counters ticking up are legible at that size and are the better thing to be
 * looking at when the screen opens. The advantages then take the counters' old
 * slot as an ordinary section below the hero, where they have the whole width
 * to lay out in. Desktop keeps the arrangement it had.
 *
 * `active` is the arrival of the panel, not the mounting of the page. The cards
 * count off useInView, and this element is technically in the viewport from the
 * first frame — sitting on a display the size of a postage stamp at opacity 0.
 * Rendering them straight away would run the whole animation before anyone
 * could see it and leave four finished numbers to slide in. So the grid is
 * mounted when the panel actually arrives, and the count starts there.
 */
export function StatsPanel({ active }: { active: boolean }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-jet-bg px-6 pb-10 pt-28">
      {/* Same --panel-in reveal as the advantages, so the two are interchangeable
          from the scene's point of view — it writes one variable either way. */}
      <div
        className="space-y-3 text-center"
        style={{
          opacity: "calc(var(--panel-in, 0) * 2.2)",
          transform: "translateY(calc((1 - var(--panel-in, 0)) * 46px))",
        }}
      >
        <span className="inline-block rounded-full border border-jet-primary/20 bg-jet-primary/10 px-4 py-1.5 text-sm font-semibold text-jet-primary">
          Since 1989
        </span>
        <h2 className="text-4xl font-bold text-jet-text">
          {YEARS_TRADING} years, <span className="text-gradient-gold">counted</span>
        </h2>
      </div>

      <div className="w-full max-w-md">{active && <StatsGrid />}</div>
    </div>
  );
}
