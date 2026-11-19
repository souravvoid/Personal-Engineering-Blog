# PRD — Personal Engineering Blog

| Field | Value |
|---|---|
| Document | Product Requirements Document |
| Status | Draft — pending your review |
| Version | 0.1 |
| Date | 2026-11-19 |
| Owner | Sourav |
| Related documents | `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, `DESIGN_SPEC.md` (to follow) |

---

## 1. Product vision and objectives

Build a standalone, publication-quality personal engineering blog for long-form writing about system design, backend engineering, distributed systems, security, operating systems, databases, software principles, and engineering experiments.

The blog is **separate from the existing portfolio**. It is a reading-first publication, not a generic blog template, dashboard, or terminal demo. Its visual language follows the approved Cora.computer-inspired editorial direction: black, white, and blue; generous whitespace; strong typographic hierarchy; careful borders, surfaces, and shadows; and restrained light/dark surface contrast.

### Objectives

1. Publish technical articles as MDX files committed to GitHub, with Vercel deploying production automatically on push to `main`.
2. Deliver an excellent long-form reading experience on desktop, tablet, and mobile.
3. Make content discoverable through clear navigation, categories, tags, archive, search, RSS, sitemap, and SEO metadata.
4. Keep the system simple, static-first, and free of a database or custom backend.
5. Guarantee that unpublished articles never appear in any deployed artifact.
6. Establish automated validation and tests so broken content or UI cannot silently ship.

---

## 2. Target audience

### Primary audience

Practicing engineers and technical readers who want depth: backend engineers, system designers, SREs, security practitioners, database engineers, and students of computer science.

### Secondary audience

Recruiters and engineering leaders evaluating technical depth, and peers who discover individual articles through search, RSS, or shared links.

### Working assumption

The primary desired action is **reading and subscribing via RSS**, with secondary paths to the portfolio/contact for hiring or collaboration. Audience priority is an open decision — see Section 17.

---

## 3. Core user journeys

| Journey | Steps | Success state |
|---|---|---|
| Discovery | Home → featured article → related article → RSS | Reader finds a relevant article and subscribes |
| Direct research | Search → article → references → related article | Reader answers a technical question |
| Browsing | Articles or Archive → category/tag → article | Reader explores a topic systematically |
| Returning reader | RSS / Archive → recently updated note → article | Reader sees new or revised content |
| Author publishing | Write MDX → validate locally → push/PR → Vercel preview → merge → production | Article is live with zero manual deployment steps |

---

## 4. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Articles are authored as MDX files in `content/writing/` and published through Git commits | MVP |
| FR-02 | Frontmatter is validated with a strict Zod schema; invalid content fails validation and build | MVP |
| FR-03 | Slugs are derived from filenames, match a strict regex, and are unique | MVP |
| FR-04 | `draft: true` articles are excluded from every deployed surface | MVP |
| FR-05 | Pages: Home, Articles, Article detail, Categories, Category detail, Tags, Tag detail, Search, About, Archive, RSS, sitemap, robots, 404 | MVP |
| FR-06 | Home shows introduction, philosophy, featured article, latest writing, research notes, topics, and minimal footer | MVP |
| FR-07 | Article pages show title, description, dates, reading time, category, tags, TOC, body, diagrams, code, references, related articles, and prev/next | MVP |
| FR-08 | MDX supports GFM, syntax-highlighted code blocks with copy, callouts, figures with captions, footnotes, tables, and Mermaid diagrams | MVP / see Section 9 |
| FR-09 | Build-time full-text search over published articles with category/tag filtering | MVP |
| FR-10 | RSS feed, XML sitemap, robots rules, canonical URLs, Open Graph/Twitter metadata, and JSON-LD | MVP |
| FR-11 | Responsive layouts at defined breakpoints with mobile navigation and collapsible TOC | MVP |
| FR-12 | Accessible semantics, keyboard navigation, visible focus, alt text, and reduced-motion support | MVP |
| FR-13 | Authoring guide and content conventions documented for future writing | MVP |
| FR-14 | Comments, newsletter, contact form, authentication, CMS UI, and database are excluded | Out of scope |
| FR-15 | Optional analytics may be added only if privacy-friendly and approved | Post-MVP |

---

## 5. Non-functional requirements

| Category | Requirement |
|---|---|
| Performance | Lighthouse 95+ on key pages; LCP < 2.0s on mid-tier mobile; CLS < 0.05; INP < 200ms |
| Bundle | Server Components by default; client JS only for search, mobile nav, copy buttons, theme control (if approved), and lazy diagrams |
| Accessibility | Target WCAG 2.2 AA; 65–75 character reading measure; 2px focus indicator; semantic headings; reduced motion |
| Security | Trusted MDX only; no remote/user-submitted MDX; no secrets in repository; security headers; draft leak prevention |
| SEO | Canonical URLs, sitemap, RSS, structured data, descriptive metadata, no index on preview deployments |
| Maintainability | Simple content layer, strict TypeScript, centralized tokens, no unnecessary abstraction or dependencies |
| Reliability | Build fails loudly on invalid content; CI gates merges; Vercel deploy only from clean Git state |

---

## 6. Website pages and navigation

| Route | Purpose | Key elements |
|---|---|---|
| `/` | Curated entry point | Masthead, intro, philosophy, featured article, latest writing, research notes, topic grid, footer |
| `/articles` | Browsable article index | Rule-separated list, category/tag filters, pagination |
| `/articles/[slug]` | Long-form reading | Full article hierarchy per Section 7 |
| `/categories` | Topic hub | Category index with descriptions and counts |
| `/categories/[slug]` | Category archive | Published articles in one category |
| `/tags` | Tag hub | Tag index with counts |
| `/tags/[slug]` | Tag archive | Published articles with one tag |
| `/search` | Full-text discovery | Search input, results, category/tag filters |
| `/about` | Author context | Bio, philosophy, links, RSS |
| `/archive` | Chronological index | Year-grouped published articles and updates |
| `/rss.xml` | Syndication | Published articles, excerpt + link |
| `/sitemap.xml` | SEO | Published canonical URLs with last modified |
| `/robots.txt` | Crawler rules | Allow public paths; disallow preview indexing via headers |
| `404` | Recovery | Search and navigation back into the site |

Global navigation: Articles, Categories, Archive, Search, About. Utility: RSS, GitHub, email in footer. Contextual navigation on articles: breadcrumbs, TOC, category/tag links, related articles, previous/next.

---

## 7. Article reading experience

The approved wireframe hierarchy:

1. Breadcrumb
2. Category and optional series label
3. Large editorial display title (55px / 64.9px on desktop)
4. Description / dek
5. Metadata: published, updated, reading time, tags, word count
6. Copy link / share
7. Table of contents (sticky right rail on desktop, collapsible on mobile)
8. Main body: Switzer 16px / 24px, 65–75 character measure
9. Section headings: editorial serif 36px / 43.2px
10. Code blocks on dark surface with language label, line numbers where useful, copy control
11. Figures and Mermaid diagrams with captions and text alternatives
12. Callouts, footnotes, and references
13. Related articles
14. Previous / next navigation
15. Author box and RSS prompt
16. Footer

Readability takes priority over decoration. No autoplay media, parallax, or motion that interferes with reading.

---

## 8. Article publishing workflow

1. Create a short-lived branch such as `post/<slug>` (or commit directly to `main` for minor notes, if branch protection allows).
2. Add `content/writing/<slug>.mdx` with valid frontmatter.
3. Add images to `public/images/writing/<slug>/`.
4. Run `npm run dev` to preview locally; drafts are visible only in development.
5. Run `npm run validate:content`, `npm run lint`, `npm run typecheck`, and `npm test`.
6. Push and open a pull request; Vercel creates a preview deployment.
7. After review, merge to `main`.
8. GitHub Actions runs CI; Vercel builds and deploys production automatically.
9. Verify production URL, RSS, sitemap, and search after deploy.

No CMS, database, or manual deployment step is involved.

---

## 9. Content categories and metadata

### Categories (controlled vocabulary)

1. System Design and Architecture
2. Backend Engineering
3. Distributed Systems
4. Cybersecurity and Information Security
5. Operating Systems and Linux
6. Database Engineering
7. Software Engineering Principles
8. Engineering Experiments and Personal Technical Notes

Each article has **exactly one** category and **zero or more** free-form tags.

### Frontmatter schema

| Field | Type | Required | Rules |
|---|---|---|---|
| `title` | string | Yes | 1–100 characters |
| `description` | string | Yes | 1–200 characters; used for SEO and cards |
| `date` | ISO date | Yes | Publication date; explicit, not Git timestamp |
| `updated` | ISO date | No | Must be >= `date` if present |
| `category` | enum | Yes | One of the eight controlled values |
| `tags` | string[] | No | Normalized lowercase kebab-case |
| `series` | string | No | Optional series name |
| `seriesOrder` | number | No | Required if `series` present |
| `draft` | boolean | No | Default `false`; `true` excludes from all deployed output |
| `featured` | boolean | No | Default `false` |
| `cover` | object | No | `{ src, alt }`; `alt` required if `src` present |
| `canonical` | URL | No | Overrides generated canonical URL |

Reading time and word count are derived from content, not authored.

---

## 10. Search and filtering

- A build-time script generates `public/search-index.json` from all published articles.
- Index fields: `slug`, `title`, `description`, `category`, `tags`, `date`, and a plain-text excerpt of the body.
- The `/search` page loads the index client-side and uses MiniSearch for full-text matching.
- Filters: category and tag.
- Search never includes drafts.
- The index is regenerated on every production build; no backend service is involved.

---

## 11. SEO and accessibility

**SEO:** canonical URLs, per-page metadata, Open Graph and Twitter cards, JSON-LD (`BlogPosting`, `Person`, `BreadcrumbList`), RSS, sitemap, robots, descriptive headings, internal links, and `noindex` on Vercel preview deployments.

**Accessibility:** semantic landmarks, skip link, keyboard-operable navigation and search, visible 2px focus ring, alt text for images, captions for figures, heading order validation in MDX linting, sufficient contrast in both light and dark surfaces, and `prefers-reduced-motion` support. A target of WCAG 2.2 AA will be verified through automated axe checks plus manual keyboard/contrast review; compliance is not claimed without that verification.

---

## 12. Responsive behaviour

| Breakpoint | Navigation | Layout | Article |
|---|---|---|---|
| `< 640px` | Hamburger | Single column | TOC in `<details>` above body; code scrolls horizontally |
| `640–767px` | Hamburger / compact | Single column | Same as above |
| `768–1023px` | Inline nav | Content container | TOC above article |
| `1024–1279px` | Full nav | Article + right rail | Sticky TOC, 55px display title |
| `≥ 1280px` | Full nav | Wide container, larger gutters | Increased whitespace |

Diagrams and images are capped at container width; code blocks never cause page-level horizontal overflow.

---

## 13. Security considerations

- MDX is trusted build-time source; no user-submitted or remote MDX is ever rendered.
- No secrets in the repository; only public site URL and optional analytics IDs via environment variables.
- Draft articles are removed by a single publication filter and verified by tests.
- Security headers: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame restrictions, and HTTPS/HSTS via Vercel.
- CSP approach: nonce-based policy for the static Next.js output; documented as a hardening item during implementation.
- Dependencies pinned via `package-lock.json`; Dependabot and `npm audit` enabled.
- JSON-LD is escaped to prevent script injection.
- No database, no authentication surface, no contact form in MVP.

---

## 14. Performance requirements

| Metric | Target |
|---|---|
| Lighthouse Performance / SEO / Best Practices | 95+ on Home, Articles, and a representative article |
| LCP | < 2.0s on mid-tier mobile |
| CLS | < 0.05 |
| INP | < 200ms |
| Initial client JS on article pages | Minimal; only interactive islands plus lazy diagram chunk |
| Fonts | Self-hosted WOFF2, subset where possible, `font-display: swap` |
| Images | `next/image`, explicit dimensions, AVIF/WebP |
| Rendering | Static generation with `generateStaticParams` for known slugs |

---

## 15. Acceptance criteria

- **AC-01:** A production build excludes every `draft: true` post from `/articles`, `/archive`, categories, tags, RSS, sitemap, search index, and related articles; requesting its slug returns 404.
- **AC-02:** Invalid frontmatter or a duplicate/invalid slug fails `npm run validate:content` and `npm run build` with a clear error.
- **AC-03:** All eight categories are available, each with a working category page.
- **AC-04:** A published article renders every element listed in Section 7.
- **AC-05:** Search returns matching published articles by title, description, tags, category, and body excerpt, and supports category/tag filters.
- **AC-06:** RSS and sitemap contain only published canonical URLs.
- **AC-07:** Layout and navigation work at 375px, 768px, 1024px, and 1440px widths.
- **AC-08:** Keyboard navigation, visible focus, skip link, alt text, and reduced-motion behaviour are verified.
- **AC-09:** Performance budgets in Section 14 are met on a representative build.
- **AC-10:** Merge to `main` triggers a Vercel production deployment; pull requests trigger preview deployments.
- **AC-11:** No database, custom API, or CMS is present.
- **AC-12:** Switzer and Newsreader are self-hosted with license files; Signifier is not bundled.

---

## 16. Out-of-scope features

Comments, newsletter, contact form, user accounts, authentication, paywalls, ads, i18n, scheduled publishing, CMS/admin UI, database, server-side search, personalized feeds, and full Cora.computer cloning.

---

## 17. Risks and constraints

| Risk | Mitigation |
|---|---|
| Greenfield project has no inherited conventions | Standards defined in these documents before coding |
| Next.js 16 API drift | Consult installed docs and current references; pin versions |
| MDX toolchain maintenance | Use `next-mdx-remote/rsc` + Zod; avoid unmaintained content frameworks |
| Draft leakage | Single publication filter plus automated assertions |
| Client JS bloat | Server Components, build-time highlighting, lazy diagrams |
| Search index growth | Trim body excerpts; reassess beyond a few hundred articles |
| Font licensing | Switzer under ITF Free Font License; Newsreader under OFL; no Signifier files |
| Subdomain SEO authority | Canonical URLs, sitemap, cross-links; reverse-proxy later if needed |
| Open product decisions | Documented as assumptions below and resolved before final launch |

---

## 18. Working assumptions and open decisions

These were not explicitly answered and are carried as assumptions:

| Item | Working assumption | Needs confirmation |
|---|---|---|
| Domain | `blog.souravvoid.dev` | Yes — DNS access and preferred domain |
| GitHub repo | `souravvoid/engineering-blog`, public | Yes — name and visibility |
| Folder name | Rename current empty folder to `sourav.dev.blog` | Yes — keep or rename |
| Audience priority | Engineers first, recruiters second | Yes |
| Analytics | None at launch | Yes |
| Comments / newsletter | Excluded | Yes |
| Contact | Link to portfolio, no form on blog | Yes |
| Docs visibility | `docs/` committed; research notes ignored | Yes |

---

## 19. Success metrics

1. Articles are publishable through Git alone, with no manual deployment steps.
2. Zero draft articles appear in any production artifact.
3. All automated checks pass on every pull request.
4. Lighthouse and Core Web Vitals targets are met on key pages.
5. The site remains maintainable with no database or custom backend.
