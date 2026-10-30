import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/shared/lib/supabase";
import { signInDevice } from "./api";
import { AuthContext, type AuthState } from "./authContext";

/**
 * Tracks the Supabase session for the whole app. A device without a session
 * (first visit, or storage was cleared) is signed in anonymously — there are
 * no logins in this app.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    // Fires INITIAL_SESSION right away with any saved session, then on every change.
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setError(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      // outside the callback: Supabase auth calls inside it can deadlock
      setTimeout(() =>
        signInDevice().catch((signInError: unknown) => {
          setError(signInError);
          setIsLoading(false);
        }),
      );
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      isAnonymous: session?.user.is_anonymous ?? false,
      isLoading,
      error,
    }),
    [session, isLoading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
