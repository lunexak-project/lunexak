"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { dashboardService, orderService } from "@/services";
import Link from "next/link";
import { Package, ShoppingBag, Users, TrendingUp, Clock, CheckCircle, Truck } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) { router.replace("/login"); return; }
    if (!isLoading && !isAdmin) { router.replace("/"); return; }
  }, [user, isLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      dashboardService.getStats()
        .then((data) => setStats(data))
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [isAdmin]);

  if (isLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (!stats) return null;

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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/products">
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                Manage Products
              </button>
            </Link>
            <Link href="/admin/orders">
              <button className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                View Orders
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-blue-50 text-blue-600" },
            { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-purple-50 text-purple-600" },
            { label: "Total Users", value: stats.totalUsers ?? "—", icon: Users, color: "bg-emerald-50 text-emerald-600" },
            { label: "Revenue (₹)", value: `₹${(stats.totalRevenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className={`inline-flex p-2.5 rounded-xl ${color} mb-4`}>
                <Icon size={20} />
              </div>
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders?.length > 0 ? (
                  stats.recentOrders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.userId?.name || "—"}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{order.priceSummary?.total ?? "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}