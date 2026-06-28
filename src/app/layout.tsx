import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jetage India | Premium HP Products Since 1989",
  description: "Authorized HP World Partner since 1989. Laptops, desktops, printers, monitors & accessories. Visit our showroom at SCO-12, Sector-17-E, Chandigarh. All India delivery with WhatsApp ordering.",
  keywords: "HP laptops, HP desktops, HP printers, HP monitors, HP accessories, HP World, Chandigarh, Sector 17, Jetage, India",
  icons: {
    icon: "/FaviconJ.png",
    shortcut: "/FaviconJ.png",
    apple: "/FaviconJ.png",
  },
  openGraph: {
    title: "Jetage India | Premium HP Products Since 1989",
    description: "Authorized HP World Partner. Laptops, desktops, printers, monitors & accessories. Visit SCO-12, Sector-17-E, Chandigarh.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}