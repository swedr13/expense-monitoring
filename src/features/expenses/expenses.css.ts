import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/vars.css";

// --- Expenses tab ------------------------------------------------------------

export const rowList = style({
  display: "flex",
  flexDirection: "column",
});

/** Row number on the left, the row's fields beside it. */
export const row = style({
  display: "grid",
  gridTemplateColumns: "2rem minmax(0, 1fr)",
  gap: vars.space.sm,
  paddingBlock: vars.space.sm,
  selectors: {
    "& + &": { borderTop: `1px solid ${vars.color.border}` },
  },
});

export const rowNumber = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: vars.touchTarget,
  color: vars.color.textSecondary,
  fontSize: vars.font.sizeSm,
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
});

export const rowFields = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  minWidth: 0,
});

/** Amount and categories share a line when there's room, and wrap on narrow phones. */
export const rowMain = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  columnGap: vars.space.md,
  rowGap: vars.space.xs,
});

export const amountInput = style({
  flex: "1 1 10rem",
  minWidth: 0,
  width: "auto",
});

export const categories = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.md,
});

/** The whole label is the tap target, at least 44px tall. */
export const categoryOption = style({
  display: "inline-flex",
  alignItems: "center",
  minHeight: vars.touchTarget,
  marginInlineEnd: 0,
});

export const addButton = style({
  marginTop: vars.space.sm,
});

export const totalBar = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: vars.space.md,
  marginTop: vars.space.md,
  padding: vars.space.md,
  borderRadius: vars.radius,
  background: `color-mix(in srgb, ${vars.color.primary} 10%, transparent)`,
});

export const totalLabel = style({
  color: vars.color.textSecondary,
  fontWeight: 600,
});

export const totalValue = style({
  color: vars.color.textHeading,
  fontSize: vars.font.sizeXl,
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
});

// --- Records tab -------------------------------------------------------------

/** A panel's title: the date and total, with the Food/Others summary under it. */
export const dayHeading = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  minWidth: 0,
});

export const dayLabel = style({
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
});

/** Food and Others each on their own line on phones, side by side when there's room. */
export const daySummary = style({
  display: "flex",
  flexWrap: "wrap",
  columnGap: vars.space.md,
  rowGap: vars.space.xs,
  color: vars.color.textSecondary,
  fontSize: vars.font.sizeSm,
  fontVariantNumeric: "tabular-nums",
});

export const recordLine = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: vars.space.md,
  width: "100%",
  minWidth: 0,
});

export const recordAmount = style({
  flexShrink: 0,
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
});

export const recordDetail = style({
  minWidth: 0,
  color: vars.color.textSecondary,
  textAlign: "end",
  overflowWrap: "anywhere",
});
