import { products } from "@/lib/data/products";
import ProductPageClient from "./ProductPageClient";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.id,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductPageClient slug={params.slug} />;
}