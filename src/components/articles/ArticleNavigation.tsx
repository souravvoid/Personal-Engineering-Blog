import Link from "next/link";
import type { Article } from "@/lib/content/loader";

type ArticleNavigationProps = {
  newer: Article | null;
  older: Article | null;
};

export function ArticleNavigation({ newer, older }: ArticleNavigationProps) {
  if (!newer && !older) return null;

  return (
    <nav
      aria-label="Article navigation"
      className="mt-14 grid gap-4 sm:grid-cols-2"
    >
      <div>
        {newer ? (
          <Link
            href={`/articles/${newer.slug}`}
            className="group flex h-full flex-col gap-2 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-violet-mid"
          >
            <span className="eyebrow">Newer</span>
            <span className="font-display text-lg leading-snug transition-colors group-hover:text-ink">
              {newer.title}
            </span>
          </Link>
        ) : (
          <div className="h-full p-5">
            <span className="eyebrow">Newer</span>
            <p className="mt-2 text-sm text-ink-muted">This is the latest article.</p>
          </div>
        )}
      </div>

      <div>
        {older ? (
          <Link
            href={`/articles/${older.slug}`}
            className="group flex h-full flex-col items-start gap-2 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-violet-mid sm:items-end sm:text-right"
          >
            <span className="eyebrow">Older</span>
            <span className="font-display text-lg leading-snug transition-colors group-hover:text-ink">
              {older.title}
            </span>
          </Link>
        ) : (
          <div className="h-full p-5 sm:text-right">
            <span className="eyebrow">Older</span>
            <p className="mt-2 text-sm text-ink-muted">This is the first article.</p>
          </div>
        )}
      </div>
    </nav>
  );
}
