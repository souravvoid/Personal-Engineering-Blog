# Repository Guide

Next.js 16 App Router blog with MDX content committed to the repo (no database or CMS). React 19, Tailwind CSS 4, and TypeScript strict with `noUncheckedIndexedAccess`. `main` is the production branch.

## Commands

- `npm install` — Node >= 20.9 (22 recommended), npm 10.
- `npm run dev` — dev server. `next dev` rewrites the managed block at the bottom of this file; keep it when committing.
- `npm run validate:content` — validates every `content/writing/*.mdx`; exits non-zero on a bad slug or frontmatter.
- `npm run typecheck` / `npm run lint` — fast checks. `next build` also type-checks.
- `npm test` — Vitest, `node` environment. One file: `npx vitest run src/tests/unit/utils.test.ts`; filter with `-t "name"`.
- `npm run test:coverage` — enforces 80% lines/functions/statements and 70% branches over `src/lib/**` and `scripts/**`.
- `npm run build` — `validate:content` then `next build`; the release gate.

For content or MDX changes, run `validate:content`, `typecheck`, `lint`, `test`, then `build`.

## Where things live

- `content/writing/<slug>.mdx` — articles; the filename is the slug.
- `src/lib/content/` — discovery, YAML parsing, Zod schema, draft filter, loader/query API.
- `src/lib/mdx/` — MDX compiler and Mermaid remark plugin.
- `src/components/article/` — MDX component map, TOC, reading progress, share links, and lazy Mermaid client component.
- `src/components/articles/`, `src/components/layout/`, `src/components/search/`, `src/components/ui/` — reading, shell, search, and shared primitives.
- `src/lib/site.ts`, `src/lib/seo.ts`, `src/lib/search.ts`, `src/lib/xml.ts` — site identity, metadata/JSON-LD, dependency-free search, and RSS escaping.
- `src/app/` — App Router routes; styling entry is `globals.css` (Tailwind 4 CSS-first, no `tailwind.config.*`).
- `src/fonts/` — self-hosted Rubik (UI) and Space Grotesk (display) with OFL license files.
- `scripts/validate-content.ts` — build-blocking content validator.
- `docs/` — specs; `docs/desgin.md` is the supplied design.md and drives the current palette, type roles, and component shapes.
- `@/*` maps to `src/*` in `tsconfig.json` and `vitest.config.ts`.
- `next.config.ts` pins `turbopack.root` here so a parent `package.json` is not treated as the workspace root. Keep it.

## Content model

- Frontmatter is validated by `articleFrontmatterSchema` in `src/lib/content/schema.ts`. Required: `title` (<=100), `description` (<=200), `date` (`YYYY-MM-DD`), `category` (one of eight exact strings).
- Optional: `updated`, `tags` (<=12), `series` + `seriesOrder` (both or neither), `draft`, `featured`, `cover { src, alt }`, `canonical`.
- Do not add `slug`, `author`, or `readingTime` frontmatter expecting them to work: the slug is the filename, reading time is computed, and the schema has no author field. Zod strips unknown keys.
- Dates are strings by design. `src/lib/content/yaml.ts` gives gray-matter js-yaml's `JSON_SCHEMA`; default YAML parsing turns unquoted dates into `Date` objects and breaks validation.
- Tags are slugified to lowercase kebab-case, deduped, and sorted by `normalizeTags`; use the normalized value in tag URLs.
- The validator reports every file; the loader throws `ContentValidationError` on the first bad file.

## Drafts — hard invariant

`src/lib/content/publication.ts` is the only draft filter. Drafts are included only when `NODE_ENV === "development"`, so `npm run dev` shows them and production must not. Every listing, feed, sitemap, search index, and related-articles surface must go through `getAllArticles()` / `filterPublished()`; never read MDX files directly on a public surface.

## MDX and Mermaid

- Compile through `compileArticle` in `src/lib/mdx/compile.ts`. It sets `parseFrontmatter: false` (the loader already stripped it) and `blockJS: false` because content is trusted; the default strips JSX attribute expressions. `blockDangerousJS` stays on. It also returns `headings` collected from the rehype tree after `rehype-slug`, so TOC ids match rendered ids.
- Highlighting is build-time Shiki via `rehype-pretty-code`; do not add a client-side highlighter.
- Mermaid is a two-file contract: `remark-mermaid.ts` rewrites ```mermaid fences to `<MermaidDiagram source="...">`; `mdx-components.tsx` must map that same component name, and `MermaidDiagram.tsx` receives `source` as a prop. Change all three together.
- Verified 2026-11-22: a Mermaid diagram renders in `designing-a-rate-limiter.mdx` in the browser.
- Keep Mermaid lazy and client-only; never import it into a server component or the global bundle.

## Testing

- Vitest includes `src/tests/**/*.test.ts` and `src/**/*.test.ts`, environment `node`.
- Pure TS only: content layer, schema/publication rules, search, SEO, heading extraction, and the validator script. There is no jsdom, React Testing Library, or Playwright installed despite the docs; don't write DOM-dependent tests without adding and justifying that setup.
- Coverage thresholds apply to `src/lib/**` and `scripts/**`, so new content-layer code needs tests.

## Design system

- `docs/desgin.md` is the supplied design.md: deep violet midnight canvas (`#150f23`), lifted violet surface (`#1f1633`), electric lime (`#c2ef4e`) reserved for one display-headline chip and the footer squiggle, violet mid/deep for tags and controls, white text, and Rubik/Space Grotesk/Monaco type roles.
- Tokens live in `globals.css` under `@theme`. Keep component classes token-driven; do not hard-code the old grey palette.
- The article reading column is a white "paper" band on the dark shell, matching the spec's two-canvas rule. Body copy is Rubik at 1.5–1.8 leading; display headings use Space Grotesk.
- `NEXT_PUBLIC_SITE_URL` controls canonical URLs, RSS, sitemap, and robots. Without it the site uses `http://localhost:3000`; set it before deploying.

## Docs vs. code, open decisions

- The README now reflects the implemented UI, but the older `docs/PRD.md`, `DESIGN_SPEC.md`, and `IMPLEMENTATION_PLAN.md` still describe a different (Cora-inspired, light) visual direction and unbuilt tooling (MiniSearch, Lucide, RTL/Playwright, CI, `public/`, Vercel). The supplied `docs/desgin.md` is the design source of truth for the current UI.
- Product name and deployment target remain unresolved: docs describe "Personal Engineering Blog" on Vercel, the LORD VOID brief specifies Embarko, and no host config is committed. Confirm before renaming, re-theming, migrating stacks, or deploying.
- Canonical URLs fall back to localhost. Set `NEXT_PUBLIC_SITE_URL` in the hosting environment before launch.
- Keep temporary research out of the repo: `docs/research/` and `public/search-index.json` are gitignored.

## Git

- `main` is the production branch; `origin` is `git@github.com:souravvoid/Personal-Engineering-Blog.git` (SSH).
- Commit `AGENTS.md` with your changes; the Next.js block below is regenerated by `next dev`, so deleting it only recreates the diff.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
