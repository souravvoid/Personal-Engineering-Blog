import { formatDate, isUpdated, readingTimeLabel } from "@/lib/utils";

type ArticleMetaProps = {
  date: string;
  updated?: string;
  readingTime: number;
  className?: string;
};

export function ArticleMeta({
  date,
  updated,
  readingTime,
  className,
}: ArticleMetaProps) {
  return (
    <div
      className={[
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <time dateTime={date}>{formatDate(date)}</time>
      {isUpdated({ date, updated }) && updated ? (
        <>
          <Separator />
          <span>
            Updated <time dateTime={updated}>{formatDate(updated)}</time>
          </span>
        </>
      ) : null}
      <Separator />
      <span>{readingTimeLabel(readingTime)}</span>
    </div>
  );
}

function Separator() {
  return (
    <span aria-hidden="true" className="text-line-strong">
      /
    </span>
  );
}
