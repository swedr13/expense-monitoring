import { LevelCheck } from "@/shared/components/LevelCheck";
import { spendLevel, spendLevelLabel } from "../summary";

/** A check coloured by the total: green under ₱500, yellow up to ₱1,000, red over. */
export const SpendCheck = ({ total }: { total: number }) => {
  const level = spendLevel(total);
  return <LevelCheck level={level} label={spendLevelLabel[level]} />;
};
