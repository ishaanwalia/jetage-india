/**
 * The Indian financial year a date falls in, as "26-27".
 *
 * April to March, so anything before April belongs to the year that started
 * the previous calendar April. The GST invoice series restarts each FY, and
 * this is what makes it restart by itself rather than needing somebody to
 * remember every 1st of April.
 *
 * Pure and import-free so it can be tested without pulling in the database.
 */
export function financialYear(d = new Date()): string {
  const y = d.getFullYear();
  const startYear = d.getMonth() >= 3 ? y : y - 1; // getMonth: 3 = April
  return `${String(startYear).slice(-2)}-${String(startYear + 1).slice(-2)}`;
}
