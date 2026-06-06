# EagerMinds Bookmarks App

A personal bookmarks application where users can share their favorite links with the world. Think "Linktree meets Pocket".

## Features

- **User Accounts**: Sign up and log in with email + password
- **Bookmarks Management**: Add, edit, and delete bookmarks with title, URL, and privacy settings
- **Privacy Controls**: Mark bookmarks as public or private
- **Public Profiles**: Each user has a unique `@handle` and can share their public bookmarks at `/@handle`
- **Welcome Emails**: New users receive a confirmation email via Resend
- **Row-Level Security**: Built with Supabase RLS to ensure users can only access their own bookmarks. The schema rules in `schema.sql` completely restrict users from viewing or modifying other accounts.

## Tech Stack

- **Frontend**: Next.js (App Router) with TypeScript and Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth (email/password)
- **Email**: Resend
- **Deployment**: Vercel

## Running Locally

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Create a `.env.local` file with the following keys from your Supabase and Resend platforms:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Set up Supabase Database**:
Run the SQL queries stored in `schema.sql` located inside the root repository directly inside the Supabase SQL editor. This sets up the databases, extensions, constraints, and Row Level Security.

4. **Run the development server**:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## AI Agent Fixes

**Mistakes and Corrections**: 
Initially, my AI agent wrote a broken Next.js Middleware that eagerly checked `.startsWith("/auth")` to redirect authenticated users. This broke the ability to issue POST requests to `/auth/logout`, locking users in a logged-in state. I stepped in and commanded it to exclude the logout path from this check, successfully resolving the bug. Second, the agent generated hardcoded dark gray text colors against dark-themed design tokens (making them completely illegible); I re-prompted the agent to write a script strictly exchanging all hardcoded hex values across `app` and `components` to use natively scaled semantic design tokens under our CSS theme, achieving a consistently beautiful and accessible UI.

## Future Improvements

**One thing I'd improve with more time**: 
I would implement interactive link curation fetching URL metadata (Open Graph tags: automatic Titles, Descriptions, and Image thumbnails) on the backend using Edge Functions the moment the user drops a link, avoiding manual typing and vastly upgrading the Linktree-style presentation!

## License
MIT
