import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Praisegrid | Local Business Review Management";
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #0f172a, #1e1b4b)",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "linear-gradient(to bottom right, #3b82f6, #7c3aed)",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 76,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          Praisegrid
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 32,
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          Reputation management, automated
        </div>
      </div>
    ),
    size
  );
}
