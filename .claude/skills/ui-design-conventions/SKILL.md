---
name: ui-design-conventions
description: How a screen in Expense Monitoring must look and be composed — mobile-first layout, antd composition, vanilla-extract token rules, touch targets and accessibility. Use before building or restyling any page, card, list, form, modal or drawer.
---

# UI & Design Conventions

**A new screen must look like it was always here.** Before drawing anything, open the nearest
existing screen and copy how it composes antd. The app is used on a phone, often one-handed,
right after paying for something — design for that first, then let it widen for tablet and
desktop.

## Mobile-first layout

- Design at **360px wide** first. Base styles are the phone styles; widen with
  `@media (min-width: …)` using the breakpoints in `src/shared/styles/breakpoints.ts`.
- One column on phones. An expense row's amount and Food/Others share a line when there's room
  and wrap on narrow phones.
- No horizontal page scroll at any width. Long notes wrap (`overflowWrap: "anywhere"`).
- **Touch targets at least 44×44px.** Fields and primary buttons are `size="large"`; the
  Food/Others checkbox labels have `minHeight: vars.touchTarget`. "Add another expense" is
  `block` on phones.
- Amount fields are antd `InputNumber` with `inputMode="decimal"`, `min={0}`, `precision={2}`
  and the `₱` prefix, so the phone shows the number pad.
- Respect safe-area insets (`env(safe-area-inset-*)`) — the app runs installed, full-screen.

## The look (copied from AtchupikolQ, itself from the CSMS bca2 "portal" design)

Lavender page / navy dark mode, faint ring backdrop, frosted header, 20px-rounded panel cards with
soft shadows, blurred modal masks with a gradient header and tinted footer, 48px fields with a
focus ring, Phosphor duotone icons in tinted tiles, Inter type. Almost all of it is applied
globally — a new screen gets it by composing the pieces below:

| Need                     | Use                                                                   |
| ------------------------ | --------------------------------------------------------------------- |
| Page heading             | `PageTitle` (`@/shared/components/PageTitle`)                         |
| Card title               | `title={<PanelTitle icon={<PiXxxDuotone />}>Text</PanelTitle>}`       |
| Money                    | `formatPeso()` from `features/expenses/summary.ts` — `₱1,250.00`      |
| Icons                    | `react-icons/pi` (Phosphor) — duotone in tiles/menus, bold in buttons |
| Modal, drawer, card skin | nothing — `componentConfig` in `src/app/theme.ts` applies it          |

- Never use a raw antd `Tag` with a `color` for status. Don't add `@ant-design/icons`.
- The header shows a text brand ("Expense Monitoring") until `public/app-icon.png` is replaced
  and `npm run generate-pwa-assets` has been run.
- The theme lives in `src/app/`: `palette.ts` (surfaces, tones, swatches), `theme.ts` (antd
  tokens + skin), `skin.css.ts`, `ThemePicker.tsx` (floating palette button + header sun/moon),
  `useThemePreference.ts` (mode and colour per device in `localStorage` under
  `expenses:theme-mode` / `expenses:theme-color` — never the database).
- The primary colour is user-chosen: style with `vars.color.primary` / `primaryText`, and tint
  it in CSS with `color-mix(in srgb, ${vars.color.primary} N%, transparent)` — never a fixed hex.

## Composition

- **Page shell:** `src/pages/<Name>Page.tsx` renders a `PageTitle` and feature components. No
  data fetching, no layout maths. `HomePage` holds the two tabs, Expenses and Records, with the
  active tab in `?tab=`.
- **Expenses tab:** one `Card` holding an antd `Form` + `Form.List` of rows, the
  "Add another expense" button, and the read-only Total (an `<output>`, never an input).
- **Records tab:** antd `Collapse`, one panel per day, **no `defaultActiveKey`** — every panel
  starts closed. Panel title `ddd, MMM D, YYYY · ₱total`; the body is an antd `List`.
- **Modals vs drawers:** a short confirm is `Modal.confirm` (via `App.useApp().modal`);
  a form on a phone is a `Drawer` with `placement="bottom"`; on desktop a `Modal`.
- **Feedback:** `App.useApp()` → `message` for quick confirmations and save errors,
  `notification` for errors that need reading. Never `alert`, never a custom toast.
- **Loading / empty / error:** every data view handles all three — `DataState` (antd
  `Skeleton`, `Empty`, and `Alert` with a retry button).
- **Forms:** antd `Form` only. Labelled fields; in repeated rows, where a visible label on every
  field would be noise, each row is a named `role="group"` and each field has an `aria-label`
  (`Expense 3 amount`). Never a placeholder as the only label.
- **Dates:** `dayjs(...).format('ddd, MMM D, YYYY')`; "today" is always `manilaDay()`.

## Styling rules — non-negotiable

- All styling is **vanilla-extract** (`*.css.ts`), colocated in the feature folder
  (`features/expenses/expenses.css.ts`) or in `src/shared/styles/` when shared.
  No inline style objects, no styled-components, no Tailwind, no `.css` files.
- **Never hardcode a colour, spacing or font size.** Use the token contract in
  `src/shared/styles/vars.css.ts` (`vars.color.primary`, `vars.space.md`, `vars.font.sizeLg` …).
- The contract is filled from the live antd token by `ThemeBridge` (`src/app/ThemeBridge.tsx`),
  which uses `useToken()` + `assignInlineVars`. That is what makes dark mode and the brand colour
  apply to vanilla-extract styles. Don't read `theme.useToken()` in feature components for styling —
  use the vars.
- antd's own look is configured once in `src/app/theme.ts` (`ConfigProvider theme`). Change a
  component's default look there, not with overrides scattered in features.

## Accessibility (WCAG 2.1 AA)

- Every interactive element has an accessible name. Icon-only buttons get `aria-label`
  and a `Tooltip`.
- The Total is an `<output>` labelled "Total" — read-only and announced politely.
- Don't convey state with colour alone; keep text contrast at AA in both themes and with every
  theme colour (`test/shared/lib/color.test.ts` checks the swatches).
- Visible focus styles stay on. Order of focus follows the visual order.
- New screens get an axe test (`test/a11y.ts`). jsdom can't check contrast — verify it in a browser.

## Make it shared, not copied

- Check `src/shared/components/` before building a visual element.
- If a shared component almost fits, **extend it with a prop or variant** — don't fork it.
- The moment a second feature needs an element, promote it to `src/shared/components/`.
