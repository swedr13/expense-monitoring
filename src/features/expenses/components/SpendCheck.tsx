import { Tooltip } from "antd";
import { PiCheckCircleFill } from "react-icons/pi";
import { spendLevel, spendLevelLabel } from "../summary";
import { spendCheck } from "../expenses.css";

/** A check coloured by the total: green under ₱500, yellow up to ₱1,000, red over. */
export const SpendCheck = ({ total }: { total: number }) => {
  const level = spendLevel(total);
  const label = spendLevelLabel[level];

  return (
    <Tooltip title={label}>
      <span className={spendCheck[level]} role="img" aria-label={label}>
        <PiCheckCircleFill aria-hidden="true" />
      </span>
    </Tooltip>
  );
};
