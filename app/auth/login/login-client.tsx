"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) setMessage(msg);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#171717] tracking-tight mb-2">Welcome Back</h1>
          <p className="text-[#888888] text-sm">Please enter your details to sign in.</p>
        </div>

        {error && (
          <div className="bg-[#f7d4d6] border border-[#ee0000] text-[#c50000] px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-[#d3e5ff] border border-[#0070f3] text-[#0761d1] px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[#888888] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-[#ebebeb] rounded-md focus:outline-none focus:ring-1 focus:ring-[#171717] transition-all text-sm placeholder:text-[#a1a1a1]"
              placeholder="name@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-[#888888] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-[#ebebeb] rounded-md focus:outline-none focus:ring-1 focus:ring-[#171717] transition-all text-sm placeholder:text-[#a1a1a1]"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#171717] hover:bg-black text-white font-medium py-2.5 rounded-md transition-all duration-200 disabled:opacity-50 text-sm shadow-sm"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="text-center text-[#888888] text-sm mt-8">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-[#0070f3] hover:underline font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
