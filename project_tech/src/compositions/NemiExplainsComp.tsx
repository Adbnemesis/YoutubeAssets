import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NemiMascot, NemiPose } from "../components/NemiMascot";
import { NEMI_THEME } from "../constants/nemiTheme";

export const NemiExplainsComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-150f / 0-5s): The Curiosity Hook (Nemi is Puzzled ❓)
  // Phase 2 (150-450f / 5-15s): The Mark Laser Scan (Nemi is Thinking 🧠)
  // Phase 3 (450-630f / 15-21s): The Sweep & Free (Nemi gets the Aha! 💡)
  // Phase 4 (630-750f / 21-25s): The Takeaway (Nemi is Smug/Happy 😎)

  const currentPose: NemiPose =
    frame < 150 ? "puzzled" : frame < 450 ? "thinking" : frame < 630 ? "aha" : "smug";

  // Laser scanner position across memory
  const laserX = interpolate(frame, [150, 450], [-360, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Memory Nodes in V8 Heap
  const memoryBlocks = [
    { id: 1, name: "user_session", size: "12 KB", isGarbage: false, x: -260, y: -70 },
    { id: 2, name: "orphan_cache", size: "84 KB", isGarbage: true, x: -90, y: -70 },
    { id: 3, name: "jwt_token", size: "4 KB", isGarbage: false, x: 80, y: -70 },
    { id: 4, name: "temp_matrix", size: "1.2 MB", isGarbage: true, x: 250, y: -70 },
    { id: 5, name: "db_client", size: "64 KB", isGarbage: false, x: -180, y: 70 },
    { id: 6, name: "leaked_event", size: "2.4 MB", isGarbage: true, x: 0, y: 70 },
    { id: 7, name: "dom_tree", size: "410 KB", isGarbage: false, x: 180, y: 70 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NEMI_THEME.colors.bg.cream,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "70px 40px 60px 40px",
        fontFamily: NEMI_THEME.typography.fontDisplay,
      }}
    >
      {/* Subtle Engineering Dot Grid Texture */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            radial-gradient(#CBD5E1 1.5px, transparent 1.5px),
            radial-gradient(circle at 80% 20%, rgba(255, 209, 102, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)
          `,
          backgroundSize: "32px 32px, 100% 100%, 100% 100%",
          zIndex: 0,
        }}
      />

      {/* Top Header: Brand Pill & Curiosity Hook */}
      <div style={{ zIndex: 10, textAlign: "center", width: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 24px",
            borderRadius: "9999px",
            backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "16px" }}>⚡</span>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 900,
              letterSpacing: "2px",
              color: NEMI_THEME.colors.brand.yellow,
              fontFamily: NEMI_THEME.typography.fontHeading,
            }}
          >
            NEMI EXPLAINS
          </span>
          <span style={{ color: "#64748B", fontSize: "14px" }}>|</span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#94A3B8" }}>
            HOW IT WORKS
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "46px",
            fontWeight: 900,
            lineHeight: "1.15",
            color: NEMI_THEME.colors.text.headingDark,
            letterSpacing: "-1px",
          }}
        >
          {frame < 150
            ? "How V8 Cleans 16GB of RAM in 2ms"
            : frame < 450
            ? "Phase 1: The Root Laser Trace"
            : frame < 630
            ? "Phase 2: Sweeping the Garbage"
            : "Compacted Contiguous RAM ⚡"}
        </h1>
        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: "22px",
            color: NEMI_THEME.colors.text.bodyMuted,
            fontWeight: 600,
          }}
        >
          {frame < 150
            ? "Your CPU creates millions of objects. How does it delete them?"
            : frame < 450
            ? "Laser sweeps from Root pointers (Window & Global)"
            : frame < 630
            ? "Orphaned memory with 0 references is wiped out"
            : "Compacted into high-speed CPU cache lines"}
        </p>
      </div>

      {/* Center Stage: Dark Charcoal Exploded Diagram Box */}
      <div
        style={{
          zIndex: 10,
          width: "940px",
          height: "860px",
          borderRadius: "32px",
          backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
          border: "2px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 30px 70px -15px rgba(0, 0, 0, 0.35)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FFD166" }} />
            <span
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#94A3B8",
                letterSpacing: "1.5px",
                fontFamily: NEMI_THEME.typography.fontHeading,
              }}
            >
              V8 ENGINE HEAP MEMORY (64-BIT)
            </span>
          </div>

          <span
            style={{
              fontSize: "13px",
              fontWeight: 800,
              color: frame < 150 ? "#FBBF24" : frame < 450 ? "#22D3EE" : "#34D399",
              padding: "6px 14px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontFamily: NEMI_THEME.typography.fontHeading,
            }}
          >
            {frame < 150 ? "● HEAP ACTIVE" : frame < 450 ? "⚡ LASER SCANNING" : "✔ COMPACTED"}
          </span>
        </div>

        {/* The Animated Sweeping Laser Beam in Phase 2 */}
        {frame >= 150 && frame <= 450 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "4px",
              transform: `translateX(${laserX}px)`,
              backgroundColor: NEMI_THEME.colors.brand.cyan,
              boxShadow: "0 0 35px #22D3EE, 0 0 70px #06B6D4",
              zIndex: 20,
            }}
          />
        )}

        {/* Memory Object Cards */}
        <div style={{ position: "relative", width: "800px", height: "500px" }}>
          {memoryBlocks.map((b) => {
            const isScanned = frame >= 150 && laserX >= b.x;
            const isSwept = frame >= 450 && b.isGarbage;

            if (isSwept && frame >= 520) return null;

            const dissolveOpacity = isSwept ? interpolate(frame, [450, 520], [1, 0]) : 1;
            const dissolveScale = isSwept ? interpolate(frame, [450, 520], [1, 0.3]) : 1;

            let borderColor = "rgba(255, 255, 255, 0.12)";
            let bgColor = "rgba(255, 255, 255, 0.04)";
            let glow = "none";
            let textColor = "#F8FAFC";

            if (frame >= 150 && isScanned) {
              if (b.isGarbage) {
                borderColor = NEMI_THEME.colors.brand.coral;
                bgColor = "rgba(244, 63, 94, 0.25)";
                glow = "0 0 30px rgba(244, 63, 94, 0.5)";
                textColor = "#FB7185";
              } else {
                borderColor = NEMI_THEME.colors.brand.emerald;
                bgColor = "rgba(16, 185, 129, 0.25)";
                glow = "0 0 30px rgba(16, 185, 129, 0.5)";
                textColor = "#34D399";
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
                  height: "105px",
                  borderRadius: "22px",
                  backgroundColor: bgColor,
                  border: `2px solid ${borderColor}`,
                  boxShadow: glow,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  opacity: dissolveOpacity,
                  transform: `scale(${dissolveScale})`,
                  transition: "border 0.2s, background 0.2s",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 900,
                    color: isScanned && b.isGarbage ? "#FB7185" : isScanned ? "#34D399" : "#64748B",
                    letterSpacing: "1px",
                    fontFamily: NEMI_THEME.typography.fontHeading,
                  }}
                >
                  {isScanned && b.isGarbage ? "0 REFERENCES" : isScanned ? "ACTIVE NODE" : b.size}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: textColor,
                    fontFamily: NEMI_THEME.typography.fontCode,
                  }}
                >
                  {b.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Phase Sub-Banner Inside Diagram */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 32,
            right: 32,
            padding: "16px 24px",
            borderRadius: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "18px", color: "#F8FAFC", fontWeight: 600 }}>
            {frame < 150
              ? "RAM gets fragmented as variables fall out of scope."
              : frame < 450
              ? "Mark Phase: DFS graph traversal traces all live variables."
              : frame < 630
              ? "Sweep Phase: Unreachable memory is freed back to the OS."
              : "Compaction: Live memory is packed to stop memory fragmentation."}
          </span>
          <span style={{ fontSize: "14px", fontWeight: 800, color: NEMI_THEME.colors.brand.yellow }}>
            {frame < 450 ? "LATENCY: ~1.2ms" : "FREED: 42.8 MB"}
          </span>
        </div>
      </div>

      {/* Bottom Row: Nemi Mascot Interaction & CTA */}
      <div
        style={{
          zIndex: 10,
          width: "940px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Nemi Mascot with Dynamic Pose */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <NemiMascot pose={currentPose} scale={0.9} />
          <div
            style={{
              padding: "14px 24px",
              borderRadius: "20px",
              backgroundColor: "#FFFFFF",
              border: "2px solid rgba(0,0,0,0.08)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
              maxWidth: "380px",
            }}
          >
            <span
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: NEMI_THEME.colors.text.headingDark,
                lineHeight: "1.3",
              }}
            >
              {currentPose === "puzzled"
                ? "“Wait... how does it know what to delete?”"
                : currentPose === "thinking"
                ? "“The root pointer scanner is active!”"
                : currentPose === "aha"
                ? "“Boom! 42MB wiped in 2 milliseconds!”"
                : "“Clean memory = fast code. Save this!”"}
            </span>
          </div>
        </div>

        {/* Brand & Save Tag */}
        <div
          style={{
            padding: "14px 28px",
            borderRadius: "9999px",
            backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          }}
        >
          <span style={{ fontSize: "20px" }}>📌</span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: NEMI_THEME.typography.fontHeading,
            }}
          >
            @nemi.explains
          </span>
        </div>
      </div>

      {/* Full Master Audio Mix (Neural Voiceover + Synthwave Goose - Blade Runner 2049) */}
      <Audio src={staticFile("sounds/final_audio_mix.mp3")} volume={1.0} />
    </AbsoluteFill>
  );
};
