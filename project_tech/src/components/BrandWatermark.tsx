import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../constants/theme";

interface BrandWatermarkProps {
  brandTag?: string;
  ctaText?: string;
}

export const BrandWatermark: React.FC<BrandWatermarkProps> = ({
  brandTag = "@codemind.dev",
  ctaText = "Save for your next tech interview 📌",
}) => {
  const frame = useCurrentFrame();

  // Wave bar animation
  const bars = [0.8, 1.4, 0.6, 1.1, 0.9];

  return (
    <div
      style={{
        width: "920px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "18px",
      }}
    >
      {/* Dynamic CTA pill */}
      <div
        style={{
          padding: "12px 28px",
          borderRadius: "9999px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(10px)",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: THEME.colors.text.primary,
            fontFamily: THEME.typography.fontBody,
            letterSpacing: "0.5px",
          }}
        >
          {ctaText}
        </span>
      </div>

      {/* Brand & Soundwave */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "24px" }}>
          {bars.map((heightMult, idx) => {
            const dynamicScale = Math.sin((frame / 10) + idx * 1.2) * 0.4 + 0.6;
            return (
              <div
                key={idx}
                style={{
                  width: "4px",
                  height: `${18 * heightMult * dynamicScale}px`,
                  backgroundColor: THEME.colors.brand.cyan,
                  borderRadius: "2px",
                  opacity: 0.8,
                }}
              />
            );
          })}
        </div>

        <span
          style={{
            fontSize: "18px",
            fontWeight: 800,
            letterSpacing: "2px",
            color: THEME.colors.text.muted,
            fontFamily: THEME.typography.fontDisplay,
            textTransform: "lowercase",
          }}
        >
          {brandTag}
        </span>
      </div>
    </div>
  );
};
