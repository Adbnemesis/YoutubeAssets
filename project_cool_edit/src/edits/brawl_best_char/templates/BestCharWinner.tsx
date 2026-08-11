import React from "react";
import { useCurrentFrame, interpolate, spring, Img } from "remotion";
import { WinnerBrawler } from "../props";
import { ParticleOverlay } from "./ParticleOverlay";

interface BestCharWinnerProps {
  winner: WinnerBrawler;
}

export const BestCharWinner: React.FC<BestCharWinnerProps> = ({ winner }) => {
  const frame = useCurrentFrame();

  // Rapid Multi-Image Panel Cycle Index (Switch panel image every 1-2 frames during entrance F0 -> F20)
  const isRapidMontagePhase = frame < 20;
  const panelIndex = Math.floor(frame / 1.5) % (winner.winnerPanels.length || 1);
  const activeImage = isRapidMontagePhase && winner.winnerPanels.length > 0
    ? winner.winnerPanels[panelIndex]
    : winner.image;

  // Climax entrance shockwave scale
  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 9, stiffness: 200 },
  });

  // Sustained high-intensity camera shake at climax transition (F0 -> F22)
  const shakeX = frame < 22 ? (Math.random() - 0.5) * (26 - frame) * 2.8 : 0;
  const shakeY = frame < 22 ? (Math.random() - 0.5) * (26 - frame) * 2.8 : 0;

  // Flash white/gold burst on frame 0 & frame 20 text entrance
  const flashOpacity = interpolate(frame, [0, 4, 12, 19, 21, 28], [0.95, 0.4, 0.0, 0.9, 0.3, 0.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Winner text pop scale (Appears at frame 19 / reference F332)
  const textScale = spring({
    frame: Math.max(0, frame - 19),
    fps: 30,
    config: { damping: 11, stiffness: 230 },
  });

  // Moving Manga Speed Lines
  const bgPos = (frame * 20) % 100;

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#030407",
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
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          background: "radial-gradient(circle, #f59e0b 0%, #d97706 45%, transparent 78%)",
          opacity: 0.65,
          filter: "blur(80px)",
        }}
      />

      {/* Moving Speed Lines backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(245, 158, 11, 0.12) 0px, rgba(245, 158, 11, 0.12) 4px, transparent 4px, transparent 18px)",
          backgroundPosition: `${bgPos}px ${bgPos}px`,
        }}
      />

      {/* Gold Particles */}
      <ParticleOverlay color="#f59e0b" count={30} />

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

      {/* Winner Rapid Panel Artwork Montage */}
      <div
        style={{
          width: "94%",
          height: "68%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale})`,
          position: "relative",
          zIndex: 5,
        }}
      >
        <Img
          key={activeImage}
          src={activeImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 30px 60px rgba(245, 158, 11, 1.0))",
          }}
        />
      </div>

      {/* Climax Announcement Text (e.g. "OFC IT'S KENJI 👑") at F19 / F332 */}
      {frame >= 18 && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            zIndex: 20,
            textAlign: "center",
            padding: "0 20px",
            transform: `scale(${textScale})`,
          }}
        >
          <h1
            style={{
              fontFamily: "'Outfit', 'Impact', sans-serif",
              fontSize: 76,
              fontWeight: 900,
              color: "#fbbf24",
              textTransform: "uppercase",
              letterSpacing: 4,
              textShadow: "0 0 30px #f59e0b, 0 0 60px #d97706, 0 0 90px #78350f, 0 0 120px #000000",
              WebkitTextStroke: "3.5px #000000",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {winner.announcementText}
          </h1>
        </div>
      )}
    </div>
  );
};
