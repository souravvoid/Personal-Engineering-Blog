import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categoryToSlug } from "@/lib/content/categories";
import { getAllArticles } from "@/lib/content/loader";
import { excerpt } from "@/lib/utils";
import type { SearchDocument } from "@/lib/search";

export const SEARCH_INDEX_PATH = path.join("public", "search-index.json");

/**
 * Build the client-side search corpus from published articles.
 *
 * Shape matches `SearchDocument` in `src/lib/search.ts` so the generated
 * JSON is directly usable by the search client without a code change.
 */
export function buildSearchIndex(articles = getAllArticles()): SearchDocument[] {
  return articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    excerpt: excerpt(article.body),
    category: article.category,
    categorySlug: categoryToSlug(article.category),
    tags: article.tags,
    date: article.date,
  }));
}

/** Write the search index JSON to `public/`. Returns the file path written. */
export function writeSearchIndex(
  targetDir = process.cwd(),
  articles = getAllArticles(),
): string {
  const targetPath = path.join(targetDir, SEARCH_INDEX_PATH);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, `${JSON.stringify(buildSearchIndex(articles), null, 2)}\n`);
  return targetPath;
}

/** CLI entry point when run directly with tsx. */
const scriptPath = path.resolve(fileURLToPath(import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  const written = writeSearchIndex();
  console.log(`Wrote search index to ${written}`);
}
