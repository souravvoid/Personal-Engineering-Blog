import Link from "next/link";
import { formatTag } from "@/lib/utils";

type TagListProps = {
  tags: readonly string[];
  className?: string;
};

export function TagList({ tags, className }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <ul className={["flex flex-wrap gap-2", className].filter(Boolean).join(" ")}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={`/tags/${tag}`} className="tag-chip">
            #{formatTag(tag)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
