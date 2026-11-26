import { Checkbox, Form, Input, InputNumber } from "antd";
import { PiNotePencilDuotone } from "react-icons/pi";
import { amountInput, includeToggle, noteInput, row, rowMain, rowNumber } from "../expenses.css";

type ExpenseRowProps = {
  /** The row's index in the sheet's `rows` list, which is also its saved `position`. */
  name: number;
  /** Save this row: called when the amount or note loses focus, and when the checkbox changes. */
  onCommit: () => void;
};

/** One expense: whether it counts in the total, the amount, and what it was for. */
export const ExpenseRow = ({ name, onCommit }: ExpenseRowProps) => {
  const number = name + 1;

  return (
    <div className={row} role="group" aria-label={`Expense ${number}`}>
      <span className={rowNumber} aria-hidden="true">
        {number}
      </span>
      <div className={rowMain}>
        <Form.Item name={[name, "included"]} valuePropName="checked" noStyle>
          {/* Form.Item stores the new value first, then calls this onChange */}
          <Checkbox
            className={includeToggle}
            aria-label={`Count expense ${number} in the total`}
            onChange={onCommit}
          />
        </Form.Item>
        <Form.Item name={[name, "amount"]} noStyle>
          <InputNumber
            className={amountInput}
            size="large"
            prefix="₱"
            min={0}
            precision={2}
            inputMode="decimal"
            controls={false}
            placeholder="Amount"
            aria-label={`Expense ${number} amount`}
            onBlur={onCommit}
          />
        </Form.Item>
        <Form.Item name={[name, "note"]} noStyle>
          <Input
            className={noteInput}
            size="large"
            prefix={<PiNotePencilDuotone aria-hidden="true" />}
            placeholder="What was it for?"
            maxLength={120}
            aria-label={`Expense ${number}: what was it for?`}
            onBlur={onCommit}
          />
        </Form.Item>
      </div>
    </div>
  );
};
