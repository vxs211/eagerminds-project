-- Supabase Schema for EagerMinds Bookmarks App

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE --
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  handle text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for profiles
alter table profiles enable row level security;

-- Profiles: Anyone can read profiles (public for /handle page)
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- Profiles: Users can insert their own profile
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

-- Profiles: Users can update own profile
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);


-- BOOKMARKS TABLE --
create table bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  is_public boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS for bookmarks
alter table bookmarks enable row level security;

-- Bookmarks Privacy Requirement:
-- "One user must never be able to read, edit, or delete another user's data. 
-- Treat this as a real requirement, not a UI detail."

-- Policy 1: A user can read their own bookmarks (whether public or private)
create policy "Users can view their own bookmarks." on bookmarks
  for select using (auth.uid() = user_id);

-- Policy 2: Anyone can read bookmarks IF they are marked as public
-- (this enables the /handle public profile feature)
create policy "Public bookmarks are viewable by everyone." on bookmarks
  for select using (is_public = true);

-- Policy 3: A user can insert their own bookmarks
create policy "Users can insert their own bookmarks." on bookmarks
  for insert with check (auth.uid() = user_id);

-- Policy 4: A user can update their own bookmarks
create policy "Users can update their own bookmarks." on bookmarks
  for update using (auth.uid() = user_id);

-- Policy 5: A user can delete their own bookmarks
create policy "Users can delete their own bookmarks." on bookmarks
  for delete using (auth.uid() = user_id);
