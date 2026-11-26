-- Expense Monitoring: the Health checklist, one row per Manila day.
-- Apply by hand in the SQL Editor of atchupikol-DEV (never atchupikol-prod, never `db push`).
-- Then run `npm run db:types`.

-- ---------------------------------------------------------------------------
-- health_checks: which of the five habits were done on a day
-- ---------------------------------------------------------------------------
create table expenses.health_checks (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null default auth.uid() references auth.users (id) on delete cascade,
  checked_on         date not null,             -- the Manila calendar day, sent by the client
  worked_out         boolean not null default false,
  eat_less           boolean not null default false,
  drink_water        boolean not null default false,
  no_fast_food       boolean not null default false,
  no_liquid_calories boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (user_id, checked_on)                  -- one checklist per day; the client upserts on it
);

create trigger health_checks_updated_at
  before update on expenses.health_checks
  for each row execute function expenses.set_updated_at();

-- ---------------------------------------------------------------------------
-- Access: each signed-in (anonymous) user sees and writes only their own rows.
-- ---------------------------------------------------------------------------
alter table expenses.health_checks enable row level security;
create policy "own rows" on expenses.health_checks
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

grant select, insert, update, delete on expenses.health_checks to authenticated;
-- nothing for anon
