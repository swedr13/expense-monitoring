import { Collapse, List } from "antd";
import { DataState } from "@/shared/components/DataState";
import { dayjs } from "@/shared/lib/dayjs";
import { useExpenseRecords } from "../hooks/useExpenseRecords";
import { formatPeso } from "../summary";
import type { DaySummary, Expense } from "../types";
import {
  dayHeading,
  dayLabel,
  daySummary,
  recordAmount,
  recordDetail,
  recordLine,
} from "../expenses.css";

const expensesText = (count: number) => `${count} ${count === 1 ? "expense" : "expenses"}`;

/** Under the date: how many expenses, and what was left out of the total. */
const DaySummaryLine = ({ record }: { record: DaySummary }) => (
  <span className={daySummary}>
    <span>{expensesText(record.expenses.length)}</span>
    {record.excluded.count > 0 && (
      <span>
        Not in total: {expensesText(record.excluded.count)} · {formatPeso(record.excluded.total)}
      </span>
    )}
  </span>
);

const DayExpenses = ({ expenses }: { expenses: Expense[] }) => (
  <List
    size="small"
    dataSource={expenses}
    rowKey="id"
    renderItem={(expense) => (
      <List.Item>
        <span className={recordLine}>
          <span className={recordAmount}>{formatPeso(expense.amount)}</span>
          <span className={recordDetail}>
            {expense.note ?? "—"}
            {!expense.included && " · not in total"}
          </span>
        </span>
      </List.Item>
    )}
  />
);

/** One closed panel per day, newest first, titled with the day's total of ticked expenses. */
export const ExpenseRecords = () => {
  const records = useExpenseRecords();

  return (
    <DataState
      isLoading={records.isPending}
      error={records.error}
      onRetry={() => records.refetch()}
      isEmpty={records.data?.length === 0}
      emptyText="No records yet. Expenses you enter show up here, one day per panel."
    >
      <Collapse
        items={(records.data ?? []).map((record) => ({
          key: record.day,
          label: (
            <span className={dayHeading}>
              <span className={dayLabel}>
                {dayjs(record.day).format("ddd, MMM D, YYYY")} · {formatPeso(record.total)}
              </span>
              <DaySummaryLine record={record} />
            </span>
          ),
          children: <DayExpenses expenses={record.expenses} />,
        }))}
      />
    </DataState>
  );
};
