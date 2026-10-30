import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as expensesApi from "@/features/expenses/api";
import type { Expense } from "@/features/expenses/types";
import { useAuth } from "@/features/identity/hooks/useAuth";
import { manilaDay } from "@/shared/lib/dayjs";
import { expectNoA11yViolations } from "../../a11y";
import { renderRoute } from "../../renderRoute";

vi.mock("@/features/identity/hooks/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("@/features/expenses/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/expenses/api")>()),
  fetchDayExpenses: vi.fn(),
  fetchAllExpenses: vi.fn(),
  createExpense: vi.fn(),
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
}));

const saved = (overrides: Partial<Expense>): Expense => ({
  id: "expense-1",
  user_id: "device-1",
  spent_on: manilaDay(),
  position: 0,
  amount: 12.5,
  category: null,
  note: null,
  created_at: "2026-10-30T01:00:00Z",
  updated_at: "2026-10-30T01:00:00Z",
  ...overrides,
});

const amountBox = (row: number) =>
  screen.getByRole("spinbutton", { name: `Expense ${row} amount` });
const row = (n: number) => screen.getByRole("group", { name: `Expense ${n}` });
const noteBox = (n: number) =>
  screen.queryByRole("textbox", { name: `Expense ${n}: what was it?` });
const total = () => screen.getByRole("status", { name: "Total" });

describe("Expenses tab", () => {
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
  });

  it("starts with 10 empty, uncategorised rows and a zero total", async () => {
    const { container } = renderRoute("/");

    await screen.findByRole("spinbutton", { name: "Expense 1 amount" });
    expect(screen.getAllByRole("spinbutton")).toHaveLength(10);
    expect(amountBox(1)).toHaveAttribute("inputmode", "decimal");
    expect(screen.getAllByRole("checkbox")).toHaveLength(20);
    expect(screen.queryAllByRole("checkbox", { checked: true })).toHaveLength(0);
    expect(total()).toHaveTextContent("₱0.00");
    expect(expensesApi.fetchDayExpenses).toHaveBeenCalledWith(manilaDay());
    await expectNoA11yViolations(container);
  });

  it("adds an 11th row", async () => {
    renderRoute("/");
    await screen.findByRole("spinbutton", { name: "Expense 10 amount" });
    expect(screen.queryByRole("spinbutton", { name: "Expense 11 amount" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Add another expense" }));

    expect(screen.getAllByRole("spinbutton")).toHaveLength(11);
    expect(amountBox(11)).toHaveValue("");
  });

  it("totals what's typed in a read-only label", async () => {
    renderRoute("/");
    await screen.findByRole("spinbutton", { name: "Expense 1 amount" });

    await userEvent.type(amountBox(1), "1000");
    await userEvent.type(amountBox(2), "250");
    await waitFor(() => expect(total()).toHaveTextContent("₱1,250.00"));

    expect(total().tagName).toBe("OUTPUT");
    expect(screen.queryByRole("textbox", { name: /total/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton", { name: /total/i })).not.toBeInTheDocument();
  });

  it("picks one category at a time and asks for a note only with Others", async () => {
    vi.mocked(expensesApi.updateExpense).mockResolvedValue(saved({}));
    renderRoute("/");
    await screen.findByRole("spinbutton", { name: "Expense 1 amount" });
    const food = within(row(1)).getByRole("checkbox", { name: "Food" });
    const others = within(row(1)).getByRole("checkbox", { name: "Others" });

    expect(noteBox(1)).not.toBeInTheDocument();
    await userEvent.click(others);
    expect(others).toBeChecked();
    expect(noteBox(1)).toBeInTheDocument();
    expect(noteBox(2)).not.toBeInTheDocument();

    await userEvent.click(food);
    expect(food).toBeChecked();
    expect(others).not.toBeChecked();
    expect(noteBox(1)).not.toBeInTheDocument();

    await userEvent.click(food);
    expect(food).not.toBeChecked();
    expect(others).not.toBeChecked();
  });

  it("saves a new amount on leaving the box, then updates and deletes that row", async () => {
    vi.mocked(expensesApi.createExpense).mockResolvedValue(saved({}));
    vi.mocked(expensesApi.updateExpense).mockResolvedValue(saved({ category: "others" }));
    vi.mocked(expensesApi.deleteExpense).mockResolvedValue();
    renderRoute("/");
    await screen.findByRole("spinbutton", { name: "Expense 1 amount" });

    await userEvent.type(amountBox(1), "12.5");
    await userEvent.tab();
    await waitFor(() =>
      expect(expensesApi.createExpense).toHaveBeenCalledWith({
        spentOn: manilaDay(),
        position: 0,
        amount: 12.5,
        category: null,
        note: null,
      }),
    );

    await userEvent.click(within(row(1)).getByRole("checkbox", { name: "Others" }));
    await waitFor(() =>
      expect(expensesApi.updateExpense).toHaveBeenCalledWith("expense-1", {
        amount: 12.5,
        category: "others",
        note: null,
      }),
    );

    await userEvent.clear(amountBox(1));
    await userEvent.tab();
    await waitFor(() => expect(expensesApi.deleteExpense).toHaveBeenCalledWith("expense-1"));
    expect(expensesApi.createExpense).toHaveBeenCalledTimes(1);
  });

  it("shows today's saved rows in place", async () => {
    vi.mocked(expensesApi.fetchDayExpenses).mockResolvedValue([
      saved({ position: 0, amount: 1000, category: "food" }),
      saved({ id: "expense-2", position: 11, amount: 250, category: "others", note: "Load" }),
    ]);
    renderRoute("/");

    await screen.findByRole("spinbutton", { name: "Expense 12 amount" });
    expect(screen.getAllByRole("spinbutton")).toHaveLength(12);
    expect(amountBox(1)).toHaveValue("1000.00");
    expect(within(row(1)).getByRole("checkbox", { name: "Food" })).toBeChecked();
    expect(noteBox(12)).toHaveValue("Load");
    expect(total()).toHaveTextContent("₱1,250.00");
  });
});

describe("Records tab", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "device-1" },
      session: null,
      isAnonymous: true,
      isLoading: false,
      error: null,
    } as never);
    vi.mocked(expensesApi.fetchDayExpenses).mockResolvedValue([]);
  });

  it("lists one closed panel per day, newest first, with the day's total", async () => {
    vi.mocked(expensesApi.fetchAllExpenses).mockResolvedValue([
      saved({ spent_on: "2026-10-29", amount: 1000, category: "food" }),
      saved({
        id: "e2",
        spent_on: "2026-10-29",
        position: 1,
        amount: 250,
        category: "others",
        note: "Load",
      }),
      saved({ id: "e3", spent_on: "2026-10-28", amount: 75 }),
    ]);
    const { container } = renderRoute("/?tab=records");

    const first = await screen.findByRole("button", { name: /Thu, Oct 29, 2026 · ₱1,250\.00/ });
    const panels = screen.getAllByRole("button", { expanded: false });
    expect(panels.map((p) => p.textContent)).toEqual([
      "Thu, Oct 29, 2026 · ₱1,250.00",
      "Wed, Oct 28, 2026 · ₱75.00",
    ]);
    expect(screen.queryByText("Food")).not.toBeInTheDocument();
    await expectNoA11yViolations(container);

    await userEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText("₱1,000.00")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Others · Load")).toBeInTheDocument();
  });

  it("says so when there are no records yet", async () => {
    vi.mocked(expensesApi.fetchAllExpenses).mockResolvedValue([]);
    const { container } = renderRoute("/?tab=records");

    expect(await screen.findByText(/No records yet/)).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
