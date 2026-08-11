import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TrioIntroHookProps {
  logoText: string;
  watermarkText: string;
}

export const TrioIntroHook: React.FC<TrioIntroHookProps> = ({ logoText, watermarkText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom punch at frame 1-17 matching monster_trio.mp4
  const scale = interpolate(frame, [0, 9, 17], [1.0, 1.11, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera shake intensity at first 10 frames
  const shakeX = frame < 10 ? (Math.sin(frame * 3.5) * 12) : 0;
  const shakeY = frame < 10 ? (Math.cos(frame * 3.5) * 10) : 0;

  // Text entrance spring at frame 15
  const textSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080c14",
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Sunburst background aura */}
      <div
        style={{
          position: "absolute",
          width: "140%",
          height: "140%",
          background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(8,12,20,0.95) 75%)",
          transform: `rotate(${frame * 0.6}deg)`,
        }}
      />

      {/* Speed lines grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 12px)",
        }}
      />

      {/* Main Title Text "KAGE" */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          transform: `scale(${textSpring})`,
        }}
      >
        <h1
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            letterSpacing: 6,
            textShadow: "0 0 35px #a855f7, 0 0 70px #8b5cf6, -4px 4px 0 #000",
            fontFamily: "sans-serif",
          }}
        >
          {logoText}
        </h1>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#fbbf24",
            margin: "16px 0 0 0",
            letterSpacing: 3,
            textShadow: "0 0 20px #f59e0b, -2px 2px 0 #000",
            fontFamily: "sans-serif",
          }}
        >
          {watermarkText}
        </h2>
      </div>
    </AbsoluteFill>
  );
};
