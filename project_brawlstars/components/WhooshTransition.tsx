import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export interface WhooshTransitionProps {
  startFrame: number;
  duration?: number;
  /** Peak vertical motion blur in px */
  maxBlur?: number;
  /** Direction: "down" wipes top-to-bottom */
  direction?: "down" | "up";
  /** Peak overlay opacity */
  maxFlash?: number;
  /** Overlay color — reference uses a red blur wipe into the grid */
  color?: string;
}

/**
 * Vertical motion-blur wipe used at scene changes — the reference's
 * signature transition (screen snaps through a colored blur).
 */
export const WhooshTransition: React.FC<WhooshTransitionProps> = ({
  startFrame,
  duration = 8,
  maxBlur = 28,
  direction = "down",
  maxFlash = 0.55,
  color = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const rel = frame - startFrame;
  if (rel < 0 || rel >= duration) return null;

  const half = duration / 2;
  const blur = interpolate(rel, [0, half, duration], [0, maxBlur, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dir = direction === "down" ? 1 : -1;
  const translateY = interpolate(rel, [0, half, duration], [0, dir * 180, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(rel, [0, 1, duration - 1], [0, maxFlash, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* Blur layer */}
      <AbsoluteFill
        style={{
          filter: `blur(${blur}px)`,
          transform: `translateY(${translateY}px)`,
          backgroundColor: color,
          opacity: opacity * 0.9,
          zIndex: 85,
          pointerEvents: "none",
        }}
      />
      {/* Flash layer */}
      <AbsoluteFill
        style={{
          backgroundColor: color,
          opacity,
          zIndex: 86,
          pointerEvents: "none",
        }}
      />
    </>
  );
};
