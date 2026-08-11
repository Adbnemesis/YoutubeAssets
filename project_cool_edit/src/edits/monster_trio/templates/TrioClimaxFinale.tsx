import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TrioClimaxFinaleProps {
  titleText: string;
  accentColor: string;
  rapidPanels: string[];
  victoryStance: string;
}

export const TrioClimaxFinale: React.FC<TrioClimaxFinaleProps> = ({
  titleText,
  accentColor,
  rapidPanels,
  victoryStance,
}) => {
  const frame = useCurrentFrame(); // frame 0 is frame 395 (6.58s) in master timeline
  const { fps } = useVideoConfig();

  // 7 Panels spanning F395 (6.58s) to F525 (8.82s)
  // 6 sliding panels (16 frames each = 96 frames), plus 7th victory stance panel (frame 96 to 130)
  const panelDuration = 16;
  const rawIdx = Math.floor(frame / panelDuration);
  const panelIdx = Math.min(rapidPanels.length - 1, Math.max(0, rawIdx));
  const isVictoryStance = frame >= panelDuration * (rapidPanels.length - 1);

  const currentImage = isVictoryStance ? victoryStance : rapidPanels[panelIdx];

  // Alternating Slide Motion: Even indices (0, 2, 4) slide Left -> Right, Odd indices (1, 3, 5) slide Right -> Left
  const relativeFrame = frame % panelDuration;
  const isEvenPanel = panelIdx % 2 === 0;

  // Snappy spring slide transition
  const slideProgress = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 10, stiffness: 280 },
  });

  const initialOffsetX = isEvenPanel ? -100 : 100;
  const slideX = interpolate(slideProgress, [0, 1], [initialOffsetX, 0]);

  // Dynamic Text Entrance & Bounce on panel cuts
  const textBounce = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 8, stiffness: 300 },
  });

  // White flash burst cut on every panel entrance
  const showFlash = relativeFrame <= 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080c14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dynamic Golden Climax Sunburst Radial Aura */}
      <div
        style={{
          position: "absolute",
          width: "140%",
          height: "140%",
          background: `radial-gradient(circle, ${accentColor}77 0%, rgba(8,12,20,0.95) 75%)`,
          transform: `rotate(${frame * 0.9}deg)`,
        }}
      />

      {/* 7 Alternating Sliding Panels Container */}
      <div
        style={{
          width: "85%",
          height: "85%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${slideX}%)`,
        }}
      >
        <Img
          src={currentImage}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            filter: `drop-shadow(0 0 50px ${accentColor})`,
          }}
        />
      </div>

      {/* Climax Header Text Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          textAlign: "center",
          transform: `scale(${textBounce})`,
          zIndex: 50,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#fbbf24",
            margin: 0,
            letterSpacing: 3,
            textShadow: "0 0 40px #f59e0b, 0 0 80px #d97706, -4px 4px 0 #000",
            fontFamily: "Impact, Arial Black, sans-serif",
          }}
        >
          {titleText}
        </h1>
      </div>

      {/* Flash Cut Overlay on Panel Cuts */}
      {showFlash && (
        <AbsoluteFill
          style={{
            backgroundColor: "#ffffff",
            opacity: 0.9,
            zIndex: 60,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
