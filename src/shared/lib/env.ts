/**
 * Public, browser-safe configuration. Everything here ships in the bundle —
 * a service-role or secret key must never be added.
 */
const read = (name: keyof ImportMetaEnv): string => {
  const value = import.meta.env[name];
  if (!value) throw new Error(`Missing ${name}. Copy .env.example to .env.local and fill it in.`);
  return value;
};

export const env = {
  supabaseUrl: read("VITE_SUPABASE_URL"),
  supabasePublishableKey: read("VITE_SUPABASE_PUBLISHABLE_KEY"),
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || undefined,
};
