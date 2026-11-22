import Link from "next/link";
import type { Article } from "@/lib/content/loader";
import { categoryToSlug } from "@/lib/content/categories";
import { ArticleMeta } from "./ArticleMeta";

type FeaturedArticleProps = {
  article: Article;
};

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <article className="relative overflow-hidden rounded-xxl border border-line bg-surface">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-lime via-lime/30 to-transparent"
      />
      <div className="grid gap-10 p-6 md:grid-cols-[1fr_auto] md:items-end md:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow text-lime">Featured essay</p>
            <span aria-hidden="true" className="text-line-strong">
              /
            </span>
            <Link
              href={`/categories/${categoryToSlug(article.category)}`}
              className="eyebrow transition-colors hover:text-ink"
            >
              {article.category}
            </Link>
          </div>

          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.06] tracking-[-0.02em]">
            <Link
              href={`/articles/${article.slug}`}
              className="transition-colors hover:text-ink"
            >
              {article.title}
            </Link>
          </h2>

          <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-muted">
            {article.description}
          </p>

          <ArticleMeta
            date={article.date}
            updated={article.updated}
            readingTime={article.readingTime}
            className="mt-7"
          />
        </div>

        <Link
          href={`/articles/${article.slug}`}
          className="button button-primary w-fit"
        >
          Read article <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
