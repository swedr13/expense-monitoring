import { globalStyle } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/vars.css";

globalStyle("html, body", {
  margin: 0,
  background: vars.color.bgLayout,
  color: vars.color.text,
  fontFamily: vars.font.family,
  textRendering: "optimizeLegibility",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  WebkitTapHighlightColor: "transparent",
  // App-like feel: no double-tap zoom (pinch is blocked by the viewport meta)
  touchAction: "manipulation",
});

// Native controls and scrollbars follow the app's mode, not the device's.
globalStyle(':root[data-color-mode="light"]', { colorScheme: "light" });
globalStyle(':root[data-color-mode="dark"]', { colorScheme: "dark" });

globalStyle("*", {
  scrollbarWidth: "thin",
  scrollbarColor: `color-mix(in srgb, ${vars.color.text} 22%, transparent) transparent`,
});

globalStyle("#root", {
  minHeight: "100dvh",
});
