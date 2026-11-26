import { supabase } from "@/shared/lib/supabase";
import { unwrap, unwrapMaybe } from "@/shared/lib/result";
import type { HabitValues, HealthDay } from "./types";

/*
  Plain table writes, like expenses: RLS (`user_id = auth.uid()`) limits every
  call to this phone's own rows, and `user_id` is filled by its column default.
*/

const columns =
  "id, user_id, checked_on, worked_out, eat_less, drink_water, no_fast_food, no_liquid_calories, created_at, updated_at";

/** PostgREST caps a response at 1000 rows, so Records reads in pages. */
const pageSize = 1000;

/** The day's checklist, or null when nothing has been ticked that day yet. */
export const fetchDayHealth = async (day: string): Promise<HealthDay | null> =>
  unwrapMaybe(
    await supabase.from("health_checks").select(columns).eq("checked_on", day).maybeSingle(),
  ) as HealthDay | null;

/** Every saved checklist, newest day first. */
export const fetchAllHealth = async (): Promise<HealthDay[]> => {
  const all: HealthDay[] = [];
  for (let from = 0; ; from += pageSize) {
    const page = unwrap(
      await supabase
        .from("health_checks")
        .select(columns)
        .order("checked_on", { ascending: false })
        .range(from, from + pageSize - 1),
    ) as HealthDay[];
    all.push(...page);
    if (page.length < pageSize) return all;
  }
};

/** Creates the day's row on the first tick and overwrites all five habits after that. */
export const saveHealth = async (day: string, values: HabitValues): Promise<HealthDay> =>
  unwrap(
    await supabase
      .from("health_checks")
      .upsert({ checked_on: day, ...values }, { onConflict: "user_id,checked_on" })
      .select(columns)
      .single(),
  ) as HealthDay;
