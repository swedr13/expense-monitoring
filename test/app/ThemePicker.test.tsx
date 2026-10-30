import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeModeToggle, ThemePicker } from "@/app/ThemePicker";
import { expectNoA11yViolations } from "../a11y";
import { renderWithApp } from "../renderWithApp";

const renderTheming = () =>
  renderWithApp(
    <>
      <ThemeModeToggle />
      <ThemePicker />
    </>,
  );

const colorMode = () => document.documentElement.dataset.colorMode;

describe("theme picker", () => {
  afterEach(() => localStorage.clear());

  it("follows the device (light here) until a mode is picked", async () => {
    renderTheming();
    await waitFor(() => expect(colorMode()).toBe("light"));
  });

  it("restores the saved mode on load", async () => {
    localStorage.setItem("expenses:theme-mode", "dark");
    renderTheming();
    await waitFor(() => expect(colorMode()).toBe("dark"));
  });

  it("flips light and dark from the header and remembers it", async () => {
    renderTheming();
    await userEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));

    await waitFor(() => expect(colorMode()).toBe("dark"));
    expect(localStorage.getItem("expenses:theme-mode")).toBe("dark");
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  });

  it("picks a preset colour and marks it as chosen", async () => {
    renderTheming();
    await userEvent.click(screen.getByRole("button", { name: "Theme settings" }));
    const panel = await screen.findByRole("dialog", { name: "Theme settings" });

    expect(within(panel).getByRole("button", { name: "Green" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.click(within(panel).getByRole("button", { name: "Ocean blue" }));

    expect(localStorage.getItem("expenses:theme-color")).toBe("#1364ab");
    expect(within(panel).getByRole("button", { name: "Ocean blue" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(panel).getByText("Ocean blue", { selector: "span" })).toBeInTheDocument();
    await expectNoA11yViolations(document.body);
  });

  it("ignores a broken saved colour", async () => {
    localStorage.setItem("expenses:theme-color", "not-a-colour");
    renderTheming();
    await userEvent.click(screen.getByRole("button", { name: "Theme settings" }));
    const panel = await screen.findByRole("dialog", { name: "Theme settings" });

    expect(within(panel).getByRole("button", { name: "Green" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
