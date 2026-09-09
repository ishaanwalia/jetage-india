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

/**
 * For the shop: whole rupees stay clean, so ₹25,227 does not read as
 * ₹25,227.00 on every product card and in every cart line.
 */
export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

/**
 * For the tax invoice: always two decimals.
 *
 * The shop formatter drops a trailing zero, which put "CGST ₹1,924.1"
 * immediately above "SGST ₹1,924.09" on a document a buyer's accountant
 * reads. Two halves of the same tax, formatted differently, look like a
 * mistake even though they add up. Money on a legal document is written to
 * the paise or not at all.
 */
export function formatPaiseExact(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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
  /**
   * Snapshotted from the product at the sale, blank when none is set.
   *
   * Optional because the browser cart builds these lines for display without
   * ever seeing an HSN — only the server-priced items, which is what an order
   * is actually written from, carry one.
   */
  hsn?: string;
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

/* ------------------------------------------------------ per-line reporting -- */

export interface LineTax {
  /** GST-exclusive value of the line. */
  taxablePaise: number;
  /** The line's share of the order's GST. */
  gstPaise: number;
}

/**
 * Split an order's GST across its own lines.
 *
 * Rule 46 wants the taxable value, the rate and the amount of tax *per item*,
 * not just an order-level summary — and the sales register needs the same
 * numbers so the two documents can be read side by side without disagreeing.
 *
 * Apportioned from the order's stored GST rather than recomputed line by line.
 * Recomputing rounds each line independently and the roundings do not have to
 * add back up: an invoice whose tax column sums to a paise more than its own
 * total is the kind of thing that gets a set of books questioned. So every line
 * but the last is rounded by value, and the last takes whatever remains — the
 * column reconciles to the order exactly, by construction.
 *
 * The residual lands on the last line because it is the only choice that needs
 * no explanation: it is at most a paise or two, and it is where the eye stops.
 */
export function apportionGst(lineTotalsPaise: number[], gstPaise: number): LineTax[] {
  const subtotal = lineTotalsPaise.reduce((sum, n) => sum + n, 0);
  if (subtotal <= 0) {
    return lineTotalsPaise.map(() => ({ taxablePaise: 0, gstPaise: 0 }));
  }

  let allocated = 0;
  return lineTotalsPaise.map((lineTotal, i) => {
    const last = i === lineTotalsPaise.length - 1;
    const gst = last
      ? gstPaise - allocated
      : Math.round((gstPaise * lineTotal) / subtotal);
    allocated += gst;
    return { taxablePaise: lineTotal - gst, gstPaise: gst };
  });
}

/* --------------------------------------------------------- amount in words -- */

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function under1000(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : "");
  return `${ONES[Math.floor(n / 100)]} Hundred` + (n % 100 ? ` ${under1000(n % 100)}` : "");
}

/**
 * The total, spelled out, as every Indian invoice carries it.
 *
 * Lakh and crore, not millions — groups after the first three digits are two
 * wide, which is why this cannot be the usual thousands recursion. It is there
 * so that a figure cannot be altered by a pen stroke after the fact, which is
 * also why it belongs on the document even though nothing reads it.
 */
export function amountInWords(paise: number): string {
  const negative = paise < 0;
  const abs = Math.abs(Math.round(paise));
  const rupees = Math.floor(abs / 100);
  const paisa = abs % 100;

  const parts: string[] = [];
  const crore = Math.floor(rupees / 10_000_000);
  const lakh = Math.floor((rupees % 10_000_000) / 100_000);
  const thousand = Math.floor((rupees % 100_000) / 1000);
  const rest = rupees % 1000;

  if (crore) parts.push(`${under1000(crore)} Crore`);
  if (lakh) parts.push(`${under1000(lakh)} Lakh`);
  if (thousand) parts.push(`${under1000(thousand)} Thousand`);
  if (rest) parts.push(under1000(rest));

  const whole = parts.length ? parts.join(" ") : "Zero";
  const tail = paisa ? ` and ${under1000(paisa)} Paise` : "";
  return `${negative ? "Minus " : ""}Rupees ${whole}${tail} Only`;
}
