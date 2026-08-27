import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile, Img } from "remotion";

export interface BrawlerPortraitProps {
  /** Brawler name (used for alt text and fallback initial) */
  name: string;
  /** Path to portrait image (relative to public/, used with staticFile) */
  imageSrc: string;
  /** Border/glow color */
  borderColor: string;
  /** Size of the portrait in pixels */
  size?: number;
  /** Frame when this portrait should appear */
  startFrame?: number;
  /** Whether to show the glitch flicker on entrance */
  glitchEntrance?: boolean;
  /** Whether this is a "hot" placement (extra glow + fire emoji) */
  isHot?: boolean;
  /** Whether this portrait was moved (e.g. tier promotion — adds shake) */
  isMoved?: boolean;
  /** Optional glow intensity multiplier (0-1) */
  glowIntensity?: number;
}

/**
 * Renders a brawler portrait in a styled frame with animated entrance.
 * 
 * Entrance sequence:
 * Frame 0-3:  Scale 0 → 1.2 (overshoot spring)
 * Frame 3-5:  Glitch flicker (opacity toggles)
 * Frame 5-8:  Scale 1.2 → 1.0 (settle)
 * Frame 8-10: Micro-bounce
 * Frame 10+:  Static idle
 */
export const BrawlerPortrait: React.FC<BrawlerPortraitProps> = ({
  name,
  imageSrc,
  borderColor,
  size = 100,
  startFrame = 0,
  glitchEntrance = true,
  isHot = false,
  isMoved = false,
  glowIntensity = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relFrame = Math.max(0, frame - startFrame);

  if (frame < startFrame) return null;

  // Spring entrance with overshoot
  const entranceScale = spring({
    frame: relFrame,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.8 },
  });

  // Glitch flicker during entrance (frames 3-6 relative)
  let glitchOpacity = 1;
  if (glitchEntrance && relFrame >= 3 && relFrame <= 6) {
    const flickerPattern = [1, 0.3, 1, 0.5];
    glitchOpacity = flickerPattern[relFrame - 3] ?? 1;
  }

  // Micro-bounce after settle (frames 8-12)
  const microBounce = relFrame >= 8 && relFrame <= 12
    ? 1 + Math.sin((relFrame - 8) * Math.PI / 4) * 0.05
    : 1;

  // Moved shake effect (when a portrait is promoted/demoted)
  const moveShake = isMoved && relFrame < 15
    ? Math.sin(relFrame * 0.3) * 5
    : 0;

  // Idle subtle pulse for hot items
  const hotPulse = isHot
    ? 1 + Math.sin(frame * 0.06) * 0.02
    : 1;

  const finalScale = entranceScale * microBounce * hotPulse;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.12,
        transform: `scale(${finalScale}) rotate(${moveShake}deg)`,
        opacity: glitchOpacity,
        transition: "transform 0.1s ease",
      }}
    >
      {/* Portrait frame */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.16,
          border: `3px solid #FFFFFF`,
          overflow: "hidden",
          backgroundColor: borderColor,
          boxShadow: [
            `0 0 ${size * 0.15}px ${borderColor}${Math.round(glowIntensity * 255).toString(16).padStart(2, "0")}`,
            `0 6px 16px rgba(0,0,0,0.4)`,
          ].join(", "),
          position: "relative",
        }}
      >
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Name label */}
      <span
        style={{
          color: "#FFFFFF",
          fontSize: size * 0.3,
          fontWeight: 900,
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          fontFamily: "'Bungee', 'Impact', sans-serif",
        }}
      >
        {name}
      </span>

      {/* Hot fire emoji */}
      {isHot && (
        <span
          style={{
            fontSize: size * 0.28,
            filter: "drop-shadow(0 0 6px rgba(255,0,0,0.8))",
          }}
        >
          🔥
        </span>
      )}
    </div>
  );
};
