import { describe, expect, it } from "vitest";
import type { RawArticle } from "@/lib/content/files";
import {
  articleFromRaw,
  ContentValidationError,
  getAdjacentArticles,
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getArticlesByTag,
  getCategoryCounts,
  getRelatedArticles,
  getTagCounts,
} from "@/lib/content/loader";
import { getCategoryDefinition } from "@/lib/content/categories";

const validFrontmatter = {
  title: "A Test Article",
  description: "A description for a test article.",
  date: "2026-01-01",
  category: "Backend Engineering",
};

function raw(overrides: Partial<RawArticle> = {}): RawArticle {
  return {
    slug: "a-test-article",
    filePath: "/tmp/a-test-article.mdx",
    frontmatter: { ...validFrontmatter },
    body: "Some prose with **formatting**.",
    ...overrides,
  };
}

describe("getAllArticles", () => {
  it("excludes drafts by default", () => {
    expect(getAllArticles({ includeDrafts: false })).toHaveLength(8);
    expect(
      getAllArticles({ includeDrafts: false }).every(
        (article) => !article.draft,
      ),
    ).toBe(true);
  });

  it("includes drafts only when asked", () => {
    expect(getAllArticles({ includeDrafts: true })).toHaveLength(9);
  });

  it("sorts newest first", () => {
    const dates = getAllArticles({ includeDrafts: false }).map(
      (article) => article.date,
    );
    expect(dates[0]).toBe("2026-11-10");
    expect([...dates].sort().reverse()).toEqual(dates);
  });
});

describe("getArticleBySlug", () => {
  it("hides drafts in production mode", () => {
    expect(
      getArticleBySlug("draft-notes-on-raft", { includeDrafts: false }),
    ).toBeNull();
    expect(
      getArticleBySlug("draft-notes-on-raft", { includeDrafts: true }),
    ).not.toBeNull();
  });

  it("returns null for an unknown slug", () => {
    expect(getArticleBySlug("missing", { includeDrafts: false })).toBeNull();
  });
});

describe("articleFromRaw", () => {
  it("derives metadata from frontmatter and body", () => {
    const article = articleFromRaw(raw());
    expect(article.slug).toBe("a-test-article");
    expect(article.title).toBe("A Test Article");
    expect(article.readingTime).toBeGreaterThanOrEqual(1);
    expect(article.wordCount).toBeGreaterThan(0);
    expect(article.excerpt).toContain("formatting");
  });

  it("rejects invalid slugs", () => {
    expect(() => articleFromRaw(raw({ slug: "Bad_Slug" }))).toThrow(
      ContentValidationError,
    );
  });

  it("rejects invalid frontmatter", () => {
    expect(() =>
      articleFromRaw(
        raw({
          frontmatter: {
            ...validFrontmatter,
            category: "Unknown Category",
          },
        }),
      ),
    ).toThrow(ContentValidationError);
  });
});

describe("queries", () => {
  it("filters by category and tag", () => {
    const category = getCategoryDefinition("Distributed Systems");
    expect(
      getArticlesByCategory(category.name, { includeDrafts: false }),
    ).toHaveLength(1);
    expect(
      getArticlesByTag("rate-limiting", { includeDrafts: false }),
    ).toHaveLength(1);
    expect(
      getArticlesByTag("nonexistent", { includeDrafts: false }),
    ).toEqual([]);
  });

  it("counts categories and tags without drafts", () => {
    const counts = getCategoryCounts({ includeDrafts: false });
    expect(counts).toHaveLength(8);
    expect(counts.reduce((sum, entry) => sum + entry.count, 0)).toBe(8);
    expect(
      getTagCounts({ includeDrafts: false }).some(
        (entry) => entry.tag === "redis",
      ),
    ).toBe(true);
  });

  it("prefers related articles with shared tags", () => {
    const article = getArticleBySlug("consensus-is-not-agreement", {
      includeDrafts: false,
    });
    expect(article).not.toBeNull();
    const related = getRelatedArticles(article!, {
      includeDrafts: false,
      limit: 3,
    });
    expect(related).toHaveLength(3);
    expect(related.some((item) => item.slug === article!.slug)).toBe(false);
    expect(related[0]?.slug).toBe("designing-a-rate-limiter");
  });

  it("finds newer and older neighbours", () => {
    const newest = getAllArticles({ includeDrafts: false })[0]!;
    const adjacent = getAdjacentArticles(newest, { includeDrafts: false });
    expect(adjacent.newer).toBeNull();
    expect(adjacent.older).not.toBeNull();
  });
});
