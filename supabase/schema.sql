-- ============================================================
-- GrowthOS database schema for Supabase (PostgreSQL)
-- Run in Supabase SQL Editor, or `supabase db push`.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  company text,
  plan text not null default 'free' check (plan in ('free','pro','team')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'inactive',
  ai_generations_used int not null default 0,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- leads (CRM) ----------
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  company text,
  email text,
  status text not null default 'new'
    check (status in ('new','contacted','qualified','won','lost')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_user_id_idx on public.leads(user_id);

-- ---------- lead_finder_results ----------
create table if not exists public.lead_finder_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  industry text,
  location text,
  company_size text,
  customer_profile text,
  prospects jsonb,
  outreach_strategy text,
  created_at timestamptz not null default now()
);
create index if not exists lfr_user_id_idx on public.lead_finder_results(user_id);

-- ---------- generated_emails ----------
create table if not exists public.generated_emails (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text,
  prospect_name text,
  product_description text,
  cold_email text,
  linkedin_dm text,
  follow_up_email text,
  created_at timestamptz not null default now()
);
create index if not exists ge_user_id_idx on public.generated_emails(user_id);

-- ---------- chat_messages (sales assistant) ----------
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists cm_user_id_idx on public.chat_messages(user_id);

-- ---------- ai_usage_events (metering) ----------
create table if not exists public.ai_usage_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null,
  created_at timestamptz not null default now()
);
create index if not exists aue_user_id_idx on public.ai_usage_events(user_id);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_leads_updated on public.leads;
create trigger trg_leads_updated before update on public.leads
  for each row execute function public.set_updated_at();

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_finder_results enable row level security;
alter table public.generated_emails enable row level security;
alter table public.chat_messages enable row level security;
alter table public.ai_usage_events enable row level security;

-- profiles
drop policy if exists "own profile select" on public.profiles;
create policy "own profile select" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update using (auth.uid() = id);

-- generic owner policies macro (repeated per table)
drop policy if exists "leads owner all" on public.leads;
create policy "leads owner all" on public.leads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lfr owner all" on public.lead_finder_results;
create policy "lfr owner all" on public.lead_finder_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ge owner all" on public.generated_emails;
create policy "ge owner all" on public.generated_emails
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cm owner all" on public.chat_messages;
create policy "cm owner all" on public.chat_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "aue owner all" on public.ai_usage_events;
create policy "aue owner all" on public.ai_usage_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- NOTE: Admin dashboard and Stripe webhook use the service-role key,
-- which bypasses RLS. Never expose the service-role key to the client.
