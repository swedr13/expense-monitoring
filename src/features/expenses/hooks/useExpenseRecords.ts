import { useQuery } from "@tanstack/react-query";
import { fetchAllExpenses } from "../api";
import { expenseKeys } from "../queryKeys";
import { groupByDay } from "../summary";

/** Every day with expenses, newest first, with its total. */
export const useExpenseRecords = () =>
  useQuery({
    queryKey: expenseKeys.records(),
    queryFn: fetchAllExpenses,
    select: groupByDay,
  });
