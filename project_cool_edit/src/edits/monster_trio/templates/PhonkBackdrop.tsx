import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";

interface PhonkBackdropProps {
  backgroundImage: string;
  accentColor: string;
  boost?: number;
  kenBurns?: boolean;
  children?: React.ReactNode;
}

export const PhonkBackdrop: React.FC<PhonkBackdropProps> = ({
  backgroundImage,
  accentColor,
  boost = 1.35,
  kenBurns = true,
  children,
}) => {
  const frame = useCurrentFrame();

  // Slow ken-burns drift so the static artwork feels alive
  const kbScale = kenBurns ? 1.12 + Math.sin(frame * 0.02) * 0.02 : 1;
  const kbX = kenBurns ? Math.sin(frame * 0.013) * 2 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0d16", overflow: "hidden" }}>
      {/* Background Artwork (full-bleed cover) */}
      <div
        style={{
          position: "absolute",
          inset: "-6%",
          transform: `translateX(${kbX}%) scale(${kbScale})`,
        }}
      >
        <Img
          src={backgroundImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `brightness(${boost}) contrast(1.15) saturate(1.2)`,
          }}
        />
      </div>

      {/* Accent tint to unify with brawler color */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 42%, ${accentColor}40 0%, transparent 62%), linear-gradient(${accentColor}22, transparent 55%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Center dim behind character for contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 60%, transparent 85%)",
        }}
      />

      {/* Edge vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 140px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.5)",
        }}
      />

      {/* Content layer */}
      <AbsoluteFill style={{ position: "relative", zIndex: 2 }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
