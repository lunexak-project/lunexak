"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  HeartIcon,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import NotificationList from "@/components/notifications/NotificationList";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [showMenu, setShowMenu] = useState(false);


  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 cursor-pointer">
            LunexAK
          </h1>
        </Link>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">

          <li>
            <Link
              href="/"
              className="hover:text-black transition"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/category/men"
              className="hover:text-black transition"
            >
              Men
            </Link>
          </li>

          <li>
            <Link
              href="/category/women"
              className="hover:text-black transition"
            >
              Women
            </Link>
          </li>

          <li>
            <Link
              href="/category/kids"
              className="hover:text-black transition"
            >
              Kids
            </Link>
          </li>

          <li>
            <Link
              href="/category/home-kitchen"
              className="hover:text-black transition"
            >
              Home & Kitchen
            </Link>
          </li>

        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          <Search
            size={22}
            className="cursor-pointer hover:text-gray-900"
          />

          {/* Cart */}

          <Link href="/cart">

            <div className="relative cursor-pointer">

              <ShoppingCart
                size={22}
                className="hover:text-gray-900"
              />

              {cart.length > 0 && (
                <span
                  className="
                    absolute
                    -top-2
                    -right-2
                    bg-red-500
                    text-white
                    text-xs
                    w-5
                    h-5
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  {cart.length}
                </span>
              )}

            </div>

          </Link>

          {/* Wishlist */}

          <Link href="/wishlist">

            <div className="relative cursor-pointer">

              <HeartIcon
                size={22}
                className="hover:text-gray-900"
              />

              {wishlist.length > 0 && (
                <span
                  className="
                    absolute
                    -top-2
                    -right-2
                    bg-red-500
                    text-white
                    text-xs
                    w-5
                    h-5
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  {wishlist.length}
                </span>
              )}

            </div>

          </Link>

          {user ? (
            <div className="relative flex items-center gap-3">

              {(user.role === "employee" || user.role === "admin") &&
                <NotificationList />
              }

              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-1 text-sm font-medium"
              >
                {user.name}
                <ChevronDown size={16} />
              </button>

              {showMenu && (
                <div className="absolute top-12 right-0 w-56 bg-white border rounded-xl shadow-lg py-2 z-50">

                  {user.role === "admin" && (
                    <>
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>

                      <Link
                        href="/admin/products"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Products
                      </Link>

                      <Link
                        href="/admin/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Orders
                      </Link>

                      <Link
                        href="/admin/approvals"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Approvals
                      </Link>
                    </>
                  )}

                  {user.role === "employee" && (
                    <>
                      <Link
                        href="/employee/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>

                      <Link
                        href="/employee/products"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Products
                      </Link>

                      <Link
                        href="/employee/notifications"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Notifications
                      </Link>
                    </>
                  )}

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>
          ) : (
            <div className="flex items-center gap-3">

              <Link href="/login">
                <button className="text-sm border px-3 py-1 rounded-md">
                  Login
                </button>
              </Link>

              <Link href="/register">
                <button className="text-sm bg-black text-white px-3 py-1 rounded-md">
                  Register
                </button>
              </Link>

            </div>
          )}

        </div>

      </div>
    </nav>
  );
}