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

// These are FINISHES of the one chassis we have a mesh for, and the copy says
// so. Labelling a silver OMEN a "Pavilion" would be a lie the model itself
// contradicts — the OMEN wordmark is right there on the chin once it opens.
// Real HP lines go in here the day each one has its own rigged GLB.
export const LAPTOP_VARIANTS: LaptopVariant[] = [
  {
    id: "shadow",
    name: "Shadow",
    tagline: "OMEN · gaming, at full tilt",
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
    id: "cobalt",
    name: "Cobalt",
    tagline: "OMEN · built for long sessions",
    chassis: "#2f4270",
    backlight: "#60a5fa",
    accent: "#60a5fa",
    screen: {
      heading: "OMEN",
      sub: "RTX 4050 · 144Hz · 16GB DDR5",
      from: "#0b1220",
      to: "#1d4ed8",
    },
  },
  {
    id: "ceramic",
    name: "Ceramic",
    tagline: "OMEN · the quiet one",
    chassis: "#a9b1ba",
    backlight: "#e2e8f0",
    accent: "#94a3b8",
    screen: {
      heading: "OMEN",
      sub: "Core i7 · 16GB · all-day battery",
      from: "#111827",
      to: "#64748b",
    },
  },
  {
    id: "mica",
    name: "Mica",
    tagline: "OMEN · desk-friendly finish",
    chassis: "#4c545f",
    backlight: "#38bdf8",
    accent: "#0891b2",
    screen: {
      heading: "OMEN",
      sub: "vPro · 3-year onsite warranty",
      from: "#0f172a",
      to: "#155e75",
    },
  },
];

/** The angle the lid was authored open at, baked into the rig. */
export const LID_OPEN_RADIANS = (109.45 * Math.PI) / 180;

export const RIGGED_MODEL_URL = "/models/hp_omen_laptop_rigged.glb";
