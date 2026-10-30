import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { env } from "./env";

/**
 * The app's only Supabase client. Feature `api.ts` modules import this.
 * The project is shared with AtchupikolQ; this app only ever reads and writes
 * the `expenses` schema.
 */
export const supabase = createClient<Database, "expenses">(
  env.supabaseUrl,
  env.supabasePublishableKey,
  {
    db: { schema: "expenses" },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
