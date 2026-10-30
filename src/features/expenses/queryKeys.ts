export const expenseKeys = {
  all: ["expenses"] as const,
  day: (day: string) => [...expenseKeys.all, "day", day] as const,
  records: () => [...expenseKeys.all, "records"] as const,
};
