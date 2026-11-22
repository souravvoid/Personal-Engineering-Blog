import {
  excerpt,
  isValidSlug,
  normalizeTags,
  readingTimeMinutes,
  wordCount,
} from "@/lib/utils";
import { readAllRawArticles, type RawArticle } from "./files";
import { developmentMode, filterPublished, isVisible } from "./publication";
import {
  SLUG_REGEX,
  validateFrontmatter,
  type ArticleFrontmatter,
  type Category,
} from "./schema";

export type Article = {
  slug: string;
  filePath: string;
  frontmatter: ArticleFrontmatter;
  body: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: Category;
  tags: string[];
  draft: boolean;
  featured: boolean;
  cover?: { src: string; alt: string };
  canonical?: string;
  series?: string;
  seriesOrder?: number;
  excerpt: string;
  wordCount: number;
  readingTime: number;
};

export type ContentIssue = { path: string; message: string };

/** Thrown when a content file cannot be used: bad slug or invalid frontmatter. */
export class ContentValidationError extends Error {
  readonly slug: string;
  readonly issues: ContentIssue[];

  constructor(slug: string, issues: ContentIssue[]) {
    const detail = issues.map((issue) => `${issue.path}: ${issue.message}`).join("; ");
    super(`Invalid content "${slug}" — ${detail}`);
    this.name = "ContentValidationError";
    this.slug = slug;
    this.issues = issues;
  }
}

/** Validate a raw file into an Article. Exported for tests and tooling. */
export function articleFromRaw(raw: RawArticle): Article {
  if (!isValidSlug(raw.slug)) {
    throw new ContentValidationError(raw.slug, [
      {
        path: "slug",
        message: `slug "${raw.slug}" must match ${SLUG_REGEX.toString()}`,
      },
    ]);
  }

  const result = validateFrontmatter(raw.frontmatter);
  if (!result.ok) {
    throw new ContentValidationError(raw.slug, result.issues);
  }

  const frontmatter = result.data;
  return {
    slug: raw.slug,
    filePath: raw.filePath,
    frontmatter,
    body: raw.body,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    updated: frontmatter.updated,
    category: frontmatter.category,
    tags: normalizeTags(frontmatter.tags),
    draft: frontmatter.draft,
    featured: frontmatter.featured,
    cover: frontmatter.cover,
    canonical: frontmatter.canonical,
    series: frontmatter.series,
    seriesOrder: frontmatter.seriesOrder,
    excerpt: excerpt(raw.body),
    wordCount: wordCount(raw.body),
    readingTime: readingTimeMinutes(raw.body),
  };
}

function compareArticles(a: Article, b: Article): number {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  return a.slug.localeCompare(b.slug);
}

/**
 * Load every article, including drafts, sorted newest first.
 * Throws ContentValidationError on the first invalid file.
 */
export function loadAllArticles(): Article[] {
  return readAllRawArticles().map(articleFromRaw).sort(compareArticles);
}

/** Published articles only, governed by the publication filter. */
export function getAllArticles(options: { includeDrafts?: boolean } = {}): Article[] {
  return filterPublished(loadAllArticles(), options);
}

/**
 * Fetch one article by slug. Drafts resolve only in development or when
 * `includeDrafts` is explicitly true; otherwise this returns null (404).
 */
export function getArticleBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {},
): Article | null {
  const includeDrafts = options.includeDrafts ?? developmentMode();
  const article = loadAllArticles().find((item) => item.slug === slug);
  if (!article) return null;
  return isVisible(article.draft, includeDrafts) ? article : null;
}

export function getArticlesByCategory(
  category: Category,
  options: { includeDrafts?: boolean } = {},
): Article[] {
  return getAllArticles(options).filter((article) => article.category === category);
}

export function getArticlesByTag(
  tag: string,
  options: { includeDrafts?: boolean } = {},
): Article[] {
  const normalized = normalizeTags([tag])[0];
  if (!normalized) return [];
  return getAllArticles(options).filter((article) => article.tags.includes(normalized));
}

export type CategoryCount = { category: Category; count: number };

export function getCategoryCounts(
  options: { includeDrafts?: boolean } = {},
): CategoryCount[] {
  const counts = new Map<Category, number>();
  for (const article of getAllArticles(options)) {
    counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

export type TagCount = { tag: string; count: number };

export function getTagCounts(options: { includeDrafts?: boolean } = {}): TagCount[] {
  const counts = new Map<string, number>();
  for (const article of getAllArticles(options)) {
    for (const tag of article.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Related articles: same category first, then shared tags, then same series.
 * If there are not enough relevant matches, the newest remaining articles fill
 * the list so the reading surface is never empty.
 */
export function getRelatedArticles(
  article: Article,
  options: { limit?: number; includeDrafts?: boolean } = {},
): Article[] {
  const limit = options.limit ?? 3;
  const pool = getAllArticles({ includeDrafts: options.includeDrafts }).filter(
    (candidate) => candidate.slug !== article.slug,
  );

  const scored = pool
    .map((candidate) => {
      let score = 0;
      if (candidate.category === article.category) score += 3;
      score +=
        candidate.tags.filter((tag) => article.tags.includes(tag)).length * 2;
      if (article.series && candidate.series === article.series) score += 2;
      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.candidate.date.localeCompare(a.candidate.date) ||
        a.candidate.slug.localeCompare(b.candidate.slug),
    );

  const related = scored.map((entry) => entry.candidate).slice(0, limit);
  if (related.length >= limit) return related;

  const chosen = new Set(related.map((item) => item.slug));
  for (const candidate of pool) {
    if (related.length >= limit) break;
    if (chosen.has(candidate.slug)) continue;
    related.push(candidate);
    chosen.add(candidate.slug);
  }
  return related;
}

export type AdjacentArticles = {
  newer: Article | null;
  older: Article | null;
};

/** Neighbouring articles in reverse-chronological order. */
export function getAdjacentArticles(
  article: Article,
  options: { includeDrafts?: boolean } = {},
): AdjacentArticles {
  const articles = getAllArticles(options);
  const index = articles.findIndex((item) => item.slug === article.slug);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: index > 0 ? articles[index - 1] ?? null : null,
    older: index < articles.length - 1 ? articles[index + 1] ?? null : null,
  };
}
