import { products, categories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";

export const metadata = {
  title: "All HP Products - JetAge India",
  description: "Browse our complete range of HP printers, accessories, and more. Best prices guaranteed with all-India delivery.",
};

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><a href="/" className="hover:text-blue-600">Home</a></li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 font-medium">Products</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <FilterSidebar categories={categories} />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
            <span className="text-sm text-gray-500">{products.length} products found</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}