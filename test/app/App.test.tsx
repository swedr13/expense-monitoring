import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as expensesApi from "@/features/expenses/api";
import { useAuth } from "@/features/identity/hooks/useAuth";
import { expectNoA11yViolations } from "../a11y";
import { renderRoute } from "../renderRoute";

vi.mock("@/features/identity/hooks/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("@/features/expenses/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/expenses/api")>()),
  fetchDayExpenses: vi.fn(),
  fetchAllExpenses: vi.fn(),
}));

describe("app shell", () => {
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

  it("opens on the Expenses tab and switches to Records", async () => {
    renderRoute("/");

    expect(await screen.findByRole("heading", { name: "Daily expenses" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Expense Monitoring" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Expenses" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByRole("spinbutton", { name: "Expense 1 amount" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Records" }));
    expect(screen.getByRole("tab", { name: "Records" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByText(/No records yet/)).toBeInTheDocument();
  });

  it("shows a not-found page that links back home", async () => {
    const { container } = renderRoute("/nope");

    expect(await screen.findByText("Page not found")).toBeInTheDocument();
    await expectNoA11yViolations(container);

    await userEvent.click(screen.getByRole("button", { name: "Back to expenses" }));
    expect(await screen.findByRole("heading", { name: "Daily expenses" })).toBeInTheDocument();
  });

  it("explains when this phone can't be signed in", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      isAnonymous: false,
      isLoading: false,
      error: new Error("Anonymous sign-ins are disabled"),
    } as never);
    renderRoute("/");

    expect(await screen.findByText("Couldn't connect this device")).toBeInTheDocument();
    expect(screen.getByText(/Anonymous sign-ins are turned off/)).toBeInTheDocument();
  });
});
