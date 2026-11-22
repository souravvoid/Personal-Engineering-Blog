import Link from "next/link";
import type { CategoryCount } from "@/lib/content/loader";
import { categoryDefinitions } from "@/lib/content/categories";

type CategoryGridProps = {
  counts: readonly CategoryCount[];
};

export function CategoryGrid({ counts }: CategoryGridProps) {
  const countByCategory = new Map(
    counts.map((entry) => [entry.category, entry.count]),
  );

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categoryDefinitions.map((definition, index) => {
        const count = countByCategory.get(definition.name) ?? 0;
        return (
          <li key={definition.slug}>
            <Link
              href={`/categories/${definition.slug}`}
              className="group flex h-full min-h-48 flex-col justify-between gap-6 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-violet-mid hover:bg-panel"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-muted">
                  {count} {count === 1 ? "essay" : "essays"}
                </span>
              </div>

              <div>
                <h3 className="font-display text-[1.35rem] leading-[1.15] tracking-[-0.01em] transition-colors group-hover:text-ink">
                  {definition.name}
                </h3>
                <p className="mt-3 line-clamp-3 text-[0.8125rem] leading-relaxed text-ink-muted">
                  {definition.description}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
