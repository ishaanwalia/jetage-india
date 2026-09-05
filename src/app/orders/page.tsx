import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { emailOrderLinks } from "@/lib/order-mail";

/**
 * "Log in and see my orders", without a login.
 *
 * Type an email, and every order placed with that address is mailed to you as
 * links. Controlling the inbox is the authentication — which is all a password
 * reset proves anyway — so there is no password to store, leak, or reset.
 *
 * The response is identical whether or not the address is known. Saying "no
 * orders found" would turn this box into a way to test which email addresses
 * have bought from us.
 */

export const metadata: Metadata = {
  title: "Find your orders",
  description: "Enter your email and we'll send you links to every Jetage India order you've placed.",
  alternates: { canonical: "/orders/" },
};

async function requestLinks(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  // Cheap shape check before touching the database or the mail server.
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(email)) return;
  await emailOrderLinks(email).catch((err) =>
    console.error("[orders] failed to send order links", err),
  );
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-6 py-20 lg:py-28">
      <h1 className="text-3xl lg:text-4xl font-bold text-jet-text mb-3">Find your orders</h1>
      <p className="text-jet-text-dim mb-8 leading-relaxed">
        There&rsquo;s no account to sign into. Enter the email you ordered with and we&rsquo;ll send
        you a link to each of your orders.
      </p>

      {sent === "1" ? (
        <div
          role="status"
          className="rounded-2xl border border-jet-border bg-jet-bg-card p-6 flex gap-4 items-start"
        >
          <Mail className="w-6 h-6 text-jet-primary shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="font-semibold text-jet-text mb-1">Check your inbox</p>
            <p className="text-sm text-jet-text-dim leading-relaxed">
              If we have any orders for that address, the links are on their way. Give it a minute,
              and look in spam if it hasn&rsquo;t arrived.
            </p>
          </div>
        </div>
      ) : (
        <form
          action={async (formData: FormData) => {
            "use server";
            await requestLinks(formData);
            const { redirect } = await import("next/navigation");
            redirect("/orders/?sent=1");
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-jet-text-dim mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-jet-bg-card border border-jet-border text-jet-text
                         placeholder:text-jet-text-muted focus:outline-none focus:ring-2
                         focus:ring-jet-primary focus:border-jet-primary transition"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3.5 rounded-xl bg-jet-primary text-white font-semibold
                       hover:bg-jet-primary-dim transition focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-jet-primary"
          >
            Email me my orders
          </button>
        </form>
      )}

      <p className="text-sm text-jet-text-dim mt-8">
        Still stuck? Call{" "}
        <a href="tel:+919814958295" className="text-jet-primary font-medium hover:underline">
          +91 98149 58295
        </a>{" "}
        with your order number.
      </p>
    </div>
  );
}
