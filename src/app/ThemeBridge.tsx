import { useLayoutEffect } from "react";
import { theme } from "antd";
import { setElementVars } from "@vanilla-extract/dynamic";
import { alpha, contrast, readableOn } from "@/shared/lib/color";
import { vars } from "@/shared/styles/vars.css";
import { tones } from "./palette";

const px = (value: number) => `${value}px`;

/**
 * Copies the live antd token into the vanilla-extract contract on `<html>`, so
 * every `*.css.ts` style — including antd portals like modals and drawers —
 * follows the active theme. Renders nothing.
 */
export const ThemeBridge = ({ isDark }: { isDark: boolean }) => {
  const { token } = theme.useToken();

  useLayoutEffect(() => {
    const tone = isDark ? tones.dark : tones.light;
    const onPrimary =
      contrast(token.colorTextLightSolid, token.colorPrimary) >= 3
        ? token.colorTextLightSolid
        : readableOn(token.colorPrimary, token.colorPrimary, 3);

    setElementVars(document.documentElement, vars, {
      color: {
        primary: token.colorPrimary,
        primaryText: readableOn(token.colorPrimary, token.colorBgContainer),
        onPrimary,
        bgLayout: token.colorBgLayout,
        bgContainer: token.colorBgContainer,
        bgElevated: token.colorBgElevated,
        text: token.colorText,
        textHeading: token.colorTextHeading,
        textSecondary: token.colorTextSecondary,
        textTertiary: token.colorTextTertiary,
        border: token.colorBorderSecondary,
        success: token.colorSuccess,
        warning: token.colorWarning,
        error: token.colorError,
        toneSuccess: tone.success,
        toneDanger: tone.danger,
        toneWarning: tone.warning,
        toneNeutral: tone.neutral,
      },
      space: {
        xs: px(token.paddingXS),
        sm: px(token.paddingSM),
        md: px(token.padding),
        lg: px(token.paddingLG),
        xl: px(token.paddingXL),
      },
      font: {
        family: token.fontFamily,
        sizeSm: px(token.fontSizeSM),
        size: px(token.fontSize),
        sizeLg: px(token.fontSizeLG),
        sizeXl: px(token.fontSizeXL),
      },
      radius: px(token.borderRadius),
      radiusTile: "12px",
      radiusPanel: "20px",
      shadow: {
        card: isDark
          ? `0 1px 2px ${alpha("#000000", 0.3)}, 0 18px 40px -20px ${alpha("#000000", 0.6)}`
          : `0 1px 2px ${alpha(token.colorText, 0.04)}, 0 10px 28px -14px ${alpha(token.colorPrimary, 0.18)}`,
        float: `0 20px 50px ${alpha(isDark ? "#000000" : token.colorTextHeading, isDark ? 0.5 : 0.22)}`,
      },
      iconTile: "32px",
      touchTarget: "44px",
    });
    document.documentElement.dataset.colorMode = isDark ? "dark" : "light";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", token.colorBgContainer);
  }, [token, isDark]);

  return null;
};
