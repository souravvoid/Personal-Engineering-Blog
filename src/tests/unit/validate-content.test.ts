import { afterEach, describe, expect, it, vi } from "vitest";

describe("validate-content script", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("validates the committed content tree without errors", async () => {
    const output: string[] = [];
    vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      output.push(args.map(String).join(" "));
    });
    const errors = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    vi.resetModules();
    await import("../../../scripts/validate-content");

    expect(output.join("\n")).toContain(
      "Validated 9 file(s): 8 published, 1 draft, 0 error(s), 0 warning(s).",
    );
    expect(errors).not.toHaveBeenCalled();
  });
});
