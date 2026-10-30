-- Run this in your Supabase SQL Editor to create the responses table

create table if not exists public.responses (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  first_name   text,
  last_name    text,

  -- Task 1: Forum Information
  task1_completed  text,
  task1_ease       smallint check (task1_ease between 1 and 5),
  task1_feedback   text,

  -- Task 2: Member Directory
  task2_completed  text,
  task2_ease       smallint check (task2_ease between 1 and 5),
  task2_feedback   text,

  -- Task 3: Member Exchange
  task3_completed  text,
  task3_ease       smallint check (task3_ease between 1 and 5),
  task3_feedback   text,

  -- Task 4: Member Profile
  task4_completed  text,
  task4_ease       smallint check (task4_ease between 1 and 5),
  task4_feedback   text,

  -- Overall feedback
  overall_navigation           smallint check (overall_navigation between 1 and 5),
  overall_most_useful          text,
  overall_missing              text,
  overall_exchange_likelihood  smallint check (overall_exchange_likelihood between 1 and 5),
  overall_encouragement        text,
  overall_change               text
);

-- Allow anonymous inserts (for questionnaire submissions)
alter table public.responses enable row level security;

create policy "Allow anonymous insert"
  on public.responses
  for insert
  to anon
  with check (true);

-- Allow authenticated reads (used via server-side API route with service role key)
-- The admin API route uses the anon key but checks the password server-side,
-- so we also allow anon selects — the password protection is in the API route.
create policy "Allow anon select"
  on public.responses
  for select
  to anon
  using (true);
