import { describe, expect, it } from "vitest";
import {
  excerpt,
  formatDate,
  isValidSlug,
  normalizeTags,
  readingTimeLabel,
  readingTimeMinutes,
  slugify,
  wordCount,
} from "@/lib/utils";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("collapses separators and trims edges", () => {
    expect(slugify("  Rust   &   Systems ")).toBe("rust-systems");
  });

  it("strips diacritics", () => {
    expect(slugify("Café Society")).toBe("cafe-society");
  });

  it("returns an empty string for punctuation-only input", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("isValidSlug", () => {
  it("accepts lowercase kebab-case", () => {
    expect(isValidSlug("designing-a-rate-limiter")).toBe(true);
  });

  it("rejects uppercase, underscores, and leading digits groups", () => {
    expect(isValidSlug("Bad_Slug")).toBe(false);
    expect(isValidSlug("-leading")).toBe(false);
    expect(isValidSlug("trailing-")).toBe(false);
    expect(isValidSlug("double--hyphen")).toBe(false);
  });
});

describe("normalizeTags", () => {
  it("slugifies, deduplicates, and sorts", () => {
    expect(normalizeTags(["Rust", "rust", "Distributed Systems"])).toEqual([
      "distributed-systems",
      "rust",
    ]);
  });

  it("returns an empty array for undefined", () => {
    expect(normalizeTags(undefined)).toEqual([]);
  });
});

describe("wordCount and readingTimeMinutes", () => {
  it("counts words outside code fences", () => {
    const body = "one two three\n```js\nfour five six\n```\nseven";
    expect(wordCount(body)).toBe(4);
  });

  it("returns at least one minute", () => {
    expect(readingTimeMinutes("")).toBe(1);
    expect(readingTimeMinutes("short")).toBe(1);
  });

  it("rounds up to the next minute", () => {
    const body = Array.from({ length: 201 }, () => "word").join(" ");
    expect(readingTimeMinutes(body)).toBe(2);
  });

  it("formats a label", () => {
    expect(readingTimeLabel(3)).toBe("3 min read");
  });
});

describe("formatDate", () => {
  it("formats an ISO date in UTC", () => {
    expect(formatDate("2026-11-10")).toBe("November 10, 2026");
  });

  it("returns the input for an invalid date", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("excerpt", () => {
  it("strips markdown and links", () => {
    const body = "Hello [world](https://example.com) and *friends*.";
    expect(excerpt(body)).toBe("Hello world and friends.");
  });

  it("truncates long text at a word boundary", () => {
    const body = Array.from({ length: 60 }, () => "word").join(" ");
    const result = excerpt(body, 40);
    expect(result.length).toBeLessThanOrEqual(41);
    expect(result.endsWith("…")).toBe(true);
  });

  it("ignores frontmatter blocks", () => {
    expect(excerpt("---\ntitle: Hidden\n---\nVisible text")).toBe("Visible text");
  });
});
