"use client";

import { useEffect, useId, useRef, useState } from "react";

type MermaidDiagramProps = {
  /** Optional stable id for the generated SVG. */
  id?: string;
};

/**
 * Render a Mermaid diagram.
 *
 * Performance: Mermaid is loaded only when the diagram is near the viewport.
 * The chart source travels as a `data-mermaid` HTML attribute rendered by the
 * remark plugin, so the initial HTML payload already carries the source and no
 * Mermaid JavaScript is sent until the component mounts and detects the
 * attribute near the viewport.
 *
 * A `<details>` block with the raw source is always rendered as a no-JS /
 * pre-hydration fallback.
 */
export function MermaidDiagram({ id }: MermaidDiagramProps = {}) {
  const generatedId = useId();
  const diagramId = id ?? `mermaid-${generatedId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "rendered" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [chart, setChart] = useState<string | null>(null);

  // Read chart from the data-mermaid attribute injected by the remark plugin.
  useEffect(() => {
    var _a;
    const container = containerRef.current;
    if (!container) return;
    const attr = (_a = container.dataset) === null || _a === void 0
      ? void 0
      : _a.mermaidSource;
    if (attr) setChart(attr);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const init = async () => {
      if (cancelled || !chart) return;
      try {
        const { default: mermaid } = await import("mermaid");
        if (cancelled) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "neutral",
        });
        const { svg } = await mermaid.render(diagramId, chart);
        if (cancelled) return;
        const container = containerRef.current;
        if (container) {
          container.innerHTML = svg;
          setStatus("rendered");
        }
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unknown error");
      }
    };

    if (chart && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            void init();
          }
        },
        { rootMargin: "200px" },
      );
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
    } else if (chart) {
      // No IntersectionObserver available; init synchronously if chart exists.
      void init();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [chart, diagramId]);

  return (
    <figure className="my-8">
      <details className="rounded-sm border border-neutral-200 bg-neutral-50 p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
        <summary className="cursor-pointer font-medium text-neutral-700 dark:text-neutral-300">
          View diagram source
        </summary>
        <pre className="mt-3 overflow-x-auto whitespace-pre text-xs leading-relaxed">
          <code>{chart ?? ""}</code>
        </pre>
      </details>

      <div
        ref={containerRef}
        className="mt-4 flex justify-center"
        role="img"
        aria-label="Technical diagram"
        data-mermaid={chart ?? ""}
      />

      {chart && status === "rendered" ? (
        <>
          {status === "rendered" && (
            <figcaption className="mt-3 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Diagram rendered
            </figcaption>
          )}
        </>
      ) : null}

      {status === "error" ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
          Diagram failed to render: {message}
        </p>
      ) : null}
    </figure>
  );
}