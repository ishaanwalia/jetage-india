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
