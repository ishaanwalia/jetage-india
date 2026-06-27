import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return ["printer", "laptop", "desktop", "monitor", "accessory"].map(id => ({ id }));
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const categoryProducts = products.filter(p => p.category === params.id);
  const categoryNames: Record<string, string> = {
    printer: "Printers", laptop: "Laptops", desktop: "Desktops", 
    monitor: "Monitors", accessory: "Accessories"
  };
  
  return (
    <main className="min-h-screen bg-jet-bg pt-24">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-jet-text mb-2">{categoryNames[params.id]}</h1>
        <p className="text-jet-text-dim mb-8">{categoryProducts.length} products available</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map(p => <ProductCard key={p.id} product={p} compact />)}
        </div>
      </div>
      <Footer />
    </main>
  );
}