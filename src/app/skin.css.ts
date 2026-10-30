import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/vars.css";

/*
 * The panel look for antd cards, modals and drawers, applied app-wide through
 * ConfigProvider (see theme.ts). Selectors start with `html` so they outrank
 * antd's own rules without `!important`.
 */

const tint = (color: string, percent: number, base = "transparent") =>
  `color-mix(in srgb, ${color} ${percent}%, ${base})`;

// --- Card: a rounded panel with a soft shadow -------------------------------

export const cardRoot = style({
  selectors: {
    "html &": {
      border: `1px solid ${vars.color.border}`,
      borderRadius: vars.radiusPanel,
      boxShadow: vars.shadow.card,
      overflow: "hidden",
    },
  },
});

// Padding comes from the Card tokens in theme.ts.
export const cardHeader = style({
  selectors: {
    "html &": {
      borderBottom: `1px solid ${vars.color.border}`,
    },
  },
});

export const cardTitle = style({
  selectors: {
    "html &": {
      fontSize: vars.font.sizeLg,
      fontWeight: 600,
      color: vars.color.text,
    },
  },
});

// --- Modal: gradient header, tinted footer, round close ---------------------

export const modalContainer = style({
  selectors: {
    "html .ant-modal &": {
      padding: 0,
      overflow: "hidden",
      border: `1px solid ${vars.color.border}`,
      borderRadius: vars.radiusPanel,
      background: vars.color.bgContainer,
      boxShadow: `0 30px 70px -24px ${tint(vars.color.textHeading, 45)}, 0 2px 8px ${tint(vars.color.textHeading, 6)}`,
    },
    // confirm dialogs (modal.confirm) have no header/footer: pad the whole box
    "html .ant-modal.ant-modal-confirm &": {
      paddingBlock: vars.space.lg,
      paddingInline: vars.space.lg,
    },
  },
});

const panelHeader = {
  margin: 0,
  paddingBlock: vars.space.md,
  paddingInlineStart: vars.space.lg,
  // room for the close button
  paddingInlineEnd: `calc(${vars.touchTarget} + ${vars.space.md})`,
  background: `linear-gradient(120deg, ${tint(vars.color.primary, 9)}, ${vars.color.bgContainer} 65%)`,
  borderBottom: `1px solid ${vars.color.border}`,
};

export const modalHeader = style({
  selectors: { "html .ant-modal &": panelHeader },
});

export const panelTitle = style({
  selectors: {
    "html &": {
      fontSize: vars.font.sizeXl,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: vars.color.textHeading,
    },
  },
});

export const modalBody = style({
  selectors: {
    "html .ant-modal &": {
      paddingBlock: vars.space.lg,
      paddingInline: vars.space.lg,
    },
    "html .ant-modal.ant-modal-confirm &": { padding: 0 },
  },
});

export const modalFooter = style({
  selectors: {
    "html .ant-modal &": {
      margin: 0,
      paddingBlock: vars.space.sm,
      paddingInline: vars.space.lg,
      background: tint(vars.color.bgLayout, 60, vars.color.bgContainer),
      borderTop: `1px solid ${vars.color.border}`,
    },
  },
});

export const modalClose = style({
  selectors: {
    "html .ant-modal &": {
      top: vars.space.sm,
      insetInlineEnd: vars.space.sm,
      width: vars.touchTarget,
      height: vars.touchTarget,
      borderRadius: "50%",
      color: vars.color.textSecondary,
    },
    "html .ant-modal &:hover": {
      background: tint(vars.color.primary, 8),
      color: vars.color.primaryText,
    },
  },
});

// --- Drawer: same header; bottom sheets get rounded top corners -------------

export const drawerSection = style({
  selectors: {
    "html .ant-drawer-bottom &": {
      borderStartStartRadius: vars.radiusPanel,
      borderStartEndRadius: vars.radiusPanel,
      overflow: "hidden",
    },
  },
});

export const drawerHeader = style({
  selectors: {
    "html .ant-drawer &": {
      ...panelHeader,
      paddingInlineEnd: vars.space.lg,
    },
  },
});
