import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NemiMascot, NemiPose } from "../components/NemiMascot";
import { NEMI_THEME } from "../constants/nemiTheme";
import cuesData from "../data/nemi_v12_cues.json";

// ═══════════════════════════════════════════════════════════════════
// NEMI EXPLAINS V14 — FULL-SCREEN VERTICAL CANVAS & DYNAMIC BGM
// TOPIC: WHY DOES 0.1 + 0.2 NOT EQUAL 0.3? (~22.2s @ 30fps)
// ═══════════════════════════════════════════════════════════════════

const getEvent = (id: string) => {
  const ev = cuesData.timeline_events.find((x) => x.id === id);
  return ev ?? { start_frame: 0, end_frame: 0, start_time_ms: 0, end_time_ms: 0, duration_s: 0, semantic_cues: [] };
};

const getCueFrame = (eventId: string, cueName: string, fallback: number) => {
  const ev = cuesData.timeline_events.find((x) => x.id === eventId);
  if (!ev) return fallback;
  const sc = ev.semantic_cues.find((x: any) => x.cue === cueName);
  return sc ? sc.frame : fallback;
};

// Repeating binary pattern of 0.1: 0.00011001100110011...
const BIT_SEQUENCE = [
  "0", ".", "0", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "1"
];

export const NemiExplainsV14Comp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Timeline Events Derived from Speaker Pipeline ───
  const evHook = getEvent("v12_narrator_01_hook");
  const evWhat = getEvent("v12_nemi_01_what");
  const evQuestion = getEvent("v12_narrator_02_question");
  const evBinary = getEvent("v12_narrator_03_binary");
  const evApprox = getEvent("v12_narrator_04_approx");
  const evAha = getEvent("v12_narrator_05_aha");
  const evSneaky = getEvent("v12_nemi_02_sneaky");

  // Semantic Cues
  const fErrorPop = getCueFrame("v12_narrator_01_hook", "error_result_pop", evHook.start_frame + 45);
  const fTrailingFour = getCueFrame("v12_narrator_04_approx", "trailing_four_zoom", evApprox.start_frame + 60);
  const fMasterTakeaway = getCueFrame("v12_narrator_05_aha", "master_takeaway", evAha.start_frame + 50);

  // ─── Narrative Stages ───
  const isHookStage = frame < evQuestion.start_frame;
  const isQuestionStage = frame >= evQuestion.start_frame && frame < evBinary.start_frame;
  const isBinaryStage = frame >= evBinary.start_frame && frame < evApprox.start_frame;
  const isApproxStage = frame >= evApprox.start_frame && frame < evAha.start_frame;
  const isAhaStage = frame >= evAha.start_frame && frame < fMasterTakeaway;
  const isPayoffStage = frame >= fMasterTakeaway;

  // ─── Visual World Background ───
  const isDarkScene = isBinaryStage || isApproxStage || isAhaStage;
  const bgColor = isDarkScene ? "#0B0F17" : NEMI_THEME.colors.bg.cream;

  // ─── Dynamic Nemi Placement (Integrated Dynamic Actor Across Canvas) ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;
  let speechStartFrame = 0;
  let nemiLeft = 380;
  let nemiTop = 840;
  let nemiScale = 1.65;

  if (isHookStage) {
    const isShocked = frame >= evWhat.start_frame;
    nemiPose = isShocked ? "shocked" : "thinking";
    nemiLeft = 560;
    nemiTop = 840;
    nemiScale = 1.65;
    if (isShocked && frame < evWhat.end_frame + 15) {
      nemiSpeech = "Wait, what?! 🤯";
      speechStartFrame = evWhat.start_frame;
    }
  } else if (isQuestionStage) {
    nemiPose = "puzzled";
    nemiLeft = 140;
    nemiTop = 820;
    nemiScale = 1.6;
  } else if (isBinaryStage) {
    nemiPose = "explaining";
    nemiLeft = 140;
    nemiTop = 880;
    nemiScale = 1.6;
  } else if (isApproxStage) {
    nemiPose = "aha";
    nemiLeft = 140;
    nemiTop = 920;
    nemiScale = 1.55;
  } else if (isAhaStage) {
    nemiPose = "smug";
    nemiLeft = 560;
    nemiTop = 960;
    nemiScale = 1.6;
  } else if (isPayoffStage) {
    nemiPose = "smug";
    nemiLeft = 380;
    nemiTop = 1120;
    nemiScale = 1.7;
    if (frame >= evSneaky.start_frame) {
      nemiSpeech = "Sneaky binary! 😎⚡";
      speechStartFrame = evSneaky.start_frame;
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: "hidden", fontFamily: NEMI_THEME.typography.fontDisplay }}>

      {/* Ambient Lighting & Technical Grid */}
      {isDarkScene ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px)",
              backgroundSize: "40px 40px",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "15%",
              width: "800px",
              height: "800px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, transparent 70%)",
              filter: "blur(100px)",
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)",
              backgroundSize: "36px 36px",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "28%",
              left: "18%",
              width: "800px",
              height: "800px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(244, 63, 94, 0.14) 0%, transparent 70%)",
              filter: "blur(100px)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Top Header Badge */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          right: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: NEMI_THEME.colors.brand.yellow,
              boxShadow: "0 0 14px #FFD166",
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: 2,
              color: isDarkScene ? "#94A3B8" : "#475569",
              fontFamily: NEMI_THEME.typography.fontHeading,
            }}
          >
            CS FOUNDATIONS · FLOATING POINT ARITHMETIC
          </span>
        </div>

        <div
          style={{
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: isDarkScene ? "rgba(255,255,255,0.08)" : "rgba(24, 24, 27, 0.06)",
            border: `1px solid ${isDarkScene ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
            backdropFilter: "blur(10px)",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: 2,
              color: NEMI_THEME.colors.brand.yellow,
              fontFamily: NEMI_THEME.typography.fontHeading,
            }}
          >
            ⚡ NEMI EXPLAINS
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          BEAT 1 — HOOK (FULL VERTICAL CANVAS UTILIZATION) (0 → 120)
         ═══════════════════════════════════════════════════════════ */}
      {isHookStage && (() => {
        const titlePop = spring({ frame, fps, config: NEMI_THEME.springs.snappy });
        const hasResult = frame >= fErrorPop;
        const resultPop = hasResult ? spring({ frame: frame - fErrorPop, fps, config: NEMI_THEME.springs.pop }) : 0;

        return (
          <>
            {/* Top Headline Banner */}
            <div
              style={{
                position: "absolute",
                top: 170,
                left: 60,
                right: 60,
                textAlign: "center",
                zIndex: 30,
                transform: `scale(${titlePop})`,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 24px",
                  borderRadius: 9999,
                  backgroundColor: "#FEE2E2",
                  color: "#B91C1C",
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                THE MATH MYSTERY
              </span>
              <h1
                style={{
                  fontSize: 68,
                  fontWeight: 900,
                  lineHeight: 1.12,
                  color: NEMI_THEME.colors.text.headingDark,
                  letterSpacing: -2,
                  margin: 0,
                }}
              >
                0.1 + 0.2 is NOT 0.3?
              </h1>
              <p style={{ fontSize: 26, fontWeight: 700, color: "#64748B", marginTop: 10 }}>
                Try this in your browser console right now.
              </p>
            </div>

            {/* Central Terminal Console (Occupies Y: 430 to Y: 820) */}
            <div
              style={{
                position: "absolute",
                top: 430,
                left: 65,
                right: 65,
                padding: "36px 44px",
                borderRadius: 32,
                backgroundColor: "#18181B",
                border: "3px solid rgba(255, 255, 255, 0.14)",
                boxShadow: "0 35px 80px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                gap: 22,
                zIndex: 25,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#EF4444" }} />
                  <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
                  <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#10B981" }} />
                  <span style={{ fontSize: 17, color: "#94A3B8", marginLeft: 10, fontFamily: NEMI_THEME.typography.fontCode }}>
                    node interactive shell
                  </span>
                </div>
                <span style={{ fontSize: 14, color: "#64748B", fontFamily: NEMI_THEME.typography.fontCode }}>
                  IEEE 754 float64
                </span>
              </div>

              <div style={{ fontSize: 46, fontWeight: 900, color: "#F8FAFC", fontFamily: NEMI_THEME.typography.fontCode }}>
                <span style={{ color: "#06B6D4" }}>&gt;</span> 0.1 + 0.2
              </div>

              {hasResult && (
                <div
                  style={{
                    padding: "24px 32px",
                    borderRadius: 20,
                    backgroundColor: "rgba(244, 63, 94, 0.25)",
                    border: "3px solid #F43F5E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transform: `scale(${resultPop})`,
                    boxShadow: "0 0 45px rgba(244, 63, 94, 0.35)",
                  }}
                >
                  <span style={{ fontSize: 36, fontWeight: 900, color: "#F43F5E", fontFamily: NEMI_THEME.typography.fontCode }}>
                    0.30000000000000004
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: "#FECDD3", letterSpacing: 1.5 }}>
                    MISMATCH ⚠️
                  </span>
                </div>
              )}
            </div>

            {/* Lower-Middle Educational Hardware Callout (Occupies Y: 1320 to Y: 1540) */}
            <div
              style={{
                position: "absolute",
                top: 1320,
                left: 65,
                right: 65,
                padding: "28px 36px",
                borderRadius: 26,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                border: "2px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 20,
                zIndex: 20,
              }}
            >
              <div style={{ fontSize: 36 }}>⚡</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#1E293B" }}>Double-Precision Hardware Constraint</div>
                <div style={{ fontSize: 17, color: "#64748B", marginTop: 4 }}>
                  JavaScript, Python, C++, Java all return this exact identical decimal error.
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 2 — THE CORE QUESTION (Frames 120 → 234)
         ═══════════════════════════════════════════════════════════ */}
      {isQuestionStage && (() => {
        const pop = spring({ frame: frame - evQuestion.start_frame, fps, config: NEMI_THEME.springs.snappy });

        return (
          <>
            <div style={{ position: "absolute", top: 170, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 24px",
                  borderRadius: 9999,
                  backgroundColor: "#FEF3C7",
                  color: "#B45309",
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                THE CORE QUESTION
              </span>
              <h2 style={{ fontSize: 64, fontWeight: 900, color: NEMI_THEME.colors.text.headingDark, letterSpacing: -1.5, margin: 0 }}>
                Why does a supercomputer fail 1st-grade math?
              </h2>
            </div>

            {/* Comparison Console Cards (Occupies Y: 420 to Y: 800) */}
            <div
              style={{
                position: "absolute",
                top: 420,
                left: 65,
                right: 65,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                zIndex: 20,
                transform: `scale(${pop})`,
              }}
            >
              <div
                style={{
                  padding: "28px 36px",
                  borderRadius: 24,
                  backgroundColor: "#FFFFFF",
                  border: "3px solid #10B981",
                  boxShadow: "0 15px 40px rgba(16, 185, 129, 0.15)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#047857" }}>HUMAN BASE-10 MATH</div>
                  <div style={{ fontSize: 20, color: "#64748B", marginTop: 4 }}>Exact fraction: 1/10 + 2/10</div>
                </div>
                <div style={{ fontSize: 40, fontWeight: 900, color: "#10B981", fontFamily: NEMI_THEME.typography.fontCode }}>
                  0.3 ✓
                </div>
              </div>

              <div
                style={{
                  padding: "28px 36px",
                  borderRadius: 24,
                  backgroundColor: "#FFFFFF",
                  border: "3px solid #EF4444",
                  boxShadow: "0 15px 40px rgba(239, 68, 68, 0.15)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#B91C1C" }}>COMPUTER BINARY FLOAT</div>
                  <div style={{ fontSize: 20, color: "#64748B", marginTop: 4 }}>Base-2 approximation</div>
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, color: "#EF4444", fontFamily: NEMI_THEME.typography.fontCode }}>
                  0.300...4 ❌
                </div>
              </div>
            </div>

            {/* Lower Callout Banner (Occupies Y: 1320 to Y: 1540) */}
            <div
              style={{
                position: "absolute",
                top: 1320,
                left: 65,
                right: 65,
                padding: "28px 36px",
                borderRadius: 26,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "2.5px solid #18181B",
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                zIndex: 20,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, color: "#18181B" }}>
                💡 It's not a software bug or glitch.
              </div>
              <div style={{ fontSize: 18, color: "#64748B", marginTop: 6, lineHeight: 1.4 }}>
                Hardware registers represent all data in Base-2 switches. In binary, 0.1 is an infinite repeating pattern!
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 3 — FULL-SCREEN BINARY ARENA (Frames 234 → 388)
         ═══════════════════════════════════════════════════════════ */}
      {isBinaryStage && (() => {
        const pop = spring({ frame: frame - evBinary.start_frame, fps, config: NEMI_THEME.springs.snappy });
        const scrollOffset = (frame - evBinary.start_frame) * 9.5;

        return (
          <>
            <div style={{ position: "absolute", top: 160, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 24px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(6, 182, 212, 0.2)",
                  color: NEMI_THEME.colors.brand.cyanGlow,
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                THE ROOT CAUSE: BASE-2 BINARY
              </span>
              <h2 style={{ fontSize: 62, fontWeight: 900, color: "#FFFFFF", letterSpacing: -1.5, margin: 0 }}>
                0.1 is an infinite repeating fraction!
              </h2>
            </div>

            {/* Binary Unfolding Stack (Occupies Y: 370 to Y: 840) */}
            <div
              style={{
                position: "absolute",
                top: 370,
                left: 60,
                right: 60,
                display: "flex",
                flexDirection: "column",
                gap: 22,
                zIndex: 20,
                transform: `scale(${pop})`,
              }}
            >
              {/* Decimal Comparison Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "22px 36px",
                  borderRadius: 22,
                  backgroundColor: "rgba(255, 255, 255, 0.07)",
                  border: "2px solid rgba(255, 255, 255, 0.18)",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#94A3B8" }}>DECIMAL BASE-10</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#FFFFFF", fontFamily: NEMI_THEME.typography.fontCode }}>
                    1 / 10 = 0.1 (Clean Exact)
                  </div>
                </div>
                <span style={{ fontSize: 34 }}>🎯</span>
              </div>

              {/* Physical Infinite Scrolling Bit Conveyor Arena */}
              <div
                style={{
                  padding: "36px 0",
                  borderRadius: 30,
                  backgroundColor: "#18181B",
                  border: "3.5px solid rgba(6, 182, 212, 0.65)",
                  boxShadow: "0 0 70px rgba(6, 182, 212, 0.35)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 32,
                    fontSize: 15,
                    fontWeight: 900,
                    letterSpacing: 2,
                    color: NEMI_THEME.colors.brand.cyanGlow,
                  }}
                >
                  BINARY STREAM (BASE-2 FRACTION)
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    marginTop: 28,
                    transform: `translateX(${-scrollOffset}px)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {[...BIT_SEQUENCE, ...BIT_SEQUENCE].map((bit, idx) => (
                    <div
                      key={idx}
                      style={{
                        minWidth: 68,
                        height: 82,
                        borderRadius: 18,
                        backgroundColor: bit === "1" ? "rgba(6, 182, 212, 0.35)" : "rgba(255, 255, 255, 0.08)",
                        border: `2.5px solid ${bit === "1" ? NEMI_THEME.colors.brand.cyanGlow : "rgba(255, 255, 255, 0.2)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 38,
                        fontWeight: 900,
                        color: bit === "1" ? NEMI_THEME.colors.brand.cyanGlow : "#F8FAFC",
                        fontFamily: NEMI_THEME.typography.fontCode,
                        boxShadow: bit === "1" ? "0 0 25px rgba(6, 182, 212, 0.45)" : "none",
                      }}
                    >
                      {bit}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 22,
                    marginRight: 32,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 17,
                    fontWeight: 900,
                    color: NEMI_THEME.colors.brand.yellow,
                  }}
                >
                  <span>🔁 Repeating Pattern (0011... Never Terminates!)</span>
                </div>
              </div>
            </div>

            {/* Lower Educational Box (Occupies Y: 1360 to Y: 1560) */}
            <div
              style={{
                position: "absolute",
                top: 1360,
                left: 60,
                right: 60,
                padding: "26px 36px",
                borderRadius: 24,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1.5px solid rgba(255, 255, 255, 0.12)",
                zIndex: 20,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 900, color: NEMI_THEME.colors.brand.cyanGlow }}>
                Just like 1/3 in base-10 is 0.33333...
              </div>
              <div style={{ fontSize: 17, color: "#94A3B8", marginTop: 6 }}>
                In base-2, 1/10 becomes an unending infinite sequence: 0.0001100110011...
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 4 — 53-BIT HARDWARE CHASSIS (Frames 388 → 532)
         ═══════════════════════════════════════════════════════════ */}
      {isApproxStage && (() => {
        const isHighlight = frame >= fTrailingFour;

        return (
          <>
            <div style={{ position: "absolute", top: 160, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 24px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(255, 209, 102, 0.2)",
                  color: NEMI_THEME.colors.brand.yellow,
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                IEEE 754 DOUBLE PRECISION
              </span>
              <h2 style={{ fontSize: 62, fontWeight: 900, color: "#FFFFFF", letterSpacing: -1.5, margin: 0 }}>
                Rounds to 53 bits of storage
              </h2>
            </div>

            {/* Hardware Register Chassis (Occupies Y: 360 to Y: 860) */}
            <div
              style={{
                position: "absolute",
                top: 360,
                left: 60,
                right: 60,
                display: "flex",
                flexDirection: "column",
                gap: 22,
                zIndex: 20,
              }}
            >
              <div
                style={{
                  position: "relative",
                  padding: "36px 40px",
                  borderRadius: 32,
                  backgroundColor: "rgba(24, 24, 27, 0.96)",
                  border: "3.5px solid rgba(255, 209, 102, 0.75)",
                  boxShadow: "0 0 80px rgba(255, 209, 102, 0.35)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontSize: 17, fontWeight: 900, color: NEMI_THEME.colors.brand.yellow, letterSpacing: 2 }}>
                    [ 53-BIT HARDWARE REGISTER ]
                  </span>
                  <span style={{ fontSize: 15, color: "#F43F5E", fontWeight: 900, letterSpacing: 1 }}>
                    ✂️ TRUNCATION CUT-OFF
                  </span>
                </div>

                <div style={{ fontSize: 23, color: "#94A3B8", fontFamily: NEMI_THEME.typography.fontCode, marginBottom: 12 }}>
                  float(0.1) = 0.10000000000000000555...
                </div>
                <div style={{ fontSize: 23, color: "#94A3B8", fontFamily: NEMI_THEME.typography.fontCode, marginBottom: 18 }}>
                  + float(0.2) = 0.20000000000000001110...
                </div>

                <div style={{ height: 2, backgroundColor: "rgba(255, 255, 255, 0.25)", marginBottom: 20 }} />

                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    fontFamily: NEMI_THEME.typography.fontCode,
                  }}
                >
                  = 0.3000000000000000
                  <span
                    style={{
                      color: isHighlight ? "#FFD166" : "#FFFFFF",
                      fontSize: isHighlight ? 50 : 32,
                      fontWeight: 900,
                      textShadow: isHighlight ? "0 0 35px #FFD166, 0 0 70px #FFD166" : "none",
                      transition: "all 0.2s ease-out",
                    }}
                  >
                    4
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: "20px 28px",
                  borderRadius: 20,
                  backgroundColor: "rgba(244, 63, 94, 0.2)",
                  border: "2px solid rgba(244, 63, 94, 0.45)",
                  fontSize: 21,
                  fontWeight: 800,
                  color: "#FECDD3",
                  textAlign: "center",
                }}
              >
                ⚠️ Adding two rounded approximations produces the tiny excess bit!
              </div>
            </div>

            {/* Lower Summary Callout (Occupies Y: 1380 to Y: 1560) */}
            <div
              style={{
                position: "absolute",
                top: 1380,
                left: 60,
                right: 60,
                padding: "24px 32px",
                borderRadius: 22,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1.5px solid rgba(255, 255, 255, 0.12)",
                zIndex: 20,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 900, color: "#FFD166" }}>
                Finite 64-Bit Memory Limit
              </div>
              <div style={{ fontSize: 17, color: "#94A3B8", marginTop: 4 }}>
                The computer cuts off after 53 significant bits, converting infinite precision into an approximation.
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 5 & 6 — THE "AHA!" & OUTRO PAYOFF (Frames 532 → 666)
         ═══════════════════════════════════════════════════════════ */}
      {(isAhaStage || isPayoffStage) && (() => {
        const local = frame - (isPayoffStage ? fMasterTakeaway : evAha.start_frame);
        const pop = spring({ frame: local, fps, config: NEMI_THEME.springs.snappy });

        return (
          <>
            <div
              style={{
                position: "absolute",
                top: 170,
                left: 60,
                right: 60,
                textAlign: "center",
                zIndex: 30,
                transform: `scale(${pop})`,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 26px",
                  borderRadius: 9999,
                  backgroundColor: "#FEF3C7",
                  color: "#B45309",
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                THE AHA DISCOVERY
              </span>
              <h1
                style={{
                  fontSize: 68,
                  fontWeight: 900,
                  lineHeight: 1.12,
                  color: NEMI_THEME.colors.text.headingDark,
                  letterSpacing: -2,
                  margin: 0,
                }}
              >
                It just ran out of bits!
              </h1>
            </div>

            {/* High-Density 3-Point Takeaway Console (Occupies Y: 400 to Y: 1040) */}
            <div
              style={{
                position: "absolute",
                top: 400,
                left: 65,
                right: 65,
                padding: "44px 52px",
                borderRadius: 36,
                backgroundColor: "rgba(24, 24, 27, 0.96)",
                border: "3px solid rgba(255, 255, 255, 0.16)",
                boxShadow: "0 35px 80px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                gap: 28,
                zIndex: 20,
                transform: `scale(${pop})`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: "rgba(6, 182, 212, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
                  🔢
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Base-2 Binary Fractions</div>
                  <div style={{ fontSize: 17, color: "#94A3B8", marginTop: 2 }}>0.1 is an infinite repeating binary sequence.</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: "rgba(255, 209, 102, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
                  ⚙️
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>IEEE 754 53-Bit Limits</div>
                  <div style={{ fontSize: 17, color: "#94A3B8", marginTop: 2 }}>Approximations accumulate the tiny trailing 4.</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
                  💡
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Pro Developer Fix</div>
                  <div style={{ fontSize: 17, color: "#94A3B8", marginTop: 2 }}>Use `Number.EPSILON` or store money in cents!</div>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          NEMI MASCOT (DYNAMICALLY POSITIONED SCENE ACTOR)
         ═══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          left: nemiLeft,
          top: nemiTop,
          zIndex: 40,
          transform: `scale(${spring({ frame: Math.max(0, frame - 5), fps, config: NEMI_THEME.springs.bouncy }) * nemiScale})`,
          transformOrigin: "bottom center",
        }}
      >
        <NemiMascot pose={nemiPose} scale={1.0} />
      </div>

      {/* Dynamic Speech Bubble */}
      {nemiSpeech && (
        <div
          style={{
            position: "absolute",
            left: nemiLeft > 400 ? undefined : nemiLeft + 110,
            right: nemiLeft > 400 ? 100 : undefined,
            top: nemiTop - 90,
            zIndex: 45,
            padding: "18px 30px",
            borderRadius: nemiLeft > 400 ? "26px 26px 4px 26px" : "26px 26px 26px 4px",
            backgroundColor: "#FFFFFF",
            border: "2.5px solid #18181B",
            boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
            maxWidth: 440,
            transform: `scale(${spring({ frame: Math.max(0, frame - speechStartFrame), fps, config: NEMI_THEME.springs.pop })})`,
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", lineHeight: 1.25 }}>
            {nemiSpeech}
          </span>
        </div>
      )}

      {/* Channel Tag Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          padding: "8px 18px",
          borderRadius: 9999,
          backgroundColor: isDarkScene ? "rgba(255,255,255,0.08)" : "rgba(24, 24, 27, 0.8)",
          backdropFilter: "blur(10px)",
          zIndex: 50,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF", fontFamily: NEMI_THEME.typography.fontHeading }}>
          @nemi.explains
        </span>
      </div>

      {/* Master Audio Track with Dynamic BGM Story Arc */}
      <Audio src={staticFile("sounds/nemi_v14_master_audio.mp3")} volume={1.0} />
    </AbsoluteFill>
  );
};
