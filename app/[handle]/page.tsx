import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Globe } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    handle: string;
  }>;
};

export default async function PublicProfile({ params }: Props) {
  const supabase = await createClient();
  const { handle } = await params;

  // Get profile by handle
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, handle, email")
    .eq("handle", handle)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Get public bookmarks for this user
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, title, url, is_public")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gradient-to-br from-surface-1 to-canvas">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-ink mb-2">
            @{profile.handle}
          </h1>
          <p className="text-xl text-ink-muted">Check out my bookmarks</p>
        </div>

        {bookmarks && bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <a
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-surface-1 rounded-lg shadow-md hover:shadow-xl transition p-6 border-l-4 border-accent-green"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-ink hover:text-accent-green">
                      {bookmark.title}
                    </h2>
                    <p className="text-sm text-ink-muted mt-2 break-all">
                      {bookmark.url}
                    </p>
                  </div>
                  <Globe className="text-accent-green mt-1" size={20} />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-1 rounded-lg border border-hairline">
            <p className="text-ink-muted mb-4">No public bookmarks yet</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/" className="text-accent-green hover:underline">
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
