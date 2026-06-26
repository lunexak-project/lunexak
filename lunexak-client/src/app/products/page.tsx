"use client";

import { useEffect, useState, useCallback } from "react";
import { productService, categoryService, bannerService } from "@/services";
import ProductCard from "@/components/ui/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SlidersHorizontal, Search, X, ChevronDown } from "lucide-react";

const CATEGORIES = ["Men", "Women", "Kids", "Home & Kitchen"];
const SORT_OPTIONS = [
  { label: "Newest First", value: "-createdAt" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  // Filter state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { status: "LIVE", sort };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = await productService.getAll(params);
      let result: any[] = data.products || data;

      // Client-side price filter as backend may not support range
      if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
      if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

      setProducts(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, minPrice, maxPrice, sort]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search
    return () => clearTimeout(delay);
  }, [fetchProducts]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await bannerService.getActive("shop");
        if (res.banners && res.banners.length > 0) {
          setBanner(res.banners[0]);
        }
      } catch (err) {}
    };
    fetchBanner();
  }, []);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("-createdAt");
  };

  const hasActiveFilters = search || selectedCategory || minPrice || maxPrice || sort !== "-createdAt";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Banner */}
      {banner && (
        <div className={`relative w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-8 flex items-center justify-center text-center p-8 bg-gradient-to-br ${banner.bg || "from-gray-900 to-black"}`}>
          <img src={banner.imageUrl} alt={banner.title} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
          <div className="relative z-10 text-white max-w-2xl">
            {banner.tag && <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">{banner.tag}</span>}
            <h2 className="text-4xl md:text-5xl font-black mb-4 whitespace-pre-line">{banner.title.replace(" ", "\n")}</h2>
            {banner.sub && <p className="text-white/80">{banner.sub}</p>}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">All Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products found</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition ${
              showFilters || hasActiveFilters
                ? "bg-black text-white border-black"
                : "border-gray-300 text-gray-700 hover:border-black"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="bg-white text-black w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-300 hover:border-black transition outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 items-end">
            {/* Search */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  min="0"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  min="0"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Clear */}
            <div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:border-red-400 hover:text-red-500 transition w-full justify-center"
                >
                  <X size={14} /> Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category pills (quick filters) */}
      <div className="flex gap-3 flex-wrap mb-8">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
            !selectedCategory ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-black"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
              selectedCategory === cat ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-2xl mb-2">No products found</p>
          <p className="text-sm">Try adjusting your filters</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-4 text-black underline font-semibold text-sm">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.title}
              category={product.category}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              image={product.images?.[0]?.url}
              onAddToCart={() =>
                addToCart({
                  id: product._id,
                  name: product.title,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  category: product.category,
                  image: product.images?.[0]?.url,
                  quantity: 1,
                })
              }
              onAddToWishlist={() =>
                addToWishlist({
                  id: product._id,
                  name: product.title,
                  price: product.price,
                  image: product.images?.[0]?.url,
                  category: product.category,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
