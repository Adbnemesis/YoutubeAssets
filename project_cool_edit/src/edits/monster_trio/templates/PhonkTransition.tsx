import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

interface PhonkTransitionProps {
  accentColor: string;
  children: React.ReactNode;
}

export const PhonkTransition: React.FC<PhonkTransitionProps> = ({ accentColor, children }) => {
  const frame = useCurrentFrame();

  // Chromatic Aberration (RGB Channel Separation) during first 3 frames of transition cut
  const isChromaActive = frame < 4;
  const chromaOffset = isChromaActive ? Math.max(0, 10 - frame * 2.5) : 0;

  // Flash burst cut during first 2 frames
  const flashOpacity = frame === 0 ? 0.9 : frame === 1 ? 0.45 : 0;

  // Motion blur on entrance frame (frame 0-2)
  const blurAmount = frame < 3 ? Math.max(0, 6 - frame * 2) : 0;

  return (
    <AbsoluteFill style={{ filter: blurAmount > 0 ? `blur(${blurAmount}px) contrast(1.2)` : undefined }}>
      {/* Base Component Content */}
      {children}

      {/* Chromatic Aberration (RGB Split) Overlay Layer */}
      {isChromaActive && chromaOffset > 0 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {/* Red Channel Shift */}
          <AbsoluteFill
            style={{
              transform: `translateX(-${chromaOffset}px)`,
              mixBlendMode: "screen",
              opacity: 0.7,
              filter: "drop-shadow(2px 0 0 #ff0055)",
            }}
          />
          {/* Cyan/Blue Channel Shift */}
          <AbsoluteFill
            style={{
              transform: `translateX(${chromaOffset}px)`,
              mixBlendMode: "screen",
              opacity: 0.7,
              filter: "drop-shadow(-2px 0 0 #00e5ff)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* White Flash Strobe Burst Cut */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#ffffff",
            opacity: flashOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Edge Action Vignette Pulse */}
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 100px rgba(0,0,0,0.85), inset 0 0 40px ${accentColor}44`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
