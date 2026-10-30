import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { manilaDay } from "@/shared/lib/dayjs";
import { fetchDayExpenses } from "../api";
import { expenseKeys } from "../queryKeys";

/** Re-checks the day every minute and whenever the app comes back to the front. */
const subscribe = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 60_000);
  document.addEventListener("visibilitychange", onChange);
  window.addEventListener("focus", onChange);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", onChange);
    window.removeEventListener("focus", onChange);
  };
};

/** Today in Manila (`YYYY-MM-DD`). Changes at Manila midnight, so the sheet starts over. */
export const useManilaToday = () => useSyncExternalStore(subscribe, manilaDay, manilaDay);

/** Today's saved expenses, in row order. */
export const useTodayExpenses = () => {
  const today = useManilaToday();
  const query = useQuery({
    queryKey: expenseKeys.day(today),
    queryFn: () => fetchDayExpenses(today),
  });
  return { today, query };
};
