import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import BookmarksList from "@/components/BookmarksList";
import { LogOut } from "lucide-react";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">You are not logged in</p>
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              @{profile?.handle} • {user.email}
            </p>
          </div>
          <form action="/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Bookmarks</h2>
          <Link
            href="/dashboard/new-bookmark"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            + Add Bookmark
          </Link>
        </div>

        <BookmarksList userId={user.id} />

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-gray-700">
            <strong>Your public profile:</strong>{" "}
            <a
              href={`/u/${profile?.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {process.env.NEXT_PUBLIC_APP_URL}/u/{profile?.handle}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
