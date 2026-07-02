import type { Metadata } from "next";
import { ProductsClient } from "./ProductsClient";

export const metadata: Metadata = {
  title: "HP Products | Printers, Laptops & Accessories | Jetage India",
  description: "Browse genuine HP printers, laptops, desktops, monitors and accessories at best prices. Authorized HP World Partner with All India delivery. WhatsApp ordering available.",
  keywords: "HP printers India, HP laptops Chandigarh, HP accessories, HP monitors, HP products online, genuine HP dealer, HP ink cartridges",
  alternates: {
    canonical: "https://www.jetageindia.in/products",
  },
  openGraph: {
    title: "HP Products | Printers, Laptops & Accessories | Jetage India",
    description: "Genuine HP products at best prices. Printers, laptops, monitors & accessories. Authorized dealer with All India delivery.",
    url: "https://www.jetageindia.in/products",
    type: "website",
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}