"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { orderService } from "@/services";
import Link from "next/link";
import { Package, Clock } from "lucide-react";

export default function MyOrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      orderService.getMyOrders(user._id)
        .then((data) => setOrders(data.orders || []))
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [user]);

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      DISPATCHED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  if (isLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <Package size={56} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-8">When you place an order, it will appear here.</p>
            <Link href="/">
              <button className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                    <p className="font-mono font-semibold text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                    {order.status || "PENDING"}
                  </span>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm text-gray-600">
                      <span>{item.title} × {item.quantity}</span>
                      <span>₹{(item.unitPrice * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Clock size={14} />
                    <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                  </div>
                  <p className="font-bold text-gray-900">
                    Total: ₹{order.priceSummary?.total?.toLocaleString() ?? "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}