import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutProps = {
  type?: "note" | "tip" | "warning" | "info";
  title?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Inline callout block for MDX: notes, tips, warnings, and info blocks.
 * Styled via `.article-callout` and `[data-callout-type]` in globals.css.
 */
export function Callout({
  type = "note",
  title,
  children,
  className,
}: CalloutProps) {
  return (
    <div
      className={cn("article-callout", className)}
      data-callout-type={type}
      role="note"
    >
      <div className="article-callout-label">
        {title ??
          (type === "note"
            ? "Note"
            : type === "tip"
              ? "Tip"
              : type === "warning"
                ? "Warning"
                : "Info")}
      </div>
      <div className="article-callout-body">{children}</div>
    </div>
  );
}
