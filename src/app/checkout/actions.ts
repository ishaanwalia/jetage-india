"use server";

import { after } from "next/server";
import {
  priceCart,
  totalsFor,
  createOrder,
  attachRazorpayOrder,
  recentOrderCount,
  type CartLine,
  type ShipAddress,
} from "@/lib/orders";
import { createRazorpayOrder, razorpayConfigured, razorpayKeyId } from "@/lib/razorpay";
import { notifyOrderPlaced } from "@/lib/order-mail";

/**
 * Places an order.
 *
 * The cart arrives from localStorage, so nothing in it is trusted except the
 * product ids and quantities. Prices, names and SKUs are read back from the
 * database by `priceCart`, and the amount sent to Razorpay is computed from
 * those — never from a number the browser supplied.
 *
 * The order row is written *before* Razorpay is called. If order creation at
 * Razorpay then fails, we still have a pending order with the buyer's contact
 * details and the counter can call them. The reverse order would lose the sale
 * entirely.
 */

export type CheckoutResult =
  | {
      ok: true;
      mode: "razorpay";
      orderNo: string;
      publicToken: string;
      amountPaise: number;
      razorpayOrderId: string;
      razorpayKeyId: string;
      customerName: string;
      email: string;
      phone: string;
    }
  | { ok: true; mode: "offline"; orderNo: string; publicToken: string; amountPaise: number }
  | { ok: false; error: string };

const isPincode = (v: string) => /^[1-9][0-9]{5}$/.test(v);
const isPhone = (v: string) => /^[6-9][0-9]{9}$/.test(v.replace(/[^0-9]/g, "").slice(-10));
const isEmail = (v: string) => /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(v);

/**
 * GSTIN: 2-digit state code, 10-character PAN, entity digit, 'Z', checksum.
 *
 * Shape only — this cannot tell you the number belongs to the person typing
 * it, and it is not validated against the GST portal. It catches a typo before
 * the number reaches an invoice, which is what it is for.
 */
const isGstin = (v: string) =>
  /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v);

/** One buyer, one hour. Past this the counter should be phoning them anyway. */
const MAX_ORDERS_PER_HOUR = 6;

export async function placeOrder(input: {
  cart: CartLine[];
  name: string;
  email: string;
  phone: string;
  address: ShipAddress;
  note?: string;
  gstin?: string;
}): Promise<CheckoutResult> {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const phone = (input.phone ?? "").replace(/[^0-9]/g, "").slice(-10);
  const gstin = (input.gstin ?? "").trim().toUpperCase();

  // Validated here rather than only in the browser: this is a server action,
  // reachable without the form.
  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!isEmail(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!isPhone(phone)) return { ok: false, error: "Please enter a valid 10-digit mobile number." };

  const address: ShipAddress = {
    line1: input.address?.line1?.trim() ?? "",
    line2: input.address?.line2?.trim() || undefined,
    city: input.address?.city?.trim() ?? "",
    state: input.address?.state?.trim() ?? "",
    pincode: (input.address?.pincode ?? "").replace(/[^0-9]/g, ""),
  };
  if (address.line1.length < 5) return { ok: false, error: "Please enter a delivery address." };
  if (!address.city) return { ok: false, error: "Please enter your city." };
  if (!address.state) return { ok: false, error: "Please select your state." };
  if (!isPincode(address.pincode)) return { ok: false, error: "Please enter a valid 6-digit PIN code." };

  // Optional — but if they typed something, it goes on a tax invoice, so a
  // malformed one is rejected rather than quietly saved.
  if (gstin && !isGstin(gstin)) {
    return { ok: false, error: "That GSTIN doesn't look right. Check it, or leave it blank." };
  }

  // Throttle on the email, which is already on the order — rate-limiting by IP
  // would mean storing an IP, and that is personal data we would then have to
  // disclose and retain.
  if ((await recentOrderCount(email)) >= MAX_ORDERS_PER_HOUR) {
    return {
      ok: false,
      error: "That's a lot of orders in one hour. Please call us on +91 98149 58295 and we'll sort it out.",
    };
  }

  const requested = input.cart ?? [];
  const items = await priceCart(requested);
  if (items.length === 0) {
    return { ok: false, error: "Your cart is empty, or those products are no longer available." };
  }

  // `priceCart` drops anything it cannot find or that has been unpublished. If
  // that happened, stop — charging less than the cart displayed, without
  // saying which line vanished, is worse than making them look again.
  const distinctRequested = new Set(requested.map((l) => l.productId)).size;
  if (items.length < distinctRequested) {
    return {
      ok: false,
      error:
        "One or more items in your cart are no longer available. Please review your cart and try again.",
    };
  }
  const totals = totalsFor(items);
  if (totals.totalPaise <= 0) return { ok: false, error: "Cart total came to zero." };

  const order = await createOrder({
    items,
    totals,
    email,
    phone,
    customerName: name,
    shipAddress: address,
    note: input.note?.trim() || undefined,
    buyerGstin: gstin || null,
  });

  // Email goes out AFTER the response, not before it.
  //
  // Awaiting the SMTP handshake here cost ten seconds of spinner between
  // pressing Pay and the payment sheet opening — measured, not guessed. The
  // buyer does not need the email to have landed before they can pay, and the
  // slowest thing in the request has no business being on the critical path.
  after(async () => {
    await notifyOrderPlaced(order.id).catch((err) =>
      console.error("[checkout] placed-order email failed", err),
    );
  });

  if (!razorpayConfigured()) {
    // No keys yet. The order stands and the counter collects payment — the
    // site must not stop selling because an env var is missing.
    return {
      ok: true,
      mode: "offline",
      orderNo: order.orderNo,
      publicToken: order.publicToken,
      amountPaise: totals.totalPaise,
    };
  }

  try {
    const rzp = await createRazorpayOrder({
      amountPaise: totals.totalPaise,
      receipt: order.orderNo,
      notes: { order_no: order.orderNo },
    });
    if (!rzp) throw new Error("Razorpay returned no order");

    await attachRazorpayOrder(order.id, rzp.id);

    return {
      ok: true,
      mode: "razorpay",
      orderNo: order.orderNo,
      publicToken: order.publicToken,
      amountPaise: totals.totalPaise,
      razorpayOrderId: rzp.id,
      razorpayKeyId: razorpayKeyId()!,
      customerName: name,
      email,
      phone,
    };
  } catch (err) {
    console.error("[checkout] Razorpay order creation failed", err);
    // Fall back rather than fail: the order exists, so treat this exactly like
    // the no-keys case and let the counter take it from here.
    return {
      ok: true,
      mode: "offline",
      orderNo: order.orderNo,
      publicToken: order.publicToken,
      amountPaise: totals.totalPaise,
    };
  }
}
