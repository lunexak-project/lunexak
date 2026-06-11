"use client";

import { useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import CategoryBanner from "./CategoryBanner";
import BrandStrip from "./BrandStrip";

type Product = {
  name: string;
  category: string;
  price: string;
};

type CategoryPageProps = {
  title: string;
  tabs: string[];
  products: Record<string, Product[]>;
};

export default function CategoryPage({
  title,
  tabs,
  products,
}: CategoryPageProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-5xl font-bold mb-8">
        {title}
      </h1>

      <CategoryBanner />
      <BrandStrip />

      {/* Scrollable Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-4 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-3 rounded-full whitespace-nowrap transition
              ${
                selectedTab === tab
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid md:grid-cols-4 gap-6">
        {products[selectedTab]?.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            category={product.category}
            price={product.price}
          />
        ))}
      </div>
    </main>
  );
}
