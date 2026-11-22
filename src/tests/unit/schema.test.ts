import { describe, expect, it } from "vitest";
import { categories, isCategory, validateFrontmatter } from "@/lib/content/schema";

const valid = {
  title: "A title",
  description: "A description",
  date: "2026-11-10",
  category: "Backend Engineering",
};

describe("validateFrontmatter", () => {
  it("accepts minimal valid frontmatter", () => {
    const result = validateFrontmatter(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.draft).toBe(false);
      expect(result.data.featured).toBe(false);
    }
  });

  it("rejects an unknown category", () => {
    const result = validateFrontmatter({ ...valid, category: "Nope" });
    expect(result.ok).toBe(false);
  });

  it("rejects dates that are not ISO calendar dates", () => {
    expect(validateFrontmatter({ ...valid, date: "2026/11/10" }).ok).toBe(false);
  });

  it("rejects an updated date before publication", () => {
    expect(
      validateFrontmatter({ ...valid, updated: "2026-01-01" }).ok,
    ).toBe(false);
  });

  it("requires series and seriesOrder together", () => {
    expect(validateFrontmatter({ ...valid, series: "Notes" }).ok).toBe(false);
    expect(validateFrontmatter({ ...valid, seriesOrder: 1 }).ok).toBe(false);
    expect(
      validateFrontmatter({ ...valid, series: "Notes", seriesOrder: 1 }).ok,
    ).toBe(true);
  });

  it("rejects more than twelve tags", () => {
    expect(
      validateFrontmatter({
        ...valid,
        tags: Array.from({ length: 13 }, (_, i) => `tag-${i}`),
      }).ok,
    ).toBe(false);
  });

  it("recognizes controlled category names", () => {
    expect(isCategory(categories[0]!)).toBe(true);
    expect(isCategory("Other")).toBe(false);
  });
});
