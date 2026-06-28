import { products } from "@/lib/data/products";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

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
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}