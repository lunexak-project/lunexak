"use client";

import { useState, useEffect } from "react";
import { productService } from "@/services";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "@/components/employee/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "employee")) {
      router.push("/");
    } else if (id) {
      fetchProduct();
    }
  }, [user, authLoading, router, id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getById(id);
      const fetchedProduct = data.product || data;
      // Only allow editing if draft or rejected
      if (fetchedProduct.status !== "DRAFT" && fetchedProduct.status !== "REJECTED") {
        alert("This product cannot be edited in its current status.");
        router.push("/employee/dashboard");
        return;
      }
      setProduct(fetchedProduct);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      alert("Product not found");
      router.push("/employee/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await productService.update(id, data);
      router.push("/employee/dashboard");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Error saving product draft. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center pt-20">
        <div className="animate-pulse flex flex-col gap-8 w-full max-w-4xl">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-[600px] bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Link href="/employee/dashboard" className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-1 w-max mb-6">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Draft: {product.title}</h1>
          <p className="text-gray-500 mt-2">Update your product details before submitting for review.</p>
        </div>

        {product.status === "REJECTED" && product.adminComment && (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex gap-3 items-start">
            <div>
              <p className="font-bold mb-1">Admin Feedback:</p>
              <p className="text-sm">{product.adminComment}</p>
            </div>
          </div>
        )}

        <ProductForm initialData={product} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
