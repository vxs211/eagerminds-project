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
      <main className="min-h-screen bg-gradient-to-br from-surface-1 to-canvas flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-ink-muted mb-4">You are not logged in</p>
          <Link href="/auth/login" className="text-accent-green hover:underline">
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
  const publicProfileUrl = `/${userHandle}`;

  return (
    <main className="min-h-screen bg-canvas">
      <header className="bg-surface-1 border-b border-hairline">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-headline text-ink">Bookmarks</h1>
            <div className="h-4 w-[1px] bg-hairline" />
            <p className="text-ink-muted text-sm font-medium">
              {profile?.handle ? `@${profile.handle}` : "Setup Profile"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-ink-muted hidden sm:inline-block tracking-tighter uppercase">{user.email}</span>
            <form action="/auth/logout" method="POST">
              <button
                type="submit"
                className="bg-surface-1 hover:bg-canvas text-ink border border-hairline text-sm font-medium py-1.5 px-3 rounded-md transition-all duration-200 shadow-sm flex items-center gap-2"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-10 pb-6 border-b border-hairline">
          <div>
            <h2 className="text-display-md text-ink">Your Links</h2>
            <p className="text-ink-muted text-sm mt-1">Manage and organize your curated collection.</p>
          </div>
          <Link
            href="/dashboard/new-bookmark"
            className="bg-accent-green text-white hover:opacity-90 font-semibold text-sm font-medium py-2 px-6 rounded-full transition-all duration-200 shadow-sm"
          >
            Create New
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <BookmarksList userId={user.id} />
        </div>

        <div className="mt-16 space-y-8">
          <div className="p-6 bg-surface-1 rounded-xl border border-hairline shadow-sm">
            <h3 className="text-caption text-ink uppercase mb-4">Sharing</h3>
            <div className="flex items-center justify-between p-4 bg-canvas rounded-lg border border-hairline">
              <div className="space-y-1">
                <p className="text-sm font-medium text-ink">Public Profile URL</p>
                {profile?.handle ? (
                  <a
                    href={publicProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-accent-green hover:underline"
                  >
                    {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/{profile.handle}
                  </a>
                ) : (
                  <p className="text-xs text-ink-muted font-medium italic">Pending handle configuration...</p>
                )}
              </div>
              {profile?.handle && (
                <div className="bg-surface-2 text-accent-green text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active</div>
              )}
            </div>
          </div>

          <div className="p-6 bg-surface-1 rounded-xl border border-hairline shadow-sm">
            <h3 className="text-caption text-ink uppercase mb-4">Account Settings</h3>
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
