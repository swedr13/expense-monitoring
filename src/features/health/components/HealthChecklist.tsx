import { useState } from "react";
import { Card, Checkbox, Form } from "antd";
import { PiHeartbeatDuotone } from "react-icons/pi";
import { DataState } from "@/shared/components/DataState";
import { PanelTitle } from "@/shared/components/PanelTitle";
import { useSaveHealth } from "../hooks/useSaveHealth";
import { useTodayHealth } from "../hooks/useTodayHealth";
import { fromTicked, habits } from "../summary";
import type { Habit, HealthDay } from "../types";
import { habitList, habitOption, healthCard } from "../health.css";
import { HealthLevelCheck } from "./HealthLevelCheck";

type ChecklistValues = { ticked: Habit[] };

type DayChecklistProps = { day: string; saved: HealthDay | null };

const DayChecklist = ({ day, saved }: DayChecklistProps) => {
  const [form] = Form.useForm<ChecklistValues>();
  // the form owns the ticks; it starts from the saved row and each change is saved back
  const [initialValues] = useState<ChecklistValues>(() => ({
    ticked: habits.filter(({ key }) => saved?.[key]).map(({ key }) => key),
  }));
  const ticked = Form.useWatch("ticked", form) ?? initialValues.ticked;
  const save = useSaveHealth(day);

  return (
    <Card
      className={healthCard}
      title={
        <PanelTitle icon={<PiHeartbeatDuotone />} check={<HealthLevelCheck done={ticked.length} />}>
          Health
        </PanelTitle>
      }
    >
      <Form
        form={form}
        initialValues={initialValues}
        aria-label="Today's health checklist"
        onValuesChange={(_, all: ChecklistValues) => save.mutate(fromTicked(all.ticked))}
      >
        <Form.Item name="ticked" noStyle>
          <Checkbox.Group className={habitList}>
            {habits.map(({ key, label }) => (
              <Checkbox key={key} value={key} className={habitOption}>
                {label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Card>
  );
};

/** Today's Health checklist under the Expense card: five habits that save themselves. */
export const HealthChecklist = () => {
  const { today, query } = useTodayHealth();

  return (
    <DataState
      isLoading={query.isPending}
      // once loaded, a failed background refetch must not wipe the ticks
      error={query.data === undefined ? query.error : null}
      onRetry={() => query.refetch()}
      rows={5}
    >
      {/* a new Manila day remounts the checklist: all unticked again */}
      {query.data !== undefined && <DayChecklist key={today} day={today} saved={query.data} />}
    </DataState>
  );
};
