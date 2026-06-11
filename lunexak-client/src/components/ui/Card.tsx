"use client";

import { Heart, ShoppingCart } from "lucide-react";

type ProductCardProps = {
  name: string;
  category: string;
  price: string;
};

export default function ProductCard({
  name,
  category,
  price,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition">

      {/* Product Image Placeholder */}
      <div className="h-60 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
        Product Image
      </div>

      <h3 className="font-bold text-lg">
        {name}
      </h3>

      <p className="text-gray-500">
        {category}
      </p>

      <p className="text-xl font-semibold mt-2">
        {price}
      </p>

      <div className="flex gap-2 mt-4">

        <button className="flex-1 bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2">
          <ShoppingCart size={18} />
          Cart
        </button>

        <button className="border p-2 rounded-lg">
          <Heart size={18} />
        </button>

      </div>

    </div>
  );
}