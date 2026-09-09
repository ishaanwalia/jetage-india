"use client";

import { StatsGrid } from "@/components/Stats3D";
import { YEARS_TRADING } from "@/lib/business";

/**
 * What the display shows on phones — the counters, rather than the advantages.
 *
 * The advantages were here first and did not work. Six cards, one per row in a
 * portrait screen, come to roughly twice the height of the panel: the top and
 * bottom ones were cropped, and because the panel is a fixed window onto the
 * laptop's glass there is nothing to scroll — swiping moves the scroll story,
 * not the cards. It read as broken because it was.
 *
 * Four counters in a 2x2 fit the same space with room to spare, and are worth
 * more here anyway: a number ticking up is legible at arm's length in a way
 * that three lines of body copy is not. The advantages are not shown on phones
 * at all now, by the owner's decision.
 *
 * Sized to fit rather than to fill: no fixed heights, a capped grid width, and
 * the whole thing centred, so it survives a short phone in landscape as well as
 * a tall one in portrait.
 *
 * `active` is the arrival of the panel, not the mounting of the page. The cards
 * count off useInView, and this element is technically in the viewport from the
 * first frame — sitting on a display the size of a postage stamp at opacity 0.
 * Rendering them straight away would run the whole animation before anyone
 * could see it and leave four finished numbers to slide in. So the grid is
 * mounted when the panel actually arrives, and the count starts there.
 */
export function StatsPanel({
  active,
  className = "flex",
}: {
  active: boolean;
  /** Which viewports this is drawn on. Decided by the caller, in CSS. */
  className?: string;
}) {
  return (
    <div
      className={`${className} h-full w-full flex-col items-center justify-center gap-6 bg-jet-bg px-5 pb-8 pt-24`}
    >
      {/* Same --panel-in reveal as the advantages, so the two are
          interchangeable from the scene's point of view — it writes one
          variable either way and does not know which panel is reading it. */}
      <div
        className="space-y-2 text-center"
        style={{
          opacity: "calc(var(--panel-in, 0) * 2.2)",
          transform: "translateY(calc((1 - var(--panel-in, 0)) * 46px))",
        }}
      >
        <span className="inline-block rounded-full border border-jet-primary/20 bg-jet-primary/10 px-3 py-1 text-xs font-semibold text-jet-primary">
          Since 1989
        </span>
        <h2 className="text-3xl font-bold text-jet-text">
          {YEARS_TRADING} years, <span className="text-gradient-gold">counted</span>
        </h2>
      </div>

      <div className="w-full max-w-sm">{active && <StatsGrid />}</div>
    </div>
  );
}
