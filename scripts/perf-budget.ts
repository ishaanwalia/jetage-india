/**
 * A ceiling on what each page makes the browser download.
 *
 * This site ships three.js, GSAP, framer-motion and a rigged GLB. One commit
 * took 1.7MB off the homepage; nothing at all stops the next one putting it
 * back, and the usual signal is gone: Next 16 on Turbopack no longer prints the
 * First Load JS table, so there is nothing in the build output to read. It
 * emits no `app-build-manifest.json` either, so there is no route-to-chunk map
 * to look up.
 *
 * What it does emit is the prerendered HTML for every static and SSG route, and
 * that HTML names its own scripts. So these numbers are not an estimate from a
 * manifest — they are the actual files the actual page asks for, gzipped, which
 * is what crosses the wire.
 *
 * Two budgets, because they catch different regressions:
 *
 *   - **Per route**, for every prerendered page. Catches a heavy import added
 *     to one screen. Dynamic routes (/order/<token>, admin) have no build-time
 *     HTML and so no per-route line; the total below covers them.
 *   - **Total client JS**, every chunk that ships. Catches the slow creep that
 *     a per-route average hides.
 *
 * Run after `npm run build`:
 *
 *     npm run perf
 *
 * Add `-- --update` to rewrite the budget from the current build, which is how
 * an increase gets accepted on purpose rather than by not noticing.
 *
 * Ported from the Black-Cord codebase, which hit the same wall with the same
 * Next version.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, relative, sep } from "node:path";

const NEXT = ".next";
const APP_DIR = join(NEXT, "server", "app");
const CHUNK_DIR = join(NEXT, "static", "chunks");
const BUDGET_FILE = "perf-budget.json";

/** How much may be added before this fails, over the recorded size. */
const TOLERANCE = 0.1;

type Budget = {
  tolerance: number;
  totalClientJs: number;
  routes: Record<string, number>;
};

const kb = (n: number) => (n / 1024).toFixed(1) + " kB";

function walk(dir: string, match: (f: string) => boolean): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, match));
    else if (match(entry.name)) out.push(full);
  }
  return out;
}

/** Gzipped bytes, cached — shared chunks appear in most routes. */
const sizeCache = new Map<string, number>();
function gzipOf(file: string): number {
  if (!sizeCache.has(file)) {
    sizeCache.set(
      file,
      existsSync(file) && statSync(file).isFile() ? gzipSync(readFileSync(file)).length : 0,
    );
  }
  return sizeCache.get(file)!;
}

/**
 * Every prerendered route, and the gzipped weight of the scripts its own HTML
 * asks for. A chunk shared by ten routes is counted in all ten, which is
 * correct: a cold visit to any one of them really does fetch it.
 */
function routeSizes(): Record<string, number> {
  const sizes: Record<string, number> = {};

  for (const html of walk(APP_DIR, (f) => f.endsWith(".html"))) {
    const route =
      "/" +
      relative(APP_DIR, html)
        .split(sep)
        .join("/")
        .replace(/\.html$/, "")
        .replace(/\(([^)]+)\)\//g, "") // route groups are not URL segments
        .replace(/^index$/, "");

    // Error pages are not navigated to, and their weight is not a regression
    // anyone can act on.
    if (/^\/_/.test(route)) continue;

    const source = readFileSync(html, "utf8");
    const refs = new Set(
      [...source.matchAll(/src="\/_next\/(static\/chunks\/[^"]+\.js)"/g)].map((m) => m[1]),
    );

    let total = 0;
    for (const ref of refs) total += gzipOf(join(NEXT, ...ref.split("/")));
    if (total > 0) sizes[route.replace(/\/$/, "") || "/"] = total;
  }

  return sizes;
}

/** Everything in the client chunk directory, gzipped. Covers dynamic routes. */
function totalClientJs(): number {
  return walk(CHUNK_DIR, (f) => f.endsWith(".js")).reduce((n, f) => n + gzipOf(f), 0);
}

function main() {
  if (!existsSync(APP_DIR)) {
    console.error(`No build found at ${APP_DIR}. Run \`npm run build\` first.`);
    process.exit(1);
  }

  const routes = routeSizes();
  const total = totalClientJs();
  const names = Object.keys(routes).sort();

  if (process.argv.includes("--update") || !existsSync(BUDGET_FILE)) {
    const budget: Budget = { tolerance: TOLERANCE, totalClientJs: total, routes };
    writeFileSync(BUDGET_FILE, JSON.stringify(budget, null, 2) + "\n");
    console.log(
      `Wrote ${BUDGET_FILE}: ${names.length} prerendered routes, ` +
        `${kb(total)} of client JS in total.`,
    );
    return;
  }

  const budget = JSON.parse(readFileSync(BUDGET_FILE, "utf8")) as Budget;
  const tol = budget.tolerance ?? TOLERANCE;
  const failures: string[] = [];
  const notes: string[] = [];

  const totalCeiling = budget.totalClientJs * (1 + tol);
  if (total > totalCeiling) {
    failures.push(
      `  ! total client JS${" ".repeat(22)}${kb(total)}  ` +
        `over its ${kb(totalCeiling)} ceiling by ${kb(total - totalCeiling)}`,
    );
  }

  for (const route of names) {
    const then = budget.routes[route];
    // A route added since the budget was written has nothing to break. It gets
    // recorded on the next --update rather than failing someone else's build.
    if (then === undefined) {
      notes.push(`  + ${route.padEnd(34)} ${kb(routes[route])}  (new, no budget yet)`);
      continue;
    }
    const ceiling = then * (1 + tol);
    if (routes[route] > ceiling) {
      failures.push(
        `  ! ${route.padEnd(34)} ${kb(routes[route])}  ` +
          `over its ${kb(ceiling)} ceiling by ${kb(routes[route] - ceiling)}`,
      );
    }
  }

  const gone = Object.keys(budget.routes).filter((r) => routes[r] === undefined);

  console.log(
    `Checked ${names.length} routes and ${kb(total)} of client JS ` +
      `against ${BUDGET_FILE} (tolerance ${Math.round(tol * 100)}%).`,
  );
  if (notes.length) console.log("\n" + notes.join("\n"));
  if (gone.length) console.log("\nNo longer prerendered:\n  " + gone.join("\n  "));

  if (failures.length) {
    console.error(
      `\nOver budget:\n${failures.join("\n")}\n\n` +
        `Find the weight, or accept it deliberately with:\n  npm run perf -- --update\n`,
    );
    process.exit(1);
  }

  console.log("\nWithin budget.");
}

main();
