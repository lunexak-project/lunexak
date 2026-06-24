"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { categoryService } from "@/services";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { isAdmin } = useAuth();
  
  const categoryId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    isActive: true,
    isFeatured: false,
    displayOrder: 0,
    seoTitle: "",
    seoDescription: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    
    const loadCategory = async () => {
      try {
        const categoriesData = await categoryService.getAll();
        const flatCategories = categoriesData.flatCategories || categoriesData.categories || [];
        const category = flatCategories.find((c: any) => c._id === categoryId);
        
        if (category) {
          setFormData({
            name: category.name || "",
            slug: category.slug || "",
            isActive: category.isActive ?? true,
            isFeatured: category.isFeatured ?? false,
            displayOrder: category.displayOrder || 0,
            seoTitle: category.seoTitle || "",
            seoDescription: category.seoDescription || ""
          });
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load category");
      } finally {
        setFetching(false);
      }
    };
    
    loadCategory();
  }, [isAdmin, categoryId]);

  if (!isAdmin) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await categoryService.update(categoryId, formData);
      router.push("/admin/categories");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/admin/categories" className="text-gray-500 hover:text-black flex items-center gap-2 mb-4 w-max">
          <ArrowLeft size={16} /> Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category Name *</label>
            <input 
              required
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Slug *</label>
            <input 
              required
              type="text" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black font-mono text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Display Order</label>
            <input 
              type="number" 
              name="displayOrder" 
              value={formData.displayOrder} 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            />
          </div>

          <div className="flex items-center gap-6 mt-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm font-semibold text-gray-700">Is Active</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm font-semibold text-gray-700">Is Featured</span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">SEO Title</label>
              <input 
                type="text" 
                name="seoTitle" 
                value={formData.seoTitle} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">SEO Description</label>
              <textarea 
                name="seoDescription" 
                value={formData.seoDescription} 
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black resize-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Saving..." : <><Save size={18} /> Update Category</>}
          </button>
        </div>
      </form>
    </div>
  );
}
