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
    <div className="bg-white rounded-xl border border-[#ebebeb] p-6 hover:border-[#171717] transition-all duration-300 group shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-[#171717] hover:text-[#0070f3] transition-colors break-all tracking-tight"
            >
              {bookmark.title}
            </a>
            {bookmark.is_public ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-[#e6f3ff] text-[#0070f3] px-2 py-0.5 rounded-full">
                Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-[#fafafa] text-[#888888] px-2 py-0.5 rounded-full border border-[#ebebeb]">
                Private
              </span>
            )}
          </div>
          <p className="text-[#a1a1a1] font-mono text-xs break-all">{bookmark.url}</p>
        </div>

        <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/dashboard/edit/${bookmark.id}`}
            className="p-2 text-[#888888] hover:text-[#171717] hover:bg-[#fafafa] rounded-md transition-all"
            title="Edit"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-[#888888] hover:text-[#ee0000] hover:bg-[#f7d4d6] rounded-md transition-all disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
