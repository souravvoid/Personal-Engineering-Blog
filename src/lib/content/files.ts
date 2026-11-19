import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parseFrontmatterYaml } from "./yaml";

export const CONTENT_DIRECTORY = path.join(process.cwd(), "content", "writing");
export const CONTENT_EXTENSION = ".mdx";

// Keep unquoted dates as strings; see parseFrontmatterYaml.
const matterOptions = {
  engines: {
    yaml: {
      parse: (source: string) => parseFrontmatterYaml(source),
    },
  },
};

export type RawArticle = {
  /** Slug derived from the filename, without the extension. */
  slug: string;
  /** Absolute path to the MDX file. */
  filePath: string;
  /** Parsed YAML frontmatter, still unvalidated. */
  frontmatter: Record<string, unknown>;
  /** Raw MDX body (everything after the frontmatter block). */
  body: string;
};

/** Absolute paths for every MDX file in the content directory, sorted by slug. */
export function listArticleFiles(): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(CONTENT_DIRECTORY, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(CONTENT_EXTENSION))
    .map((entry) => path.join(CONTENT_DIRECTORY, entry.name))
    .sort();
}

/** Read and parse a single article by slug. Returns null when the file is absent. */
export function readRawArticle(slug: string): RawArticle | null {
  const filePath = path.join(CONTENT_DIRECTORY, `${slug}${CONTENT_EXTENSION}`);
  let source: string;
  try {
    source = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
  return parseRawArticle(slug, filePath, source);
}

/** Parse raw file contents into frontmatter and body. */
export function parseRawArticle(
  slug: string,
  filePath: string,
  source: string,
): RawArticle {
  const parsed = matter(source, matterOptions);
  return {
    slug,
    filePath,
    frontmatter: parsed.data as Record<string, unknown>,
    body: parsed.content,
  };
}

/** Read and parse every article file. Invalid slugs are rejected. */
export function readAllRawArticles(): RawArticle[] {
  return listArticleFiles().map((filePath) => {
    const slug = path.basename(filePath, CONTENT_EXTENSION);
    const source = fs.readFileSync(filePath, "utf8");
    return parseRawArticle(slug, filePath, source);
  });
}

export function contentDirectoryExists(): boolean {
  return fs.existsSync(CONTENT_DIRECTORY);
}
