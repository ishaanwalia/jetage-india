"use client";

import { useParams } from "next/navigation";
import { products } from "@/lib/data/products";
import ProductPageClient from "./ProductPageClient";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  return <ProductPageClient slug={slug} />;
}
