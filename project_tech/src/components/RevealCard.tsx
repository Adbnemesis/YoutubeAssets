import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../constants/theme";

interface RevealCardProps {
  revealFrame: number;
  heading: string;
  points: string[];
  complexityTime?: string;
  complexitySpace?: string;
  isCorrectBadge?: string;
}

export const RevealCard: React.FC<RevealCardProps> = ({
  revealFrame,
  heading,
  points,
  complexityTime,
  complexitySpace,
  isCorrectBadge,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < revealFrame) return null;

  const currentFrame = frame - revealFrame;

  const cardScale = spring({
    frame: currentFrame,
    fps,
    config: THEME.springs.bouncy,
  });

  return (
    <div
      style={{
        transform: `scale(${cardScale})`,
        width: "920px",
        backgroundColor: THEME.colors.bg.surface,
        backdropFilter: "blur(20px)",
        border: `2px solid ${THEME.colors.brand.emerald}`,
        borderRadius: "24px",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 50px rgba(16, 185, 129, 0.2)",
      }}
    >
      {/* Card Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: THEME.colors.brand.emerald,
              boxShadow: `0 0 12px ${THEME.colors.brand.emeraldGlow}`,
            }}
          />
          <span
            style={{
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "1px",
              color: THEME.colors.brand.emeraldGlow,
              fontFamily: THEME.typography.fontDisplay,
            }}
          >
            {isCorrectBadge || "EXPLANATION & WHY"}
          </span>
        </div>

        {/* Complexity tags */}
        {(complexityTime || complexitySpace) && (
          <div style={{ display: "flex", gap: "10px" }}>
            {complexityTime && (
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: THEME.colors.brand.amber,
                  fontFamily: THEME.typography.fontCode,
                }}
              >
                Time: {complexityTime}
              </span>
            )}
            {complexitySpace && (
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: THEME.colors.brand.cyan,
                  fontFamily: THEME.typography.fontCode,
                }}
              >
                Space: {complexitySpace}
              </span>
            )}
          </div>
        )}
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "28px",
          fontWeight: 800,
          color: THEME.colors.text.primary,
          fontFamily: THEME.typography.fontDisplay,
          lineHeight: "1.3",
        }}
      >
        {heading}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {points.map((pt, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ color: THEME.colors.brand.emerald, fontSize: "20px", lineHeight: "1.4" }}>✦</span>
            <p
              style={{
                margin: 0,
                fontSize: "20px",
                lineHeight: "1.45",
                color: THEME.colors.text.secondary,
                fontFamily: THEME.typography.fontBody,
              }}
            >
              {pt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
