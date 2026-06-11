"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ApprovalsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products?status=PENDING"
      );

      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const approveProduct = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/products/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPending();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectProduct = async (id: string) => {
    const reason = prompt("Reason?");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/products/${id}/reject`,
        {
          comment: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPending();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Pending Product Approvals
      </h1>

      <div className="space-y-4">

        {products.map((product) => (

          <div
            key={product._id}
            className="border rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">
                {product.title}
              </h2>

              <p className="text-gray-500">
                {product.category}
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => approveProduct(product._id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => rejectProduct(product._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>

            </div>
          </div>

        ))}

      </div>

    </div>
  );
}
