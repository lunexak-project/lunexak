import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-3xl font-bold mb-4">
            LunexAK
          </h2>

          <p className="text-gray-400">
            Premium lifestyle and fashion products curated
            for modern living.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Shop
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li><Link href="/category/men" className="hover:text-white transition-colors">Men</Link></li>
            <li><Link href="/category/women" className="hover:text-white transition-colors">Women</Link></li>
            <li><Link href="/category/kids" className="hover:text-white transition-colors">Kids</Link></li>
            <li><Link href="/category/home-and-kitchen" className="hover:text-white transition-colors">Home & Kitchen</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Company
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Policies
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-white transition-colors">Returns Policy</Link></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-800 text-center py-6 text-gray-500">
        © 2026 LunexAK. All Rights Reserved.
      </div>
    </footer>
  );
}