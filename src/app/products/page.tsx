import type { Metadata } from "next";
import { ProductsPageClient } from "./ProductsPageClient";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse 47+ genuine HP printers and accessories — Laser, Smart Tank, OfficeJet, DeskJet and more. Filter by category, search by name, exclusive Jetage pricing.",
  keywords: "HP printers India, HP printer price list, buy HP printer online, HP accessories India",
  alternates: {
    canonical: "/products/",
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
