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
// NEMI EXPLAINS V13 — MASTERY ITERATION 1: PHYSICAL BIT WORLD
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

// Binary representation of 0.1: 0.00011001100110011001100110011001100110011001100110011...
const BIT_SEQUENCE = [
  "0", ".", "0", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "0", "1", "1", "0", "1"
];

export const NemiExplainsV13Comp: React.FC = () => {
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
  const fBinaryGrid = getCueFrame("v12_narrator_03_binary", "binary_grid_enter", evBinary.start_frame + 20);
  const fFractionExpand = getCueFrame("v12_narrator_03_binary", "infinite_fraction_expand", evBinary.start_frame + 55);
  const fBitRounding = getCueFrame("v12_narrator_04_approx", "bit_rounding_highlight", evApprox.start_frame + 20);
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
  const bgColor = isDarkScene ? "#0D1117" : NEMI_THEME.colors.bg.cream;

  // ─── Camera Transforms ───
  let cameraScale = 1.0;
  let cameraTranslateY = 0;

  if (isApproxStage) {
    cameraScale = interpolate(frame, [evApprox.start_frame, fTrailingFour], [1.0, 1.12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cameraTranslateY = interpolate(frame, [evApprox.start_frame, fTrailingFour], [0, -30], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // ─── Nemi Character Performance Arc ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;
  let speechStartFrame = 0;
  let nemiX = 860;
  let nemiY = 1620;
  let nemiScale = 1.5;

  if (isHookStage) {
    const isShocked = frame >= evWhat.start_frame;
    nemiPose = isShocked ? "shocked" : "thinking";
    nemiX = 860;
    nemiY = 1620;
    if (isShocked && frame < evWhat.end_frame + 12) {
      nemiSpeech = "Wait, what?! 🤯";
      speechStartFrame = evWhat.start_frame;
    }
  } else if (isQuestionStage) {
    nemiPose = "puzzled";
    nemiX = 220;
    nemiY = 1620;
  } else if (isBinaryStage) {
    nemiPose = "explaining";
    nemiX = 180;
    nemiY = 1640;
  } else if (isApproxStage) {
    nemiPose = "aha";
    nemiX = 200;
    nemiY = 1640;
  } else if (isAhaStage) {
    nemiPose = "smug";
    nemiX = 860;
    nemiY = 1620;
  } else if (isPayoffStage) {
    nemiPose = "smug";
    nemiX = 540;
    nemiY = 1580;
    nemiScale = 1.65;
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
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "25%",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
              filter: "blur(80px)",
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
              backgroundSize: "32px 32px",
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "25%",
              width: "650px",
              height: "650px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(244, 63, 94, 0.1) 0%, transparent 70%)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Universal Brand Header */}
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
              boxShadow: "0 0 12px #FFD166",
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
          BEAT 1 — THE IMPOSSIBLE RESULT (Frames 0 → 140)
         ═══════════════════════════════════════════════════════════ */}
      {isHookStage && (() => {
        const titlePop = spring({ frame, fps, config: NEMI_THEME.springs.snappy });
        const hasResult = frame >= fErrorPop;
        const resultPop = hasResult ? spring({ frame: frame - fErrorPop, fps, config: NEMI_THEME.springs.pop }) : 0;

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
                transform: `scale(${titlePop})`,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 18px",
                  borderRadius: 9999,
                  backgroundColor: "#FEE2E2",
                  color: "#B91C1C",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  marginBottom: 14,
                }}
              >
                THE MATH MYSTERY
              </span>
              <h1
                style={{
                  fontSize: 58,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: NEMI_THEME.colors.text.headingDark,
                  letterSpacing: -2,
                  margin: 0,
                }}
              >
                0.1 + 0.2 is NOT 0.3?
              </h1>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#64748B", marginTop: 10 }}>
                Try this in your browser console right now.
              </p>
            </div>

            {/* Terminal Window */}
            <div
              style={{
                position: "absolute",
                top: 440,
                left: 80,
                right: 80,
                padding: "28px 36px",
                borderRadius: 24,
                backgroundColor: "#18181B",
                border: "2px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                zIndex: 25,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#EF4444" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
                <span style={{ fontSize: 13, color: "#94A3B8", marginLeft: 10, fontFamily: NEMI_THEME.typography.fontCode }}>
                  node terminal
                </span>
              </div>

              <div style={{ fontSize: 32, fontWeight: 900, color: "#F8FAFC", fontFamily: NEMI_THEME.typography.fontCode }}>
                <span style={{ color: "#06B6D4" }}>&gt;</span> 0.1 + 0.2
              </div>

              {hasResult && (
                <div
                  style={{
                    padding: "16px 24px",
                    borderRadius: 16,
                    backgroundColor: "rgba(244, 63, 94, 0.2)",
                    border: "2px solid #F43F5E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transform: `scale(${resultPop})`,
                  }}
                >
                  <span style={{ fontSize: 26, fontWeight: 900, color: "#F43F5E", fontFamily: NEMI_THEME.typography.fontCode }}>
                    0.30000000000000004
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "#FECDD3", letterSpacing: 1 }}>
                    MISMATCH ⚠️
                  </span>
                </div>
              )}
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 2 — THE MYSTERY QUESTION (Frames 140 → 234)
         ═══════════════════════════════════════════════════════════ */}
      {isQuestionStage && (() => {
        const pop = spring({ frame: frame - evQuestion.start_frame, fps, config: NEMI_THEME.springs.snappy });

        return (
          <>
            <div style={{ position: "absolute", top: 180, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: "#FEF3C7",
                  color: "#B45309",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                THE CORE QUESTION
              </span>
              <h2 style={{ fontSize: 56, fontWeight: 900, color: NEMI_THEME.colors.text.headingDark, letterSpacing: -1.5, margin: 0 }}>
                Why does a supercomputer fail 1st-grade math?
              </h2>
            </div>

            {/* Dilemma Card */}
            <div
              style={{
                position: "absolute",
                top: 440,
                left: 80,
                right: 80,
                padding: "36px 44px",
                borderRadius: 28,
                backgroundColor: "#FFFFFF",
                border: "3px solid #18181B",
                boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                transform: `scale(${pop})`,
                zIndex: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Human Math: 0.3 ✓</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#EF4444" }}>Computer: 0.300...4 ❌</div>
              </div>
              <div style={{ height: 2, backgroundColor: "#E2E8F0" }} />
              <p style={{ fontSize: 20, fontWeight: 700, color: "#64748B", margin: 0 }}>
                It's not a software bug. It's a fundamental constraint of binary hardware.
              </p>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 3 — PHYSICAL INFINITE BIT TAPE (Frames 234 → 388)
         ═══════════════════════════════════════════════════════════ */}
      {isBinaryStage && (() => {
        const pop = spring({ frame: frame - evBinary.start_frame, fps, config: NEMI_THEME.springs.snappy });
        const scrollOffset = (frame - evBinary.start_frame) * 6;

        return (
          <>
            <div style={{ position: "absolute", top: 160, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(6, 182, 212, 0.2)",
                  color: NEMI_THEME.colors.brand.cyanGlow,
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 12,
                }}
              >
                THE ROOT CAUSE: BASE-2 BINARY
              </span>
              <h2 style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", letterSpacing: -1.5, margin: 0 }}>
                0.1 is an infinite repeating fraction!
              </h2>
            </div>

            {/* Decimal to Binary Physical Unfolding */}
            <div
              style={{
                position: "absolute",
                top: 380,
                left: 60,
                right: 60,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                zIndex: 20,
                transform: `scale(${pop})`,
              }}
            >
              {/* Decimal Box */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 28px",
                  borderRadius: 18,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 800, color: "#94A3B8" }}>DECIMAL FRACTION</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: "#FFFFFF", fontFamily: NEMI_THEME.typography.fontCode }}>
                  1 / 10 = 0.1 (Clean)
                </span>
              </div>

              {/* Physical Infinite Scrolling Bit Tape */}
              <div
                style={{
                  padding: "24px 0",
                  borderRadius: 24,
                  backgroundColor: "#18181B",
                  border: "2.5px solid rgba(6, 182, 212, 0.5)",
                  boxShadow: "0 0 40px rgba(6, 182, 212, 0.25)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 24,
                    fontSize: 13,
                    fontWeight: 900,
                    letterSpacing: 1.5,
                    color: NEMI_THEME.colors.brand.cyanGlow,
                  }}
                >
                  BINARY STREAM (BASE-2)
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 20,
                    transform: `translateX(${-scrollOffset}px)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {/* Repeat bits across tape */}
                  {[...BIT_SEQUENCE, ...BIT_SEQUENCE].map((bit, idx) => (
                    <div
                      key={idx}
                      style={{
                        minWidth: 48,
                        height: 58,
                        borderRadius: 12,
                        backgroundColor: bit === "1" ? "rgba(6, 182, 212, 0.3)" : "rgba(255, 255, 255, 0.06)",
                        border: `1.5px solid ${bit === "1" ? NEMI_THEME.colors.brand.cyanGlow : "rgba(255, 255, 255, 0.15)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26,
                        fontWeight: 900,
                        color: bit === "1" ? NEMI_THEME.colors.brand.cyanGlow : "#F8FAFC",
                        fontFamily: NEMI_THEME.typography.fontCode,
                        boxShadow: bit === "1" ? "0 0 15px rgba(6, 182, 212, 0.3)" : "none",
                      }}
                    >
                      {bit}
                    </div>
                  ))}
                </div>

                {/* Infinite Loop Tag */}
                <div
                  style={{
                    marginTop: 18,
                    marginRight: 24,
                    textAlign: "right",
                    fontSize: 15,
                    fontWeight: 800,
                    color: NEMI_THEME.colors.brand.yellow,
                  }}
                >
                  🔁 Repeating Pattern (Never Ends!)
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 4 — 53-BIT REGISTER LIMIT & PHYSICAL TRUNCATION (Frames 388 → 532)
         ═══════════════════════════════════════════════════════════ */}
      {isApproxStage && (() => {
        const pop = spring({ frame: frame - evApprox.start_frame, fps, config: NEMI_THEME.springs.snappy });
        const isHighlight = frame >= fTrailingFour;

        return (
          <>
            <div style={{ position: "absolute", top: 160, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(255, 209, 102, 0.2)",
                  color: NEMI_THEME.colors.brand.yellow,
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 12,
                }}
              >
                IEEE 754 DOUBLE PRECISION
              </span>
              <h2 style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", letterSpacing: -1.5, margin: 0 }}>
                Rounds to 53 bits of storage
              </h2>
            </div>

            {/* Physical 53-Bit Hardware Register Box with Truncation Line */}
            <div
              style={{
                position: "absolute",
                top: 360,
                left: 60,
                right: 60,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                transform: `scale(${cameraScale}) translateY(${cameraTranslateY}px)`,
                transformOrigin: "center top",
                zIndex: 20,
              }}
            >
              {/* Register Container */}
              <div
                style={{
                  position: "relative",
                  padding: "24px 28px",
                  borderRadius: 24,
                  backgroundColor: "rgba(24, 24, 27, 0.95)",
                  border: "2.5px solid rgba(255, 209, 102, 0.6)",
                  boxShadow: "0 0 50px rgba(255, 209, 102, 0.2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: NEMI_THEME.colors.brand.yellow, letterSpacing: 1.5 }}>
                    [ 53-BIT HARDWARE REGISTER ]
                  </span>
                  <span style={{ fontSize: 13, color: "#F43F5E", fontWeight: 900 }}>
                    ✂️ TRUNCATION CUT-OFF
                  </span>
                </div>

                {/* Stored Approximate Value 1 */}
                <div style={{ fontSize: 18, color: "#94A3B8", fontFamily: NEMI_THEME.typography.fontCode, marginBottom: 8 }}>
                  float(0.1) = 0.10000000000000000555...
                </div>

                {/* Stored Approximate Value 2 */}
                <div style={{ fontSize: 18, color: "#94A3B8", fontFamily: NEMI_THEME.typography.fontCode, marginBottom: 12 }}>
                  + float(0.2) = 0.20000000000000001110...
                </div>

                <div style={{ height: 2, backgroundColor: "rgba(255, 255, 255, 0.2)", marginBottom: 14 }} />

                {/* Result with Ignited Trailing 4 */}
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    fontFamily: NEMI_THEME.typography.fontCode,
                  }}
                >
                  = 0.3000000000000000
                  <span
                    style={{
                      color: isHighlight ? "#FFD166" : "#FFFFFF",
                      fontSize: isHighlight ? 34 : 24,
                      fontWeight: 900,
                      textShadow: isHighlight ? "0 0 20px #FFD166, 0 0 40px #FFD166" : "none",
                      transition: "all 0.2s ease-out",
                    }}
                  >
                    4
                  </span>
                </div>
              </div>

              {/* Explanatory Callout */}
              <div
                style={{
                  padding: "14px 20px",
                  borderRadius: 16,
                  backgroundColor: "rgba(244, 63, 94, 0.15)",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#FECDD3",
                  textAlign: "center",
                }}
              >
                ⚠️ Adding two rounded approximations produces the tiny excess bit!
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 5 & 6 — THE "AHA!" & HIGH-DENSITY PAYOFF (Frames 532 → 666)
         ═══════════════════════════════════════════════════════════ */}
      {(isAhaStage || isPayoffStage) && (() => {
        const local = frame - (isPayoffStage ? fMasterTakeaway : evAha.start_frame);
        const pop = spring({ frame: local, fps, config: NEMI_THEME.springs.snappy });

        return (
          <>
            <div
              style={{
                position: "absolute",
                top: 180,
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
                  padding: "6px 22px",
                  borderRadius: 9999,
                  backgroundColor: "#FEF3C7",
                  color: "#B45309",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 16,
                }}
              >
                THE AHA DISCOVERY
              </span>
              <h1
                style={{
                  fontSize: 58,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: NEMI_THEME.colors.text.headingDark,
                  letterSpacing: -2,
                  margin: 0,
                }}
              >
                It just ran out of bits!
              </h1>
            </div>

            {/* High-Density 3-Point Takeaway Card */}
            <div
              style={{
                position: "absolute",
                top: 420,
                left: 80,
                right: 80,
                padding: "36px 44px",
                borderRadius: 28,
                backgroundColor: "rgba(24, 24, 27, 0.95)",
                border: "2px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                zIndex: 20,
                transform: `scale(${pop})`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(6, 182, 212, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  🔢
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>Base-2 Binary Fractions</div>
                  <div style={{ fontSize: 15, color: "#94A3B8" }}>0.1 is an infinite repeating binary sequence.</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255, 209, 102, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  ⚙️
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>IEEE 754 53-Bit Limits</div>
                  <div style={{ fontSize: 15, color: "#94A3B8" }}>Approximations accumulate the tiny trailing 4.</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  💡
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>Pro Developer Fix</div>
                  <div style={{ fontSize: 15, color: "#94A3B8" }}>Use `Number.EPSILON` or store money in cents!</div>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          NEMI MASCOT HERO & SPEECH BUBBLE
         ═══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          left: nemiX - 90,
          top: nemiY - 110,
          zIndex: 40,
          transform: `scale(${spring({ frame: Math.max(0, frame - 5), fps, config: NEMI_THEME.springs.bouncy }) * nemiScale})`,
          transformOrigin: "bottom center",
        }}
      >
        <NemiMascot pose={nemiPose} scale={1.0} />
      </div>

      {/* Speech Bubble */}
      {nemiSpeech && (
        <div
          style={{
            position: "absolute",
            left: isHookStage && nemiX > 500 ? undefined : isAhaStage ? undefined : nemiX + 90,
            right: isHookStage && nemiX > 500 ? 100 : isAhaStage ? 100 : undefined,
            top: nemiY - 220,
            zIndex: 45,
            padding: "16px 28px",
            borderRadius: nemiX > 500 ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
            backgroundColor: "#FFFFFF",
            border: "2.5px solid #18181B",
            boxShadow: "0 15px 35px rgba(0,0,0,0.18)",
            maxWidth: 420,
            transform: `scale(${spring({ frame: Math.max(0, frame - speechStartFrame), fps, config: NEMI_THEME.springs.pop })})`,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", lineHeight: 1.25 }}>
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

      {/* Master Audio Track */}
      <Audio src={staticFile("sounds/nemi_v12_master_audio.mp3")} volume={1.0} />
      <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.25} />
    </AbsoluteFill>
  );
};
