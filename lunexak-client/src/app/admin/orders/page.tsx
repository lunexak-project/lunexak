"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services";
import { withAuth } from "@/lib/withAuth";
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
} from "lucide-react";

const STATUS_FLOW = ["PENDING", "CONFIRMED", "DISPATCHED", "DELIVERED"];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Package },
  DISPATCHED: { label: "Dispatched", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: Truck },
  DELIVERED: { label: "Delivered", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["PENDING"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function StatusStepper({ currentStatus }: { currentStatus: string }) {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 mt-2">
        <XCircle size={14} className="text-red-500" />
        <span className="text-xs text-red-600 font-semibold">Order Cancelled</span>
      </div>
    );
  }
  const currentIdx = STATUS_FLOW.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-1 mt-2">
      {STATUS_FLOW.map((step, i) => {
        const done = i <= currentIdx;
        return (
          <div key={step} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${done ? "bg-green-500" : "bg-gray-200"}`} />
            {i < STATUS_FLOW.length - 1 && (
              <div className={`w-6 h-0.5 ${i < currentIdx ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
      <span className="ml-2 text-xs text-gray-500">{currentStatus}</span>
    </div>
  );
}

function OrderRow({ order, onStatusChange }: { order: any; onStatusChange: (id: string, status: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const status = order.orderStatus || "PENDING";
  const customer = order.user;
  const products = order.products || [];
  const address = order.shippingAddress;

  const handleChange = async (newStatus: string) => {
    setUpdating(true);
    await onStatusChange(order._id, newStatus);
    setUpdating(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Row Header */}
      <div className="p-5 flex flex-wrap gap-4 items-center justify-between">
        {/* Left: ID + Customer */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
              #{order._id.slice(-8).toUpperCase()}
            </span>
            <StatusBadge status={status} />
          </div>
          <p className="font-semibold text-gray-900 text-sm">
            {customer?.name || "Guest"}
          </p>
          <p className="text-xs text-gray-500">{customer?.email || "—"}</p>
          <StatusStepper currentStatus={status} />
        </div>

        {/* Middle: Amount + Items */}
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Total</p>
          <p className="text-xl font-black text-gray-900">₹{(order.totalPrice || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500">{products.length} item(s)</p>
        </div>

        {/* Middle: Date */}
        <div className="text-center hidden md:block">
          <p className="text-xs text-gray-400 mb-1">Placed</p>
          <p className="text-sm font-semibold text-gray-700">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </p>
        </div>

        {/* Right: Status Controls */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-semibold">Update Status</label>
            <select
              value={status}
              onChange={(e) => handleChange(e.target.value)}
              disabled={updating || status === "DELIVERED" || status === "CANCELLED"}
              className={`border-2 rounded-xl px-3 py-2 text-sm font-bold outline-none transition ${
                updating ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-black"
              } ${
                status === "PENDING" ? "border-amber-300 text-amber-700" :
                status === "CONFIRMED" ? "border-blue-300 text-blue-700" :
                status === "DISPATCHED" ? "border-purple-300 text-purple-700" :
                status === "DELIVERED" ? "border-green-300 text-green-700" :
                "border-red-300 text-red-700"
              }`}
            >
              <option value="PENDING">⏳ Pending</option>
              <option value="CONFIRMED">📦 Confirmed</option>
              <option value="DISPATCHED">🚚 Dispatched</option>
              <option value="DELIVERED">✅ Delivered</option>
              <option value="CANCELLED">❌ Cancelled</option>
            </select>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-5 grid md:grid-cols-2 gap-6">
          {/* Products */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
            <div className="space-y-3">
              {products.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                  <div className="w-12 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name || "Product"}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} &times; ₹{item.price?.toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">₹{(item.quantity * item.price).toLocaleString()}</p>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-sm text-gray-400 italic">No product details saved.</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shipping Address</h4>
            {address ? (
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-sm text-gray-700 space-y-1">
                <p className="font-bold text-gray-900">{address.fullName}</p>
                <p>{address.phone}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.state} – {address.pincode}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No shipping address found.</p>
            )}

            {/* Price Breakdown */}
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-3">Price Breakdown</h4>
            <div className="bg-white rounded-xl p-4 border border-gray-100 text-sm space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{(order.priceSummary?.subtotal || order.totalPrice || 0).toLocaleString()}</span>
              </div>
              {order.priceSummary?.shipping !== undefined && (
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{order.priceSummary.shipping === 0 ? "FREE" : `₹${order.priceSummary.shipping}`}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{(order.totalPrice || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await orderService.getAll();
      setOrders(data.orders || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch {
      alert("Failed to update order status. Please try again.");
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = filterStatus === "ALL" || (o.orderStatus || "PENDING") === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o._id.toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Summary counts
  const counts: Record<string, number> = orders.reduce((acc: any, o) => {
    const s = o.orderStatus || "PENDING";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const summaryCards = [
    { label: "Total", value: orders.length, color: "bg-gray-900 text-white" },
    { label: "Pending", value: counts["PENDING"] || 0, color: "bg-amber-50 text-amber-800 border border-amber-200" },
    { label: "Confirmed", value: counts["CONFIRMED"] || 0, color: "bg-blue-50 text-blue-800 border border-blue-200" },
    { label: "Dispatched", value: counts["DISPATCHED"] || 0, color: "bg-purple-50 text-purple-800 border border-purple-200" },
    { label: "Delivered", value: counts["DELIVERED"] || 0, color: "bg-green-50 text-green-800 border border-green-200" },
    { label: "Cancelled", value: counts["CANCELLED"] || 0, color: "bg-red-50 text-red-800 border border-red-200" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1 text-sm">Track and fulfill all customer orders.</p>
        </div>
        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {summaryCards.map((c) => (
          <button
            key={c.label}
            onClick={() => setFilterStatus(c.label === "Total" ? "ALL" : c.label.toUpperCase())}
            className={`rounded-2xl p-4 text-center transition hover:scale-105 ${c.color} ${
              (filterStatus === "ALL" && c.label === "Total") || filterStatus === c.label.toUpperCase()
                ? "ring-2 ring-offset-1 ring-gray-400"
                : ""
            }`}
          >
            <p className="text-2xl font-black">{c.value}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-80">{c.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, customer name or email..."
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-black transition"
        />
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-semibold">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderRow key={order._id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(AdminOrdersPage, { allowedRoles: ["admin"] });