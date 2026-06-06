"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBookmarkClient() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase.from("bookmarks").insert([
        {
          title,
          url,
          is_public: isPublic,
          user_id: user.id,
        },
      ]);

      if (insertError) throw insertError;

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create bookmark",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas">
      <header className="bg-surface-1 shadow-sm border-b border-hairline">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-ink hover:text-accent-green transition p-1.5 rounded-md hover:bg-surface-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-ink">Add Bookmark</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-surface-1 rounded-lg shadow p-6">
          {error && (
            <div className="bg-surface-2 border border-hairline text-ink px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-ink-muted font-semibold mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-surface-1 text-ink border border-hairline-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-ink-muted font-semibold mb-2">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 bg-surface-1 text-ink border border-hairline-soft rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green"
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
                <span className="text-ink-muted font-semibold">
                  Make this bookmark public
                </span>
              </label>
              <p className="text-ink-muted text-sm mt-1">
                Public bookmarks will appear on your profile page
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-accent-green text-white hover:opacity-90 font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 shadow-sm"
              >
                {loading ? "Creating..." : "Create Bookmark"}
              </button>
              <Link
                href="/dashboard"
                className="bg-surface-2 hover:bg-hairline text-ink font-semibold py-2 px-6 rounded-lg transition shadow-sm"
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
