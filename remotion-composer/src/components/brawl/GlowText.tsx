import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface GlowTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  glowColor?: string;
  fontWeight?: number;
  letterSpacing?: number;
  animate?: boolean;
}

/**
 * Text component with 3D shadow and neon glow effect.
 */
export const GlowText: React.FC<GlowTextProps> = ({
  text,
  fontSize = 38,
  color = "#FFFFFF",
  glowColor = "#7C3AED",
  fontWeight = 900,
  letterSpacing = 2,
  animate = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = animate
    ? spring({ frame, fps, config: { damping: 12, stiffness: 120 } })
    : 1;

  return (
    <span
      style={{
        display: "inline-block",
        color,
        fontSize,
        fontWeight,
        letterSpacing,
        textTransform: "uppercase",
        fontFamily: "'Space Grotesk', 'Bungee', 'Montserrat', sans-serif",
        transform: `scale(${scale})`,
        textShadow: [
          `0 4px 0 rgba(0,0,0,0.6)`,
          `0 0 15px ${glowColor}`,
          `0 0 30px ${glowColor}aa`,
        ].join(", "),
      }}
    >
      {text}
    </span>
  );
};
