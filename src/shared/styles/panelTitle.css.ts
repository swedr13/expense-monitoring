import { style } from "@vanilla-extract/css";
import { vars } from "./vars.css";

export const panelTitle = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  minWidth: 0,
});

/** An icon in a tinted rounded square. */
export const iconTile = style({
  display: "grid",
  placeItems: "center",
  flex: "none",
  width: vars.iconTile,
  height: vars.iconTile,
  borderRadius: vars.radiusTile,
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 14%, transparent)`,
  color: vars.color.primaryText,
  fontSize: vars.font.sizeLg,
});

export const panelTitleText = style({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
