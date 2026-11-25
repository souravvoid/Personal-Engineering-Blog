"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  /** Text copied to the clipboard on click. */
  text: string;
  /** Label shown before copying. Defaults to "Copy". */
  label?: string;
  className?: string;
};

/**
 * Copies a string to the clipboard and shows feedback without assertions or
 * fake network calls. Uses `navigator.clipboard` when available and a
 * selection-based fallback otherwise.
 */
export function CopyButton({
  text,
  label = "Copy",
  className,
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timeout = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    },
    [],
  );

  const onCopy = async () => {
    if (timeout.current) window.clearTimeout(timeout.current);

    let ok = true;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      ok = false;
      if (typeof document !== "undefined") {
        try {
          const range = document.createRange();
          const selection = window.getSelection();
          const node = document.createTextNode(text);
          document.body.appendChild(node);
          range.selectNodeContents(node);
          selection?.removeAllRanges();
          selection?.addRange(range);
          document.execCommand("copy");
          document.body.removeChild(node);
        } catch {
          ok = false;
        }
      }
    }

    setState(ok ? "copied" : "error");
    if (ok) {
      timeout.current = window.setTimeout(() => setState("idle"), 2500);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn("copy-button", className)}
      aria-live="polite"
    >
      {state === "copied"
        ? "Copied!"
        : state === "error"
          ? "Copy failed"
          : label}
    </button>
  );
}
