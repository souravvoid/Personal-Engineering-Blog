import Link from "next/link";
import type { Article } from "@/lib/content/loader";
import { categoryToSlug } from "@/lib/content/categories";
import { formatDate, readingTimeLabel } from "@/lib/utils";

type ArticleListItemProps = {
  article: Article;
  index?: number;
  showDescription?: boolean;
};

export function ArticleListItem({
  article,
  index,
  showDescription = true,
}: ArticleListItemProps) {
  return (
    <article className="index-row group">
      {index === undefined ? null : (
        <span className="font-mono text-[0.6875rem] leading-6 text-ink-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      <div className="min-w-0">
        <h3 className="max-w-2xl font-display text-[1.65rem] leading-[1.15] tracking-[-0.015em] md:text-[1.9rem]">
          <Link
            href={`/articles/${article.slug}`}
            className="underline-offset-4 transition-colors hover:text-ink hover:underline hover:decoration-violet-mid"
          >
            {article.title}
          </Link>
        </h3>
        {showDescription ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            {article.description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-muted md:flex-col md:items-end md:gap-1.5 md:text-right">
        <Link
          href={`/categories/${categoryToSlug(article.category)}`}
          className="transition-colors hover:text-ink"
        >
          {article.category}
        </Link>
        <span className="flex items-center gap-2">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden="true" className="text-line-strong">
            ·
          </span>
          <span>{readingTimeLabel(article.readingTime)}</span>
        </span>
      </div>
    </article>
  );
}
