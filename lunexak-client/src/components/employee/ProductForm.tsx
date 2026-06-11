"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";

type ProductFormProps = {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
};

export default function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    compareAtPrice: initialData?.compareAtPrice || "",
    category: initialData?.category || "Men",
    subCategory: initialData?.subCategory || "",
    brand: initialData?.brand || "",
    sizes: initialData?.sizes?.join(", ") || "",
    colors: initialData?.colors?.join(", ") || "",
    imageUrls: (initialData?.images || []).map((img: any) => img.url).join(", "),
    stock: initialData?.stock || 0,
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format data before submission
    const submitData = {
      ...formData,
      subCategory: formData.subCategory,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      stock: Number(formData.stock),
      sizes: formData.sizes
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => s),
      colors: formData.colors ? formData.colors.split(",").map((c: string) => c.trim()) : [],
      images: formData.imageUrls
        ? formData.imageUrls.split(",").map((url: string) => ({
          url: url.trim(),
          alt: formData.title,
        }))
        : []
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700">Product Title *</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              placeholder="e.g. Premium Cotton T-Shirt"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition resize-none"
              placeholder="Write a compelling product description..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition bg-white"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Sub Category
            </label>

            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl"
            >
              <option value="">Select Sub Category</option>

              {formData.category === "Men" && (
                <>
                  <option value="Shirts">Shirts</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Watches">Watches</option>
                </>
              )}

              {formData.category === "Women" && (
                <>
                  <option value="Kurti">Kurti</option>
                  <option value="Saree">Saree</option>
                  <option value="Tops">Tops</option>
                  <option value="Handbags">Handbags</option>
                </>
              )}

              {formData.category === "Kids" && (
                <>
                  <option value="Toys">Toys</option>
                  <option value="Dresses">Dresses</option>
                  <option value="School Bags">School Bags</option>
                </>
              )}

              {formData.category === "Home & Kitchen" && (
                <>
                  <option value="Kitchen Tools">Kitchen Tools</option>
                  <option value="Cookware">Cookware</option>
                  <option value="Storage">Storage</option>
                </>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Brand</label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              placeholder="e.g. LunexAK Originals"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Pricing & Inventory</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Price (₹) *</label>
            <input
              required
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Compare at Price (₹)</label>
            <input
              type="number"
              name="compareAtPrice"
              value={formData.compareAtPrice}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              placeholder="Optional original price"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Initial Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Variants & Images */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Variants & Media</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Sizes (comma separated)</label>
            <input
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              placeholder="e.g. S, M, L, XL"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Colors (comma separated)</label>
            <input
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              placeholder="e.g. Red, #000000, Blue"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700">Product Image URLs (comma separated)</label>
            <input
              name="imageUrls"
              value={formData.imageUrls}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              placeholder="url1, url2, url3"
            />
            {formData.imageUrls && formData.imageUrls.split(",")[0] && (
              <div className="mt-4 w-32 h-40 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                <img src={formData.imageUrls.split(",")[0].trim()} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Data */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">SEO Settings</h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Meta Title</label>
            <input
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              placeholder="Title for search engines"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Meta Description</label>
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              rows={2}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition resize-none"
              placeholder="Short description for search results"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed flex-1"
        >
          {isSubmitting ? "Saving..." : <><Save size={20} /> Save Product Draft</>}
        </button>
      </div>
    </form>
  );
}
