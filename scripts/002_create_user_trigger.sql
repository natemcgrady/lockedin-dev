-- Create function to handle new user creation from OAuth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (
    id, 
    username, 
    display_name, 
    avatar_url, 
    x_user_id
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'Anonymous User'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    coalesce(new.raw_user_meta_data ->> 'provider_id', new.raw_user_meta_data ->> 'sub', new.id::text)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create trigger to automatically create user profile on signup
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
