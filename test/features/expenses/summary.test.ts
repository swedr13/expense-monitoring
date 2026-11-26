import { describe, expect, it } from "vitest";
import {
  formatPeso,
  groupByDay,
  spendLevel,
  sumAmounts,
  sumIncluded,
} from "@/features/expenses/summary";
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
  included: true,
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

  it("leaves unticked rows out of the day's total and tallies them apart", () => {
    const [day] = groupByDay([
      expense({ position: 0, amount: 120 }),
      expense({ position: 1, amount: 80.5 }),
      expense({ position: 2, amount: 300, included: false }),
      expense({ position: 3, amount: 50, included: false }),
    ]);

    expect(day.total).toBe(200.5);
    expect(day.excluded).toEqual({ count: 2, total: 350 });
    expect(day.expenses).toHaveLength(4);
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

describe("sumIncluded", () => {
  it("adds only ticked rows, blanks as zero", () => {
    expect(
      sumIncluded([
        { amount: 100, included: true },
        { amount: 50, included: false },
        { amount: null, included: true },
        { amount: 0.1, included: true },
        undefined,
      ]),
    ).toBe(100.1);
  });
});

describe("spendLevel", () => {
  it("is green under ₱500, yellow from ₱500 to ₱1,000, red over ₱1,000", () => {
    expect(spendLevel(0)).toBe("low");
    expect(spendLevel(499.99)).toBe("low");
    expect(spendLevel(500)).toBe("mid");
    expect(spendLevel(1000)).toBe("mid");
    expect(spendLevel(1000.01)).toBe("high");
  });
});

describe("formatPeso", () => {
  it("formats pesos with the sign, grouping and two decimals", () => {
    expect(formatPeso(1250)).toBe("₱1,250.00");
    expect(formatPeso(0)).toBe("₱0.00");
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
