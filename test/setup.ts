import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { supabase } from "@/shared/lib/supabase";

/*
  jsdom implements neither matchMedia nor ResizeObserver, and antd's responsive
  components (Grid, Drawer, Table) call both on mount. These stubs only have to
  exist — nothing under test asserts on layout.
*/
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

window.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

/*
  The app signs every device in anonymously when it has no session. Tests never
  reach Supabase: the sign-in stays pending, and tests that need a signed-in
  device mock useAuth.
*/
vi.spyOn(supabase.auth, "signInAnonymously").mockReturnValue(new Promise(() => {}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
