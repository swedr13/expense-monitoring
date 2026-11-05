import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/vars.css";
import { breakpoints } from "@/shared/styles/breakpoints";
import { triggerClearance } from "./themePicker.css";

const tint = (percent: number) =>
  `color-mix(in srgb, ${vars.color.primary} ${percent}%, transparent)`;

export const shell = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  // the backdrop rings sit behind everything in here
  isolation: "isolate",
  overflowX: "clip",
});

// --- Backdrop: faint concentric rings in the theme colour --------------------

export const backdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: -1,
  overflow: "hidden",
  pointerEvents: "none",
});

const orbit = style({ position: "absolute" });

export const orbits = styleVariants({
  top: [orbit, { left: "88%", top: "140px" }],
  bottom: [orbit, { left: "6%", top: "92%" }],
});

const ring = style({
  position: "absolute",
  transform: "translate(-50%, -50%)",
  borderRadius: "50%",
  opacity: 0.7,
});

export const rings = styleVariants({
  sm: [ring, { width: "420px", height: "420px", border: `1px solid ${tint(24)}` }],
  md: [ring, { width: "640px", height: "640px", border: `1px solid ${tint(16)}` }],
  lg: [ring, { width: "880px", height: "880px", border: `1px solid ${tint(10)}` }],
});

export const header = style({
  position: "sticky",
  top: 0,
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.sm,
  minHeight: vars.touchTarget,
  paddingTop: `max(${vars.space.sm}, env(safe-area-inset-top))`,
  paddingBottom: vars.space.sm,
  paddingLeft: `max(${vars.space.md}, env(safe-area-inset-left))`,
  paddingRight: `max(${vars.space.md}, env(safe-area-inset-right))`,
  // frosted glass over the page
  background: `color-mix(in srgb, ${vars.color.bgContainer} 72%, transparent)`,
  backdropFilter: "blur(14px) saturate(140%)",
  WebkitBackdropFilter: "blur(14px) saturate(140%)",
  borderBottom: `1px solid ${vars.color.border}`,
});

export const brand = style({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  gap: vars.space.sm,
  minHeight: vars.touchTarget,
  textDecoration: "none",
});

export const brandLogo = style({
  width: vars.iconTile,
  height: vars.iconTile,
  flexShrink: 0,
});

export const brandText = style({
  color: vars.color.textHeading,
  fontSize: vars.font.sizeLg,
  fontWeight: 700,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  textDecoration: "none",
});

export const headerEnd = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.xs,
});

export const content = style({
  flex: 1,
  width: "100%",
  maxWidth: 1200,
  marginInline: "auto",
  boxSizing: "border-box",
  paddingTop: vars.space.md,
  // clear the floating theme button at the end of the page
  paddingBottom: `calc(${triggerClearance} + env(safe-area-inset-bottom))`,
  paddingLeft: `max(${vars.space.md}, env(safe-area-inset-left))`,
  paddingRight: `max(${vars.space.md}, env(safe-area-inset-right))`,
  "@media": {
    [breakpoints.tablet]: {
      paddingTop: vars.space.lg,
      paddingInline: vars.space.lg,
    },
  },
});
