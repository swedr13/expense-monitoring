import { createElement } from "react";
import { theme, type ConfigProviderProps, type ThemeConfig } from "antd";
import { PiXBold } from "react-icons/pi";
import { alpha, contrast, mix } from "@/shared/lib/color";
import { palette } from "./palette";
import * as skin from "./skin.css";

export const fontFamily =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

/**
 * The primary as dark mode shows it: lifted toward white until it reads at
 * 4.5:1 on a dark panel. antd's dark algorithm would darken it instead.
 */
export const darkAccent = (primary: string) => {
  let amount = 62;
  while (amount > 0 && contrast(mix(primary, amount, "#ffffff"), palette.dark.bgContainer) < 4.5)
    amount--;
  return mix(primary, amount, "#ffffff");
};

/** The one place antd's look is configured: light or dark, plus the chosen colour. */
export const getThemeConfig = (isDark: boolean, primary: string): ThemeConfig => {
  const p = isDark ? palette.dark : palette.light;
  const accent = isDark ? darkAccent(primary) : primary;
  const field = { controlHeight: 48, fontSize: 15 };
  const focusRing = `0 0 0 3px ${alpha(accent, 0.15)}`;

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      // an explicit token wins over the algorithm, so dark mode keeps the lifted accent
      colorPrimary: accent,
      colorLink: accent,
      fontFamily,
      borderRadius: 10,
      borderRadiusLG: 14,
      // Comfortable touch targets on phones.
      controlHeight: 40,
      controlHeightLG: 48,
      colorBgBase: isDark ? p.bgLayout : "#ffffff",
      colorBgLayout: p.bgLayout,
      colorBgContainer: p.bgContainer,
      colorBgElevated: p.bgElevated,
      colorBgMask: p.mask,
      colorBorder: p.border,
      colorBorderSecondary: p.borderSecondary,
      colorSplit: p.borderSecondary,
      colorText: p.text,
      colorTextHeading: p.textHeading,
      colorTextSecondary: p.textSecondary,
      colorTextTertiary: p.textTertiary,
      colorTextPlaceholder: p.textPlaceholder,
      colorFillAlter: p.fillAlter,
      ...(isDark && {
        // the lifted accent is light: put navy text on it where white wouldn't read
        colorTextLightSolid: contrast("#ffffff", accent) >= 4.5 ? "#ffffff" : p.bgLayout,
        colorPrimaryBg: mix(accent, 18, p.bgContainer),
        colorPrimaryBgHover: mix(accent, 26, p.bgContainer),
        colorPrimaryBorder: alpha(accent, 0.45),
        colorPrimaryText: accent,
        colorPrimaryHover: mix("#ffffff", 15, accent),
        colorPrimaryActive: mix("#000000", 15, accent),
      }),
    },
    components: {
      // small cards keep enough inset that the icon tile clears the rounded corner
      Card: {
        borderRadiusLG: 20,
        headerFontSize: 16,
        headerHeightSM: 52,
        headerPaddingSM: 16,
        bodyPaddingSM: 16,
      },
      Modal: { borderRadiusLG: 20, titleFontSize: 18 },
      // one rhythm: 16px between fields, and between the last field and its button
      Form: { itemMarginBottom: 16 },
      Button: { primaryShadow: `0 6px 16px -6px ${alpha(accent, 0.6)}`, fontWeight: 500 },
      Input: { ...field, paddingInline: 14, activeShadow: focusRing },
      InputNumber: { ...field, paddingInline: 14, activeShadow: focusRing },
      Select: {
        ...field,
        optionSelectedBg: isDark ? alpha(accent, 0.16) : mix(accent, 10, "#ffffff"),
      },
      DatePicker: { ...field, paddingInline: 14, activeShadow: focusRing },
      Segmented: {
        itemSelectedBg: isDark ? alpha(accent, 0.22) : "#ffffff",
        trackBg: isDark ? "rgba(255, 255, 255, 0.05)" : mix(accent, 6, p.bgLayout),
      },
      Table: {
        headerBg: isDark ? "rgba(255, 255, 255, 0.04)" : mix(accent, 5, "#ffffff"),
        headerColor: p.textSecondary,
        headerSplitColor: "transparent",
        rowHoverBg: isDark ? alpha(accent, 0.08) : mix(accent, 4, "#ffffff"),
      },
      Tabs: { titleFontSize: 15 },
    },
  };
};

/** Panel skin for antd cards, modals and drawers (`skin.css.ts`). */
export const componentConfig: Pick<ConfigProviderProps, "card" | "modal" | "drawer"> = {
  card: {
    classNames: { root: skin.cardRoot, header: skin.cardHeader, title: skin.cardTitle },
  },
  modal: {
    mask: { blur: true },
    closeIcon: createElement(PiXBold, { "aria-hidden": true }),
    classNames: {
      container: skin.modalContainer,
      header: skin.modalHeader,
      title: skin.panelTitle,
      body: skin.modalBody,
      footer: skin.modalFooter,
      close: skin.modalClose,
    },
  },
  drawer: {
    mask: { blur: true },
    classNames: { section: skin.drawerSection, header: skin.drawerHeader, title: skin.panelTitle },
  },
};
