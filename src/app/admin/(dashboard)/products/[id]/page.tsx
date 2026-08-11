import { notFound } from "next/navigation";
import { adminGetProduct, getCategories } from "@/lib/cms";
import ProductForm from "./ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  const [categories, product] = await Promise.all([
    getCategories(),
    isNew ? Promise.resolve(null) : adminGetProduct(id),
  ]);

  if (!isNew && !product) notFound();

  return <ProductForm product={product} categories={categories} />;
}
