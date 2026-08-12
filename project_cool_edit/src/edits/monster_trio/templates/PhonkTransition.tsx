import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

type TransitionVariant = "blackFlash" | "exposureSpike" | "chroma" | "none";

interface PhonkTransitionProps {
  variant?: TransitionVariant;
  accentColor: string;
  children: React.ReactNode;
}

export const PhonkTransition: React.FC<PhonkTransitionProps> = ({
  variant = "chroma",
  accentColor,
  children,
}) => {
  const frame = useCurrentFrame();

  // Chromatic Aberration (RGB Channel Separation) during first 3 frames
  const isChromaActive = frame < 4 && variant === "chroma";
  const chromaOffset = isChromaActive ? Math.max(0, 10 - frame * 2.5) : 0;

  // Motion blur on entrance frame (frame 0-2)
  const blurAmount = frame < 3 ? Math.max(0, 6 - frame * 2) : 0;

  // Reference: black_flash at text-card cuts (F44, F171, F299) — card is pure black
  const blackFlashOpacity = variant === "blackFlash" && frame === 0 ? 1 : 0;

  // Reference: exposure_spike at spotlight/action cuts (F76, F204, F332) —
  // a brightness boost on the first frames so content stays visible
  const exposureBoost =
    variant === "exposureSpike" ? (frame === 0 ? 2.0 : frame === 1 ? 1.35 : 1) : 1;

  return (
    <AbsoluteFill
      style={{
        filter: [
          blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
          exposureBoost !== 1 ? `brightness(${exposureBoost}) contrast(1.15)` : undefined,
        ]
          .filter(Boolean)
          .join(" "),
      }}
    >
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

      {/* Black Flash Overlay (text card cuts) */}
      {blackFlashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#000000",
            opacity: blackFlashOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Edge Action Vignette Pulse */}
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 100px rgba(0,0,0,0.8), inset 0 0 40px ${accentColor}44`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
