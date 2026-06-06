import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import BookmarksList from "@/components/BookmarksList";
import ProfileSettings from "@/components/ProfileSettings";
import { LogOut, User, Settings } from "lucide-react";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">You are not logged in</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
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

  const userHandle = profile?.handle || "no-handle-set";
  const publicProfileUrl = `/u/${userHandle}`;

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-[#ebebeb]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[#171717] tracking-tight">Bookmarks</h1>
            <div className="h-4 w-[1px] bg-[#ebebeb]" />
            <p className="text-[#888888] text-sm font-medium">
              {profile?.handle ? `@${profile.handle}` : "Setup Profile"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#a1a1a1] hidden sm:inline-block tracking-tighter uppercase">{user.email}</span>
            <form action="/auth/logout" method="POST">
              <button
                type="submit"
                className="bg-white hover:bg-[#fafafa] text-[#171717] border border-[#ebebeb] text-sm font-medium py-1.5 px-3 rounded-md transition-all duration-200 shadow-sm flex items-center gap-2"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-10 pb-6 border-b border-[#f5f5f5]">
          <div>
            <h2 className="text-3xl font-bold text-[#171717] tracking-tight">Your Links</h2>
            <p className="text-[#888888] text-sm mt-1">Manage and organize your curated collection.</p>
          </div>
          <Link
            href="/dashboard/new-bookmark"
            className="bg-[#171717] hover:bg-black text-white text-sm font-medium py-2 px-6 rounded-full transition-all duration-200 shadow-sm"
          >
            Create New
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <BookmarksList userId={user.id} />
        </div>

        <div className="mt-16 space-y-8">
          <div className="p-6 bg-white rounded-xl border border-[#ebebeb] shadow-sm">
            <h3 className="text-sm font-bold text-[#171717] uppercase tracking-widest mb-4">Sharing</h3>
            <div className="flex items-center justify-between p-4 bg-[#fafafa] rounded-lg border border-[#f5f5f5]">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#171717]">Public Profile URL</p>
                {profile?.handle ? (
                  <a
                    href={publicProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#0070f3] hover:underline"
                  >
                    {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/u/{profile.handle}
                  </a>
                ) : (
                  <p className="text-xs text-amber-600 font-medium italic">Pending handle configuration...</p>
                )}
              </div>
              {profile?.handle && (
                <div className="bg-[#d3e5ff] text-[#0070f3] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active</div>
              )}
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#ebebeb] shadow-sm">
            <h3 className="text-sm font-bold text-[#171717] uppercase tracking-widest mb-4">Account Settings</h3>
            <ProfileSettings
              userId={user.id}
              userEmail={user.email!}
              initialHandle={profile?.handle}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
