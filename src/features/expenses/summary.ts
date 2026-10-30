import type { DaySummary, Expense, ExpenseCategory } from "./types";

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

/** `₱1,250.00` */
export const formatPeso = (amount: number) => peso.format(amount);

/** Sums in centavos so 0.1 + 0.2 is 0.30, not 0.30000000000000004. Blanks count as 0. */
export const sumAmounts = (amounts: ReadonlyArray<number | null | undefined>) =>
  amounts.reduce<number>((cents, amount) => cents + Math.round((amount ?? 0) * 100), 0) / 100;

export const categoryLabel = (category: ExpenseCategory | null) =>
  category === "food" ? "Food" : category === "others" ? "Others" : "—";

/** One entry per `spent_on` day, newest day first, each day's rows in position order. */
export const groupByDay = (expenses: readonly Expense[]): DaySummary[] => {
  const byDay = new Map<string, Expense[]>();
  for (const expense of expenses) {
    byDay.set(expense.spent_on, [...(byDay.get(expense.spent_on) ?? []), expense]);
  }

  return [...byDay.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([day, rows]) => {
      const sorted = [...rows].sort((left, right) => left.position - right.position);
      return { day, expenses: sorted, total: sumAmounts(sorted.map((row) => row.amount)) };
    });
};
