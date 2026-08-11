import React from "react";
import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from "remotion";

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
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // F225 to F335: Climax Title Entrance & Impact Shake
  const isPhase3 = frame >= 225 && frame < 335;
  
  // F335+: Rapid 15-frame multi-panel cut sequence
  const isRapidPhase = frame >= 335 && frame < 444;
  const rapidIdx = isRapidPhase ? Math.min(rapidPanels.length - 1, Math.floor((frame - 335) / 15)) : 0;

  // F444+: Final Victory Stance
  const isVictoryStance = frame >= 444;

  // Impact Shake at F225-F250
  const shakeX = frame >= 225 && frame < 255 ? (Math.sin(frame * 4.5) * 14) : 0;
  const shakeY = frame >= 225 && frame < 255 ? (Math.cos(frame * 4.5) * 12) : 0;

  // Text Entrance at F270
  const textSpring = spring({
    frame: Math.max(0, frame - 270),
    fps,
    config: { damping: 10, stiffness: 240 },
  });

  // Flash cut burst on every 15-frame cut transition
  const isFlashCut = isRapidPhase && (frame - 335) % 15 <= 2;

  const currentImage = isVictoryStance
    ? victoryStance
    : isRapidPhase
    ? rapidPanels[rapidIdx]
    : rapidPanels[0];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080c14",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Golden Climax Aura Background */}
      <div
        style={{
          position: "absolute",
          width: "140%",
          height: "140%",
          background: `radial-gradient(circle, ${accentColor}66 0%, rgba(8,12,20,0.95) 75%)`,
          transform: `rotate(${frame * 0.8}deg)`,
        }}
      />

      {/* Main Image Display */}
      <div
        style={{
          width: "85%",
          height: "85%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={currentImage}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            filter: `drop-shadow(0 0 40px ${accentColor})`,
          }}
        />
      </div>

      {/* Climax Text Overlay (F270+) */}
      {frame >= 270 && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            textAlign: "center",
            transform: `scale(${textSpring})`,
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
      )}

      {/* Flash Cut Overlay on 15-frame Rapid Cuts */}
      {isFlashCut && (
        <AbsoluteFill
          style={{
            backgroundColor: "#ffffff",
            opacity: 0.9,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
