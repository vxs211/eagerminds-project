"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileSettings({ 
  userId, 
  userEmail,
  initialHandle 
}: { 
  userId: string;
  userEmail: string;
  initialHandle?: string;
}) {
  const [handle, setHandle] = useState(initialHandle || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          handle: handle.toLowerCase().trim(),
          email: userEmail,
        });

      if (upsertError) {
        if (upsertError.message.includes("unique constraint")) {
          throw new Error("This handle is already taken. Please try another one.");
        }
        throw upsertError;
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <h3 className="text-sm font-bold text-[#171717] uppercase tracking-widest mb-4">
        {initialHandle ? "Change Handle" : "Claim Your Handle"}
      </h3>
      
      {error && (
        <div className="bg-[#f7d4d6] text-[#c50000] p-3 rounded-md mb-4 text-xs border border-[#ee0000]">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-[#d3e5ff] text-[#0761d1] p-3 rounded-md mb-4 text-xs border border-[#0070f3]">
          Handle updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1a1] font-mono text-sm">@</span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase())}
            placeholder="handle"
            className="w-full pl-8 pr-4 py-2 bg-white border border-[#ebebeb] rounded-md focus:outline-none focus:ring-1 focus:ring-[#171717] transition-all text-sm placeholder:text-[#a1a1a1]"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || (handle === initialHandle && !!initialHandle)}
          className="bg-[#171717] hover:bg-black text-white text-sm font-medium py-2 px-6 rounded-md transition-all duration-200 disabled:opacity-50 whitespace-nowrap shadow-sm"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
      <p className="text-[10px] text-[#888888] mt-3 font-mono uppercase tracking-tight">
        Preview: {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/u/{handle || '...'}
      </p>
    </div>
  );
}
