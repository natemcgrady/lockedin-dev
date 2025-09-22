-- Create users table to store user profiles from X.com OAuth
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  x_user_id text unique not null,
  is_locked_in boolean default false,
  locked_in_message text,
  last_status_update timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policies for users table
create policy "Users can view all profiles" 
  on public.users for select 
  using (true);

create policy "Users can update their own profile" 
  on public.users for update 
  using (auth.uid() = id);

create policy "Users can insert their own profile" 
  on public.users for insert 
  with check (auth.uid() = id);

-- Create indexes for better performance
create index if not exists users_username_idx on public.users(username);
create index if not exists users_x_user_id_idx on public.users(x_user_id);
create index if not exists users_is_locked_in_idx on public.users(is_locked_in);
