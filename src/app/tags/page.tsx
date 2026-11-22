import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTagCounts } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";
import { formatTag } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Tags",
  description:
    "Narrower topics across LORD VOID: rate limiting, consensus, indexes, threat modeling, scheduling, and more.",
  path: "/tags",
});

export default function TagsPage() {
  const tags = getTagCounts();

  return (
    <Container>
      <PageHeader
        eyebrow="Browse"
        title="Tags"
        description="Cross-cutting terms that appear across categories. Tags are normalized to lowercase kebab-case."
      >
        <Link
          href="/categories"
          className="text-sm text-ink-muted transition-colors hover:text-ink"
        >
          Prefer broader disciplines? Browse categories →
        </Link>
      </PageHeader>

      {tags.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((entry) => (
            <li key={entry.tag}>
              <Link
                href={`/tags/${entry.tag}`}
                className="group flex items-baseline justify-between gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-violet-mid hover:bg-panel"
              >
                <span className="font-display text-xl transition-colors group-hover:text-ink">
                  #{formatTag(entry.tag)}
                </span>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-muted">
                  {entry.count} {entry.count === 1 ? "article" : "articles"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 border border-line p-6 text-ink-muted">
          No tags are published yet.
        </p>
      )}
    </Container>
  );
}
