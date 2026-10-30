import { useSyncExternalStore } from "react";
import { usePrefersDark } from "@/shared/hooks/usePrefersDark";
import { isHexColor } from "@/shared/lib/color";
import { brandPrimary } from "./palette";

export type ThemeMode = "light" | "dark";

/** Per device: kept in localStorage, never in the database. */
const modeKey = "expenses:theme-mode";
const colorKey = "expenses:theme-color";

const listeners = new Set<() => void>();
// Storage can be blocked (private mode, strict settings): then the choice
// lasts until the page reloads.
const memory = new Map<string, string>();

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    memory.set(key, value);
  }
  listeners.forEach((notify) => notify());
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
};

/**
 * Light/dark and the theme colour. Until a mode is picked it follows the
 * device's setting; until a colour is picked it is the brand green.
 */
export const useThemePreference = () => {
  const prefersDark = usePrefersDark();
  const storedMode = useSyncExternalStore(
    subscribe,
    () => read(modeKey),
    () => null,
  );
  const storedColor = useSyncExternalStore(
    subscribe,
    () => read(colorKey),
    () => null,
  );

  return {
    isDark: storedMode ? storedMode === "dark" : prefersDark,
    primary: storedColor && isHexColor(storedColor) ? storedColor.toLowerCase() : brandPrimary,
    setMode: (mode: ThemeMode) => write(modeKey, mode),
    setPrimary: (color: string) => write(colorKey, color),
  };
};
