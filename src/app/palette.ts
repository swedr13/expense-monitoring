/** Brand colour: green. The default until another is picked. */
export const brandPrimary = "#1f7a4d";

/** Theme colours to pick from. The first is the default. */
export const themeSwatches = [
  { name: "Green", color: brandPrimary },
  { name: "Teal", color: "#009293" },
  { name: "Ocean blue", color: "#1364ab" },
  { name: "Indigo", color: "#4f56d3" },
  { name: "Pine", color: "#0f766e" },
  { name: "Orange", color: "#c2410c" },
  { name: "Blue", color: "#2563eb" },
  { name: "Violet", color: "#6d28d9" },
  { name: "Raspberry", color: "#be185d" },
  { name: "Amber", color: "#a16207" },
  { name: "Navy", color: "#1e2a78" },
  { name: "Olive", color: "#4d7c0f" },
] as const;

/** Surfaces and text: lavender light, navy dark. */
export const palette = {
  light: {
    bgLayout: "#eef2fd",
    bgContainer: "#ffffff",
    bgElevated: "#ffffff",
    border: "#dfe3f3",
    borderSecondary: "#e6e9f6",
    text: "#1b2232",
    textHeading: "#1e2a78",
    textSecondary: "#525a8c",
    textTertiary: "#7a82ab",
    textPlaceholder: "#8a91b4",
    fillAlter: "#f7f8fd",
    mask: "rgba(30, 42, 120, 0.38)",
  },
  dark: {
    bgLayout: "#0b1240",
    bgContainer: "#131a4e",
    bgElevated: "#18205c",
    border: "rgba(255, 255, 255, 0.14)",
    borderSecondary: "rgba(255, 255, 255, 0.09)",
    text: "#eef2fd",
    textHeading: "#eef2fd",
    textSecondary: "#b3bbea",
    textTertiary: "#8c94c4",
    textPlaceholder: "#8c94c4",
    fillAlter: "rgba(255, 255, 255, 0.03)",
    mask: "rgba(3, 6, 30, 0.6)",
  },
} as const;

/** Status colours for tags and icons. */
export const tones = {
  light: { success: "#15803d", danger: "#c42f2a", warning: "#b45309", neutral: "#7a82ab" },
  dark: { success: "#4ade80", danger: "#f87171", warning: "#fbbf24", neutral: "#8c94c4" },
} as const;
