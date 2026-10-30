import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type AuthState = {
  session: Session | null;
  user: User | null;
  /** This phone's own session (Supabase anonymous sign-in). Always true here. */
  isAnonymous: boolean;
  /** True until there is a session (restored, or this device signed in). */
  isLoading: boolean;
  /** Set when this device couldn't be signed in. */
  error: unknown;
};

export const AuthContext = createContext<AuthState | null>(null);
