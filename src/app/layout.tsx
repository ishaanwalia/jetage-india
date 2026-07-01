import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import SchemaMarkup from "@/components/SchemaMarkup";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "JetAge India - Authorized HP Dealer | Printers & Accessories",
  description: "JetAge India - Authorized HP Dealer in Chandigarh. Buy HP printers, laptops, accessories at best prices. All-India delivery. 35+ years of trust.",
  keywords: "HP printers, HP dealer Chandigarh, HP laser printer, HP inkjet printer, HP accessories, printer shop India",
  authors: [{ name: "JetAge India" }],
  openGraph: {
    title: "JetAge India - Authorized HP Dealer",
    description: "Buy genuine HP products at best prices. All-India delivery.",
    url: "https://jetageindia.in",
    siteName: "JetAge India",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JetAge India - Authorized HP Dealer",
    description: "Buy genuine HP products at best prices",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://jetageindia.in",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <SchemaMarkup />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}