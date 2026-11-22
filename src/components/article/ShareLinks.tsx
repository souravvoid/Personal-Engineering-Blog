"use client";

import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "error";

async function copyCurrentUrl(): Promise<boolean> {
  const url = window.location.href;

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      // Fall through to the selection-based fallback.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function ShareLinks() {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const onCopy = async () => {
    const ok = await copyCurrentUrl();
    setState(ok ? "copied" : "error");
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2500);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={onCopy} className="button">
        {state === "copied" ? "Link copied" : "Copy link"}
      </button>
      <a href="/rss.xml" className="text-sm text-ink-muted transition-colors hover:text-ink">
        Follow via RSS
      </a>
      <span aria-live="polite" className="sr-only">
        {state === "copied"
          ? "Article URL copied to the clipboard."
          : state === "error"
            ? "Could not copy the URL."
            : ""}
      </span>
      {state === "error" ? (
        <span className="text-xs text-red-300">
          Copy failed. Use your browser&apos;s address bar.
        </span>
      ) : null}
    </div>
  );
}
