import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/vars.css";

// --- Today ------------------------------------------------------------------

/** Sits under the Expense card's total. */
export const healthCard = style({
  marginTop: vars.space.md,
});

/** One habit per line. */
export const habitList = style({
  display: "flex",
  flexDirection: "column",
});

/** The whole label is the tap target, at least 44px tall. */
export const habitOption = style({
  display: "flex",
  alignItems: "center",
  minHeight: vars.touchTarget,
  marginInlineStart: 0,
  selectors: {
    "& + &": { borderTop: `1px solid ${vars.color.border}` },
  },
});

// --- Records ----------------------------------------------------------------

export const habitLine = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.md,
  width: "100%",
});

const habitStatusBase = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.xs,
  flexShrink: 0,
  fontWeight: 600,
});

export const habitStatus = styleVariants({
  done: [habitStatusBase, { color: vars.color.toneSuccess }],
  missed: [habitStatusBase, { color: vars.color.textSecondary }],
});
