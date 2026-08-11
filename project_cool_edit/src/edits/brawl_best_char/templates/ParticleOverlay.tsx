import React from "react";
import { useCurrentFrame } from "remotion";

interface ParticleOverlayProps {
  color: string;
  count?: number;
}

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({ color, count = 20 }) => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const x = (i * 37 + 12) % 100;
      const speed = 2 + (i % 3) * 1.5;
      const size = 6 + (i % 4) * 4;
      const delay = (i * 7) % 30;
      return { x, speed, size, delay };
    });
  }, [count]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 4,
      }}
    >
      {particles.map((p, idx) => {
        const currentY = 100 - (((frame + p.delay) * p.speed) % 110);
        const opacity = Math.sin((currentY / 100) * Math.PI) * 0.7;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${currentY}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: Math.max(0, opacity),
              boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
              transform: `scale(${1 + Math.sin(frame * 0.1 + idx) * 0.3})`,
            }}
          />
        );
      })}
    </div>
  );
};
