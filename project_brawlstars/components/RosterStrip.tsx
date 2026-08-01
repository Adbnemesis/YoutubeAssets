import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { PortraitConfig } from "../types";
import { popIn } from "../motion";

export interface RosterStripProps {
  portraits: PortraitConfig[];
  /** Frame when the strip starts appearing (staggered per portrait) */
  startFrame?: number;
  staggerFrames?: number;
  size?: number;
  top?: number;
}

/** Candidate roster row shown across the top during the intro. */
export const RosterStrip: React.FC<RosterStripProps> = ({
  portraits,
  startFrame = 0,
  staggerFrames = 5,
  size = 96,
  top = 70,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 14,
        zIndex: 12,
      }}
    >
      {portraits.map((p, i) => {
        const rel = frame - startFrame - i * staggerFrames;
        if (rel < 0) return null;
        const scale = popIn(rel, fps, 0, { damping: 12, stiffness: 160 });
        const wobble =
          frame >= 30 ? Math.sin(frame * 0.12 + i * 1.3) * 4 : 0;
        return (
          <div
            key={p.id}
            style={{
              width: size,
              height: size,
              transform: `scale(${scale}) rotate(${wobble}deg)`,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                overflow: "hidden",
                border: `3px solid ${p.accentColor}`,
                boxShadow: [
                  `0 0 16px ${p.accentColor}99`,
                  `0 6px 14px rgba(0,0,0,0.6)`,
                ].join(", "),
              }}
            >
              <Img
                src={staticFile(p.imageSrc)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: 800,
                marginTop: 4,
                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                fontFamily: "'Space Grotesk', 'Montserrat', sans-serif",
              }}
            >
              {p.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
