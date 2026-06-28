import { products } from "@/lib/data/products";
import CategoryPageClient from "./CategoryPageClient";

export async function generateStaticParams() {
  const categoryIds = [...new Set(products.map((p) => p.category))];
  return categoryIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const categoryNames: Record<string, string> = {
    printer: "HP Printers",
    laptop: "HP Laptops", 
    desktop: "HP Desktops",
    monitor: "HP Monitors",
    accessory: "HP Accessories",
  };

  const name = categoryNames[id] || id;

  return {
    title: `${name} | Jetage India — Authorized HP World Partner`,
    description: `Buy genuine ${name} at best prices. Authorized HP dealer since 1989. All India delivery. Visit SCO-12, Sector-17-E, Chandigarh.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CategoryPageClient id={id} />;
}