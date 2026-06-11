"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Bookmark, MapPin, CheckCircle2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  // Calculate pricing
  const subtotal = cart.reduce((sum, item: any) => sum + item.price * item.quantity, 0);
  const totalCompareAtPrice = cart.reduce((sum, item: any) => sum + (item.compareAtPrice || item.price) * item.quantity, 0);
  const discountAmount = totalCompareAtPrice - subtotal;
  const shipping = subtotal > 1999 ? 0 : 99; // Free shipping threshold example
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  const handleMoveToWishlist = (item: any) => {
    addToWishlist({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    removeFromCart(item.id);

  };

  // Mock estimated delivery
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center max-w-lg w-full">
          <ShoppingCart size={56} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hey, it feels so light!</h2>
          <p className="text-gray-500 mb-8">There is nothing in your bag. Let&apos;s add some items.</p>
          <Link href="/">
            <button className="bg-black text-white px-8 py-3 rounded-md font-bold tracking-wide hover:bg-gray-800 transition w-full">
              Add Items From Wishlist
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Progress Bar */}
        <div className="hidden md:flex justify-center items-center mb-8 text-sm font-medium tracking-widest uppercase text-gray-500">
          <span className="text-black border-b-2 border-black pb-1">Bag</span>
          <span className="mx-4 border-t border-dashed border-gray-300 w-12"></span>
          <span>Address</span>
          <span className="mx-4 border-t border-dashed border-gray-300 w-12"></span>
          <span>Payment</span>
        </div>

        {/* Single Column Layout */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-8">

          {/* Header & Delivery Address */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({cart.length} Items)</h1>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 border border-gray-100">
              <MapPin className="text-gray-500" size={20} />
              <div>
                <p className="text-xs text-gray-500">Deliver to:</p>
                <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                  {user?.name || "Guest"}
                </p>
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-6">
            {cart.map((item: any) => {
              const originalPrice = item.compareAtPrice || item.price;
              const discountPercent = originalPrice > item.price
                ? Math.round(((originalPrice - item.price) / originalPrice) * 100)
                : 0;

              return (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0 relative group">

                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-40 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">No Image</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="pr-10">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1 capitalize">{item.category || "Apparel"}</p>
                        </div>
                        {/* Actions Top Right Mobile, Absolute Desktop */}
                        <div className="absolute top-0 right-0 flex sm:flex-col gap-3">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition"
                            title="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            className="text-gray-400 hover:text-black transition"
                            title="Move to Wishlist"
                          >
                            <Bookmark size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="font-bold text-lg">₹{item.price.toLocaleString()}</span>
                        {discountPercent > 0 && (
                          <>
                            <span className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                            <span className="text-sm font-bold text-green-600">{discountPercent}% OFF</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-50">
                      {/* Selectors */}
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-50 px-3 py-1.5 rounded-md text-sm font-semibold text-gray-700 border border-gray-200">
                          Size: {item.size || "Free"}
                        </div>
                        <div className="flex items-center gap-3 border border-gray-200 rounded-md px-2 py-1 bg-gray-50">
                          <button onClick={() => decreaseQuantity(item.id)} className="text-gray-600 hover:text-black p-1">
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => increaseQuantity(item.id)} className="text-gray-600 hover:text-black p-1">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Delivery Est */}
                      <p className="text-xs text-gray-600 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-green-500" />
                        Delivery by <strong className="text-gray-900">{formattedDelivery}</strong>
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary & Checkout (Single Block Bottom) */}
          <div className="border-t border-gray-200 pt-8 mt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Price Details</h3>

            <div className="space-y-4 text-sm text-gray-700 max-w-md ml-auto">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{totalCompareAtPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount on MRP</span>
                <span className="text-green-600 font-medium">-₹{discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>₹{shipping}</span>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  Place Order <ArrowRight size={20} />
                </button>
                {!user && (
                  <p className="text-xs text-center text-gray-400 mt-3">
                    You&apos;ll be asked to log in before checkout
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
