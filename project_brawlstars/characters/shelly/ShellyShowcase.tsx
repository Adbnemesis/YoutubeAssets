import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ShellyCharacter } from "./ShellyCharacter";
import shellyData from "./shelly_model.json";

export const ShellyShowcaseComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Switch poses every 45 frames for showcase
  const poses: Array<"idle" | "aim" | "super_blast" | "victorious"> = [
    "idle",
    "aim",
    "super_blast",
    "victorious",
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
      {/* Shelly Character View */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#312E81",
          padding: 30,
          borderRadius: 24,
          border: "3px solid #6366F1",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
        }}
      >
        <ShellyCharacter
          height={380}
          frame={frame}
          isSpeaking={isSpeaking}
          pose={currentPose}
          expression="confident"
          shotgunGlow={currentPose === "super_blast"}
        />
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#E0E7FF" }}>
            {shellyData.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 14, color: "#FDE047", marginTop: 4 }}>
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
        <h2 style={{ fontSize: 28, margin: 0, color: "#A855F7" }}>💥 {shellyData.name}</h2>
        <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 20 }}>
          {shellyData.game} • {shellyData.rarity} {shellyData.class}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #3F3F46", pb: 6 }}>
            <span style={{ color: "#9CA3AF" }}>Health</span>
            <span style={{ fontWeight: 800, color: "#4ADE80" }}>{shellyData.stats.health}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #3F3F46", pb: 6 }}>
            <span style={{ color: "#9CA3AF" }}>Primary Attack</span>
            <span style={{ fontWeight: 800, color: "#F87171" }}>{shellyData.stats.damagePerShell} x 5 Shells</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #3F3F46", pb: 6 }}>
            <span style={{ color: "#9CA3AF" }}>Super Shell Blast</span>
            <span style={{ fontWeight: 800, color: "#C084FC" }}>{shellyData.stats.superDamagePerShell} x 9 Shells</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #3F3F46", pb: 6 }}>
            <span style={{ color: "#9CA3AF" }}>Move Speed</span>
            <span style={{ fontWeight: 800, color: "#FBBF24" }}>{shellyData.movementSpeed}</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
