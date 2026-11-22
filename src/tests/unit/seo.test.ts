import { afterEach, describe, expect, it, vi } from "vitest";
import {
  articleJsonLd,
  articleMetadata,
  breadcrumbJsonLd,
  pageMetadata,
  serializeJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("pageMetadata", () => {
  it("sets canonical, Open Graph, and Twitter fields", () => {
    const result = pageMetadata({
      title: "Articles",
      description: "All essays",
      path: "/articles",
    });
    expect(result.title).toBe("Articles");
    expect(result.alternates?.canonical).toBe("/articles");
    expect(result.openGraph).toMatchObject({
      type: "website",
      title: "Articles",
      url: "/articles",
    });
    expect(result.twitter).toMatchObject({ card: "summary_large_image" });
    expect(result.robots).toBeUndefined();
  });

  it("marks no-index pages", () => {
    const result = pageMetadata({
      title: "Search",
      description: "Search",
      path: "/search",
      noIndex: true,
    });
    expect(result.robots).toEqual({ index: false, follow: false });
  });
});

describe("articleMetadata", () => {
  const article = {
    title: "A Test Article",
    description: "Description",
    slug: "a-test-article",
    date: "2026-01-02",
    tags: ["redis", "testing"],
  };

  it("emits article Open Graph fields", () => {
    const result = articleMetadata(article);
    expect(result.alternates?.canonical).toBe("/articles/a-test-article");
    expect(result.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-01-02",
      modifiedTime: "2026-01-02",
      tags: ["redis", "testing"],
    });
  });

  it("uses an explicit canonical and updated date when present", () => {
    const result = articleMetadata({
      ...article,
      updated: "2026-02-03",
      canonical: "https://example.com/original",
      cover: { src: "/cover.png", alt: "Cover" },
    });
    expect(result.alternates?.canonical).toBe("https://example.com/original");
    expect(result.openGraph).toMatchObject({
      modifiedTime: "2026-02-03",
      images: [{ url: "/cover.png", alt: "Cover" }],
    });
  });
});

describe("structured data", () => {
  it("builds a website graph with absolute URLs", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const graph = websiteJsonLd();
    expect(graph).toMatchObject({
      "@type": "WebSite",
      name: "LORD VOID",
      url: "https://example.com/",
    });
  });

  it("builds an article graph with dates and author", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const graph = articleJsonLd({
      title: "Title",
      description: "Description",
      slug: "title",
      date: "2026-01-01",
      updated: "2026-01-05",
      tags: ["a"],
      wordCount: 800,
    });
    expect(graph).toMatchObject({
      "@type": "Article",
      datePublished: "2026-01-01",
      dateModified: "2026-01-05",
      wordCount: 800,
    });
    expect(graph.author).toMatchObject({ name: "Sourav" });
  });

  it("builds numbered breadcrumb items", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const graph = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Articles", path: "/articles" },
    ]);
    expect(graph.itemListElement).toMatchObject([
      { position: 1, name: "Home" },
      { position: 2, name: "Articles" },
    ]);
  });

  it("escapes script-breaking characters", () => {
    expect(serializeJsonLd({ title: "</script><script>" })).not.toContain("<");
  });
});
