/** Small colour maths for the theme: blending and WCAG contrast. Hex in, hex out. */

const toRgb = (hex: string): [number, number, number] => {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value.slice(0, 6);
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const toHex = (rgb: number[]) =>
  `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

export const isHexColor = (value: string) => /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);

/** `percent`% of `top` laid over `base` (both opaque hex). */
export const mix = (top: string, percent: number, base: string) => {
  const a = toRgb(top);
  const b = toRgb(base);
  return toHex(a.map((c, i) => c * (percent / 100) + b[i] * (1 - percent / 100)));
};

export const alpha = (hex: string, opacity: number) => `rgba(${toRgb(hex).join(", ")}, ${opacity})`;

const luminance = (hex: string) => {
  const [r, g, b] = toRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Steps `color` toward black or white until it reads at `min`:1 on `background`. */
export const readableOn = (color: string, background: string, min = 4.5) => {
  const target = luminance(background) > 0.4 ? "#000000" : "#ffffff";
  let result = color;
  for (let step = 1; step <= 20 && contrast(result, background) < min; step++)
    result = mix(target, step * 5, color);
  return result;
};
