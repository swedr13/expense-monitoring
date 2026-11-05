import { Collapse, List } from "antd";
import { DataState } from "@/shared/components/DataState";
import { dayjs } from "@/shared/lib/dayjs";
import { useExpenseRecords } from "../hooks/useExpenseRecords";
import { categoryLabel, formatPeso } from "../summary";
import type { CategoryTally, DaySummary, Expense } from "../types";
import {
  dayHeading,
  dayLabel,
  daySummary,
  recordAmount,
  recordDetail,
  recordLine,
} from "../expenses.css";

const tallyText = (label: string, { count, total }: CategoryTally) =>
  `${label}: ${count} ${count === 1 ? "expense" : "expenses"} · ${formatPeso(total)}`;

/** Under the date: how the day splits between Food and Others. */
const DaySummaryLine = ({ record }: { record: DaySummary }) => (
  <span className={daySummary}>
    <span>{tallyText("Food", record.food)}</span>
    <span>{tallyText("Others", record.others)}</span>
    {record.uncategorised.count > 0 && (
      <span>{tallyText("Uncategorised", record.uncategorised)}</span>
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
            {categoryLabel(expense.category)}
            {expense.note && ` · ${expense.note}`}
          </span>
        </span>
      </List.Item>
    )}
  />
);

/** One closed panel per day, newest first, titled with the day's total and its Food/Others split. */
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
