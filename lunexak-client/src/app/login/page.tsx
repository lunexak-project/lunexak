"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, loginAsVisitor } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      await loginWithGoogle(credentialResponse.credential);
      router.push("/");
    } catch (err: any) {
      setError("Google Login failed.");
      setLoading(false);
    }
  };

  const handleMockGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle("mock_token", true); // true sets isMock in backend
      router.push("/");
    } catch (err: any) {
      setError("Mock Google Login failed.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">LunexAK</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          {/* We provide both real GoogleLogin and a mock button for dev since real client ID might not be set */}
          <div className="flex justify-center w-full overflow-hidden rounded-xl">
             <GoogleLogin
               onSuccess={handleGoogleSuccess}
               onError={() => setError("Google Login Failed")}
               useOneTap
             />
          </div>

          <button
            onClick={handleMockGoogleLogin}
            className="w-full bg-white border border-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
          >
            Mock Google Login (Dev Mode)
          </button>

          <button
            onClick={() => {
              loginAsVisitor();
              router.push("/");
            }}
            className="w-full text-gray-500 font-medium hover:text-black transition"
          >
            Skip Login (Continue as Guest)
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-black font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}