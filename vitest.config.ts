import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

// Reuses the app's Vite config so `*.css.ts` sheets and the `@/` alias work under test.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./test/setup.ts",
      // axe runs make component tests slow in jsdom, especially in a full parallel run
      testTimeout: 15_000,
      include: ["test/**/*.test.{ts,tsx}"],
      // Placeholder values so the Supabase client can be constructed; tests never reach it.
      env: {
        VITE_SUPABASE_URL: "http://localhost:54321",
        VITE_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
      },
    },
  }),
);
