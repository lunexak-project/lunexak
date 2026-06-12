"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services";
import Link from "next/link";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { withAuth } from "@/lib/withAuth";

function ApprovalsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll({ status: "PENDING" });
      const pendingProducts = data.products || data;

      setProducts(pendingProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    id: string,
    action: "submit" | "approve" | "reject" | "publish"
  ) => {
    try {
      if (action === "submit") {
        await productService.submit(id);
      }

      if (action === "approve") {
        await productService.approve(id);
      }

      if (action === "reject") {
        const reason = prompt("Enter rejection reason") || "";
        await productService.reject(id, reason);
      }

      if (action === "publish") {
        await productService.publish(id);
      }

      await fetchPending();

      alert(`Product ${action} successful`);
    } catch (error) {
      console.error(error);
      alert(`Failed to ${action} product`);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading pending approvals...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Pending Approvals
          </h1>
          <p className="text-gray-500 mt-1">
            Review products submitted by employees and approve them for publishing.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                      {product.images?.[0]?.url && <img src={product.images[0].url} alt="" className="w-full h-full object-cover rounded" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{product.title}</p>
                      <p className="text-xs text-gray-500">{product._id}</p>
                    </div>
                  </td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4 font-medium text-gray-900">₹{product.price}</td>
                  <td className="p-4">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                      <Clock size={12}/> PENDING
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAction(product._id, "approve")}
                        className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded font-semibold text-xs hover:bg-green-100 transition"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>

                      <button
                        onClick={() => handleAction(product._id, "reject")}
                        className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded font-semibold text-xs hover:bg-red-100 transition"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No pending products awaiting approval.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ApprovalsPage, {
  allowedRoles: ["admin"],
});
