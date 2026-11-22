"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

const links = [
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/archive", label: "Archive" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
] as const;

function VoidMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 shrink-0"
      fill="none"
    >
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="3.25" fill="currentColor" opacity="0.9" />
      <path d="M3 12h5M16 12h5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Navigation() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/92 backdrop-blur-md">
      <Container>
        <div className="flex h-[var(--header-height)] items-center justify-between gap-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-ink"
            aria-label="LORD VOID — home"
          >
            <span className="text-ink-muted transition-colors group-hover:text-ink">
              <VoidMark />
            </span>
            <span className="text-[0.9375rem] font-semibold uppercase leading-none tracking-[0.22em]">
              Lord Void
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-[0.8125rem] font-medium tracking-wide transition-colors",
                      isActive(link.href)
                        ? "text-ink"
                        : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 -bottom-0.5 h-px bg-lime transition-opacity",
                        isActive(link.href) ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/rss.xml"
                  className="inline-flex items-center gap-1.5 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink"
                >
                  RSS
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center border border-line text-ink transition-colors hover:border-ink-muted md:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      <div
        id="mobile-navigation"
        hidden={!open}
        className="border-t border-line bg-canvas md:hidden"
      >
        <Container>
          <nav aria-label="Primary mobile" className="py-4">
            <ul className="divide-y divide-line">
              {links.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-3.5 text-ink"
                  >
                    <span className="font-display text-2xl">{link.label}</span>
                    <span className="font-mono text-[0.6875rem] text-ink-muted">
                      0{index + 1}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/rss.xml"
                  className="flex items-baseline justify-between py-3.5 text-ink"
                >
                  <span className="font-display text-2xl">RSS</span>
                  <span aria-hidden="true" className="text-ink-muted">
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
