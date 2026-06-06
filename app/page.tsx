import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-[#171717] mb-6">
            Bookmarks
          </h1>
          <p className="text-xl text-[#4d4d4d] max-w-2xl mx-auto mb-10 leading-relaxed">
            A stark, minimal platform to share your favorite links with the world. Think Linktree, but focused on text and speed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-10 py-3 bg-[#171717] text-white font-medium rounded-full border border-[#171717] hover:bg-white hover:text-[#171717] transition-all duration-200 shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto px-10 py-3 bg-[#171717] text-white font-medium rounded-full border border-[#171717] hover:bg-white hover:text-[#171717] transition-all duration-200 shadow-sm"
                >
                  Start Saving
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto px-10 py-3 bg-white text-[#4d4d4d] font-medium rounded-full border border-[#ebebeb] hover:border-[#a1a1a1] transition-all duration-200"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
          
          <div className="mt-20 pt-10 border-t border-[#f5f5f5]">
            <p className="text-sm font-mono text-[#888888] tracking-widest uppercase">
              Built for researchers, designers, and developers
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
