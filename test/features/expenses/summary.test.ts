import { describe, expect, it } from "vitest";
import { categoryLabel, formatPeso, groupByDay, sumAmounts } from "@/features/expenses/summary";
import type { Expense } from "@/features/expenses/types";
import { manilaDay } from "@/shared/lib/dayjs";

const expense = (overrides: Partial<Expense>): Expense => ({
  id: crypto.randomUUID(),
  user_id: "user-1",
  spent_on: "2026-10-30",
  position: 0,
  amount: 100,
  category: null,
  note: null,
  created_at: "2026-10-30T01:00:00Z",
  updated_at: "2026-10-30T01:00:00Z",
  ...overrides,
});

describe("groupByDay", () => {
  it("makes one entry per day, newest day first", () => {
    const days = groupByDay([
      expense({ spent_on: "2026-10-28" }),
      expense({ spent_on: "2026-10-30" }),
      expense({ spent_on: "2026-10-29" }),
      expense({ spent_on: "2026-10-30", position: 1 }),
    ]);

    expect(days.map((d) => d.day)).toEqual(["2026-10-30", "2026-10-29", "2026-10-28"]);
    expect(days[0].expenses).toHaveLength(2);
  });

  it("keeps each day's rows in position order", () => {
    const [day] = groupByDay([
      expense({ position: 2, amount: 3 }),
      expense({ position: 0, amount: 1 }),
      expense({ position: 1, amount: 2 }),
    ]);

    expect(day.expenses.map((e) => e.amount)).toEqual([1, 2, 3]);
  });

  it("totals each day on its own", () => {
    const days = groupByDay([
      expense({ spent_on: "2026-10-30", amount: 1000 }),
      expense({ spent_on: "2026-10-30", position: 1, amount: 250 }),
      expense({ spent_on: "2026-10-29", amount: 75.5 }),
    ]);

    expect(days.map((d) => d.total)).toEqual([1250, 75.5]);
  });

  it("counts and totals Food, Others and uncategorised rows per day", () => {
    const [day] = groupByDay([
      expense({ position: 0, amount: 120, category: "food" }),
      expense({ position: 1, amount: 80.5, category: "food" }),
      expense({ position: 2, amount: 300, category: "others" }),
      expense({ position: 3, amount: 50, category: null }),
    ]);

    expect(day.food).toEqual({ count: 2, total: 200.5 });
    expect(day.others).toEqual({ count: 1, total: 300 });
    expect(day.uncategorised).toEqual({ count: 1, total: 50 });
    expect(day.total).toBe(550.5);
  });

  it("is empty with no expenses", () => {
    expect(groupByDay([])).toEqual([]);
  });
});

describe("sumAmounts", () => {
  it("adds to the centavo, without float drift", () => {
    expect(sumAmounts([0.1, 0.2])).toBe(0.3);
    expect(sumAmounts([19.99, 0.01, 1230])).toBe(1250);
  });

  it("counts blank rows as zero", () => {
    expect(sumAmounts([null, 12.5, undefined])).toBe(12.5);
    expect(sumAmounts([])).toBe(0);
  });
});

describe("formatPeso and categoryLabel", () => {
  it("formats pesos with the sign, grouping and two decimals", () => {
    expect(formatPeso(1250)).toBe("₱1,250.00");
    expect(formatPeso(0)).toBe("₱0.00");
  });

  it("labels categories, with a dash for uncategorised", () => {
    expect(categoryLabel("food")).toBe("Food");
    expect(categoryLabel("others")).toBe("Others");
    expect(categoryLabel(null)).toBe("—");
  });
});

describe("the Manila day boundary", () => {
  it("starts the new day at midnight Manila (16:00 UTC), not midnight UTC", () => {
    expect(manilaDay("2026-10-29T15:59:59Z")).toBe("2026-10-29");
    expect(manilaDay("2026-10-29T16:00:00Z")).toBe("2026-10-30");
  });

  it("keeps a Manila morning on the same day even though it's still yesterday in UTC", () => {
    // 07:30 on Oct 30 in Manila
    expect(manilaDay("2026-10-29T23:30:00Z")).toBe("2026-10-30");
  });

  it("ends the day at 23:59 Manila", () => {
    expect(manilaDay("2026-10-30T15:59:00Z")).toBe("2026-10-30");
  });
});
