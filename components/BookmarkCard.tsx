"use client";

import Link from "next/link";
import { Trash2, Edit, Lock, Globe } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type BookmarkProps = {
  bookmark: {
    id: string;
    title: string;
    url: string;
    is_public: boolean;
    created_at: string;
  };
};

export default function BookmarkCard({ bookmark }: BookmarkProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmark.id);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      alert("Failed to delete bookmark");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-600 hover:underline break-all"
          >
            {bookmark.title}
          </a>
          <p className="text-gray-600 text-sm mt-1 break-all">{bookmark.url}</p>
          <div className="flex items-center gap-2 mt-3">
            {bookmark.is_public ? (
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                <Globe size={14} />
                Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                <Lock size={14} />
                Private
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <Link
            href={`/dashboard/edit/${bookmark.id}`}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
            title="Edit"
          >
            <Edit size={18} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
