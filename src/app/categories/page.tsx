import type { Metadata } from "next";
import Link from "next/link";
import { CategoryGrid } from "@/components/articles/CategoryGrid";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCategoryCounts } from "@/lib/content/loader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Categories",
  description:
    "Browse LORD VOID essays by discipline: system design, backend engineering, distributed systems, security, operating systems, databases, and software principles.",
  path: "/categories",
});

export default function CategoriesPage() {
  const counts = getCategoryCounts();

  return (
    <Container>
      <PageHeader
        eyebrow="Browse"
        title="Categories"
        description="Eight controlled categories. Every article belongs to exactly one of them, so the archive stays predictable."
      >
        <Link
          href="/tags"
          className="text-sm text-ink-muted transition-colors hover:text-ink"
        >
          Looking for a narrower term? Browse tags →
        </Link>
      </PageHeader>

      <div className="mt-8">
        <CategoryGrid counts={counts} />
      </div>
    </Container>
  );
}
