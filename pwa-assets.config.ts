import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

// Generates the favicon and PWA/app icons from public/app-icon.png into public/.
// Run `npm run generate-pwa-assets` after changing the logo, then commit the PNGs.
// The wallet logo is transparent: the favicon and PWA icons keep that, while the
// maskable and Apple icons (which can't be transparent) sit on white.
const logoBackground = { background: "#ffffff" };

export default defineConfig({
  headLinkOptions: { preset: "2023" },
  preset: {
    ...minimal2023Preset,
    transparent: { ...minimal2023Preset.transparent, padding: 0.05 },
    // Android crops maskable icons to a circle/squircle; keep the logo in the safe zone.
    maskable: { ...minimal2023Preset.maskable, padding: 0.2, resizeOptions: logoBackground },
    apple: { ...minimal2023Preset.apple, padding: 0.05, resizeOptions: logoBackground },
  },
  images: ["public/app-icon.png"],
});
