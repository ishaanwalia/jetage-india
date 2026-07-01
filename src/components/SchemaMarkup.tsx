export default function SchemaMarkup() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JetAge India",
    url: "https://jetageindia.in",
    logo: "https://jetageindia.in/logo.png",
    description: "Authorized HP Dealer in Chandigarh with 35+ years of experience",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Showroom Address",
      addressLocality: "Chandigarh",
      addressRegion: "Chandigarh",
      postalCode: "160001",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://facebook.com/jetageindia",
      "https://instagram.com/jetageindia",
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: "JetAge India HP Showroom",
    image: "https://jetageindia.in/store.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Chandigarh",
      addressLocality: "Chandigarh",
      addressRegion: "Chandigarh",
      postalCode: "160001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "30.7333",
      longitude: "76.7794",
    },
    url: "https://jetageindia.in",
    telephone: "+91-XXXXXXXXXX",
    priceRange: "₹₹",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "20:00",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}