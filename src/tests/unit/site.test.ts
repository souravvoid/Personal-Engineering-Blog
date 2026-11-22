import { afterEach, describe, expect, it, vi } from "vitest";
import { absoluteUrl, site, siteUrl } from "@/lib/site";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("site", () => {
  it("exposes a stable identity", () => {
    expect(site.name).toBe("LORD VOID");
    expect(site.author.url).toMatch(/^https:\/\/github\.com\//);
  });

  it("falls back to localhost when no origin is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(siteUrl()).toBe("http://localhost:3000");
    expect(absoluteUrl("/rss.xml")).toBe("http://localhost:3000/rss.xml");
  });

  it("normalizes a configured origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/path/");
    expect(siteUrl()).toBe("https://example.com");
    expect(absoluteUrl("/about")).toBe("https://example.com/about");
  });

  it("ignores an invalid origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not a url");
    expect(siteUrl()).toBe("http://localhost:3000");
  });

  it("adds a leading slash to relative paths", () => {
    expect(absoluteUrl("sitemap.xml")).toBe(
      "http://localhost:3000/sitemap.xml",
    );
  });
});
