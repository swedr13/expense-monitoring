import { describe, expect, it } from "vitest";
import { combineDays, groupByDay } from "@/features/expenses/summary";
import type { Expense } from "@/features/expenses/types";
import {
  countDone,
  fromTicked,
  healthLabel,
  healthLevel,
  noHabits,
  toHabitValues,
} from "@/features/health/summary";
import type { HealthDay } from "@/features/health/types";

const healthDay = (overrides: Partial<HealthDay>): HealthDay => ({
  id: crypto.randomUUID(),
  user_id: "user-1",
  checked_on: "2026-10-30",
  ...noHabits,
  created_at: "2026-10-30T01:00:00Z",
  updated_at: "2026-10-30T01:00:00Z",
  ...overrides,
});

const expense = (overrides: Partial<Expense>): Expense => ({
  id: crypto.randomUUID(),
  user_id: "user-1",
  spent_on: "2026-10-30",
  position: 0,
  amount: 100,
  category: null,
  note: null,
  included: true,
  created_at: "2026-10-30T01:00:00Z",
  updated_at: "2026-10-30T01:00:00Z",
  ...overrides,
});

describe("healthLevel", () => {
  it("is green for 4–5 habits, yellow for 2–3, red for 0–1", () => {
    expect([0, 1, 2, 3, 4, 5].map(healthLevel)).toEqual([
      "poor",
      "poor",
      "fair",
      "fair",
      "good",
      "good",
    ]);
  });

  it("labels the count out of five", () => {
    expect(healthLabel(3)).toBe("3 of 5 done");
  });
});

describe("habit values", () => {
  it("counts the ticked habits of a saved day, ignoring its other columns", () => {
    const day = healthDay({ worked_out: true, no_fast_food: true });
    expect(toHabitValues(day)).toEqual({ ...noHabits, worked_out: true, no_fast_food: true });
    expect(countDone(toHabitValues(day))).toBe(2);
  });

  it("treats a missing day as nothing ticked", () => {
    expect(toHabitValues(null)).toEqual(noHabits);
  });

  it("turns the ticked list back into all five flags", () => {
    expect(fromTicked(["drink_water", "eat_less"])).toEqual({
      ...noHabits,
      drink_water: true,
      eat_less: true,
    });
  });
});

describe("combineDays", () => {
  it("makes one record per day that has expenses, a checklist, or both, newest first", () => {
    const days = combineDays(
      groupByDay([
        expense({ spent_on: "2026-10-29", amount: 50 }),
        expense({ spent_on: "2026-10-27" }),
      ]),
      [healthDay({ checked_on: "2026-10-30" }), healthDay({ checked_on: "2026-10-29" })],
    );

    expect(
      days.map((d) => [d.day, d.expense?.total ?? null, d.health?.checked_on ?? null]),
    ).toEqual([
      ["2026-10-30", null, "2026-10-30"],
      ["2026-10-29", 50, "2026-10-29"],
      ["2026-10-27", 100, null],
    ]);
  });
});
