"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SignUpClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Create profile with handle
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            handle: handle,
            email: email,
          },
        ]);

        if (profileError) throw profileError;

        // Send welcome email
        try {
          const emailResponse = await fetch("/api/send-welcome-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, handle }),
          });

          if (!emailResponse.ok) {
            const errorData = await emailResponse.json();
            console.error("Welcome email API error:", errorData);
            // We don't throw here because the user is already signed up in Supabase
          }
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
        }

        router.push(
          "/auth/login?message=Check your email to confirm your account",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during sign up",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-ink tracking-tight mb-2">Create Account</h1>
          <p className="text-ink-muted text-sm">Join the minimal link-sharing community.</p>
        </div>

        {error && (
          <div className="bg-surface-2 border border-ink text-ink px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-ink-muted uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-surface-1 border border-hairline rounded-md focus:outline-none focus:ring-1 focus:ring-accent-green transition-all text-sm placeholder:text-ink-muted"
              placeholder="name@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-ink-muted uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-surface-1 border border-hairline rounded-md focus:outline-none focus:ring-1 focus:ring-accent-green transition-all text-sm placeholder:text-ink-muted"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-ink-muted uppercase tracking-wider">
              Handle (@username)
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase())}
              className="w-full px-4 py-2 bg-surface-1 border border-hairline rounded-md focus:outline-none focus:ring-1 focus:ring-accent-green transition-all text-sm placeholder:text-ink-muted"
              placeholder="myusername"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-green text-white hover:opacity-90 font-semibold font-medium py-2.5 rounded-md transition-all duration-200 disabled:opacity-50 text-sm shadow-sm"
          >
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <p className="text-center text-ink-muted text-sm mt-8">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent-green hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
