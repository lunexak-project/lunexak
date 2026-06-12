"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { productService, categoryService } from "@/services";
import ProductCard from "@/components/ui/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Newest First", value: "-createdAt" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const formattedCategory = useMemo(() => {
    if (!slug) return "";
    return slug === "home-kitchen"
      ? "Home & Kitchen"
      : slug.charAt(0).toUpperCase() + slug.slice(1);
  }, [slug]);

  const fetchData = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      try {
        const catData = await categoryService.getBySlug(slug);
        setCategory(catData.category || catData);
      } catch {
        setCategory({ name: formattedCategory });
      }

      const prodData = await productService.getAll({
        category: formattedCategory,
        status: "LIVE",
        sort,
      });

      setAllProducts(prodData.products || prodData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [slug, formattedCategory, sort]);

  useEffect(() => {
    setActiveSubCategory("All");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    fetchData();
  }, [fetchData]);

  // Unique subcategories from products
  const subCategories = useMemo(() => {
    const subs = allProducts
      .map((p) => p.subCategory)
      .filter((s) => s && s.trim() !== "");
    return ["All", ...Array.from(new Set<string>(subs))];
  }, [allProducts]);

  // Client-side filtering: subcategory + search + price
  const products = useMemo(() => {
    let filtered = allProducts;

    if (activeSubCategory !== "All") {
      filtered = filtered.filter(
        (p) => p.subCategory?.toLowerCase() === activeSubCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));

    return filtered;
  }, [allProducts, activeSubCategory, search, minPrice, maxPrice]);

  const hasActiveFilters = search || minPrice || maxPrice || activeSubCategory !== "All" || sort !== "-createdAt";

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setActiveSubCategory("All");
    setSort("-createdAt");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="flex gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-24 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold capitalize">{category?.name || formattedCategory}</h1>
          {category?.description && (
            <p className="text-gray-500 mt-1">{category.description}</p>
          )}
          <p className="text-sm text-gray-400 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
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
              <span className="bg-white text-black w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">!</span>
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

      {/* Expandable Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
            {/* Search */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search in this category..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
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
                <span className="text-gray-400 flex-shrink-0">–</span>
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
                  <X size={14} /> Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Pills */}
      {subCategories.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubCategory(sub)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                activeSubCategory === sub
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-2xl mb-2">No products found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters</p>
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
              onAddToCart={() => addToCart({
                id: product._id,
                name: product.title,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                category: product.category,
                image: product.images?.[0]?.url,
                quantity: 1,
              })}
              onAddToWishlist={() => addToWishlist({
                id: product._id,
                name: product.title,
                price: product.price,
                image: product.images?.[0]?.url,
                category: product.category,
              })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
