"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { SearchDocument } from "@/lib/search";
import { searchArticles } from "@/lib/search";
import { formatDate } from "@/lib/utils";

type CategoryOption = {
  name: string;
  slug: string;
};

type SearchClientProps = {
  documents: readonly SearchDocument[];
  categories: readonly CategoryOption[];
  initialQuery?: string;
  initialCategory?: string;
};

export function SearchClient({
  documents,
  categories,
  initialQuery = "",
  initialCategory = "",
}: SearchClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const trimmed = deferredQuery.trim();
    if (!trimmed) {
      const filtered = category
        ? documents.filter((document) => document.categorySlug === category)
        : documents;
      return [...filtered].sort(
        (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
      );
    }
    return searchArticles(documents, trimmed, {
      category: category || undefined,
    });
  }, [category, deferredQuery, documents]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    const search = params.toString();
    const next = search ? `/search?${search}` : "/search";
    window.history.replaceState(null, "", next);
  }, [category, query]);

  const hasQuery = deferredQuery.trim().length > 0;
  const countLabel = `${results.length} ${
    results.length === 1 ? "article" : "articles"
  }`;

  return (
    <div>
      <form
        role="search"
        action="/search"
        method="get"
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-4 border border-line bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_14rem] sm:p-5"
      >
        <div>
          <label htmlFor="search-query" className="eyebrow">
            Search articles
          </label>
          <div className="relative mt-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4 4" />
            </svg>
            <input
              id="search-query"
              name="q"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “rate limiter”, “SQL join”, or “Raft”"
              autoComplete="off"
              className="field-input py-2.5 pl-10 pr-3 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="search-category" className="eyebrow">
            Category
          </label>
          <select
            id="search-category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="field-select mt-2 py-2.5 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <p aria-live="polite" className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">
          {hasQuery ? `${countLabel} for “${deferredQuery.trim()}”` : countLabel}
        </p>
        <p className="text-xs text-ink-muted">Searches titles, descriptions, categories, and tags.</p>
      </div>

      {results.length > 0 ? (
        <ul className="mt-4 border-t border-line">
          {results.map((result) => (
            <li key={result.slug} className="border-b border-line">
              <article className="group py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <Link
                    href={`/categories/${result.categorySlug}`}
                    className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-muted transition-colors hover:text-ink"
                  >
                    {result.category}
                  </Link>
                  <time
                    dateTime={result.date}
                    className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted"
                  >
                    {formatDate(result.date)}
                  </time>
                </div>

                <h2 className="mt-2 font-display text-2xl leading-snug">
                  <Link
                    href={`/articles/${result.slug}`}
                    className="transition-colors group-hover:text-ink"
                  >
                    {result.title}
                  </Link>
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
                  {result.description}
                </p>
                {result.tags.length > 0 ? (
                  <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted">
                    {result.tags.map((tag) => `#${tag}`).join("  ")}
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 border border-line bg-surface p-6">
          <p className="font-display text-2xl">
            {hasQuery ? "No articles match that search." : "No articles in this category yet."}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            {hasQuery
              ? "Try a broader term, or clear the category filter. Every article is also listed in the archive."
              : "Clear the category filter to browse everything published so far."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/archive" className="button">
              Browse the archive
            </Link>
            <Link href="/categories" className="button">
              Browse categories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
