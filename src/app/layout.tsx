import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { GlobalShell } from "@/components/GlobalShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jetageindia.in"),
  title: {
    default: "Jetage India | Authorized HP Dealer in Chandigarh Since 1989",
    template: "%s | Jetage India",
  },
  description: "Buy genuine HP printers, accessories & more at best prices. Authorized HP World Partner in Chandigarh since 1989. All India delivery. WhatsApp support. Visit SCO-12, Sector-17-E.",
  keywords: "HP dealer Chandigarh, HP printer India, HP authorized dealer, Jetage Computer Traders, HP products India, HP World Partner, Sector 17 Chandigarh, HP laser printer, HP smart tank, HP accessories",
  authors: [{ name: "Jetage Computer Traders" }],
  creator: "Jetage Computer Traders",
  publisher: "Jetage India",
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
  alternates: {
    canonical: "https://www.jetageindia.in/",
  },
  icons: {
    icon: "/FaviconJ.png",
    shortcut: "/FaviconJ.png",
    apple: "/FaviconJ.png",
  },
  openGraph: {
    title: "Jetage India | Authorized HP Dealer Since 1989",
    description: "Genuine HP products with best prices. 37+ years of trust. Visit our Sector 17 showroom or order via WhatsApp.",
    url: "https://www.jetageindia.in/",
    siteName: "Jetage India",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.jetageindia.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jetage India - Authorized HP World Partner Since 1989",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jetage India | Authorized HP Dealer Since 1989",
    description: "Genuine HP products with best prices. 37+ years of trust. Visit our Sector 17 showroom.",
    images: ["https://www.jetageindia.in/og-image.jpg"],
  },
  verification: {
    google: "J7ndhmWvNH0vCWxCUU47KQPyBZsZ3sidauaZ3CUhdBc",
  },
  other: {
    "facebook-domain-verification": "", // Add if available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Jetage India" />
        <meta name="application-name" content="Jetage India" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="geo.region" content="IN-CH" />
        <meta name="geo.placename" content="Chandigarh" />
        <meta name="geo.position" content="30.741482;76.788724" />
        <meta name="ICBM" content="30.741482, 76.788724" />
        <link rel="canonical" href="https://www.jetageindia.in/" />
        <link rel="preconnect" href="https://ssl-product-images.www8-hp.com" />
        <link rel="dns-prefetch" href="https://ssl-product-images.www8-hp.com" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Jetage Computer Traders",
              "alternateName": "Jetage India",
              "url": "https://www.jetageindia.in",
              "logo": "https://www.jetageindia.in/LogoJ.png",
              "image": "https://www.jetageindia.in/showroom.jpg",
              "description": "Authorized HP World Partner in Chandigarh since 1989. Selling genuine HP printers, accessories and more. Best prices, all India delivery.",
              "foundingDate": "1989",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "SCO-12, 1st Floor, Sector-17-E",
                "addressLocality": "Chandigarh",
                "addressRegion": "Chandigarh",
                "postalCode": "160017",
                "addressCountry": "IN",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "30.741482",
                "longitude": "76.788724",
              },
              "telephone": "+91-98149-58295",
              "email": "info@jetageindia.in",
              "openingHours": ["Mo-Sa 10:00-20:00"],
              "priceRange": "₹₹",
              "currenciesAccepted": "INR",
              "paymentAccepted": "Cash, Credit Card, UPI, Bank Transfer",
              "brand": {
                "@type": "Brand",
                "name": "HP",
              },
              "areaServed": {
                "@type": "Country",
                "name": "India",
              },
              "sameAs": [
                "https://wa.me/919814958295",
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "HP Products",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "HP Printers",
                      "brand": "HP",
                    },
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "HP Accessories",
                      "brand": "HP",
                    },
                  },
                ],
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.5",
                "reviewCount": "1200",
                "bestRating": "5",
                "worstRating": "1",
              },
            }),
          }}
        />
        
        {/* WebSite Schema with Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Jetage India",
              "url": "https://www.jetageindia.in",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.jetageindia.in/products/?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Jetage Computer Traders",
              "alternateName": "Jetage India",
              "url": "https://www.jetageindia.in",
              "logo": "https://www.jetageindia.in/LogoJ.png",
              "foundingDate": "1989",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-98149-58295",
                "contactType": "sales",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi", "Punjabi"],
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <CartProvider>
          <GlobalShell>{children}</GlobalShell>
        </CartProvider>
      </body>
    </html>
  );
}
