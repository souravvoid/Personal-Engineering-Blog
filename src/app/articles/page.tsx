import type { Metadata } from "next";
import Link from "next/link";
import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAllArticles } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Articles",
  description:
    "Every published essay from LORD VOID, newest first. Distributed systems, backend engineering, databases, operating systems, and security.",
  path: "/articles",
});

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <Container>
      <PageHeader
        eyebrow="The index"
        title="Articles"
        description="Long-form essays, newest first. Each one starts with a mechanism and ends with the trade-offs that remain."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">
          <span>
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </span>
          <Link href="/categories" className="transition-colors hover:text-ink">
            By category
          </Link>
          <Link href="/tags" className="transition-colors hover:text-ink">
            By tag
          </Link>
          <Link href="/archive" className="transition-colors hover:text-ink">
            By year
          </Link>
        </div>
      </PageHeader>

      <div className="mt-6">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <ArticleListItem
              key={article.slug}
              article={article}
              index={index}
            />
          ))
        ) : (
          <p className="border border-line p-6 text-ink-muted">
            No articles are published yet.
          </p>
        )}
      </div>
    </Container>
  );
}
