# Jetage India — SEO & Google Publishing Playbook

Everything the code can do automatically is already built in. This doc covers the
account-level steps only you can do (each takes 5–15 minutes).

## What the site already ships (automatic)

| Asset | URL | Purpose |
|---|---|---|
| Sitemap (all 67 pages) | `https://www.jetageindia.in/sitemap.xml` | Google indexing of every product, blog, and page |
| Google Merchant feed (47 products) | `https://www.jetageindia.in/merchant-feed.xml` | Free product listings on Google Shopping |
| Product JSON-LD schema | every `/products/…/` page | Rich results (price, availability, stars) in Google Search |
| BlogPosting JSON-LD schema | every `/blogs/…/` page | Article rich results |
| Breadcrumb JSON-LD | product + blog pages | Breadcrumb trails in search results |
| LocalBusiness/Organization schema | all pages | Knowledge panel / local pack |

## 1. Post all products on Google (Merchant Center) — one-time setup

1. Go to https://merchants.google.com and sign in with the business Google account.
2. Create account → business name "Jetage India", country India, currency INR.
3. Verify and claim `https://www.jetageindia.in` (use the "HTML tag" method — the
   Google site verification tag `J7ndhmWvNH0vCWxCUU47KQPyBZsZ3sidauaZ3CUhdBc` is
   already in the site's metadata, so verification should pass instantly).
4. Products → Feeds → Add primary feed → "Scheduled fetch" →
   feed URL: `https://www.jetageindia.in/merchant-feed.xml`, daily fetch.
5. Enable "Free listings". All 47 products will appear in the Google Shopping tab
   within a few days. (Paid Shopping ads are optional and use the same feed.)

The feed regenerates on every deploy from `src/lib/data/products.ts`, so price or
stock edits flow to Google automatically after the next fetch.

## 2. Google Search Console — submit the sitemap

1. https://search.google.com/search-console → property `https://www.jetageindia.in`
   (verification tag already on the site).
2. Sitemaps → enter `sitemap.xml` → Submit.
3. After a day, check Pages → Indexing to confirm the 47 product and 8 blog URLs are indexed.

## 3. Google Business Profile — products & posts

1. https://business.google.com → claim/open the "Jetage Computer Traders" listing
   (SCO-12, 1st Floor, Sector-17-E, Chandigarh).
2. Under **Products**, add the top sellers (name, photo from `/public/products/`,
   price, link to the product page). Google shows these directly on Maps and the
   business panel in Search.
3. Under **Posts**, publish one blog per week: paste the blog excerpt + link to the
   full article. This is the fastest local-SEO win available.

## 4. Off-page blog syndication (backlinks)

Republish the 8 existing blogs from `src/lib/data/blogs.ts` on:

- **Medium** (medium.com) — use "Import a story" with the live blog URL; Medium sets
  `rel=canonical` back to jetageindia.in automatically, so no duplicate-content penalty.
- **LinkedIn Articles** — paste the intro (first 3–4 paragraphs) + "Read the full
  guide" link to the site. Post from the company page.
- **Quora / Reddit (r/india, r/Chandigarh)** — answer printer-buying questions and
  link the relevant guide. Only where genuinely helpful; spam gets removed.
- **Justdial / IndiaMART / Sulekha** listings — keep NAP (name, address, phone)
  identical to the site: `Jetage Computer Traders, SCO-12, 1st Floor, Sector-17-E,
  Chandigarh 160017, +91 98149 58295`. Consistent citations boost local rank.

Priority order for effort: Business Profile posts > Merchant Center > Medium
syndication > directory citations.

## 5. Ongoing

- New product → add to `products.ts`; sitemap + feed + schema update on deploy.
- New blog → add to `blogs.ts`; same.
- Keep the `aggregateRating` in `src/app/layout.tsx` honest — it must reflect real,
  visible reviews (currently 4.5/1200; update as your Google reviews change).
