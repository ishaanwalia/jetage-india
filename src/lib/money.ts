/**
 * Money. Pure arithmetic, no imports — so the checkout UI can format a total
 * in the browser using the exact code that computed it on the server.
 *
 * Everything is integer paise. The catalogue stores whole rupees; the ×100
 * happens once, at order creation, and Razorpay charges in paise, so no float
 * ever touches a price.
 */

/** Catalogue prices are GST-inclusive, so this is the tax *contained in* a total. */
export const GST_RATE = 0.18;

/**
 * The tax already inside a GST-inclusive amount.
 *
 * Note this is not `total × 0.18` — that computes 18% *of* the inclusive
 * figure and overstates the tax. ₹1,180 inclusive contains ₹180, not ₹212.40.
 */
export function gstContainedIn(totalPaise: number): number {
  return Math.round(totalPaise - totalPaise / (1 + GST_RATE));
}

export const rupeesToPaise = (rupees: number) => Math.round(rupees * 100);

export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

/**
 * Where Jetage supplies from. Chandigarh is a union territory, so an
 * intra-UT sale is CGST + UTGST — which is filed and rendered exactly like
 * CGST + SGST, at the same 9 + 9. The distinction matters for the wording on
 * the invoice, not the arithmetic.
 */
export const SUPPLY_STATE = "Chandigarh";

export interface GstSplit {
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  intraState: boolean;
}

/**
 * Splits the tax into the lines an Indian invoice must actually show.
 *
 * Same total either way — but a Chandigarh buyer gets CGST 9% + SGST/UTGST 9%,
 * and anyone outside gets a single IGST 18% line. Showing the wrong pair makes
 * the invoice non-compliant and breaks the buyer's input credit, so this is
 * driven by the delivery state rather than assumed.
 */
export function splitGst(gstPaise: number, shipState: string): GstSplit {
  const intraState = shipState.trim().toLowerCase() === SUPPLY_STATE.toLowerCase();
  if (!intraState) return { cgstPaise: 0, sgstPaise: 0, igstPaise: gstPaise, intraState: false };
  // An odd paise goes to CGST so the halves still sum to the total exactly.
  const half = Math.floor(gstPaise / 2);
  return { cgstPaise: gstPaise - half, sgstPaise: half, igstPaise: 0, intraState: true };
}

export interface OrderItem {
  productId: string | null;
  sku: string;
  name: string;
  image: string;
  qty: number;
  unitPricePaise: number;
  lineTotalPaise: number;
}

export interface OrderTotals {
  subtotalPaise: number;
  gstPaise: number;
  shippingPaise: number;
  totalPaise: number;
}

/**
 * Catalogue prices are the final amount: GST is already inside them and
 * shipping is free. The total is therefore the sum of the lines, and GST is
 * reported rather than added. If a delivery charge is ever introduced it is
 * added here, and nowhere else.
 */
export function totalsFor(items: OrderItem[]): OrderTotals {
  const subtotal = items.reduce((sum, i) => sum + i.lineTotalPaise, 0);
  const shipping = 0;
  const total = subtotal + shipping;
  return {
    subtotalPaise: subtotal,
    gstPaise: gstContainedIn(total),
    shippingPaise: shipping,
    totalPaise: total,
  };
}
