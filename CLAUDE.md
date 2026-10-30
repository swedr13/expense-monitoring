# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

**Expense Monitoring** — a mobile-first, installable PWA for one person to log what they spend
each day, on their phone. No logins: the phone signs in anonymously once and the session
persists. Built with the same stack, structure and look as its sibling app, AtchupikolQ.

Stack: React 19 + TypeScript + Vite, Ant Design v6, vanilla-extract, TanStack Query v5,
React Router, Supabase (Postgres, Auth), vite-plugin-pwa, hosted on Vercel.

**In scope:** the Expenses tab (today's rows in Asia/Manila time, auto-saved, Food/Others with
an optional note, a running total) and the Records tab (one collapsed panel per day with its
total).
**Out of scope:** logins, an admin area, charts, budgets, categories beyond Food/Others, editing
past days, export, Realtime, push notifications.

## Load the matching skill before the first write

| Request                                                 | Load                                          |
| ------------------------------------------------------- | --------------------------------------------- |
| Any change, feature, bug fix, refactor                  | `frontend-engineering` (the default workflow) |
| Anything the user sees — screen, card, list, form       | `ui-design-conventions`                       |
| Naming or placing a new file                            | `naming-conventions`                          |
| The `expenses` schema, RLS, migrations, Supabase client | `supabase-data-access`                        |

Skills live in `.claude/skills/<name>/SKILL.md`. Reading and searching need no skill; the first
write does — a one-line fix is not an exemption.

## Execution mode — ask before the first write

Before creating or modifying any file in a conversation, ask how to proceed with the
**AskUserQuestion** tool (one single-select question, header `Exec mode`) and wait:

```text
Yes               Create and modify all necessary files without asking per file.
Manual Approval   Show each proposed file change and wait for approval before doing it.
No                Do not touch files; give the complete code and where it goes.
```

Skip the question only if it was already answered earlier in the same conversation.

## Commands — npm only

```bash
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build — the gate; must pass with zero errors
npm run lint
npm run format       # prettier --write . (format:check in CI)
npm test             # vitest run
npx vitest run <path>
npm run db:types     # regenerate src/shared/lib/database.types.ts (expenses schema) from the linked project
npm run generate-pwa-assets   # rebuild favicon and app icons from public/app-icon.png
```

## Structure

```
src/app/        App shell: providers, router, antd theme, global styles
src/features/   one folder per feature — identity, expenses — each with api.ts, hooks/,
                components/, *.css.ts
src/pages/      thin route shells; a page never owns a query
src/shared/     cross-feature components, hooks, lib (supabase client, env, db types), styles
supabase/       migrations/ — applied by hand in the dev project's SQL Editor, never pushed
test/           Vitest setup and the axe accessibility helper
```

Import with the `@/` alias (`@/shared/lib/supabase`). Inside a feature, use relative imports.

## Ground rules

- **Copy the nearest existing sibling.** Never invent a second way to do something that already
  has one. If two features need the same thing, move it to `src/shared/`.
- **Smallest correct change**, in the style already around it. No speculative abstractions.
- **Validate, then hand over a commit** — subject prefixed `Feature:` / `BugFix:` / `HotFix:` /
  `Migration:`, body as one-line `-` bullets.
- **Shared database:** this app has no Supabase project of its own. It lives in the `expenses`
  schema of AtchupikolQ's **`atchupikol-dev`** project. Never touch `public`, never target
  `atchupikol-prod`.
- **Security:** only `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and
  `VITE_TURNSTILE_SITE_KEY` may reach the browser. A service-role or secret key never goes in
  this repo, in a `VITE_*` variable, or in Vercel.

## Do not

- Never run `supabase db push` from this repo — the project's migration history belongs to
  AtchupikolQ. Write the migration file, then hand it to the user to run in the SQL Editor.
- Never apply SQL to a remote project or change Supabase/Vercel/GitHub settings yourself.
- Never grant anything on the `expenses` schema to `anon`, and never drop the `own rows` policy.
- Never commit `.env*.local` or print secret values.
- Don't use react-hook-form/formik (forms are antd `Form`), Tailwind, styled-components, inline
  style objects or raw `.css` files.
