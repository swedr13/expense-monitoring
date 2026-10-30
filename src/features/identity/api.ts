import { supabase } from "@/shared/lib/supabase";

/** This phone signs in once, anonymously: no email, no password. The session persists. */
export const signInDevice = async () => {
  const { error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
};
