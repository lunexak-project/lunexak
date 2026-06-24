"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("No reset token found in URL.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await authService.resetPassword(token, password);
      setMessage(res.message || "Password reset successfully.");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. The token may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Reset Password</h2>

      {message && <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg mb-4">{message} Redirecting to login...</div>}
      {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
