"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { orderService } from "@/services";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { cart, setCart } = useCart();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, isLoading, router]);

  // Pre-fill name if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((fd) => ({ ...fd, fullName: user.name }));
    }
  }, [user]);

  const subtotal = cart.reduce((sum, item: any) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const orderData = {
        userId: user._id,
        items: cart.map((item: any) => ({
          productId: item.id,
          title: item.name,
          quantity: item.quantity || 1,
          unitPrice: item.price,
          imageUrl: item.image,
        })),
        addressSnapshot: {
          fullName: formData.fullName,
          phone: formData.phone,
          line1: formData.line1,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: "India",
        },
        priceSummary: {
          subtotal,
          shipping: 0,
          total: subtotal,
        },
      };

      await orderService.create(orderData);
      setCart([]);
      localStorage.removeItem("cart");
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full">
          <CheckCircle size={60} className="mx-auto text-green-500 mb-5" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed!</h1>
          <p className="text-gray-500 mb-8">
            Thank you for shopping with LunexAK. Your order is confirmed and will be processed shortly.
          </p>
          <Link href="/">
            <button className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Delivery Address</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
                    <input
                      name="line1"
                      type="text"
                      value={formData.line1}
                      onChange={handleChange}
                      placeholder="Street, Area, Landmark"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      name="pincode"
                      type="text"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                form="checkout-form"
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Placing order…" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}