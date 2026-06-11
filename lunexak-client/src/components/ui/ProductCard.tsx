"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

type ProductCardProps = {
  id?: string;
  name: string;
  category?: string;
  price: string | number;
  compareAtPrice?: number;
  image?: string;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
};

export default function ProductCard({
  id,
  name,
  category,
  price,
  compareAtPrice,
  image,
  onAddToCart,
  onAddToWishlist,
}: ProductCardProps) {
  const hasProductLink =
    typeof id === "string" &&
    id.trim() !== "" &&
    id !== "undefined" &&
    id !== "null";

  const priceNum = typeof price === "string" ? parseFloat(price.replace("₹", "")) : price;
  const discountPercent =
    compareAtPrice && compareAtPrice > priceNum
      ? Math.round(((compareAtPrice - priceNum) / compareAtPrice) * 100)
      : 0;

  const cardContent = (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
      {/* Product Image */}
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          {onAddToWishlist && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToWishlist(); }}
              className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition"
              title="Add to Wishlist"
            >
              <Heart size={16} />
            </button>
          )}
          {onAddToCart && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(); }}
              className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-black hover:text-white transition"
              title="Add to Cart"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{category || "Fashion"}</p>
        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 mb-2">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-3">
          <span className="font-bold text-lg text-gray-900">₹{priceNum.toLocaleString()}</span>
          {compareAtPrice && compareAtPrice > priceNum && (
            <span className="text-sm text-gray-400 line-through">₹{compareAtPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (hasProductLink) {
    return <Link href={`/product/${id}`}>{cardContent}</Link>;
  }
  return cardContent;
}
