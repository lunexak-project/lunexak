"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-r from-slate-50 to-slate-200 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Luxury Collection
          </p>

          <h1 className="text-6xl font-bold leading-tight mb-6">
            Discover Premium Fashion
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Curated collections crafted for modern lifestyles.
            Experience premium quality, timeless style,
            and effortless elegance.
          </p>

          <div className="flex gap-4">

            <button
              onClick={() => router.push("/products")}
              className="
                bg-black
                text-white
                px-8
                py-4
                rounded-lg
                hover:bg-gray-800
                transition
              "
            >
              Shop Now
            </button>

            <button
              onClick={() => router.push("/category/women")}
              className="
                border
                border-black
                px-8
                py-4
                rounded-lg
                hover:bg-black
                hover:text-white
                transition
              "
            >
              Explore Collection
            </button>

          </div>
        </div>

        {/* Right Content */}
        <div className="flex justify-center">
          <div
            className="
              w-[450px]
              h-[550px]
              bg-gray-300
              rounded-2xl
              flex
              items-center
              justify-center
              text-gray-600
              text-xl
              font-semibold
              shadow-lg
            "
          >
            Fashion Image
          </div>
        </div>

      </div>
    </section>
  );
}