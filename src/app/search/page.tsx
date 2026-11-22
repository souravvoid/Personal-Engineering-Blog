import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchClient } from "@/components/search/SearchClient";
import {
  categoryDefinitions,
  categoryToSlug,
  getCategoryBySlug,
} from "@/lib/content/categories";
import { getAllArticles } from "@/lib/content/loader";
import type { SearchDocument } from "@/lib/search";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Search",
  description:
    "Search every published LORD VOID article by title, description, category, or tag.",
  path: "/search",
  noIndex: true,
});

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = firstValue(params.q).slice(0, 120);
  const requestedCategory = firstValue(params.category);
  const category = getCategoryBySlug(requestedCategory)
    ? requestedCategory
    : "";

  const documents: SearchDocument[] = getAllArticles().map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    excerpt: article.excerpt,
    category: article.category,
    categorySlug: categoryToSlug(article.category),
    tags: article.tags,
    date: article.date,
  }));

  return (
    <Container>
      <PageHeader
        eyebrow="Find"
        title="Search"
        description="Search the published archive by title, description, category, or tag. Everything runs in the browser against article metadata; there is no search backend."
      />

      <div className="py-12 md:py-16">
        <SearchClient
          documents={documents}
          categories={categoryDefinitions.map(({ name, slug }) => ({
            name,
            slug,
          }))}
          initialQuery={query}
          initialCategory={category}
        />
      </div>
    </Container>
  );
}
