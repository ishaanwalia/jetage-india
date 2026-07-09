import { products } from "@/lib/data/products";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

const BASE_URL = "https://www.jetageindia.in";

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) return { title: "Product Not Found | Jetage India" };

  return {
    title: `${product.name} | Jetage India`,
    description: `${product.description} Buy at ₹${product.price.toLocaleString()}. SKU: ${product.sku}.`,
    alternates: {
      canonical: `${BASE_URL}/products/${product.id}/`,
    },
    openGraph: {
      title: `${product.name} | Jetage India`,
      description: `Buy genuine ${product.name} at ₹${product.price.toLocaleString()} from Jetage India, Authorized HP World Partner in Chandigarh. All India delivery.`,
      url: `${BASE_URL}/products/${product.id}/`,
      type: "website",
      images: [{ url: `${BASE_URL}${product.image}`, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      "@type": "Brand",
      name: product.id.startsWith("hyperx") ? "HyperX" : "HP",
    },
    description: product.description,
    image: product.images.map((img) => `${BASE_URL}${img}`),
    url: `${BASE_URL}/products/${product.id}/`,
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/products/${product.id}/`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(new Date().setMonth(new Date().getMonth() + 3))
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Jetage Computer Traders",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Products", item: `${BASE_URL}/products/` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${BASE_URL}/products/${product.id}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
