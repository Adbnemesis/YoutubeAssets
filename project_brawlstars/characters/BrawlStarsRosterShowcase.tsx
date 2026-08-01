import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EdgarCharacter } from "./edgar/EdgarCharacter";
import { ShellyCharacter } from "./shelly/ShellyCharacter";
import { KenjiCharacter } from "./kenji/KenjiCharacter";
import { MelodieCharacter } from "./melodie/MelodieCharacter";
import { FrankCharacter } from "./frank/FrankCharacter";

export const BrawlStarsRosterShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0F19",
        color: "#FFFFFF",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justify: "center",
        padding: "30px 40px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 25 }}>
        <h1 style={{ fontSize: 44, fontWeight: 900, margin: 0, letterSpacing: -1, color: "#F59E0B" }}>
          ⚡ BRAWL STARS CHARACTER ROSTER ⚡
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 18, marginTop: 6 }}>
          Remotion Vector Character Models • Edgar, Shelly, Kenji, Melodie, Frank
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justify: "space-evenly",
          alignItems: "flex-end",
          width: "100%",
          maxWidth: 1800,
          backgroundColor: "#1E293B",
          borderRadius: 32,
          padding: "40px 20px 20px 20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          border: "3px solid #334155",
        }}
      >
        {/* 1. Edgar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <EdgarCharacter height={310} frame={frame} isSpeaking={(frame % 30) < 15} pose="idle" />
          <span style={{ fontSize: 20, fontWeight: 800, color: "#C084FC" }}>EDGAR</span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>Epic Assassin</span>
        </div>

        {/* 2. Shelly */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <ShellyCharacter height={310} frame={frame} isSpeaking={(frame % 30) < 15} pose="idle" />
          <span style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>SHELLY</span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>Starter Damage</span>
        </div>

        {/* 3. Kenji */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <KenjiCharacter height={310} frame={frame} isSpeaking={(frame % 30) < 15} pose="idle" />
          <span style={{ fontSize: 20, fontWeight: 800, color: "#84CC16" }}>KENJI</span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>Legendary Assassin</span>
        </div>

        {/* 4. Melodie */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <MelodieCharacter height={310} frame={frame} isSpeaking={(frame % 30) < 15} pose="idle" />
          <span style={{ fontSize: 20, fontWeight: 800, color: "#EC4899" }}>MELODIE</span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>Mythic Assassin</span>
        </div>

        {/* 5. Frank */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <FrankCharacter height={310} frame={frame} isSpeaking={(frame % 30) < 15} pose="idle" />
          <span style={{ fontSize: 20, fontWeight: 800, color: "#A7F3D0" }}>FRANK</span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>Epic Tank</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
