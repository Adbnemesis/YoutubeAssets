import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";

export interface BrawlerRevealScreenProps {
  /** Brawler name displayed in bold */
  brawlerName: string;
  /** Path to portrait image (relative to public/) */
  imageSrc: string;
  /** Solid background color for the reveal */
  bgColor: string;
  /** Glow/accent color for text and effects */
  glowColor: string;
  /** Frame when the reveal starts */
  startFrame: number;
  /** Total duration of the reveal in frames (default: 21) */
  duration?: number;
  /** Portrait size during reveal (default: 400) */
  portraitSize?: number;
}

/**
 * Full-screen brawler reveal sequence:
 *
 * Phase 1 — Flash In (frames 0-3):
 *   White screen flash opacity 0 → 0.9 → 0
 *
 * Phase 2 — Reveal (frames 3-17):
 *   Solid color BG + centered portrait (spring scale) + name text
 *
 * Phase 3 — Zoom-Out (frames 17-21):
 *   Entire screen scales down + fades to return to main view
 */
export const BrawlerRevealScreen: React.FC<BrawlerRevealScreenProps> = ({
  brawlerName,
  imageSrc,
  bgColor,
  glowColor,
  startFrame,
  duration = 21,
  portraitSize = 400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relFrame = frame - startFrame;

  // Only render during the reveal window
  if (relFrame < 0 || relFrame >= duration) return null;

  // Phase 1: Flash
  const flashOpacity = interpolate(
    relFrame,
    [0, 1, 2, 3],
    [0, 0.9, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase 2: Portrait entrance (spring)
  const portraitScale = spring({
    frame: Math.max(0, relFrame - 2),
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.8 },
  });

  // Phase 2: Name text entrance (delayed spring)
  const nameScale = spring({
    frame: Math.max(0, relFrame - 5),
    fps,
    config: { damping: 12, stiffness: 120, mass: 1 },
  });

  // Phase 3: Zoom-out (scale entire scene down)
  const zoomOutStart = duration - 6;
  const sceneScale = interpolate(
    relFrame,
    [zoomOutStart, duration - 1],
    [1, 0.12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const sceneOpacity = interpolate(
    relFrame,
    [zoomOutStart, duration - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background glow pulse
  const bgPulse = 1 + Math.sin(relFrame * 0.2) * 0.03;

  return (
    <AbsoluteFill
      style={{
        zIndex: 50,
        transform: `scale(${sceneScale})`,
        opacity: sceneOpacity,
        pointerEvents: "none",
      }}
    >
      {/* Solid color background */}
      <AbsoluteFill
        style={{
          backgroundColor: bgColor,
          transform: `scale(${bgPulse})`,
        }}
      />

      {/* Decorative particles */}
      <RevealParticles color={glowColor} relFrame={relFrame} />

      {/* Centered portrait */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -60%) scale(${portraitScale})`,
        }}
      >
        <div
          style={{
            width: portraitSize,
            height: portraitSize,
            borderRadius: portraitSize * 0.12,
            border: "6px solid #FFFFFF",
            overflow: "hidden",
            boxShadow: [
              `0 0 40px ${glowColor}99`,
              `0 0 80px ${glowColor}44`,
              `0 20px 60px rgba(0,0,0,0.5)`,
            ].join(", "),
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
      </div>

      {/* Name text */}
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${nameScale})`,
        }}
      >
        <span
          style={{
            fontFamily: "'Bungee', 'Impact', sans-serif",
            fontSize: 72,
            fontWeight: 900,
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: 6,
            textShadow: [
              `0 4px 0 rgba(0,0,0,0.4)`,
              `0 0 20px ${glowColor}`,
              `0 0 40px ${glowColor}88`,
            ].join(", "),
          }}
        >
          {brawlerName}
        </span>
      </div>

      {/* White flash overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: "#FFFFFF",
          opacity: flashOpacity,
          zIndex: 60,
        }}
      />
    </AbsoluteFill>
  );
};

/** Decorative floating particles for the reveal screen */
const RevealParticles: React.FC<{ color: string; relFrame: number }> = ({
  color,
  relFrame,
}) => {
  // Generate 20 deterministic particles
  const particles = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (i * 137.5) % 100, // Golden angle distribution
      y: (i * 61.8) % 100,
      size: 4 + (i % 5) * 3,
      speed: 0.3 + (i % 4) * 0.2,
      delay: i * 0.5,
    }));
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {particles.map((p) => {
        const opacity = interpolate(
          relFrame,
          [p.delay, p.delay + 3, 18, 21],
          [0, 0.6, 0.6, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const drift = relFrame * p.speed;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${((p.y - drift) % 100 + 100) % 100}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity,
              filter: `blur(${p.size > 8 ? 2 : 0}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
