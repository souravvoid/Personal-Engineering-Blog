/**
 * Validate every MDX file in content/writing.
 *
 * - slug matches the lowercase kebab-case pattern and is unique
 * - frontmatter passes the Zod schema and cross-field rules
 * - referenced cover images exist under public/
 *
 * Drafts are validated too: a draft must be valid before it can ever be
 * published. Exit code is non-zero when any error is found, so CI and the
 * production build fail loudly.
 *
 * Run with: npm run validate:content
 */
import fs from "node:fs";
import path from "node:path";
import {
  CONTENT_DIRECTORY,
  contentDirectoryExists,
  listArticleFiles,
  parseRawArticle,
} from "../src/lib/content/files";
import { validateFrontmatter } from "../src/lib/content/schema";
import { isValidSlug, normalizeTags } from "../src/lib/utils";

type Severity = "error" | "warning";

function report(severity: Severity, slug: string, message: string): void {
  const prefix = severity === "error" ? "✗" : "⚠";
  console.error(`${prefix} [${slug}] ${message}`);
}

function coverExists(src: string): boolean {
  if (!src.startsWith("/")) return true;
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

const files = listArticleFiles();

if (!contentDirectoryExists()) {
  report("error", "(content)", `content directory not found: ${CONTENT_DIRECTORY}`);
  process.exit(1);
}

if (files.length === 0) {
  report("error", "(content)", `no .mdx files found in ${CONTENT_DIRECTORY}`);
  process.exit(1);
}

const seenSlugs = new Map<string, string>();
let errorCount = 0;
let warningCount = 0;
let draftCount = 0;
let publishedCount = 0;

for (const filePath of files) {
  const slug = path.basename(filePath, ".mdx");
  const label = slug || path.basename(filePath);

  if (!isValidSlug(slug)) {
    report("error", label, `slug must match /^[a-z0-9]+(?:-[a-z0-9]+)*$/`);
    errorCount += 1;
    continue;
  }

  const duplicateOf = seenSlugs.get(slug);
  if (duplicateOf) {
    report("error", label, `duplicate slug also defined by ${path.basename(duplicateOf)}`);
    errorCount += 1;
    continue;
  }
  seenSlugs.set(slug, filePath);

  const source = fs.readFileSync(filePath, "utf8");
  const raw = parseRawArticle(slug, filePath, source);
  const result = validateFrontmatter(raw.frontmatter);

  if (!result.ok) {
    for (const issue of result.issues) {
      report("error", slug, `${issue.path}: ${issue.message}`);
      errorCount += 1;
    }
    continue;
  }

  const frontmatter = result.data;
  if (frontmatter.draft) draftCount += 1;
  else publishedCount += 1;

  const originalTags = frontmatter.tags ?? [];
  const normalizedTags = normalizeTags(originalTags);
  const changedTags = normalizedTags.filter(
    (tag) => !originalTags.some((original) => original.trim().toLowerCase() === tag),
  );
  if (changedTags.length > 0) {
    report(
      "warning",
      slug,
      `tags normalized to [${normalizedTags.join(", ")}]`,
    );
    warningCount += 1;
  }

  if (frontmatter.cover && !coverExists(frontmatter.cover.src)) {
    report("error", slug, `cover image not found: ${frontmatter.cover.src}`);
    errorCount += 1;
  }
}

const total = publishedCount + draftCount;
console.log(
  `Validated ${total} file(s): ${publishedCount} published, ${draftCount} draft, ` +
    `${errorCount} error(s), ${warningCount} warning(s).`,
);

if (errorCount > 0) {
  console.error("Content validation failed.");
  process.exit(1);
}

console.log("Content validation passed.");
