import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/content/loader";
import { site } from "@/lib/site";

export const alt = "LORD VOID article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleOpengraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const title = article?.title ?? site.name;
  const category = article?.category ?? "Technical publication";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#150F23",
          color: "#FFFFFF",
          padding: "60px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 9,
              fontWeight: 600,
            }}
          >
            LORD VOID
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: 2,
              color: "#C2EF4E",
            }}
          >
            {category.toUpperCase()}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 58 ? 60 : 72,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{ display: "flex", width: 64, height: 2, backgroundColor: "#C2EF4E" }}
          />
          <div style={{ display: "flex", fontSize: 19, color: "#BDB8C0" }}>
            Independent technical publication
          </div>
        </div>
      </div>
    ),
    size,
  );
}
