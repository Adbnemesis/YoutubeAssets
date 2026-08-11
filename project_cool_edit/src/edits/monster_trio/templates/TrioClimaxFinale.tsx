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
  const frame = useCurrentFrame(); // frame 0 is frame 444 in master timeline
  const { fps } = useVideoConfig();

  // 7 Panels rapidly cutting every ~11.5 frames: F444 to F525 (81 frames total)
  // Panel index from 0 to 6
  const panelDuration = 11.5;
  const rawIdx = Math.floor(frame / panelDuration);
  const panelIdx = Math.min(rapidPanels.length - 1, Math.max(0, rawIdx));
  const isVictoryStance = frame >= panelDuration * (rapidPanels.length - 1);

  const currentImage = isVictoryStance ? victoryStance : rapidPanels[panelIdx];

  // Alternating Slide Motion: Even indices slide Left -> Right, Odd indices slide Right -> Left
  const relativeFrame = frame % panelDuration;
  const isEvenPanel = panelIdx % 2 === 0;

  // Slide translation: -100% to 0% for even (Left -> Right), +100% to 0% for odd (Right -> Left)
  const slideX = interpolate(
    relativeFrame,
    [0, 3],
    [isEvenPanel ? -100 : 100, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Text Entrance spring
  const textSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 10, stiffness: 240 },
  });

  // White flash burst on panel transition cut
  const isFlashCut = relativeFrame <= 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080c14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Golden Climax Aura Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: "140%",
          height: "140%",
          background: `radial-gradient(circle, ${accentColor}66 0%, rgba(8,12,20,0.95) 75%)`,
          transform: `rotate(${frame * 0.8}deg)`,
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
            filter: `drop-shadow(0 0 45px ${accentColor})`,
          }}
        />
      </div>

      {/* Climax Header Text Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          textAlign: "center",
          transform: `scale(${textSpring})`,
          zIndex: 50,
        }}
      >
        <h1
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: "#fbbf24",
            margin: 0,
            letterSpacing: 3,
            textShadow: "0 0 35px #f59e0b, 0 0 70px #d97706, -4px 4px 0 #000",
            fontFamily: "sans-serif",
          }}
        >
          {titleText}
        </h1>
      </div>

      {/* Flash Cut Overlay on Panel Cuts */}
      {isFlashCut && (
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
