/**
 * The category vocabulary shared by the content schema, navigation, and
 * client components. This module must stay free of Node imports so the search
 * UI can use it without pulling the filesystem loader into the browser bundle.
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

export type CategoryDefinition = {
  name: Category;
  slug: string;
  description: string;
};

export const categoryDefinitions: readonly CategoryDefinition[] = [
  {
    name: "System Design and Architecture",
    slug: "system-design-and-architecture",
    description:
      "How services are shaped, where state lives, and which trade-offs survive contact with production.",
  },
  {
    name: "Backend Engineering",
    slug: "backend-engineering",
    description:
      "APIs, retries, queues, and the contracts that keep server-side systems honest.",
  },
  {
    name: "Distributed Systems",
    slug: "distributed-systems",
    description:
      "Consensus, replication, failure, and the gap between what a protocol guarantees and what you assume.",
  },
  {
    name: "Cybersecurity and Information Security",
    slug: "cybersecurity-and-information-security",
    description:
      "Threat models, defensive design, and the assumptions that turn into vulnerabilities.",
  },
  {
    name: "Operating Systems and Linux",
    slug: "operating-systems-and-linux",
    description:
      "Schedulers, processes, memory, and the kernel behaviour behind everyday latency.",
  },
  {
    name: "Database Engineering",
    slug: "database-engineering",
    description:
      "Query planners, indexes, joins, and the physical work hiding behind a SQL statement.",
  },
  {
    name: "Software Engineering Principles",
    slug: "software-engineering-principles",
    description:
      "Interfaces, abstraction, and the design decisions that decide whether a system stays changeable.",
  },
  {
    name: "Engineering Experiments and Personal Technical Notes",
    slug: "engineering-experiments-and-personal-technical-notes",
    description:
      "Small builds, field notes, and things learned by making them rather than reading about them.",
  },
];

const byName = new Map<Category, CategoryDefinition>(
  categoryDefinitions.map((definition) => [definition.name, definition]),
);

const bySlug = new Map<string, CategoryDefinition>(
  categoryDefinitions.map((definition) => [definition.slug, definition]),
);

export function getCategoryDefinition(name: Category): CategoryDefinition {
  const definition = byName.get(name);
  if (!definition) {
    throw new Error(`Unknown category: ${name}`);
  }
  return definition;
}

export function getCategoryBySlug(slug: string): CategoryDefinition | null {
  return bySlug.get(slug) ?? null;
}

export function categoryToSlug(name: Category): string {
  return getCategoryDefinition(name).slug;
}
