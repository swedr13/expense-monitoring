import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as expensesApi from "@/features/expenses/api";
import * as healthApi from "@/features/health/api";
import { noHabits } from "@/features/health/summary";
import type { HealthDay } from "@/features/health/types";
import { useAuth } from "@/features/identity/hooks/useAuth";
import { manilaDay } from "@/shared/lib/dayjs";
import { expectNoA11yViolations } from "../../a11y";
import { renderRoute } from "../../renderRoute";

vi.mock("@/features/identity/hooks/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("@/features/expenses/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/expenses/api")>()),
  fetchDayExpenses: vi.fn(),
  fetchAllExpenses: vi.fn(),
}));
vi.mock("@/features/health/api", () => ({
  fetchDayHealth: vi.fn(),
  fetchAllHealth: vi.fn(),
  saveHealth: vi.fn(),
}));

const saved = (overrides: Partial<HealthDay>): HealthDay => ({
  id: "health-1",
  user_id: "device-1",
  checked_on: manilaDay(),
  ...noHabits,
  created_at: "2026-10-30T01:00:00Z",
  updated_at: "2026-10-30T01:00:00Z",
  ...overrides,
});

const checklist = () => screen.getByRole("form", { name: "Today's health checklist" });
const habit = (name: string) => within(checklist()).getByRole("checkbox", { name });
const healthCheck = (name: string) => screen.getByRole("img", { name });

describe("Health checklist", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "device-1" },
      session: null,
      isAnonymous: true,
      isLoading: false,
      error: null,
    } as never);
    vi.mocked(expensesApi.fetchDayExpenses).mockResolvedValue([]);
    vi.mocked(expensesApi.fetchAllExpenses).mockResolvedValue([]);
    vi.mocked(healthApi.fetchDayHealth).mockResolvedValue(null);
    vi.mocked(healthApi.fetchAllHealth).mockResolvedValue([]);
    vi.mocked(healthApi.saveHealth).mockResolvedValue(saved({}));
  });

  it("sits under the Expense card with five unticked habits and a red check", async () => {
    const { container } = renderRoute("/");

    await screen.findByRole("form", { name: "Today's health checklist" });
    const boxes = within(checklist()).getAllByRole("checkbox");
    expect(boxes.map((box) => box.closest("label")?.textContent)).toEqual([
      "Worked out",
      "Eat less",
      "Drink water a lot",
      "No fast food",
      "No liquid calories",
    ]);
    expect(within(checklist()).queryAllByRole("checkbox", { checked: true })).toHaveLength(0);
    expect(healthCheck("0 of 5 done")).toBeInTheDocument();
    expect(healthApi.fetchDayHealth).toHaveBeenCalledWith(manilaDay());
    await expectNoA11yViolations(container);
  });

  it("turns yellow at 2 ticks and green at 4, saving every tick", async () => {
    renderRoute("/");
    await screen.findByRole("form", { name: "Today's health checklist" });

    await userEvent.click(habit("Worked out"));
    expect(healthCheck("1 of 5 done")).toBeInTheDocument();
    await waitFor(() =>
      expect(healthApi.saveHealth).toHaveBeenLastCalledWith(manilaDay(), {
        ...noHabits,
        worked_out: true,
      }),
    );

    await userEvent.click(habit("Drink water a lot"));
    expect(healthCheck("2 of 5 done")).toBeInTheDocument();

    await userEvent.click(habit("No fast food"));
    await userEvent.click(habit("No liquid calories"));
    expect(healthCheck("4 of 5 done")).toBeInTheDocument();
    await waitFor(() =>
      expect(healthApi.saveHealth).toHaveBeenLastCalledWith(manilaDay(), {
        ...noHabits,
        worked_out: true,
        drink_water: true,
        no_fast_food: true,
        no_liquid_calories: true,
      }),
    );

    await userEvent.click(habit("Worked out"));
    expect(habit("Worked out")).not.toBeChecked();
    await waitFor(() =>
      expect(healthApi.saveHealth).toHaveBeenLastCalledWith(manilaDay(), {
        ...noHabits,
        drink_water: true,
        no_fast_food: true,
        no_liquid_calories: true,
      }),
    );
    expect(healthApi.saveHealth).toHaveBeenCalledTimes(5);
  });

  it("shows today's saved ticks", async () => {
    vi.mocked(healthApi.fetchDayHealth).mockResolvedValue(
      saved({ eat_less: true, no_liquid_calories: true }),
    );
    renderRoute("/");

    await screen.findByRole("form", { name: "Today's health checklist" });
    expect(habit("Eat less")).toBeChecked();
    expect(habit("No liquid calories")).toBeChecked();
    expect(habit("Worked out")).not.toBeChecked();
    expect(healthCheck("2 of 5 done")).toBeInTheDocument();
  });
});
