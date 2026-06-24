"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { categoryService } from "@/services";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Star, FolderTree } from "lucide-react";

export default function AdminCategoriesPage() {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) { router.replace("/login"); return; }
    if (!isLoading && !isAdmin) { router.replace("/"); return; }
  }, [user, isLoading, isAdmin, router]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data.flatCategories || data.categories || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCategories();
    }
  }, [isAdmin]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await categoryService.updateStatus(id, !currentStatus);
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await categoryService.updateFeatured(id, !currentFeatured);
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to update featured status");
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FolderTree size={28} />
            Categories
          </h1>
          <p className="text-gray-500 mt-1">
            Manage product categories, their hierarchy, and visibility.
          </p>
        </div>

        <Link href="/admin/categories/new">
          <button className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2">
            <Plus size={18} />
            Add Category
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Active</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{category.name}</p>
                    {category.parentId && <p className="text-xs text-gray-400">Child category</p>}
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-500">{category.slug}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleStatus(category._id, category.isActive)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold w-max transition ${category.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {category.isActive ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                      {category.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleFeatured(category._id, category.isFeatured)}
                      className={`p-2 rounded-full transition ${category.isFeatured ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-gray-300 hover:bg-gray-100'}`}
                      title={category.isFeatured ? "Unfeature" : "Make Featured"}
                    >
                      <Star size={18} fill={category.isFeatured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/${category._id}/edit`}>
                        <button className="p-2 text-gray-400 hover:text-black transition rounded hover:bg-gray-200" title="Edit">
                          <Edit size={18} />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(category._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No categories found. Start by creating one.
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
