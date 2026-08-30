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
    brandPink: "#EC4899",
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

export const CycleComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = timelineData.total_frames || 733;

  // ─── Stage Boundaries ───
  const cutB = 98;   // Nemi question -> dark mode
  const cutC = 173;  // Memory trap
  const cutD = 285;  // Two pointers
  const cutE = 413;  // The chase
  const cutCollision = 530; // BAM!
  const cutF = 557;  // Nemi smug payoff -> light mode
  const cutG = 638;  // Loop seam

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
    nemiSpeech = "Can't we just save visited nodes in a Hash Set? 🤔";
  } else if (frame < cutD) {
    nemiPose = "shocked";
  } else if (frame < cutE) {
    nemiPose = "explaining";
  } else if (frame < cutCollision) {
    nemiPose = "pointing";
  } else if (frame < cutF) {
    nemiPose = "smug";
  } else if (frame < cutG + 20) {
    nemiPose = "aha";
    nemiSpeech = "Zero extra RAM and O(N) time! 😎⚡";
  } else {
    nemiPose = "smug";
  }

  // Collision impact flash
  const collisionImpact =
    frame >= 530 && frame < 536
      ? interpolate(frame, [530, 532, 536], [0, 0.7, 0], {
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
      <Audio src={staticFile("reels/cycle_15/voiceover.mp3")} volume={1.0} />

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
      <Sequence from={455} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={500} durationInFrames={20}>
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
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
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
                : nemiTheme.colors.brandGreen,
              boxShadow: `0 0 20px ${isDarkWorld ? (frame >= cutD ? "#06B6D4" : "#EF4444") : "#10B981"}`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: isDarkWorld ? (frame >= cutD ? "#06B6D4" : "#EF4444") : "#0891B2",
            }}
          >
            Ep.15 · Floyd's Cycle
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
            ? "THE INFINITE LOOP"
            : frame < cutC
            ? "HASH SET QUESTION"
            : frame < cutD
            ? "O(N) RAM EXPLOSION"
            : frame < cutE
            ? "2-POINTER MECHANISM"
            : frame < cutCollision
            ? "THE RACETRACK CHASE"
            : frame < cutF
            ? "BAM! COLLISION"
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
              Detect An Infinite Loop In <span style={{ color: nemiTheme.colors.brandCyan }}>Zero Memory!</span> 🌀
            </>
          ) : frame < cutC ? (
            <>
              Can We Just Store Visited In A <span style={{ color: nemiTheme.colors.brandYellow }}>Hash Set?</span> 🤔
            </>
          ) : frame < cutD ? (
            <>
              Hash Set = <span style={{ color: nemiTheme.colors.brandRed }}>O(N) RAM Trap!</span> 💥
            </>
          ) : frame < cutE ? (
            <>
              Use Two Pointers: <span style={{ color: nemiTheme.colors.brandCyan }}>🐢 Slow</span> &{" "}
              <span style={{ color: nemiTheme.colors.brandAmber }}>🐇 Fast!</span>
            </>
          ) : frame < cutCollision ? (
            <>
              Inside Loop: <span style={{ color: nemiTheme.colors.brandCyan }}>Hare Gains 1 Node/Turn!</span> ⚡
            </>
          ) : frame < cutF ? (
            <>
              💥 <span style={{ color: nemiTheme.colors.brandAmber }}>BAM! COLLISION AT NODE [4]!</span>
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

      {/* STAGE 1: OPEN LINKED LIST LOOP GRAPH (0 to 98) */}
      {frame < cutB && <OpenVisual1_InfiniteLoopGraph frame={frame} />}

      {/* STAGE 2: HASH SET MEMORY GRID EXPLOSION (98 to 285) */}
      {frame >= cutB && frame < cutD && <OpenVisual2_MemoryGridExplosion frame={frame} cutC={cutC} />}

      {/* STAGE 3: FLOYD'S TWO POINTER SPEEDOMETER ENGINE (285 to 413) */}
      {frame >= cutD && frame < cutE && <OpenVisual3_TwoPointerMechanism frame={frame} />}

      {/* STAGE 4: THE RACETRACK CHASE & BAM! COLLISION (413 to 557) */}
      {frame >= cutE && frame < cutF && <OpenVisual4_RacetrackChase frame={frame} cutCollision={cutCollision} />}

      {/* STAGE 5: VICTORY PYTHON CODE & COMPLEXITY (557 to 733) */}
      {frame >= cutF && <OpenVisual5_ComplexityGraph frame={frame} cutF={cutF} />}

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
// 1. STAGE 1: OPEN-CANVAS INFINITE LOOP GRAPH (0 to 98)
// ═══════════════════════════════════════════════════════════════
const OpenVisual1_InfiniteLoopGraph: React.FC<{ frame: number }> = ({ frame }) => {
  const flowOffset = -(frame * 6) % 24;

  const nodes = [
    { id: 1, cx: 160, cy: 520, inLoop: false },
    { id: 2, cx: 380, cy: 520, inLoop: false },
    { id: 3, cx: 640, cy: 520, inLoop: true },
    { id: 4, cx: 860, cy: 720, inLoop: true },
    { id: 5, cx: 640, cy: 920, inLoop: true },
    { id: 6, cx: 420, cy: 720, inLoop: true },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Status Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FFFFFF",
          border: "2px solid #06B6D4",
          borderRadius: 999,
          padding: "10px 28px",
          boxShadow: "0 8px 25px rgba(6, 182, 212, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 22 }}>🎯</span>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#0891B2", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          CHALLENGE: DETECT IN O(1) SPACE & O(N) TIME
        </span>
      </div>

      {/* SVG Spatial Canvas */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="openArrCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#06B6D4" />
          </marker>
          <marker id="openArrPurple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#A855F7" />
          </marker>
          <marker id="openArrPink" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#EC4899" />
          </marker>
        </defs>

        {/* Linear edges 1 -> 2 -> 3 */}
        <line x1={nodes[0].cx + 48} y1={nodes[0].cy} x2={nodes[1].cx - 52} y2={nodes[1].cy} stroke="#06B6D4" strokeWidth="6" strokeDasharray="10 6" strokeDashoffset={flowOffset} markerEnd="url(#openArrCyan)" />
        <line x1={nodes[1].cx + 48} y1={nodes[1].cy} x2={nodes[2].cx - 52} y2={nodes[2].cy} stroke="#06B6D4" strokeWidth="6" strokeDasharray="10 6" strokeDashoffset={flowOffset} markerEnd="url(#openArrCyan)" />

        {/* Circular Loop: 3 -> 4 -> 5 -> 6 -> 3 */}
        <path d={`M ${nodes[2].cx + 38} ${nodes[2].cy + 28} A 200 200 0 0 1 ${nodes[3].cx - 24} ${nodes[3].cy - 38}`} fill="none" stroke="#A855F7" strokeWidth="7" strokeDasharray="12 6" strokeDashoffset={flowOffset} markerEnd="url(#openArrPurple)" />
        <path d={`M ${nodes[3].cx - 28} ${nodes[3].cy + 38} A 200 200 0 0 1 ${nodes[4].cx + 38} ${nodes[4].cy - 24}`} fill="none" stroke="#A855F7" strokeWidth="7" strokeDasharray="12 6" strokeDashoffset={flowOffset} markerEnd="url(#openArrPurple)" />
        <path d={`M ${nodes[4].cx - 38} ${nodes[4].cy - 24} A 200 200 0 0 1 ${nodes[5].cx + 28} ${nodes[5].cy + 38}`} fill="none" stroke="#A855F7" strokeWidth="7" strokeDasharray="12 6" strokeDashoffset={flowOffset} markerEnd="url(#openArrPurple)" />
        <path d={`M ${nodes[5].cx + 24} ${nodes[5].cy - 38} A 200 200 0 0 1 ${nodes[2].cx - 38} ${nodes[2].cy + 24}`} fill="none" stroke="#EC4899" strokeWidth="7" strokeDasharray="10 6" strokeDashoffset={flowOffset * 1.5} markerEnd="url(#openArrPink)" />
      </svg>

      {/* Center Loop badge floating freely */}
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 720,
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(168, 85, 247, 0.12)",
          border: "2px dashed #A855F7",
          borderRadius: 999,
          padding: "10px 22px",
          fontSize: 18,
          fontWeight: 900,
          color: "#7E22CE",
          letterSpacing: "0.5px",
        }}
      >
        🔄 INFINITE CYCLE
      </div>

      {/* Nodes */}
      {nodes.map((n) => (
        <div
          key={n.id}
          style={{
            position: "absolute",
            left: `${n.cx}px`,
            top: `${n.cy}px`,
            transform: "translate(-50%, -50%)",
            width: 96,
            height: 96,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            border: `4.5px solid ${n.inLoop ? "#A855F7" : "#06B6D4"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 900,
            color: "#0F172A",
            boxShadow: n.inLoop ? "0 0 30px rgba(168, 85, 247, 0.3)" : "0 0 25px rgba(6, 182, 212, 0.3)",
          }}
        >
          {n.id}
        </div>
      ))}

      {/* Floating Bottom Callout Banner */}
      <div
        style={{
          position: "absolute",
          top: 1040,
          left: 80,
          right: 80,
          backgroundColor: "#FFFFFF",
          padding: "14px 28px",
          borderRadius: 20,
          border: "2px solid #E2E8F0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#64748B", fontSize: 18, fontWeight: 700 }}>Infinite loop condition:</span>
        <span style={{ color: "#EF4444", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          NO NULL POINTER (CRASHES WHILE LOOP!) ❌
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. STAGE 2: OPEN-CANVAS HASH SET MEMORY GRID EXPLOSION (98 to 285)
// ═══════════════════════════════════════════════════════════════
const OpenVisual2_MemoryGridExplosion: React.FC<{ frame: number; cutC: number }> = ({ frame, cutC }) => {
  const isCrashing = frame >= cutC + 35;
  const scanY = ((frame - 98) * 14) % 360;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Top Telemetry Pill */}
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
            {isCrashing ? "HASH SET MEMORY EXPLOSION" : "HASH SET ALLOCATION TABLE"}
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
          {isCrashing ? "8.4 GB (CRASH!)" : "2.4 GB ALLOCATED"}
        </div>
      </div>

      {/* Floating Holographic 48-Cell Memory Matrix */}
      <div style={{ position: "absolute", top: 380, left: 70, right: 70, height: 420 }}>
        <svg width="940" height="420" viewBox="0 0 940 420">
          {Array.from({ length: 48 }, (_, i) => {
            const col = i % 8;
            const row = Math.floor(i / 8);
            const x = 30 + col * 110;
            const y = 30 + row * 60;
            const isFilled = i < (isCrashing ? 48 : (frame - 98) / 3.5);

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width="92"
                  height="46"
                  rx="10"
                  fill={isFilled ? (isCrashing ? "#EF4444" : "#F59E0B") : "#1E293B"}
                  stroke={isFilled ? (isCrashing ? "#FCA5A5" : "#FDE68A") : "#334155"}
                  strokeWidth="2.5"
                  opacity={isFilled ? 0.95 : 0.4}
                />
                <text x={x + 46} y={y + 30} fill={isFilled ? "#000000" : "#64748B"} fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  {isFilled ? `0x${i.toString(16).toUpperCase()}` : "FREE"}
                </text>
              </g>
            );
          })}

          {/* Sweeping Laser Scan Line */}
          <line x1="20" y1={30 + scanY} x2="920" y2={30 + scanY} stroke="#EF4444" strokeWidth="5" strokeDasharray="12 6" />
        </svg>
      </div>

      {/* Floating RAM Fill Meter & Callout (top: 860px) */}
      <div style={{ position: "absolute", top: 870, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ width: "100%", height: 32, backgroundColor: "#1E293B", borderRadius: 999, overflow: "hidden", border: "2px solid #475569" }}>
          <div
            style={{
              height: "100%",
              width: isCrashing ? "100%" : `${Math.min(95, ((frame - 98) / (cutC + 35 - 98)) * 100)}%`,
              backgroundColor: isCrashing ? "#EF4444" : "#F59E0B",
              boxShadow: isCrashing ? "0 0 35px #EF4444" : "0 0 15px #F59E0B",
              transition: "width 0.2s linear",
            }}
          />
        </div>

        <div
          style={{
            backgroundColor: isCrashing ? "rgba(239, 68, 68, 0.25)" : "#0F172A",
            padding: "16px 28px",
            borderRadius: 20,
            border: `2px solid ${isCrashing ? "#EF4444" : "#475569"}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>
            {isCrashing ? "❌ MEMORY LIMIT EXCEEDED (1 Billion Nodes):" : "Hash table stores every node in RAM:"}
          </span>
          <span style={{ color: isCrashing ? "#EF4444" : "#F59E0B", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            {isCrashing ? "O(N) CRASH! 💥" : "O(N) SPACE SPIKE"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. STAGE 3: OPEN-CANVAS FLOYD'S TWO POINTER ENGINE (285 to 413)
// ═══════════════════════════════════════════════════════════════
const OpenVisual3_TwoPointerMechanism: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.25);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Speedometer HUD Cards (top: 320px) */}
      <div style={{ position: "absolute", top: 320, left: 70, right: 70, display: "flex", gap: 24 }}>
        {/* Slow Pointer Card */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(6, 182, 212, 0.16)",
            border: "3px solid #06B6D4",
            borderRadius: 28,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            boxShadow: "0 16px 45px rgba(6, 182, 212, 0.35)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 50 }}>🐢</span>
            <span style={{ backgroundColor: "#06B6D4", color: "#000000", fontSize: 18, fontWeight: 900, padding: "6px 16px", borderRadius: 14 }}>
              SLOW POINTER
            </span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, color: "#FFFFFF" }}>+1 Node / Turn</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#67E8F9", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            slow = slow.next
          </div>
        </div>

        {/* Fast Pointer Card */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(245, 158, 11, 0.16)",
            border: "3px solid #F59E0B",
            borderRadius: 28,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            boxShadow: "0 16px 45px rgba(245, 158, 11, 0.35)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 50 }}>🐇</span>
            <span style={{ backgroundColor: "#F59E0B", color: "#000000", fontSize: 18, fontWeight: 900, padding: "6px 16px", borderRadius: 14 }}>
              FAST POINTER
            </span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, color: "#FFFFFF" }}>+2 Nodes / Turn</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#FDE68A", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            fast = fast.next.next
          </div>
        </div>
      </div>

      {/* Floating Parabolic Jump Track (top: 590px) */}
      <div style={{ position: "absolute", top: 590, left: 70, right: 70, height: 260 }}>
        <svg width="940" height="260" viewBox="0 0 940 260">
          {/* Nodes */}
          {[1, 2, 3, 4, 5].map((val, idx) => {
            const cx = 110 + idx * 180;
            const cy = 180;
            return (
              <g key={val}>
                <circle cx={cx} cy={cy} r="42" fill="#0F172A" stroke="#06B6D4" strokeWidth="4.5" />
                <text x={cx} y={cy + 10} fill="#FFFFFF" fontSize="30" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Slow Hop (1 to 2) */}
          <path d="M 110 135 Q 200 60 290 135" fill="none" stroke="#06B6D4" strokeWidth="5" strokeDasharray="8 6" />
          <text x="200" y="75" fill="#06B6D4" fontSize="20" fontWeight="900" textAnchor="middle">🐢 +1 Step</text>

          {/* Fast Leap (1 to 3) */}
          <path d="M 110 135 Q 290 10 470 135" fill="none" stroke="#F59E0B" strokeWidth="6" strokeDasharray="10 6" />
          <text x="290" y="25" fill="#F59E0B" fontSize="22" fontWeight="900" textAnchor="middle">🐇 +2 Steps (Double Speed!)</text>
        </svg>
      </div>

      {/* Floating Relative Velocity Formula Banner (top: 890px) */}
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
        <span style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 800 }}>Relative Gap Closes By:</span>
        <span style={{ color: "#FFD166", fontWeight: 900, fontSize: 26, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          Δv = 2 - 1 = 1 NODE EVERY STEP ⚡
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STAGE 4: OPEN-CANVAS RACETRACK CHASE & COLLISION (413 to 557)
// ═══════════════════════════════════════════════════════════════
const OpenVisual4_RacetrackChase: React.FC<{ frame: number; cutCollision: number }> = ({ frame, cutCollision }) => {
  const isCollision = frame >= cutCollision;
  const flowOffset = -(frame * 8) % 24;

  let turn = 1;
  let slowId = 2;
  let fastId = 3;
  let dist = 2;

  if (frame >= 455 && frame < 500) {
    turn = 2;
    slowId = 3;
    fastId = 5;
    dist = 1;
  } else if (frame >= 500) {
    turn = 3;
    slowId = 4;
    fastId = 4;
    dist = 0;
  }

  const loopNodes = [
    { id: 3, cx: 540, cy: 460 },
    { id: 4, cx: 800, cy: 660 },
    { id: 5, cx: 540, cy: 860 },
    { id: 6, cx: 280, cy: 660 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Racetrack Telemetry Pill */}
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
            backgroundColor: isCollision ? "rgba(245, 158, 11, 0.25)" : "rgba(168, 85, 247, 0.25)",
            border: `2px solid ${isCollision ? "#F59E0B" : "#A855F7"}`,
            borderRadius: 999,
            padding: "10px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 24 }}>{isCollision ? "💥" : "🏁"}</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: isCollision ? "#FDE68A" : "#E9D5FF" }}>
            {isCollision ? "BAM! COLLISION AT NODE [4]!" : `TURN ${turn}: THE RACETRACK CHASE`}
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: `2px solid ${isCollision ? "#F59E0B" : "#A855F7"}`,
            borderRadius: 999,
            padding: "10px 24px",
            fontSize: 20,
            fontWeight: 900,
            color: isCollision ? "#F59E0B" : "#D8B4FE",
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          {isCollision ? "CYCLE CONFIRMED! ✓" : `DISTANCE GAP = ${dist}`}
        </div>
      </div>

      {/* SVG Open Circular Track */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="arrPurpOpen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#A855F7" />
          </marker>
        </defs>

        {/* Circular Curves */}
        <path d="M 580 470 A 200 200 0 0 1 790 610" fill="none" stroke="#A855F7" strokeWidth="8" strokeDasharray="12 6" strokeDashoffset={flowOffset} markerEnd="url(#arrPurpOpen)" />
        <path d="M 790 710 A 200 200 0 0 1 580 850" fill="none" stroke="#A855F7" strokeWidth="8" strokeDasharray="12 6" strokeDashoffset={flowOffset} markerEnd="url(#arrPurpOpen)" />
        <path d="M 500 850 A 200 200 0 0 1 290 710" fill="none" stroke="#A855F7" strokeWidth="8" strokeDasharray="12 6" strokeDashoffset={flowOffset} markerEnd="url(#arrPurpOpen)" />
        <path d="M 290 610 A 200 200 0 0 1 500 470" fill="none" stroke="#A855F7" strokeWidth="8" strokeDasharray="12 6" strokeDashoffset={flowOffset} markerEnd="url(#arrPurpOpen)" />

        {/* Nodes */}
        {loopNodes.map((n) => {
          const isMatch = isCollision && n.id === 4;
          return (
            <g key={n.id}>
              <circle
                cx={n.cx}
                cy={n.cy}
                r={isMatch ? 58 : 46}
                fill={isMatch ? "rgba(245, 158, 11, 0.45)" : "#0F172A"}
                stroke={isMatch ? "#F59E0B" : "#A855F7"}
                strokeWidth={isMatch ? 7 : 5}
              />
              <text x={n.cx} y={n.cy + 13} fill="#FFFFFF" fontSize={isMatch ? 40 : 34} fontWeight="900" textAnchor="middle" fontFamily="monospace">
                {n.id}
              </text>
            </g>
          );
        })}

        {/* Pointer Badges on Circuit */}
        {turn < 3 ? (
          <>
            {/* Slow */}
            <g transform={`translate(${loopNodes.find((x) => x.id === slowId)?.cx || 540}, ${(loopNodes.find((x) => x.id === slowId)?.cy || 460) - 75})`}>
              <rect x="-60" y="-22" width="120" height="44" rx="22" fill="#06B6D4" />
              <text x="0" y="8" fill="#000000" fontSize="20" fontWeight="900" textAnchor="middle">🐢 Slow</text>
            </g>
            {/* Fast */}
            <g transform={`translate(${loopNodes.find((x) => x.id === fastId)?.cx || 540}, ${(loopNodes.find((x) => x.id === fastId)?.cy || 460) + 75})`}>
              <rect x="-60" y="-22" width="120" height="44" rx="22" fill="#F59E0B" />
              <text x="0" y="8" fill="#000000" fontSize="20" fontWeight="900" textAnchor="middle">🐇 Fast</text>
            </g>
          </>
        ) : (
          <g transform="translate(800, 560)">
            <rect x="-120" y="-28" width="240" height="56" rx="28" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="4" />
            <text x="0" y="10" fill="#000000" fontSize="24" fontWeight="900" textAnchor="middle">💥 🐢 == 🐇 MATCH!</text>
          </g>
        )}
      </svg>

      {/* Floating Bottom Callout Banner */}
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 70,
          right: 70,
          backgroundColor: "#03070D",
          padding: "18px 28px",
          borderRadius: 22,
          border: "2px solid #F59E0B",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 14px 40px rgba(245, 158, 11, 0.25)",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Because the hare is 1 node faster:</span>
        <span style={{ color: "#FDE68A", fontWeight: 900, fontSize: 21, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          COLLISION IN ≤ N STEPS GUARANTEED! ✓
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. STAGE 5: OPEN-CANVAS VICTORY PAYOFF & CODE (557 to 733)
// ═══════════════════════════════════════════════════════════════
const OpenVisual5_ComplexityGraph: React.FC<{ frame: number; cutF: number }> = ({ frame, cutF }) => {
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
          Floyd's Algorithm Victory
        </span>
      </div>

      {/* Floating Syntax-Highlighted Python Code Card (top: 380px) */}
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
          fontSize: 22,
          lineHeight: 1.6,
          boxShadow: "0 20px 60px rgba(6, 182, 212, 0.25)",
        }}
      >
        <div><span style={{ color: "#F43F5E" }}>def</span> <span style={{ color: "#67E8F9" }}>hasCycle</span>(head):</div>
        <div style={{ paddingLeft: 32 }}>slow = fast = head</div>
        <div style={{ paddingLeft: 32 }}><span style={{ color: "#F43F5E" }}>while</span> fast <span style={{ color: "#F43F5E" }}>and</span> fast.next:</div>
        <div style={{ paddingLeft: 64 }}>slow = slow.next <span style={{ color: "#94A3B8" }}># 🐢 +1</span></div>
        <div style={{ paddingLeft: 64 }}>fast = fast.next.next <span style={{ color: "#94A3B8" }}># 🐇 +2</span></div>
        <div style={{ paddingLeft: 64 }}><span style={{ color: "#F43F5E" }}>if</span> slow == fast:</div>
        <div style={{ paddingLeft: 96, color: "#10B981", fontWeight: 700 }}><span style={{ color: "#F43F5E" }}>return</span> True <span style={{ color: "#94A3B8" }}># 🎯 Cycle Found!</span></div>
      </div>

      {/* Floating Complexity Scorecard Cards (top: 790px) */}
      <div style={{ position: "absolute", top: 790, left: 70, right: 70, display: "flex", gap: 24 }}>
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
