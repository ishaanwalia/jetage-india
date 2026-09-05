/**
 * The spreadsheet edge cases, which are all about what real people and real
 * copies of Excel actually put in a cell. Run with: npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { cellText, paragraph, rupees, yesNo, list, specMap, specText } from "./excel-cells";

test("rich text does not become [object Object]", () => {
  // What Excel stores the moment someone bolds a word or pastes from Word.
  const rich = { richText: [{ text: "Wide-format " }, { text: "A3", font: { bold: true } }] };
  assert.equal(cellText(rich as never), "Wide-format A3");
  // The bug this guards: String(v) on that object.
  assert.notEqual(cellText(rich as never), "[object Object]");
});

test("formula and hyperlink cells read as their value", () => {
  assert.equal(cellText({ formula: "A1*2", result: 25227 } as never), "25227");
  assert.equal(cellText({ text: "HP 680", hyperlink: "https://hp.com" } as never), "HP 680");
  assert.equal(cellText({ error: "#REF!" } as never), "");
  assert.equal(cellText(null), "");
  assert.equal(cellText(undefined), "");
});

test("paragraph collapses the whitespace Word brings with it", () => {
  // Non-breaking space, newline, tab, double space — \s misses the first.
  assert.equal(paragraph("A3 wide-format printer"), "A3 wide-format printer");
  assert.equal(paragraph("Line one\nLine two"), "Line one Line two");
  assert.equal(paragraph("Too   many    spaces."), "Too many spaces.");
  assert.equal(paragraph("  trimmed  "), "trimmed");
});

test("prices survive the way people actually type them", () => {
  assert.equal(rupees("25227"), 25227);
  assert.equal(rupees("₹25,227"), 25227);
  assert.equal(rupees("25,227 /-"), 25227);
  assert.equal(rupees("25227.00"), 25227);
  // Rounds rather than truncating — truncating shaves a rupee off silently.
  assert.equal(rupees("968.60"), 969);
  assert.equal(rupees("968.40"), 968);
});

test("a price that is not a price returns null, never zero", () => {
  // Returning 0 here would set a product's price to nothing and it would sell
  // for free. null lets the importer reject the row instead.
  assert.equal(rupees("call for price"), null);
  assert.equal(rupees(""), null);
  assert.equal(rupees("-500"), null);
  assert.equal(rupees("12,3,4x"), null);
});

test("yes/no accepts what people type, and falls back rather than guessing", () => {
  assert.equal(yesNo("Yes", false), true);
  assert.equal(yesNo("TRUE", false), true);
  assert.equal(yesNo("1", false), true);
  assert.equal(yesNo("no", true), false);
  assert.equal(yesNo("", true), false);
  // Unrecognised keeps the current value: a stray character must not quietly
  // unpublish a product.
  assert.equal(yesNo("maybe", true), true);
  assert.equal(yesNo("maybe", false), false);
});

test("lists split on space-pipe-space, and on newlines", () => {
  assert.deepEqual(list("Wi-Fi | Ethernet | USB"), ["Wi-Fi", "Ethernet", "USB"]);
  assert.deepEqual(list("Wi-Fi\nEthernet"), ["Wi-Fi", "Ethernet"]);
  assert.deepEqual(list(""), []);
});

test("a pipe inside a value is not a separator", () => {
  // A real spec value from this catalogue. Splitting on a bare pipe tore it in
  // half and silently dropped the remainder — on an import that changed
  // nothing. Caught by round-tripping the live sheet with no edits.
  assert.deepEqual(
    list("Compatibility: PC, PS5, Xbox Series X|S | Weight: 87g"),
    ["Compatibility: PC, PS5, Xbox Series X|S", "Weight: 87g"],
  );
  assert.deepEqual(specMap("Compatibility: PC, Xbox Series X|S | Weight: 87g"), {
    Compatibility: "PC, Xbox Series X|S",
    Weight: "87g",
  });
});

test("specs round-trip through the sheet unchanged", () => {
  const specs = { "Print Speed": "22 ppm", Functions: "Print, Scan, Copy" };
  const text = specText(specs);
  assert.equal(text, "Print Speed: 22 ppm | Functions: Print, Scan, Copy");
  // A value containing a comma must survive, which is why this is not CSV.
  assert.deepEqual(specMap(text), specs);
});

test("a malformed spec segment is skipped, not stored blank", () => {
  const out = specMap("Speed: 22 ppm | just-a-stray-value | : orphaned | Duplex: Auto");
  assert.deepEqual(out, { Speed: "22 ppm", Duplex: "Auto" });
});
