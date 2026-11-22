import type { Category } from "@/lib/content/categories";

/**
 * Dependency-free search over article metadata.
 *
 * The corpus is small (tens of articles), so an inverted index would add a
 * dependency and a build step without changing the result. Every query token
 * must match at least one field; matches are weighted by where they occur and
 * ties are broken by publication date.
 */

export type SearchDocument = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: Category;
  categorySlug: string;
  tags: string[];
  date: string;
};

export type SearchResult = SearchDocument & {
  score: number;
  matchedFields: string[];
};

export type SearchOptions = {
  category?: string;
  tag?: string;
  limit?: number;
};

const FIELD_WEIGHTS = {
  title: 8,
  tags: 5,
  category: 4,
  description: 3,
  excerpt: 1,
} as const;

type FieldName = keyof typeof FIELD_WEIGHTS;

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function scoreDocument(
  document: SearchDocument,
  tokens: readonly string[],
): { score: number; matchedFields: string[] } {
  const fields: Record<FieldName, string> = {
    title: document.title.toLowerCase(),
    tags: document.tags.join(" ").toLowerCase(),
    category: document.category.toLowerCase(),
    description: document.description.toLowerCase(),
    excerpt: document.excerpt.toLowerCase(),
  };

  let score = 0;
  const matchedFields = new Set<string>();

  for (const token of tokens) {
    let matched = false;
    for (const [field, value] of Object.entries(fields) as Array<
      [FieldName, string]
    >) {
      if (!value.includes(token)) continue;
      matched = true;
      matchedFields.add(field);
      score += FIELD_WEIGHTS[field];
      if (value.startsWith(token)) score += 2;
      if (value === token) score += 4;
    }
    if (!matched) return { score: 0, matchedFields: [] };
  }

  return { score, matchedFields: [...matchedFields] };
}

/** Rank documents for a query. An empty query returns no results. */
export function searchArticles(
  documents: readonly SearchDocument[],
  query: string,
  options: SearchOptions = {},
): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];
  for (const document of documents) {
    if (options.category && document.categorySlug !== options.category) continue;
    if (options.tag && !document.tags.includes(options.tag)) continue;
    const { score, matchedFields } = scoreDocument(document, tokens);
    if (score === 0) continue;
    results.push({ ...document, score, matchedFields });
  }

  results.sort(
    (a, b) => b.score - a.score || b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
  );

  return options.limit ? results.slice(0, options.limit) : results;
}
