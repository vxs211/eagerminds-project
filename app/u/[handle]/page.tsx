import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Globe } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: {
    handle: string;
  };
};

export default async function PublicProfile({ params }: Props) {
  const supabase = await createClient();

  // Get profile by handle
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, handle, email")
    .eq("handle", params.handle)
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">@{profile.handle}</h1>
          <p className="text-xl text-gray-600">Check out my bookmarks</p>
        </div>

        {bookmarks && bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <a
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                      {bookmark.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 break-all">
                      {bookmark.url}
                    </p>
                  </div>
                  <Globe className="text-blue-500 mt-1" size={20} />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 mb-4">No public bookmarks yet</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
