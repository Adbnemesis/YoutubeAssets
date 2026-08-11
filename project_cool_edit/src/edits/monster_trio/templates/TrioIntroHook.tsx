import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TrioIntroHookProps {
  titleText: string;
  subText: string;
}

export const TrioIntroHook: React.FC<TrioIntroHookProps> = ({ titleText, subText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom punch at frame 1-9
  const scale = interpolate(frame, [0, 9, 17], [1.0, 1.11, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera shake intensity at frame 1-10
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
          background: "radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(8,12,20,0.95) 75%)",
          transform: `rotate(${frame * 0.5}deg)`,
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

      {/* Main Title Text */}
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
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            letterSpacing: 4,
            textShadow: "0 0 25px #a855f7, 0 0 50px #8b5cf6, -3px 3px 0 #000",
            fontFamily: "sans-serif",
          }}
        >
          {titleText}
        </h1>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#fbbf24",
            margin: "12px 0 0 0",
            letterSpacing: 2,
            textShadow: "0 0 15px #f59e0b, -2px 2px 0 #000",
            fontFamily: "sans-serif",
          }}
        >
          {subText}
        </h2>
      </div>
    </AbsoluteFill>
  );
};
