import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ReferencesProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

/**
 * References block rendered at the end of a long-form article.
 * Styled via `.article-references` in globals.css.
 */
export function References({
  title = "References",
  children,
  className,
}: ReferencesProps) {
  return (
    <section className={cn("article-references", className)}>
      <h2 className="article-references-title">{title}</h2>
      <ol>{children}</ol>
    </section>
  );
}
