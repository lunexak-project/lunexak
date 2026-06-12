"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { productService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Globe, Clock, Send } from "lucide-react";

export default function EmployeeProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll({ createdBy: user?._id });
      const myProducts = data.products || data;

      setProducts(myProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmitForReview = async (id: string) => {
    try {
      await productService.submit(id);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to submit");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await productService.delete(id);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LIVE": return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Globe size={12}/> LIVE</span>;
      case "APPROVED": return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><CheckCircle size={12}/> APPROVED</span>;
      case "PENDING": return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Clock size={12}/> PENDING</span>;
      case "REJECTED": return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><XCircle size={12}/> REJECTED</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold w-max">DRAFT</span>;
    }
  };

  if (loading) return <div className="p-10 text-center">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your product drafts, track approval statuses, and submit new items.
          </p>
        </div>

        <Link href="/employee/products/new">
          <button className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2">
            <Plus size={18} />
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
                  <td className="p-4 font-medium text-gray-900">₹{product.price}</td>
                  <td className="p-4">{product.stock || 0}</td>
                  <td className="p-4">{getStatusBadge(product.status)}</td>
                  
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {product.status === "DRAFT" && (
                        <button 
                          onClick={() => handleSubmitForReview(product._id)}
                          className="text-blue-600 font-semibold text-xs hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1.5 rounded mr-2"
                        >
                          <Send size={14} /> Submit
                        </button>
                      )}

                      <Link href={`/employee/products/${product._id}/edit`}>
                        <button className="p-2 text-gray-400 hover:text-black transition rounded hover:bg-gray-200" title="Edit">
                          <Edit size={18} />
                        </button>
                      </Link>

                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No products found. Start by adding a new product draft.
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
