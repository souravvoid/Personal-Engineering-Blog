import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <header className="border-b border-line pb-12 pt-16 md:pb-16 md:pt-24">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.03] tracking-[-0.025em]">
        {title}
      </h1>
      {description ? (
        <p className="mt-6 max-w-[38rem] text-base leading-relaxed text-ink-muted md:text-lg">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </header>
  );
}
