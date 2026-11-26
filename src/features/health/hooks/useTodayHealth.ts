import { useQuery } from "@tanstack/react-query";
import { useManilaToday } from "@/shared/hooks/useManilaToday";
import { fetchDayHealth } from "../api";
import { healthKeys } from "../queryKeys";

/** Today's saved checklist (null until something is ticked). */
export const useTodayHealth = () => {
  const today = useManilaToday();
  const query = useQuery({
    queryKey: healthKeys.day(today),
    queryFn: () => fetchDayHealth(today),
  });
  return { today, query };
};
