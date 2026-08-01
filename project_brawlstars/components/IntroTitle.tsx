import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring, Img, staticFile } from "remotion";
import { TitleWord } from "../types";
import { FONT_FAMILY } from "../fonts";

export interface IntroTitleProps {
  words: TitleWord[];
  centerY?: number;
}
/**
 * Rotating word-by-word title (the reference's intro):
 * one word at a time, popping in exactly when the narrator says it —
 * the previous word is replaced as the new one lands. Styled with a
 * lime-green gradient fill, heavy stroke and a radial flare burst.
 * 
 * Reference spec (from deep analysis):
 * - Font: BrawlStars font
 * - Fill: #22C55E (lime green)
 * - Stroke: 8px #15803D (dark green)
 * - Text shadow: 0 6px 0 #000000, 0 0 35px #22C55E, 0 0 70px #15803D
 * - Pop-in spring: damping 10, stiffness 220
 */
export const IntroTitle: React.FC<IntroTitleProps> = ({ words, centerY = 0.35 }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const sorted = React.useMemo(() => [...words].sort((a, b) => a.frame - b.frame), [words]);

  let current: TitleWord | undefined;
  for (const w of sorted) {
    if (frame >= w.frame) current = w;
  }
  if (!current) return null;

  const idx = sorted.findIndex((w) => w.frame === current!.frame);
  const prev = idx > 0 ? sorted[idx - 1] : undefined;
  const rel = frame - current.frame;

  const fs = current.fontSize ?? 140;

  // Reference pop-in: spring starts at 1 (visible immediately), then overshoots
  const scale = spring({
    frame: rel,
    fps: 30,
    config: { damping: 10, stiffness: 220, mass: 0.9 }
  });
  // Ensure first frame is visible (spring starts at 0, so force to 1 at frame 0)
  const visibleScale = rel === 0 ? 1 : scale;

  const glow = interpolate(rel, [0, 4, 10], [0, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flare burst behind the word on pop
  const flareScale = interpolate(rel, [0, 10], [0.3, 1.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flareOpacity = interpolate(rel, [0, 3, 10], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitScale = prev
    ? interpolate(rel, [0, 5], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const exitOpacity = prev
    ? interpolate(rel, [0, 5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  // Reference exact styling: neon mint-green gradient fill with dark stroke & glowing aura
  // Fill: bright mint-white #E0FFF0 → spring green #BFFFD8 → #7BE8A0 → dark mint #396544
  // (v5/reference look: near-white spring-green highlights rgb(211,255,228), NOT dark green body)
  const textColor = current.color ?? "#16FF16";
  const isGold = textColor === "#FFD60A" || textColor === "#FACC15";
  
  const baseColor = isGold ? "#FFD60A" : "#16FF16";
  
  // Use a softer gradient for the green text as requested
  const fillGradient = isGold
    ? undefined // No gradient for gold
    : "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 50%, #BFFFD8 50%, #BFFFD8 100%)";
      
  const wordStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILY,
    fontSize: fs,
    lineHeight: 1,
    background: fillGradient,
    WebkitBackgroundClip: fillGradient ? "text" : undefined,
    backgroundClip: fillGradient ? "text" : undefined,
    color: fillGradient ? "transparent" : baseColor,
    WebkitTextStroke: "8px #000000",
    paintOrder: "stroke fill",
    whiteSpace: "nowrap",
    textShadow: [
      "0 8px 0 #000000",
      `0 0 40px ${baseColor}`,
      `0 0 80px ${baseColor}aa`,
    ].join(", "),
    display: "inline-block",
  };

  // Continuous pulsing effect for the pin (shrinks in and out)
  const pinPulse = 1 + Math.sin(frame * 0.4) * 0.12; // oscillates between 0.88 and 1.12

  return (
    <>
      {/* Speaker Kenji dialogue art statically positioned ABOVE the font on top right */}
      <div
        style={{
          position: "absolute",
          left: "56%",
          top: "20%",
          width: 260,
          height: 260,
          transform: `rotate(15deg) scale(${pinPulse})`,
          zIndex: 12,
          pointerEvents: "none",
        }}
      >
        <Img
          src={staticFile("brawl/portraits/kenji_dialogue.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.9))",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: height * centerY - fs * 0.6,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 4,
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>

        {/* Flare burst */}
        {flareOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: fs * 2.6,
              height: fs * 1.4,
              transform: `translate(-50%,-50%) scale(${flareScale})`,
              opacity: flareOpacity,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(235,255,225,0.95) 0%, rgba(134,240,170,0.5) 45%, transparent 70%)",
              filter: "blur(6px)",
            }}
          />
        )}
        
        {/* Outline Layer (Bottom) - Solid color with text stroke and drop shadow */}
        <span style={{ 
          ...wordStyle, 
          position: "absolute",
          left: 0,
          top: 0,
          background: undefined,
          WebkitBackgroundClip: undefined,
          backgroundClip: undefined,
          color: baseColor,
          WebkitTextStroke: "6px #000000",
          textShadow: [
            "0 6px 0 #000000",
            `0 0 40px ${baseColor}`,
            `0 0 80px ${baseColor}aa`,
          ].join(", "),
          transform: `scale(${visibleScale})`,
          zIndex: 1
        }}>
          {current.text}
        </span>
        
        {/* Fill Layer (Top) - Gradient fill with NO stroke */}
        <span style={{ 
          ...wordStyle, 
          position: "relative",
          WebkitTextStroke: "0px",
          textShadow: "none",
          transform: `scale(${visibleScale})`,
          zIndex: 2
        }}>
          {current.text}
        </span>
      </div>
    </div>
    </>
  );
};
