"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Menu, X, LayoutDashboard, PlusCircle, Bell, Users, CheckSquare } from "lucide-react";

export default function RoleSidebar() {
  const { user, isVisitor, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || isVisitor || !user || (user.role !== "admin" && user.role !== "employee")) {
    return null;
  }

  const role = user.role;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition transform hover:scale-105"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold tracking-tight uppercase text-gray-900">
              {role} Panel
            </h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {role === "employee" && (
              <>
                <Link 
                  href="/employee/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link 
                  href="/employee/products/new" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <PlusCircle size={20} /> Add Product
                </Link>
                <Link 
                  href="/employee/notifications" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <Bell size={20} /> Notifications
                </Link>
              </>
            )}

            {role === "admin" && (
              <>
                <Link 
                  href="/admin/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <LayoutDashboard size={20} /> Admin Dashboard
                </Link>
                <Link 
                  href="/admin/products" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <CheckSquare size={20} /> Approvals
                </Link>
                <Link 
                  href="/admin/users" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <Users size={20} /> User Management
                </Link>
                <Link 
                  href="/admin/dashboard" // We use dashboard for admin notifications right now
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  <Bell size={20} /> Notifications
                </Link>
              </>
            )}
          </nav>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
