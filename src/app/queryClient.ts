import { QueryClient } from "@tanstack/react-query";

/**
 * Every write invalidates the queries it affects. A short staleTime still
 * refetches on focus/reconnect, so a phone left open overnight picks up the new day.
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10_000,
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
        // Never hold a save offline and send it later: it fails right away with
        // "Can't reach the server", and the row keeps what was typed.
        networkMode: "always",
      },
    },
  });
