import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jetage Computer Traders | Premium HP Printers Since 1989",
  description: "Authorized HP printer dealer in India since 1989. Visit our showroom at SCO-12, 1st Floor, Sector-17-E, Chandigarh. Laser, Color Laser, and InkJet printers with WhatsApp ordering.",
  keywords: "HP printers, laser printers, color laser printers, inkjet printers, India, Jetage, Chandigarh, Sector 17",
  openGraph: {
    title: "Jetage Computer Traders | Premium HP Printers Since 1989",
    description: "Authorized HP dealer since 1989. Visit our showroom at SCO-12, Sector-17-E, Chandigarh. Best prices on HP printers.",
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