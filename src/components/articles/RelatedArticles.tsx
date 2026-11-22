import Link from "next/link";
import type { Article } from "@/lib/content/loader";
import { categoryToSlug } from "@/lib/content/categories";
import { formatDate } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

type RelatedArticlesProps = {
  articles: readonly Article[];
};

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section aria-label="Related articles" className="mt-16">
      <SectionHeader eyebrow="Keep reading" title="Related articles" />

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <article className="flex h-full flex-col gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-violet-mid">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/categories/${categoryToSlug(article.category)}`}
                  className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-muted transition-colors hover:text-ink"
                >
                  {article.category}
                </Link>
                <time
                  dateTime={article.date}
                  className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-ink-muted"
                >
                  {formatDate(article.date)}
                </time>
              </div>

              <h3 className="font-display text-xl leading-snug">
                <Link
                  href={`/articles/${article.slug}`}
                  className="transition-colors hover:text-ink"
                >
                  {article.title}
                </Link>
              </h3>

              <p className="text-sm leading-relaxed text-ink-muted">
                {article.description}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
