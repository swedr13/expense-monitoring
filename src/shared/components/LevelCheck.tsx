import { Tooltip } from "antd";
import { PiCheckCircleFill } from "react-icons/pi";
import { levelCheck } from "../styles/levelCheck.css";

/** Good is green, fair is yellow, poor is red. */
export type Level = "good" | "fair" | "poor";

type LevelCheckProps = {
  level: Level;
  /** What the colour means, for the tooltip and screen readers — colour is never the only cue. */
  label: string;
};

/** A coloured check beside a total or score. */
export const LevelCheck = ({ level, label }: LevelCheckProps) => (
  <Tooltip title={label}>
    <span className={levelCheck[level]} role="img" aria-label={label}>
      <PiCheckCircleFill aria-hidden="true" />
    </span>
  </Tooltip>
);
