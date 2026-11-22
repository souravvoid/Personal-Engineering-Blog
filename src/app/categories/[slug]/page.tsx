import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleListItem } from "@/components/articles/ArticleListItem";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  categoryDefinitions,
  getCategoryBySlug,
} from "@/lib/content/categories";
import { getArticlesByCategory } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryDefinitions.map((definition) => ({
    slug: definition.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return pageMetadata({
    title: category.name,
    description: category.description,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(category.name);

  return (
    <Container>
      <PageHeader
        eyebrow="Category"
        title={category.name}
        description={category.description}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">
          <span>
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </span>
          <Link
            href="/categories"
            className="transition-colors hover:text-ink"
          >
            All categories
          </Link>
          <Link href="/archive" className="transition-colors hover:text-ink">
            Archive
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
            No published articles in this category yet.
          </p>
        )}
      </div>
    </Container>
  );
}
