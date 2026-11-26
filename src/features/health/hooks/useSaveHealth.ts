import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { getErrorMessage } from "@/shared/lib/errors";
import { saveHealth } from "../api";
import { healthKeys } from "../queryKeys";
import type { HabitValues } from "../types";

/** Auto-save for one day's checklist. Saves run one at a time, so the last tick always wins. */
export const useSaveHealth = (day: string) => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (values: HabitValues) => saveHealth(day, values),
    scope: { id: `health-${day}` },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: healthKeys.all }),
    onError: (error) => {
      void message.error(getErrorMessage(error));
    },
  });
};
