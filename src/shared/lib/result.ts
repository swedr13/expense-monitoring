/**
 * Supabase returns `{ data, error }` instead of throwing. TanStack Query needs a
 * thrown error to enter its error state, so every api.ts call goes through one
 * of these. They infer from the whole result (a union of success and error
 * shapes), which keeps the row type intact.
 */
type SupabaseResult = { data: unknown; error: unknown };

/** Data that must be there (lists, `.single()`, RPCs that return a value). */
export const unwrap = <R extends SupabaseResult>({ data, error }: R): NonNullable<R["data"]> => {
  if (error) throw error;
  if (data === null || data === undefined) throw new Error("no_data");
  return data as NonNullable<R["data"]>;
};

/** A row that may legitimately be missing (`.maybeSingle()`). */
export const unwrapMaybe = <R extends SupabaseResult>({
  data,
  error,
}: R): NonNullable<R["data"]> | null => {
  if (error) throw error;
  return (data ?? null) as NonNullable<R["data"]> | null;
};

/** Calls that return nothing (void RPCs). */
export const ensureOk = ({ error }: { error: unknown }): void => {
  if (error) throw error;
};
