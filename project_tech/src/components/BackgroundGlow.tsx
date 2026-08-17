import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../constants/theme";

export const BackgroundGlow: React.FC = () => {
  const frame = useCurrentFrame();

  const orb1Y = interpolate(frame, [0, 300], [200, 350], {
    extrapolateRight: "clamp",
  });
  const orb2X = interpolate(frame, [0, 300], [700, 500], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "1080px",
        height: "1920px",
        backgroundColor: THEME.colors.bg.primary,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Subtle Grid Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient Neon Blobs */}
      <div
        style={{
          position: "absolute",
          top: `${orb1Y}px`,
          left: "100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          backgroundColor: THEME.colors.brand.cyan,
          filter: "blur(140px)",
          opacity: 0.15,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "1100px",
          left: `${orb2X}px`,
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          backgroundColor: THEME.colors.brand.purple,
          filter: "blur(160px)",
          opacity: 0.12,
        }}
      />
    </div>
  );
};
