/**
 * Publication rules.
 *
 * A draft is visible only in local development. Every production build and
 * every test that does not explicitly opt in excludes drafts. This is the
 * single filter that governs pages, feeds, sitemap, search, and related
 * articles, so drafts cannot leak through a second path.
 */

export function isDraft(item: { draft: boolean }): boolean {
  return item.draft === true;
}

/** Drafts are included only when Next.js runs the development server. */
export function developmentMode(): boolean {
  return process.env.NODE_ENV === "development";
}

export function filterPublished<T extends { draft: boolean }>(
  items: readonly T[],
  options: { includeDrafts?: boolean } = {},
): T[] {
  const includeDrafts = options.includeDrafts ?? developmentMode();
  if (includeDrafts) return [...items];
  return items.filter((item) => !isDraft(item));
}

/** True when the requested slug may be rendered under the current mode. */
export function isVisible(draft: boolean, includeDrafts: boolean): boolean {
  return includeDrafts || !draft;
}
