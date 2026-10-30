import { describe, expect, it } from "vitest";
import { contrast, isHexColor, mix, readableOn } from "@/shared/lib/color";
import { darkAccent } from "@/app/theme";
import { palette, themeSwatches } from "@/app/palette";

describe("color", () => {
  it("blends two colours", () => {
    expect(mix("#ffffff", 50, "#000000")).toBe("#808080");
    expect(mix("#1f7a4d", 100, "#ffffff")).toBe("#1f7a4d");
  });

  it("validates hex colours", () => {
    expect(isHexColor("#1f7a4d")).toBe(true);
    expect(isHexColor("fff")).toBe(true);
    expect(isHexColor("green")).toBe(false);
  });

  it("makes a colour readable on its background", () => {
    const text = readableOn("#ffbb27", "#ffffff");
    expect(contrast(text, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it("lifts every preset to a readable accent in dark mode", () => {
    for (const { color } of themeSwatches)
      expect(contrast(darkAccent(color), palette.dark.bgContainer)).toBeGreaterThanOrEqual(4.5);
  });
});
