import { describe, expect, it } from "vitest";
import { ensureOk, unwrap, unwrapMaybe } from "@/shared/lib/result";

describe("result helpers", () => {
  it("unwrap returns data and throws on error or missing data", () => {
    expect(unwrap({ data: [1], error: null })).toEqual([1]);
    expect(() => unwrap({ data: null, error: { message: "boom" } })).toThrow();
    expect(() => unwrap({ data: null, error: null })).toThrow("no_data");
  });

  it("unwrapMaybe allows a missing row", () => {
    expect(unwrapMaybe({ data: null, error: null })).toBeNull();
    expect(() => unwrapMaybe({ data: null, error: new Error("x") })).toThrow("x");
  });

  it("ensureOk only checks the error", () => {
    expect(() => ensureOk({ error: null })).not.toThrow();
    expect(() => ensureOk({ error: new Error("y") })).toThrow("y");
  });
});
