export const healthKeys = {
  all: ["health"] as const,
  day: (day: string) => [...healthKeys.all, "day", day] as const,
  records: () => [...healthKeys.all, "records"] as const,
};
