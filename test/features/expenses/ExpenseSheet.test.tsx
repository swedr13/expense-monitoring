import { screen, waitFor } from "@testing-library/react";
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
  included: true,
  created_at: "2026-10-30T01:00:00Z",
  updated_at: "2026-10-30T01:00:00Z",
  ...overrides,
});

const amountBox = (row: number) =>
  screen.getByRole("spinbutton", { name: `Expense ${row} amount` });
const noteBox = (n: number) =>
  screen.getByRole("textbox", { name: `Expense ${n}: what was it for?` });
const includeBox = (n: number) =>
  screen.getByRole("checkbox", { name: `Count expense ${n} in the total` });
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

  it("starts with 10 empty rows, each ticked and with a note box, and a zero total", async () => {
    const { container } = renderRoute("/");

    await screen.findByRole("spinbutton", { name: "Expense 1 amount" });
    expect(screen.getAllByRole("spinbutton")).toHaveLength(10);
    expect(amountBox(1)).toHaveAttribute("inputmode", "decimal");
    expect(screen.getAllByRole("textbox", { name: /what was it for/ })).toHaveLength(10);
    expect(screen.getAllByRole("checkbox", { checked: true })).toHaveLength(10);
    expect(screen.queryByRole("checkbox", { name: /Food|Others/ })).not.toBeInTheDocument();
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
    expect(includeBox(11)).toBeChecked();
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

  it("leaves unticked amounts out of the total", async () => {
    renderRoute("/");
    await screen.findByRole("spinbutton", { name: "Expense 1 amount" });

    await userEvent.type(amountBox(1), "1000");
    await userEvent.type(amountBox(2), "250");
    await waitFor(() => expect(total()).toHaveTextContent("₱1,250.00"));

    await userEvent.click(includeBox(2));
    expect(includeBox(2)).not.toBeChecked();
    await waitFor(() => expect(total()).toHaveTextContent("₱1,000.00"));

    await userEvent.click(includeBox(2));
    await waitFor(() => expect(total()).toHaveTextContent("₱1,250.00"));
  });

  it("saves a new amount on leaving the box, then its note, its checkbox and its deletion", async () => {
    vi.mocked(expensesApi.createExpense).mockResolvedValue(saved({}));
    vi.mocked(expensesApi.updateExpense)
      .mockResolvedValueOnce(saved({ note: "Lunch" }))
      .mockResolvedValueOnce(saved({ note: "Lunch", included: false }));
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
        note: null,
        included: true,
      }),
    );

    await userEvent.type(noteBox(1), "  Lunch ");
    await userEvent.tab();
    await waitFor(() =>
      expect(expensesApi.updateExpense).toHaveBeenCalledWith("expense-1", {
        amount: 12.5,
        note: "Lunch",
        included: true,
      }),
    );

    await userEvent.click(includeBox(1));
    await waitFor(() =>
      expect(expensesApi.updateExpense).toHaveBeenLastCalledWith("expense-1", {
        amount: 12.5,
        note: "Lunch",
        included: false,
      }),
    );

    await userEvent.clear(amountBox(1));
    await userEvent.tab();
    await waitFor(() => expect(expensesApi.deleteExpense).toHaveBeenCalledWith("expense-1"));
    expect(expensesApi.createExpense).toHaveBeenCalledTimes(1);
  });

  it("shows today's saved rows in place", async () => {
    vi.mocked(expensesApi.fetchDayExpenses).mockResolvedValue([
      saved({ position: 0, amount: 1000, note: "Groceries" }),
      saved({ id: "expense-2", position: 11, amount: 250, note: "Load", included: false }),
    ]);
    renderRoute("/");

    await screen.findByRole("spinbutton", { name: "Expense 12 amount" });
    expect(screen.getAllByRole("spinbutton")).toHaveLength(12);
    expect(amountBox(1)).toHaveValue("1000.00");
    expect(noteBox(1)).toHaveValue("Groceries");
    expect(noteBox(12)).toHaveValue("Load");
    expect(includeBox(1)).toBeChecked();
    expect(includeBox(12)).not.toBeChecked();
    expect(total()).toHaveTextContent("₱1,000.00");
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

  it("lists one closed panel per day, newest first, with the total of ticked expenses", async () => {
    vi.mocked(expensesApi.fetchAllExpenses).mockResolvedValue([
      saved({ spent_on: "2026-10-29", amount: 1000, note: "Groceries" }),
      saved({
        id: "e2",
        spent_on: "2026-10-29",
        position: 1,
        amount: 250,
        note: "Load",
        included: false,
      }),
      saved({ id: "e3", spent_on: "2026-10-28", amount: 75 }),
    ]);
    const { container } = renderRoute("/?tab=records");

    const first = await screen.findByRole("button", { name: /Thu, Oct 29, 2026 · ₱1,000\.00/ });
    const panels = screen.getAllByRole("button", { expanded: false });
    expect(panels.map((p) => p.textContent)).toEqual([
      "Thu, Oct 29, 2026 · ₱1,000.00" + "2 expenses" + "Not in total: 1 expense · ₱250.00",
      "Wed, Oct 28, 2026 · ₱75.00" + "1 expense",
    ]);
    await expectNoA11yViolations(container);

    await userEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText("₱1,000.00")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Load · not in total")).toBeInTheDocument();
  });

  it("says so when there are no records yet", async () => {
    vi.mocked(expensesApi.fetchAllExpenses).mockResolvedValue([]);
    const { container } = renderRoute("/?tab=records");

    expect(await screen.findByText(/No records yet/)).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
