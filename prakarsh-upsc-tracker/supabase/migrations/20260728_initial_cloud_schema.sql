-- Run this migration in the Supabase SQL Editor before enabling cloud sync.
-- Every table is owned by auth.users and protected by RLS.

create extension if not exists pgcrypto;

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  color text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lectures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  lecture_name text not null,
  course text not null default '', faculty text not null default '', completed_date date not null,
  difficulty text not null, priority text not null, notes text not null default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.revision_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lecture_id uuid not null references public.lectures(id) on delete cascade,
  revision_number integer not null, label text not null, due_date date not null,
  completed boolean not null default false, completed_at timestamptz, priority text not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0), color text not null, icon text,
  active boolean not null default true, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  log_date date not null, completed boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);

create unique index subjects_user_name_idx on public.subjects (user_id, lower(name));
create index subjects_user_sort_idx on public.subjects (user_id, sort_order);
create index lectures_user_subject_date_idx on public.lectures (user_id, subject_id, completed_date desc);
create index revision_tasks_user_date_idx on public.revision_tasks (user_id, due_date);
create index habits_user_sort_idx on public.habits (user_id, sort_order);
create index habit_logs_user_date_idx on public.habit_logs (user_id, log_date desc);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger subjects_set_updated_at before update on public.subjects for each row execute function public.set_updated_at();
create trigger lectures_set_updated_at before update on public.lectures for each row execute function public.set_updated_at();
create trigger revision_tasks_set_updated_at before update on public.revision_tasks for each row execute function public.set_updated_at();
create trigger habits_set_updated_at before update on public.habits for each row execute function public.set_updated_at();
create trigger habit_logs_set_updated_at before update on public.habit_logs for each row execute function public.set_updated_at();
create trigger user_settings_set_updated_at before update on public.user_settings for each row execute function public.set_updated_at();

alter table public.subjects enable row level security;
alter table public.lectures enable row level security;
alter table public.revision_tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.user_settings enable row level security;

create policy "users manage own subjects" on public.subjects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own lectures" on public.lectures for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own revision tasks" on public.revision_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own habits" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own habit logs" on public.habit_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own settings" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
