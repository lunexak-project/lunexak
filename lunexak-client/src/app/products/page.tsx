"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services";
import ProductCard from "@/components/ui/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SlidersHorizontal } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll({ status: "LIVE" });
      setProducts(data.products || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">All Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Products</h1>
        <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            name={product.title}
            category={product.category}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            image={product.images?.[0]?.url}
            onAddToCart={() => addToCart({
              id: product._id,
              name: product.title,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              category: product.category,
              image: product.images?.[0]?.url,
              quantity: 1,
            })}
            onAddToWishlist={() => addToWishlist({
              id: product._id,
              name: product.title,
              price: product.price,
              image: product.images?.[0]?.url,
              category: product.category,
            })}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 text-gray-500">No products found.</div>
      )}
    </div>
  );
}
