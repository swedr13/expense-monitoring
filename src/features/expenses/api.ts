import { supabase } from "@/shared/lib/supabase";
import { ensureOk, unwrap } from "@/shared/lib/result";
import type { Expense } from "./types";

/*
  Plain table writes: there is one user, and RLS (`user_id = auth.uid()`) limits
  every call to this phone's own rows. `user_id` is filled by its column default.
*/

const columns =
  "id, user_id, spent_on, position, amount, category, note, included, created_at, updated_at";

/** PostgREST caps a response at 1000 rows, so Records reads in pages. */
const pageSize = 1000;

export type ExpenseValues = {
  amount: number;
  note: string | null;
  included: boolean;
};

/** Amounts are centavos-exact; an empty note is no note. `category` is never sent: old rows keep theirs. */
export const toExpenseValues = (
  amount: number,
  note: string,
  included: boolean,
): ExpenseValues => ({
  amount: Math.round(amount * 100) / 100,
  note: note.trim() || null,
  included,
});

export const fetchDayExpenses = async (day: string): Promise<Expense[]> =>
  unwrap(
    await supabase
      .from("expenses")
      .select(columns)
      .eq("spent_on", day)
      .order("position", { ascending: true }),
  ) as Expense[];

/** Every expense, newest day first. */
export const fetchAllExpenses = async (): Promise<Expense[]> => {
  const all: Expense[] = [];
  for (let from = 0; ; from += pageSize) {
    const page = unwrap(
      await supabase
        .from("expenses")
        .select(columns)
        .order("spent_on", { ascending: false })
        .order("position", { ascending: true })
        .order("id", { ascending: true })
        .range(from, from + pageSize - 1),
    ) as Expense[];
    all.push(...page);
    if (page.length < pageSize) return all;
  }
};

export const createExpense = async (
  values: ExpenseValues & { spentOn: string; position: number },
): Promise<Expense> =>
  unwrap(
    await supabase
      .from("expenses")
      .insert({
        spent_on: values.spentOn,
        position: values.position,
        amount: values.amount,
        note: values.note,
        included: values.included,
      })
      .select(columns)
      .single(),
  ) as Expense;

export const updateExpense = async (id: string, values: ExpenseValues): Promise<Expense> =>
  unwrap(
    await supabase.from("expenses").update(values).eq("id", id).select(columns).single(),
  ) as Expense;

export const deleteExpense = async (id: string): Promise<void> =>
  ensureOk(await supabase.from("expenses").delete().eq("id", id));
