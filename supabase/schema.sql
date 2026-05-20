-- FuelMate Pro — database schema
-- Run this in your Supabase SQL editor after creating a new project.

-- Profiles linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  brand text,
  model text,
  year int,
  fuel_type text check (fuel_type in ('Petrol','Diesel','Electric','Hybrid')),
  plate text,
  odometer int default 0,
  image_url text,
  color text,
  health_score int default 100,
  created_at timestamptz default now()
);

create table if not exists public.fuel_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  date date not null,
  liters numeric(10,2) not null,
  cost numeric(10,2) not null,
  station text,
  odometer int,
  mileage numeric(10,2),
  created_at timestamptz default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  category text not null,
  amount numeric(10,2) not null,
  date date not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  title text not null,
  type text,
  due_date date not null,
  priority text check (priority in ('low','medium','high')) default 'medium',
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.fuel_logs enable row level security;
alter table public.expenses enable row level security;
alter table public.reminders enable row level security;

-- Policies: each user can only see and modify their own rows
create policy "Own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Own vehicles" on public.vehicles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Own fuel logs" on public.fuel_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Own expenses" on public.expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Own reminders" on public.reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();