---
name: frontend-engineering
description: Default working method for Expense Monitoring (React/Vite/antd/Supabase) — understand before changing, copy the nearest existing feature slice, reuse before building, make the smallest correct change, validate with npm run build, hand over a commit suggestion. Use for any feature, bug fix, or refactor.
---

# Frontend Engineering

The default workflow. `ui-design-conventions`, `naming-conventions` and `supabase-data-access`
are specializations of it.

## Workflow

1. **Locate** — infer the path from the feature name (`src/features/<feature>/…`), then verify
   with one direct read. Glob one feature folder before grepping the repo.
2. **Read the nearest existing slice** — the same feature's `api.ts`, hooks and components.
3. **Reuse inventory** — is there already something in `src/shared/` for this? (§ D)
4. **Change the smallest thing that is correct**, in the style already around it.
5. **Validate** (§ F).
6. **Close out** — commit subject + description (§ G).

**Questions go through the `AskUserQuestion` tool**, never as questions written in the reply. Up to
4 per call, 2–4 options each, the recommended option first with `(Recommended)` on its label.

## A. Understand before changing

- Open the two nearest siblings before writing a line. Their vocabulary and file shape are the spec.
- Don't fix things you weren't asked about — mention them instead.
- If the change needs a new column or policy, the database is the contract: write the
  migration first (`supabase-data-access`), have the user apply it, regenerate types, then build
  the UI on top.

## B. The feature slice

```
src/features/<feature>/
  api.ts                 Supabase calls only — typed, no React, no UI logic
  queryKeys.ts           the feature's TanStack Query keys
  hooks/use<Thing>.ts    useQuery / useMutation + orchestration
  components/<Name>.tsx  markup; reads data through hooks
  <feature>.css.ts       vanilla-extract styles for this feature
  types.ts               feature types derived from database.types.ts (only if needed)
  summary.ts             pure helpers (grouping, totals, formatting) — no React, no Supabase
```

- **Server state is TanStack Query.** Every read is a `useQuery` keyed from `queryKeys.ts`; every
  write is a `useMutation` that invalidates the affected keys on success. Never copy query data
  into `useState` — the one exception is a form's starting values (see § C).
- **Writes invalidate, they don't patch.** A successful insert/update/delete invalidates
  `expenseKeys.all` (today and records); the queries refetch the truth.
- **Expense writes are plain table calls** in `features/expenses/api.ts` (`insert`, `update`,
  `delete` on `expenses`), guarded by RLS. No RPCs.
- **Auto-save, no Save button.** `useExpenseMutations(day, saved).save(position, draft)` decides:
  an empty row that gets an amount → insert; a saved row whose amount, category or note
  changed → update (leaving Others sends `note: null`); a saved row whose amount was cleared →
  delete. Saves of one row run in order so a quick blur-then-tick can't insert twice.
- **Days are Manila days.** `spent_on` is `manilaDay()` from `@/shared/lib/dayjs`, never the
  phone's local date or UTC. `useManilaToday()` re-renders at Manila midnight and the sheet
  remounts with 10 empty rows.
- **Errors:** surface them through antd `App.useApp().message` with `getErrorMessage` from
  `@/shared/lib/errors`.

## C. Client state

| State                                              | Where it goes                            |
| -------------------------------------------------- | ---------------------------------------- |
| Data from Supabase                                 | TanStack Query                           |
| Form field values (the expense rows being typed)   | antd `Form.useForm()` + `Form.List`      |
| Current route, selected tab, filters worth sharing | the URL (React Router search params)     |
| Auth session                                       | `features/identity` session provider     |
| Theme mode and colour                              | `useThemePreference` (localStorage)      |
| A modal's open flag, a hover flag, a leaf toggle   | local `useState` in the owning component |

Only add a global store (e.g. Zustand) when two unrelated components genuinely need the same
client-only state — and ask first.

## D. Reuse before building

- Check `src/shared/components/` and `src/shared/hooks/` first.
- If something _almost_ fits, **add an optional prop or variant** with the current behaviour as the
  default, rather than forking a copy.
- The moment a second feature needs the same thing, move it to `src/shared/` and have both call it.
- Never hand-roll a table, list, form, modal, drawer, select, date picker or notification —
  antd has them.

## E. Componentization

- Page (`src/pages/`) → feature component → sub-components. The page only lays out feature
  components; it never owns a query.
- Logic in hooks, markup in components. A component that fetches _and_ computes is doing two jobs.
- Split by responsibility, not line count. One caller, ten lines, used once → leave it inline.

## F. Validate

- `npm run build` — the gate. It runs `tsc -b`, so it must pass with **zero** type errors.
- `npm run lint` and `npm run format:check`.
- `npm test` — and add/adjust tests for anything with logic (`test/` mirrors `src/`).
  New screens get an axe check with `expectNoA11yViolations` from `test/a11y.ts`.
  Component tests mock the feature's `api.ts` (keep the pure helpers with `importOriginal`) and
  `useAuth`; they never reach Supabase.

## G. Close-out

Every change ends with a commit subject **and** description. Only these prefixes:
`Feature:` / `BugFix:` / `HotFix:` / `Migration:`.

```
Feature: Add Expense Note Field

- Shows an optional "What was it?" input when Others is checked
- Clears the note when the category leaves Others
```

Bullets only, one line each, important changes only. Then list anything the user must do outside
the repo (run a migration in the SQL Editor, set an env var) as explicit numbered steps.

## H. Do not

- Don't put Supabase calls in components — they belong in the feature's `api.ts`.
- Don't use react-hook-form/formik; forms are antd `Form`.
- Don't hardcode a colour, spacing or font size — see `ui-design-conventions`.
- Don't add a dependency without saying why and asking first.
