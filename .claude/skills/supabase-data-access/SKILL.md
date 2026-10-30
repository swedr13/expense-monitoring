---
name: supabase-data-access
description: How Expense Monitoring talks to Supabase — its own `expenses` schema inside AtchupikolQ's shared dev project, migrations as files applied by hand in the SQL Editor, RLS on own rows, plain table writes from api.ts, and key/secret handling. Use before touching any table, policy, migration or Supabase client code.
---

# Supabase Data Access

## Environment and who does what

- **No project of its own.** The app uses a separate **`expenses` schema** in AtchupikolQ's
  **`atchupikol-dev`** project. Never touch the `public` schema (it is AtchupikolQ's), and never
  target `atchupikol-prod`. There is no local Docker stack.
- **Claude writes** migration files and runs read-only commands.
- **The user runs** anything that changes a remote project: `npx supabase link` (to the dev
  project), the migration SQL in the dashboard's **SQL Editor**, dashboard settings
  (Data API → Exposed schemas must include `expenses`). Hand them the file and say which project.
- **Never `supabase db push` from this repo.** The project's migration history belongs to
  AtchupikolQ; pushing from here would conflict with it.

## Migrations

- Every schema change is a new file `supabase/migrations/<YYYYMMDDHHMMSS>_<snake_name>.sql`.
  Never edit a migration that has been applied — write a new one.
- Everything is schema-qualified: `expenses.expenses`, `expenses.set_updated_at()`. Nothing is
  created in `public`.
- After the user has applied a migration: `npm run db:types` regenerates
  `src/shared/lib/database.types.ts` (`--schema expenses`).

## Tables and RLS

- `alter table … enable row level security` in the same migration that creates the table.
  A table without policies is unreachable — that's the safe default.
- Grant to `authenticated` only (`grant usage on schema expenses`, then per-table grants).
  The phone signs in anonymously and is `authenticated`. Never grant anything to `anon`.
- Every row belongs to one user: `user_id uuid not null default auth.uid()` and the policy
  `using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))`.
  AtchupikolQ's venue devices are also anonymous users of this project — RLS is what keeps
  these rows invisible to them. Never weaken or drop it.
- Wrap `auth.uid()` in a subselect inside policies (`(select auth.uid())`) so it's evaluated once.
- Functions get `EXECUTE` for `public`/`anon` by default — every new function must
  `revoke execute … from public, anon` (trigger functions: also from `authenticated`).
  Use `set search_path = ''` and fully qualified names.
- `updated_at` is stamped by the `expenses.set_updated_at()` trigger; `created_at` by its
  default. The client never sends timestamps or `user_id`.
- `spent_on` is the **Manila calendar day**, sent by the client from `manilaDay()`.

## Writes are plain table calls

There is one user writing only their own rows, so `features/expenses/api.ts` uses
`supabase.from('expenses').insert/update/delete` directly — no RPCs.

- Respect the constraints in the client too: `amount > 0`, `category in ('food', 'others')` or
  null, and a `note` only with `others`. `toExpenseValues()` in `api.ts` enforces this.
- When the category leaves Others, send `note: null` in the same update.
- List columns explicitly in `select`; order by `spent_on desc, position`.
- PostgREST returns at most 1000 rows per request — page with `.range()` when reading everything.

## Client

- One client: `src/shared/lib/supabase.ts`,
  `createClient<Database, "expenses">(url, key, { db: { schema: "expenses" }, auth: … })`,
  built from `env.ts` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) — the **dev**
  project's values.
- Sign-in is `supabase.auth.signInAnonymously()` once, from `AuthProvider`; the session persists.
- All calls live in a feature's `api.ts`; they unwrap `{ data, error }` with
  `@/shared/lib/result` and throw on error so TanStack Query sees failures.
- **Never** put a service-role / secret key in the repo, a `VITE_*` variable, or Vercel.

## Tests

There are no database tests here. Component tests mock `features/expenses/api.ts`. RLS is
verified by hand in the dev project: a second anonymous session must see none of the rows.
