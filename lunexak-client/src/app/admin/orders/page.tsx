"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services";
import { withAuth } from "@/lib/withAuth";
import { Search, Filter, Package, Truck, CheckCircle2, Clock } from "lucide-react";

function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data.orders || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      // Optimistic update
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED": return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 size={12} /> DELIVERED</span>;
      case "DISPATCHED": return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Truck size={12} /> DISPATCHED</span>;
      case "CONFIRMED": return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Package size={12} /> CONFIRMED</span>;
      case "PROCESSING": return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Clock size={12} /> PROCESSING</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold w-max">{status || "PENDING"}</span>;
    }
  };

  if (loading) return <div className="p-10 text-center">Loading orders...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">Track and fulfill customer orders.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black text-sm" />
          </div>
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs text-gray-600">{order._id}</td>
                  <td className="p-4 text-gray-600">{order.user}</td>
                  <td className="p-4 text-gray-600">{order.orderItems?.length || 0} item(s)</td>
                  <td className="p-4 font-bold text-gray-900">₹{order.totalPrice || 0}</td>
                  <td className="p-4">
                    {getStatusBadge(order.orderStatus)}
                  </td>
                  <td className="p-4 text-right">
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 outline-none focus:border-black"
                      value={order.orderStatus || "PROCESSING"}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="DISPATCHED">DISPATCHED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminOrdersPage, { allowedRoles: ["admin"] });