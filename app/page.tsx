import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Bookmarks</h1>
          <p className="text-xl text-gray-600 mb-8">
            Share your favorite links with the world
          </p>

          {user ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Welcome back, {user.email}!
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-700 mb-8">
                Get started by creating an account
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition"
                >
                  Log In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
