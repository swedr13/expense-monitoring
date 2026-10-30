import { Checkbox, Form, Input, InputNumber } from "antd";
import type { ExpenseCategory } from "../types";
import {
  amountInput,
  categories,
  categoryOption,
  row,
  rowFields,
  rowMain,
  rowNumber,
} from "../expenses.css";

type CategoryChoiceProps = {
  /** Filled by `Form.Item`. */
  value?: ExpenseCategory | null;
  onChange?: (value: ExpenseCategory | null) => void;
  label: string;
};

/** Food / Others as two checkboxes that act as one pick: ticking one unticks the other. */
const CategoryChoice = ({ value = null, onChange, label }: CategoryChoiceProps) => {
  const pick = (category: ExpenseCategory, checked: boolean) =>
    onChange?.(checked ? category : null);

  return (
    <div className={categories} role="group" aria-label={label}>
      <Checkbox
        className={categoryOption}
        checked={value === "food"}
        onChange={(e) => pick("food", e.target.checked)}
      >
        Food
      </Checkbox>
      <Checkbox
        className={categoryOption}
        checked={value === "others"}
        onChange={(e) => pick("others", e.target.checked)}
      >
        Others
      </Checkbox>
    </div>
  );
};

type ExpenseRowProps = {
  /** The row's index in the sheet's `rows` list, which is also its saved `position`. */
  name: number;
  /** Save this row: called when the amount or note loses focus, and when the category changes. */
  onCommit: () => void;
};

/** One expense: the amount, Food/Others, and a note when it's Others. */
export const ExpenseRow = ({ name, onCommit }: ExpenseRowProps) => {
  const form = Form.useFormInstance();
  const category = Form.useWatch(["rows", name, "category"], form) as ExpenseCategory | null;
  const number = name + 1;

  const onCategoryChange = (next: ExpenseCategory | null) => {
    // the note belongs to Others: leaving Others drops it here and on the server
    if (next !== "others") form.setFieldValue(["rows", name, "note"], "");
    onCommit();
  };

  return (
    <div className={row} role="group" aria-label={`Expense ${number}`}>
      <span className={rowNumber} aria-hidden="true">
        {number}
      </span>
      <div className={rowFields}>
        <div className={rowMain}>
          <Form.Item name={[name, "amount"]} noStyle>
            <InputNumber
              className={amountInput}
              size="large"
              prefix="₱"
              min={0}
              precision={2}
              inputMode="decimal"
              controls={false}
              placeholder="0.00"
              aria-label={`Expense ${number} amount`}
              onBlur={onCommit}
            />
          </Form.Item>
          <Form.Item name={[name, "category"]} noStyle>
            {/* Form.Item stores the new value first, then calls this onChange */}
            <CategoryChoice label={`Expense ${number} category`} onChange={onCategoryChange} />
          </Form.Item>
        </div>
        {category === "others" && (
          <Form.Item name={[name, "note"]} noStyle>
            <Input
              size="large"
              placeholder="What was it?"
              maxLength={120}
              aria-label={`Expense ${number}: what was it?`}
              onBlur={onCommit}
            />
          </Form.Item>
        )}
      </div>
    </div>
  );
};
