import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { getErrorMessage } from "@/shared/lib/errors";
import {
  createExpense,
  deleteExpense,
  toExpenseValues,
  updateExpense,
  type ExpenseValues,
} from "../api";
import { expenseKeys } from "../queryKeys";
import type { Expense, ExpenseDraft } from "../types";

/**
 * Auto-save for one day's sheet. `save(position, draft)` works out what the row
 * needs: an empty row that gets an amount is inserted, a saved row that changed
 * is updated, a saved row whose amount was cleared is deleted.
 */
export const useExpenseMutations = (day: string, saved: readonly Expense[]) => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const onSuccess = () => queryClient.invalidateQueries({ queryKey: expenseKeys.all });
  const onError = (error: unknown) => {
    void message.error(getErrorMessage(error));
  };

  const create = useMutation({
    mutationFn: (v: Parameters<typeof createExpense>[0]) => createExpense(v),
    onSuccess,
    onError,
  });
  const update = useMutation({
    mutationFn: (v: { id: string; values: ExpenseValues }) => updateExpense(v.id, v.values),
    onSuccess,
    onError,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess,
    onError,
  });

  // What the server holds at each position, as far as this sheet knows: seeded
  // from the first load on the first save, then kept current by its own writes.
  const serverRows = useRef<Map<number, Expense> | null>(null);
  // Saves of one row run in order, so a blur then a quick tick can't insert it twice.
  const queues = useRef(new Map<number, Promise<void>>());

  const write = async (position: number, draft: ExpenseDraft) => {
    const rows = (serverRows.current ??= new Map(saved.map((e) => [e.position, e])));
    const current = rows.get(position);
    const amount = draft.amount ?? 0;

    if (!current) {
      if (amount <= 0) return;
      const values = toExpenseValues(amount, draft.category, draft.note);
      rows.set(position, await create.mutateAsync({ ...values, spentOn: day, position }));
    } else if (amount <= 0) {
      await remove.mutateAsync(current.id);
      rows.delete(position);
    } else {
      const values = toExpenseValues(amount, draft.category, draft.note);
      const isUnchanged =
        values.amount === current.amount &&
        values.category === current.category &&
        values.note === current.note;
      if (isUnchanged) return;
      rows.set(position, await update.mutateAsync({ id: current.id, values }));
    }
  };

  const save = (position: number, draft: ExpenseDraft) => {
    const previous = queues.current.get(position) ?? Promise.resolve();
    // a failed save was already reported by onError; the next change retries it
    const next = previous.then(() => write(position, draft)).catch(() => undefined);
    queues.current.set(position, next);
    return next;
  };

  return { save };
};
