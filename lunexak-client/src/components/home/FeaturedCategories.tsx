"use client";

import Link from "next/link";

const categories = [
  {
    name: "Men",
    href: "/category/men",
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80",
    description: "Shirts, Trousers & More",
    color: "from-slate-800 to-slate-900",
  },
  {
    name: "Women",
    href: "/category/women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    description: "Kurthis, Sarees & More",
    color: "from-rose-800 to-rose-900",
  },
  {
    name: "Kids",
    href: "/category/kids",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
    description: "Playful & Comfortable",
    color: "from-orange-700 to-amber-800",
  },
  {
    name: "Home & Kitchen",
    href: "/category/home-kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    description: "Cookware, Décor & More",
    color: "from-emerald-800 to-teal-900",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-20 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Browse by Category</p>
            <h2 className="text-4xl font-black text-gray-900">Shop the Collection</h2>
          </div>
          <Link href="/products" className="hidden sm:block text-sm font-semibold text-gray-500 hover:text-black underline underline-offset-4 transition">
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden block shadow-md hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-50 group-hover:opacity-60 transition-opacity duration-300`} />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-xl font-black leading-tight">{cat.name}</h3>
                <p className="text-xs text-white/80 mt-1">{cat.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  Shop Now →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}