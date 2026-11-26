import { useQuery } from "@tanstack/react-query";
import { useManilaToday } from "@/shared/hooks/useManilaToday";
import { fetchDayExpenses } from "../api";
import { expenseKeys } from "../queryKeys";

/** Today's saved expenses, in row order. */
export const useTodayExpenses = () => {
  const today = useManilaToday();
  const query = useQuery({
    queryKey: expenseKeys.day(today),
    queryFn: () => fetchDayExpenses(today),
  });
  return { today, query };
};
