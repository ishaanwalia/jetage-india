import { products, categories } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return categories.map((cat) => ({
    id: cat.id,
  }));
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const categoryProducts = products.filter((p) => p.category === params.id);
  const categoryNames: Record<string, string> = {
    printer: "Printers",
    laptop: "Laptops",
    desktop: "Desktops",
    monitor: "Monitors",
    accessory: "Accessories",
  };
  const categoryDescriptions: Record<string, string> = {
    printer: "High-quality HP printers for home, office, and enterprise needs",
    laptop: "From everyday laptops to gaming powerhouses and premium convertibles",
    desktop: "Powerful desktop PCs including AI-powered systems and compact towers",
    monitor: "Stunning displays from FHD to QHD with professional features",
    accessory: "Keyboards, mice, and essential HP accessories",
  };

  return (
    <main className="min-h-screen bg-jet-bg">
      <Navbar />
      
      {/* Header */}
      <div className="pt-28 pb-8 bg-jet-bg-elevated border-b border-jet-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal direction="up">
            <div className="text-center space-y-4">
              <span className="inline-block px-4 py-1.5 bg-jet-primary/10 text-jet-primary text-sm font-semibold rounded-full border border-jet-primary/20">
                Category
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-jet-text">
                {categoryNames[params.id] || params.id}
              </h1>
              <p className="text-jet-text-dim max-w-2xl mx-auto text-lg">
                {categoryDescriptions[params.id] || `Browse our ${categoryNames[params.id]} collection`}
              </p>
              <p className="text-jet-primary font-semibold">
                {categoryProducts.length} products available
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {categoryProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product, i) => (
              <Reveal key={product.id} direction="up" delay={i * 0.05}>
                <ProductCard product={product} compact />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-jet-text mb-4">No products found</p>
            <p className="text-jet-text-dim mb-8">Products in this category will be added soon.</p>
            <a
              href="https://wa.me/919814958295?text=Hi%20Jetage%2C%20I%20want%20to%20inquire%20about%20your%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-jet-primary text-white rounded-full font-bold hover:bg-jet-primary-dim transition-all"
            >
              Contact on WhatsApp
            </a>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}