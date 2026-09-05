"use client";

import { useState, useMemo, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Loader2, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPaise, rupeesToPaise, totalsFor } from "@/lib/money";
import { CHECKOUT_NOTICE } from "@/lib/dpdp";
import { placeOrder } from "./actions";

/** Razorpay Checkout injects this. Only the fields we actually pass are typed. */
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

/**
 * All 28 states and all 8 union territories.
 *
 * The UTs are the half that gets left out of these lists, and Chandigarh —
 * where the showroom is and where a good share of these orders will ship — is
 * a UT. Leaving it out silently blocks the most local buyer there is.
 */
const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // Union territories
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi",
  "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

/** Loads Razorpay's script on demand — not on every page of the site. */
function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-jet-bg-card border border-jet-border text-jet-text " +
  "placeholder:text-jet-text-muted focus:outline-none focus:ring-2 focus:ring-jet-primary " +
  "focus:border-jet-primary transition";

export function CheckoutClient() {
  const { items, clearCart, isHydrated } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [note, setNote] = useState("");
  const [gstin, setGstin] = useState("");
  const [showGstin, setShowGstin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shown to the buyer only. The amount actually charged is recomputed on the
  // server from database prices — this is a preview, not the source of truth.
  const totals = useMemo(
    () =>
      totalsFor(
        items.map((i) => ({
          productId: i.productId,
          sku: i.sku,
          name: i.name,
          image: i.image,
          qty: i.quantity,
          unitPricePaise: rupeesToPaise(i.price),
          lineTotalPaise: rupeesToPaise(i.price) * i.quantity,
        })),
      ),
    [items],
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const result = await placeOrder({
        cart: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        name,
        email,
        phone,
        address: { line1, line2, city, state, pincode },
        note,
        gstin,
      });

      if (!result.ok) {
        setError(result.error);
        setBusy(false);
        return;
      }

      // The order exists from here on. Clearing the cart now means a buyer who
      // abandons the payment sheet does not re-add and double-order.
      clearCart();

      if (result.mode === "offline") {
        router.push(`/order/${result.publicToken}/`);
        return;
      }

      const ready = await loadRazorpay();
      if (!ready || !window.Razorpay) {
        // The order is placed and the counter has been emailed — say so
        // rather than implying the sale failed.
        router.push(`/order/${result.publicToken}/`);
        return;
      }

      const rzp = new window.Razorpay({
        key: result.razorpayKeyId,
        order_id: result.razorpayOrderId,
        amount: result.amountPaise,
        currency: "INR",
        name: "Jetage India",
        description: `Order ${result.orderNo}`,
        prefill: { name: result.customerName, email: result.email, contact: result.phone },
        theme: { color: "#0891b2" },
        // Whatever happens in the sheet, the buyer lands on their order page.
        // The webhook, not this callback, is what marks the order paid.
        handler: () => router.push(`/order/${result.publicToken}/?paid=1`),
        modal: { ondismiss: () => router.push(`/order/${result.publicToken}/`) },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Something went wrong placing your order. Please try again, or call us.");
      setBusy(false);
    }
  }

  // The cart lives in localStorage, so the server renders an empty one. Hold
  // the skeleton until the browser has read it, or the "empty cart" branch
  // below renders on the server and React discards the whole tree on hydrate.
  if (!isHydrated) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16" aria-busy="true">
        <div className="h-10 w-48 rounded-lg bg-jet-bg-elevated animate-pulse mb-3" />
        <div className="h-5 w-64 rounded bg-jet-bg-elevated animate-pulse mb-10" />
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div className="h-96 rounded-2xl bg-jet-bg-elevated animate-pulse" />
          <div className="h-72 rounded-2xl bg-jet-bg-elevated animate-pulse" />
        </div>
        <span className="sr-only">Loading your cart…</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-jet-text mb-3">Your cart is empty</h1>
        <p className="text-jet-text-dim mb-8">Add something to it and come back.</p>
        <Link
          href="/products/"
          className="inline-block px-6 py-3 rounded-xl bg-jet-primary text-white font-semibold hover:bg-jet-primary-dim transition"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
      <h1 className="text-3xl lg:text-4xl font-bold text-jet-text mb-2">Checkout</h1>
      <p className="text-jet-text-dim mb-10">Free delivery. All prices include GST.</p>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset disabled={busy} className="space-y-8 disabled:opacity-60">
            <section>
              <h2 className="text-lg font-bold text-jet-text mb-4">Contact</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-jet-text-dim mb-1.5">
                    Full name
                  </label>
                  <input id="name" required value={name} onChange={(e) => setName(e.target.value)}
                    autoComplete="name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-jet-text-dim mb-1.5">
                    Email
                  </label>
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email" className={inputClass} />
                  <p className="text-xs text-jet-text-muted mt-1.5">
                    Your order confirmation and tracking link go here.
                  </p>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-jet-text-dim mb-1.5">
                    Mobile number
                  </label>
                  <input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel" inputMode="numeric" placeholder="10 digits" className={inputClass} />
                </div>

                {/* Businesses buy printers and toner as much as households do,
                    and without their GSTIN on the invoice they cannot claim
                    the input credit — which is a reason to buy elsewhere.
                    Collapsed by default so it costs a retail buyer nothing. */}
                <div className="sm:col-span-2">
                  {!showGstin ? (
                    <button
                      type="button"
                      onClick={() => setShowGstin(true)}
                      className="text-sm font-medium text-jet-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jet-primary rounded"
                    >
                      + Buying for a business? Add your GSTIN
                    </button>
                  ) : (
                    <>
                      <label htmlFor="gstin" className="block text-sm font-medium text-jet-text-dim mb-1.5">
                        GSTIN <span className="text-jet-text-muted font-normal">(optional)</span>
                      </label>
                      <input
                        id="gstin"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        maxLength={15}
                        placeholder="04ABCDE1234F1Z5"
                        aria-describedby="gstin-help"
                        className={`${inputClass} font-mono tracking-wide`}
                      />
                      <p id="gstin-help" className="text-xs text-jet-text-muted mt-1.5">
                        We&rsquo;ll put this on your tax invoice so you can claim input credit.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-jet-text mb-4">Delivery address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="line1" className="block text-sm font-medium text-jet-text-dim mb-1.5">
                    Address
                  </label>
                  <input id="line1" required value={line1} onChange={(e) => setLine1(e.target.value)}
                    autoComplete="address-line1" placeholder="Flat / building / street" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="line2" className="block text-sm font-medium text-jet-text-dim mb-1.5">
                    Landmark <span className="text-jet-text-muted font-normal">(optional)</span>
                  </label>
                  <input id="line2" value={line2} onChange={(e) => setLine2(e.target.value)}
                    autoComplete="address-line2" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-jet-text-dim mb-1.5">City</label>
                  <input id="city" required value={city} onChange={(e) => setCity(e.target.value)}
                    autoComplete="address-level2" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-jet-text-dim mb-1.5">
                    PIN code
                  </label>
                  <input id="pincode" required value={pincode} onChange={(e) => setPincode(e.target.value)}
                    autoComplete="postal-code" inputMode="numeric" maxLength={6} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-medium text-jet-text-dim mb-1.5">State</label>
                  <select id="state" required value={state} onChange={(e) => setState(e.target.value)}
                    autoComplete="address-level1" className={inputClass}>
                    <option value="">Select a state</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="note" className="block text-sm font-medium text-jet-text-dim mb-1.5">
                    Delivery notes <span className="text-jet-text-muted font-normal">(optional)</span>
                  </label>
                  <textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)}
                    className={inputClass} />
                </div>
              </div>
            </section>

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-jet-primary
                         text-white font-bold text-lg hover:bg-jet-primary-dim transition
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                         focus-visible:ring-jet-primary disabled:cursor-not-allowed"
            >
              {busy
                ? <><Loader2 className="w-5 h-5 animate-spin" aria-hidden /> Placing order…</>
                : <><Lock className="w-5 h-5" aria-hidden /> Pay {formatPaise(totals.totalPaise)}</>}
            </button>

            <p className="text-xs text-jet-text-muted leading-relaxed">{CHECKOUT_NOTICE}</p>
          </fieldset>
        </form>

        <aside className="lg:sticky lg:top-24 rounded-2xl border border-jet-border bg-jet-bg-card p-6">
          <h2 className="text-lg font-bold text-jet-text mb-5">Your order</h2>
          <ul className="space-y-4 mb-6">
            {items.map((i) => (
              <li key={i.productId} className="flex gap-3">
                <div className="relative w-14 h-14 shrink-0 rounded-lg bg-jet-bg-elevated overflow-hidden">
                  <Image src={i.image} alt="" fill sizes="56px" className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-jet-text line-clamp-2">{i.shortName || i.name}</p>
                  <p className="text-xs text-jet-text-muted">Qty {i.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-jet-text whitespace-nowrap">
                  {formatPaise(rupeesToPaise(i.price) * i.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="space-y-2 text-sm border-t border-jet-border pt-4">
            <div className="flex justify-between">
              <dt className="text-jet-text-dim">Subtotal</dt>
              <dd className="text-jet-text">{formatPaise(totals.subtotalPaise)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-jet-text-dim">Delivery</dt>
              <dd className="text-jet-success font-medium">Free</dd>
            </div>
            <div className="flex justify-between text-jet-text-muted text-xs">
              <dt>Includes GST (18%)</dt>
              <dd>{formatPaise(totals.gstPaise)}</dd>
            </div>
            <div className="flex justify-between pt-3 mt-1 border-t border-jet-border text-lg font-bold text-jet-text">
              <dt>Total</dt>
              <dd>{formatPaise(totals.totalPaise)}</dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-2.5 text-xs text-jet-text-dim">
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-jet-primary shrink-0" aria-hidden /> Payments secured by Razorpay</li>
            <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-jet-primary shrink-0" aria-hidden /> Free delivery across India</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
