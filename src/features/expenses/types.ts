import type { Database } from "@/shared/lib/database.types";

/** `null` is uncategorised. Mirrors the `category` check constraint. */
export type ExpenseCategory = "food" | "others";

// Read from Database directly: the generated Tables<> helper defaults to `public`,
// which isn't in the types when only the expenses schema is generated.
type ExpenseRow = Database["expenses"]["Tables"]["expenses"]["Row"];

export type Expense = Omit<ExpenseRow, "category"> & { category: ExpenseCategory | null };

/** What one row on the Expenses tab holds while it's being typed. */
export type ExpenseDraft = {
  amount: number | null;
  category: ExpenseCategory | null;
  note: string;
};

/** How many expenses fell in one category on a day, and what they came to. */
export type CategoryTally = { count: number; total: number };

/** One Records panel. */
export type DaySummary = {
  /** `YYYY-MM-DD`, the Manila day. */
  day: string;
  total: number;
  food: CategoryTally;
  others: CategoryTally;
  /** Rows saved without Food or Others ticked. */
  uncategorised: CategoryTally;
  expenses: Expense[];
};
