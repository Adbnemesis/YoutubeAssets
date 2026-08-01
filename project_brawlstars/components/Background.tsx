import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ColorBeat } from "../types";
import { beatToFrame } from "../beatGrid";

export interface BackgroundProps {
  /** Color switched per beat — drives the "phonk color edit" language */
  colorCycle: ColorBeat[];
  /** Color used before the first colorCycle entry */
  introColor: string;
  vignette?: boolean;
  particles?: boolean;
  /** Subtle radial spotlight behind center content */
  spotlight?: boolean;
}

const PARTICLE_COUNT = 26;

/** Resolve the active background color at a given frame. */
export const resolveBackgroundColor = (
  frame: number,
  colorCycle: ColorBeat[],
  introColor: string,
  fps: number
): string => {
  let color = introColor;
  for (const c of colorCycle) {
    if (frame >= beatToFrame(c.beat, fps)) color = c.color;
  }
  return color;
};

export const Background: React.FC<BackgroundProps> = ({
  colorCycle,
  introColor,
  vignette = true,
  particles = false,
  spotlight = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const color = resolveBackgroundColor(frame, colorCycle, introColor, fps);

  const particlesArr = React.useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        x: (i * 137.508) % 100,
        y: (i * 61.803) % 100,
        size: 2 + (i % 4) * 2.5,
        speed: 0.4 + (i % 5) * 0.25,
        delay: i % 20,
      })),
    []
  );

  return (
    <AbsoluteFill style={{ backgroundColor: color }}>
      {spotlight && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 55%)",
          }}
        />
      )}

      {particles && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          {particlesArr.map((p, i) => {
            const drift = (frame * p.speed) % 100;
            const y = (p.y + drift) % 100;
            const twinkle =
              0.25 + 0.5 * (0.5 + 0.5 * Math.sin(frame * 0.1 + i * 1.7));
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${y}%`,
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  opacity: twinkle,
                  filter: "blur(0.5px)",
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}

      {vignette && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
