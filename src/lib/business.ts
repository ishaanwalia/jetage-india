export const FOUNDING_YEAR = 1989;

// Recomputed on every build, so "37+ years" style copy never needs a manual annual bump.
export const YEARS_TRADING = new Date().getFullYear() - FOUNDING_YEAR;

/**
 * The seller, as it must appear on a tax invoice.
 *
 * `gstin` comes from the environment and there is no default. A tax invoice
 * without the supplier's GSTIN is not a tax invoice — it is a receipt that
 * looks like one, and a business buyer who tries to claim credit against it
 * will have the claim rejected. So the invoice route refuses to render at all
 * until this is set, rather than producing a confident-looking document that
 * fails at the buyer's accountant.
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
  gstin: process.env.SELLER_GSTIN ?? "",
} as const;

export const sellerIsInvoiceReady = () => SELLER.gstin.length === 15;
