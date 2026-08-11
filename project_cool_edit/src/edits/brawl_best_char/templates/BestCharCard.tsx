import React from "react";
import { useCurrentFrame, interpolate, spring, Img, Audio } from "remotion";
import { BrawlerContender } from "../props";
import { ParticleOverlay } from "./ParticleOverlay";

interface BestCharCardProps {
  contender: BrawlerContender;
}

export const BestCharCard: React.FC<BestCharCardProps> = ({ contender }) => {
  const frame = useCurrentFrame();
  const cardDuration = contender.endFrame - contender.startFrame;

  // Check if secondary image cut should trigger (e.g. Leon 2nd image cut at F263 -> local frame 41)
  const hasSecondaryCut = Boolean(contender.secondaryImage);
  const isSecondaryActive = hasSecondaryCut && frame >= 41;
  const currentImage = isSecondaryActive ? contender.secondaryImage! : contender.image;

  // 1. Entrance White/RGB Flash (Frames 0-3 AND local frame 41 for secondary cut)
  const isSecondaryCutFrame = hasSecondaryCut && Math.abs(frame - 41) <= 2;
  const flashOpacity = interpolate(
    frame,
    [0, 2, 5],
    [0.9, 0.4, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ) + (isSecondaryCutFrame ? 0.7 : 0.0);

  // 2. Chromatic Glitch RGB Shift (Frames 0-4 and local 41-44)
  const isGlitchFrame = frame < 4 || (hasSecondaryCut && frame >= 41 && frame < 45);
  const glitchOffsetX = isGlitchFrame ? (frame % 2 === 0 ? 8 : -8) : 0;

  // 3. Moving Manga Speed Lines
  const bgPos = (frame * 16) % 100;

  // 4. Pulsating Radial Light Glow Scale
  const auraScale = 1.0 + Math.sin(frame * 0.3) * 0.12;

  // 5. Subtle Floating Artwork Motion
  const floatY = Math.sin(frame * 0.2) * 14;

  // 6. Scale Zoom & Spring Entry
  const scale = interpolate(frame, [0, 5, cardDuration], [0.90, 1.06, 1.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 7. Text Pop Spring Animation
  const textScale = spring({
    frame: Math.max(0, frame - 2),
    fps: 30,
    config: { damping: 10, stiffness: 240 },
  });

  // 8. Impact Camera Shake (Frames 0-8 and 41-48)
  const shakeFrame = isSecondaryActive ? frame - 41 : frame;
  const shakeX = shakeFrame < 8 ? Math.sin(shakeFrame * 3.0) * (8 - shakeFrame) * 4.0 : 0;
  const shakeY = shakeFrame < 8 ? Math.cos(shakeFrame * 3.0) * (8 - shakeFrame) * 4.0 : 0;

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#04050a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Contender Voice Line Playback */}
      {contender.voiceLine && <Audio src={contender.voiceLine} volume={1.0} />}

      {/* Dynamic Animated Accent Background Radial Glow */}
      <div
        style={{
          position: "absolute",
          width: 880,
          height: 880,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${contender.accentColor} 0%, transparent 72%)`,
          opacity: 0.55,
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${auraScale})`,
          filter: "blur(70px)",
        }}
      />

      {/* Moving Manga Speed Lines Background Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 4px, transparent 4px, transparent 18px)",
          backgroundPosition: `${bgPos}px ${bgPos}px`,
        }}
      />

      {/* Ambient Floating Glow Particles */}
      <ParticleOverlay color={contender.accentColor} count={22} />

      {/* Entrance Flash Burst */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          opacity: Math.min(1.0, flashOpacity),
          pointerEvents: "none",
          zIndex: 25,
        }}
      />

      {/* Main Character Artwork Container with Chromatic Glitch Offset */}
      <div
        style={{
          width: "90%",
          height: "64%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale}) translateY(${floatY}px)`,
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Cyan Chromatic Glitch Layer */}
        {isGlitchFrame && (
          <Img
            src={currentImage}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: `translateX(${-glitchOffsetX}px)`,
              opacity: 0.7,
              filter: "drop-shadow(0 0 20px #06b6d4)",
            }}
          />
        )}

        {/* Red Chromatic Glitch Layer */}
        {isGlitchFrame && (
          <Img
            src={currentImage}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: `translateX(${glitchOffsetX}px)`,
              opacity: 0.7,
              filter: "drop-shadow(0 0 20px #ef4444)",
            }}
          />
        )}

        {/* Primary Artwork */}
        <Img
          key={currentImage}
          src={currentImage}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: `drop-shadow(0 30px 60px ${contender.accentColor}ff)`,
          }}
        />
      </div>

      {/* Question Text Pop Header (e.g. "MORTIS?") */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          zIndex: 15,
          transform: `scale(${textScale})`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Outfit', 'Impact', sans-serif",
            fontSize: 88,
            fontWeight: 900,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: 5,
            textShadow: `0 0 30px ${contender.accentColor}, 0 0 60px ${contender.accentColor}, 0 0 90px #000000, 0 0 120px #000000`,
            WebkitTextStroke: "3.5px #000000",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {contender.questionText}
        </h2>
      </div>
    </div>
  );
};
