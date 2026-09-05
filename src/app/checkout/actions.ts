"use server";

import {
  priceCart,
  totalsFor,
  createOrder,
  attachRazorpayOrder,
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

export async function placeOrder(input: {
  cart: CartLine[];
  name: string;
  email: string;
  phone: string;
  address: ShipAddress;
  note?: string;
}): Promise<CheckoutResult> {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const phone = (input.phone ?? "").replace(/[^0-9]/g, "").slice(-10);

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
  });

  // Send the "we have your order" mail now, on the pending order. The buyer
  // gets their tracking link even if they abandon the payment sheet, which is
  // also what lets the counter follow up on a dropped checkout.
  await notifyOrderPlaced(order.id).catch((err) =>
    console.error("[checkout] placed-order email failed", err),
  );

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
