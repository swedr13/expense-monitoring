import { createThemeContract } from "@vanilla-extract/css";

/**
 * The token contract every `*.css.ts` file styles against.
 *
 * Values are filled at runtime from the live antd token by `ThemeBridge`, so
 * dark mode and the chosen theme colour reach vanilla-extract styles too. Never
 * hardcode a colour, spacing or font size in a style — read it from here. Tints
 * of a colour are `color-mix(in srgb, <var> N%, transparent)` in the style itself.
 */
export const vars = createThemeContract({
  color: {
    primary: null,
    /** The primary colour adjusted to read as text on a container (AA). */
    primaryText: null,
    /** Text on a solid primary background. */
    onPrimary: null,
    bgLayout: null,
    bgContainer: null,
    bgElevated: null,
    text: null,
    textHeading: null,
    textSecondary: null,
    textTertiary: null,
    border: null,
    success: null,
    warning: null,
    error: null,
    /** Status tones for tags and icons, brighter in dark mode. */
    toneSuccess: null,
    toneDanger: null,
    toneWarning: null,
    toneNeutral: null,
  },
  space: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  font: {
    family: null,
    sizeSm: null,
    size: null,
    sizeLg: null,
    sizeXl: null,
  },
  /** Controls and fields. */
  radius: null,
  /** Icon tiles and segmented tracks. */
  radiusTile: null,
  /** Cards, modals and panels. */
  radiusPanel: null,
  shadow: {
    card: null,
    float: null,
  },
  iconTile: null,
  touchTarget: null,
});
