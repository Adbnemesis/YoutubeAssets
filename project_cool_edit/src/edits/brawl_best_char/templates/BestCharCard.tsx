import React from "react";
import { useCurrentFrame, interpolate, spring, Img } from "remotion";
import { BrawlerContender } from "../props";

interface BestCharCardProps {
  contender: BrawlerContender;
}

export const BestCharCard: React.FC<BestCharCardProps> = ({ contender }) => {
  const frame = useCurrentFrame();

  // Local frame count from start of this card
  const cardDuration = contender.endFrame - contender.startFrame;

  // Scale spring entry
  const scale = interpolate(frame, [0, 5, cardDuration], [0.92, 1.05, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text pop spring animation
  const textScale = spring({
    frame: Math.max(0, frame - 5),
    fps: 30,
    config: { damping: 12, stiffness: 200 },
  });

  // Camera shake calculation for impact hit
  const shakeX = frame < 8 ? Math.sin(frame * 2.5) * (8 - frame) * 3 : 0;
  const shakeY = frame < 8 ? Math.cos(frame * 2.5) * (8 - frame) * 3 : 0;

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#07090e",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Dynamic Accent Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${contender.accentColor} 0%, transparent 70%)`,
          opacity: 0.35,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
        }}
      />

      {/* Manga Speed Lines Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 12px)",
        }}
      />

      {/* Main Character Artwork Container */}
      <div
        style={{
          width: "85%",
          height: "60%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale})`,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Img
          src={contender.image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: `drop-shadow(0 20px 40px ${contender.accentColor}aa)`,
          }}
        />
      </div>

      {/* Question Text Pop Header (e.g. "MORTIS?") */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          zIndex: 10,
          transform: `scale(${textScale})`,
        }}
      >
        <h2
          style={{
            fontFamily: "'Outfit', 'Impact', sans-serif",
            fontSize: 76,
            fontWeight: 900,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: 4,
            textShadow: `0 0 20px ${contender.accentColor}, 0 0 40px ${contender.accentColor}`,
            WebkitTextStroke: "2px #000000",
            margin: 0,
          }}
        >
          {contender.questionText}
        </h2>
      </div>
    </div>
  );
};
