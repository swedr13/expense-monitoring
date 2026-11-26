-- Expense Monitoring: every row gets a note, and a row can be left out of the total.
-- Apply by hand in the SQL Editor of atchupikol-DEV (never atchupikol-prod, never `db push`).
-- Then run `npm run db:types`.

-- A note is no longer tied to Others: every expense has a "what was it?" text.
-- `category` stays for rows saved before this; new rows leave it null.
alter table expenses.expenses drop constraint if exists expenses_note_check;

-- The checkbox before each amount. Unticked rows are kept but not counted in totals.
alter table expenses.expenses add column included boolean not null default true;
