import type { Heading } from "@/lib/mdx/headings";

type TableOfContentsProps = {
  headings: readonly Heading[];
};

function HeadingList({ headings }: TableOfContentsProps) {
  return (
    <ol className="space-y-2.5">
      {headings.map((heading) => (
        <li key={heading.id} className={heading.depth === 3 ? "pl-4" : undefined}>
          <a
            href={`#${heading.id}`}
            className="block text-[0.8125rem] leading-snug text-ink-muted transition-colors hover:text-ink"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Collapsible table of contents shown above the article on small screens. */
export function MobileTableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <details className="mb-10 border border-line bg-surface lg:hidden">
      <summary className="cursor-pointer px-4 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-muted">
        On this page
      </summary>
      <nav aria-label="Table of contents" className="px-4 pb-4">
        <HeadingList headings={headings} />
      </nav>
    </details>
  );
}

/** Sticky desktop table of contents for the article rail. */
export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-[calc(var(--header-height)+2rem)]"
    >
      <p className="eyebrow">On this page</p>
      <div className="mt-4 border-l border-line pl-4">
        <HeadingList headings={headings} />
      </div>
    </nav>
  );
}
