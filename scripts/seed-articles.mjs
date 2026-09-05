#!/usr/bin/env node
/**
 * Adds three articles to the blog, written against the live catalogue.
 *
 * Kept as a script rather than typed into the CMS because every figure in
 * them is derived from prices and yields already in the database — writing
 * them by hand invites a transcription error onto a page a customer reads.
 *
 * Upserts on slug, so it is safe to re-run after editing the text here. It
 * will, however, overwrite CMS edits to these three articles — once someone
 * starts editing them in /admin, stop running this.
 *
 *   node scripts/seed-articles.mjs
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}
const sql = neon(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL);

/** ~200 wpm, rounded up, matching how the existing articles are labelled. */
const readTime = (md) => `${Math.max(1, Math.ceil(md.split(/\s+/).length / 200))} min read`;

const articles = [
  {
    slug: "hp-ink-toner-compatibility-guide-india-2026",
    title: "Which HP Ink or Toner Fits My Printer? Compatibility and Cost Guide 2026",
    metaDescription:
      "Match your HP printer to the right ink or toner, with real cost-per-page figures. HP 47, 46, 678, 680, 802, 803, 805, GT52, GT53XL, 103A and 181X explained.",
    excerpt:
      "The cartridge number that fits your HP printer, what each one actually costs to run per page, and why the same page can cost 10 paise or ₹2.02 depending on the machine.",
    category: "Buying Guide",
    tags: ["HP Ink", "HP Toner", "Compatibility", "Cost Per Page", "FAQ"],
    content: `Half the calls we take at the counter are the same question: *"which cartridge does my printer need?"* HP uses a lot of similar-looking numbers — 46, 47, 678, 680, 802, 803, 805 — and buying the wrong one means a trip back to Sector 17.

This is the matching list, and then the part nobody tells you at the time of purchase: what each one costs to run.

## Match your printer to its cartridge

| Your printer | Cartridge you need | Price | Rated yield |
|---|---|---|---|
| DeskJet Ink Advantage Ultra 4826, DeskJet 4800 series | HP 47 Black / HP 47 Tri-color | ₹630 each | 1,300 / 700 pages |
| DeskJet Ink Advantage Ultra 4729, 2520, 5738, 5739, 6525 | HP 46 Black | ₹960 | ~1,500 pages |
| DeskJet Ink Advantage 2515, 2545, 2645, 3515, 3545, 4515, 4645 | HP 678 Black / Tri-color | ₹970 each | 480 / 150 pages |
| DeskJet 1000–3050 series | HP 802 Small Black | ₹964 | ~120 pages |
| Smart Tank 400–7000 series, Ink Tank 100/300/400, DeskJet GT 5800 | HP GT53XL Black bottle | ₹861 | 135 ml, high yield |
| Smart Tank and Ink Tank colour | HP GT52 Cyan / Magenta / Yellow | ₹783 each | ~8,000 pages |
| Laser MFP 131 series, Laser 107 series | HP 103A Black toner | ₹1,012 | ~1,500 pages |
| Laser 300 series, Laser MFP 300 series | HP 181X toner + HP 181A drum | ₹8,000 + ₹7,920 | 3,000 / 10,000 pages |

All prices include GST.

**Check the number on the old cartridge before ordering.** It is printed on the front. If the printer is still working, that number is more reliable than any list — including this one — because HP occasionally changes what ships in a region.

## The number that actually matters

Cartridge price on its own tells you very little. Divide it by the rated yield and the picture changes completely:

| Cartridge | Price | Yield | **Cost per page** |
|---|---|---|---|
| HP 802 Small Black | ₹964 | 120 pages | **₹8.03** |
| HP 680 Black | ₹968 | 480 pages | **₹2.02** |
| HP 678 Black | ₹970 | 480 pages | **₹2.02** |
| HP 46 Black | ₹960 | 1,500 pages | **₹0.64** |
| HP 103A toner | ₹1,012 | 1,500 pages | **₹0.67** |
| HP 47 Black | ₹630 | 1,300 pages | **₹0.48** |
| HP GT52 bottle | ₹783 | 8,000 pages | **₹0.10** |

That is not a rounding difference. A page from an HP 802 cartridge costs **eighty times** what the same page costs from a GT52 ink bottle.

### What that means in a year

Take a small office printing 300 pages a month — 3,600 a year:

- On **HP 802 cartridges**: about ₹28,900 a year in ink
- On **HP 680 cartridges**: about ₹7,270 a year
- On **HP 103A toner**: about ₹2,430 a year
- On a **Smart Tank with GT52/GT53XL**: about ₹360 a year

The Smart Tank 524 costs ₹11,974. Against HP 680 cartridges at that volume, it pays for itself in under two years — and against HP 802 cartridges, in about five months.

## So when is a cartridge printer still the right buy?

When you genuinely do not print much. Under about 50 pages a month, the maths flips: you are unlikely to recover the higher purchase price of a tank printer before the machine is replaced, and ink left sitting in tanks for months can dry in the printhead.

The honest rule we use at the counter:

- **Under 50 pages a month** — a DeskJet with cartridges is fine. The [DeskJet Ink Advantage Ultra 4926](/products/hp-deskjet-4926/) at ₹8,699 is the sensible floor.
- **50 to 200 pages a month, some colour** — a Smart Tank. The [Smart Tank 524](/products/hp-smart-tank-524/) at ₹11,974 is the entry point.
- **200+ pages a month, mostly black text** — a laser. Toner does not dry out, and the [Laser MFP 1188a](/products/hp-laser-mfp-1188a/) at ₹18,849 handles that volume without complaint.

## Toner and drum are two different things

This confuses people with the Laser 300 series. The **181X toner** (₹8,000, 3,000 pages) is the ink. The **181A drum** (₹7,920, 10,000 pages) is the part that transfers it to paper.

You replace the toner roughly three times for every one drum. If your printer is showing faded or streaked output and a fresh toner did not fix it, the drum is the next thing to look at — not the printer.

## A word on refills and compatibles

You will be offered third-party cartridges at a third of the price. We do not sell them, and here is the honest reason rather than the sales one: HP's warranty does not cover damage caused by a non-HP cartridge, and the failure we see most often — a leaked cartridge fouling the printhead — costs more to fix than the ink saved.

If your running cost is the problem, the answer is a tank printer, not a cheaper cartridge. The maths above is the argument.

## Still not sure?

Bring the old cartridge, or a photo of it, to the showroom at SCO-12, Sector 17-E. We will match it in a minute. Or call **+91 98149 58295** with the printer model and we will tell you what it takes.
`,
  },

  {
    slug: "hp-printer-questions-we-answer-every-week-india",
    title: "HP Printer Questions We Answer Every Week",
    metaDescription:
      "Straight answers to the HP printer questions we get asked most at our Chandigarh counter: Wi-Fi problems, cartridge errors, print quality, running costs and warranty.",
    excerpt:
      "The questions that come up at the counter almost daily — Wi-Fi that will not connect, cartridges the printer refuses, faded pages, and what the warranty actually covers.",
    category: "FAQ",
    tags: ["HP Printers", "FAQ", "Troubleshooting", "Support", "Chandigarh"],
    content: `These are the questions we are asked most often at the counter. Short answers, no run-around.

## Buying

### Which printer should I buy for home use?

Ask yourself how many pages a month. Under 50, a cartridge DeskJet is fine — the [DeskJet Ink Advantage Ultra 4926](/products/hp-deskjet-4926/) at ₹8,699. Between 50 and 200 with some colour, a [Smart Tank 524](/products/hp-smart-tank-524/) at ₹11,974. Over 200 and mostly text, buy a laser.

### Is a Smart Tank really cheaper?

Yes, and by more than most people expect. A GT52 ink bottle is ₹783 and rated for about 8,000 pages — **10 paise a page**. A HP 680 cartridge is ₹968 for about 480 pages — **₹2.02 a page**. The printer costs more up front and returns it quickly if you print regularly.

### Laser or ink tank?

Toner does not dry out, so a laser suits someone who prints in bursts and then not at all for weeks. Ink tanks are better if you need colour. For a small office printing mostly black text, laser wins on both running cost and reliability.

### Do you sell laptops and desktops?

Our online catalogue is printers, ink, toner and accessories at the moment. We stock much more at the showroom — call **+91 98149 58295** or come to SCO-12, Sector 17-E.

## Wi-Fi and setup

### The printer will not connect to my Wi-Fi

Nine times out of ten it is the 5GHz band. Most budget HP printers — Laser 1008w, 1188w, 303dw — only speak **2.4GHz**. If your router broadcasts one combined network, temporarily separate the bands or connect the printer while standing next to the router.

The full walkthrough is in our [Wi-Fi setup guide](/blogs/how-to-setup-hp-wifi-printer-india-complete-step-by-step-guide/).

### It printed yesterday and today it will not

Usually the router handed the printer a new IP address. Print a network configuration page from the printer's own menu, compare the IP with what your computer has saved, and if they differ, remove and re-add the printer. Setting a static IP or a DHCP reservation stops it recurring.

### Can I print from my phone?

Yes. Install **HP Smart** from the Play Store or App Store. Both the phone and the printer must be on the same network. Most current models also support AirPrint on iPhone and Mopria on Android without any app at all.

## Cartridges and print quality

### The printer says my cartridge is not genuine

If it is a third-party cartridge, that is exactly what the message means. If it is genuine HP, take it out, wipe the copper contacts with a dry cloth, and reseat it firmly until it clicks. Contacts pick up dust quickly in this climate.

### Pages are faded or streaked

- **Inkjet:** run Clean Printhead from the HP Smart app. If two cleaning cycles do not fix it, the printhead needs a proper clean — bring it in rather than running more cycles, which just wastes ink.
- **Laser:** take the toner out and rock it gently side to side to redistribute the powder. That buys you a few hundred more pages. If it is still streaked with a fresh toner, the **drum** is worn.

### Colour is wrong or missing

One empty tank or a clogged nozzle in one colour. Print the diagnostic page from the printer menu — it shows each colour separately, which tells you instantly which one is not firing.

### Ink dried up because I did not print for months

Common here, and avoidable. Print one colour page a week. It costs a few paise and keeps the nozzles clear. If you genuinely print rarely, you should be on a laser.

## Running and maintaining

### Does dust really matter?

In Chandigarh, yes. Keep the printer covered when it is not in use and keep paper in its wrapper rather than loose in a drawer — damp paper is behind most of the jams we see in monsoon. More on this in our [maintenance guide](/blogs/hp-printer-maintenance-tips-indian-climate-dust-humidity-power/).

### Should I use a UPS?

For a laser printer, do not put it on a small home UPS — the fuser draws a heavy surge and will trip most of them. A spike guard on a stable line is better. Inkjets are fine on a UPS.

### Why does the printer say paper jam when there is no paper stuck?

Usually a scrap left behind, or the rollers have gone glossy and are slipping. Open every door and check the whole path, including the duplex unit at the back. If it is clear and the error persists, the pickup roller needs cleaning or replacing.

## Buying from us

### Are your prices GST-inclusive?

Yes. The price you see is what you pay. Delivery is free anywhere in India, and the GST is shown separately on the invoice.

### Can I get a GST invoice for my business?

Yes. Enter your GSTIN at checkout and it appears on the tax invoice, so you can claim input credit. If you forgot to add it, call us before the parcel ships.

### How do I track my order?

The confirmation email has a tracking link — no account or password needed. If you have lost it, go to [/orders/](/orders/) and enter the email you ordered with; we will send the links again.

### What does the warranty cover?

The manufacturer's warranty, which is HP's, not ours — usually one year on printers and accessories, three years on some LaserJet models. It covers manufacturing defects. It does not cover damage from third-party ink, physical damage, or power surges. Keep the invoice; HP asks for it.

### Do you repair printers?

Yes, at the showroom, including models bought elsewhere. Bring the machine and the power cable. Call first with the model number so we can tell you whether the part is in stock.

---

**Not covered here?** Ask the assistant on this site, call **+91 98149 58295**, or come to SCO-12, 1st Floor, Sector 17-E, Chandigarh. Mon–Sat, 10am to 8pm.
`,
  },

  {
    slug: "hp-laserjet-2026-range-what-changes-for-indian-businesses",
    title: "HP's New LaserJet Range for 2026: What Actually Changes for Indian Businesses",
    metaDescription:
      "HP announced the LaserJet Pro 4000/4100 and Enterprise 5000/6000 series in March 2026, with quantum-resistant security and lower toner costs. What it means if you are buying now.",
    excerpt:
      "HP's March 2026 LaserJet announcement brought quantum-resistant security and 25% lower toner costs. Here is what is genuinely useful, and what to do if you are buying this quarter.",
    category: "News",
    tags: ["HP LaserJet", "Business", "2026", "Security", "News"],
    content: `HP announced a refreshed LaserJet line on **24 March 2026** — the **LaserJet Pro 4000 and 4100 Series** for small businesses, and the **LaserJet Enterprise 5000 and 6000 Series** for larger and managed environments.

Most printer announcements are noise. Two things in this one are worth a business buyer's attention, and one is worth rather less than the headline suggests.

## What is genuinely new

### Quantum-resistant security

HP is calling the Pro series the first SMB printer with quantum-resistant firmware protection, alongside tamper-resistant toner chips.

Worth being clear about what this is and is not. It is not protection against anything happening today. It is protection against a future in which a sufficiently capable quantum computer can break the signature algorithms currently used to verify printer firmware — the concern being that firmware signed today could be forged later, on a device with a ten-year service life.

If you are a bank, a hospital, a law firm, or anyone holding records with a long confidentiality requirement, that is a reasonable thing to buy ahead of. If you are a six-person office printing quotations, it should not change your purchase.

### Lower toner cost — about 25% on the Pro series

This one matters to everybody. Toner is the actual cost of owning a laser printer; the machine is the smaller half of the bill over its life.

A quick sense of scale using cartridges we stock today: HP 103A toner is ₹1,012 for around 1,500 pages, so about **67 paise a page**. Take 25% off the consumable and an office printing 1,000 pages a month saves roughly ₹2,000 a year. Over a five-year life that is more than the price difference between most models.

### Faster scanning, and redaction

The Enterprise models claim 50% faster document processing, scanning up to 200 images per minute, with AI-assisted OCR and automatic redaction of sensitive fields.

For a business that scans in bulk — a CA firm at year end, a clinic digitising records — that is a real saving in staff hours. For everyone else it is a feature you will use twice.

### Three-year warranty

Included on the new Pro series. Against the one year that is standard on most of the current range, this is a straightforward improvement and easy to forget in the spec sheet.

## Availability, honestly

- **Enterprise 5000/6000**: contract customers from March 2026, wider availability from June.
- **Pro 4000/4100**: from May 2026.

Global availability dates are not Indian shelf dates. Indian pricing, SKUs and channel stock follow separately, and a model announced in March can reach Chandigarh distributors considerably later. **We do not currently stock these models.** When we do, they will be on this site with real prices.

## If you are buying this quarter

Do not wait for a model you cannot buy yet, unless the security angle genuinely applies to your industry. The current range does the job:

- **Small office, mono, moderate volume** — [HP Laser MFP 1188a](/products/hp-laser-mfp-1188a/) at ₹18,849, or the networked [1188nw](/products/hp-laser-mfp-1188nw/) at ₹22,199 if more than one person needs it.
- **Higher volume, duplex, network** — [HP Laser MFP 323sdnw](/products/hp-laser-mfp-323sdnw/) at ₹24,999, 29 ppm with automatic two-sided printing.
- **Colour needed** — [HP Color LaserJet Pro 3203dw](/products/hp-color-laserjet-pro-3203dw/) at ₹32,799 runs 25 ppm in both black and colour, which is unusual at this price.
- **Colour with scanning** — [HP Color LaserJet Pro MFP 3303sdw](/products/hp-color-laserjet-pro-mfp-3303sdw/) at ₹48,970, and it already carries a three-year warranty.

All prices include GST, and delivery is free.

## The question worth asking instead

For most businesses the choice that saves real money is not which LaserJet generation, but **whether a laser is the right machine at all**. If you print colour regularly, an ink tank runs at roughly 10 paise a page against a laser's 60 to 70 — the difference dwarfs any generational improvement.

We work that out with people at the counter every week. Bring your monthly page count and we will do the arithmetic with you.

**Call +91 98149 58295**, or visit SCO-12, 1st Floor, Sector 17-E, Chandigarh.

---

*Announcement details from HP's press release of 24 March 2026. Specifications and availability are HP's and may change; prices quoted for current models are ours and are live on this site.*
`,
  },
];

const rows = articles.map((a) => ({
  ...a,
  readTime: readTime(a.content),
}));

for (const a of rows) {
  await sql`
    INSERT INTO blogs (slug, title, meta_description, excerpt, content, category,
                       author, published_at, read_time, tags, featured, status)
    VALUES (${a.slug}, ${a.title}, ${a.metaDescription}, ${a.excerpt}, ${a.content},
            ${a.category}, 'Jetage Team', current_date, ${a.readTime},
            ${JSON.stringify(a.tags)}::jsonb, false, 'published')
    ON CONFLICT (slug) DO UPDATE SET
      title = excluded.title, meta_description = excluded.meta_description,
      excerpt = excluded.excerpt, content = excluded.content,
      category = excluded.category, read_time = excluded.read_time,
      tags = excluded.tags, updated_at = now()
  `;
  console.log(`✓ ${a.slug} (${a.readTime}, ${a.content.length} chars)`);
}

const [{ n }] = await sql`SELECT count(*)::int AS n FROM blogs WHERE status = 'published'`;
console.log(`\n${n} published articles.`);
