import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export interface MotionBlurTransitionProps {
  /** Frame when the transition starts */
  startFrame: number;
  /** Duration in frames (default: 6) */
  duration?: number;
  /** Blur intensity in pixels (default: 20) */
  maxBlur?: number;
  /** Vertical shift distance in pixels (default: 120) */
  maxTranslateY?: number;
}

/**
 * Screen transition with vertical motion blur effect.
 * Apply on scene changes for fast, energetic wipes.
 */
export const MotionBlurTransition: React.FC<MotionBlurTransitionProps> = ({
  startFrame,
  duration = 6,
  maxBlur = 20,
  maxTranslateY = 120,
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame >= duration) return null;

  const half = duration / 2;

  // Blur ramps up then down
  const blur = interpolate(
    relFrame,
    [0, half, duration],
    [0, maxBlur, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Translate shifts top to bottom or vice versa
  const translateY = interpolate(
    relFrame,
    [0, half, duration],
    [0, -maxTranslateY, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = interpolate(
    relFrame,
    [0, half, duration],
    [0, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translateY(${translateY}px)`,
        pointerEvents: "none",
        zIndex: 80,
      }}
    />
  );
};
