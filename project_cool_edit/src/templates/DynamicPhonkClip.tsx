import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const DynamicPhonkClip: React.FC<{
  bgColor: string;
  clipIndex: number;
}> = ({ bgColor, clipIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Screen shake logic based heavily on the first few frames
  const shakeIntensity = spring({
    fps,
    frame,
    config: { damping: 10, stiffness: 200 },
  });
  
  const shakeX = interpolate(shakeIntensity, [0, 1], [40, 0]) * Math.sin(frame * 1.5);
  const shakeY = interpolate(shakeIntensity, [0, 1], [40, 0]) * Math.cos(frame * 1.5);
  const rotation = interpolate(shakeIntensity, [0, 1], [2, 0]) * Math.sin(frame);
  const scale = interpolate(shakeIntensity, [0, 1], [1.15, 1.05]);

  // Exposure flash on cut
  const exposure = interpolate(frame, [0, 5], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          backgroundColor: bgColor,
          transform: `translate(${shakeX}px, ${shakeY}px) rotate(${rotation}deg) scale(${scale})`,
          filter: `contrast(1.5) saturate(1.5)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "100px",
          fontWeight: "bold",
          color: "white"
        }}
      >
        CLIP {clipIndex}
      </AbsoluteFill>
      
      {/* Exposure Flash Overlay */}
      <AbsoluteFill style={{ backgroundColor: `rgba(255, 255, 255, ${exposure})`, mixBlendMode: "overlay" }} />
      
      {/* Dark Vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 150px rgba(0,0,0,0.9)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
