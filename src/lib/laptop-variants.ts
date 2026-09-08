/**
 * Finishes for the homepage 3D laptop.
 *
 * One rigged mesh (public/models/hp_omen_laptop_rigged.glb) is re-skinned per
 * variant at runtime: the chassis texture is tinted, the keyboard backlight
 * recoloured, and the screen redrawn on a canvas. That keeps every variant free
 * — no extra megabytes over the wire — which matters because the GLB is already
 * the heaviest thing on the page.
 *
 * `model` is the seam for a genuinely different silhouette. Drop a rigged GLB
 * next to the Omen one (same convention: a `Base` node, and a `Lid` node whose
 * origin sits on the hinge with the closed pose as its rest) and point a variant
 * at it — nothing in the scene code has to change. Until then every variant
 * shares the Omen chassis, so keep the copy about finish and use case rather
 * than claiming a distinct body shape.
 */
export type LaptopVariant = {
  id: string;
  /** HP line, as the showroom would say it. */
  name: string;
  tagline: string;
  /** Multiplied over the chassis texture, so darker reads truer than neon. */
  chassis: string;
  /** The model ships an emissive keyboard backlight; this recolours it. */
  backlight: string;
  accent: string;
  screen: {
    heading: string;
    sub: string;
    /** Wallpaper gradient drawn behind the screen UI. */
    from: string;
    to: string;
  };
  /** Optional override once a variant has its own rigged mesh. */
  model?: string;
};

export const LAPTOP_VARIANTS: LaptopVariant[] = [
  {
    id: "omen",
    name: "OMEN",
    tagline: "Gaming, at full tilt",
    chassis: "#26292f",
    backlight: "#22d3ee",
    accent: "#22d3ee",
    screen: {
      heading: "OMEN",
      sub: "RTX graphics · 165Hz · Ryzen 9",
      from: "#0b1220",
      to: "#0e7490",
    },
  },
  {
    id: "victus",
    name: "Victus",
    tagline: "Serious play, sensible price",
    chassis: "#2f4270",
    backlight: "#60a5fa",
    accent: "#60a5fa",
    screen: {
      heading: "Victus",
      sub: "RTX 4050 · 144Hz · 16GB DDR5",
      from: "#0b1220",
      to: "#1d4ed8",
    },
  },
  {
    id: "pavilion",
    name: "Pavilion",
    tagline: "The everyday all-rounder",
    chassis: "#98a1ab",
    backlight: "#e2e8f0",
    accent: "#94a3b8",
    screen: {
      heading: "Pavilion",
      sub: "Core i5 · 16GB · all-day battery",
      from: "#111827",
      to: "#64748b",
    },
  },
  {
    id: "elitebook",
    name: "EliteBook",
    tagline: "Built for the office floor",
    chassis: "#4c545f",
    backlight: "#38bdf8",
    accent: "#0891b2",
    screen: {
      heading: "EliteBook",
      sub: "vPro · Sure View · 3-year warranty",
      from: "#0f172a",
      to: "#155e75",
    },
  },
];

/** The angle the lid was authored open at, baked into the rig. */
export const LID_OPEN_RADIANS = (109.45 * Math.PI) / 180;

export const RIGGED_MODEL_URL = "/models/hp_omen_laptop_rigged.glb";
