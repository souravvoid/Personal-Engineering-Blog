"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-page">
      <div className="grid min-h-[60vh] content-center gap-8 py-20">
        <p className="eyebrow">Runtime error</p>
        <h1 className="max-w-2xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.03] tracking-[-0.025em]">
          Something failed while rendering this page.
        </h1>
        <p className="max-w-xl text-[1.0625rem] leading-relaxed text-ink-muted">
          The error was not caused by anything you did. You can retry the
          segment, or return to the published archive.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-ink-muted">
            Error digest: {error.digest}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="button button-primary">
            Try again
          </button>
          <Link href="/articles" className="button">
            Browse articles
          </Link>
          <Link href="/" className="button">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
