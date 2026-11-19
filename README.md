# Personal Engineering Blog

A standalone, publication-quality personal engineering blog. Content lives as MDX in this
repository and is deployed automatically by Vercel on push to `main`.

**This repository is separate from the existing portfolio project.**

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS 4
- MDX via `next-mdx-remote/rsc` (added in Phase 2)
- Hosted on Vercel

See [`docs/PRD.md`](docs/PRD.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md),
[`docs/DESIGN_SPEC.md`](docs/DESIGN_SPEC.md), and
[`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) for the full specification.

## Status

Phase 0 — repository and tooling setup.

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
| `npm run build` | Produce a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript types |

## Git

The `main` branch deploys to production on Vercel. `origin` uses SSH:

```
git@github.com:souravvoid/Personal-Engineering-Blog.git
```
