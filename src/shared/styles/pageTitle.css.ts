import { keyframes, style } from "@vanilla-extract/css";
import { breakpoints } from "./breakpoints";
import { vars } from "./vars.css";

const rise = keyframes({
  from: { opacity: 0, transform: "translateY(8px)" },
  to: { opacity: 1, transform: "none" },
});

export const pageTitle = style({
  selectors: {
    "html &.ant-typography": {
      marginTop: 0,
      marginBottom: vars.space.md,
      fontSize: `calc(${vars.font.sizeXl} * 1.2)`,
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: "-0.02em",
      color: vars.color.text,
      animation: `${rise} 320ms cubic-bezier(0.22, 1, 0.36, 1)`,
    },
  },
  "@media": {
    [breakpoints.tablet]: {
      selectors: {
        "html &.ant-typography": { fontSize: `calc(${vars.font.sizeXl} * 1.5)` },
      },
    },
    "(prefers-reduced-motion: reduce)": {
      selectors: { "html &.ant-typography": { animation: "none" } },
    },
  },
});
