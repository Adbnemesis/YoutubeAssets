import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../constants/theme";

interface CountdownTimerProps {
  startFrame: number;
  durationFrames: number;
  totalSeconds?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  startFrame,
  durationFrames,
  totalSeconds = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > startFrame + durationFrames) {
    return null;
  }

  const elapsed = frame - startFrame;
  const progress = Math.min(1, elapsed / durationFrames);
  const remainingSeconds = Math.max(0, Math.ceil(totalSeconds * (1 - progress)));

  // Progress Bar width
  const barWidth = 920 * (1 - progress);

  // Pulse animation on the last 2 seconds
  const isUrgent = remainingSeconds <= 2;
  const pulse = isUrgent ? Math.sin((frame / fps) * Math.PI * 8) * 0.1 + 1 : 1;

  const barColor = isUrgent
    ? THEME.colors.brand.rose
    : remainingSeconds <= 3
    ? THEME.colors.brand.amber
    : THEME.colors.brand.cyan;

  return (
    <div
      style={{
        width: "920px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "0 8px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "1px",
            color: THEME.colors.text.secondary,
            fontFamily: THEME.typography.fontDisplay,
          }}
        >
          THINKING TIME
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transform: `scale(${pulse})`,
          }}
        >
          <span
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: barColor,
              fontFamily: THEME.typography.fontDisplay,
            }}
          >
            0{remainingSeconds}s
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${barWidth}px`,
            height: "100%",
            backgroundColor: barColor,
            borderRadius: "9999px",
            boxShadow: `0 0 16px ${barColor}`,
            transition: "background-color 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};
