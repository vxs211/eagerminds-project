# Bookmarks App

A personal bookmarks application where users can share their favorite links with the world. Think "Linktree meets Pocket".

## Features

- **User Accounts**: Sign up and log in with email + password
- **Bookmarks Management**: Add, edit, and delete bookmarks with title, URL, and privacy settings
- **Privacy Controls**: Mark bookmarks as public or private
- **Public Profiles**: Each user has a unique `@handle` and can share their public bookmarks at `/u/@handle`
- **Welcome Emails**: New users receive a confirmation email via Resend
- **Row-Level Security**: Built with Supabase RLS to ensure users can only access their own bookmarks

## Tech Stack

- **Frontend**: Next.js 16 (App Router) with TypeScript and Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth (email/password)
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Resend account (free tier available)

### Local Development

1. **Clone and install dependencies**:

```bash
npm install
```

2. **Set up environment variables**:

Create a `.env.local` file with the following:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend
RESEND_API_KEY=your_resend_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Set up Supabase Database**:

Run the following SQL in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Bookmarks policies
CREATE POLICY "Users can read own bookmarks" 
  ON bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" 
  ON bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks" 
  ON bookmarks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" 
  ON bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read public bookmarks" 
  ON bookmarks FOR SELECT 
  USING (is_public = true);
```

4. **Run the development server**:

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Key Implementation Details

### Issue Caught and Fixed

**Issue**: The Next.js build was failing because client-side pages with Supabase imports were being prerendered at build time, but environment variables weren't available during the build process.

**Solution**: Separated server pages from client components by:
1. Creating server pages with `export const dynamic = "force-dynamic"` to prevent prerendering
2. Splitting client logic into separate `*-client.tsx` components that are only rendered in the browser
3. This ensures Supabase client initialization only happens at runtime when environment variables are available

### Security Considerations

- **Row-Level Security (RLS)**: All database policies enforce that `auth.uid()` is used to verify ownership
- **User-specific queries**: The `user_id` is derived from the authenticated session, not from request body
- **Public bookmarks**: Only bookmarks explicitly marked as public are visible on profile pages

## Improvements for Production

1. **Edit Bookmark Page**: Create `/dashboard/edit/[id]` page for editing existing bookmarks
2. **Input Validation**: Add more robust validation using Zod schemas
3. **Error Handling**: Improve error boundaries and user feedback
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Handle Uniqueness Check**: Add client-side validation to check handle availability before signup
6. **Analytics**: Add tracking for user activity and public profile views
7. **Bookmarks Categories**: Allow users to organize bookmarks into categories/collections
8. **Import/Export**: Allow users to export their bookmarks as JSON

## Deployment

The app is ready to deploy on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel project settings
4. Deploy with a single click

## Project Structure

```
├── app/
│   ├── api/              # API routes (auth, email)
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard and bookmarks
│   ├── u/[handle]/       # Public profile pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # Reusable components
├── utils/
│   └── supabase/         # Supabase utilities
├── middleware.ts         # Session and route protection
└── package.json
```

## License

MIT

## Support

For issues or questions, please open an issue in the GitHub repository.
