import { istYearMonth } from "./dates";

/**
 * The Indian financial year a date falls in, as "26-27".
 *
 * April to March, so anything before April belongs to the year that started
 * the previous calendar April. The GST invoice series restarts each FY, and
 * this is what makes it restart by itself rather than needing somebody to
 * remember every 1st of April.
 *
 * Read in IST, not in the server's timezone. `getMonth()` would answer in UTC
 * on Vercel, and the one moment that has to be right is the one this is for:
 * an order paid at 01:00 IST on 1 April is 19:30 on 31 March in UTC, so the
 * series would not restart and the year's first invoice would be numbered into
 * the year that just closed. A hole in one series and a stray number in
 * another, once a year, at the only boundary anyone audits.
 */
export function financialYear(d = new Date()): string {
  const { year, month } = istYearMonth(d);
  const startYear = month >= 4 ? year : year - 1;
  return `${String(startYear).slice(-2)}-${String(startYear + 1).slice(-2)}`;
}
