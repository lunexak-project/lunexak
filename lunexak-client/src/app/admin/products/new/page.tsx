"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/employee/ProductForm";
import { productService } from "@/services";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      await productService.create({
        ...data,
        status: "LIVE",
      });

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        Add Product
      </h1>

      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Publish Product"
      />
    </div>
  );
}
