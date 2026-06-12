"use client";

import { useState } from "react";
import { Save, Plus, Trash2, UploadCloud, Image as ImageIcon } from "lucide-react";
import { uploadService } from "@/services";

type ColorVariant = {
  name: string;
  hex: string;
  imageUrl: string;
};

type ProductFormProps = {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
};

export default function ProductForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Product Draft",
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    compareAtPrice: initialData?.compareAtPrice || "",
    category: initialData?.category || "Men",
    subCategory: initialData?.subCategory || "",
    brand: initialData?.brand || "",
    sizes: initialData?.sizes?.join(", ") || "",
    stock: initialData?.stock || 0,
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    isTrending: initialData?.isTrending || false,
  });

  // State for Main Images
  const [mainImages, setMainImages] = useState<{ url: string; alt: string }[]>(
    initialData?.images || []
  );
  const [uploadingMain, setUploadingMain] = useState(false);

  // State for Color Variants
  const [colors, setColors] = useState<ColorVariant[]>(
    initialData?.colors?.length > 0
      ? initialData.colors
      : [{ name: "", hex: "#000000", imageUrl: "" }]
  );
  const [uploadingColorId, setUploadingColorId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingMain(true);
    try {
      const newImages = [...mainImages];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadService.uploadImage(files[i]);
        if (res.success) {
          newImages.push({ url: res.imageUrl, alt: formData.title || "Product Image" });
        }
      }
      setMainImages(newImages);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image");
    } finally {
      setUploadingMain(false);
    }
  };

  const removeMainImage = (index: number) => {
    setMainImages(mainImages.filter((_, i) => i !== index));
  };

  const handleColorChange = (index: number, field: keyof ColorVariant, value: string) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const addColorVariant = () => {
    setColors([...colors, { name: "", hex: "#000000", imageUrl: "" }]);
  };

  const removeColorVariant = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleColorImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingColorId(index);
    try {
      const res = await uploadService.uploadImage(file);
      if (res.success) {
        handleColorChange(index, "imageUrl", res.imageUrl);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload color image");
    } finally {
      setUploadingColorId(null);
    }
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
      colors: colors.filter(c => c.name.trim() !== ""), // Only save colors that have a name
      images: mainImages.map(img => ({ ...img, alt: formData.title || "Product Image" })),
    };

    if (submitData.images.length === 0 && submitData.colors.every(c => !c.imageUrl)) {
      alert("Please upload at least one main image or a color variant image.");
      return;
    }

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
            <label className="text-sm font-bold text-gray-700">Sub Category</label>
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

      {/* Media & Uploads */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Main Product Images</h2>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {mainImages.map((img, idx) => (
              <div key={idx} className="relative w-32 h-40 rounded-xl overflow-hidden border border-gray-200 group">
                <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeMainImage(idx)}
                  className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <label className="w-32 h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-black hover:text-black transition cursor-pointer bg-gray-50">
              {uploadingMain ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current" />
              ) : (
                <>
                  <UploadCloud size={24} className="mb-2" />
                  <span className="text-xs font-semibold">Upload Image</span>
                </>
              )}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleMainImageUpload} disabled={uploadingMain} />
            </label>
          </div>
          <p className="text-xs text-gray-500">Upload high-quality images (JPG/PNG). The first image will be the cover.</p>
        </div>
      </div>

      {/* Variants (Sizes & Colors) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Product Variants</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Sizes (comma separated)</label>
            <input
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
              placeholder="e.g. S, M, L, XL or 7, 8, 9, 10"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700">Color Variants</label>
              <button type="button" onClick={addColorVariant} className="text-xs font-bold text-black flex items-center gap-1 hover:underline">
                <Plus size={14} /> Add Color
              </button>
            </div>

            <div className="space-y-3">
              {colors.map((color, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {/* Color Details */}
                  <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                    <input
                      placeholder="Color Name (e.g. Black Fade)"
                      value={color.name}
                      onChange={(e) => handleColorChange(idx, "name", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="text-xs text-gray-500 uppercase font-mono">{color.hex}</span>
                    </div>
                  </div>

                  {/* Specific Image for Color */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {color.imageUrl ? (
                      <div className="relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden group">
                        <img src={color.imageUrl} alt={color.name} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleColorChange(idx, "imageUrl", "")} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-black hover:border-black cursor-pointer transition">
                        {uploadingColorId === idx ? <div className="animate-spin w-4 h-4 border-b-2 border-current rounded-full" /> : <ImageIcon size={18} />}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleColorImageUpload(idx, e)} disabled={uploadingColorId !== null} />
                      </label>
                    )}
                    
                    <button type="button" onClick={() => removeColorVariant(idx)} className="text-gray-400 hover:text-red-500 p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Data */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">SEO & Visibility</h2>

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
          
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isTrending"
              name="isTrending"
              checked={formData.isTrending}
              onChange={handleChange}
              className="w-5 h-5 accent-black rounded cursor-pointer"
            />
            <label htmlFor="isTrending" className="text-sm font-bold text-gray-700 cursor-pointer">
              Mark as Trending Product
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 pb-12">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed flex-1"
        >
          {isSubmitting ? "Saving..." : <><Save size={20} />{submitLabel}</>}
        </button>
      </div>
    </form>
  );
}
