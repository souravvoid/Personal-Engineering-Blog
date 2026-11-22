import type { Metadata } from "next";
import Link from "next/link";
import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAllArticles } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Archive",
  description:
    "Every published LORD VOID essay, grouped by year. The chronological index of the publication.",
  path: "/archive",
});

export default function ArchivePage() {
  const articles = getAllArticles();
  const years = new Map<string, typeof articles>();

  for (const article of articles) {
    const year = article.date.slice(0, 4);
    const bucket = years.get(year);
    if (bucket) {
      bucket.push(article);
    } else {
      years.set(year, [article]);
    }
  }

  const orderedYears = [...years.entries()].sort(([a], [b]) =>
    b.localeCompare(a),
  );

  return (
    <Container>
      <PageHeader
        eyebrow="Chronology"
        title="Archive"
        description="Everything published so far, grouped by year. Newest first within each year."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">
          <span>
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </span>
          <Link href="/articles" className="transition-colors hover:text-ink">
            Flat index
          </Link>
          <Link href="/categories" className="transition-colors hover:text-ink">
            Categories
          </Link>
        </div>
      </PageHeader>

      {orderedYears.length > 0 ? (
        <div className="mt-10 space-y-12">
          {orderedYears.map(([year, entries]) => (
            <section key={year} aria-label={`Articles from ${year}`}>
              <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                <h2 className="font-display text-3xl">{year}</h2>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-muted">
                  {entries.length} {entries.length === 1 ? "article" : "articles"}
                </span>
              </div>
              <div className="mt-1">
                {entries.map((article, index) => (
                  <ArticleListItem
                    key={article.slug}
                    article={article}
                    index={index}
                    showDescription={false}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-line p-6 text-ink-muted">
          No articles are published yet.
        </p>
      )}
    </Container>
  );
}
