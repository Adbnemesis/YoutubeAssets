import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";

export interface ParticleBurstProps {
  x: number;
  y: number;
  color?: string;
  count?: number;
  startFrame: number;
  duration?: number;
  spread?: number;
}

/**
 * Reusable particle burst effect on placement impacts.
 */
export const ParticleBurst: React.FC<ParticleBurstProps> = ({
  x,
  y,
  color = "#FFD700",
  count = 16,
  startFrame,
  duration = 15,
  spread = 150,
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 2 * Math.PI + (i % 3) * 0.2;
      const distance = spread * (0.6 + (i % 5) * 0.1);
      return {
        id: i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size: 6 + (i % 4) * 4,
      };
    });
  }, [count, spread]);

  if (relFrame < 0 || relFrame >= duration) return null;

  const progress = relFrame / duration;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 90,
      }}
    >
      {particles.map((p) => {
        const curX = p.dx * progress;
        const curY = p.dy * progress;
        const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 0.8, 0]);
        const scale = interpolate(progress, [0, 0.3, 1], [0.2, 1.2, 0]);

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              transform: `translate(${curX}px, ${curY}px) scale(${scale})`,
              width: p.size,
              height: p.size,
              borderRadius: p.id % 2 === 0 ? "50%" : "20%",
              backgroundColor: color,
              opacity,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};
