-- Run this migration in the Supabase SQL Editor before enabling cloud sync.
-- Every table is owned by auth.users and protected by Row Level Security (RLS).

create extension if not exists pgcrypto;

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  color text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lectures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  lecture_name text not null,
  course text not null default '',
  faculty text not null default '',
  completed_date date not null,
  difficulty text not null,
  priority text not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.revision_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lecture_id uuid not null references public.lectures(id) on delete cascade,
  revision_number integer not null,
  label text not null,
  due_date date not null,
  completed boolean not null default false,
  completed_at timestamptz,
  priority text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.personal_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  category text not null default 'Personal',
  priority text not null default 'Medium',
  deadline date,
  deadline_time text,
  notes text not null default '',
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  color text not null,
  icon text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  log_date date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Indexes
create unique index if not exists subjects_user_name_idx on public.subjects (user_id, lower(name));
create index if not exists subjects_user_sort_idx on public.subjects (user_id, sort_order);
create index if not exists lectures_user_subject_date_idx on public.lectures (user_id, subject_id, completed_date desc);
create index if not exists revision_tasks_user_date_idx on public.revision_tasks (user_id, due_date);
create index if not exists personal_tasks_user_deadline_idx on public.personal_tasks (user_id, deadline);
create index if not exists habits_user_sort_idx on public.habits (user_id, sort_order);
create index if not exists habit_logs_user_date_idx on public.habit_logs (user_id, log_date desc);

-- Automatic updated_at trigger function
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subjects_set_updated_at on public.subjects;
create trigger subjects_set_updated_at before update on public.subjects for each row execute function public.set_updated_at();

drop trigger if exists lectures_set_updated_at on public.lectures;
create trigger lectures_set_updated_at before update on public.lectures for each row execute function public.set_updated_at();

drop trigger if exists revision_tasks_set_updated_at on public.revision_tasks;
create trigger revision_tasks_set_updated_at before update on public.revision_tasks for each row execute function public.set_updated_at();

drop trigger if exists personal_tasks_set_updated_at on public.personal_tasks;
create trigger personal_tasks_set_updated_at before update on public.personal_tasks for each row execute function public.set_updated_at();

drop trigger if exists habits_set_updated_at on public.habits;
create trigger habits_set_updated_at before update on public.habits for each row execute function public.set_updated_at();

drop trigger if exists habit_logs_set_updated_at on public.habit_logs;
create trigger habit_logs_set_updated_at before update on public.habit_logs for each row execute function public.set_updated_at();

drop trigger if exists user_settings_set_updated_at on public.user_settings;
create trigger user_settings_set_updated_at before update on public.user_settings for each row execute function public.set_updated_at();

-- Enable Row Level Security (RLS)
alter table public.subjects enable row level security;
alter table public.lectures enable row level security;
alter table public.revision_tasks enable row level security;
alter table public.personal_tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.user_settings enable row level security;

-- Row Level Security Policies
drop policy if exists "users manage own subjects" on public.subjects;
create policy "users manage own subjects" on public.subjects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users manage own lectures" on public.lectures;
create policy "users manage own lectures" on public.lectures for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users manage own revision tasks" on public.revision_tasks;
create policy "users manage own revision tasks" on public.revision_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users manage own personal tasks" on public.personal_tasks;
create policy "users manage own personal tasks" on public.personal_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users manage own habits" on public.habits;
create policy "users manage own habits" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users manage own habit logs" on public.habit_logs;
create policy "users manage own habit logs" on public.habit_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users manage own settings" on public.user_settings;
create policy "users manage own settings" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
