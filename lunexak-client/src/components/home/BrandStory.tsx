export default function BrandStory() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">

        {/* Image Side */}
        <div className="h-[400px] bg-gray-200 rounded-3xl flex items-center justify-center text-gray-500 text-xl">
          Brand Image
        </div>

        {/* Content Side */}
        <div>
          <p className="uppercase tracking-widest text-gray-500 mb-3">
            Our Story
          </p>

          <h2 className="text-5xl font-bold mb-6">
            Crafted For Modern Living
          </h2>

          <p className="text-gray-600 text-lg leading-8 mb-6">
            LunexAK is built around quality, simplicity, and
            timeless style. We carefully curate products that
            blend functionality with premium design, helping
            customers discover items they truly love.
          </p>

          <button className="bg-black text-white px-6 py-3 rounded-xl">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
}