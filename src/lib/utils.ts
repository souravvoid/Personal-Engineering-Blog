/**
 * Small, dependency-free helpers shared by the content layer, scripts, and UI.
 */

/** Lowercase kebab-case slug, used for filenames, tags, categories, and URLs. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function normalizeTags(tags: readonly string[] | undefined): string[] {
  if (!tags) return [];
  const seen = new Set<string>();
  for (const tag of tags) {
    const normalized = slugify(tag);
    if (normalized) seen.add(normalized);
  }
  return [...seen].sort();
}

/** Words per minute used for reading-time estimates. */
const WORDS_PER_MINUTE = 200;

export function wordCount(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*`\-|[\]()]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words.length;
}

export function readingTimeMinutes(body: string): number {
  const words = wordCount(body);
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function readingTimeLabel(minutes: number): string {
  return `${minutes} min read`;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** Format an ISO date for display, e.g. "November 19, 2026". */
export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return dateFormatter.format(date);
}

/** Collapse Markdown into a plain-text excerpt for cards and search. */
export function excerpt(body: string, maxLength = 200): string {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/```[\s\S]*$/g, " ")
    .replace(/^---[\s\S]*?---/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~`>]/g, "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** True when the article was revised after publication. */
export function isUpdated(article: { date: string; updated?: string }): boolean {
  return article.updated !== undefined && article.updated > article.date;
}
