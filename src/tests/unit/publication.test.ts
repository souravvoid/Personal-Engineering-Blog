import { afterEach, describe, expect, it, vi } from "vitest";
import {
  developmentMode,
  filterPublished,
  isDraft,
  isVisible,
} from "@/lib/content/publication";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("publication rules", () => {
  it("detects drafts", () => {
    expect(isDraft({ draft: true })).toBe(true);
    expect(isDraft({ draft: false })).toBe(false);
  });

  it("reads the current environment", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(developmentMode()).toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    expect(developmentMode()).toBe(false);
  });

  it("filters drafts unless explicitly included", () => {
    const items = [
      { draft: false, slug: "a" },
      { draft: true, slug: "b" },
    ];
    expect(filterPublished(items, { includeDrafts: false })).toEqual([items[0]]);
    expect(filterPublished(items, { includeDrafts: true })).toEqual(items);
    expect(items).toHaveLength(2);
  });

  it("gates a single slug", () => {
    expect(isVisible(true, false)).toBe(false);
    expect(isVisible(true, true)).toBe(true);
    expect(isVisible(false, false)).toBe(true);
  });
});
