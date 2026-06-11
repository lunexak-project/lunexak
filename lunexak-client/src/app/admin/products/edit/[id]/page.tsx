"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );

      const product = res.data.product;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: String(product.price || ""),
        category: product.category || "",
        brand: product.brand || "",
        stock: String(product.stock || ""),
        image: product.images?.[0] || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          brand: formData.brand,
          stock: Number(formData.stock),
          images: [formData.image],
        }
      );

      await Swal.fire({
        title: "Success",
        text: "Product Updated Successfully",
        icon: "success",
      });

      router.push("/admin/products");
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Error",
        text: "Failed To Update Product",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          rows={4}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
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
            loading="lazy"
            decoding="async"
            className="w-40 h-40 object-cover rounded-lg border"
          />
        )}

        <button
          type="submit"
          className="
            bg-black
            text-white
            px-8
            py-3
            rounded-xl
          "
        >
          Update Product
        </button>

      </form>

    </div>
  );
}
