# LORD VOID

A standalone, publication-quality technical blog. Articles are MDX files committed to this
repository; there is no database, CMS, or backend.

**This repository is separate from the existing portfolio project.**

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript (strict, `noUncheckedIndexedAccess`)
- Tailwind CSS 4 (CSS-first tokens in `src/app/globals.css`)
- MDX via `next-mdx-remote/rsc` with build-time Shiki highlighting and lazy Mermaid diagrams
- Self-hosted Rubik (UI) and Space Grotesk (display), licensed under the OFL (see `src/fonts/`)
- Dependency-free client-side search over published article metadata

The visual system follows [`docs/desgin.md`](docs/desgin.md), the supplied design spec.

## Status

Implemented: content validation, all public routes, article reading experience, Mermaid
diagrams, client-side search, RSS, sitemap, robots, and Open Graph images.

Deployment target is not yet committed. Set `NEXT_PUBLIC_SITE_URL` to the production origin
before deploying so canonical URLs, RSS, and the sitemap use the correct domain.

## Requirements

- Node.js >= 20.9.0 (Node 22 recommended)
- npm 10

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Validate content, then produce a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript types |
| `npm run validate:content` | Validate every MDX file and fail on bad slugs/frontmatter |
| `npm test` | Run the Vitest unit suite |
| `npm run test:coverage` | Enforce coverage thresholds |

## Routes

`/`, `/articles`, `/articles/[slug]`, `/categories`, `/categories/[slug]`, `/tags`,
`/tags/[slug]`, `/archive`, `/search`, `/about`, `/rss.xml`, `/sitemap.xml`, `/robots.txt`.

## Git

`main` is the production branch. `origin` uses SSH:

```
git@github.com:souravvoid/Personal-Engineering-Blog.git
```
