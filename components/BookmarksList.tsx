"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import BookmarkCard from "./BookmarkCard";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  is_public: boolean;
  created_at: string;
};

export default function BookmarksList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const { data, error } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBookmarks(data || []);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, [userId, supabase]);

  if (loading) {
    return <div className="text-center py-8">Loading bookmarks...</div>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 mb-4">No bookmarks yet</p>
        <p className="text-gray-400">Start by adding your first bookmark!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}
