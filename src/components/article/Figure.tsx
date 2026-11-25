import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FigureProps = {
  children: ReactNode;
  /** Optional caption rendered under the figure. */
  caption?: string;
  className?: string;
};

/** MDX `<figure>` wrapper for images, tables, and diagrams. */
export function Figure({ children, caption, className }: FigureProps) {
  return (
    <figure className={cn("article-figure", className)}>
      {children}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
