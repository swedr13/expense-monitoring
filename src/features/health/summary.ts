import type { Level } from "@/shared/components/LevelCheck";
import type { Habit, HabitValues } from "./types";

/** The checklist, in the order it's shown. */
export const habits: ReadonlyArray<{ key: Habit; label: string }> = [
  { key: "worked_out", label: "Worked out" },
  { key: "eat_less", label: "Eat less" },
  { key: "drink_water", label: "Drink water a lot" },
  { key: "no_fast_food", label: "No fast food" },
  { key: "no_liquid_calories", label: "No liquid calories" },
];

export const noHabits: HabitValues = {
  worked_out: false,
  eat_less: false,
  drink_water: false,
  no_fast_food: false,
  no_liquid_calories: false,
};

/** Just the five habit flags of a saved day (or all unticked when there's none). */
export const toHabitValues = (day: HabitValues | null | undefined): HabitValues =>
  Object.fromEntries(habits.map(({ key }) => [key, day?.[key] ?? false])) as HabitValues;

export const countDone = (values: HabitValues) => habits.filter(({ key }) => values[key]).length;

/** 4–5 done is good (green), 2–3 fair (yellow), 0–1 poor (red). */
export const healthLevel = (done: number): Level =>
  done >= 4 ? "good" : done >= 2 ? "fair" : "poor";

/** `3 of 5 done` */
export const healthLabel = (done: number) => `${done} of ${habits.length} done`;

/** The ticked habits, as the checkbox group holds them, back into all five flags. */
export const fromTicked = (ticked: readonly Habit[]): HabitValues =>
  Object.fromEntries(habits.map(({ key }) => [key, ticked.includes(key)])) as HabitValues;
