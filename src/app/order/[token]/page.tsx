import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, Package, Truck, Home, XCircle } from "lucide-react";
import { getOrderByToken, getPublicEvents, formatPaise } from "@/lib/orders";

/**
 * A buyer's view of one order.
 *
 * The URL token is the authentication — no login, because nothing here is
 * worth building a password reset flow around. It is 256 bits of randomness,
 * so it cannot be walked; `noindex` keeps it out of search results if someone
 * pastes the link somewhere public.
 */

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
};

// Always read live: a buyer refreshing this page after paying must see the
// status the webhook just wrote, not a cached "pending".
export const dynamic = "force-dynamic";

const STEPS = [
  { key: "pending", label: "Placed", icon: Clock },
  { key: "paid", label: "Paid", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
] as const;

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { token } = await params;
  const { paid } = await searchParams;

  const order = await getOrderByToken(token);
  if (!order) notFound();

  const events = await getPublicEvents(order.id);
  const cancelled = order.status === "cancelled" || order.status === "refunded";
  const stepIndex = STEPS.findIndex((s) => s.key === order.status);
  const a = order.shipAddress;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
      {/* Razorpay's handler sends the buyer back with ?paid=1. That is the
          browser's word, not the webhook's — so this reassures without
          claiming the payment is confirmed. */}
      {paid === "1" && order.status === "pending" && (
        <p className="mb-8 rounded-xl border border-jet-border bg-jet-bg-elevated px-5 py-4 text-sm text-jet-text-dim">
          Thanks — your payment is going through. This page updates to
          <strong className="text-jet-text"> Paid</strong> as soon as the bank confirms it, usually
          within a minute. We&rsquo;ve emailed you either way.
        </p>
      )}

      <p className="text-sm font-medium text-jet-primary mb-1">Order {order.orderNo}</p>
      <h1 className="text-3xl lg:text-4xl font-bold text-jet-text mb-2">
        {cancelled
          ? "This order was cancelled"
          : order.status === "pending"
            ? "We have your order"
            : "Thanks — payment received"}
      </h1>
      <p className="text-jet-text-dim mb-10">
        Placed{" "}
        {new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "long", year: "numeric",
        })}
        {order.status === "pending" && " · awaiting payment"}
      </p>

      {cancelled ? (
        <div className="flex items-center gap-3 rounded-2xl border border-jet-border bg-jet-bg-card px-6 py-5 mb-10">
          <XCircle className="w-6 h-6 text-jet-text-muted shrink-0" aria-hidden />
          <p className="text-jet-text-dim capitalize">{order.status}</p>
        </div>
      ) : (
        <ol className="flex items-start justify-between gap-1 mb-12" aria-label="Order progress">
          {STEPS.map((step, i) => {
            const done = stepIndex >= i;
            const Icon = step.icon;
            return (
              <li key={step.key} className="flex-1 flex flex-col items-center text-center relative">
                {i > 0 && (
                  <span
                    aria-hidden
                    className={`absolute top-5 right-1/2 w-full h-0.5 ${
                      done ? "bg-jet-primary" : "bg-jet-border"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 grid place-items-center w-10 h-10 rounded-full border-2 ${
                    done
                      ? "bg-jet-primary border-jet-primary text-white"
                      : "bg-jet-bg-card border-jet-border text-jet-text-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <span
                  className={`mt-2 text-xs font-medium ${done ? "text-jet-text" : "text-jet-text-muted"}`}
                >
                  {step.label}
                </span>
                {/* The icons carry no text, so state the status for a screen reader. */}
                <span className="sr-only">{done ? "completed" : "not yet"}</span>
              </li>
            );
          })}
        </ol>
      )}

      <section className="rounded-2xl border border-jet-border bg-jet-bg-card p-6 mb-8">
        <h2 className="text-lg font-bold text-jet-text mb-5">Items</h2>
        <ul className="space-y-4">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex gap-4 items-center">
              <div className="relative w-16 h-16 shrink-0 rounded-lg bg-jet-bg-elevated overflow-hidden">
                {i.image && <Image src={i.image} alt="" fill sizes="64px" className="object-contain p-1" />}
              </div>
              <div className="flex-1 min-w-0">
                {i.productId ? (
                  <Link href={`/products/${i.productId}/`} className="text-sm font-medium text-jet-text hover:text-jet-primary">
                    {i.name}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-jet-text">{i.name}</span>
                )}
                <p className="text-xs text-jet-text-muted mt-0.5">
                  {i.sku} · Qty {i.qty} · {formatPaise(i.unitPricePaise)} each
                </p>
              </div>
              <p className="text-sm font-semibold text-jet-text whitespace-nowrap">
                {formatPaise(i.lineTotalPaise)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 pt-4 border-t border-jet-border space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-jet-text-dim">Subtotal</dt>
            <dd className="text-jet-text">{formatPaise(order.subtotalPaise)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-jet-text-dim">Delivery</dt>
            <dd className="text-jet-success font-medium">Free</dd>
          </div>
          <div className="flex justify-between text-xs text-jet-text-muted">
            <dt>Includes GST (18%)</dt>
            <dd>{formatPaise(order.gstPaise)}</dd>
          </div>
          <div className="flex justify-between pt-3 mt-1 border-t border-jet-border text-lg font-bold text-jet-text">
            <dt>Total</dt>
            <dd>{formatPaise(order.totalPaise)}</dd>
          </div>
        </dl>
      </section>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <section className="rounded-2xl border border-jet-border bg-jet-bg-card p-6">
          <h2 className="text-sm font-bold text-jet-text mb-3">Delivering to</h2>
          <address className="not-italic text-sm text-jet-text-dim leading-relaxed">
            {order.customerName}<br />
            {a.line1}{a.line2 && <><br />{a.line2}</>}<br />
            {a.city}, {a.state} {a.pincode}<br />
            {order.phone}
          </address>
        </section>

        {events.length > 0 && (
          <section className="rounded-2xl border border-jet-border bg-jet-bg-card p-6">
            <h2 className="text-sm font-bold text-jet-text mb-3">Progress</h2>
            <ol className="space-y-3">
              {events.map((e, i) => (
                <li key={i} className="text-sm">
                  <p className="text-jet-text">{e.note ?? e.type}</p>
                  <p className="text-xs text-jet-text-muted">
                    {new Date(e.created_at).toLocaleString("en-IN", {
                      day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
                    })}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      <p className="text-sm text-jet-text-dim">
        Questions about this order? Call{" "}
        <a href="tel:+919814958295" className="text-jet-primary font-medium hover:underline">
          +91 98149 58295
        </a>{" "}
        and quote <strong className="text-jet-text">{order.orderNo}</strong>, or{" "}
        <Link href="/orders/" className="text-jet-primary font-medium hover:underline">
          find your other orders
        </Link>
        .
      </p>
    </div>
  );
}
