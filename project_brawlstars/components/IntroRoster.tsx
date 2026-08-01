import React from "react";
import { Img, staticFile, useCurrentFrame, spring } from "remotion";
import { PortraitConfig } from "../types";

export interface IntroRosterProps {
  roster: PortraitConfig[];
  /** Frame when roster should start appearing */
  startFrame?: number;
  /** Frame when roster should fade out (grid reveal) */
  endFrame?: number;
}

/**
 * Candidate roster header at top of screen during intro.
 * Reference: 4 portraits across top (Hank, Ash, Pearl, Rt), 90x90px, gap 10px,
 * centered horizontally, top: 28px. Each has spring entrance with tilt oscillation.
 */
export const IntroRoster: React.FC<IntroRosterProps> = ({ 
  roster, 
  startFrame = 0, 
  endFrame = 180 
}) => {
  const frame = useCurrentFrame();
  
  // Fade in/out
  const opacity = Math.min(1, Math.max(0, 
    (frame - startFrame) / 15 // fade in over 15 frames
  ));
  const fadeOut = endFrame > 0 ? Math.max(0, 1 - (frame - endFrame) / 20) : 1;
  const finalOpacity = opacity * fadeOut;
  
  if (finalOpacity <= 0 || roster.length === 0) return null;

  const CARD_SIZE = 90;
  const GAP = 10;
  const totalWidth = roster.length * CARD_SIZE + (roster.length - 1) * GAP;

  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: "50%",
        transform: `translateX(-50%)`,
        display: "flex",
        gap: GAP,
        zIndex: 12,
        opacity: finalOpacity,
      }}
    >
      {roster.map((entry, i) => {
        // Staggered entrance
        const delay = i * 3;
        const entranceScale = spring({
          frame: Math.max(0, frame - startFrame - delay),
          fps: 30,
          config: { damping: 10, stiffness: 200, mass: 0.8 }
        });
        
        // Subtle tilt oscillation (reference: sin(f * 0.12) * 8deg)
        const tilt = Math.sin(frame * 0.12) * 8;
        
        // Hot pulse for S-tier
        const hotPulse = entry.tier === "S" ? 1 + Math.sin(frame * 0.06) * 0.03 : 1;

        return (
          <div
            key={entry.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `scale(${entranceScale * hotPulse}) rotate(${tilt}deg)`,
              opacity: entranceScale,
            }}
          >
            {/* Portrait */}
            <div
              style={{
                width: CARD_SIZE,
                height: CARD_SIZE,
                borderRadius: 14,
                overflow: "hidden",
                border: `3px solid ${entry.accentColor ?? "#FFFFFF"}`,
                boxShadow: [
                  `0 0 12px ${entry.accentColor ?? "#FFFFFF"}88`,
                  `0 4px 14px rgba(0,0,0,0.8)`,
                ].join(", "),
                flexShrink: 0,
              }}
            >
              <Img
                src={staticFile(entry.imageSrc)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* Name */}
            <span
              style={{
                marginTop: 6,
                color: "#FFFFFF",
                fontSize: 20,
                fontWeight: 900,
                textShadow: "0 2px 4px rgba(0,0,0,0.9)",
                fontFamily: "'Space Grotesk', 'Montserrat', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {entry.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};