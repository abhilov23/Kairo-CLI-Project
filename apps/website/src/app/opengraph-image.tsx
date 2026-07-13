import { ImageResponse } from "next/og";

export const alt = "Kairo — Your AI teammate in the terminal";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: 1200,
          height: 630,
          background: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Violet glow - top right */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Violet glow - bottom left */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 80px",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Logo + Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {/* Logo box */}
            <div
              style={{
                display: "flex",
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#fafafa",
                color: "#0a0a0a",
                fontSize: 22,
                fontWeight: 800,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              K
            </div>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: "-0.5px",
              }}
            >
              Kairo
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              color: "#fafafa",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              maxWidth: 800,
            }}
          >
            Your AI teammate
            <br />
            in the terminal.
          </div>

          {/* Description */}
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.5,
              marginTop: 20,
              maxWidth: 600,
            }}
          >
            Code review, debugging, and architecture — powered by AI, right in
            your CLI. No tabs. No context switching.
          </div>

          {/* Command bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 40,
              padding: "14px 24px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                fontFamily: "monospace",
                color: "#fafafa",
              }}
            >
              npm install -g kairo-cli
            </span>
            <span
              style={{
                display: "flex",
                width: 8,
                height: 20,
                background: "#a78bfa",
                opacity: 0.8,
              }}
            />
          </div>

          {/* Bottom badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "6px 14px",
                borderRadius: 20,
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.2)",
                fontSize: 13,
                fontWeight: 600,
                color: "#a78bfa",
              }}
            >
              MIT Licensed
            </div>
            <div
              style={{
                display: "flex",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              kairo.dev
            </span>
          </div>
        </div>

        {/* Terminal decoration - right side */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 60,
            top: 175,
            padding: "20px 24px",
            borderRadius: 12,
            background: "rgba(13,17,23,0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            fontFamily: "monospace",
            fontSize: 12,
            lineHeight: 1.8,
            minWidth: 280,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <div style={{ display: "flex" }}>
              <span style={{ color: "rgba(255,255,255,0.3)", marginRight: 8 }}>$</span>
              <span style={{ color: "#fafafa" }}>kairo review src/auth.ts</span>
            </div>
            <div style={{ display: "flex", color: "rgba(52,211,153,0.7)" }}>
              Analyzing src/auth.ts...
            </div>
            <div style={{ display: "flex", color: "rgba(52,211,153,0.7)" }}>
              Found 3 issues
            </div>
            <div style={{ display: "flex", color: "rgba(255,255,255,0.4)" }}>
              <span style={{ marginRight: 8 }}>→</span>
              <span style={{ color: "#a78bfa" }}>kairo fix</span>
              <span style={{ marginLeft: 4 }}>to apply changes</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
