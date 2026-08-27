import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export interface FloatingParticlesProps {
  count?: number;
  color?: string;
  speed?: number;
}

/**
 * Ambient floating particles drifting upward in the background.
 */
export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 35,
  color = "#6366F1",
  speed = 1,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 29.5) % 100,
      startY: (i * 37.3) % 100,
      size: 2 + (i % 3) * 2,
      opacity: 0.15 + (i % 4) * 0.05,
      driftSpeed: 0.2 + (i % 5) * 0.15,
    }));
  }, [count]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", zIndex: 2 }}>
      {particles.map((p) => {
        const yPos = (100 - ((p.startY + frame * p.driftSpeed * speed) % 100));
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${yPos}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: p.opacity,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
