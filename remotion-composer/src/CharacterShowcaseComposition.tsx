import React from "react";
import { AbsoluteFill } from "remotion";
import {
  ChibiChatGPT,
  ChibiGrok,
  ChibiClaude,
  ChibiGemini,
  ChibiKimi,
  ChibiQwen,
  ChibiLlama
} from "../../project_ai_showdown/common_assets/characters/ChibiAnimeModels";

export const CharacterShowcaseComposition: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F172A",
        color: "#FFFFFF",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justify: "center",
        padding: "30px 20px",
      }}
    >
      <h1 style={{ fontSize: 44, fontWeight: 900, marginBottom: 35, letterSpacing: -1 }}>
        🌸 7 Chibi Anime AI Model Roster Showcase (With Chibi Avatar Logos)
      </h1>

      <div
        style={{
          display: "flex",
          justify: "space-between",
          alignItems: "flex-end",
          width: "100%",
          maxWidth: 1840,
          backgroundColor: "#1E293B",
          borderRadius: 32,
          padding: "40px 20px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          border: "2px solid #334155",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <ChibiChatGPT height={280} />
          <span style={{ fontSize: 18, fontWeight: 800, color: "#10B981" }}>ChatGPT</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <ChibiGrok height={280} />
          <span style={{ fontSize: 18, fontWeight: 800, color: "#94A3B8" }}>Grok</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <ChibiClaude height={280} />
          <span style={{ fontSize: 18, fontWeight: 800, color: "#F59E0B" }}>Claude</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <ChibiGemini height={280} />
          <span style={{ fontSize: 18, fontWeight: 800, color: "#3B82F6" }}>Gemini</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <ChibiKimi height={280} />
          <span style={{ fontSize: 18, fontWeight: 800, color: "#06B6D4" }}>Kimi</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <ChibiQwen height={280} />
          <span style={{ fontSize: 18, fontWeight: 800, color: "#A855F7" }}>Qwen</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <ChibiLlama height={280} />
          <span style={{ fontSize: 18, fontWeight: 800, color: "#6366F1" }}>Llama</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
