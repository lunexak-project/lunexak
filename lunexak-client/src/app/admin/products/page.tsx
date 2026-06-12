"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services";
import Link from "next/link";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Globe, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { withAuth } from "@/lib/withAuth";

function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch all products (ignoring status filter so admins see drafts)
      const data = await productService.getAll();
      setProducts(data.products || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      alert("Failed to delete product");
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

      await fetchProducts();

      alert(`Product ${action} successful`);
    } catch (error) {
      console.error(error);
      alert(`Failed to ${action} product`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LIVE": return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Globe size={12}/> LIVE</span>;
      case "APPROVED": return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> APPROVED</span>;
      case "PENDING": return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> PENDING</span>;
      case "REJECTED": return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12}/> REJECTED</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">DRAFT</span>;
    }
  };

  if (loading) return <div className="p-10 text-center">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-500">
            Manage your catalog, review drafts, and publish products.
          </p>
        </div>

        <Link href="/admin/products/new">
          <button className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition">
            Add Product
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Workflow Actions</th>
                <th className="p-4 text-right">Edit / Delete</th>
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
                  <td className="p-4 font-medium text-gray-900">₹{product.price}</td>
                  <td className="p-4">{product.stock || 0}</td>
                  <td className="p-4">{getStatusBadge(product.status)}</td>
                  
                  {/* Workflow Actions based on Role and Status */}
                  <td className="p-4">
                    {user?.role === "employee" && product.status === "DRAFT" && (
                      <button onClick={() => handleAction(product._id, "submit")} className="text-blue-600 font-semibold text-xs hover:underline">Submit for Review</button>
                    )}
                    {user?.role === "admin" && product.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(product._id, "approve")} className="text-green-600 font-semibold text-xs hover:underline">Approve</button>
                        <button onClick={() => handleAction(product._id, "reject")} className="text-red-600 font-semibold text-xs hover:underline">Reject</button>
                      </div>
                    )}
                    {user?.role === "admin" && product.status === "APPROVED" && (
                      <button onClick={() => handleAction(product._id, "publish")} className="text-blue-600 font-semibold text-xs hover:underline">Publish to Live</button>
                    )}
                    {product.status === "LIVE" && <span className="text-xs text-gray-400">No actions needed</span>}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-black transition rounded hover:bg-gray-200">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition rounded hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminProductsPage, {
  allowedRoles: ["admin", "employee"],
});