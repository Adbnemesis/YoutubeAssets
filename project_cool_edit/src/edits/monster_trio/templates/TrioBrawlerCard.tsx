import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrawlerCardProps } from "../props";

interface TrioBrawlerCardProps {
  brawler: BrawlerCardProps;
  mode: "image_shake" | "text_card" | "action_pose";
}

const PHONK_FONTS = [
  "Impact",
  "Arial Black",
  "Trebuchet MS",
  "Courier New",
  "Franklin Gothic Medium",
  "sans-serif",
];

export const TrioBrawlerCard: React.FC<TrioBrawlerCardProps> = ({ brawler, mode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mode 1: Image Shake Entrance
  if (mode === "image_shake") {
    const scale = interpolate(frame, [0, 9, 20], [1.0, 1.14, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const shakeX = frame < 14 ? Math.sin(frame * 4.2) * 16 : 0;
    const shakeY = frame < 14 ? Math.cos(frame * 4.2) * 12 : 0;

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
        {/* Sunburst & Radial Aura Backdrop */}
        <div
          style={{
            position: "absolute",
            width: "140%",
            height: "140%",
            background: `radial-gradient(circle, ${brawler.accentColor}66 0%, rgba(9,13,22,0.95) 75%)`,
            transform: `rotate(${frame * 0.6}deg)`,
          }}
        />

        {/* Character Artwork 1 */}
        <div style={{ width: "85%", height: "85%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img
            src={brawler.image}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              filter: `drop-shadow(0 0 45px ${brawler.accentColor})`,
            }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  // Mode 2: Text Card Pop (PURE BLACK BACKGROUND + RAPID FONT SHIFTS)
  if (mode === "text_card") {
    const fontIdx = Math.floor(frame / 3) % PHONK_FONTS.length;
    const currentFont = PHONK_FONTS[fontIdx];

    const textSpring = spring({
      frame,
      fps,
      config: { damping: 9, stiffness: 260 },
    });
    const showFlash = frame <= 2;

    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000000", // PURE BLACK BACKGROUND AS DISCOVERED
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Pure Black Background with Subtle Radial Color Tint */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle, ${brawler.accentColor}33 0%, #000000 70%)`,
          }}
        />

        {/* Rapid Font Cycling Animated Text Pop */}
        <div
          style={{
            position: "relative",
            textAlign: "center",
            transform: `scale(${textSpring})`,
            zIndex: 20,
          }}
        >
          <h1
            style={{
              fontSize: 92,
              fontWeight: 900,
              color: "#ffffff",
              margin: 0,
              letterSpacing: 6,
              textShadow: `0 0 40px ${brawler.accentColor}, 0 0 80px ${brawler.accentColor}, -5px 5px 0 #000`,
              fontFamily: currentFont,
            }}
          >
            {brawler.text}
          </h1>
        </div>

        {/* White Flash Burst Cut */}
        {showFlash && (
          <AbsoluteFill
            style={{
              backgroundColor: "#ffffff",
              opacity: 0.9,
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
            filter: `drop-shadow(0 0 45px ${brawler.accentColor})`,
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
