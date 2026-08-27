import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export interface ScreenFlashProps {
  startFrame: number;
  duration?: number;
  color?: string;
  maxOpacity?: number;
}

/**
 * Screen flash overlay for high impact placements and transitions.
 */
export const ScreenFlash: React.FC<ScreenFlashProps> = ({
  startFrame,
  duration = 4,
  color = "#FFFFFF",
  maxOpacity = 0.85,
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame >= duration) return null;

  const opacity = interpolate(
    relFrame,
    [0, 1, duration - 1],
    [0, maxOpacity, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity,
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
};
