import yaml from "js-yaml";

/**
 * Parse YAML frontmatter using js-yaml's JSON schema.
 *
 * The default js-yaml schema coerces unquoted dates such as `2026-11-10`
 * into `Date` objects, which breaks frontmatter validation. The JSON schema
 * keeps dates as strings while still supporting arrays, booleans, and numbers.
 */
export function parseFrontmatterYaml(source: string): Record<string, unknown> {
  const parsed = yaml.load(source, { schema: yaml.JSON_SCHEMA });
  if (parsed === null || parsed === undefined) return {};
  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("frontmatter must be a YAML mapping at the top level");
  }
  return parsed as Record<string, unknown>;
}
