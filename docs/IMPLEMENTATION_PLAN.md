# Implementation Plan — Personal Engineering Blog

| Field | Value |
|---|---|
| Document | Implementation Plan |
| Status | Draft — pending your review |
| Version | 0.1 |
| Date | 2026-11-19 |
| Owner | Sourav |
| Related documents | `PRD.md`, `ARCHITECTURE.md` |

---

## 1. Scope

This plan covers project setup, design-system implementation, content pipeline, all pages, search, SEO, testing, CI/CD, and Vercel deployment. It assumes the approved design specification and Newsreader font substitution. It excludes comments, newsletter, contact form, database, CMS, authentication, and other out-of-scope items in `PRD.md`.

Implementation starts only after you approve this document together with the PRD and architecture.

---

## 2. Folder structure

```text
sourav.dev.blog/                 # or approved renamed folder
├── .github/
│   └── workflows/
│       └── ci.yml
├── content/
│   └── writing/
│       └── <slug>.mdx
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── DESIGN_SPEC.md
│   └── CONTENT_GUIDE.md
├── public/
│   ├── fonts/
│   │   ├── switzer/             # WOFF2 + ITF license file
│   │   └── newsreader/          # WOFF2 + OFL license file
│   ├── images/
│   │   ├── avatar.png
│   │   └── writing/<slug>/
│   └── search-index.json        # generated at build
├── scripts/
│   ├── validate-content.ts
│   └── build-search-index.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── rss.xml/route.ts
│   │   ├── articles/page.tsx
│   │   ├── articles/[slug]/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── categories/[slug]/page.tsx
│   │   ├── tags/page.tsx
│   │   ├── tags/[slug]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── about/page.tsx
│   │   └── archive/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── content/
│   │   ├── article/
│   │   └── ui/
│   ├── lib/
│   │   ├── content/
│   │   ├── mdx/
│   │   ├── search/
│   │   ├── seo/
│   │   └── utils.ts
│   ├── styles/
│   │   └── tokens.css
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── e2e/
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

`docs/research/` is gitignored. Temporary notes stay out of the public repository.

---

## 3. Technology and dependency decisions

| Area | Decision | Rationale |
|---|---|---|
| Runtime | Node 22, npm 10 | Verified available in environment |
| Framework | Next.js 16.x App Router | Current stable; RSC and static generation |
| UI | React 19 | Required by Next 16 |
| Language | TypeScript 5, strict mode | Requirement |
| Styling | Tailwind CSS 4 + CSS variables | Token-driven, approved design system |
| Typography plugin | `@tailwindcss/typography` | Prose styling for MDX |
| Content | `next-mdx-remote/rsc`, `gray-matter`, `zod` | Small, supported, RSC-compatible |
| MDX plugins | `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`, `shiki` | Build-time enhancement without client cost |
| Diagrams | `mermaid` lazy client component | Diagrams without global JS cost |
| Search | `minisearch` + generated JSON | No backend, predictable |
| Icons | `lucide-react` | Vector-only, consistent stroke, no emoji |
| Utilities | `clsx`, `tailwind-merge` | Standard class handling |
| Testing | Vitest, React Testing Library, Playwright, axe-core, jsdom | Unit, component, E2E, a11y |
| Lint | ESLint 9 + `eslint-config-next` | Standard Next.js rules |
| Bundle check | `@next/bundle-analyzer` | Pre-launch budget verification |

Exact versions are pinned at implementation time after checking the npm registry. Contentlayer and other unmaintained content frameworks are explicitly rejected.

---

## 4. Component breakdown

| Area | Components |
|---|---|
| Layout shell | `SiteHeader`, `SiteFooter`, `Container`, `Breadcrumbs`, `SkipLink` |
| Content discovery | `ArticleCard`, `ArticleList`, `CategoryLabel`, `TagLink`, `TopicGrid`, `FeaturedPanel` |
| Article reading | `ArticleHeader`, `ArticleMeta`, `TableOfContents`, `Prose`, `CodeBlock`, `Figure`, `Callout`, `References`, `RelatedArticles`, `PrevNextNav`, `AuthorBox` |
| Interactive islands | `SearchDialog`, `MobileNav`, `CopyButton`, `MermaidDiagram`, `ThemeToggle` (only if approved) |

All non-interactive components remain Server Components.

---

## 5. Implementation sequence

### Phase 0 — Repository and tooling

**Deliverables:** git init, `.gitignore`, `package.json`, TypeScript/ESLint/PostCSS config, `next.config.ts`, README, docs folder.

**Exit criteria:** `npm install`, `npm run dev`, `npm run build`, `npm run lint`, and `npm run typecheck` all succeed on a minimal Next.js shell.

### Phase 1 — Design system and layout shell

**Deliverables:** CSS variables in `src/styles/tokens.css`, Tailwind theme mapping, self-hosted Switzer and Newsreader with license files, `globals.css`, `SiteHeader`, `SiteFooter`, `Container`, `SkipLink`, `not-found.tsx`, `error.tsx`.

**Exit criteria:** tokens render correctly in light and dark surfaces; header/footer work at 375px, 768px, 1024px, 1440px; focus and reduced-motion behaviour verified.

### Phase 2 — Content layer and validation

**Deliverables:** `schema.ts`, `files.ts`, `loader.ts`, `publication.ts`, slug/date utilities, `validate-content.ts`, seed MDX files for each category.

**Exit criteria:** valid articles load; invalid frontmatter, bad slugs, duplicates, and drafts are rejected in tests and build.

### Phase 3 — Page templates

**Deliverables:** Home, Articles, Categories, Category detail, Tags, Tag detail, About, Archive, Search page shell.

**Exit criteria:** all routes render from published metadata; navigation paths work; no draft appears.

### Phase 4 — Article rendering

**Deliverables:** `compile.ts`, MDX plugins, `Prose`, `CodeBlock` with copy, `Figure`, `Callout`, `References`, TOC extraction, `MermaidDiagram` lazy loader, related articles, previous/next.

**Exit criteria:** representative long-form article renders all elements in PRD Section 7; code blocks do not overflow the page; diagrams responsive with captions.

### Phase 5 — Search

**Deliverables:** `build-search-index.ts`, `public/search-index.json`, `SearchDialog`/search page, category/tag filters.

**Exit criteria:** full-text search returns published articles only; filters work; index regenerates on build.

### Phase 6 — SEO and feeds

**Deliverables:** `generateMetadata`, JSON-LD, `sitemap.ts`, `robots.ts`, `rss.xml/route.ts`, canonical URLs, preview `noindex`, Open Graph defaults.

**Exit criteria:** RSS/sitemap contain only published URLs; metadata verified on Home and article pages.

### Phase 7 — Testing

**Deliverables:** unit tests, component tests, integration tests, Playwright E2E, axe accessibility checks, content validation tests.

**Exit criteria:** all tests pass; coverage target 80%+ on content and utility modules.

### Phase 8 — CI/CD and Vercel

**Deliverables:** GitHub Actions workflow, branch protection recommendation, Vercel project config, environment variables, security headers, CSP nonce implementation.

**Exit criteria:** PR checks pass; preview deployments work; merge to `main` deploys production.

### Phase 9 — Launch readiness

**Deliverables:** CONTENT_GUIDE, final content seed, performance audit, bundle analysis, manual accessibility pass, post-deploy smoke check.

**Exit criteria:** all PRD acceptance criteria AC-01 through AC-12 verified.

---

## 6. Testing strategy

| Test type | Tool | Examples |
|---|---|---|
| Unit | Vitest | slug validation, date ordering, reading time, draft filtering |
| Component | React Testing Library | header nav, article card metadata, copy button, TOC |
| Integration | Vitest | route data loading, metadata generation, RSS/sitemap contents |
| Content validation | Custom script | frontmatter schema, slug uniqueness, image references, alt text |
| E2E | Playwright | navigation, search, mobile menu, article render, 404 |
| Accessibility | axe-core | focus, labels, contrast-sensitive checks, semantic structure |
| Performance | Lighthouse CI / manual | budgets from PRD Section 14 |

No feature is marked complete until its test is written and passing.

---

## 7. Git branching strategy

- `main` is protected and represents production.
- Short-lived branches: `feat/<name>`, `post/<slug>`, `fix/<name>`, `chore/<name>`.
- Pull requests are required for code changes; content-only commits may go directly to `main` if branch protection allows, but PR previews are recommended.
- Commit convention: Conventional Commits (`feat:`, `fix:`, `content:`, `docs:`, `chore:`).
- Vercel deploys `main` to production and PR branches to preview URLs.

---

## 8. CI/CD workflow

```yaml
# Conceptual — exact file written in Phase 8
on: pull_request, push to main
steps:
  - checkout
  - setup-node 22 with npm cache
  - npm ci
  - npm run typecheck
  - npm run lint
  - npm run validate:content
  - npm test
  - npm run build
```

Vercel runs its own build. CI is the quality gate; branch protection prevents merging on red status.

---

## 9. Vercel deployment plan

1. Create Vercel project from the GitHub repository.
2. Framework preset: Next.js.
3. Build command: `npm run build`. Output: default Next.js.
4. Node version: 22.
5. Environment variables: `NEXT_PUBLIC_SITE_URL`, optional analytics ID.
6. Production branch: `main`.
7. Preview deployments enabled for pull requests.
8. Custom domain `blog.souravvoid.dev` added after DNS confirmation.
9. Security headers configured in `next.config.ts`; CSP nonce in middleware.
10. Post-deploy verification: home, article, RSS, sitemap, robots, search, 404.

---

## 10. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URLs, RSS, sitemap, metadata |
| `NEXT_PUBLIC_ANALYTICS_ID` | No | Optional privacy-friendly analytics |
| `VERCEL_ENV` | Automatic | Preview `noindex` behaviour |

No secrets are required for the MVP.

---

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Next.js 16 API mismatch | Consult installed docs; pin versions; verify each phase build |
| MDX compilation edge cases | Start with simple articles; add plugins incrementally with tests |
| Mermaid adds client weight | Lazy-load only when a diagram exists; fallback source block |
| Draft leakage | Central filter plus assertions across pages, feeds, sitemap, and index |
| Search index growth | Excerpt-only body text; revisit beyond a few hundred posts |
| Font licensing | Ship Switzer license and Newsreader OFL; never bundle Signifier |
| Open product decisions | Resolve before launch; no assumptions silently baked into config |

---

## 12. Definition of done

- All PRD acceptance criteria verified.
- All tests and CI checks green.
- Lighthouse targets met.
- Manual desktop/tablet/mobile and keyboard checks completed.
- RSS, sitemap, robots, search, and 404 verified on production.
- Documentation committed; temporary research excluded.
- No database, CMS, or custom backend introduced.
