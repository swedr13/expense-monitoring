import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "./vars.css";

const base = style({
  display: "inline-flex",
  flexShrink: 0,
  verticalAlign: "-0.125em",
});

/** Green, yellow or red — the tones brighten in dark mode. */
export const levelCheck = styleVariants({
  good: [base, { color: vars.color.toneSuccess }],
  fair: [base, { color: vars.color.toneWarning }],
  poor: [base, { color: vars.color.toneDanger }],
});
