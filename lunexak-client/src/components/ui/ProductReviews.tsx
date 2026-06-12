"use client";

import { useState, useEffect } from "react";
import { reviewService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import { Star, User } from "lucide-react";

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getProductReviews(productId);
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to submit a review.");
      return;
    }
    
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await reviewService.addReview({
        productId,
        rating,
        title,
        body,
      });
      setSuccess("Review submitted successfully! It will appear once approved.");
      setRating(5);
      setTitle("");
      setBody("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

      <div className="grid md:grid-cols-12 gap-12">
        {/* Write a Review Section */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
            
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl">{error}</div>}
                {success && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-xl">{success}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`p-1 transition ${rating >= num ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                      >
                        <Star size={24} fill="currentColor" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Short summary of your review"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    rows={4}
                    placeholder="What did you like or dislike?"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">Please log in to write a review.</p>
                <a href={`/login?redirect=/product/${productId}`} className="inline-block bg-black text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition">
                  Log In
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Display Reviews */}
        <div className="md:col-span-7 lg:col-span-8">
          {loading ? (
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse flex gap-4 border-b border-gray-100 pb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="space-y-3 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-3xl border border-dashed border-gray-200 h-full flex flex-col justify-center">
              <Star className="mx-auto text-gray-300 mb-3" size={32} />
              <p className="text-lg font-semibold text-gray-700">No Reviews Yet</p>
              <p className="text-sm mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review: any) => (
                <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-500">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-900">{review.userId?.name || "Anonymous"}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex gap-0.5 text-yellow-400 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
