import React from "react";
import { useCurrentFrame, interpolate, spring, Img } from "remotion";
import { BrawlerContender } from "../props";

interface BestCharCardProps {
  contender: BrawlerContender;
}

export const BestCharCard: React.FC<BestCharCardProps> = ({ contender }) => {
  const frame = useCurrentFrame();
  const cardDuration = contender.endFrame - contender.startFrame;

  // 1. Entrance White/RGB Flash (Frames 0-3)
  const flashOpacity = interpolate(frame, [0, 2, 6], [0.85, 0.4, 0.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Animated Speed Lines Position
  const bgPos = (frame * 12) % 100;

  // 3. Pulsating Radial Light Glow Scale
  const auraScale = 1.0 + Math.sin(frame * 0.25) * 0.08;

  // 4. Subtle Floating Artwork Motion
  const floatY = Math.sin(frame * 0.18) * 12;

  // 5. Scale Zoom & Spring Entry
  const scale = interpolate(frame, [0, 5, cardDuration], [0.92, 1.06, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 6. Text Pop Spring Animation
  const textScale = spring({
    frame: Math.max(0, frame - 3),
    fps: 30,
    config: { damping: 11, stiffness: 220 },
  });

  // 7. Impact Camera Shake (Frames 0-7)
  const shakeX = frame < 8 ? Math.sin(frame * 2.8) * (8 - frame) * 3.5 : 0;
  const shakeY = frame < 8 ? Math.cos(frame * 2.8) * (8 - frame) * 3.5 : 0;

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#05070c",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Dynamic Animated Accent Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: 850,
          height: 850,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${contender.accentColor} 0%, transparent 70%)`,
          opacity: 0.45,
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${auraScale})`,
          filter: "blur(65px)",
        }}
      />

      {/* Moving Manga Speed Lines Background Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 3px, transparent 3px, transparent 16px)",
          backgroundPosition: `${bgPos}px ${bgPos}px`,
        }}
      />

      {/* Entrance Flash Burst */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          opacity: flashOpacity,
          pointerEvents: "none",
          zIndex: 25,
        }}
      />

      {/* Main Character Artwork Container with Float Motion */}
      <div
        style={{
          width: "88%",
          height: "62%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale}) translateY(${floatY}px)`,
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
            filter: `drop-shadow(0 25px 50px ${contender.accentColor}dd)`,
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
            fontSize: 82,
            fontWeight: 900,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: 4,
            textShadow: `0 0 25px ${contender.accentColor}, 0 0 50px ${contender.accentColor}, 0 0 75px #000000`,
            WebkitTextStroke: "3px #000000",
            margin: 0,
          }}
        >
          {contender.questionText}
        </h2>
      </div>
    </div>
  );
};
