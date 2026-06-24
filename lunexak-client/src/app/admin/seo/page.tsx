"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { seoService } from "@/services";
import { Save, FileText } from "lucide-react";

export default function AdminSeoPage() {
  const { isAdmin } = useAuth();
  
  const [robotsTxt, setRobotsTxt] = useState("");
  const [savingRobots, setSavingRobots] = useState(false);
  
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  
  useEffect(() => {
    if (isAdmin) {
      fetchRobots();
      fetchSeoPages();
    }
  }, [isAdmin]);

  const fetchRobots = async () => {
    try {
      const res = await seoService.getRobotsTxt();
      setRobotsTxt(res.content);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSeoPages = async () => {
    try {
      const res = await seoService.getAll();
      setPages(res.seoPages || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveRobots = async () => {
    try {
      setSavingRobots(true);
      await seoService.updateRobotsTxt(robotsTxt);
      alert("robots.txt updated successfully");
    } catch (e) {
      alert("Failed to update robots.txt");
    } finally {
      setSavingRobots(false);
    }
  };

  const handleSavePageSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;
    try {
      await seoService.update(selectedPage.pageType, selectedPage.slug, selectedPage);
      alert("SEO settings saved");
      fetchSeoPages();
    } catch (error) {
      alert("Failed to save SEO settings");
    }
  };

  const createNewOverride = () => {
    setSelectedPage({ pageType: "CUSTOM", slug: "", title: "", metaDescription: "", canonicalUrl: "" });
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SEO Management</h1>
        <p className="text-gray-500 mt-1">Configure global robots.txt and override SEO metadata for specific pages.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText size={20}/> robots.txt</h2>
            <textarea 
              rows={6}
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black font-mono text-sm mb-4"
            />
            <button onClick={handleSaveRobots} disabled={savingRobots} className="bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 text-sm">
              {savingRobots ? "Saving..." : "Save robots.txt"}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Page Overrides</h2>
              <button onClick={createNewOverride} className="text-sm font-medium text-blue-600 hover:underline">Add New</button>
            </div>
            <div className="space-y-2">
              {pages.map(page => (
                <div 
                  key={page._id} 
                  onClick={() => setSelectedPage(page)}
                  className={`p-3 border rounded-lg cursor-pointer transition ${selectedPage?._id === page._id ? "border-black bg-gray-50" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <p className="font-bold text-sm text-gray-900">{page.slug}</p>
                  <p className="text-xs text-gray-500">{page.pageType}</p>
                </div>
              ))}
              {pages.length === 0 && <p className="text-sm text-gray-500">No overrides set.</p>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          {selectedPage ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Page SEO</h2>
              <form onSubmit={handleSavePageSeo} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Page Type</label>
                    <select 
                      value={selectedPage.pageType} 
                      onChange={e => setSelectedPage({ ...selectedPage, pageType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-black"
                    >
                      <option value="CUSTOM">Custom Page</option>
                      <option value="HOME">Homepage</option>
                      <option value="CATEGORY">Category</option>
                      <option value="PRODUCT">Product</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">URL Slug</label>
                    <input required type="text" value={selectedPage.slug} onChange={e => setSelectedPage({ ...selectedPage, slug: e.target.value })} className="w-full px-4 py-2 border rounded-lg font-mono text-sm" placeholder="e.g. about-us or category-slug" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">SEO Title</label>
                  <input required type="text" value={selectedPage.title} onChange={e => setSelectedPage({ ...selectedPage, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Meta Description</label>
                  <textarea rows={3} value={selectedPage.metaDescription || ""} onChange={e => setSelectedPage({ ...selectedPage, metaDescription: e.target.value })} className="w-full px-4 py-2 border rounded-lg resize-none" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Canonical URL</label>
                  <input type="text" value={selectedPage.canonicalUrl || ""} onChange={e => setSelectedPage({ ...selectedPage, canonicalUrl: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800">
                    <Save size={18} /> Save Settings
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 border-dashed h-full min-h-[400px] flex items-center justify-center text-gray-400">
              Select a page or add a new override to edit SEO settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
