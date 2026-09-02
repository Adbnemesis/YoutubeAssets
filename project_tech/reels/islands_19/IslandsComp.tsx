import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { NemiMascot, NemiPose } from "../../src/components/NemiMascot";
import timelineData from "./timeline.json";

export const nemiTheme = {
  colors: {
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandGreen: "#10B981",
    brandRed: "#EF4444",
    brandAmber: "#F59E0B",
    brandPurple: "#A855F7",
    brandBlue: "#3B82F6",
    textHeadingDark: "#0F172A",
    textHeadingLight: "#F8FAFC",
    textMutedLight: "#64748B",
    textMutedDark: "#94A3B8",
    cardDark: "#0B1120",
    borderDark: "rgba(255, 255, 255, 0.12)",
    borderLight: "#E2E8F0",
  },
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
  },
};

export const IslandsComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = timelineData.total_frames || 662;

  // ─── Stage Timing Cut Points (Strict 22.08s / 662 frames) ───
  const cutB = 142; // Nemi Double Count Question -> Dark Mode
  const cutC = 202; // "Sink It!" & Scanner Hits Island 1
  const cutD = 335; // DFS Flood Wave Sinks Island 1
  const cutE = 445; // Clean Sweep Across Islands 2 & 3
  const cutF = 530; // LeetCode 200 O(M*N) Victory

  // ─── Smooth Background Crossfade (Light <-> Dark) ───
  const darkOpacity = interpolate(
    frame,
    [cutB - 10, cutB + 8, cutF - 10, cutF + 8],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const isDarkWorld = darkOpacity > 0.5;

  const titleColor = interpolateColors(darkOpacity, [0, 1], ["#0F172A", "#F8FAFC"]);
  const hudBg = interpolateColors(darkOpacity, [0, 1], ["#FFFFFF", "#0F172A"]);
  const hudBorder = interpolateColors(darkOpacity, [0, 1], ["#E2E8F0", "rgba(255, 255, 255, 0.14)"]);
  const hudTextColor = interpolateColors(darkOpacity, [0, 1], ["#0F172A", "#F8FAFC"]);

  // Camera Zoom Ramp (High Energy)
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "thinking";
  } else if (frame < cutC) {
    nemiPose = "puzzled";
    nemiSpeech = "Won't we count the same island ten times? 🤔";
  } else if (frame < cutD) {
    nemiPose = "explaining";
  } else if (frame < cutE) {
    nemiPose = "aha";
  } else if (frame < cutF) {
    nemiPose = "smug";
    nemiSpeech = "So the island vanishes, and we never double-count it! 😎⚡";
  } else {
    nemiPose = "smug";
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: nemiTheme.colors.canvasLight,
        fontFamily: nemiTheme.typography.fontFamily.sans,
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
        transformOrigin: "center center",
      }}
    >
      {/* Dark World Layer */}
      <AbsoluteFill
        style={{
          backgroundColor: nemiTheme.colors.canvasDark,
          opacity: darkOpacity,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Master Audio Track */}
      <Audio src={staticFile("reels/islands_19/voiceover.mp3")} volume={1.0} />

      {/* Synchronized SFX */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutB} durationInFrames={25}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutC} durationInFrames={30}>
        <Audio src={staticFile("sfx/error.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={cutD} durationInFrames={30}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutF} durationInFrames={35}>
        <Audio src={staticFile("sfx/anime-wow.mp3")} volume={0.8} />
      </Sequence>

      {/* Ambient Glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: darkOpacity }}>
        <div
          style={{
            position: "absolute",
            top: 250,
            left: -100,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 600,
            right: -100,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* TOP HUD (Safe Zone: top: 85px) */}
      <div
        style={{
          position: "absolute",
          top: 85,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: isDarkWorld ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandBlue,
              boxShadow: `0 0 20px ${isDarkWorld ? "#10B981" : "#3B82F6"}`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: isDarkWorld ? "#10B981" : "#2563EB",
            }}
          >
            LeetCode 200
          </span>
        </div>

        <div
          style={{
            backgroundColor: hudBg,
            padding: "10px 22px",
            borderRadius: 24,
            border: `2px solid ${hudBorder}`,
            fontSize: 20,
            fontWeight: 900,
            color: hudTextColor,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {frame < cutB
            ? "2D MATRIX EXPLORATION"
            : frame < cutC
            ? "DOUBLE-COUNT TRAP"
            : frame < cutD
            ? "SINK THE ISLAND"
            : frame < cutE
            ? "DFS FLOOD WAVE"
            : "O(M×N) LINEAR SWEEP"}
        </div>
      </div>

      {/* MAIN HEADLINE TITLE (Safe Zone: top: 165px) */}
      <div
        style={{
          position: "absolute",
          top: 165,
          left: 70,
          right: 70,
          textAlign: "center",
          zIndex: 55,
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            letterSpacing: -1.5,
            lineHeight: 1.15,
            color: titleColor,
          }}
        >
          {frame < cutB ? (
            <>
              How To Count Islands In <span style={{ color: nemiTheme.colors.brandGreen }}>Just 1 Pass?</span> 🏝️⚡
            </>
          ) : frame < cutC ? (
            <>
              Won't We Count The <span style={{ color: nemiTheme.colors.brandRed }}>Same Island 10 Times?</span> ⚠️
            </>
          ) : frame < cutD ? (
            <>
              Touch A Land Tile? <span style={{ color: nemiTheme.colors.brandCyan }}>Sink The Island!</span> 🌊
            </>
          ) : frame < cutE ? (
            <>
              DFS Flood Wave <span style={{ color: nemiTheme.colors.brandGreen }}>Turns Land To Water!</span> 💧
            </>
          ) : (
            <>
              All Islands Counted In <span style={{ color: nemiTheme.colors.brandGreen }}>O(M × N) Time!</span> 👑
            </>
          )}
        </div>
      </div>

      {/* DYNAMIC 2D ISLAND MATRIX CANVAS */}
      <DynamicIslandMatrix frame={frame} cutB={cutB} cutC={cutC} cutD={cutD} cutE={cutE} cutF={cutF} />

      {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
      {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} />}

      {/* HERO MASCOT DOCK (Safe Zone: bottom: 70px) */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 60,
        }}
      >
        <NemiMascot pose={nemiPose} scale={1.65} />
      </div>

      {/* NEMI SPEECH BUBBLE (bottom: 440px) */}
      {nemiSpeech && (
        <div
          style={{
            position: "absolute",
            bottom: 440,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90%",
            maxWidth: 920,
          }}
        >
          <div
            style={{
              backgroundColor: nemiTheme.colors.brandYellow,
              color: "#18181B",
              fontWeight: 900,
              fontSize: 28,
              lineHeight: 1.3,
              padding: "16px 32px",
              borderRadius: 26,
              border: "3.5px solid #18181B",
              boxShadow: "0 18px 45px rgba(0, 0, 0, 0.45)",
              textAlign: "center",
            }}
          >
            {nemiSpeech}
          </div>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "14px solid #18181B",
              marginTop: -2,
            }}
          />
        </div>
      )}

      {/* CHANNEL WATERMARK */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          fontSize: 16,
          fontWeight: 800,
          color: isDarkWorld ? "rgba(255, 255, 255, 0.35)" : "rgba(15, 23, 42, 0.35)",
          letterSpacing: "0.5px",
          zIndex: 40,
        }}
      >
        @nemi.explains
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC 2D ISLAND MATRIX COMPONENT
// ═══════════════════════════════════════════════════════════════
interface MatrixProps {
  frame: number;
  cutB: number;
  cutC: number;
  cutD: number;
  cutE: number;
  cutF: number;
}

const DynamicIslandMatrix: React.FC<MatrixProps> = ({ frame, cutB, cutC, cutD, cutE, cutF }) => {
  // 5x5 Grid Matrix Layout
  // Island 1: (0,0), (0,1), (1,0), (1,1) [Top-Left 2x2]
  // Island 2: (0,4), (1,4), (2,4) [Top-Right 3x1]
  // Island 3: (3,1), (3,2), (4,2) [Bottom-Middle]

  // Island Count dynamically increments
  let islandCount = 0;
  if (frame >= cutC + 20 && frame < cutE) {
    islandCount = 1;
  } else if (frame >= cutE && frame < cutE + 40) {
    islandCount = 2;
  } else if (frame >= cutE + 40) {
    islandCount = 3;
  }

  // Island 1 Sink Status
  const isIsland1Sunk = frame >= cutD + 30;
  const isIsland2Sunk = frame >= cutE + 35;
  const isIsland3Sunk = frame >= cutE + 65;

  // Scanner Coordinates [row, col]
  let scanRow = 0;
  let scanCol = 0;

  if (frame < cutC) {
    scanRow = Math.floor((frame / cutC) * 5);
    scanCol = Math.floor(((frame * 2) % cutC) / (cutC / 5));
  } else if (frame < cutD) {
    // Locked at Island 1 start: (0,0)
    scanRow = 0;
    scanCol = 0;
  } else if (frame < cutE) {
    // DFS Ripple on Island 1
    scanRow = 1;
    scanCol = 1;
  } else {
    // Sweeping through rest
    const p = interpolate(frame, [cutE, cutF], [0, 24], { extrapolateRight: "clamp" });
    scanRow = Math.min(4, Math.floor(p / 5));
    scanCol = Math.min(4, Math.floor(p % 5));
  }

  // Grid Data [5 rows x 5 cols]
  const initialGrid = [
    [1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ];

  return (
    <div style={{ position: "absolute", top: 340, left: 70, right: 70, height: 600, zIndex: 30 }}>
      {/* ISLAND COUNTER SCORECARD BANNER (top: 0px) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: frame >= cutB ? "#0B1120" : "#FFFFFF",
          padding: "16px 28px",
          borderRadius: 22,
          border: `2.5px solid ${frame >= cutB ? "#10B981" : "#E2E8F0"}`,
          boxShadow: "0 12px 35px rgba(0,0,0,0.1)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🏝️</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: frame >= cutB ? "#F8FAFC" : "#0F172A" }}>
            ISLANDS FOUND:
          </span>
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: "#10B981",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            textShadow: "0 0 15px rgba(16, 185, 129, 0.6)",
          }}
        >
          {islandCount} ⚡
        </div>
      </div>

      {/* 5x5 GRID MATRIX DISPLAY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 14,
          padding: 22,
          backgroundColor: frame >= cutB ? "#030712" : "#F1F5F9",
          borderRadius: 28,
          border: `3px solid ${frame >= cutB ? "rgba(6, 182, 212, 0.4)" : "#CBD5E1"}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        {initialGrid.map((row, rIdx) =>
          row.map((val, cIdx) => {
            // Determine if this cell belongs to Island 1, 2, or 3
            const isIsland1 = (rIdx === 0 && cIdx === 0) || (rIdx === 0 && cIdx === 1) || (rIdx === 1 && cIdx === 0) || (rIdx === 1 && cIdx === 1);
            const isIsland2 = (rIdx === 0 && cIdx === 4) || (rIdx === 1 && cIdx === 4) || (rIdx === 2 && cIdx === 4);
            const isIsland3 = (rIdx === 3 && cIdx === 1) || (rIdx === 3 && cIdx === 2) || (rIdx === 4 && cIdx === 2);

            let isSunk = false;
            if (isIsland1 && isIsland1Sunk) isSunk = true;
            if (isIsland2 && isIsland2Sunk) isSunk = true;
            if (isIsland3 && isIsland3Sunk) isSunk = true;

            const isLand = val === 1 && !isSunk;
            const isCurrentlyScanning = rIdx === scanRow && cIdx === scanCol;
            const isFlooding = frame >= cutD && frame < cutD + 30 && isIsland1;

            return (
              <div
                key={`${rIdx}_${cIdx}`}
                style={{
                  height: 76,
                  borderRadius: 18,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isFlooding
                    ? "rgba(6, 182, 212, 0.6)"
                    : isLand
                    ? "#10B981"
                    : isSunk
                    ? "rgba(6, 182, 212, 0.2)"
                    : frame >= cutB
                    ? "#0F172A"
                    : "#E2E8F0",
                  border: isCurrentlyScanning
                    ? "4px solid #FFD166"
                    : isLand
                    ? "3px solid #6EE7B7"
                    : "2px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: isCurrentlyScanning
                    ? "0 0 25px #FFD166"
                    : isLand
                    ? "0 8px 20px rgba(16, 185, 129, 0.4)"
                    : "none",
                  transform: isCurrentlyScanning ? "scale(1.08)" : isFlooding ? "scale(0.95)" : "scale(1.0)",
                  transition: "all 0.15s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Value Display */}
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    fontFamily: nemiTheme.typography.fontFamily.mono,
                    color: isLand ? "#FFFFFF" : isSunk ? "#06B6D4" : frame >= cutB ? "#64748B" : "#94A3B8",
                  }}
                >
                  {isLand ? "1" : "0"}
                </span>

                {/* Subtitle label */}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: isLand ? "#D1FAE5" : isSunk ? "#06B6D4" : "#64748B",
                    letterSpacing: "0.5px",
                  }}
                >
                  {isLand ? "LAND" : isSunk ? "SUNK 🌊" : "WATER"}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* FLOATING COMPLEXITY BADGE (top: 530px) */}
      <div
        style={{
          marginTop: 24,
          backgroundColor: frame >= cutB ? "#0B1120" : "#FFFFFF",
          padding: "16px 28px",
          borderRadius: 20,
          border: `2.5px solid ${frame >= cutB ? "#06B6D4" : "#E2E8F0"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <span style={{ color: frame >= cutB ? "#94A3B8" : "#64748B", fontSize: 18, fontWeight: 700 }}>
          Time Complexity:
        </span>
        <span
          style={{
            color: "#10B981",
            fontWeight: 900,
            fontSize: 24,
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          O(M × N) Linear Sweep ⚡
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px)
// ═══════════════════════════════════════════════════════════════
const DynamicKaraokeCaptions: React.FC<{ frame: number }> = ({ frame }) => {
  const subtitles = timelineData.subtitles || [];

  const currentChunk = subtitles.find((chunk: any, idx: number) => {
    const nextChunk = subtitles[idx + 1];
    const untilFrame = nextChunk ? nextChunk.start_frame : chunk.end_frame + 6;
    return frame >= chunk.start_frame && frame < untilFrame;
  });

  if (!currentChunk) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 1140,
        left: 65,
        right: 65,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 80,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(10, 15, 30, 0.92)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          border: "2px solid rgba(16, 185, 129, 0.55)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(16, 185, 129, 0.25)",
          padding: "14px 28px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          maxWidth: 920,
        }}
      >
        {currentChunk.words.map((w: any, idx: number) => {
          const isWordActive = frame >= w.start_frame && frame <= w.end_frame + 1;
          const activeColor = idx % 2 === 0 ? "#FFD166" : "#10B981";

          return (
            <span
              key={`${w.word}_${idx}`}
              style={{
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: isWordActive ? activeColor : "#F8FAFC",
                textShadow: isWordActive
                  ? `0 0 20px ${activeColor}, 0 2px 4px #000000`
                  : "0 2px 6px rgba(0,0,0,0.8)",
                display: "inline-block",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
