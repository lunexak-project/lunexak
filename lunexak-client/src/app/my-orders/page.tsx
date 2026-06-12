"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services";
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
      return;
    }
    
    if (user) {
      orderService.getMyOrders(user._id)
        .then((res) => {
          // Sort by newest first
          const sorted = (res.orders || []).sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sorted);
        })
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" };
      case "CONFIRMED":
        return { icon: Package, color: "text-blue-600", bg: "bg-blue-50" };
      case "DISPATCHED":
        return { icon: Truck, color: "text-purple-600", bg: "bg-purple-50" };
      case "DELIVERED":
        return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" };
      case "CANCELLED":
        return { icon: XCircle, color: "text-red-600", bg: "bg-red-50" };
      default:
        return { icon: Package, color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Orders</h1>
          <p className="text-gray-500 mt-2">View and track your recent purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You haven&apos;t placed any orders yet. Discover our premium collection and make your first purchase.
            </p>
            <Link href="/products">
              <button className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const { icon: StatusIcon, color, bg } = getStatusInfo(order.status);
              
              return (
                <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${bg} ${color}`}>
                        <StatusIcon size={14} />
                        {order.status}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-6 space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item._id} className="flex gap-4">
                        <div className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {item.product?.images?.[0]?.url ? (
                            <img 
                              src={item.product.images[0].url} 
                              alt={item.product.title || "Product"} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <Link href={`/product/${item.product?._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-1">
                            {item.product?.title || "Product Unavailable"}
                          </Link>
                          <div className="text-sm text-gray-500 mt-1 flex gap-3">
                            <span>Qty: {item.quantity}</span>
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                          <div className="font-semibold text-gray-900 mt-2">
                            ₹{item.price?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Total Amount:</span>
                      <span className="ml-2 text-lg font-bold text-gray-900">
                        ₹{order.priceSummary?.total?.toLocaleString()}
                      </span>
                    </div>
                    {/* Placeholder for future detailed view if needed */}
                    <button className="text-sm font-semibold text-black hover:text-gray-600 flex items-center gap-1 transition">
                      View Details <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}