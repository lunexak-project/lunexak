"use client";

import { useEffect, useState } from "react";
import { productService, categoryService } from "@/services";
import ProductCard from "@/components/ui/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    if (slug) fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      try {
        const catData = await categoryService.getBySlug(slug);
        setCategory(catData.category || catData);
      } catch {
        setCategory({ name: slug });
      }

      const formattedCategory =
        slug === "home-kitchen"
          ? "Home & Kitchen"
          : slug.charAt(0).toUpperCase() + slug.slice(1);

      const prodData = await productService.getAll({
        category: formattedCategory,
        status: "LIVE",
      });

      setProducts(prodData.products || prodData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8" />
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
      <div className="mb-10">
        <h1 className="text-4xl font-bold capitalize">{category?.name || slug}</h1>
        {category?.description && (
          <p className="text-gray-500 mt-2">{category.description}</p>
        )}
        <p className="text-sm text-gray-400 mt-1">{products.length} products</p>
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
        <div className="text-center py-20 text-gray-500">No products in this category yet.</div>
      )}
    </div>
  );
}
