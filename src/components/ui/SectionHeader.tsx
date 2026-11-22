import Link from "next/link";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: { href: string; label: string };
  children?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  action,
  children,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="mt-2 font-display text-3xl leading-tight tracking-[-0.015em] md:text-4xl">
          {title}
        </h2>
        {children}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-2 pb-1 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          {action.label}
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}
