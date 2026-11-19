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

function toArticle(raw: RawArticle): Article {
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
  return readAllRawArticles().map(toArticle).sort(compareArticles);
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
