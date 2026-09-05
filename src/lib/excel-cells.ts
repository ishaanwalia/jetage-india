import type ExcelJS from "exceljs";

/**
 * Reading and coercing spreadsheet cells.
 *
 * Kept out of `excel.ts` — which imports `server-only` because it touches the
 * database — so the fiddly parts can be tested without a database or a
 * network. Everything here is pure.
 */

/**
 * Read a cell as text, whatever Excel decided to store in it.
 *
 * The `richText` branch is not theoretical. The moment anyone pastes a
 * description in from Word, or bolds one word inside a cell, Excel stops
 * storing a string and stores an array of formatted runs. Without this,
 * `String(value)` yields the literal text `[object Object]` — and since the
 * importer writes back what it read, that string lands on the product page.
 */
export const cellText = (v: ExcelJS.CellValue): string => {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") {
    if (v instanceof Date) return v.toISOString();
    if ("richText" in v && Array.isArray(v.richText)) {
      return v.richText.map((r) => r?.text ?? "").join("").trim();
    }
    // A hyperlink cell: Excel stores {text, hyperlink}.
    if ("text" in v) return String(v.text ?? "").trim();
    // A formula cell: we want what it evaluated to, not the formula.
    if ("result" in v) return String(v.result ?? "").trim();
    if ("error" in v) return "";
  }
  return String(v).trim();
};

/**
 * Flatten a cell into one paragraph.
 *
 * Descriptions get typed in Excel, where Alt+Enter is how people break a line,
 * and pasted copy arrives carrying whatever whitespace it had in Word —
 * newlines, tabs, non-breaking spaces, double spaces after a full stop. All of
 * that would otherwise reach the product page verbatim, so the same product
 * reads differently depending on who typed it and what they copied from.
 */
export const paragraph = (s: string): string =>
  s
    // Exotic spaces first: \s matches neither a non-breaking nor a zero-width
    // space, and both arrive routinely in text pasted from Word or the web.
    .replace(/[  -​ 　]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * A rupee amount as a whole number, or null if the cell is not a price.
 *
 * People type "₹25,227", "25227.00" and "25,227 /-" into price columns.
 * Rejecting those would be technically correct and useless. The catalogue
 * stores whole rupees, so this rounds rather than truncating — truncating
 * would quietly shave a rupee off anything with paise in it.
 */
export const rupees = (raw: string): number | null => {
  if (!raw) return null;
  const cleaned = raw.replace(/[₹,\s]/g, "").replace(/\/-$/, "");
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
};

/**
 * A yes/no cell.
 *
 * Excel turns a typed "TRUE" into a boolean and "y" into a string, and people
 * type "Yes", "1", "✓" and "no" interchangeably. Anything unrecognised returns
 * the fallback rather than silently reading as false — flipping a product to
 * draft because someone typed "Y " is not a failure mode worth having.
 */
export const yesNo = (raw: string, fallback: boolean): boolean => {
  const s = raw.trim().toLowerCase();
  if (["yes", "y", "true", "1", "✓", "on"].includes(s)) return true;
  if (["no", "n", "false", "0", "", "off", "-"].includes(s)) return false;
  return fallback;
};

/**
 * A pipe-separated list cell into an array.
 *
 * Pipes rather than newlines because a layman editing two dozen columns should
 * not have to know Alt+Enter, and a newline inside a cell is invisible at these
 * column widths.
 *
 * **The separator is space-pipe-space, not a bare pipe.** A real spec value in
 * this catalogue reads `Compatibility: PC, PS5, Xbox Series X|S` — splitting on
 * a bare `|` tore that in half and silently dropped the remainder on a
 * round trip that changed nothing. Requiring the spaces is what the sheet
 * writes anyway, and an unsplit item is a visible, fixable mistake where lost
 * text is not.
 */
export const list = (raw: string): string[] =>
  raw
    .split(/ \| |\n/)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * The specs cell into a key/value map.
 *
 * Written as `Label: value | Label: value`. A segment with no colon is skipped
 * rather than stored under an empty key — a stray pipe should not create a
 * blank row in the spec table on the product page.
 */
export const specMap = (raw: string): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const part of list(raw)) {
    const at = part.indexOf(":");
    if (at < 1) continue;
    const key = part.slice(0, at).trim();
    const value = part.slice(at + 1).trim();
    if (key && value) out[key] = value;
  }
  return out;
};

/** The inverse of `specMap`, for building the sheet. */
export const specText = (specs: Record<string, string> | null | undefined): string =>
  Object.entries(specs ?? {})
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");
