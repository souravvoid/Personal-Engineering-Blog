import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getArticlesByTag, getTagCounts } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";
import { formatTag } from "@/lib/utils";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getTagCounts().map((entry) => ({ slug: entry.tag }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = getArticlesByTag(slug);
  if (articles.length === 0) return {};
  const label = formatTag(slug);
  return pageMetadata({
    title: `#${label}`,
    description: `Articles tagged “${label}” on LORD VOID, newest first.`,
    path: `/tags/${slug}`,
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const articles = getArticlesByTag(slug);
  if (articles.length === 0) notFound();

  return (
    <Container>
      <PageHeader
        eyebrow="Tag"
        title={`#${formatTag(slug)}`}
        description={`${articles.length} ${
          articles.length === 1 ? "article" : "articles"
        } carrying this tag, newest first.`}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">
          <Link href="/tags" className="transition-colors hover:text-ink">
            All tags
          </Link>
          <Link href="/articles" className="transition-colors hover:text-ink">
            All articles
          </Link>
        </div>
      </PageHeader>

      <div className="mt-6">
        {articles.map((article, index) => (
          <ArticleListItem
            key={article.slug}
            article={article}
            index={index}
          />
        ))}
      </div>
    </Container>
  );
}
