"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingCart, Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: 1,
    });
    removeFromWishlist(item.id);
  };

  if (wishlist.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center max-w-lg w-full">
          <Heart size={56} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-8">Save items you love and come back to them anytime.</p>
          <Link href="/products">
            <button className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition w-full flex items-center justify-center gap-2">
              Browse Products <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Wishlist <span className="text-lg font-normal text-gray-400">({wishlist.length} items)</span>
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item, index) => (
            <div key={item.id || index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              {/* Image */}
              <Link href={`/product/${item.id}`}>
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                  )}
                  {/* Remove from wishlist */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Link>

              {/* Details */}
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.category || "Fashion"}</p>
                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">{item.name}</h3>
                <p className="font-bold text-gray-900 mb-3">₹{item.price?.toLocaleString()}</p>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
