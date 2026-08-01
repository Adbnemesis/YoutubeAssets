import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { ShellyCharacter } from "./shelly/ShellyCharacter";
import { EdgarCharacter } from "./edgar/EdgarCharacter";
import { KenjiCharacter } from "./kenji/KenjiCharacter";
import { MelodieCharacter } from "./melodie/MelodieCharacter";
import { FrankCharacter } from "./frank/FrankCharacter";

const BRAWLERS = [
  { name: "Shelly", folder: "shelly", component: ShellyCharacter, color: "#06B6D4" },
  { name: "Edgar", folder: "edgar", component: EdgarCharacter, color: "#A855F7" },
  { name: "Kenji", folder: "kenji", component: KenjiCharacter, color: "#EAB308" },
  { name: "Melodie", folder: "melodie", component: MelodieCharacter, color: "#EC4899" },
  { name: "Frank", folder: "frank", component: FrankCharacter, color: "#EF4444" },
];

const EXPRESSIONS = ["normal", "happy", "angry", "sad", "excited", "shocked"] as const;

export const BrawlerExpressionsShowcase: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0E17",
        color: "#FFFFFF",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        padding: "30px",
        overflowY: "auto",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "40px", fontWeight: 900, marginBottom: "20px", color: "#FDE047" }}>
        🎭 BRAWLER EXPRESSION ASSET LIBRARY Showcase
      </h1>

      {BRAWLERS.map((brawler) => {
        const BrawlerComp = brawler.component;
        return (
          <div
            key={brawler.name}
            style={{
              marginBottom: "35px",
              background: "rgba(15, 23, 42, 0.85)",
              borderRadius: "20px",
              border: `3px solid ${brawler.color}`,
              padding: "20px",
            }}
          >
            <h2 style={{ fontSize: "28px", color: brawler.color, marginBottom: "15px" }}>
              {brawler.name} Expression States
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "15px" }}>
              {EXPRESSIONS.map((exp) => (
                <div
                  key={exp}
                  style={{
                    background: "rgba(30, 41, 59, 0.9)",
                    borderRadius: "14px",
                    padding: "12px",
                    textAlign: "center",
                    border: "2px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: 800, textTransform: "uppercase", marginBottom: "8px", color: "#38BDF8" }}>
                    {exp}
                  </div>

                  {/* Pin PNG Emote Asset */}
                  <img
                    src={staticFile(`expressions/${brawler.folder}/${exp}.png`)}
                    alt={`${brawler.name} ${exp}`}
                    style={{ width: "70px", height: "70px", objectFit: "contain", marginBottom: "10px" }}
                  />

                  {/* React 2.5D SVG Brawler Model with Expression Prop */}
                  <div style={{ display: "flex", justifyContent: "center", height: "160px", overflow: "hidden" }}>
                    <BrawlerComp height={150} frame={10} expression={exp} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
