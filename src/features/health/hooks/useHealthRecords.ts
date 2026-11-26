import { useQuery } from "@tanstack/react-query";
import { fetchAllHealth } from "../api";
import { healthKeys } from "../queryKeys";

/** Every saved checklist, newest day first. */
export const useHealthRecords = () =>
  useQuery({
    queryKey: healthKeys.records(),
    queryFn: fetchAllHealth,
  });
