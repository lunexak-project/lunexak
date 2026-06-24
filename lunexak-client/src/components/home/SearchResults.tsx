"use client";

import { useEffect, useState } from "react";
import ProductCard from "../ui/ProductCard";
import { useSearch } from "@/context/SearchContext";
import { productService } from "@/services";

type SearchProduct = {
  _id: string;
  title?: string;
  category?: string;
  brand?: string;
  price: number;
  images?: string[];
};

export default function SearchResults() {
  const [products, setProducts] = useState<SearchProduct[]>([]);

  const {
    searchTerm,
    selectedCategory,
    sortBy,
  } = useSearch();

  const hasActiveSearch =
    searchTerm.trim() ||
    selectedCategory !== "All" ||
    sortBy;

  useEffect(() => {
    if (!hasActiveSearch) {
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await productService.getAll({ status: "LIVE" });
        setProducts(res.products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [hasActiveSearch]);

  let filteredProducts = [...products];

  // Search
  if (searchTerm.trim()) {
    filteredProducts = filteredProducts.filter(
      (product) => {
        const title = product.title || "";
        const category =
          product.category || "";
        const brand =
          product.brand || "";

        return (
          title
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          category
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          brand
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
        );
      }
    );
  }

  // Category Filter
  if (
    selectedCategory &&
    selectedCategory !== "All"
  ) {
    filteredProducts =
      filteredProducts.filter(
        (product) =>
          (
            product.category || ""
          ).toLowerCase() ===
          selectedCategory.toLowerCase()
      );
  }

  // Sorting
  if (sortBy === "lowToHigh") {
    filteredProducts.sort(
      (a, b) => a.price - b.price
    );
  }

  if (sortBy === "highToLow") {
    filteredProducts.sort(
      (a, b) => b.price - a.price
    );
  }

  // Hide section if nothing selected
  if (
    !hasActiveSearch
  ) {
    return null;
  }

  return (
    <section className="px-8 py-10">
      <h2 className="text-3xl font-bold mb-6">
        Search Results
      </h2>

      <p className="text-gray-500 mb-4">
        Found {filteredProducts.length} product(s)
      </p>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            No Products Found
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={
                  product.title ||
                  "Unnamed Product"
                }
                category={
                  product.category ||
                  "Uncategorized"
                }
                price={`₹${product.price}`}
                image={
                  product.images?.[0]
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}
