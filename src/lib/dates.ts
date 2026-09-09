/**
 * Every date this site shows, rendered in IST.
 *
 * Not a style preference — a correctness one. `new Date(x).toLocaleDateString()`
 * formats in the *runtime's* timezone, which is IST on the machine this was
 * written on and **UTC on Vercel**. So an order placed at 01:30 on the 9th is
 * stored as 20:00 on the 8th UTC, and every server-rendered page prints the
 * 8th: the tax invoice, the sales register, the buyer's tracking page. Five and
 * a half hours of every day get filed under the day before, and it is invisible
 * in local development because the developer's clock is already IST.
 *
 * The business, its buyers, its invoices and its financial year are all in one
 * timezone. A server in another one must not change what a date says.
 *
 * No `server-only` import: the admin tables that render dates are client
 * components, and pulling this from a module that touches the database would
 * drag the Neon driver into the browser bundle.
 */

export const IST = "Asia/Kolkata";

type Dateish = string | number | Date;

/** "9 Sep 2026" by default; pass options for anything else. */
export function formatDate(
  value: Dateish,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
): string {
  return new Intl.DateTimeFormat("en-IN", { timeZone: IST, ...options }).format(new Date(value));
}

/** "9 Sep 2026, 01:30 am". The admin timeline and the buyer's event list. */
export function formatDateTime(
  value: Dateish,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  },
): string {
  return formatDate(value, options);
}

/**
 * "09/09/2026" — the form both tax documents use.
 *
 * Its own function rather than options at each call site, because the invoice
 * and the sales register have to agree: they are two renderings of the same
 * sale and an officer reads them side by side.
 */
export function formatTaxDate(value: Dateish): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: IST,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * The calendar year and month a moment falls in, in IST.
 *
 * `en-CA` because it is the locale that formats as `YYYY-MM`, which parses
 * without ambiguity. Used by the financial year, where being one day out is
 * being one *series* out.
 */
export function istYearMonth(d: Date): { year: number; month: number } {
  const [year, month] = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
  })
    .format(d)
    .split("-")
    .map(Number);
  return { year, month };
}
