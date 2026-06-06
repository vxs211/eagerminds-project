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
        .upsert(
          {
            id: userId,
            handle: handle.toLowerCase().trim(),
            email: userEmail,
          },
          { onConflict: 'id' } // Fixes Postgres ambiguous unique constraint resolution issue
        );

      if (upsertError) {
        if (upsertError.message?.includes("unique constraint") || upsertError.code === '23505') {
          throw new Error("This handle is already taken. Please try another one.");
        }
        throw new Error(upsertError.message || JSON.stringify(upsertError));
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError((err as any).message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <h3 className="text-caption text-ink uppercase mb-4">
        {initialHandle ? "Change Handle" : "Claim Your Handle"}
      </h3>
      
      {error && (
        <div className="bg-canvas text-ink p-3 rounded-md mb-4 text-micro border-l-4 border-l-accent-green shadow-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-canvas text-ink p-3 rounded-md mb-4 text-micro border-l-4 border-l-accent-green shadow-sm">
          Handle updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted font-mono text-sm">@</span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase())}
            placeholder="handle"
            className="w-full pl-8 pr-4 py-2 bg-surface-1 border border-hairline rounded-md focus:outline-none focus:ring-1 focus:ring-accent-green transition-all text-sm placeholder:text-ink-muted"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || (handle === initialHandle && !!initialHandle)}
          className="bg-accent-green text-white hover:opacity-90 font-semibold text-sm font-medium py-2 px-6 rounded-md transition-all duration-200 disabled:opacity-50 whitespace-nowrap shadow-sm"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
      <p className="text-[10px] text-ink-muted mt-3 font-mono uppercase tracking-tight">
        Preview: {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/{handle || '...'}
      </p>
    </div>
  );
}
