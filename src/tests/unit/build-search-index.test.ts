import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildSearchIndex, writeSearchIndex } from "../../../scripts/build-search-index";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempDirs.length = 0;
});

describe("buildSearchIndex", () => {
  it("builds one document per published article with search fields", () => {
    const docs = buildSearchIndex();
    expect(docs.length).toBeGreaterThan(0);
    const doc = docs[0];
    expect(doc).toMatchObject({
      slug: expect.any(String),
      title: expect.any(String),
      category: expect.any(String),
      categorySlug: expect.any(String),
      date: expect.any(String),
    });
    expect(docs.every((item) => item.tags.length >= 0)).toBe(true);
  });

  it("returns nothing extra like body text", () => {
    const docs = buildSearchIndex();
    for (const doc of docs) {
      expect(Object.keys(doc).sort()).toEqual([
        "category",
        "categorySlug",
        "date",
        "description",
        "excerpt",
        "slug",
        "tags",
        "title",
      ]);
    }
  });
});

describe("writeSearchIndex", () => {
  it("writes public/search-index.json into the target directory", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "search-index-"));
    tempDirs.push(dir);

    const targetPath = writeSearchIndex(dir);
    expect(fs.existsSync(targetPath)).toBe(true);
    const written = JSON.parse(fs.readFileSync(targetPath, "utf8")) as unknown[];
    expect(written.length).toBeGreaterThan(0);
    expect(fs.existsSync(targetPath.replace("search-index.json", ""))).toBe(true);
  });
});
