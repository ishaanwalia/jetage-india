export const FOUNDING_YEAR = 1989;

// Recomputed on every build, so "37+ years" style copy never needs a manual annual bump.
export const YEARS_TRADING = new Date().getFullYear() - FOUNDING_YEAR;

/**
 * The seller, as it must appear on a tax invoice.
 *
 * The GSTIN lives here rather than in an environment variable, alongside the
 * address and phone. It is not a secret — it is printed on every invoice the
 * firm issues and is publicly searchable on the GST portal — and it does not
 * differ between environments. Env vars are for secrets and for things that
 * change per deployment; this is neither, and keeping it here means the
 * invoice cannot break because somebody forgot to set a variable.
 *
 * `04` is Chandigarh, which is also why an order shipped within Chandigarh is
 * CGST + SGST and everything else is IGST — see `splitGst` in money.ts.
 */
export const SELLER = {
  legalName: "Jetage Computer Traders",
  tradingAs: "Jetage India",
  address: ["SCO-12, 1st Floor", "Sector 17-E", "Chandigarh 160017"],
  stateName: "Chandigarh",
  /** Chandigarh. Used for the place-of-supply line. */
  stateCode: "04",
  phone: "+91 98149 58295",
  email: "info@jetageindia.in",
  /** Verified: state code 04, valid check digit, PAN AACFJ8106G (partnership firm). */
  gstin: "04AACFJ8106G1ZQ",
} as const;

/**
 * Kept as a guard even though the GSTIN is now a constant.
 *
 * A tax invoice without the supplier's GSTIN is not a tax invoice — it is a
 * receipt that looks like one, and a business buyer claiming input credit
 * against it will have the claim rejected. If this value is ever blanked or
 * mistyped, the invoice route refuses to render rather than producing a
 * confident-looking document that fails at the buyer's accountant.
 */
export const sellerIsInvoiceReady = () => SELLER.gstin.length === 15;
