"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { bannerService } from "@/services";

const defaultSlides: any[] = [];

const bgOptions = [
  "from-[#0f0c29] via-[#302b63] to-[#24243e]",
  "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
  "from-[#134e5e] via-[#71b280] to-[#134e5e]"
];

export default function HeroSection() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await bannerService.getActive();
        if (res.banners && res.banners.length > 0) {
          const dynamicSlides = res.banners.map((b: any, index: number) => ({
            tag: b.tag || "Featured Collection",
            headline: b.title.replace(" ", "\n"), // keep the visual split
            sub: b.sub || "Explore our latest curated collections.",
            cta: b.cta || "Shop Now",
            ctaLink: b.linkUrl || "/products",
            secondary: b.secondary || "View All",
            secondaryLink: b.secondaryLink || "/products",
            bg: b.bg || bgOptions[index % bgOptions.length],
            image: b.imageUrl,
          }));
          setSlides(dynamicSlides);
        } else {
          setSlides([]);
        }
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section
      className={`relative min-h-[88vh] flex items-center overflow-hidden bg-gradient-to-br ${slide.bg} transition-all duration-1000`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="relative max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center w-full py-16">
        {/* Left */}
        <div className="text-white z-10">
          <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            {slide.tag}
          </span>

          <h1 className="text-6xl md:text-7xl font-black leading-none mb-6 whitespace-pre-line">
            {slide.headline}
          </h1>

          <p className="text-lg text-white/80 mb-10 max-w-md leading-relaxed">
            {slide.sub}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push(slide.ctaLink)}
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition hover:scale-105 shadow-2xl"
            >
              {slide.cta}
            </button>
            <button
              onClick={() => router.push(slide.secondaryLink)}
              className="border-2 border-white/50 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition"
            >
              {slide.secondary}
            </button>
          </div>

          {/* Slide indicators */}
          <div className="flex gap-2 mt-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-white" : "w-4 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right — image */}
        <div className="flex justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl blur-3xl" />
          <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
            <img
              key={current}
              src={slide.image}
              alt={slide.headline}
              className="w-full h-full object-cover animate-fadeIn"
              style={{ animation: "fadeIn 0.8s ease" }}
            />
            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
              <p className="text-xs text-gray-500 font-medium">New Arrival</p>
              <p className="text-sm font-bold text-gray-900">Free shipping on ₹1999+</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </section>
  );
}