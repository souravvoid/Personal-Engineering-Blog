import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container>
      <div className="grid min-h-[60vh] content-center gap-10 py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div>
          <p className="eyebrow">Error 404</p>
          <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-lime">
            Page not found
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.75rem,7vw,5rem)] leading-[1.02] tracking-[-0.025em]">
            This page is outside the published set.
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-muted">
            The URL may be mistyped, or the article may have moved. The archive
            and search index only contain published work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/articles" className="button button-primary">
              Browse articles <span aria-hidden="true">→</span>
            </Link>
            <Link href="/" className="button">
              Return home
            </Link>
          </div>
        </div>

        <div className="border border-line bg-surface p-5">
          <p className="eyebrow">Try a search</p>
          <form role="search" action="/search" method="get" className="mt-3">
            <label htmlFor="not-found-query" className="sr-only">
              Search articles
            </label>
            <input
              id="not-found-query"
              name="q"
              type="search"
              placeholder="Rate limiter, join, Raft…"
              className="field-input py-2.5 text-sm"
            />
            <button type="submit" className="button mt-3 w-full">
              Search
            </button>
          </form>
          <p className="mt-4 text-xs leading-relaxed text-ink-muted">
            Or go straight to the{" "}
            <Link href="/archive" className="link-underline">
              archive
            </Link>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
