import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleMeta } from "@/components/articles/ArticleMeta";
import { ArticleNavigation } from "@/components/articles/ArticleNavigation";
import { RelatedArticles } from "@/components/articles/RelatedArticles";
import { TagList } from "@/components/articles/TagList";
import {
  MobileTableOfContents,
  TableOfContents,
} from "@/components/article/TableOfContents";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { ShareLinks } from "@/components/article/ShareLinks";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { categoryToSlug } from "@/lib/content/categories";
import {
  getAdjacentArticles,
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/content/loader";
import { compileArticle } from "@/lib/mdx/compile";
import {
  articleJsonLd,
  articleMetadata,
  breadcrumbJsonLd,
} from "@/lib/seo";
import { site } from "@/lib/site";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return articleMetadata(article);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const { content, headings } = await compileArticle(article.body);
  const related = getRelatedArticles(article);
  const { newer, older } = getAdjacentArticles(article);
  const categoryPath = `/categories/${categoryToSlug(article.category)}`;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Articles", path: "/articles" },
    { name: article.category, path: categoryPath },
  ];

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={[
          articleJsonLd(article),
          breadcrumbJsonLd([
            ...breadcrumbs,
            { name: article.title, path: `/articles/${article.slug}` },
          ]),
        ]}
      />

      <Container>
        <div className="pt-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="border-b border-line pb-10 pt-8 md:pb-14 md:pt-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link href={categoryPath} className="eyebrow transition-colors hover:text-ink">
              {article.category}
            </Link>
            {article.series ? (
              <>
                <span aria-hidden="true" className="text-line-strong">
                  /
                </span>
                <span className="eyebrow">
                  {article.series}
                  {article.seriesOrder ? ` · Part ${article.seriesOrder}` : ""}
                </span>
              </>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.03] tracking-[-0.025em]">
            {article.title}
          </h1>

          <p className="mt-6 max-w-[42rem] font-display text-xl leading-relaxed text-ink-muted md:text-2xl">
            {article.description}
          </p>

          <div className="mt-8 flex flex-col gap-5 border-t border-line pt-5 md:flex-row md:items-center md:justify-between">
            <ArticleMeta
              date={article.date}
              updated={article.updated}
              readingTime={article.readingTime}
            />
            <ShareLinks />
          </div>

          <TagList tags={article.tags} className="mt-5" />
        </header>

        <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16 lg:py-16">
          <div className="min-w-0 max-w-[var(--reading-width)]">
            <MobileTableOfContents headings={headings} />
            <div className="paper p-6 sm:p-8 md:p-10">
              <div className="article-prose">{content}</div>
            </div>

            <RelatedArticles articles={related} />
            <ArticleNavigation newer={newer} older={older} />

            <div className="mt-14 rounded-xl border border-line bg-surface p-6 md:p-8">
              <p className="eyebrow">The publication</p>
              <h2 className="mt-3 font-display text-2xl">
                Written by {site.author.name}.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
                LORD VOID publishes long-form explanations of software systems.
                If this article was useful, the RSS feed is the best way to read
                the next one.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link href="/about" className="link-underline">
                  About
                </Link>
                <a href="/rss.xml" className="link-underline">
                  RSS feed
                </a>
                <a
                  href="https://github.com/souravvoid"
                  className="link-underline"
                  rel="me noopener noreferrer"
                  target="_blank"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </Container>
    </>
  );
}
