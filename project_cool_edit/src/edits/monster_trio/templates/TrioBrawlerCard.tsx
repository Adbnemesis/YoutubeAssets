import React from "react";
import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrawlerCardProps } from "../props";

export const TrioBrawlerCard: React.FC<{ brawler: BrawlerCardProps; startFrame?: number }> = ({
  brawler,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring scale
  const scale = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 14, stiffness: 220 },
  });

  // Micro camera shake on entrance
  const shakeX = frame < 8 ? (Math.sin(frame * 4) * 8) : 0;
  const shakeY = frame < 8 ? (Math.cos(frame * 4) * 6) : 0;

  // Flash burst overlay on first 2 frames
  const showFlash = frame <= 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#090d16",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dynamic Background Radial Aura */}
      <div
        style={{
          position: "absolute",
          width: "120%",
          height: "120%",
          background: `radial-gradient(circle, ${brawler.accentColor}55 0%, rgba(9,13,22,0.95) 70%)`,
        }}
      />

      {/* Brawler Character Artwork */}
      <div
        style={{
          transform: `scale(${scale})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "80%",
          height: "80%",
        }}
      >
        <Img
          src={brawler.image}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            filter: `drop-shadow(0 0 35px ${brawler.accentColor})`,
          }}
        />
      </div>

      {/* Text Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            letterSpacing: 4,
            textShadow: `0 0 30px ${brawler.accentColor}, -4px 4px 0 #000`,
            fontFamily: "sans-serif",
          }}
        >
          {brawler.text}
        </h2>
      </div>

      {/* Flash Burst Cut Overlay */}
      {showFlash && (
        <AbsoluteFill
          style={{
            backgroundColor: "#ffffff",
            opacity: 0.85,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
