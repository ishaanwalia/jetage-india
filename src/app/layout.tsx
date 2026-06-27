import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jet Age Computer Traders | Premium HP Printers Since 1989",
  description: "Authorized HP printer dealer in India. Laser, Color Laser, and InkJet printers for home & business. WhatsApp ordering available. Established 1989.",
  keywords: "HP printers, laser printers, color laser printers, inkjet printers, India, Jet Age, computer traders",
  openGraph: {
    title: "Jet Age Computer Traders | Premium HP Printers",
    description: "Authorized HP dealer since 1989. Best prices on HP Laser, Color Laser & InkJet printers.",
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