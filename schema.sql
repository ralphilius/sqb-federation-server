create table addresses (
  id uuid references auth.users not null primary key,
  username text unique,
  address text unique
);
alter table addresses enable row level security;
create policy "Can view own user data." on addresses for select using (auth.uid() = id);
create policy "Can update own user data." on addresses for update using (auth.uid() = id);

create table users (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  email text
);
alter table users enable row level security;
create policy "Can view own user data." on users for select using (auth.uid() = id);
create policy "Can update own user data." on users for update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);

  insert into public.addresses (id, username)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */
drop publication if exists supabase_realtime;
create publication supabase_realtime for table addresses;