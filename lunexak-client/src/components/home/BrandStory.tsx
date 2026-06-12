"use client";

import Link from "next/link";

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "4.8★", label: "Avg Rating" },
  { value: "50+", label: "Brands" },
];

export default function BrandStory() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Image Side */}
          <div className="relative">
            {/* Main image */}
            <div className="relative z-10 rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
                alt="LunexAK Brand Story"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Floating card — stats */}
            <div className="absolute -bottom-6 -right-6 md:-right-10 z-20 bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative blob */}
            <div className="absolute -top-8 -left-8 w-48 h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-60 z-0" />
          </div>

          {/* Content Side */}
          <div className="md:pl-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Our Story</p>

            <h2 className="text-5xl font-black text-gray-900 leading-tight mb-6">
              Crafted for<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                Modern Living
              </span>
            </h2>

            <p className="text-gray-600 text-lg leading-8 mb-6">
              LunexAK was born from a simple belief — that <strong>everyone deserves access to premium, 
              well-crafted products</strong> without compromise. We carefully curate every item in our 
              catalog to ensure it meets our exacting standards.
            </p>

            <p className="text-gray-500 leading-7 mb-8">
              From fashion to home essentials, each product is sourced from trusted manufacturers, 
              reviewed by our team, and priced fairly. We're not just a store — we're a lifestyle 
              destination built for India's modern consumers.
            </p>

            {/* Values */}
            <div className="space-y-3 mb-10">
              {[
                { emoji: "🎯", text: "Curated for quality, not quantity" },
                { emoji: "🌱", text: "Sustainable sourcing practices" },
                { emoji: "🤝", text: "Supporting local artisans & brands" },
              ].map((val, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl">{val.emoji}</span>
                  <p className="text-sm font-medium text-gray-700">{val.text}</p>
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="inline-block bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition hover:scale-105 shadow-lg"
            >
              Explore Our Collection →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}