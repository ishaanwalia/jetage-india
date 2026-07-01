import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Check, Truck, Shield, ArrowLeft, ShoppingCart } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} - JetAge India`,
    description: product.description,
    openGraph: {
      images: [product.images[0]],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  const related = getRelatedProducts(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-blue-600">Products</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
          </div>
          <div className="flex gap-4">
            {product.images.map((img, i) => (
              <button key={i} className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border-2 border-blue-500">
                <Image src={img} alt={`View ${i + 1}`} width={80} height={80} className="object-contain p-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            {product.subcategory}
          </span>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-gray-600">{product.rating} ({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900">₹{product.price.toLocaleString("en-IN")}</span>
            <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            <span className="text-green-600 font-medium">{discount}% OFF</span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
            <span className={product.stock > 10 ? 'text-green-700' : 'text-orange-700'}>
              {product.stock > 10 ? `In Stock (${product.stock} units)` : `Low Stock - Only ${product.stock} left!`}
            </span>
          </div>

          {/* Short Specs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.shortSpecs.map((spec, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {spec}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <a
              href={`https://wa.me/91XXXXXXXXXX?text=Hi, I want to order ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors text-center"
            >
              WhatsApp Order
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-5 h-5 text-blue-600" />
              Free Delivery
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-blue-600" />
              HP Warranty
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none mb-8">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Key Features</h2>
            <ul className="space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <tbody>
              {Object.entries(product.specifications).map(([key, value], i) => (
                <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 font-medium text-gray-900 w-1/3">{key}</td>
                  <td className="px-6 py-4 text-gray-600">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}