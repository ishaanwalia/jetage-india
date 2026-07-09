import { Product, products } from "@/lib/data/products";

// ==================== PRINTER FINDER ====================

export interface FinderAnswers {
  place: "home" | "office" | "business";
  color: "color" | "mixed" | "mono";
  volume: "low" | "medium" | "high" | "veryhigh";
  needs: string[]; // "wifi" | "duplex" | "aio" | "a3"
  budget: "b1" | "b2" | "b3" | "b4";
}

export const VOLUME_PAGES: Record<FinderAnswers["volume"], number> = {
  low: 75,
  medium: 300,
  high: 1200,
  veryhigh: 2500,
};

export const BUDGET_RANGES: Record<FinderAnswers["budget"], [number, number]> = {
  b1: [0, 10000],
  b2: [10000, 20000],
  b3: [20000, 35000],
  b4: [35000, Infinity],
};

export interface FinderMatch {
  product: Product;
  score: number;
  reasons: string[];
}

const printers = () => products.filter((p) => p.category === "printer");

function parseDutyCycle(dutyCycle: string): number {
  const match = dutyCycle.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function isColorCapable(p: Product): boolean {
  return p.subCategory !== "laser";
}

function isAllInOne(p: Product): boolean {
  const fns = p.specs?.["Functions"] || "";
  return /scan/i.test(fns) || /all-in-one/i.test(p.name);
}

function supportsA3(p: Product): boolean {
  const paper = p.specs?.["Paper Size"] || "";
  return /A3/i.test(paper) || /wide format/i.test(p.name);
}

export function findPrinters(answers: FinderAnswers): FinderMatch[] {
  const monthlyPages = VOLUME_PAGES[answers.volume];
  const [minBudget, maxBudget] = BUDGET_RANGES[answers.budget];

  const matches = printers().map((product) => {
    let score = 0;
    const reasons: string[] = [];

    // --- Colour requirement (hard-ish constraint) ---
    if (answers.color === "color" && !isColorCapable(product)) {
      score -= 100;
    } else if (answers.color === "mono" && product.subCategory === "laser") {
      score += 25;
      reasons.push("Mono laser — cheapest per page for B&W-only printing");
    } else if (answers.color !== "mono" && isColorCapable(product)) {
      score += 10;
      if (answers.color === "color") reasons.push("Full colour printing");
    }

    // --- Volume vs technology ---
    const duty = parseDutyCycle(product.dutyCycle);
    if (monthlyPages > duty && duty > 0) {
      score -= 60; // printer would be over-worked
    } else if (duty >= monthlyPages * 4) {
      score += 10;
    }
    if (monthlyPages >= 500) {
      if (product.subCategory === "smart-tank") {
        score += 30;
        reasons.push("Ink tank keeps running costs ~10× lower at this volume");
      }
      if (product.subCategory === "laser" || product.subCategory === "color-laser") {
        score += 20;
        reasons.push("Laser is built for high monthly volume");
      }
      if (product.subCategory === "deskjet") score -= 25;
    } else {
      if (product.subCategory === "deskjet" || product.subCategory === "inkjet") {
        score += 12;
        reasons.push("Low upfront cost fits light printing");
      }
      if (product.subCategory === "smart-tank") score += 8;
    }

    // --- Place of use ---
    if (answers.place === "business") {
      if (/business|enterprise/i.test(product.idealFor)) {
        score += 15;
        reasons.push(`Rated for ${product.idealFor.toLowerCase()} use`);
      }
      if (product.subCategory === "officejet") score += 10;
    } else if (answers.place === "home") {
      if (/home|student/i.test(product.idealFor)) {
        score += 15;
        reasons.push("Designed for home use");
      }
    } else {
      if (/office|business|home office/i.test(product.idealFor)) score += 12;
    }

    // --- Must-have features ---
    if (answers.needs.includes("wifi")) {
      if (product.connectivity.some((c) => /wi-?fi/i.test(c))) {
        score += 12;
        reasons.push("Wi-Fi + mobile printing");
      } else {
        score -= 40;
      }
    }
    if (answers.needs.includes("duplex")) {
      if (product.duplex) {
        score += 12;
        reasons.push("Automatic two-sided printing");
      } else {
        score -= 40;
      }
    }
    if (answers.needs.includes("aio")) {
      if (isAllInOne(product)) {
        score += 12;
        reasons.push("Print, scan and copy in one machine");
      } else {
        score -= 40;
      }
    }
    if (answers.needs.includes("a3")) {
      if (supportsA3(product)) {
        score += 20;
        reasons.push("Prints up to A3 wide format");
      } else {
        score -= 100;
      }
    }

    // --- Budget fit ---
    if (product.price >= minBudget && product.price <= maxBudget) {
      score += 25;
      reasons.push("Within your budget");
    } else if (product.price < minBudget) {
      score += 8; // cheaper than asked is fine, mild bonus
    } else {
      const over = (product.price - maxBudget) / maxBudget;
      score -= over > 0.3 ? 80 : 30;
    }

    return { product, score, reasons: reasons.slice(0, 4) };
  });

  return matches
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function buildFinderWhatsAppMessage(
  answers: FinderAnswers,
  matches: FinderMatch[]
): string {
  const placeLabel = { home: "Home", office: "Small office", business: "Business" }[answers.place];
  const colorLabel = { color: "Colour", mixed: "Mostly B&W, some colour", mono: "Black & white only" }[answers.color];
  const needLabels: Record<string, string> = {
    wifi: "Wi-Fi",
    duplex: "Auto duplex",
    aio: "Scan & copy",
    a3: "A3 printing",
  };
  const lines = [
    "Hi Jetage, I used the Printer Finder on your website. My requirements:",
    "",
    `• Use: ${placeLabel}`,
    `• Printing: ${colorLabel}`,
    `• Volume: ~${VOLUME_PAGES[answers.volume].toLocaleString("en-IN")} pages/month`,
    answers.needs.length
      ? `• Must-haves: ${answers.needs.map((n) => needLabels[n] || n).join(", ")}`
      : "• Must-haves: none",
    "",
    "Recommended for me:",
    ...matches.map(
      (m, i) => `${i + 1}. ${m.product.name} — ₹${m.product.price.toLocaleString("en-IN")}`
    ),
    "",
    "Please confirm availability and your best price.",
  ];
  return encodeURIComponent(lines.join("\n"));
}

// ==================== TRUE COST CALCULATOR ====================

export interface TechCost {
  id: "smart-tank" | "inkjet" | "laser";
  name: string;
  tagline: string;
  /** typical purchase price, taken from the current catalog */
  purchase: number;
  /** consumable cost per B&W page, ₹ */
  cppMono: number;
  /** consumable cost per colour page, ₹ */
  cppColor: number;
  /** representative product id from the catalog */
  exampleProductId: string;
}

// Purchase prices come from the live catalog; cost-per-page figures are
// industry-typical for genuine HP consumables in India.
function techCosts(colorShare: number): TechCost[] {
  return [
    {
      id: "smart-tank",
      name: "Smart Tank",
      tagline: "Refillable ink tanks",
      purchase: 11974, // HP Smart Tank 524
      cppMono: 0.1,
      cppColor: 0.25,
      exampleProductId: "hp-smart-tank-524",
    },
    {
      id: "inkjet",
      name: "InkJet cartridge",
      tagline: "DeskJet ink cartridges",
      purchase: 8699, // HP DeskJet 4926
      cppMono: 2.5,
      cppColor: 6,
      exampleProductId: "hp-deskjet-4926",
    },
    colorShare > 0
      ? {
          id: "laser",
          name: "Colour Laser",
          tagline: "Toner-based printing",
          purchase: 28799, // HP Color Laser 150nw
          cppMono: 1.5,
          cppColor: 4,
          exampleProductId: "hp-color-laser-150nw",
        }
      : {
          id: "laser",
          name: "Mono Laser",
          tagline: "Toner-based printing",
          purchase: 15499, // HP LaserJet Pro MFP M126a
          cppMono: 1.5,
          cppColor: 4,
          exampleProductId: "hp-laserjet-pro-mfp-m126a",
        },
  ];
}

export interface TechTotals {
  tech: TechCost;
  purchase: number;
  consumables: number;
  total: number;
}

export function threeYearTotals(pagesPerMonth: number, colorShare: number): TechTotals[] {
  const months = 36;
  return techCosts(colorShare).map((tech) => {
    const colorPages = pagesPerMonth * colorShare;
    const monoPages = pagesPerMonth * (1 - colorShare);
    const consumables = Math.round(
      months * (monoPages * tech.cppMono + colorPages * tech.cppColor)
    );
    return { tech, purchase: tech.purchase, consumables, total: tech.purchase + consumables };
  });
}
