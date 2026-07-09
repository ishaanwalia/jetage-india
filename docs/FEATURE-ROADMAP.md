# Jetage India — Feature Research & Design Strategy

*Research date: July 2026. Benchmarked against Skiper UI, Vengeance UI, Zera Software Studio, UI/UX Pro Max, Emergent, Draftly, and Lovable, plus current Awwwards e-commerce winners.*

---

## 1. Where the site stands today

**Strengths already in place**
- Strong motion foundation: GSAP + ScrollTrigger, Framer Motion, React Three Fiber, magnetic buttons, scramble text, horizontal scroll, cinematic loader.
- Real commerce plumbing: 47-product catalog with rich specs, search ("/" shortcut), filters, sort, cart → WhatsApp order flow, Product + Breadcrumb JSON-LD, Google Merchant feed, sitemap, blogs.
- A genuinely rare brand asset: **authorized HP partner since 1989 — 37 years of trust in Sector 17, Chandigarh**. Most competitors cannot say this.

**Honest gaps (what a ₹40-lakh agency would flag on day one)**
1. **Effect density over hierarchy.** Particles + 3D hero + 3D stats + 3D categories + horizontal scroll + marquee all on one page competes with itself. Award-winning 2026 sites use *one* signature moment per page and restraint everywhere else — "interaction should reward curiosity, not scream for attention."
2. **No decision-support tools.** Printers are a considered purchase. The site shows specs but doesn't help a confused buyer *choose* — no finder, no comparison, no running-cost math.
3. **No repeat-purchase engine.** Ink/toner is the recurring revenue in the printer business, but there's no "find supplies for my printer" flow.
4. **Trust is asserted, not shown.** "Since 1989" appears as text; there's no story, no Google reviews, no faces.
5. **Everything ends at one generic WhatsApp message.** The highest-intent moments (comparing, calculating, reading a spec) don't produce context-rich leads.

---

## 2. The strategy in one line

> **Stop decorating the catalog. Start engineering decisions.**
> Keep one cinematic signature moment per page; spend the rest of the budget on tools that move a buyer from "confused" to "convinced" — and route every tool's output into a pre-filled WhatsApp conversation.

---

## 3. Feature portfolio

### Tier 1 — Conversion engines (build first, highest ROI)

**1.1 Printer Finder — "Answer 5 questions, meet your printer"**
A full-screen, animated quiz (home/office → colour vs mono → pages per month → connectivity → budget) that scores the catalog and presents top-3 matches with a *why* explanation. Ends in "Order on WhatsApp" with the quiz answers embedded in the message, so the shop owner receives a qualified lead, not "hi price?".
- *Design*: card-swipe transitions (Skiper-style), progress rail, results reveal with staggered spring physics.
- *Build*: pure client-side scoring over `products.ts`. No backend. ~2–3 days.

**1.2 True Cost Calculator — cost-per-page over 3 years**
Interactive sliders (pages/month, colour share) → animated chart comparing Smart Tank vs InkJet vs Laser total cost of ownership including ink. Nobody in the Indian printer retail space does this well; it is the single most persuasive argument for the high-margin Smart Tank line.
- *Design*: count-up numbers, animated area chart, "you save ₹X" headline morph.
- *Build*: static cost table per subcategory + one chart component. ~2 days.

**1.3 Compare Tray — pick 2–3, see them side-by-side**
"Compare" toggle on every product card feeds a sticky bottom tray; the compare view highlights winning specs per row and deep-links (`/compare?p=a,b,c`) so staff can send comparison links on WhatsApp.
- *Build*: context + one route, reuse `specs` records. ~2–3 days.

**1.4 Supplies Finder — "Which ink does my printer take?"**
Type a printer model (or scan the list) → compatible cartridges/bottles with one-tap reorder via WhatsApp. Turns one-time buyers into repeat customers and is a strong SEO surface ("HP 682 compatible printers").
- *Build*: add a `compatibleWith[]` field on consumable products. ~2 days.

### Tier 2 — Trust & story (the ₹40-lakh look)

**2.1 "Since 1989" heritage scrollytelling page**
A pinned, scroll-driven timeline: 1989 shop photo → HP partnership → today's showroom, with era-styled art direction per chapter. This is the emotional moat; Awwwards e-commerce winners in 2026 are winning with exactly this kind of cinematic narrative (emotionally resonant design measurably raises perceived value).

**2.2 Live Google Reviews wall + faces**
Pull real Google Maps reviews (static snapshot is fine), show reviewer initials/photos, star aggregate in Review JSON-LD. Replace invented-feeling testimonials with verifiable ones.

**2.3 Flagship product scrollytelling ("story pages")**
For the 3–4 hero printers: pinned scroll sections with hotspot annotations on large product imagery (Mammut-style "micro-explanations") — tap the ADF, the ink tank, the duplexer and get a one-line benefit.

**2.4 Showroom "Visit us" upgrade**
Reserve-in-showroom CTA ("Reserve it — pick it up today at SCO-12"), staff photos, parking/landmark micro-guide. Local buyers are the core customer; make the offline bridge first-class.

### Tier 3 — Signature interactions (polish, applied with restraint)

- **⌘K / "/" global command palette** — products, blogs, actions, WhatsApp; extends the existing "/" shortcut site-wide. The single highest-perceived-quality micro-feature per hour of work.
- **Shared-element page transitions** — product image morphs from grid card into the detail page (Next.js View Transitions). Replaces "flashy" with "seamless".
- **Add-to-cart flight animation** — product thumbnail arcs into the cart icon with a spring; cart badge pulses.
- **Lenis smooth scrolling + scroll progress** — unifies the feel of all existing GSAP work.
- **`prefers-reduced-motion` support everywhere** — a professional non-negotiable the site currently lacks.
- **Homepage motion diet** — keep the 3D hero as *the* signature moment; demote particles + 3D stats + 3D categories to subtle reveals. Faster LCP, calmer luxury feel.

### Tier 4 — Frontier bets (differentiators for later)

- **"Jet" AI printer advisor** — a Claude-powered chat grounded on the catalog + blogs; answers "which printer for a school office ~2000 pages/month?" and hands off to WhatsApp with full conversation context. (This is the Emergent/Lovable-era table stakes for 2026-native retail.)
- **WebAR "See it on your desk"** — `<model-viewer>` AR for the printers that already have GLB assets; no app install.
- **PWA + offline catalog** — installable, fast repeat visits for the WhatsApp-first mobile audience.
- **B2B bulk-quote portal** — GST-invoice messaging, quantity tiers, "request quote" that emails + WhatsApps a structured RFQ.

---

## 4. SEO & content multipliers (compounds everything above)

- Comparison landing pages: "Smart Tank vs Laser for small office", "Best HP printer under ₹15,000" — each embeds the Cost Calculator and Finder.
- City pages: printer dealer Chandigarh / Mohali / Panchkula (the showroom is the proof).
- FAQ schema on product pages from existing spec data; Review schema once 2.2 ships.
- Supplies-compatibility pages from 1.4 ("Inks for HP Smart Tank 524").

---

## 5. Suggested build order

| Phase | Ships | Effort |
|---|---|---|
| 1. Decide | Printer Finder, Compare Tray, Cost Calculator | ~1–2 weeks |
| 2. Trust | Heritage page, Google reviews wall, reduced-motion + motion diet | ~1 week |
| 3. Seamless | Command palette, view transitions, cart flight, Lenis | ~1 week |
| 4. Repeat | Supplies Finder + compatibility SEO pages | ~1 week |
| 5. Frontier | AI advisor, WebAR, PWA, B2B quotes | as demand proves |

**Guiding metric per phase:** WhatsApp conversations started per 100 sessions — every feature above is designed to raise it, with richer context per message.
