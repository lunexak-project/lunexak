"use client";

import { useState } from "react";
import api from "@/lib/api";
import Swal from "sweetalert2";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    image: "",
    sizes: "",
    colors: "",
    stock: "",
    featured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/products", {
        title: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand,

        images: formData.image
          ? [
            {
              url: formData.image,
              alt: formData.name,
            },
          ]
          : [],

        sizes: formData.sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),

        colors: formData.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),

        stock: Number(formData.stock),

        featured: formData.featured,
      });

      await Swal.fire({
        title: "LunexAK",
        text: "Product Added Successfully",
        icon: "success",
      });

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        image: "",
        sizes: "",
        colors: "",
        stock: "",
        featured: false,
      });
    } catch (error: any) {
      console.error(error);

      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed To Add Product",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">
        Add Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-lg border"
          />
        )}

        <input
          type="text"
          name="sizes"
          placeholder="Sizes (S,M,L,XL)"
          value={formData.sizes}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="colors"
          placeholder="Colors (Black,White,Blue)"
          value={formData.colors}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          Featured Product
        </label>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}