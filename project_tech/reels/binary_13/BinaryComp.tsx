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
import cuesData from "../../src/data/binary_13_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandPurple: "#A855F7",
    brandGreen: "#10B981",
    brandCoral: "#F43F5E",
    brandAmber: "#F59E0B",
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    cardDark: "#0B1120",
    textLight: "#0F172A",
    textDark: "#F8FAFC",
    borderLight: "#E2E8F0",
    borderDark: "#1E293B",
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
// PSEUDO-RANDOM NUMBER MATRIX
// ═══════════════════════════════════════════════════════════════
const COLS = 12;
const ROWS = 16;
const WALL_VALUES: string[][] = (() => {
  let a = 31337;
  const r = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () =>
      String(Math.floor(r() * 100000)).padStart(5, "0")
    )
  );
})();

export const BinaryComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 639;

  // ─── Timeline Events ───
  const evHook = getEvent("bn01_hook");
  const evClaim = getEvent("bn02_claim");
  const evGuess = getEvent("bn03_nemi_guess");
  const evSecret = getEvent("bn04_secret");
  const evMechanism = getEvent("bn05_mechanism");
  const evPayoff = getEvent("bn06_payoff");
  const evNemiPayoff = getEvent("bn07_nemi_payoff");
  const evLoop = getEvent("bn08_loop");

  // ─── Semantic Cue Frames ───
  const counterWallCue = getCue("bn01_hook", "counter_wall"); // 20
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

  // ─── Canvas Worlds ───
  const isDarkWorld = frame >= cutB && frame < loopWallCue;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;

  // ─── Nemi Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "thinking";
  } else if (frame < cutC) {
    nemiPose = "pointing";
  } else if (frame < cutD) {
    nemiPose = "shocked";
    nemiSpeech = "Find it without searching?! 🤯";
  } else if (frame < cutE) {
    nemiPose = "pointing";
  } else if (frame < cutF) {
    nemiPose = "aha";
  } else if (frame < cutG) {
    nemiPose = "aha";
  } else if (frame < cutH + 10) {
    nemiPose = "smug";
    nemiSpeech = "Ask better questions! 😎";
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
      {/* MASTER AUDIO (Voice + Ducked BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/binary_13/binary_master_audio.mp3")} volume={0.92} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SFX LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/binary_13/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={counterWallCue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/notification.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={thirtySlamCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/pop.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutB - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/binary_13/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={wallSliceCue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/ping.mp3")} volume={0.68} />
      </Sequence>
      <Sequence from={counterHalveCue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/click.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={nemiShockCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/error.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutD - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/binary_13/sfx/whoosh.mp3")} volume={0.7} />
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
      <Sequence from={Math.max(0, cutF - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/binary_13/sfx/riser.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={thirtyPayoffCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/notification.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={oneLeftCue} durationInFrames={40}>
        <Audio src={staticFile("reels/binary_13/sfx/chime.mp3")} volume={0.7} />
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
              left: -160,
              width: 650,
              height: 650,
              borderRadius: "50%",
              background: frame < cutE
                ? "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(90px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 700,
              right: -160,
              width: 650,
              height: 650,
              borderRadius: "50%",
              background: frame >= cutF
                ? "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(255, 209, 102, 0.18) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(90px)",
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP HUD (Appears strictly AFTER Second 2 — Frame 60+) */}
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
                boxShadow: `0 0 24px ${frame >= cutF ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCyan}`,
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
              Ep.13 · Binary Search
            </span>
          </div>
          <div
            style={{
              backgroundColor: isDarkWorld ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.96)",
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
            {frame < cutB ? "THE BILLION WALL" : frame < cutD ? "HALF-CUT SLICER" : frame < cutE ? "MIDDLE PROBE" : frame < cutF ? "LOGARITHMIC DEATH" : "30 STEPS TO 1"}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE A — FRAME-0 TO BEAT 2: BILLION NUMBER WALL & 30 SLAM */}
      {/* ══════════════════════════════════════════════════════════ */}
      {frame < cutB && (
        <>
          <div style={{ position: "absolute", top: 180, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div
              style={{
                fontSize: 58,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1.1,
                color: frame >= thirtySlamCue ? nemiTheme.colors.brandCyan : nemiTheme.colors.textLight,
              }}
            >
              {frame >= thirtySlamCue ? (
                <>
                  1,000,000,000 ITEMS. <span style={{ color: nemiTheme.colors.brandCoral }}>30 QUESTIONS.</span>
                </>
              ) : (
                <>
                  A BILLION SORTED ANSWERS.
                </>
              )}
            </div>
          </div>

          <LivingBillionWallCard frame={frame} thirtySlamCue={thirtySlamCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE B+C — BEAT 3 TO 5: THE FIRST 50% LASER SLICE */}
      {/* ══════════════════════════════════════════════════════════ */}
      {frame >= cutB && frame < cutD && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#06B6D4" }}>
              {frame < cutC ? "Finding Without Scanning Every Item ⚡" : "The Contradiction: No Linear Scan! 🤯"}
            </div>
          </div>

          <LivingHalfSliceCard frame={frame} wallSliceCue={wallSliceCue} counterHalveCue={counterHalveCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE D — BEAT 6: THE EXACT MIDDLE PROBE */}
      {/* ══════════════════════════════════════════════════════════ */}
      {frame >= cutD && frame < cutE && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#10B981" }}>
              The Secret: Sorted + Middle Probe 🎯
            </div>
          </div>

          <LivingMiddleProbeCard frame={frame} sortedLockCue={sortedLockCue} midCheckCue={midCheckCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE E — BEAT 7 TO 8: LOGARITHMIC ELIMINATION (HALF DIES) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {frame >= cutE && frame < cutF && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#F43F5E" }}>
              Too High? Half Dies. Too Low? Half Dies. 💥
            </div>
          </div>

          <LivingGuillotineCard frame={frame} tooHighCue={tooHighCue} halfDieCue={halfDieCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE F — BEAT 9 TO 10: 30 STEPS TO 1 PAYOFF TOWER */}
      {/* ══════════════════════════════════════════════════════════ */}
      {frame >= cutF && frame < cutG && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#FFD166" }}>
              Thirty Cuts: 1 Billion Becomes 1! ⚡
            </div>
          </div>

          <LivingThirtyStepTowerCard frame={frame} thirtyPayoffCue={thirtyPayoffCue} oneLeftCue={oneLeftCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE G+H — BEAT 11 TO 13: NEMI SMUG & REPLAY LOOP SEAM */}
      {/* ══════════════════════════════════════════════════════════ */}
      {frame >= cutG && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#06B6D4" }}>
              The Power of O(log N)
            </div>
          </div>

          <LivingBinaryVerdictCard frame={frame} cutG={cutG} loopWallCue={loopWallCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} fps={fps} />}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASCOT DOCK (Safe Zone: bottom: 70px) */}
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
      {/* SPEECH BUBBLE (Strictly on Top of Nemi at bottom: 440px) */}
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
// 1. LIVING BILLION WALL CARD (Stage A: Active Moving Grid Rain)
// ═══════════════════════════════════════════════════════════════
const LivingBillionWallCard: React.FC<{ frame: number; thirtySlamCue: number }> = ({ frame, thirtySlamCue }) => {
  const isSlammed = frame >= thirtySlamCue;
  const pulse = Math.sin(frame * 0.25);
  const matrixShift = (frame * 4) % 30;

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 540,
        backgroundColor: "#FFFFFF",
        borderRadius: 36,
        border: isSlammed ? "4px solid #06B6D4" : "3.5px solid #F59E0B",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.25)",
        padding: "24px 30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Moving Numeric Matrix Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 6,
          fontFamily: nemiTheme.typography.fontFamily.mono,
          fontSize: 16,
          fontWeight: 700,
          color: "#0F172A",
          transform: `translateY(${matrixShift}px)`,
        }}
      >
        {WALL_VALUES.slice(0, 10).map((row, ri) => (
          <div key={ri} style={{ display: "flex", justifyContent: "space-around" }}>
            {row.map((val, ci) => (
              <span key={ci}>{val}</span>
            ))}
          </div>
        ))}
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>📚</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>1,000,000,000 Item Array</span>
        </div>
        <span style={{ backgroundColor: "#CFFAFE", color: "#0891B2", border: "1.5px solid #67E8F9", padding: "8px 18px", borderRadius: 14, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SORTED IN MEMORY ⚡
        </span>
      </div>

      {/* Main Visual Display */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 10 }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#0891B2", fontFamily: nemiTheme.typography.fontFamily.mono, letterSpacing: -2, textShadow: "0 0 30px rgba(6, 182, 212, 0.3)" }}>
          1,000,000,000
        </div>

        {isSlammed && (
          <div
            style={{
              backgroundColor: "#ECFEFF",
              border: "3.5px solid #06B6D4",
              borderRadius: 24,
              padding: "16px 36px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 14px 40px rgba(6, 182, 212, 0.35)",
              transform: `scale(${1 + pulse * 0.04})`,
            }}
          >
            <span style={{ fontSize: 36 }}>🎯</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: "#0E7490", fontFamily: nemiTheme.typography.fontFamily.mono }}>
              SOLVED IN EXACTLY 30 CUTS
            </span>
          </div>
        )}
      </div>

      <div style={{ width: "100%", backgroundColor: "#F0FDFA", padding: "12px 22px", borderRadius: 18, border: "2px solid #06B6D4", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <span style={{ color: "#0F172A", fontSize: 18, fontWeight: 700 }}>Linear search takes 1 billion steps:</span>
        <span style={{ color: "#0891B2", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>BINARY TAKES 30 ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. LIVING HALF SLICE CARD (Stage B: Laser Split in Half)
// ═══════════════════════════════════════════════════════════════
const LivingHalfSliceCard: React.FC<{ frame: number; wallSliceCue: number; counterHalveCue: number }> = ({ frame, wallSliceCue, counterHalveCue }) => {
  const isSliced = frame >= wallSliceCue;
  const isHalved = frame >= counterHalveCue;
  const splitGap = interpolate(frame - wallSliceCue, [0, 8], [0, 48], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50)",
        width: 950,
        height: 540,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #06B6D4",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.3)",
        padding: "24px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>✂️</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>The First Cut: 50% Eliminated Instantly</span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          STEP 1 OF 30 ⚡
        </span>
      </div>

      {/* Two Halves Splitting Apart */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: splitGap, width: "100%" }}>
        <div
          style={{
            backgroundColor: "#0F172A",
            padding: "24px 30px",
            borderRadius: 24,
            border: "3px solid #06B6D4",
            textAlign: "center",
            width: 380,
            boxShadow: "0 10px 30px rgba(6, 182, 212, 0.2)",
          }}
        >
          <div style={{ color: "#94A3B8", fontSize: 16, fontFamily: nemiTheme.typography.fontFamily.mono }}>Left Half (0 → 500M)</div>
          <div style={{ color: "#06B6D4", fontSize: 38, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 6 }}>
            500,000,000
          </div>
          <div style={{ color: "#10B981", fontSize: 16, fontWeight: 800, marginTop: 8 }}>✓ Kept for Search</div>
        </div>

        <div
          style={{
            backgroundColor: isHalved ? "#4C0519" : "#0F172A",
            padding: "24px 30px",
            borderRadius: 24,
            border: isHalved ? "3px solid #F43F5E" : "3px solid #64748B",
            textAlign: "center",
            width: 380,
            boxShadow: isHalved ? "0 10px 30px rgba(244, 63, 94, 0.3)" : "none",
          }}
        >
          <div style={{ color: isHalved ? "#FDA4AF" : "#94A3B8", fontSize: 16, fontFamily: nemiTheme.typography.fontFamily.mono }}>Right Half (500M → 1B)</div>
          <div style={{ color: isHalved ? "#F43F5E" : "#94A3B8", fontSize: 38, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 6 }}>
            500,000,000
          </div>
          <div style={{ color: isHalved ? "#F43F5E" : "#94A3B8", fontSize: 16, fontWeight: 800, marginTop: 8 }}>
            {isHalved ? "❌ DISCARDED FOREVER" : "Testing..."}
          </div>
        </div>
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "12px 22px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>Single comparison discards half the universe:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>500,000,000 ITEMS GONE 💥</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. LIVING MIDDLE PROBE CARD (Stage D: Center Element Targeting)
// ═══════════════════════════════════════════════════════════════
const LivingMiddleProbeCard: React.FC<{ frame: number; sortedLockCue: number; midCheckCue: number }> = ({ frame, sortedLockCue, midCheckCue }) => {
  const isMid = frame >= midCheckCue;
  const pulse = Math.sin(frame * 0.3);

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 540,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #10B981",
        boxShadow: "0 24px 80px rgba(16, 185, 129, 0.3)",
        padding: "24px 36px",
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
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Sorted Index Arithmetic: mid = (L + R) / 2</span>
        </div>
        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#10B981", border: "1.5px solid #10B981", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          PROBE TARGETING ⚡
        </span>
      </div>

      {/* Sorted Array Ladder */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, width: "100%" }}>
        {[
          { label: "Index 0", val: "10", type: "left" },
          { label: "Index 250M", val: "2,491", type: "sub" },
          { label: "Index 500M (MID)", val: "4,992", type: "mid" },
          { label: "Index 750M", val: "7,819", type: "sub" },
          { label: "Index 1B", val: "9,999", type: "right" },
        ].map((item, idx) => {
          const isCenter = item.type === "mid";
          return (
            <div
              key={idx}
              style={{
                backgroundColor: isCenter ? (isMid ? "#064E3B" : "#0F172A") : "#0F172A",
                padding: "20px 10px",
                borderRadius: 20,
                border: isCenter ? "3px solid #10B981" : "1.5px solid #334155",
                textAlign: "center",
                transform: isCenter ? `scale(${1 + pulse * 0.06})` : "scale(1)",
                boxShadow: isCenter ? "0 0 30px rgba(16, 185, 129, 0.4)" : "none",
              }}
            >
              <div style={{ color: isCenter ? "#A7F3D0" : "#94A3B8", fontSize: 13, fontFamily: nemiTheme.typography.fontFamily.mono }}>{item.label}</div>
              <div style={{ color: isCenter ? "#10B981" : "#F8FAFC", fontSize: 26, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
                {item.val}
              </div>
              <div style={{ color: isCenter ? "#FFD166" : "#64748B", fontSize: 13, fontWeight: 800, marginTop: 6 }}>
                {isCenter ? "🎯 Target Check" : "Skipped"}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "12px 22px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>If Target &lt; Mid: discard entire right half:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>EXACT 1-OP DECISION ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. LIVING GUILLOTINE CARD (Stage E: Discarding Halves Rapidly)
// ═══════════════════════════════════════════════════════════════
const LivingGuillotineCard: React.FC<{ frame: number; tooHighCue: number; halfDieCue: number }> = ({ frame, tooHighCue, halfDieCue }) => {
  const isHigh = frame >= tooHighCue;
  const isSecondDie = frame >= halfDieCue;

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 540,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #F43F5E",
        boxShadow: "0 24px 80px rgba(244, 63, 94, 0.3)",
        padding: "24px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>💥</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Exponential Elimination: N → N/2 → N/4</span>
        </div>
        <span style={{ backgroundColor: "rgba(244, 63, 94, 0.25)", color: "#F43F5E", border: "1.5px solid #F43F5E", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SEARCH SPACE COLLAPSE
        </span>
      </div>

      {/* 3 Step Sequence */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, width: "100%" }}>
        <div style={{ backgroundColor: "#4C0519", padding: "20px", borderRadius: 20, border: "2px solid #F43F5E", textAlign: "center" }}>
          <div style={{ color: "#FDA4AF", fontSize: 15, fontFamily: nemiTheme.typography.fontFamily.mono }}>Cut 1: Too High</div>
          <div style={{ color: "#F43F5E", fontSize: 32, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>-500,000,000</div>
          <div style={{ color: "#FDA4AF", fontSize: 14, fontWeight: 800, marginTop: 6 }}>❌ 50% Deleted</div>
        </div>

        <div style={{ backgroundColor: isHigh ? "#4C0519" : "#0F172A", padding: "20px", borderRadius: 20, border: isHigh ? "2px solid #F43F5E" : "2px solid #334155", textAlign: "center" }}>
          <div style={{ color: isHigh ? "#FDA4AF" : "#94A3B8", fontSize: 15, fontFamily: nemiTheme.typography.fontFamily.mono }}>Cut 2: Too Low</div>
          <div style={{ color: isHigh ? "#F43F5E" : "#94A3B8", fontSize: 32, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>-250,000,000</div>
          <div style={{ color: isHigh ? "#FDA4AF" : "#94A3B8", fontSize: 14, fontWeight: 800, marginTop: 6 }}>
            {isHigh ? "❌ 75% Deleted" : "Waiting..."}
          </div>
        </div>

        <div style={{ backgroundColor: isSecondDie ? "#4C0519" : "#0F172A", padding: "20px", borderRadius: 20, border: isSecondDie ? "2px solid #F43F5E" : "2px solid #334155", textAlign: "center" }}>
          <div style={{ color: isSecondDie ? "#FDA4AF" : "#94A3B8", fontSize: 15, fontFamily: nemiTheme.typography.fontFamily.mono }}>Cut 3: Too High</div>
          <div style={{ color: isSecondDie ? "#F43F5E" : "#94A3B8", fontSize: 32, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>-125,000,000</div>
          <div style={{ color: isSecondDie ? "#FDA4AF" : "#94A3B8", fontSize: 14, fontWeight: 800, marginTop: 6 }}>
            {isSecondDie ? "❌ 87.5% Deleted" : "Waiting..."}
          </div>
        </div>
      </div>

      <div style={{ width: "100%", backgroundColor: "#18060B", padding: "12px 22px", borderRadius: 18, border: "2px solid #F43F5E", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>In just 3 questions, 875,000,000 answers died:</span>
        <span style={{ color: "#F43F5E", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>EXPONENTIAL SPEED ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. LIVING 30-STEP TOWER CARD (Stage F: Payoff — 1 Billion to 1)
// ═══════════════════════════════════════════════════════════════
const LivingThirtyStepTowerCard: React.FC<{ frame: number; thirtyPayoffCue: number; oneLeftCue: number }> = ({ frame, thirtyPayoffCue, oneLeftCue }) => {
  const isOne = frame >= oneLeftCue;
  const count = interpolate(frame - thirtyPayoffCue, [0, 30], [1, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 540,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #FFD166",
        boxShadow: "0 24px 80px rgba(255, 209, 102, 0.3)",
        padding: "24px 36px",
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
          <span style={{ fontSize: 24, fontWeight: 900, color: "#FFD166" }}>2³⁰ = 1,073,741,824 Operations</span>
        </div>
        <span style={{ backgroundColor: "rgba(255, 209, 102, 0.2)", color: "#FFD166", border: "1.5px solid #FFD166", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          STEP {Math.round(count)} / 30 ⚡
        </span>
      </div>

      {/* 30 Steps Progress Matrix */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8, width: "100%" }}>
        {Array.from({ length: 30 }, (_, i) => {
          const isActive = i < count;
          const isFinal = i === 29 && isOne;
          return (
            <div
              key={i}
              style={{
                height: 48,
                borderRadius: 10,
                backgroundColor: isFinal ? "#10B981" : isActive ? "#FFD166" : "#1E293B",
                border: isFinal ? "2px solid #A7F3D0" : isActive ? "1.5px solid #FDE047" : "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isActive ? "#0B1120" : "#64748B",
                fontWeight: 900,
                fontSize: 14,
                fontFamily: nemiTheme.typography.fontFamily.mono,
                boxShadow: isFinal ? "0 0 20px #10B981" : "none",
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* Target Result Box */}
      <div style={{ backgroundColor: "#022C22", padding: "16px 30px", borderRadius: 20, border: "2.5px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Remaining Candidate Items:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 26, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isOne ? "EXACTLY 1 ITEM LOCATED! ✓" : "Narrowing..."}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 6. LIVING BINARY VERDICT CARD (Stage G+H: Verdict & Loop Seam)
// ═══════════════════════════════════════════════════════════════
const LivingBinaryVerdictCard: React.FC<{ frame: number; cutG: number; loopWallCue: number }> = ({ frame, cutG, loopWallCue }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 540,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #06B6D4",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.3)",
        padding: "28px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>💡</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            THE BINARY SEARCH SECRET
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.25)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "8px 18px", borderRadius: 14, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          TAKEAWAY
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "24px", borderRadius: 22, border: "2.5px solid #F43F5E" }}>
          <div style={{ color: "#F43F5E", fontWeight: 900, fontSize: 26 }}>Linear Scan (O(N)) 🐌</div>
          <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, marginTop: 10 }}>• 1 Billion comparisons</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• Checks item by item</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• Freezes your processor</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "24px", borderRadius: 22, border: "2.5px solid #10B981" }}>
          <div style={{ color: "#10B981", fontWeight: 900, fontSize: 26 }}>Binary Search (O(log N)) ⚡</div>
          <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, marginTop: 10 }}>• 30 comparisons total</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• Cuts half each step</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• Microsecond lookup</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#03070D", padding: "18px 24px", borderRadius: 20, border: "1.5px solid rgba(6, 182, 212, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Ask better questions — eliminate half the universe!</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>SOLVED ✓</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC VIRAL KARAOKE CAPTIONS
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
