import React from "react";
import { AbsoluteFill, Video, useCurrentFrame, useVideoConfig, spring, staticFile } from "remotion";
import beatsData from "../edits/brawl_forms/data/beats.json";

export const PhonkClip: React.FC<{
  clipName: string;
  startFrameGlobal: number; // The global frame this clip starts at
}> = ({ clipName, startFrameGlobal }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // White flash on clip start
  const flashOpacity = Math.max(0, 1 - frame / 15); // Fades out over half a second

  // Constant slow zoom (from 1.0 to 1.15 over the clip)
  const zoom = 1 + (frame / fps) * 0.15;

  // Screen shake logic based on global beats
  let shakeX = 0;
  let shakeY = 0;
  let shakeRot = 0;
  let extraScale = 0;

  // Find if there's a recent onset within the last 10 frames
  const globalFrame = startFrameGlobal + frame;
  const recentOnset = beatsData.onsets.find(onset => {
    const onsetFrame = onset * fps;
    return globalFrame >= onsetFrame && globalFrame < onsetFrame + 10;
  });

  if (recentOnset) {
    const framesSinceOnset = globalFrame - (recentOnset * fps);
    // Damping spring effect
    const intensity = Math.max(0, 1 - framesSinceOnset / 10);
    shakeX = (Math.random() - 0.5) * 80 * intensity;
    shakeY = (Math.random() - 0.5) * 80 * intensity;
    shakeRot = (Math.random() - 0.5) * 4 * intensity;
    extraScale = 0.1 * intensity;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom + extraScale}) translate(${shakeX}px, ${shakeY}px) rotate(${shakeRot}deg)`,
          transformOrigin: "center",
          filter: "contrast(1.4) saturate(1.3) brightness(0.9)", // Hard phonk color grading
        }}
      >
        <Video 
          src={staticFile(`assets_cool_edit/clips/${clipName}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      
      {/* Heavy Vignette */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 150px rgba(0,0,0,0.9)" }} />
      
      {/* Exposure Flash */}
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flashOpacity }} />
    </AbsoluteFill>
  );
};
