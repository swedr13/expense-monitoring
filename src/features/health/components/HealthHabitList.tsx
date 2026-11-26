import { List } from "antd";
import { PiCheckBold, PiXBold } from "react-icons/pi";
import { habits } from "../summary";
import type { HabitValues } from "../types";
import { habitLine, habitStatus } from "../health.css";

/** Records: each habit with whether it was done that day. */
export const HealthHabitList = ({ values }: { values: HabitValues }) => (
  <List
    size="small"
    dataSource={[...habits]}
    rowKey="key"
    renderItem={({ key, label }) => (
      <List.Item>
        <span className={habitLine}>
          <span>{label}</span>
          {values[key] ? (
            <span className={habitStatus.done}>
              <PiCheckBold aria-hidden="true" /> Done
            </span>
          ) : (
            <span className={habitStatus.missed}>
              <PiXBold aria-hidden="true" /> Not done
            </span>
          )}
        </span>
      </List.Item>
    )}
  />
);
