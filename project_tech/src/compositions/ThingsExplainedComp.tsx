import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../constants/theme";

export const ThingsExplainedComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-150f / 0-5s): The Hook - Memory Allocation (Active vs Orphaned)
  // Phase 2 (150-450f / 5-15s): The Mark Phase (Laser Scanner sweeping from root pointers)
  // Phase 3 (450-630f / 15-21s): The Sweep Phase (Garbage Dissolving & Reclaiming 42MB)
  // Phase 4 (630-750f / 21-25s): Clean Compact Memory & Takeaway

  // Camera Pan & Zoom
  const cameraZoom = interpolate(frame, [0, 150, 450, 630, 750], [1.0, 1.05, 1.08, 1.04, 1.0]);
  const laserX = interpolate(frame, [150, 450], [-400, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Memory Blocks
  const blocks = [
    { id: 1, label: "user_obj", isGarbage: false, x: -280, y: -80 },
    { id: 2, label: "orphan_cache", isGarbage: true, x: -100, y: -80 },
    { id: 3, label: "auth_token", isGarbage: false, x: 80, y: -80 },
    { id: 4, label: "temp_buffer", isGarbage: true, x: 260, y: -80 },
    { id: 5, label: "db_pool", isGarbage: false, x: -190, y: 80 },
    { id: 6, label: "leaked_listener", isGarbage: true, x: 0, y: 80 },
    { id: 7, label: "render_tree", isGarbage: false, x: 190, y: 80 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#05070E",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px 40px",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Deep Cyber Atmospheric Grid & Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            radial-gradient(circle at 50% 35%, rgba(6, 182, 212, 0.22) 0%, transparent 60%),
            radial-gradient(circle at 50% 75%, rgba(139, 92, 246, 0.18) 0%, transparent 60%),
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 60px 60px, 60px 60px",
          zIndex: 0,
        }}
      />

      {/* Top Header Hook */}
      <div style={{ zIndex: 10, textAlign: "center", width: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 24px",
            borderRadius: "9999px",
            backgroundColor: "rgba(6, 182, 212, 0.15)",
            border: "1.5px solid #06B6D4",
            boxShadow: "0 0 30px rgba(6, 182, 212, 0.3)",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "2px", color: "#22D3EE" }}>
            HOW IT WORKS UNDER THE HOOD
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "46px",
            fontWeight: 900,
            lineHeight: "1.15",
            color: "#FFFFFF",
            letterSpacing: "-0.5px",
            textShadow: "0 4px 30px rgba(0,0,0,0.9)",
          }}
        >
          {frame < 150
            ? "How V8 Cleans Your Memory"
            : frame < 450
            ? "Phase 1: Mark & Trace References"
            : frame < 630
            ? "Phase 2: Sweep & Free Garbage"
            : "Contiguous Clean RAM ⚡"}
        </h1>
        <p style={{ margin: "10px 0 0 0", fontSize: "22px", color: "#94A3B8", fontWeight: 500 }}>
          {frame < 150
            ? "Your CPU generates millions of objects. How does it delete them?"
            : frame < 450
            ? "Laser sweeps from Root pointers (Window / Global)"
            : frame < 630
            ? "Orphaned objects with 0 references are wiped out"
            : "Compacted into high-speed L1/L2 Cache space"}
        </p>
      </div>

      {/* Center Visual Stage: The 3D Memory Heap Container */}
      <div
        style={{
          zIndex: 10,
          width: "940px",
          height: "850px",
          borderRadius: "32px",
          backgroundColor: "rgba(11, 16, 28, 0.92)",
          border: "1.5px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.9)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${cameraZoom})`,
        }}
      >
        {/* Stage Header */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 32,
            right: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#64748B", letterSpacing: "1.5px" }}>
            V8 HEAP MEMORY (64-BIT RAM)
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 800,
              color: frame < 150 ? "#FBBF24" : frame < 450 ? "#22D3EE" : "#34D399",
              padding: "6px 16px",
              borderRadius: "8px",
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {frame < 150 ? "STATUS: ALLOCATING" : frame < 450 ? "STATUS: SCANNING (ROOT TRACE)" : "STATUS: RECLAIMED"}
          </span>
        </div>

        {/* The Sweeping Laser Line in Phase 2 */}
        {frame >= 150 && frame <= 450 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "4px",
              transform: `translateX(${laserX}px)`,
              backgroundColor: "#06B6D4",
              boxShadow: "0 0 30px #22D3EE, 0 0 60px #06B6D4",
              zIndex: 20,
            }}
          />
        )}

        {/* Memory Object Nodes */}
        <div style={{ position: "relative", width: "800px", height: "500px" }}>
          {blocks.map((b) => {
            const isScanned = frame >= 150 && laserX >= b.x;
            const isSwept = frame >= 450 && b.isGarbage;

            if (isSwept && frame >= 520) {
              return null;
            }

            const dissolveOpacity = isSwept ? interpolate(frame, [450, 520], [1, 0]) : 1;
            const dissolveScale = isSwept ? interpolate(frame, [450, 520], [1, 0.4]) : 1;

            let borderColor = "rgba(255, 255, 255, 0.15)";
            let bgColor = "rgba(255, 255, 255, 0.04)";
            let glow = "none";
            let textColor = "#FFFFFF";

            if (frame >= 150) {
              if (isScanned) {
                if (b.isGarbage) {
                  borderColor = "#F43F5E";
                  bgColor = "rgba(244, 63, 94, 0.25)";
                  glow = "0 0 25px rgba(244, 63, 94, 0.5)";
                  textColor = "#FB7185";
                } else {
                  borderColor = "#10B981";
                  bgColor = "rgba(16, 185, 129, 0.25)";
                  glow = "0 0 25px rgba(16, 185, 129, 0.5)";
                  textColor = "#34D399";
                }
              }
            }

            return (
              <div
                key={b.id}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${b.x}px - 75px)`,
                  top: `calc(50% + ${b.y}px - 50px)`,
                  width: "150px",
                  height: "100px",
                  borderRadius: "20px",
                  backgroundColor: bgColor,
                  border: `2px solid ${borderColor}`,
                  boxShadow: glow,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  opacity: dissolveOpacity,
                  transform: `scale(${dissolveScale})`,
                  transition: "border 0.2s, background 0.2s",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: isScanned && b.isGarbage ? "#FB7185" : isScanned ? "#34D399" : "#64748B",
                    letterSpacing: "1px",
                  }}
                >
                  {isScanned && b.isGarbage ? "ORPHAN (0 REFS)" : isScanned ? "ACTIVE REF" : "OBJECT"}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: textColor,
                    fontFamily: THEME.typography.fontCode,
                  }}
                >
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Phase Bottom Callout Banner inside Container */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 32,
            right: 32,
            padding: "16px 24px",
            borderRadius: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "18px", color: "#F8FAFC", fontWeight: 600 }}>
            {frame < 150
              ? "RAM gets fragmented when variables fall out of scope."
              : frame < 450
              ? "Mark Phase: DFS graph traversal marks all reachable objects."
              : frame < 630
              ? "Sweep Phase: Unmarked blocks are released back to OS memory."
              : "Compaction: Remaining blocks are defragmented for 10x cache speed."}
          </span>
          <span style={{ fontSize: "14px", fontWeight: 800, color: "#06B6D4" }}>
            {frame < 450 ? "TIME: ~1.2ms" : "FREED: 42.8 MB"}
          </span>
        </div>
      </div>

      {/* Bottom Takeaway & Brand Badge */}
      <div
        style={{
          zIndex: 10,
          width: "940px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 32px",
          borderRadius: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🧠</span>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#F8FAFC" }}>
            Clean memory = fast code. Save this visual 📌
          </span>
        </div>
        <span style={{ fontSize: "16px", fontWeight: 900, color: "#06B6D4", letterSpacing: "1px" }}>
          @codemind.dev
        </span>
      </div>

      {/* Full Master Audio Mix (Neural Voiceover + Blade Runner 2049 BGM) */}
      <Audio src={staticFile("sounds/final_audio_mix.mp3")} volume={1.0} />
    </AbsoluteFill>
  );
};
