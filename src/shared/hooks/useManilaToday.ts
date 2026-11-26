import { useSyncExternalStore } from "react";
import { manilaDay } from "@/shared/lib/dayjs";

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

/** Today in Manila (`YYYY-MM-DD`). Changes at Manila midnight, so today's views start over. */
export const useManilaToday = () => useSyncExternalStore(subscribe, manilaDay, manilaDay);
