import { Button, ColorPicker, Popover, Segmented, Tooltip, type SegmentedProps } from "antd";
import { PiCheckBold, PiMoon, PiPalette, PiSun } from "react-icons/pi";
import { themeSwatches } from "./palette";
import {
  activeName,
  customRow,
  head,
  label,
  panel,
  popoverContainer,
  swatch,
  swatchCheck,
  swatchColors,
  swatchGrid,
  swatchOn,
  trigger,
} from "./themePicker.css";
import { useThemePreference, type ThemeMode } from "./useThemePreference";

const modeOptions: SegmentedProps<ThemeMode>["options"] = [
  { value: "light", label: "Light", icon: <PiSun aria-hidden="true" /> },
  { value: "dark", label: "Dark", icon: <PiMoon aria-hidden="true" /> },
];

const ThemePanel = () => {
  const { isDark, primary, setMode, setPrimary } = useThemePreference();
  const current = themeSwatches.find((s) => s.color === primary);

  return (
    <div className={panel} role="dialog" aria-label="Theme settings">
      <div className={head}>
        <strong>Theme</strong>
        <span className={activeName}>{current?.name ?? "Custom colour"}</span>
      </div>

      <div className={label} id="theme-mode-label">
        Mode
      </div>
      <Segmented<ThemeMode>
        block
        aria-labelledby="theme-mode-label"
        options={modeOptions}
        value={isDark ? "dark" : "light"}
        onChange={setMode}
      />

      <div className={label} id="theme-colour-label">
        Colour
      </div>
      <div className={swatchGrid} role="group" aria-labelledby="theme-colour-label">
        {themeSwatches.map((s) => (
          <button
            key={s.color}
            type="button"
            className={`${swatch} ${swatchColors[s.color]} ${s.color === primary ? swatchOn : ""}`}
            aria-label={s.name}
            aria-pressed={s.color === primary}
            title={s.name}
            onClick={() => setPrimary(s.color)}
          >
            <PiCheckBold className={swatchCheck} aria-hidden="true" />
          </button>
        ))}
      </div>

      <label className={customRow}>
        Custom colour
        <ColorPicker
          disabledAlpha
          value={primary}
          onChangeComplete={(color) => setPrimary(color.toHexString())}
        />
      </label>
    </div>
  );
};

/** Floating palette button (bottom right) that opens the theme panel. */
export const ThemePicker = () => (
  <Popover
    content={<ThemePanel />}
    trigger="click"
    placement="topRight"
    arrow={false}
    classNames={{ container: popoverContainer }}
  >
    <Tooltip title="Theme" placement="left">
      <button type="button" className={trigger} aria-label="Theme settings" aria-haspopup="dialog">
        <PiPalette aria-hidden="true" />
      </button>
    </Tooltip>
  </Popover>
);

/** Header sun/moon: flips light and dark. */
export const ThemeModeToggle = () => {
  const { isDark, setMode } = useThemePreference();
  const next = isDark ? "light" : "dark";

  return (
    <Tooltip title={`Switch to ${next} mode`}>
      <Button
        type="text"
        size="large"
        icon={isDark ? <PiSun aria-hidden="true" /> : <PiMoon aria-hidden="true" />}
        aria-label={`Switch to ${next} mode`}
        onClick={() => setMode(next)}
      />
    </Tooltip>
  );
};
