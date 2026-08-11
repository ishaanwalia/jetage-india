import { getCategories } from "@/lib/cms";
import CategoryPageClient from "./CategoryPageClient";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const categories = await getCategories();
  const name = `HP ${categories.find((c) => c.id === id)?.name ?? id}`;

  return {
    title: name,
    description: `Buy genuine ${name} at best prices. Authorized HP dealer since 1989. All India delivery. Visit SCO-12, Sector-17-E, Chandigarh.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CategoryPageClient id={id} />;
}