import { formatPeso } from "../summary";
import { totalAmount, totalBar, totalLabel, totalValue } from "../expenses.css";
import { SpendCheck } from "./SpendCheck";

/** Today's total of the ticked rows: a read-only label that follows what's typed, saved or not. */
export const ExpenseTotal = ({ total }: { total: number }) => (
  <div className={totalBar}>
    <span className={totalLabel} id="expense-total-label">
      Total
    </span>
    <span className={totalAmount}>
      <SpendCheck total={total} />
      <output className={totalValue} aria-labelledby="expense-total-label">
        {formatPeso(total)}
      </output>
    </span>
  </div>
);
