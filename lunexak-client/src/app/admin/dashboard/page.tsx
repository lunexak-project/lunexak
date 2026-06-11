"use client";

import { useEffect, useState } from "react";
import { productService, dashboardService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import PendingTable from "@/components/admin/PendingTable";
import { Package, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [pendingProducts, setPendingProducts] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        router.push("/");
      } else {
        fetchData();
      }
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await dashboardService.getStats();
      setStats(statsRes);
      
      // Fetch pending products
      const pendingRes = await productService.getAll({ status: "PENDING" });
      setPendingProducts(pendingRes.products || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await productService.approve(id);
      // After approving, fetch data again to update counts
      fetchData();
    } catch (error) {
      console.error("Approve failed:", error);
      alert("Failed to approve product.");
    }
  };

  const handleReject = async (id: string, comment: string) => {
    try {
      await productService.reject(id, comment);
      fetchData();
    } catch (error) {
      console.error("Reject failed:", error);
      alert("Failed to reject product.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center pt-20">
        <div className="animate-pulse flex flex-col gap-8 w-full max-w-7xl">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-3xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage products, approvals, and monitor platform performance.</p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title="Total Revenue"
            value={`₹${stats?.totalRevenue?.toLocaleString() || "0"}`}
            icon={<TrendingUp size={24} />}
            trend={{ value: "+12.5%", isPositive: true }}
          />
          <AnalyticsCard
            title="Total Orders"
            value={stats?.totalOrders || "0"}
            icon={<Package size={24} />}
            trend={{ value: "+5.2%", isPositive: true }}
          />
          <AnalyticsCard
            title="Live Products"
            value={stats?.liveProductsCount || "0"}
            icon={<CheckCircle size={24} />}
          />
          <AnalyticsCard
            title="Pending Approvals"
            value={pendingProducts.length}
            icon={<Clock size={24} />}
            trend={pendingProducts.length > 0 ? { value: "Action Required", isPositive: false } : undefined}
          />
        </div>

        {/* Approval Workflow Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
              <p className="text-sm text-gray-500 mt-1">Products submitted by employees awaiting your review.</p>
            </div>
            <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-orange-100">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              {pendingProducts.length} Pending
            </div>
          </div>

          <PendingTable 
            products={pendingProducts} 
            onApprove={handleApprove} 
            onReject={handleReject} 
          />
        </div>

      </div>
    </div>
  );
}
