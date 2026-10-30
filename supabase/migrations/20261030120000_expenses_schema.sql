-- Expense Monitoring: its own `expenses` schema inside the shared atchupikol-DEV project.
-- Never touches `public`. Applied by hand in the SQL Editor — this repo never runs
-- `supabase db push` (the project's migration history belongs to AtchupikolQ).
-- After applying: Project Settings → Data API → Exposed schemas → add `expenses`.

create schema if not exists expenses;

-- ---------------------------------------------------------------------------
-- expenses: one row per amount typed on the Expenses tab
-- ---------------------------------------------------------------------------
create table expenses.expenses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  spent_on   date not null,                      -- the Manila calendar day, sent by the client
  position   int  not null,                      -- row order on that day
  amount     numeric(12, 2) not null check (amount > 0),
  category   text check (category in ('food', 'others')),   -- null = uncategorised
  note       text check (note is null or category = 'others'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on expenses.expenses (user_id, spent_on desc, position);

-- ---------------------------------------------------------------------------
-- updated_at, stamped by the server
-- ---------------------------------------------------------------------------
create function expenses.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- trigger functions are never called directly
revoke execute on function expenses.set_updated_at() from public, anon, authenticated;

create trigger expenses_updated_at
  before update on expenses.expenses
  for each row execute function expenses.set_updated_at();

-- ---------------------------------------------------------------------------
-- Access: each signed-in (anonymous) user sees and writes only their own rows.
-- AtchupikolQ's venue devices are authenticated too; RLS keeps these rows from them.
-- ---------------------------------------------------------------------------
alter table expenses.expenses enable row level security;
create policy "own rows" on expenses.expenses
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

grant usage on schema expenses to authenticated;
grant select, insert, update, delete on expenses.expenses to authenticated;
-- nothing for anon
