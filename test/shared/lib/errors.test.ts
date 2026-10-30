import { describe, expect, it } from "vitest";
import { getErrorMessage } from "@/shared/lib/errors";

describe("getErrorMessage", () => {
  it("treats permission errors as forbidden", () => {
    expect(getErrorMessage({ message: "permission denied for table expenses" })).toBe(
      "You don't have permission to do that.",
    );
    expect(getErrorMessage(new Error("forbidden"))).toBe("You don't have permission to do that.");
  });

  it("explains setup, auth and network failures", () => {
    expect(getErrorMessage({ message: "Invalid schema: expenses" })).toMatch(/Exposed schemas/);
    expect(getErrorMessage({ message: "Anonymous sign-ins are disabled" })).toMatch(
      /Anonymous sign-ins are turned off/,
    );
    expect(getErrorMessage(new TypeError("Failed to fetch"))).toMatch(/Can't reach the server/);
  });

  it("never leaks unknown internals", () => {
    expect(getErrorMessage({ message: 'relation "x" does not exist' })).toBe(
      "Something went wrong. Please try again.",
    );
    expect(getErrorMessage(undefined)).toBe("Something went wrong. Please try again.");
  });
});
