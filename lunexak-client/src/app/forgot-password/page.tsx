"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message || "Password reset email sent.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Forgot Password</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg mb-4">{message}</div>}
        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
