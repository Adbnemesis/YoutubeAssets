import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrawlerCardProps } from "../props";

interface TrioBrawlerCardProps {
  brawler: BrawlerCardProps;
  mode: "image_shake" | "text_card" | "action_pose";
}

export const TrioBrawlerCard: React.FC<TrioBrawlerCardProps> = ({ brawler, mode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mode 1: Image Shake (Camera Shake + Zoom Punch)
  if (mode === "image_shake") {
    const scale = interpolate(frame, [0, 9, 20], [1.0, 1.12, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const shakeX = frame < 12 ? Math.sin(frame * 3.8) * 14 : 0;
    const shakeY = frame < 12 ? Math.cos(frame * 3.8) * 10 : 0;

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#090d16",
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Sunburst & Radial Aura */}
        <div
          style={{
            position: "absolute",
            width: "130%",
            height: "130%",
            background: `radial-gradient(circle, ${brawler.accentColor}66 0%, rgba(9,13,22,0.95) 75%)`,
            transform: `rotate(${frame * 0.5}deg)`,
          }}
        />

        {/* Character Artwork 1 */}
        <div style={{ width: "80%", height: "80%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img
            src={brawler.image}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              filter: `drop-shadow(0 0 40px ${brawler.accentColor})`,
            }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  // Mode 2: Text Card Pop
  if (mode === "text_card") {
    const textSpring = spring({
      frame,
      fps,
      config: { damping: 11, stiffness: 220 },
    });
    const showFlash = frame <= 2;

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#090d16",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background Radial Aura */}
        <div
          style={{
            position: "absolute",
            width: "120%",
            height: "120%",
            background: `radial-gradient(circle, ${brawler.accentColor}55 0%, rgba(9,13,22,0.95) 70%)`,
          }}
        />

        {/* Character Artwork 1 Background */}
        <div style={{ width: "80%", height: "80%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.75 }}>
          <Img
            src={brawler.image}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              filter: `drop-shadow(0 0 30px ${brawler.accentColor})`,
            }}
          />
        </div>

        {/* Text Pop Header */}
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            transform: `scale(${textSpring})`,
            zIndex: 20,
          }}
        >
          <h1
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: "#ffffff",
              margin: 0,
              letterSpacing: 4,
              textShadow: `0 0 35px ${brawler.accentColor}, 0 0 70px ${brawler.accentColor}, -4px 4px 0 #000`,
              fontFamily: "sans-serif",
            }}
          >
            {brawler.text}
          </h1>
        </div>

        {/* White Flash Burst on Cut */}
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
  }

  // Mode 3: Action Pose 2
  const showFlash = frame <= 2;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#090d16",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dynamic Background Aura */}
      <div
        style={{
          position: "absolute",
          width: "120%",
          height: "120%",
          background: `radial-gradient(circle, ${brawler.accentColor}55 0%, rgba(9,13,22,0.95) 70%)`,
        }}
      />

      {/* Character Secondary Pose Artwork */}
      <div style={{ width: "85%", height: "85%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img
          src={brawler.secondaryPose}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            filter: `drop-shadow(0 0 40px ${brawler.accentColor})`,
          }}
        />
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
