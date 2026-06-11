export default function BrandStrip() {
  const brands = [
    "Nike",
    "Levi's",
    "Puma",
    "US Polo",
    "Tommy Hilfiger",
  ];

  return (
    <div className="grid md:grid-cols-5 gap-4 mb-10">
      {brands.map((brand) => (
        <div
          key={brand}
          className="bg-white rounded-xl shadow p-6 text-center font-semibold"
        >
          {brand}
        </div>
      ))}
    </div>
  );
}
