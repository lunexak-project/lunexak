import Link from "next/link";
import { Shirt, Baby, Home, ShoppingBag } from "lucide-react";

export default function FeaturedCategories() {
  const categories = [
    { icon: Shirt, name: "Men", href: "/category/men" },
    { icon: ShoppingBag, name: "Women", href: "/category/women" },
    { icon: Baby, name: "Kids", href: "/category/kids" },
    { icon: Home, name: "Home & Kitchen", href: "/category/home-kitchen" },
  ];

  return (
    <section className="py-20 px-8">
      <h2 className="text-4xl font-bold mb-10">
        Featured Categories
      </h2>

      <div className="grid md:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;

          return (
            <Link key={index} href={category.href}>
              <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl hover:-translate-y-2 transition duration-300 cursor-pointer">
                <Icon
                  size={60}
                  className="mx-auto mb-4 text-black"
                />

                <h3 className="text-xl font-semibold">
                  {category.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}