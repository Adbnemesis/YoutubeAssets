import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EdgarCharacter } from "./EdgarCharacter";
import edgarData from "./edgar_model.json";

export const EdgarShowcaseComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Switch poses every 45 frames for showcase
  const poses: Array<"idle" | "attack" | "thumbs_down" | "cross_arms"> = [
    "idle",
    "attack",
    "thumbs_down",
    "cross_arms",
  ];
  const currentPose = poses[Math.floor(frame / 45) % poses.length];
  const isSpeaking = (Math.floor(frame / 15) % 2) === 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        color: "#FFFFFF",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 60,
      }}
    >
      {/* Edgar Character View */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#1E1B4B",
          padding: 30,
          borderRadius: 24,
          border: "3px solid #6B21A8",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
        }}
      >
        <EdgarCharacter
          height={380}
          frame={frame}
          isSpeaking={isSpeaking}
          pose={currentPose}
          expression="smirk"
        />
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#C084FC" }}>
            {edgarData.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 14, color: "#A7F3D0", marginTop: 4 }}>
            Pose: <span style={{ color: "#F472B6", fontWeight: 700 }}>{currentPose}</span>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div
        style={{
          width: 400,
          backgroundColor: "#18181B",
          borderRadius: 24,
          padding: 30,
          border: "2px solid #27272A",
        }}
      >
        <h2 style={{ fontSize: 28, margin: 0, color: "#F43F5E" }}>🔥 {edgarData.name}</h2>
        <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 20 }}>
          {edgarData.game} • {edgarData.rarity} {edgarData.class}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #3F3F46", pb: 6 }}>
            <span style={{ color: "#9CA3AF" }}>Health</span>
            <span style={{ fontWeight: 800, color: "#4ADE80" }}>{edgarData.stats.health}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #3F3F46", pb: 6 }}>
            <span style={{ color: "#9CA3AF" }}>Damage / Punch</span>
            <span style={{ fontWeight: 800, color: "#F87171" }}>{edgarData.stats.damagePerPunch} x 2</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #3F3F46", pb: 6 }}>
            <span style={{ color: "#9CA3AF" }}>Life Steal</span>
            <span style={{ fontWeight: 800, color: "#C084FC" }}>{edgarData.stats.lifeStealPercent}%</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #3F3F46", pb: 6 }}>
            <span style={{ color: "#9CA3AF" }}>Move Speed</span>
            <span style={{ fontWeight: 800, color: "#FBBF24" }}>{edgarData.movementSpeed}</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
