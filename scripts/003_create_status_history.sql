-- Create table to track status change history (optional for analytics)
create table if not exists public.status_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  is_locked_in boolean not null,
  message text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.status_history enable row level security;

-- Create policies for status history
create policy "Users can view their own status history" 
  on public.status_history for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own status history" 
  on public.status_history for insert 
  with check (auth.uid() = user_id);

-- Create index for better performance
create index if not exists status_history_user_id_idx on public.status_history(user_id);
create index if not exists status_history_created_at_idx on public.status_history(created_at desc);
