"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

type Product = {
  _id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  images: { url: string }[];
  sizes: string[];
  colors: string[];
};

type PendingTableProps = {
  products: Product[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, comment: string) => Promise<void>;
};

export default function PendingTable({ products, onApprove, onReject }: PendingTableProps) {
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await onApprove(id);
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    if (!comment.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    setProcessingId(id);
    await onReject(id, comment);
    setRejectId(null);
    setComment("");
    setProcessingId(null);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h3>
        <p className="text-gray-500">There are no pending products awaiting approval.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Details</th>
              <th className="px-6 py-4 font-semibold text-center">Variants</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50/50 transition duration-150">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{product.title}</h4>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">₹{product.price?.toLocaleString()}</p>
                    <Link href={`/product/${product._id}`} target="_blank" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1 text-xs font-medium">
                      Preview <ExternalLink size={12} />
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col gap-1 items-center">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                      {product.sizes?.length || 0} Sizes
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                      {product.colors?.length || 0} Colors
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {rejectId === product._id ? (
                    <div className="flex flex-col gap-2 min-w-[200px] items-end">
                      <textarea
                        autoFocus
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Reason for rejection..."
                        className="w-full text-sm p-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none h-20"
                      />
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => { setRejectId(null); setComment(""); }}
                          className="flex-1 py-2 px-3 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                          disabled={processingId === product._id}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReject(product._id)}
                          className="flex-1 py-2 px-3 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center justify-center gap-1"
                          disabled={processingId === product._id}
                        >
                          {processingId === product._id ? "..." : "Confirm"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(product._id)}
                        disabled={processingId === product._id}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition tooltip-trigger"
                        title="Approve & Publish"
                      >
                        <CheckCircle size={22} />
                      </button>
                      <button
                        onClick={() => setRejectId(product._id)}
                        disabled={processingId === product._id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="Reject"
                      >
                        <XCircle size={22} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
