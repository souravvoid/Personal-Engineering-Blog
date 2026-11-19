import { z } from "zod";

/**
 * Controlled vocabulary for article categories.
 * Every article belongs to exactly one category.
 */
export const categories = [
  "System Design and Architecture",
  "Backend Engineering",
  "Distributed Systems",
  "Cybersecurity and Information Security",
  "Operating Systems and Linux",
  "Database Engineering",
  "Software Engineering Principles",
  "Engineering Experiments and Personal Technical Notes",
] as const;

export type Category = (typeof categories)[number];

/** Filenames must be lowercase kebab-case and unique. */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Frontmatter dates are explicit ISO calendar dates (YYYY-MM-DD). */
export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const coverSchema = z.object({
  src: z.string().trim().min(1, "cover.src is required"),
  alt: z.string().trim().min(1, "cover.alt is required when cover is present"),
});

export const articleFrontmatterSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "title is required")
      .max(100, "title must be 100 characters or fewer"),
    description: z
      .string()
      .trim()
      .min(1, "description is required")
      .max(200, "description must be 200 characters or fewer"),
    date: z.string().regex(ISO_DATE_REGEX, "date must be a YYYY-MM-DD ISO date"),
    updated: z
      .string()
      .regex(ISO_DATE_REGEX, "updated must be a YYYY-MM-DD ISO date")
      .optional(),
    category: z.enum(categories, {
      error: "category must be one of the eight controlled categories",
    }),
    tags: z
      .array(z.string().trim().min(1).max(40))
      .max(12, "an article may have at most 12 tags")
      .optional(),
    series: z.string().trim().min(1).optional(),
    seriesOrder: z.number().int().positive().optional(),
    draft: z.boolean().optional().default(false),
    featured: z.boolean().optional().default(false),
    cover: coverSchema.optional(),
    canonical: z.url("canonical must be a valid URL").optional(),
  })
  .superRefine((value, ctx) => {
    if (value.updated !== undefined && value.updated < value.date) {
      ctx.addIssue({
        code: "custom",
        path: ["updated"],
        message: "updated must be on or after date",
      });
    }
    if (value.series !== undefined && value.seriesOrder === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["seriesOrder"],
        message: "seriesOrder is required when series is set",
      });
    }
    if (value.seriesOrder !== undefined && value.series === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["seriesOrder"],
        message: "series is required when seriesOrder is set",
      });
    }
  });

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export type FrontmatterValidationResult =
  | { ok: true; data: ArticleFrontmatter }
  | { ok: false; issues: { path: string; message: string }[] };

/** Validate an unknown frontmatter object against the article schema. */
export function validateFrontmatter(input: unknown): FrontmatterValidationResult {
  const result = articleFrontmatterSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return {
    ok: false,
    issues: result.error.issues.map((issue) => ({
      path: issue.path.join(".") || "(root)",
      message: issue.message,
    })),
  };
}

export function isCategory(value: string): value is Category {
  return (categories as readonly string[]).includes(value);
}
