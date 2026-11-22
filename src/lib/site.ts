/**
 * Site-wide identity and URL helpers.
 *
 * The deployment host is not committed yet. Set `NEXT_PUBLIC_SITE_URL` to the
 * production origin before deploying; the localhost fallback keeps canonical
 * URLs, the sitemap, and the RSS feed valid during local development.
 */

export const site = {
  name: "LORD VOID",
  title: "LORD VOID — Systems, examined carefully",
  description:
    "An independent technical publication about the systems underneath the software we use: distributed systems, backend engineering, databases, operating systems, and security.",
  tagline: "Systems, examined carefully.",
  author: {
    name: "Sourav",
    url: "https://github.com/souravvoid",
  },
  links: {
    github: "https://github.com/souravvoid",
    rss: "/rss.xml",
  },
  locale: "en_US",
  language: "en",
} as const;

const FALLBACK_URL = "http://localhost:3000";

/** Production origin without a trailing slash. */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return FALLBACK_URL;
  try {
    return new URL(configured).origin;
  } catch {
    return FALLBACK_URL;
  }
}

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${normalized}`;
}
