import React from "react";
import { useCurrentFrame, interpolate, spring, Img, Audio, Sequence } from "remotion";
import { WinnerBrawler } from "../props";
import { ParticleOverlay } from "./ParticleOverlay";

interface BestCharWinnerProps {
  winner: WinnerBrawler;
}

export const BestCharWinner: React.FC<BestCharWinnerProps> = ({ winner }) => {
  const frame = useCurrentFrame();

  // Exactly 7 images of Kenji displayed at equal ~9 frame intervals across the 64-frame climax
  const panelsCount = winner.winnerPanels.length || 1;
  const panelIndex = Math.min(panelsCount - 1, Math.floor(frame / 9));
  const activeImage = winner.winnerPanels[panelIndex] || winner.image;

  // Detect cut frame on every 9-frame panel switch for entrance flash & shake boost
  const isPanelSwitchFrame = frame > 0 && frame % 9 === 0 && frame <= 54;
  const panelSwitchFlash = isPanelSwitchFrame ? 0.6 : 0.0;

  // Climax entrance shockwave scale
  const scale = spring({
    frame: frame % 9,
    fps: 30,
    config: { damping: 10, stiffness: 220 },
  });

  // Camera shake at climax start & panel switches
  const isShaking = frame < 15 || isPanelSwitchFrame;
  const shakeX = isShaking ? (Math.random() - 0.5) * 14 : 0;
  const shakeY = isShaking ? (Math.random() - 0.5) * 14 : 0;

  // Flash white/gold burst on frame 0 & panel switches
  const flashOpacity = interpolate(frame, [0, 3, 9], [0.95, 0.4, 0.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) + panelSwitchFlash;

  // Winner text pop scale (Appears at frame 17 / reference F330)
  const textScale = spring({
    frame: Math.max(0, frame - 17),
    fps: 30,
    config: { damping: 11, stiffness: 230 },
  });

  // Moving Manga Speed Lines
  const bgPos = (frame * 20) % 100;

  // Voice lines configuration
  const voice1 = winner.voiceLines && winner.voiceLines.length > 0 ? winner.voiceLines[0] : null;
  const voice2 = winner.voiceLines && winner.voiceLines.length > 1 ? winner.voiceLines[1] : null;

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
      {/* Winner Voice Line 1 (Played at Reveal Start F2) */}
      {voice1 && (
        <Sequence from={2}>
          <Audio src={voice1} volume={1.0} />
        </Sequence>
      )}

      {/* Winner Voice Line 2 (Played after Gap at Climax Text Pop F32) */}
      {voice2 && (
        <Sequence from={32}>
          <Audio src={voice2} volume={1.0} />
        </Sequence>
      )}

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
          opacity: Math.min(1.0, flashOpacity),
          pointerEvents: "none",
          zIndex: 30,
        }}
      />

      {/* Winner 7-Panel Artwork Montage */}
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

      {/* Climax Announcement Text (e.g. "OFC IT'S KENJI 👑") at F17 / F330 */}
      {frame >= 17 && (
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
