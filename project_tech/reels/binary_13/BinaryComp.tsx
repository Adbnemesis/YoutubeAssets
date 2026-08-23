import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { NemiMascot, NemiPose } from "../../src/components/NemiMascot";
import cuesData from "../../src/data/binary_13_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandPurple: "#A855F7",
    brandGreen: "#10B981",
    brandRed: "#EF4444",
    brandCoral: "#F43F5E",
    brandAmber: "#F59E0B",
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    cardDark: "#0F172A",
    cardSurface: "#1E293B",
    textLight: "#0F172A",
    textDark: "#F8FAFC",
    textMuted: "#94A3B8",
    borderLight: "#E2E8F0",
    borderDark: "#334155",
  },
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
  },
};

const getEvent = (id: string) => {
  const ev = (cuesData.timeline_events as any[]).find((x) => x.id === id);
  return ev ?? {
    start_frame: 0,
    end_frame: 0,
    start_time_ms: 0,
    end_time_ms: 0,
    duration_s: 0,
    semantic_cues: [],
  };
};

const getCue = (eventId: string, cueName: string): number => {
  const ev = getEvent(eventId);
  const c = (ev.semantic_cues ?? []).find((x: any) => x.cue === cueName);
  return c ? c.frame : ev.start_frame;
};

// ═══════════════════════════════════════════════════════════════
// LEETCODE ARRAY DATA FOR BINARY SEARCH DEMO
// ═══════════════════════════════════════════════════════════════
const ARRAY_DATA = [
  { idx: 0, val: 1 },
  { idx: 1, val: 3 },
  { idx: 2, val: 5 },
  { idx: 3, val: 7 },
  { idx: 4, val: 9 },
  { idx: 5, val: 11 },
  { idx: 6, val: 13 }, // TARGET
  { idx: 7, val: 15 },
  { idx: 8, val: 17 },
];
const TARGET_VAL = 13;

export const BinaryComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Timeline Events ───
  const evHook = getEvent("bn01_hook");
  const evClaim = getEvent("bn02_claim");
  const evGuess = getEvent("bn03_nemi_guess");
  const evSecret = getEvent("bn04_secret");
  const evMechanism = getEvent("bn05_mechanism");
  const evPayoff = getEvent("bn06_payoff");
  const evNemiPayoff = getEvent("bn07_nemi_payoff");
  const evLoop = getEvent("bn08_loop");

  // ─── Semantic Cues ───
  const thirtySlamCue = getCue("bn01_hook", "thirty_slam"); // 64
  const wallSliceCue = getCue("bn02_claim", "wall_slice"); // 133
  const counterHalveCue = getCue("bn02_claim", "counter_halve"); // 163
  const nemiShockCue = getCue("bn03_nemi_guess", "nemi_shock"); // 221
  const sortedLockCue = getCue("bn04_secret", "sorted_lock"); // 273
  const midCheckCue = getCue("bn04_secret", "mid_check"); // 305
  const tooHighCue = getCue("bn05_mechanism", "too_high"); // 348
  const halfDieCue = getCue("bn05_mechanism", "half_die"); // 391
  const thirtyPayoffCue = getCue("bn06_payoff", "thirty_payoff"); // 442
  const oneLeftCue = getCue("bn06_payoff", "one_left"); // 475
  const smugStampCue = getCue("bn07_nemi_payoff", "smug_stamp"); // 523
  const loopWallCue = getCue("bn08_loop", "loop_wall"); // 593

  // ─── Stage Boundaries ───
  const cutB = evClaim.start_frame; // 102
  const cutC = evGuess.start_frame; // 182
  const cutD = evSecret.start_frame; // 257
  const cutE = evMechanism.start_frame; // 324
  const cutF = evPayoff.start_frame; // 422
  const cutG = evNemiPayoff.start_frame; // 491
  const cutH = evLoop.start_frame; // 559

  // ─── Smooth Background Theme Interpolation ───
  const isDarkWorld = frame >= cutB && frame < loopWallCue;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "thinking";
  } else if (frame < cutC) {
    nemiPose = "pointing";
  } else if (frame < cutD) {
    nemiPose = "shocked";
    nemiSpeech = "Find it without scanning all?! 🤯";
  } else if (frame < cutE) {
    nemiPose = "explaining";
  } else if (frame < cutF) {
    nemiPose = "aha";
  } else if (frame < cutG) {
    nemiPose = "aha";
  } else if (frame < cutH + 15) {
    nemiPose = "smug";
    nemiSpeech = "Ask better questions! 😎⚡";
  } else {
    nemiPose = "smug";
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: canvasBg,
        overflow: "hidden",
        fontFamily: nemiTheme.typography.fontFamily.sans,
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Voice + Sidechain-Ducked BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/binary_13/binary_master_audio.mp3")} volume={0.92} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SFX LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/binary_13/sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={thirtySlamCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/pop.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutB - 2)} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={wallSliceCue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={counterHalveCue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/click.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={nemiShockCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/error.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutD - 2)} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={sortedLockCue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/click.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={midCheckCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={tooHighCue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/pop.mp3")} volume={0.68} />
      </Sequence>
      <Sequence from={halfDieCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/pop.mp3")} volume={0.68} />
      </Sequence>
      <Sequence from={Math.max(0, cutF - 2)} durationInFrames={35}>
        <Audio src={staticFile("reels/binary_13/sfx/riser.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={thirtyPayoffCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/notification.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={oneLeftCue} durationInFrames={40}>
        <Audio src={staticFile("reels/binary_13/sfx/chime.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={smugStampCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/pop.mp3")} volume={0.66} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* AMBIENT BACKGROUND GLOW */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isDarkWorld && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
          <div
            style={{
              position: "absolute",
              top: 180,
              left: -150,
              width: 650,
              height: 650,
              borderRadius: "50%",
              background: frame < cutE
                ? "radial-gradient(circle, rgba(6, 182, 212, 0.24) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(244, 63, 94, 0.24) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(90px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 720,
              right: -150,
              width: 650,
              height: 650,
              borderRadius: "50%",
              background: frame >= cutF
                ? "radial-gradient(circle, rgba(16, 185, 129, 0.24) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(255, 209, 102, 0.18) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(90px)",
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PERSISTENT HEADER HUD (Appears frame 60+) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {frame >= 60 && (
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
            opacity: interpolate(frame, [60, 68], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: frame >= cutF ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCyan,
                boxShadow: `0 0 20px ${frame >= cutF ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCyan}`,
              }}
            />
            <span
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: isDarkWorld ? (frame >= cutF ? "#10B981" : "#06B6D4") : "#0891B2",
              }}
            >
              LeetCode #704 · Binary Search
            </span>
          </div>

          <div
            style={{
              backgroundColor: isDarkWorld ? "rgba(15, 23, 42, 0.94)" : "#FFFFFF",
              padding: "12px 24px",
              borderRadius: 24,
              border: `2px solid ${isDarkWorld ? nemiTheme.colors.borderDark : nemiTheme.colors.borderLight}`,
              fontSize: 20,
              fontWeight: 900,
              color: isDarkWorld ? (frame >= cutF ? "#10B981" : "#06B6D4") : "#0891B2",
              fontFamily: nemiTheme.typography.fontFamily.mono,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            {frame < cutB ? "SETUP: 1B SORTED ITEMS" : frame < cutD ? "TRAP: O(N) LINEAR SCAN" : frame < cutE ? "STEP 1: MID = (L+R)/2" : frame < cutF ? "STEP 2: DISCARD 50%" : "PAYOFF: O(log N) IN 30 OPS"}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* HEADLINE TITLE (Safe Zone: top: 165px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            letterSpacing: -1.5,
            lineHeight: 1.15,
            color: isDarkWorld ? "#F8FAFC" : nemiTheme.colors.textLight,
          }}
        >
          {frame < cutB ? (
            <>
              1 Billion Items. <span style={{ color: nemiTheme.colors.brandCoral }}>30 Questions.</span>
            </>
          ) : frame < cutD ? (
            <>
              How Binary Search Finds <span style={{ color: nemiTheme.colors.brandCyan }}>Target = 13</span> ⚡
            </>
          ) : frame < cutE ? (
            <>
              Probe The Center: <span style={{ color: "#10B981" }}>mid = (L + R) // 2</span>
            </>
          ) : frame < cutF ? (
            <>
              Too Low? <span style={{ color: "#F43F5E" }}>Discard Entire Left Half!</span> 💥
            </>
          ) : frame < cutG ? (
            <>
              30 Cuts: <span style={{ color: nemiTheme.colors.brandYellow }}>1 Billion Becomes 1!</span> 👑
            </>
          ) : (
            <>
              The Power of <span style={{ color: nemiTheme.colors.brandCyan }}>O(log N) Time</span> ⚡
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MAIN VISUAL STAGES (Safe Zone: top: 310px, height: 600px) */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* STAGE 1: BEAT 1 & 2 — PROBLEM SETUP & THE 1 BILLION HOOK */}
      {frame < cutB && (
        <Stage1BillionHook frame={frame} thirtySlamCue={thirtySlamCue} />
      )}

      {/* STAGE 2: BEAT 3 — TWO POINTERS SETUP (L=0, R=8) & SCAN TRAP */}
      {frame >= cutB && frame < cutD && (
        <Stage2TwoPointersTrap frame={frame} wallSliceCue={wallSliceCue} counterHalveCue={counterHalveCue} />
      )}

      {/* STAGE 3: BEAT 4 — MIDPOINT PROBE (mid = 4, val = 9) */}
      {frame >= cutD && frame < cutE && (
        <Stage3MidpointProbe frame={frame} sortedLockCue={sortedLockCue} midCheckCue={midCheckCue} />
      )}

      {/* STAGE 4: BEAT 5 — ELIMINATION & SECOND PROBE (L=5, mid=6 -> MATCH!) */}
      {frame >= cutE && frame < cutF && (
        <Stage4GuillotineMatch frame={frame} tooHighCue={tooHighCue} halfDieCue={halfDieCue} />
      )}

      {/* STAGE 5: BEAT 6 — 30 CUTS LOGARITHMIC TOWER PAYOFF */}
      {frame >= cutF && frame < cutG && (
        <Stage5LogarithmicTower frame={frame} thirtyPayoffCue={thirtyPayoffCue} oneLeftCue={oneLeftCue} />
      )}

      {/* STAGE 6: BEAT 7 & 8 — PYTHON CODE & SCORECARD */}
      {frame >= cutG && (
        <Stage6CodeAndScorecard frame={frame} cutG={cutG} loopWallCue={loopWallCue} />
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} fps={fps} />}

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
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 1. STAGE 1: PROBLEM SETUP & BILLION ARRAY HOOK
// ═══════════════════════════════════════════════════════════════
const Stage1BillionHook: React.FC<{ frame: number; thirtySlamCue: number }> = ({ frame, thirtySlamCue }) => {
  const isSlammed = frame >= thirtySlamCue;
  const pulse = Math.sin(frame * 0.25);

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#FFFFFF",
        borderRadius: 36,
        border: isSlammed ? "4px solid #06B6D4" : "3.5px solid #E2E8F0",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.22)",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>📦</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>Input: Sorted Array (N = 1,000,000,000)</span>
        </div>
        <span style={{ backgroundColor: "#ECFEFF", color: "#0891B2", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          TARGET = 13 🎯
        </span>
      </div>

      {/* LeetCode Array Cells */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", width: "100%" }}>
        {ARRAY_DATA.map((item) => (
          <div
            key={item.idx}
            style={{
              flex: 1,
              height: 115,
              backgroundColor: item.val === TARGET_VAL ? "#FEF3C7" : "#F8FAFC",
              border: item.val === TARGET_VAL ? "3px solid #F59E0B" : "2px solid #CBD5E1",
              borderRadius: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <span style={{ color: "#94A3B8", fontSize: 14, fontFamily: nemiTheme.typography.fontFamily.mono }}>[{item.idx}]</span>
            <span style={{ color: item.val === TARGET_VAL ? "#B45309" : "#0F172A", fontSize: 28, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
              {item.val}
            </span>
          </div>
        ))}
      </div>

      {/* Callout Box */}
      {isSlammed ? (
        <div
          style={{
            backgroundColor: "#ECFEFF",
            border: "3.5px solid #06B6D4",
            borderRadius: 22,
            padding: "18px 36px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 14px 40px rgba(6, 182, 212, 0.35)",
            transform: `scale(${1 + pulse * 0.03})`,
          }}
        >
          <span style={{ fontSize: 36 }}>⚡</span>
          <span style={{ fontSize: 28, fontWeight: 900, color: "#0E7490", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            SOLVED IN MAXIMUM 30 COMPARISONS!
          </span>
        </div>
      ) : (
        <div style={{ width: "100%", backgroundColor: "#F8FAFC", padding: "16px 22px", borderRadius: 18, border: "1.5px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#64748B", fontSize: 19, fontWeight: 700 }}>Linear scan checks 1 by 1:</span>
          <span style={{ color: "#EF4444", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>1,000,000,000 CHECKS 🐌</span>
        </div>
      )}

      <div style={{ width: "100%", backgroundColor: "#F0FDFA", padding: "14px 24px", borderRadius: 18, border: "2px solid #06B6D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#0F172A", fontSize: 18, fontWeight: 700 }}>Why check every element when the list is sorted?</span>
        <span style={{ color: "#0891B2", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>USE TWO POINTERS ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. STAGE 2: TWO POINTERS SETUP (L=0, R=8)
// ═══════════════════════════════════════════════════════════════
const Stage2TwoPointersTrap: React.FC<{ frame: number; wallSliceCue: number; counterHalveCue: number }> = ({ frame, wallSliceCue, counterHalveCue }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #06B6D4",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.3)",
        padding: "26px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>📍</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Initialize Two Pointers: Left & Right Bounds</span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          L = 0, R = 8
        </span>
      </div>

      {/* Pointers Row + Array */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Pointers */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", width: "100%", height: 48 }}>
          {ARRAY_DATA.map((item) => {
            const isL = item.idx === 0;
            const isR = item.idx === 8;
            return (
              <div key={item.idx} style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                {isL && (
                  <div style={{ backgroundColor: "#06B6D4", color: "#070B12", fontWeight: 900, fontSize: 16, padding: "5px 12px", borderRadius: 10, fontFamily: nemiTheme.typography.fontFamily.mono, boxShadow: "0 0 18px #06B6D4" }}>
                    ↓ L
                  </div>
                )}
                {isR && (
                  <div style={{ backgroundColor: "#A855F7", color: "#FFFFFF", fontWeight: 900, fontSize: 16, padding: "5px 12px", borderRadius: 10, fontFamily: nemiTheme.typography.fontFamily.mono, boxShadow: "0 0 18px #A855F7" }}>
                    ↓ R
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Array Cells */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", width: "100%" }}>
          {ARRAY_DATA.map((item) => {
            const isL = item.idx === 0;
            const isR = item.idx === 8;
            return (
              <div
                key={item.idx}
                style={{
                  flex: 1,
                  height: 115,
                  backgroundColor: isL ? "rgba(6, 182, 212, 0.22)" : isR ? "rgba(168, 85, 247, 0.22)" : "#1E293B",
                  border: isL ? "3px solid #06B6D4" : isR ? "3px solid #A855F7" : "2px solid #334155",
                  borderRadius: 18,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span style={{ color: "#94A3B8", fontSize: 14, fontFamily: nemiTheme.typography.fontFamily.mono }}>[{item.idx}]</span>
                <span style={{ color: isL ? "#06B6D4" : isR ? "#A855F7" : "#F8FAFC", fontSize: 28, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  {item.val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "16px 24px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>Search Space = Entire Array [L .. R]:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>READY TO CUT IN HALF ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. STAGE 3: MIDPOINT PROBE (mid = 4, val = 9)
// ═══════════════════════════════════════════════════════════════
const Stage3MidpointProbe: React.FC<{ frame: number; sortedLockCue: number; midCheckCue: number }> = ({ frame, sortedLockCue, midCheckCue }) => {
  const isMidChecked = frame >= midCheckCue;
  const pulse = Math.sin(frame * 0.3);

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #10B981",
        boxShadow: "0 24px 80px rgba(16, 185, 129, 0.3)",
        padding: "26px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🎯</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Calculate Midpoint: mid = (0 + 8) // 2 = 4</span>
        </div>
        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#10B981", border: "1.5px solid #10B981", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          nums[mid] = 9
        </span>
      </div>

      {/* Pointers Row + Array */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Pointers */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", width: "100%", height: 48 }}>
          {ARRAY_DATA.map((item) => {
            const isL = item.idx === 0;
            const isMid = item.idx === 4;
            const isR = item.idx === 8;
            return (
              <div key={item.idx} style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                {isL && (
                  <div style={{ backgroundColor: "#06B6D4", color: "#070B12", fontWeight: 900, fontSize: 15, padding: "4px 8px", borderRadius: 8, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    L
                  </div>
                )}
                {isMid && (
                  <div style={{ backgroundColor: "#10B981", color: "#070B12", fontWeight: 900, fontSize: 16, padding: "5px 12px", borderRadius: 10, fontFamily: nemiTheme.typography.fontFamily.mono, transform: `scale(${1 + pulse * 0.1})`, boxShadow: "0 0 22px #10B981" }}>
                    ↓ MID
                  </div>
                )}
                {isR && (
                  <div style={{ backgroundColor: "#A855F7", color: "#FFFFFF", fontWeight: 900, fontSize: 15, padding: "4px 8px", borderRadius: 8, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    R
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Array Cells */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", width: "100%" }}>
          {ARRAY_DATA.map((item) => {
            const isMid = item.idx === 4;
            return (
              <div
                key={item.idx}
                style={{
                  flex: 1,
                  height: 115,
                  backgroundColor: isMid ? (isMidChecked ? "#064E3B" : "#1E293B") : "#1E293B",
                  border: isMid ? "3.5px solid #10B981" : "2px solid #334155",
                  borderRadius: 18,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transform: isMid ? `scale(${1 + pulse * 0.05})` : "none",
                }}
              >
                <span style={{ color: isMid ? "#A7F3D0" : "#94A3B8", fontSize: 14, fontFamily: nemiTheme.typography.fontFamily.mono }}>[{item.idx}]</span>
                <span style={{ color: isMid ? "#10B981" : "#F8FAFC", fontSize: 28, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  {item.val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Verdict */}
      <div style={{ width: "100%", backgroundColor: "#1E293B", padding: "16px 24px", borderRadius: 18, border: "2px solid #06B6D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>
          Comparison: <strong style={{ color: "#10B981" }}>nums[4] (9)</strong> &lt; <strong style={{ color: "#F59E0B" }}>Target (13)</strong>
        </span>
        <span style={{ color: "#06B6D4", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>TARGET IS ON THE RIGHT 👉</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STAGE 4: DISCARD 50% & SECOND PROBE (MATCH!)
// ═══════════════════════════════════════════════════════════════
const Stage4GuillotineMatch: React.FC<{ frame: number; tooHighCue: number; halfDieCue: number }> = ({ frame, tooHighCue, halfDieCue }) => {
  const isMatch = frame >= halfDieCue;
  const pulse = Math.sin(frame * 0.35);

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: isMatch ? "3.5px solid #10B981" : "3.5px solid #F43F5E",
        boxShadow: isMatch ? "0 24px 80px rgba(16, 185, 129, 0.4)" : "0 24px 80px rgba(244, 63, 94, 0.3)",
        padding: "26px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>{isMatch ? "🎉" : "✂️"}</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>
            {isMatch ? "Step 2: nums[6] == 13 (MATCH!)" : "L = mid + 1: Left Half Slashed & Discarded"}
          </span>
        </div>
        <span style={{ backgroundColor: isMatch ? "rgba(16, 185, 129, 0.25)" : "rgba(244, 63, 94, 0.25)", color: isMatch ? "#10B981" : "#F43F5E", border: `1.5px solid ${isMatch ? "#10B981" : "#F43F5E"}`, padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isMatch ? "TARGET LOCATED 🎯" : "50% ELIMINATED ❌"}
        </span>
      </div>

      {/* Pointers Row + Array */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Pointers */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", width: "100%", height: 48 }}>
          {ARRAY_DATA.map((item) => {
            const isL = item.idx === 5;
            const isTargetMatch = item.idx === 6 && isMatch;
            const isR = item.idx === 8;
            return (
              <div key={item.idx} style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                {isL && !isTargetMatch && (
                  <div style={{ backgroundColor: "#06B6D4", color: "#070B12", fontWeight: 900, fontSize: 15, padding: "4px 8px", borderRadius: 8, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    ↓ L
                  </div>
                )}
                {isTargetMatch && (
                  <div style={{ backgroundColor: "#10B981", color: "#070B12", fontWeight: 900, fontSize: 16, padding: "5px 12px", borderRadius: 10, fontFamily: nemiTheme.typography.fontFamily.mono, transform: `scale(${1 + pulse * 0.12})`, boxShadow: "0 0 25px #10B981" }}>
                    🎯 MATCH
                  </div>
                )}
                {isR && (
                  <div style={{ backgroundColor: "#A855F7", color: "#FFFFFF", fontWeight: 900, fontSize: 15, padding: "4px 8px", borderRadius: 8, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    ↓ R
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Array Cells */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", width: "100%" }}>
          {ARRAY_DATA.map((item) => {
            const isDead = item.idx <= 4;
            const isTargetMatch = item.idx === 6 && isMatch;
            return (
              <div
                key={item.idx}
                style={{
                  flex: 1,
                  height: 115,
                  backgroundColor: isTargetMatch ? "#064E3B" : isDead ? "#1E1E24" : "#1E293B",
                  border: isTargetMatch ? "3.5px solid #10B981" : isDead ? "1.5px dashed #475569" : "2px solid #334155",
                  borderRadius: 18,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  opacity: isDead ? 0.35 : 1,
                  transform: isTargetMatch ? `scale(${1 + pulse * 0.06})` : "none",
                  boxShadow: isTargetMatch ? "0 0 30px rgba(16, 185, 129, 0.5)" : "none",
                }}
              >
                <span style={{ color: "#94A3B8", fontSize: 14, fontFamily: nemiTheme.typography.fontFamily.mono }}>[{item.idx}]</span>
                <span style={{ color: isTargetMatch ? "#10B981" : isDead ? "#64748B" : "#F8FAFC", fontSize: 28, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, textDecoration: isDead ? "line-through" : "none" }}>
                  {item.val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Footer */}
      <div style={{ width: "100%", backgroundColor: isMatch ? "#022C22" : "#4C0519", padding: "16px 24px", borderRadius: 18, border: `2px solid ${isMatch ? "#10B981" : "#F43F5E"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>
          {isMatch ? "Target 13 found at Index 6 in just 2 steps!" : "Discarded [1, 3, 5, 7, 9] in a single comparison!"}
        </span>
        <span style={{ color: isMatch ? "#10B981" : "#F43F5E", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isMatch ? "RETURN 6 ✓" : "-50% SEARCH SPACE"}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. STAGE 5: 30 CUTS LOGARITHMIC TOWER PAYOFF
// ═══════════════════════════════════════════════════════════════
const Stage5LogarithmicTower: React.FC<{ frame: number; thirtyPayoffCue: number; oneLeftCue: number }> = ({ frame, thirtyPayoffCue, oneLeftCue }) => {
  const isOne = frame >= oneLeftCue;
  const count = interpolate(frame - thirtyPayoffCue, [0, 30], [1, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #FFD166",
        boxShadow: "0 24px 80px rgba(255, 209, 102, 0.3)",
        padding: "26px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>👑</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#FFD166" }}>Mathematical Power: 2³⁰ = 1,073,741,824</span>
        </div>
        <span style={{ backgroundColor: "rgba(255, 209, 102, 0.2)", color: "#FFD166", border: "1.5px solid #FFD166", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          STEP {Math.round(count)} / 30 ⚡
        </span>
      </div>

      {/* 30 Steps Progress Matrix */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 10, width: "100%" }}>
        {Array.from({ length: 30 }, (_, i) => {
          const isActive = i < count;
          const isFinal = i === 29 && isOne;
          return (
            <div
              key={i}
              style={{
                height: 52,
                borderRadius: 10,
                backgroundColor: isFinal ? "#10B981" : isActive ? "#FFD166" : "#1E293B",
                border: isFinal ? "2px solid #A7F3D0" : isActive ? "1.5px solid #FDE047" : "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isActive ? "#0B1120" : "#64748B",
                fontWeight: 900,
                fontSize: 15,
                fontFamily: nemiTheme.typography.fontFamily.mono,
                boxShadow: isFinal ? "0 0 22px #10B981" : "none",
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* Math Result Box */}
      <div style={{ backgroundColor: "#022C22", padding: "18px 32px", borderRadius: 20, border: "2.5px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Remaining Search Items:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 26, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isOne ? "1 EXACT ITEM FOUND! ✓" : "Narrowing (1B → 1)..."}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 6. STAGE 6: PYTHON LEETCODE CODE & SCORECARD
// ═══════════════════════════════════════════════════════════════
const Stage6CodeAndScorecard: React.FC<{ frame: number; cutG: number; loopWallCue: number }> = ({ frame, cutG, loopWallCue }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #06B6D4",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.3)",
        padding: "26px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 30 }}>💻</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#06B6D4", letterSpacing: "1px", textTransform: "uppercase" }}>
            LeetCode #704 Solution (Python)
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.25)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          O(log N) Time · O(1) Space
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 18 }}>
        {/* Python Code Block */}
        <div
          style={{
            backgroundColor: "#0F172A",
            padding: "18px 22px",
            borderRadius: 20,
            border: "2px solid #334155",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            fontSize: 16,
            lineHeight: 1.45,
            color: "#E2E8F0",
          }}
        >
          <div><span style={{ color: "#F43F5E" }}>def</span> <span style={{ color: "#38BDF8" }}>search</span>(nums, target):</div>
          <div style={{ paddingLeft: 16 }}>L, R = <span style={{ color: "#F59E0B" }}>0</span>, len(nums) - <span style={{ color: "#F59E0B" }}>1</span></div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: "#F43F5E" }}>while</span> L &lt;= R:</div>
          <div style={{ paddingLeft: 32 }}>mid = (L + R) // <span style={{ color: "#F59E0B" }}>2</span></div>
          <div style={{ paddingLeft: 32 }}><span style={{ color: "#F43F5E" }}>if</span> nums[mid] == target:</div>
          <div style={{ paddingLeft: 48 }}><span style={{ color: "#10B981" }}>return mid</span> <span style={{ color: "#64748B" }}># Found!</span></div>
          <div style={{ paddingLeft: 32 }}><span style={{ color: "#F43F5E" }}>elif</span> nums[mid] &lt; target:</div>
          <div style={{ paddingLeft: 48 }}>L = mid + <span style={{ color: "#F59E0B" }}>1</span></div>
          <div style={{ paddingLeft: 32 }}><span style={{ color: "#F43F5E" }}>else</span>:</div>
          <div style={{ paddingLeft: 48 }}>R = mid - <span style={{ color: "#F59E0B" }}>1</span></div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: "#F43F5E" }}>return</span> -<span style={{ color: "#F59E0B" }}>1</span></div>
        </div>

        {/* Complexity Scorecard */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ backgroundColor: "#0F172A", padding: "16px 20px", borderRadius: 18, border: "2px solid #F43F5E" }}>
            <div style={{ color: "#F43F5E", fontWeight: 900, fontSize: 20 }}>Linear Scan: O(N) 🐌</div>
            <div style={{ color: "#94A3B8", fontSize: 15, marginTop: 4 }}>1,000,000,000 checks</div>
          </div>
          <div style={{ backgroundColor: "#0F172A", padding: "16px 20px", borderRadius: 18, border: "2px solid #10B981" }}>
            <div style={{ color: "#10B981", fontWeight: 900, fontSize: 20 }}>Binary Search: O(log N) ⚡</div>
            <div style={{ color: "#94A3B8", fontSize: 15, marginTop: 4 }}>Maximum 30 checks</div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#03070D", padding: "16px 22px", borderRadius: 18, border: "1.5px solid rgba(6, 182, 212, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 800 }}>Ask better questions — halve the search space!</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>HIRED 😎✓</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px)
// ═══════════════════════════════════════════════════════════════
const DynamicKaraokeCaptions: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const subtitles = cuesData.subtitles || [];

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
