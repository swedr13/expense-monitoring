import { useState } from "react";
import { Button, Card, Form } from "antd";
import { PiPlusBold, PiReceiptDuotone } from "react-icons/pi";
import { DataState } from "@/shared/components/DataState";
import { PanelTitle } from "@/shared/components/PanelTitle";
import { dayjs } from "@/shared/lib/dayjs";
import { useExpenseMutations } from "../hooks/useExpenseMutations";
import { useTodayExpenses } from "../hooks/useTodayExpenses";
import { sumIncluded } from "../summary";
import type { Expense, ExpenseDraft } from "../types";
import { addButton, rowList, sheetHint, sheetHintStrong } from "../expenses.css";
import { ExpenseRow } from "./ExpenseRow";
import { ExpenseTotal } from "./ExpenseTotal";

/** The sheet always offers at least this many rows. */
const minRows = 10;

const blankRow = (): ExpenseDraft => ({ amount: null, note: "", included: true });

type SheetValues = { rows: ExpenseDraft[] };

/** A row per position, saved ones filled in; at least `minRows`. */
const toRows = (saved: readonly Expense[]): ExpenseDraft[] => {
  const byPosition = new Map(saved.map((e) => [e.position, e]));
  const length = Math.max(minRows, ...saved.map((e) => e.position + 1));
  return Array.from({ length }, (_, position) => {
    const expense = byPosition.get(position);
    return expense
      ? { amount: expense.amount, note: expense.note ?? "", included: expense.included }
      : blankRow();
  });
};

type DaySheetProps = { day: string; saved: readonly Expense[] };

const DaySheet = ({ day, saved }: DaySheetProps) => {
  const [form] = Form.useForm<SheetValues>();
  // the form owns what's typed; it starts from the saved rows and each change is saved back
  const [initialValues] = useState<SheetValues>(() => ({ rows: toRows(saved) }));
  const rows = Form.useWatch("rows", form) ?? initialValues.rows;
  const { save } = useExpenseMutations(day, saved);

  const commit = (position: number) =>
    void save(position, form.getFieldValue(["rows", position]) as ExpenseDraft);

  return (
    <Card
      title={
        <PanelTitle icon={<PiReceiptDuotone />}>
          Today · {dayjs(day).format("ddd, MMM D")}
        </PanelTitle>
      }
    >
      <p className={sheetHint} id="expense-sheet-hint">
        <span>
          Type the <strong className={sheetHintStrong}>₱ Amount</strong>, then{" "}
          <strong className={sheetHintStrong}>what it was for</strong> beside it.
        </span>
        <span>Untick the box before an amount to leave it out of the total.</span>
      </p>
      <Form
        form={form}
        initialValues={initialValues}
        aria-label="Today's expenses"
        aria-describedby="expense-sheet-hint"
      >
        <Form.List name="rows">
          {(fields, { add }) => (
            <>
              <div className={rowList}>
                {fields.map((field) => (
                  <ExpenseRow
                    key={field.key}
                    name={field.name}
                    onCommit={() => commit(field.name)}
                  />
                ))}
              </div>
              <Button
                className={addButton}
                block
                size="large"
                icon={<PiPlusBold aria-hidden="true" />}
                onClick={() => add(blankRow())}
              >
                Add another expense
              </Button>
            </>
          )}
        </Form.List>
      </Form>
      <ExpenseTotal total={sumIncluded(rows)} />
    </Card>
  );
};

/** Today's expenses: at least 10 rows that save themselves, and the running total. */
export const ExpenseSheet = () => {
  const { today, query } = useTodayExpenses();

  return (
    <DataState
      isLoading={query.isPending}
      // once loaded, a failed background refetch must not wipe what's being typed
      error={query.data ? null : query.error}
      onRetry={() => query.refetch()}
      rows={6}
    >
      {/* a new Manila day remounts the sheet: 10 empty rows again */}
      {query.data && <DaySheet key={today} day={today} saved={query.data} />}
    </DataState>
  );
};
