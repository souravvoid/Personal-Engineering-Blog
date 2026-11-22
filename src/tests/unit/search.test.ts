import { describe, expect, it } from "vitest";
import { searchArticles, type SearchDocument } from "@/lib/search";

const documents: SearchDocument[] = [
  {
    slug: "designing-a-rate-limiter",
    title: "Designing a Rate Limiter",
    description: "Fairness and cost at the edge.",
    excerpt: "A counter in Redis is only the beginning.",
    category: "System Design and Architecture",
    categorySlug: "system-design-and-architecture",
    tags: ["rate-limiting", "redis", "api-design"],
    date: "2026-11-10",
  },
  {
    slug: "the-cost-of-a-join",
    title: "The Cost of a Join",
    description: "Loops, sorts, and hashes.",
    excerpt: "The planner picks the join shape for you.",
    category: "Database Engineering",
    categorySlug: "database-engineering",
    tags: ["postgres", "sql", "indexes"],
    date: "2026-10-02",
  },
  {
    slug: "idempotency-in-practice",
    title: "Idempotency in Practice",
    description: "Retries without double charges.",
    excerpt: "An idempotency key turns a retry into a no-op.",
    category: "Backend Engineering",
    categorySlug: "backend-engineering",
    tags: ["idempotency", "api-design", "payments"],
    date: "2026-11-05",
  },
];

describe("searchArticles", () => {
  it("returns no results for an empty query", () => {
    expect(searchArticles(documents, "   ")).toEqual([]);
  });

  it("matches a title token and ranks it first", () => {
    const results = searchArticles(documents, "join");
    expect(results.map((result) => result.slug)).toEqual(["the-cost-of-a-join"]);
    expect(results[0]?.score).toBeGreaterThan(0);
    expect(results[0]?.matchedFields).toContain("title");
  });

  it("matches tags", () => {
    const results = searchArticles(documents, "redis");
    expect(results[0]?.slug).toBe("designing-a-rate-limiter");
    expect(results[0]?.matchedFields).toContain("tags");
  });

  it("requires every token to match somewhere", () => {
    expect(searchArticles(documents, "redis postgres")).toEqual([]);
    expect(searchArticles(documents, "redis api")).toHaveLength(1);
  });

  it("filters by category slug", () => {
    const results = searchArticles(documents, "api", {
      category: "backend-engineering",
    });
    expect(results.map((result) => result.slug)).toEqual([
      "idempotency-in-practice",
    ]);
  });

  it("filters by tag", () => {
    const results = searchArticles(documents, "api", { tag: "api-design" });
    expect(results).toHaveLength(2);
  });

  it("respects the limit", () => {
    expect(searchArticles(documents, "the", { limit: 1 })).toHaveLength(1);
  });

  it("is case-insensitive and ignores punctuation", () => {
    const results = searchArticles(documents, "RATE-LIMITING,");
    expect(results[0]?.slug).toBe("designing-a-rate-limiter");
  });

  it("breaks score ties by newest date", () => {
    const tied: SearchDocument[] = [
      { ...documents[0]!, slug: "older", date: "2026-01-01" },
      { ...documents[0]!, slug: "newer", date: "2026-02-01" },
    ];
    expect(searchArticles(tied, "limiter").map((result) => result.slug)).toEqual([
      "newer",
      "older",
    ]);
  });
});
