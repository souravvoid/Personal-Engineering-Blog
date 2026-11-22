import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

/** Metadata for a standard page. Titles flow through the root title template. */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      siteName: site.name,
      locale: site.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export type ArticleMetadataInput = {
  title: string;
  description: string;
  slug: string;
  date: string;
  updated?: string;
  tags: readonly string[];
  cover?: { src: string; alt: string };
  canonical?: string;
};

/** Metadata for an article, including Open Graph article fields. */
export function articleMetadata(article: ArticleMetadataInput): Metadata {
  const path = `/articles/${article.slug}`;
  const base = pageMetadata({
    title: article.title,
    description: article.description,
    path,
  });

  return {
    ...base,
    alternates: {
      canonical: article.canonical ?? path,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: path,
      siteName: site.name,
      locale: site.locale,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      tags: [...article.tags],
      ...(article.cover
        ? {
            images: [
              {
                url: article.cover.src,
                alt: article.cover.alt,
              },
            ],
          }
        : {}),
    },
  };
}

export type JsonLdObject = Record<string, unknown>;

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: absoluteUrl("/"),
    description: site.description,
    inLanguage: site.language,
  };
}

export type ArticleJsonLdInput = {
  title: string;
  description: string;
  slug: string;
  date: string;
  updated?: string;
  tags: readonly string[];
  cover?: { src: string; alt: string };
  wordCount: number;
};

export function articleJsonLd(article: ArticleJsonLdInput): JsonLdObject {
  const url = absoluteUrl(`/articles/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    author: {
      "@type": "Person",
      name: site.author.name,
      url: site.author.url,
    },
    publisher: { "@type": "Organization", name: site.name },
    keywords: [...article.tags],
    wordCount: article.wordCount,
    inLanguage: site.language,
    ...(article.cover
      ? { image: absoluteUrl(article.cover.src) }
      : {}),
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(items: readonly BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** JSON string safe to embed in a `<script type="application/ld+json">` tag. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
