import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, interpolate } from "remotion";
import { DynamicGridReveal, PanelConfig } from "./DynamicGridReveal";

export interface GlitchEffectProps {
  form1Panels: PanelConfig[];
  form4Panels: PanelConfig[];
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({ form1Panels, form4Panels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // We are recreating the rapid cutting between Form 4 and Form 1
  // The glitch sequence runs for exactly 23 frames (9.37s to 10.13s at 30fps is ~23 frames)

  // Every 2-3 frames, it swaps
  const swapVal = Math.floor(frame / 3) % 2 === 0;

  // Let's generate some chaotic CSS filters
  const hueRotate = random(`hue-${frame}`) * 360;
  const invert = random(`invert-${frame}`) > 0.5 ? 1 : 0;
  
  // Create an aggressive RGB split translation
  const tx = (random(`tx-${frame}`) - 0.5) * 40;
  const ty = (random(`ty-${frame}`) - 0.5) * 40;
  
  // Random scales
  const scale = 1 + (random(`scale-${frame}`) * 0.2);

  return (
    <AbsoluteFill
      style={{
        filter: `hue-rotate(${hueRotate}deg) invert(${invert})`,
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        opacity: interpolate(frame, [0, 20], [1, 1], { extrapolateRight: "clamp" }), // stay visible
      }}
    >
      {swapVal ? (
        <DynamicGridReveal auraColor="#facc15" iconText="FORM 1" panels={form1Panels} forceComplete />
      ) : (
        <DynamicGridReveal auraColor="#a855f7" iconText="FORM 4" panels={form4Panels} forceComplete />
      )}
      
      {/* Add a scanline overlay to sell the glitch */}
      <AbsoluteFill style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.2) 2px,
            transparent 2px,
            transparent 4px
          )`,
          pointerEvents: "none",
          mixBlendMode: "overlay"
      }} />
    </AbsoluteFill>
  );
};
