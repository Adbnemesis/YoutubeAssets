import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const FlashTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The flash is a solid white overlay that fades out quickly over 6 frames
  const opacity = interpolate(
    frame,
    [0, 6],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})`, zIndex: 100 }} />
  );
};
