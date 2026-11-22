import Link from "next/link";
import { Container } from "./Container";

const footerLinks = [
  { href: "/articles", label: "Articles" },
  { href: "/categories", label: "Categories" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/rss.xml", label: "RSS" },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <svg
        aria-hidden="true"
        className="footer-squiggle"
        viewBox="0 0 1200 14"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 8 C60 2 100 12 160 7 S260 2 320 8 S420 13 480 6 S580 2 640 8 S740 13 800 6 S900 2 960 8 S1060 12 1120 6 S1170 4 1200 8"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em]">
              Lord Void
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              An independent technical publication about the systems underneath
              the software we use.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow">Sections</p>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://github.com/souravvoid"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                  rel="me noopener noreferrer"
                  target="_blank"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="/rss.xml"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  RSS feed
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LORD VOID. All rights reserved.</p>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em]">
            Content in Git · no database
          </p>
        </div>
      </Container>
    </footer>
  );
}
