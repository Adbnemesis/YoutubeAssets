import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../constants/theme";

interface HeaderHookProps {
  seriesTitle: string;
  hookQuestion: string;
  difficulty?: string;
  subHook?: string;
}

export const HeaderHook: React.FC<HeaderHookProps> = ({
  seriesTitle,
  hookQuestion,
  difficulty = "MEDIUM",
  subHook,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSlide = spring({
    frame,
    fps,
    config: THEME.springs.snappy,
  });

  const questionOpacity = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff.toUpperCase()) {
      case "EASY":
      case "JUNIOR":
        return THEME.colors.brand.emerald;
      case "HARD":
      case "STAFF":
      case "INTERVIEW TRAP":
        return THEME.colors.brand.rose;
      default:
        return THEME.colors.brand.amber;
    }
  };

  return (
    <div
      style={{
        width: "920px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "14px",
      }}
    >
      {/* Top Meta Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          transform: `translateY(${(1 - titleSlide) * -30}px)`,
          opacity: titleSlide,
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontWeight: 800,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: THEME.colors.brand.cyan,
            backgroundColor: "rgba(6, 182, 212, 0.12)",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            padding: "6px 18px",
            borderRadius: "9999px",
            fontFamily: THEME.typography.fontDisplay,
          }}
        >
          {seriesTitle}
        </span>

        {difficulty && (
          <span
            style={{
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: getDifficultyColor(difficulty),
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${getDifficultyColor(difficulty)}55`,
              padding: "6px 14px",
              borderRadius: "9999px",
              fontFamily: THEME.typography.fontDisplay,
            }}
          >
            {difficulty}
          </span>
        )}
      </div>

      {/* Main Hook Question */}
      <h1
        style={{
          margin: 0,
          fontSize: "44px",
          fontWeight: 800,
          lineHeight: "1.2",
          color: THEME.colors.text.primary,
          fontFamily: THEME.typography.fontDisplay,
          opacity: questionOpacity,
          letterSpacing: "-0.5px",
          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
        }}
      >
        {hookQuestion}
      </h1>

      {subHook && (
        <p
          style={{
            margin: 0,
            fontSize: "22px",
            color: THEME.colors.text.secondary,
            fontFamily: THEME.typography.fontBody,
            opacity: questionOpacity,
          }}
        >
          {subHook}
        </p>
      )}
    </div>
  );
};
