import type { Database } from "@/shared/lib/database.types";

/** Rows saved before notes replaced Food/Others may still carry one; new rows leave it null. */
export type ExpenseCategory = "food" | "others";

// Read from Database directly: the generated Tables<> helper defaults to `public`,
// which isn't in the types when only the expenses schema is generated.
type ExpenseRow = Database["expenses"]["Tables"]["expenses"]["Row"];

export type Expense = Omit<ExpenseRow, "category"> & { category: ExpenseCategory | null };

/** What one row on the Expenses tab holds while it's being typed. */
export type ExpenseDraft = {
  amount: number | null;
  note: string;
  /** Ticked rows count toward the total. */
  included: boolean;
};

/** How many expenses there were and what they came to. */
export type Tally = { count: number; total: number };

/** One Records panel. */
export type DaySummary = {
  /** `YYYY-MM-DD`, the Manila day. */
  day: string;
  /** What the ticked rows came to. */
  total: number;
  /** Rows saved with their checkbox unticked. */
  excluded: Tally;
  expenses: Expense[];
};
