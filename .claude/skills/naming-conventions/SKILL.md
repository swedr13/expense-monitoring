---
name: naming-conventions
description: Where a new file goes in Expense Monitoring and what it is called — feature-folder rules, file naming by kind, and import rules. Use before creating or moving any component, hook, api module, style, page, migration or test.
---

# Naming & Pathing Conventions

**Rule zero: never invent a convention this repo already has.** Before naming or placing anything,
open the two nearest existing siblings and copy their vocabulary and file shape.

A file belongs to the **feature it serves**, never to a top-level folder named after its kind.
An expense component lives in `features/expenses/components/`, not in `src/components/`.

## Where a new file goes

| Kind                | Path                                               | Naming                                             | Example                                        |
| ------------------- | -------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------- |
| Page (route shell)  | `src/pages/<Name>Page.tsx`                         | PascalCase + `Page`                                | `HomePage.tsx`                                 |
| Feature component   | `src/features/<feature>/components/<Name>.tsx`     | PascalCase, named export                           | `ExpenseRow.tsx`                               |
| Feature hook        | `src/features/<feature>/hooks/use<Name>.ts`        | camelCase `use…`                                   | `useTodayExpenses.ts`                          |
| Supabase calls      | `src/features/<feature>/api.ts`                    | one module per feature, named functions            | `createExpense()`                              |
| Query keys          | `src/features/<feature>/queryKeys.ts`              | `<feature>Keys` object                             | `expenseKeys.day(day)`                         |
| Feature styles      | `src/features/<feature>/<feature>.css.ts`          | vanilla-extract                                    | `expenses.css.ts`                              |
| Feature types       | `src/features/<feature>/types.ts`                  | PascalCase types, no `I` prefix                    | `Expense`, `ExpenseDraft`                      |
| Pure helpers        | `src/features/<feature>/summary.ts`                | camelCase functions, no React/Supabase             | `groupByDay()`                                 |
| Shared component    | `src/shared/components/<Name>.tsx`                 | only when 2+ features use it                       | `OfflineBanner.tsx`                            |
| Shared hook         | `src/shared/hooks/use<Name>.ts`                    |                                                    | `useOnlineStatus.ts`                           |
| Shared lib          | `src/shared/lib/<name>.ts`                         | camelCase                                          | `supabase.ts`, `dayjs.ts`                      |
| Generated DB types  | `src/shared/lib/database.types.ts`                 | generated — never hand-edit                        |                                                |
| Migration           | `supabase/migrations/<timestamp>_<snake_name>.sql` | `YYYYMMDDHHMMSS_<snake_name>.sql`, written by hand | `…_expenses_schema.sql`                        |
| Unit/component test | `test/<mirrors src path>/<Name>.test.ts[x]`        |                                                    | `test/features/expenses/ExpenseSheet.test.tsx` |

Feature folder names are lowercase single words: `identity`, `expenses`.

## Code naming

- Components, types: `PascalCase`. Functions, variables, hooks: `camelCase`. Constants:
  `camelCase` (or `SCREAMING_SNAKE` only for true env-like constants).
- Database: everything lives in the `expenses` schema. `snake_case` tables (plural) and columns
  (`spent_on`). Enums as Postgres `text` + `check` constraint, mirrored in TS as string unions
  (`ExpenseCategory = "food" | "others"`).
- Booleans read as questions: `isOnline`, `isUnchanged`.
- Prefer named exports. Default export only where a tool needs it (lazy-loaded pages).

## Imports

- Across features or from shared: the `@/` alias — `import { supabase } from '@/shared/lib/supabase'`.
- Within the same feature: relative — `import { createExpense } from '../api'`.
- A feature may import from `shared/` and from another feature's **public** hooks/components,
  never from another feature's `api.ts` internals. If that's needed, move the code to `shared/`.
