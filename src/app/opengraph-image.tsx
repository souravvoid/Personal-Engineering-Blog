import { ImageResponse } from "next/og";

export const alt = "LORD VOID — Systems, examined carefully.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          padding: "64px 72px",
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
              fontSize: 26,
              letterSpacing: 9,
              fontWeight: 600,
            }}
          >
            LORD VOID
          </div>
          <div style={{ display: "flex", fontSize: 19, color: "#BDB8C0" }}>
            Independent technical publication
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Systems, examined carefully.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 24,
              color: "#BDB8C0",
            }}
          >
            Distributed systems · Backend · Databases · Operating systems ·
            Security
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{ display: "flex", width: 64, height: 2, backgroundColor: "#C2EF4E" }}
          />
          <div style={{ display: "flex", fontSize: 19, color: "#BDB8C0" }}>
            Long-form explanations of the machinery underneath software.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
