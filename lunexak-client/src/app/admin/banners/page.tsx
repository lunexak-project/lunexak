"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { bannerService, uploadService } from "@/services";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";

export default function AdminBannersPage() {
  const { isAdmin, user } = useAuth();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    tag: "",
    sub: "",
    cta: "",
    secondary: "",
    secondaryLink: "",
    bg: "",
    imageUrl: "",
    linkUrl: "",
    position: "home-hero",
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isAdmin || user?.role === "employee") fetchBanners();
  }, [isAdmin, user]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAll();
      setBanners(data.banners || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      setUploading(true);
      const res = await uploadService.uploadImage(e.target.files[0]);
      setFormData(prev => ({ ...prev, imageUrl: res.imageUrl || res.url }));
    } catch (error) {
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) return alert("Please upload an image");
    try {
      await bannerService.create(formData);
      setShowForm(false);
      setFormData({ 
        title: "", tag: "", sub: "", cta: "", secondary: "", secondaryLink: "", bg: "",
        imageUrl: "", linkUrl: "", position: "home-hero", isActive: true 
      });
      fetchBanners();
    } catch (error) {
      alert("Failed to create banner");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await bannerService.delete(id);
      fetchBanners();
    } catch (error) {
      alert("Failed to delete banner");
    }
  };

  if (!isAdmin && user?.role !== "employee") return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-500 mt-1">Manage promotional banners for the homepage.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2"
        >
          <Plus size={18} /> Add Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Headline (Title)</label>
              <input required type="text" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} placeholder="E.g. Bold & Timeless" className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Top Tag (Optional)</label>
              <input type="text" value={formData.tag} onChange={e => setFormData(f => ({ ...f, tag: e.target.value }))} placeholder="E.g. Men's Essentials" className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Subtitle (Optional)</label>
              <textarea value={formData.sub} onChange={e => setFormData(f => ({ ...f, sub: e.target.value }))} placeholder="E.g. Premium menswear crafted for..." className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black" rows={2}></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Primary Button Text</label>
                <input type="text" value={formData.cta} onChange={e => setFormData(f => ({ ...f, cta: e.target.value }))} placeholder="E.g. Shop Men" className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Primary Link</label>
                <input type="text" value={formData.linkUrl} onChange={e => setFormData(f => ({ ...f, linkUrl: e.target.value }))} placeholder="E.g. /category/men" className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Secondary Button Text</label>
                <input type="text" value={formData.secondary} onChange={e => setFormData(f => ({ ...f, secondary: e.target.value }))} placeholder="E.g. View All" className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Secondary Link</label>
                <input type="text" value={formData.secondaryLink} onChange={e => setFormData(f => ({ ...f, secondaryLink: e.target.value }))} placeholder="E.g. /products" className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Background Gradient (Tailwind classes)</label>
              <input type="text" value={formData.bg} onChange={e => setFormData(f => ({ ...f, bg: e.target.value }))} placeholder="E.g. from-[#1a1a2e] via-[#16213e] to-[#0f3460]" className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Banner Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>{uploading ? "Uploading..." : "Upload a file"}</span>
                      <input type="file" className="sr-only" onChange={handleUpload} accept="image/*" disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {formData.imageUrl && (
              <div className="h-48 relative overflow-hidden rounded-lg border">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <button type="submit" disabled={uploading || !formData.imageUrl} className="w-full bg-black text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">Save Banner</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center p-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="h-48 w-full bg-gray-100 relative">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                {!banner.isActive && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded font-bold">INACTIVE</div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{banner.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{banner.sub || "No subtitle"}</p>
                </div>
                <div className="flex items-center justify-between mt-4 border-t pt-4">
                  <span className="text-xs font-semibold text-gray-400">{banner.position}</span>
                  <button onClick={() => handleDelete(banner._id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p className="text-gray-500 p-8 text-center col-span-2">No banners uploaded yet.</p>}
        </div>
      )}
    </div>
  );
}
