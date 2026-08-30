import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
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

// LeetCode 42 Standard Elevation Profile
// Array: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
// Water trapped: [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0] = 6 units
const ELEVATION = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
const WATER = [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0];

export const RainWaterComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = timelineData.total_frames || 718;

  // ─── Stage Boundaries ───
  const cutB = 89;   // Nemi question -> dark mode
  const cutC = 187;  // Memory trap
  const cutD = 325;  // Bottleneck law
  const cutE = 445;  // Simulation
  const cutCollision = 535; // BAM! Pointers meet
  const cutF = 558;  // Victory -> light mode
  const cutG = 639;  // Loop seam

  // ─── Smooth Background Theme ───
  const isDarkWorld = frame >= cutB && frame < cutF;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;

  // ─── Camera Breathing ───
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.025], {
    extrapolateRight: "clamp",
  });

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "thinking";
  } else if (frame < cutC) {
    nemiPose = "puzzled";
    nemiSpeech = "Can't we just create two arrays for Left-Max and Right-Max? 🤔";
  } else if (frame < cutD) {
    nemiPose = "shocked";
  } else if (frame < cutE) {
    nemiPose = "explaining";
  } else if (frame < cutCollision) {
    nemiPose = "pointing";
  } else if (frame < cutF) {
    nemiPose = "aha";
  } else if (frame < cutG + 20) {
    nemiPose = "smug";
    nemiSpeech = "Zero extra memory and 6 lines of code! 😎⚡";
  } else {
    nemiPose = "smug";
  }

  // Collision impact flash
  const collisionImpact =
    frame >= 535 && frame < 541
      ? interpolate(frame, [535, 537, 541], [0, 0.7, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: canvasBg,
        fontFamily: nemiTheme.typography.fontFamily.sans,
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
        transformOrigin: "center center",
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Voice + Ducked BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/rainwater_16/voiceover.mp3")} volume={1.0} />

      {/* Synchronized SFX Layer */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutB} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutC} durationInFrames={30}>
        <Audio src={staticFile("sfx/error.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={cutD} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutE} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={490} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={cutCollision} durationInFrames={40}>
        <Audio src={staticFile("sfx/anime-wow.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={cutF} durationInFrames={40}>
        <Audio src={staticFile("sfx/chime.mp3")} volume={0.65} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* AMBIENT BACKGROUND GLOW (DARK WORLD) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isDarkWorld && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
          <div
            style={{
              position: "absolute",
              top: 250,
              left: -100,
              width: 700,
              height: 700,
              borderRadius: "50%",
              background: frame < cutD
                ? "radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 70%)",
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
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, transparent 70%)",
              filter: "blur(100px)",
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP HUD (Safe Zone: top: 85px) */}
      {/* ══════════════════════════════════════════════════════════ */}
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
              backgroundColor: isDarkWorld
                ? (frame >= cutD ? nemiTheme.colors.brandCyan : nemiTheme.colors.brandRed)
                : nemiTheme.colors.brandBlue,
              boxShadow: `0 0 20px ${isDarkWorld ? (frame >= cutD ? "#06B6D4" : "#EF4444") : "#3B82F6"}`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: isDarkWorld ? (frame >= cutD ? "#06B6D4" : "#EF4444") : "#2563EB",
            }}
          >
            Ep.16 · Trapping Rain Water
          </span>
        </div>

        <div
          style={{
            backgroundColor: isDarkWorld ? "rgba(15, 23, 42, 0.94)" : "#FFFFFF",
            padding: "10px 22px",
            borderRadius: 24,
            border: `2px solid ${isDarkWorld ? nemiTheme.colors.borderDark : nemiTheme.colors.borderLight}`,
            fontSize: 20,
            fontWeight: 900,
            color: isDarkWorld ? "#F8FAFC" : "#0F172A",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {frame < cutB
            ? "THE 2D TERRAIN"
            : frame < cutC
            ? "PREFIX ARRAY TRAP"
            : frame < cutD
            ? "O(N) RAM WASTE"
            : frame < cutE
            ? "BOTTLENECK LAW"
            : frame < cutCollision
            ? "2-POINTER WATERFILL"
            : frame < cutF
            ? "PEAK COLLISION"
            : "O(1) SPACE VICTORY"}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MAIN HEADLINE TITLE (Safe Zone: top: 165px) */}
      {/* ══════════════════════════════════════════════════════════ */}
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
            color: isDarkWorld ? "#F8FAFC" : nemiTheme.colors.textHeadingDark,
          }}
        >
          {frame < cutB ? (
            <>
              How Much Rain Water Is <span style={{ color: nemiTheme.colors.brandBlue }}>Trapped Here?</span> 🌧️
            </>
          ) : frame < cutC ? (
            <>
              Can We Just Build <span style={{ color: nemiTheme.colors.brandYellow }}>Left-Max & Right-Max?</span> 🤔
            </>
          ) : frame < cutD ? (
            <>
              Two Arrays = <span style={{ color: nemiTheme.colors.brandRed }}>O(N) Memory Waste!</span> 💥
            </>
          ) : frame < cutE ? (
            <>
              Water Is Trapped By The <span style={{ color: nemiTheme.colors.brandCyan }}>Shorter Wall!</span> 🌊
            </>
          ) : frame < cutCollision ? (
            <>
              Two Pointers <span style={{ color: nemiTheme.colors.brandCyan }}>Fill Every Valley Inward!</span> ⚡
            </>
          ) : frame < cutF ? (
            <>
              💥 <span style={{ color: nemiTheme.colors.brandAmber }}>BAM! 6 UNITS OF WATER TRAPPED!</span>
            </>
          ) : (
            <>
              Solved in <span style={{ color: nemiTheme.colors.brandGreen }}>O(1) Space</span> &{" "}
              <span style={{ color: nemiTheme.colors.brandCyan }}>O(N) Time!</span> 👑
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* OPEN-CANVAS SPATIAL VISUAL STAGES (Safe Zone: top: 290px to 1050px) */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* STAGE 1: OPEN 2D TERRAIN WITH RAIN (0 to 89) */}
      {frame < cutB && <OpenVisual1_TerrainRain frame={frame} />}

      {/* STAGE 2: HASH / ARRAY ALLOCATION TRAP (89 to 325) */}
      {frame >= cutB && frame < cutD && <OpenVisual2_ArrayAllocationTrap frame={frame} cutC={cutC} />}

      {/* STAGE 3: THE SHORTER WALL BOTTLENECK LAW (325 to 445) */}
      {frame >= cutD && frame < cutE && <OpenVisual3_BottleneckLaw frame={frame} />}

      {/* STAGE 4: TWO POINTER WATERFILL SIMULATION (445 to 558) */}
      {frame >= cutE && frame < cutF && <OpenVisual4_TwoPointerWaterfill frame={frame} cutCollision={cutCollision} />}

      {/* STAGE 5: VICTORY PYTHON CODE & COMPLEXITY (558 to 718) */}
      {frame >= cutF && <OpenVisual5_VictoryCode frame={frame} cutF={cutF} />}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} />}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* HERO MASCOT DOCK (Safe Zone: bottom: 70px) */}
      {/* ══════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════ */}
      {/* NEMI SPEECH BUBBLE (Strictly at bottom: 440px) */}
      {/* ══════════════════════════════════════════════════════════ */}
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
          }}
        >
          <div
            style={{
              backgroundColor: nemiTheme.colors.brandYellow,
              color: "#18181B",
              fontWeight: 900,
              fontSize: 32,
              padding: "16px 36px",
              borderRadius: 26,
              border: "3.5px solid #18181B",
              boxShadow: "0 18px 45px rgba(0, 0, 0, 0.45)",
              whiteSpace: "nowrap",
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

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CHANNEL WATERMARK */}
      {/* ══════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TACTILE COLLISION FLASH */}
      {/* ══════════════════════════════════════════════════════════ */}
      {collisionImpact > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFFFFF",
            opacity: collisionImpact,
            pointerEvents: "none",
            zIndex: 99,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 1. STAGE 1: OPEN 2D TERRAIN WITH RAIN (0 to 89)
// ═══════════════════════════════════════════════════════════════
const OpenVisual1_TerrainRain: React.FC<{ frame: number }> = ({ frame }) => {
  const rainOffset = (frame * 18) % 300;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Challenge Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FFFFFF",
          border: "2px solid #3B82F6",
          borderRadius: 999,
          padding: "10px 28px",
          boxShadow: "0 8px 25px rgba(59, 130, 246, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 22 }}>🌧️</span>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#1D4ED8", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          LEETCODE 42: CALCULATE TRAPPED WATER IN O(1) SPACE
        </span>
      </div>

      {/* SVG 2D Elevation Terrain */}
      <div style={{ position: "absolute", top: 400, left: 70, right: 70, height: 480 }}>
        <svg width="940" height="480" viewBox="0 0 940 480">
          <defs>
            <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.85)" />
              <stop offset="100%" stopColor="rgba(37, 99, 235, 0.95)" />
            </linearGradient>
          </defs>

          {/* Animated Rain Particles */}
          {Array.from({ length: 24 }, (_, i) => {
            const rx = 40 + (i * 38);
            const ry = ((i * 45 + rainOffset) % 360);
            return (
              <line
                key={i}
                x1={rx}
                y1={ry}
                x2={rx - 8}
                y2={ry + 24}
                stroke="#60A5FA"
                strokeWidth="2.5"
                opacity="0.6"
              />
            );
          })}

          {/* Base Platform Line */}
          <line x1="30" y1="420" x2="910" y2="420" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

          {/* 12 Elevation Columns + Trapped Water Blocks */}
          {ELEVATION.map((h, i) => {
            const x = 50 + i * 72;
            const unitH = 100;
            const barH = h * unitH;
            const barY = 420 - barH;
            const wH = WATER[i] * unitH;
            const wY = barY - wH;

            return (
              <g key={i}>
                {/* Trapped Water Block */}
                {wH > 0 && (
                  <rect
                    x={x}
                    y={wY}
                    width="62"
                    height={wH}
                    rx="6"
                    fill="url(#waterGrad)"
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                )}

                {/* Stone Elevation Pillar */}
                {h > 0 && (
                  <rect
                    x={x}
                    y={barY}
                    width="62"
                    height={barH}
                    rx="8"
                    fill="url(#stoneGrad)"
                    stroke="#475569"
                    strokeWidth="2.5"
                  />
                )}

                {/* Index Label */}
                <text x={x + 31} y="450" fill="#64748B" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  {i}
                </text>
                {/* Height Label */}
                {h > 0 && (
                  <text x={x + 31} y={barY + 28} fill="#FFFFFF" fontSize="18" fontWeight="900" textAnchor="middle">
                    {h}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Bottom Callout Banner */}
      <div
        style={{
          position: "absolute",
          top: 940,
          left: 80,
          right: 80,
          backgroundColor: "#FFFFFF",
          padding: "16px 28px",
          borderRadius: 20,
          border: "2px solid #E2E8F0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#64748B", fontSize: 18, fontWeight: 700 }}>Total Water Trapped:</span>
        <span style={{ color: "#2563EB", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          6 UNITS (VALLEYS BETWEEN PEAKS) 💧
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. STAGE 2: HASH / ARRAY ALLOCATION TRAP (89 to 325)
// ═══════════════════════════════════════════════════════════════
const OpenVisual2_ArrayAllocationTrap: React.FC<{ frame: number; cutC: number }> = ({ frame, cutC }) => {
  const isCrashing = frame >= cutC + 35;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Telemetry Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: isCrashing ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
            border: `2px solid ${isCrashing ? "#EF4444" : "#F59E0B"}`,
            borderRadius: 999,
            padding: "8px 24px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: isCrashing ? "#FCA5A5" : "#FDE68A" }}>
            {isCrashing ? "PREFIX & SUFFIX ARRAY OVERHEAD" : "LEFT-MAX & RIGHT-MAX ARRAYS"}
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: `2px solid ${isCrashing ? "#EF4444" : "#F59E0B"}`,
            borderRadius: 999,
            padding: "8px 24px",
            fontSize: 18,
            fontWeight: 900,
            color: isCrashing ? "#EF4444" : "#F59E0B",
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          {isCrashing ? "O(N) EXTRA RAM WASTE! 💥" : "2N EXTRA MEMORY"}
        </div>
      </div>

      {/* Floating Dual Arrays in Space (top: 370px) */}
      <div style={{ position: "absolute", top: 370, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Left Max Array */}
        <div style={{ backgroundColor: "rgba(15, 23, 42, 0.85)", padding: "16px 20px", borderRadius: 20, border: `2.5px solid ${isCrashing ? "#EF4444" : "#F59E0B"}` }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: isCrashing ? "#EF4444" : "#F59E0B", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <span>left_max[] (Prefix Scan →)</span>
            <span style={{ fontFamily: "monospace" }}>[0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3]</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3].map((val, idx) => (
              <div key={idx} style={{ flex: 1, backgroundColor: "#1E293B", padding: "8px 2px", borderRadius: 8, textAlign: "center", border: "1px solid #475569" }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#FFF" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini 2D Terrain Preview */}
        <div style={{ height: 180, display: "flex", alignItems: "flex-end", gap: 6, padding: "0 10px" }}>
          {ELEVATION.map((h, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: "100%",
                  height: h * 45 + 10,
                  backgroundColor: h > 0 ? "#334155" : "transparent",
                  border: h > 0 ? "2px solid #64748B" : "none",
                  borderRadius: 6,
                }}
              />
              <span style={{ fontSize: 12, color: "#64748B", fontFamily: "monospace" }}>{i}</span>
            </div>
          ))}
        </div>

        {/* Right Max Array */}
        <div style={{ backgroundColor: "rgba(15, 23, 42, 0.85)", padding: "16px 20px", borderRadius: 20, border: `2.5px solid ${isCrashing ? "#EF4444" : "#A855F7"}` }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: isCrashing ? "#EF4444" : "#A855F7", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <span>right_max[] (Suffix Scan ←)</span>
            <span style={{ fontFamily: "monospace" }}>[3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1]</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1].map((val, idx) => (
              <div key={idx} style={{ flex: 1, backgroundColor: "#1E293B", padding: "8px 2px", borderRadius: 8, textAlign: "center", border: "1px solid #475569" }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#FFF" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Callout Banner (top: 890px) */}
      <div
        style={{
          position: "absolute",
          top: 890,
          left: 70,
          right: 70,
          backgroundColor: isCrashing ? "rgba(239, 68, 68, 0.25)" : "#0F172A",
          padding: "18px 28px",
          borderRadius: 20,
          border: `2px solid ${isCrashing ? "#EF4444" : "#475569"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>
          {isCrashing ? "❌ Aux Array Space Overhead:" : "Requires 2 separate arrays:"}
        </span>
        <span style={{ color: isCrashing ? "#EF4444" : "#F59E0B", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isCrashing ? "O(N) EXTRA RAM (NOT OPTIMAL!)" : "O(N) SPACE"}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. STAGE 3: THE SHORTER WALL BOTTLENECK LAW (325 to 445)
// ═══════════════════════════════════════════════════════════════
const OpenVisual3_BottleneckLaw: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.25);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Caliper Status Cards */}
      <div style={{ position: "absolute", top: 320, left: 70, right: 70, display: "flex", gap: 24 }}>
        {/* Left Max Caliper */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(6, 182, 212, 0.16)",
            border: "3px solid #06B6D4",
            borderRadius: 28,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: "0 16px 45px rgba(6, 182, 212, 0.35)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 44 }}>👈</span>
            <span style={{ backgroundColor: "#06B6D4", color: "#000", fontSize: 18, fontWeight: 900, padding: "6px 16px", borderRadius: 14 }}>
              LEFT MAX = 2
            </span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#FFF" }}>Shorter Wall! ⚠️</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#67E8F9" }}>Water height is bottlenecked!</div>
        </div>

        {/* Right Max Caliper */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(168, 85, 247, 0.16)",
            border: "3px solid #A855F7",
            borderRadius: 28,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: "0 16px 45px rgba(168, 85, 247, 0.35)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 44 }}>👉</span>
            <span style={{ backgroundColor: "#A855F7", color: "#FFF", fontSize: 18, fontWeight: 900, padding: "6px 16px", borderRadius: 14 }}>
              RIGHT MAX = 3
            </span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#FFF" }}>Taller Wall! 🛡️</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#D8B4FE" }}>Guarantees containment!</div>
        </div>
      </div>

      {/* Hydraulic Water Level Equation (top: 590px) */}
      <div style={{ position: "absolute", top: 590, left: 70, right: 70, height: 260 }}>
        <svg width="940" height="260" viewBox="0 0 940 260">
          <rect x="120" y="40" width="700" height="180" rx="24" fill="#0B1120" stroke="#06B6D4" strokeWidth="3" />
          <text x="470" y="90" fill="#67E8F9" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            IF left_max &lt; right_max:
          </text>
          <text x="470" y="145" fill="#FFD166" fontSize="32" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            Water = left_max - height[L] 💧
          </text>
          <text x="470" y="190" fill="#94A3B8" fontSize="18" fontWeight="700" textAnchor="middle">
            (Right wall is strictly taller, so water cannot spill right!)
          </text>
        </svg>
      </div>

      {/* Floating Rule Banner (top: 890px) */}
      <div
        style={{
          position: "absolute",
          top: 890,
          left: 70,
          right: 70,
          backgroundColor: "#03070D",
          padding: "20px 32px",
          borderRadius: 24,
          border: "2.5px solid #06B6D4",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 16px 45px rgba(6, 182, 212, 0.25)",
          transform: `scale(${1 + pulse * 0.02})`,
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 800 }}>Core Two-Pointer Rule:</span>
        <span style={{ color: "#FFD166", fontWeight: 900, fontSize: 26, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ALWAYS ADVANCE THE SHORTER POINTER! ⚡
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STAGE 4: TWO POINTER WATERFILL SIMULATION (445 to 558)
// ═══════════════════════════════════════════════════════════════
const OpenVisual4_TwoPointerWaterfill: React.FC<{ frame: number; cutCollision: number }> = ({ frame, cutCollision }) => {
  const isCollision = frame >= cutCollision;

  let lIdx = 2;
  let rIdx = 10;
  let waterAccum = 1;

  if (frame >= 480 && frame < 515) {
    lIdx = 4;
    rIdx = 9;
    waterAccum = 3;
  } else if (frame >= 515 && frame < cutCollision) {
    lIdx = 6;
    rIdx = 8;
    waterAccum = 5;
  } else if (frame >= cutCollision) {
    lIdx = 7;
    rIdx = 7;
    waterAccum = 6;
  }

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Simulation Telemetry */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: isCollision ? "rgba(245, 158, 11, 0.25)" : "rgba(6, 182, 212, 0.25)",
            border: `2px solid ${isCollision ? "#F59E0B" : "#06B6D4"}`,
            borderRadius: 999,
            padding: "10px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 24 }}>{isCollision ? "💥" : "🌊"}</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: isCollision ? "#FDE68A" : "#67E8F9" }}>
            {isCollision ? "BAM! POINTERS MEET AT PEAK [7]!" : "TWO-POINTER HYDRAULIC SIMULATION"}
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: `2px solid ${isCollision ? "#F59E0B" : "#06B6D4"}`,
            borderRadius: 999,
            padding: "10px 24px",
            fontSize: 20,
            fontWeight: 900,
            color: isCollision ? "#F59E0B" : "#67E8F9",
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          {`TRAPPED WATER = ${waterAccum} UNITS 💧`}
        </div>
      </div>

      {/* SVG Active 2D Water Simulation */}
      <div style={{ position: "absolute", top: 400, left: 70, right: 70, height: 480 }}>
        <svg width="940" height="480" viewBox="0 0 940 480">
          <defs>
            <linearGradient id="waterSimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.9)" />
              <stop offset="100%" stopColor="rgba(37, 99, 235, 1.0)" />
            </linearGradient>
          </defs>

          {/* Base Line */}
          <line x1="30" y1="420" x2="910" y2="420" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

          {/* Pillars & Filling Water */}
          {ELEVATION.map((h, i) => {
            const x = 50 + i * 72;
            const unitH = 100;
            const barH = h * unitH;
            const barY = 420 - barH;
            const isFilledNow = (i <= lIdx || i >= rIdx) && WATER[i] > 0;
            const wH = isFilledNow ? WATER[i] * unitH : 0;
            const wY = barY - wH;

            return (
              <g key={i}>
                {/* Water Block */}
                {wH > 0 && (
                  <rect
                    x={x}
                    y={wY}
                    width="62"
                    height={wH}
                    rx="6"
                    fill="url(#waterSimGrad)"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                  />
                )}

                {/* Stone Column */}
                {h > 0 && (
                  <rect
                    x={x}
                    y={barY}
                    width="62"
                    height={barH}
                    rx="8"
                    fill="#1E293B"
                    stroke="#64748B"
                    strokeWidth="2.5"
                  />
                )}

                {/* Pillar Height */}
                {h > 0 && (
                  <text x={x + 31} y={barY + 28} fill="#FFFFFF" fontSize="18" fontWeight="900" textAnchor="middle">
                    {h}
                  </text>
                )}

                {/* Index */}
                <text x={x + 31} y="450" fill="#94A3B8" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  {i}
                </text>
              </g>
            );
          })}

          {/* Pointers L and R */}
          {!isCollision ? (
            <>
              {/* L Pointer */}
              <g transform={`translate(${50 + lIdx * 72 + 31}, 80)`}>
                <rect x="-40" y="-18" width="80" height="36" rx="18" fill="#06B6D4" />
                <text x="0" y="6" fill="#000" fontSize="16" fontWeight="900" textAnchor="middle">L 👉</text>
              </g>
              {/* R Pointer */}
              <g transform={`translate(${50 + rIdx * 72 + 31}, 80)`}>
                <rect x="-40" y="-18" width="80" height="36" rx="18" fill="#F59E0B" />
                <text x="0" y="6" fill="#000" fontSize="16" fontWeight="900" textAnchor="middle">👈 R</text>
              </g>
            </>
          ) : (
            <g transform="translate(554, 80)">
              <rect x="-110" y="-24" width="220" height="48" rx="24" fill="#F59E0B" stroke="#FFF" strokeWidth="3" />
              <text x="0" y="8" fill="#000" fontSize="20" fontWeight="900" textAnchor="middle">💥 L == R PEAK!</text>
            </g>
          )}
        </svg>
      </div>

      {/* Floating Bottom Callout */}
      <div
        style={{
          position: "absolute",
          top: 960,
          left: 70,
          right: 70,
          backgroundColor: "#03070D",
          padding: "18px 28px",
          borderRadius: 22,
          border: "2px solid #06B6D4",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 14px 40px rgba(6, 182, 212, 0.25)",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Linear Single-Pass Convergence:</span>
        <span style={{ color: "#67E8F9", fontWeight: 900, fontSize: 21, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SOLVED IN EXACTLY N STEPS! ✓
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. STAGE 5: OPEN-CANVAS VICTORY PYTHON CODE & COMPLEXITY (558 to 718)
// ═══════════════════════════════════════════════════════════════
const OpenVisual5_VictoryCode: React.FC<{ frame: number; cutF: number }> = ({ frame, cutF }) => {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Victory Header Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FFFFFF",
          border: "2.5px solid #10B981",
          borderRadius: 999,
          padding: "10px 32px",
          boxShadow: "0 12px 35px rgba(16, 185, 129, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 26 }}>🏆</span>
        <span style={{ fontSize: 22, fontWeight: 900, color: "#059669", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Trapping Rain Water Victory
        </span>
      </div>

      {/* Floating Python Code Card (top: 380px) */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 70,
          right: 70,
          backgroundColor: "#0B1120",
          borderRadius: 28,
          border: "3px solid #06B6D4",
          padding: "24px 32px",
          fontFamily: nemiTheme.typography.fontFamily.mono,
          color: "#E2E8F0",
          fontSize: 20,
          lineHeight: 1.55,
          boxShadow: "0 20px 60px rgba(6, 182, 212, 0.25)",
        }}
      >
        <div><span style={{ color: "#F43F5E" }}>def</span> <span style={{ color: "#67E8F9" }}>trap</span>(height):</div>
        <div style={{ paddingLeft: 28 }}>l, r = 0, len(height) - 1</div>
        <div style={{ paddingLeft: 28 }}>l_max, r_max, ans = 0, 0, 0</div>
        <div style={{ paddingLeft: 28 }}><span style={{ color: "#F43F5E" }}>while</span> l &lt; r:</div>
        <div style={{ paddingLeft: 56 }}><span style={{ color: "#F43F5E" }}>if</span> height[l] &lt; height[r]:</div>
        <div style={{ paddingLeft: 84 }}>l_max = max(l_max, height[l])</div>
        <div style={{ paddingLeft: 84 }}>ans += l_max - height[l]; l += 1</div>
        <div style={{ paddingLeft: 56 }}><span style={{ color: "#F43F5E" }}>else</span>:</div>
        <div style={{ paddingLeft: 84 }}>r_max = max(r_max, height[r])</div>
        <div style={{ paddingLeft: 84 }}>ans += r_max - height[r]; r -= 1</div>
        <div style={{ paddingLeft: 28, color: "#10B981", fontWeight: 700 }}><span style={{ color: "#F43F5E" }}>return</span> ans <span style={{ color: "#94A3B8" }}># 🎯 6 Units!</span></div>
      </div>

      {/* Floating Complexity Scorecard (top: 840px) */}
      <div style={{ position: "absolute", top: 840, left: 70, right: 70, display: "flex", gap: 24 }}>
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            border: "3px solid #06B6D4",
            borderRadius: 24,
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 12px 35px rgba(6, 182, 212, 0.15)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: "#64748B" }}>TIME COMPLEXITY</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: "#0891B2" }}>O(N) ⚡</div>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            border: "3px solid #10B981",
            borderRadius: 24,
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 12px 35px rgba(16, 185, 129, 0.15)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: "#64748B" }}>SPACE COMPLEXITY</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: "#059669" }}>O(1) 🧠</div>
        </div>
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
          border: "2px solid rgba(6, 182, 212, 0.55)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(6, 182, 212, 0.25)",
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
          const activeColor = idx % 2 === 0 ? "#FFD166" : "#06B6D4";

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
