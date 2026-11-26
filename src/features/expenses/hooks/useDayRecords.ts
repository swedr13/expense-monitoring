import { useMemo } from "react";
import { useHealthRecords } from "@/features/health/hooks/useHealthRecords";
import { combineDays } from "../summary";
import { useExpenseRecords } from "./useExpenseRecords";

/** Records: every day with expenses or a Health checklist, newest first. */
export const useDayRecords = () => {
  const expenses = useExpenseRecords();
  const health = useHealthRecords();

  const data = useMemo(
    () => (expenses.data && health.data ? combineDays(expenses.data, health.data) : undefined),
    [expenses.data, health.data],
  );

  return {
    data,
    isPending: expenses.isPending || health.isPending,
    error: expenses.error ?? health.error,
    refetch: () => {
      void expenses.refetch();
      void health.refetch();
    },
  };
};
