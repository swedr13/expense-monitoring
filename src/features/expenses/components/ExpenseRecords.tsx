import { Collapse, List } from "antd";
import { HealthHabitList } from "@/features/health/components/HealthHabitList";
import { HealthLevelCheck } from "@/features/health/components/HealthLevelCheck";
import { countDone, healthLabel, toHabitValues } from "@/features/health/summary";
import { DataState } from "@/shared/components/DataState";
import { dayjs } from "@/shared/lib/dayjs";
import { useDayRecords } from "../hooks/useDayRecords";
import { formatPeso } from "../summary";
import type { DayRecord, DaySummary, Expense } from "../types";
import {
  categoryLine,
  categoryName,
  dayHeading,
  dayLabel,
  daySummary,
  recordAmount,
  recordDetail,
  recordEmpty,
  recordLine,
  recordSection,
} from "../expenses.css";
import { SpendCheck } from "./SpendCheck";

const expensesText = (count: number) => `${count} ${count === 1 ? "expense" : "expenses"}`;

/** After the Expense check: how many expenses, and what was left out of the total. */
const ExpenseSummaryLine = ({ summary }: { summary: DaySummary }) => (
  <span className={daySummary}>
    <span>{expensesText(summary.expenses.length)}</span>
    {summary.excluded.count > 0 && (
      <span>
        Not in total: {expensesText(summary.excluded.count)} · {formatPeso(summary.excluded.total)}
      </span>
    )}
  </span>
);

/** The panel title: the date, then the Expense total and the Health score, each with its check. */
const DayHeading = ({ record }: { record: DayRecord }) => {
  const done = record.health ? countDone(toHabitValues(record.health)) : 0;

  return (
    <span className={dayHeading}>
      <span className={dayLabel}>{dayjs(record.day).format("ddd, MMM D, YYYY")}</span>
      <span className={categoryLine}>
        <span className={categoryName}>Expense</span>
        {record.expense ? (
          <>
            <span>· {formatPeso(record.expense.total)}</span>
            <SpendCheck total={record.expense.total} />
            <ExpenseSummaryLine summary={record.expense} />
          </>
        ) : (
          <span>· none</span>
        )}
      </span>
      <span className={categoryLine}>
        <span className={categoryName}>Health</span>
        {record.health ? (
          <>
            <span>· {healthLabel(done)}</span>
            <HealthLevelCheck done={done} />
          </>
        ) : (
          <span>· not recorded</span>
        )}
      </span>
    </span>
  );
};

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

/** Inside a panel: the day's expenses, then its Health checklist. */
const DayBody = ({ record }: { record: DayRecord }) => (
  <>
    <section className={recordSection}>
      <h3 className={categoryName}>Expense</h3>
      {record.expense ? (
        <DayExpenses expenses={record.expense.expenses} />
      ) : (
        <p className={recordEmpty}>No expenses this day.</p>
      )}
    </section>
    <section className={recordSection}>
      <h3 className={categoryName}>Health</h3>
      {record.health ? (
        <HealthHabitList values={toHabitValues(record.health)} />
      ) : (
        <p className={recordEmpty}>Not recorded this day.</p>
      )}
    </section>
  </>
);

/** One closed panel per day, newest first, with its Expense total and Health score. */
export const ExpenseRecords = () => {
  const records = useDayRecords();

  return (
    <DataState
      isLoading={records.isPending}
      error={records.error}
      onRetry={records.refetch}
      isEmpty={records.data?.length === 0}
      emptyText="No records yet. Expenses and Health checks you enter show up here, one day per panel."
    >
      <Collapse
        items={(records.data ?? []).map((record) => ({
          key: record.day,
          label: <DayHeading record={record} />,
          children: <DayBody record={record} />,
        }))}
      />
    </DataState>
  );
};
