"use client";

import { useState, useEffect } from "react";
import { productService } from "@/services";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/employee/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "employee")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await productService.create(data);
      router.push("/employee/dashboard");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Error saving product draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Link href="/employee/dashboard" className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-1 w-max mb-6">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Product Draft</h1>
          <p className="text-gray-500 mt-2">Fill in the details below. This will be saved as a draft until you submit it for review.</p>
        </div>

        <ProductForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save Product Draft"
        />
      </div>
    </div>
  );
}
