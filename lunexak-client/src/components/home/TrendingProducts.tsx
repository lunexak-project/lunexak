"use client";

import { useEffect, useState } from "react";
import ProductCard from "../ui/ProductCard";
import { productService } from "@/services";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function TrendingProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productService.getAll({ status: "LIVE", isTrending: "true", limit: "8" });
      setProducts(res.products || res);
    } catch (error) {
      console.error("Error fetching trending products", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-8">
        <h2 className="text-4xl font-bold mb-10">Trending Products</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 px-8">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-4xl font-bold">Trending Products</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
    </section>
  );
}