import React from "react";
import { AbsoluteFill } from "remotion";
import { AdaMascot, AdaPose } from "./AdaMascot";
import { NemiMascot } from "./NemiMascot";

export const AdaShowcaseComp: React.FC = () => {
  const poses: { pose: AdaPose; label: string }[] = [
    { pose: "explaining", label: "Explaining" },
    { pose: "pointing", label: "Pointing" },
    { pose: "thinking", label: "Thinking" },
    { pose: "aha", label: "Aha! (Idea)" },
    { pose: "shocked", label: "Shocked" },
    { pose: "smug", label: "Smug (Wink)" },
    { pose: "coding", label: "Live Coding" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060A14",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 40px",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Background Cyber Nebula */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -100,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: -100,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Header Banner */}
      <div style={{ textAlign: "center", marginBottom: 30, zIndex: 10 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 22px",
            borderRadius: 20,
            backgroundColor: "rgba(139, 92, 246, 0.18)",
            border: "1.5px solid #8B5CF6",
            color: "#C4B5FD",
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "1px",
            marginBottom: 12,
          }}
        >
          ✨ NEW MASCOT SYSTEM
        </div>
        <div style={{ fontSize: 44, fontWeight: 900, color: "#F8FAFC" }}>
          Meet <span style={{ color: "#38BDF8" }}>Ada</span> & <span style={{ color: "#FFD166" }}>Nemi</span>
        </div>
        <div style={{ fontSize: 20, color: "#94A3B8", marginTop: 6, fontWeight: 600 }}>
          Vector Mascot Engine for Tech Carousels & Explainer Videos
        </div>
      </div>

      {/* 2-Column Hero Showcase */}
      <div
        style={{
          display: "flex",
          gap: 50,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 40,
          zIndex: 10,
        }}
      >
        {/* Ada Hero Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "2px solid rgba(139, 92, 246, 0.4)",
            borderRadius: 30,
            padding: "24px 36px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
          }}
        >
          <AdaMascot pose="explaining" scale={1.25} />
          <div style={{ fontSize: 24, fontWeight: 900, color: "#C4B5FD", marginTop: 10 }}>
            Ada (Tech Girl Mascot)
          </div>
          <div style={{ fontSize: 16, color: "#94A3B8", fontWeight: 700 }}>
            Cyber Headphones · Anime Chibi Eyes
          </div>
        </div>

        {/* Nemi Hero Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "2px solid rgba(255, 209, 102, 0.4)",
            borderRadius: 30,
            padding: "24px 36px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
          }}
        >
          <NemiMascot pose="aha" scale={1.25} />
          <div style={{ fontSize: 24, fontWeight: 900, color: "#FFD166", marginTop: 10 }}>
            Nemi (Dev Mascot)
          </div>
          <div style={{ fontSize: 16, color: "#94A3B8", fontWeight: 700 }}>
            Yellow Glasses · Tech Hoodie
          </div>
        </div>
      </div>

      {/* Pose Gallery Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          width: "100%",
          maxWidth: 960,
          zIndex: 10,
        }}
      >
        {poses.slice(0, 4).map((p, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              border: "1.5px solid rgba(56, 189, 248, 0.25)",
              borderRadius: 22,
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AdaMascot pose={p.pose} scale={0.78} />
            <div style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC", marginTop: 8 }}>
              {p.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          width: "100%",
          maxWidth: 720,
          marginTop: 20,
          zIndex: 10,
        }}
      >
        {poses.slice(4).map((p, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              border: "1.5px solid rgba(56, 189, 248, 0.25)",
              borderRadius: 22,
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AdaMascot pose={p.pose} scale={0.78} />
            <div style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC", marginTop: 8 }}>
              {p.label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
