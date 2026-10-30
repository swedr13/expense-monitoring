import { formatPeso } from "../summary";
import { totalBar, totalLabel, totalValue } from "../expenses.css";

/** Today's total: a read-only label that follows what's typed, saved or not. */
export const ExpenseTotal = ({ total }: { total: number }) => (
  <div className={totalBar}>
    <span className={totalLabel} id="expense-total-label">
      Total
    </span>
    <output className={totalValue} aria-labelledby="expense-total-label">
      {formatPeso(total)}
    </output>
  </div>
);
