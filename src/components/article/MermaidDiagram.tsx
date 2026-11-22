"use client";

import { useEffect, useId, useRef, useState } from "react";

type MermaidDiagramProps = {
  /** Mermaid chart source emitted by the remark plugin. */
  source: string;
  /** Optional accessible description of the diagram. */
  alt?: string;
};

type Status = "idle" | "rendering" | "rendered" | "error";

let renderCounter = 0;

const themeVariables = {
  background: "#150f23",
  primaryColor: "#1f1633",
  primaryTextColor: "#ffffff",
  primaryBorderColor: "#6a5fc1",
  secondaryColor: "#422082",
  secondaryTextColor: "#ffffff",
  secondaryBorderColor: "#6a5fc1",
  tertiaryColor: "#150f23",
  tertiaryTextColor: "#ffffff",
  tertiaryBorderColor: "#362d59",
  lineColor: "#bdb8c0",
  textColor: "#ffffff",
  mainBkg: "#1f1633",
  nodeBorder: "#6a5fc1",
  clusterBkg: "#150f23",
  clusterBorder: "#362d59",
  edgeLabelBackground: "#150f23",
  fontFamily: "var(--font-rubik), system-ui, sans-serif",
  fontSize: "14px",
} as const;

/**
 * Render a Mermaid diagram client-side.
 *
 * Mermaid is imported only after the figure approaches the viewport, so pages
 * without diagrams and the initial HTML payload carry no Mermaid JavaScript.
 * The raw source stays available in a collapsed `<details>` element, which is
 * also the fallback if rendering fails.
 */
export function MermaidDiagram({ source, alt }: MermaidDiagramProps) {
  const generatedId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !source.trim()) {
      setStatus("error");
      setMessage("The diagram has no source.");
      return;
    }

    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const render = async () => {
      setStatus("rendering");
      try {
        const { default: mermaid } = await import("mermaid");
        if (cancelled) return;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables,
          fontFamily: "var(--font-rubik), system-ui, sans-serif",
        });
        const renderId = `mermaid-${generatedId.replace(/[^a-zA-Z0-9]/g, "")}-${++renderCounter}`;
        const { svg } = await mermaid.render(renderId, source);
        if (cancelled || !svgRef.current) return;
        svgRef.current.innerHTML = svg;
        setStatus("rendered");
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Unknown rendering error",
        );
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      void render();
      return () => {
        cancelled = true;
      };
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer?.disconnect();
          observer = null;
          void render();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [generatedId, source]);

  return (
    <figure className="diagram">
      <div ref={containerRef} className="diagram-canvas" data-status={status}>
        {status === "idle" || status === "rendering" ? (
          <p className="diagram-placeholder">Rendering diagram…</p>
        ) : null}
        {status === "error" ? (
          <p className="diagram-error">
            This diagram could not be rendered
            {message ? `: ${message}` : "."}
          </p>
        ) : null}
        <div
          ref={svgRef}
          className="diagram-svg"
          role="img"
          aria-label={alt ?? "Technical diagram"}
          hidden={status !== "rendered"}
        />
      </div>

      <details className="diagram-source">
        <summary>Diagram source</summary>
        <pre>
          <code>{source}</code>
        </pre>
      </details>
    </figure>
  );
}
