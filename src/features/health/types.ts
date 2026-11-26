import type { Database } from "@/shared/lib/database.types";

/** One day's saved Health checklist. */
export type HealthDay = Database["expenses"]["Tables"]["health_checks"]["Row"];

/** The five habits, as their column names. */
export type Habit =
  "worked_out" | "eat_less" | "drink_water" | "no_fast_food" | "no_liquid_calories";

/** Which habits are ticked. */
export type HabitValues = Record<Habit, boolean>;
