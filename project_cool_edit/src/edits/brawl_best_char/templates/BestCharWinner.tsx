import React from "react";
import { useCurrentFrame, interpolate, spring, Img } from "remotion";
import { WinnerBrawler } from "../props";

interface BestCharWinnerProps {
  winner: WinnerBrawler;
}

export const BestCharWinner: React.FC<BestCharWinnerProps> = ({ winner }) => {
  const frame = useCurrentFrame();

  // Climax entrance shockwave scale
  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 10, stiffness: 180 },
  });

  // Sustained high-intensity camera shake at climax transition
  const shakeX = frame < 15 ? (Math.random() - 0.5) * (20 - frame) * 2 : 0;
  const shakeY = frame < 15 ? (Math.random() - 0.5) * (20 - frame) * 2 : 0;

  // Flash white/gold burst on frame 0
  const flashOpacity = interpolate(frame, [0, 4, 12], [0.9, 0.4, 0.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#050608",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Intense Gold Climax Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, #f59e0b 0%, #d97706 40%, transparent 75%)",
          opacity: 0.5,
          filter: "blur(70px)",
        }}
      />

      {/* Climax Flash Burst */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          opacity: flashOpacity,
          pointerEvents: "none",
          zIndex: 30,
        }}
      />

      {/* Winner Artwork */}
      <div
        style={{
          width: "90%",
          height: "65%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale})`,
          position: "relative",
          zIndex: 5,
        }}
      >
        <Img
          src={winner.image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 25px 50px rgba(245, 158, 11, 0.8))",
          }}
        />
      </div>

      {/* Climax Announcement Text (e.g. "OFC IT'S KENJI 👑") */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          zIndex: 20,
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Outfit', 'Impact', sans-serif",
            fontSize: 68,
            fontWeight: 900,
            color: "#fbbf24",
            textTransform: "uppercase",
            letterSpacing: 3,
            textShadow: "0 0 25px #f59e0b, 0 0 50px #d97706, 0 0 75px #78350f",
            WebkitTextStroke: "2px #000000",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {winner.announcementText}
        </h1>
      </div>
    </div>
  );
};
