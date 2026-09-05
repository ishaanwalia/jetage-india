import type { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Jetage India order. Free delivery across India, all prices include GST.",
  alternates: { canonical: "/checkout/" },
  // A cart is personal and every checkout URL is the same page anyway —
  // there is nothing here worth a search result.
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
