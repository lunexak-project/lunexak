"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit2, Send, Trash2, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

export default function EmployeeDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "employee") {
        router.push("/");
      } else {
        fetchData();
      }
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (user?._id) {
        const res = await productService.getAll({ createdBy: user._id });
        setProducts(res.products || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async (id: string) => {
    try {
      await productService.submit(id);
      fetchData();
    } catch (error) {
      alert("Failed to submit product.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      try {
        await productService.delete(id);
        fetchData();
      } catch (error) {
        alert("Failed to delete product.");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Edit2 size={12}/> Draft</span>;
      case "PENDING":
        return <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Clock size={12}/> Pending Review</span>;
      case "APPROVED":
      case "LIVE":
        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><CheckCircle size={12}/> Approved</span>;
      case "REJECTED":
        return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><XCircle size={12}/> Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center pt-20">
        <div className="animate-pulse flex flex-col gap-8 w-full max-w-5xl">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 pb-20">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Products</h1>
            <p className="text-gray-500 mt-2">Manage your drafts and track approval statuses.</p>
          </div>
          <Link 
            href="/employee/products/new"
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-800 transition shadow-md w-max"
          >
            <Plus size={20} /> New Product
          </Link>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Plus size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-6">Start by creating a new product draft.</p>
              <Link 
                href="/employee/products/new"
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-gray-800 transition"
              >
                Create Product
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {products.map((product) => (
                <li key={product._id} className="p-6 hover:bg-gray-50/50 transition">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Image */}
                    <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
                          <p className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</p>
                        </div>
                        {getStatusBadge(product.status)}
                      </div>
                      
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span><strong className="text-gray-900">₹{product.price}</strong></span>
                        {product.sizes?.length > 0 && <span>{product.sizes.length} Sizes</span>}
                        {product.colors?.length > 0 && <span>{product.colors.length} Colors</span>}
                      </div>

                      {product.status === "REJECTED" && product.adminComment && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2 mt-2">
                          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                          <p><strong>Admin Feedback:</strong> {product.adminComment}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col justify-end gap-2 mt-4 md:mt-0">
                      {(product.status === "DRAFT" || product.status === "REJECTED") && (
                        <>
                          <Link 
                            href={`/employee/products/${product._id}/edit`}
                            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition text-center"
                          >
                            Edit Draft
                          </Link>
                          <button 
                            onClick={() => handleSubmitForReview(product._id)}
                            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                          >
                            <Send size={14} /> Submit
                          </button>
                        </>
                      )}
                      {product.status === "DRAFT" && (
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                      {(product.status === "APPROVED" || product.status === "LIVE" || product.status === "PENDING") && (
                        <Link 
                          href={`/product/${product._id}`}
                          target="_blank"
                          className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition text-center"
                        >
                          View Preview
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
