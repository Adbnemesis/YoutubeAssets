import React from "react";
import { useCurrentFrame, interpolate, spring, Img } from "remotion";
import { WinnerBrawler } from "../props";

interface BestCharWinnerProps {
  winner: WinnerBrawler;
}

export const BestCharWinner: React.FC<BestCharWinnerProps> = ({ winner }) => {
  const frame = useCurrentFrame();

  // Rapid Multi-Image Panel Cycle Index (Switch panel every 2-3 frames during entrance F0 -> F18)
  const isRapidMontagePhase = frame < 18;
  const panelIndex = Math.floor(frame / 2.5) % (winner.winnerPanels.length || 1);
  const activeImage = isRapidMontagePhase && winner.winnerPanels.length > 0
    ? winner.winnerPanels[panelIndex]
    : winner.image;

  // Climax entrance shockwave scale
  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 10, stiffness: 190 },
  });

  // Sustained high-intensity camera shake at climax transition (F0 -> F20)
  const shakeX = frame < 20 ? (Math.random() - 0.5) * (24 - frame) * 2.5 : 0;
  const shakeY = frame < 20 ? (Math.random() - 0.5) * (24 - frame) * 2.5 : 0;

  // Flash white/gold burst on frame 0 & frame 18 text entrance
  const flashOpacity = interpolate(frame, [0, 3, 10, 17, 19, 25], [0.95, 0.4, 0.0, 0.8, 0.3, 0.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Winner text pop scale (Appears at frame 17 / reference F330)
  const textScale = spring({
    frame: Math.max(0, frame - 17),
    fps: 30,
    config: { damping: 12, stiffness: 220 },
  });

  // Moving Manga Speed Lines
  const bgPos = (frame * 18) % 100;

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#050505",
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
          width: 950,
          height: 950,
          borderRadius: "50%",
          background: "radial-gradient(circle, #f59e0b 0%, #d97706 45%, transparent 78%)",
          opacity: 0.6,
          filter: "blur(75px)",
        }}
      />

      {/* Moving Speed Lines backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(245, 158, 11, 0.1) 0px, rgba(245, 158, 11, 0.1) 4px, transparent 4px, transparent 18px)",
          backgroundPosition: `${bgPos}px ${bgPos}px`,
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

      {/* Winner Rapid Panel Artwork Montage */}
      <div
        style={{
          width: "92%",
          height: "66%",
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
            filter: "drop-shadow(0 30px 60px rgba(245, 158, 11, 0.9))",
          }}
        />
      </div>

      {/* Climax Announcement Text (e.g. "OFC IT'S KENJI 👑") at F17 / F330 */}
      {frame >= 16 && (
        <div
          style={{
            position: "absolute",
            bottom: 110,
            zIndex: 20,
            textAlign: "center",
            padding: "0 20px",
            transform: `scale(${textScale})`,
          }}
        >
          <h1
            style={{
              fontFamily: "'Outfit', 'Impact', sans-serif",
              fontSize: 72,
              fontWeight: 900,
              color: "#fbbf24",
              textTransform: "uppercase",
              letterSpacing: 3,
              textShadow: "0 0 30px #f59e0b, 0 0 60px #d97706, 0 0 90px #78350f",
              WebkitTextStroke: "3px #000000",
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
