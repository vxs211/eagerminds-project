"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

type EditBookmarkClientProps = {
  bookmarkId: string;
};

type Bookmark = {
  id: string;
  title: string;
  url: string;
  is_public: boolean;
};

export default function EditBookmarkClient({
  bookmarkId,
}: EditBookmarkClientProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchBookmark() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Not authenticated");
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("id", bookmarkId)
          .eq("user_id", user.id)
          .single();

        if (fetchError) throw fetchError;
        if (data) {
          setTitle(data.title);
          setUrl(data.url);
          setIsPublic(data.is_public);
        } else {
          setError("Bookmark not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bookmark",
        );
      } finally {
        setFetching(false);
      }
    }

    fetchBookmark();
  }, [bookmarkId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: updateError } = await supabase
        .from("bookmarks")
        .update({
          title,
          url,
          is_public: isPublic,
        })
        .eq("id", bookmarkId)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update bookmark",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Edit Bookmark</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 font-semibold">
                  Make this bookmark public
                </span>
              </label>
              <p className="text-gray-500 text-sm mt-1">
                Public bookmarks will appear on your profile page
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="/dashboard"
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-6 rounded-lg transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
