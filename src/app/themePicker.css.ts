import { createVar, style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/vars.css";
import { themeSwatches } from "./palette";

const shade = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

/** Room the floating button needs above the bottom edge. */
export const triggerClearance = `calc(${vars.touchTarget} + ${vars.space.xs} + ${vars.space.md})`;

export const trigger = style({
  position: "fixed",
  zIndex: 1000,
  right: `max(${vars.space.md}, env(safe-area-inset-right))`,
  bottom: `max(${vars.space.md}, calc(env(safe-area-inset-bottom) + ${vars.space.xs}))`,
  display: "grid",
  placeItems: "center",
  width: `calc(${vars.touchTarget} + ${vars.space.xs})`,
  height: `calc(${vars.touchTarget} + ${vars.space.xs})`,
  padding: 0,
  border: `1px solid ${vars.color.border}`,
  borderRadius: "50%",
  background: vars.color.bgContainer,
  color: vars.color.primaryText,
  fontSize: vars.font.sizeXl,
  boxShadow: `0 10px 30px ${shade(vars.color.textHeading, 20)}`,
  cursor: "pointer",
  transition: "transform 160ms ease",
  selectors: {
    "&:hover": { transform: "scale(1.06)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.primary}`, outlineOffset: "2px" },
  },
});

export const popoverContainer = style({
  selectors: {
    "html &": { padding: 0, background: "transparent", boxShadow: "none" },
  },
});

export const panel = style({
  boxSizing: "border-box",
  width: `min(360px, calc(100vw - 2 * ${vars.space.md}))`,
  padding: vars.space.lg,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radiusPanel,
  background: vars.color.bgContainer,
  boxShadow: vars.shadow.float,
});

export const head = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: vars.space.sm,
  color: vars.color.textHeading,
  fontSize: vars.font.sizeLg,
});

export const activeName = style({
  color: vars.color.textSecondary,
  fontSize: vars.font.sizeSm,
});

export const label = style({
  marginTop: vars.space.md,
  marginBottom: vars.space.xs,
  color: vars.color.textSecondary,
  fontSize: vars.font.sizeSm,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

const swatchColor = createVar();

/** One class per preset, keyed by its hex. */
export const swatchColors = styleVariants(
  Object.fromEntries(themeSwatches.map(({ color }) => [color, { vars: { [swatchColor]: color } }])),
);

export const swatchGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
  gap: vars.space.xs,
});

export const swatch = style({
  display: "grid",
  placeItems: "center",
  width: "100%",
  aspectRatio: "1",
  maxWidth: vars.touchTarget,
  padding: 0,
  border: "none",
  borderRadius: "50%",
  background: swatchColor,
  // every preset is dark enough for a white check
  color: "white",
  boxShadow: `inset 0 0 0 1px ${shade(vars.color.textHeading, 8)}`,
  cursor: "pointer",
  transition: "transform 160ms ease",
  selectors: {
    "&:hover": { transform: "scale(1.06)" },
    "&:focus-visible": { outline: `2px solid ${swatchColor}`, outlineOffset: "3px" },
  },
});

export const swatchOn = style({
  boxShadow: `0 0 0 3px ${vars.color.bgContainer}, 0 0 0 5px ${swatchColor}`,
});

export const swatchCheck = style({
  opacity: 0,
  selectors: { [`${swatchOn} &`]: { opacity: 1 } },
});

export const customRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.sm,
  marginTop: vars.space.md,
  color: vars.color.text,
});
