import { describe, expect, it } from "vitest";
import {
  categories,
  categoryDefinitions,
  categoryToSlug,
  getCategoryBySlug,
  getCategoryDefinition,
  type Category,
} from "@/lib/content/categories";

describe("category vocabulary", () => {
  it("defines exactly eight unique categories and slugs", () => {
    expect(categoryDefinitions).toHaveLength(8);
    expect(new Set(categories).size).toBe(8);
    expect(new Set(categoryDefinitions.map((item) => item.slug)).size).toBe(8);
  });

  it("keeps every schema category backed by a definition", () => {
    for (const name of categories) {
      const definition = getCategoryDefinition(name);
      expect(definition.name).toBe(name);
      expect(definition.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(definition.description.length).toBeGreaterThan(20);
    }
  });

  it("round-trips names through slugs", () => {
    for (const name of categories) {
      const definition = getCategoryBySlug(categoryToSlug(name));
      expect(definition?.name).toBe(name);
    }
  });

  it("returns null for unknown slugs", () => {
    expect(getCategoryBySlug("not-a-category")).toBeNull();
  });

  it("throws for an unknown category name", () => {
    expect(() => getCategoryDefinition("Nope" as Category)).toThrow(
      /Unknown category/,
    );
  });
});
