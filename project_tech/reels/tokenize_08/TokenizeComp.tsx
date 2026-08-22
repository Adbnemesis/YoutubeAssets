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
import cuesData from "../../src/data/tokenize_08_cues.json";

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
  const ev = cuesData.timeline_events.find((x: any) => x.id === id);
  return ev ?? { start_frame: 0, end_frame: 0, start_time_ms: 0, end_time_ms: 0, duration_s: 0, semantic_cues: [] };
};

const getCue = (eventId: string, cueName: string): number => {
  const ev = getEvent(eventId);
  const c = (ev.semantic_cues ?? []).find((x: any) => x.cue === cueName);
  return c ? c.frame : ev.start_frame;
};

export const TokenizeComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 665;

  // ─── Timeline Events ───
  const evHook = getEvent("tk01_hook");
  const evSecret = getEvent("tk02_secret");
  const evGuess = getEvent("tk03_nemi_guess");
  const evReversal = getEvent("tk04_reversal");
  const evPayoff = getEvent("tk05_payoff");
  const evNemiPayoff = getEvent("tk06_nemi_payoff");
  const evLoop = getEvent("tk07_loop");

  // ─── Semantic Cue Frames ───
  const wordSplitCue = getCue("tk01_hook", "word_split"); // 34
  const tokenIdsCue = getCue("tk01_hook", "token_ids"); // 62
  const chopTextCue = getCue("tk02_secret", "chop_text"); // 139
  const tokensLabeledCue = getCue("tk02_secret", "tokens_labeled"); // 185
  const buzzerShockCue = getCue("tk03_nemi_guess", "buzzer_shock"); // 220
  const idsPopulateCue = getCue("tk04_reversal", "ids_populate"); // 289
  const dictCounterCue = getCue("tk04_reversal", "dict_counter"); // 336
  const piecesSplitCue = getCue("tk05_payoff", "pieces_split"); // 405
  const rsHighlightCue = getCue("tk05_payoff", "rs_highlight"); // 445
  const smugStampCue = getCue("tk06_nemi_payoff", "smug_stamp"); // 488
  const loopCheckCue = getCue("tk07_loop", "loop_check"); // 627

  // ─── Stage Boundaries (Punch Cuts — Zero Slide Drift) ───
  const cutB = evSecret.start_frame; // 79
  const cutD = evReversal.start_frame; // 237
  const cutE = evPayoff.start_frame; // 363
  const cutF = evNemiPayoff.start_frame - 1; // 475

  // ─── Canvas Worlds ───
  const isDarkWorld = frame >= cutB;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;

  // ─── Dynamic Camera: Smooth Continuous Breathing + Sparse Accents ───
  const breathing = interpolate(frame, [0, totalFrames], [1.0, 1.025], {
    extrapolateRight: "clamp",
  });

  const punch = (at: number, amt = 0.038, dur = 8) => {
    const d = frame - at;
    if (at <= 0 || d < 0) return 0;
    return interpolate(d, [0, 2, dur], [amt, amt * 0.4, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const cutSettle = (at: number) => {
    const d = frame - at;
    if (d < 0) return 0;
    return interpolate(d, [0, 6], [0.03, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const cameraScale =
    breathing +
    punch(wordSplitCue, 0.035) +
    punch(piecesSplitCue, 0.04) +
    cutSettle(cutB) +
    cutSettle(cutD) +
    cutSettle(cutE) +
    cutSettle(cutF);

  // ─── Nemi Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "shocked";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "shocked";
  } else if (frame < evGuess.start_frame) {
    nemiPose = "thinking";
  } else if (frame < cutD) {
    nemiPose = "shocked";
    nemiSpeech = "Whole words though?! 🤯";
  } else if (frame < evPayoff.start_frame) {
    nemiPose = "pointing";
  } else if (frame < cutF) {
    nemiPose = "aha";
  } else if (frame < evNemiPayoff.end_frame + 4) {
    nemiPose = "smug";
    nemiSpeech = "Blame the chunks! 😎";
  } else {
    nemiPose = "smug";
  }

  const inStageA = frame < cutB;
  const inStageBC = frame >= cutB && frame < cutD;
  const inStageD = frame >= cutD && frame < cutE;
  const inStageE = frame >= cutE && frame < cutF;
  const inStageF = frame >= cutF;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: canvasBg,
        overflow: "hidden",
        fontFamily: nemiTheme.typography.fontFamily.sans,
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/tokenize_08/token_master_audio.mp3")} volume={0.9} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SFX LAYER (-3dB Headroom Doctrine, Frame-Synced) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/tokenize_08/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={wordSplitCue} durationInFrames={20}>
        <Audio src={staticFile("reels/tokenize_08/sfx/pop.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={wordSplitCue + 5} durationInFrames={20}>
        <Audio src={staticFile("reels/tokenize_08/sfx/pop.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={tokenIdsCue} durationInFrames={30}>
        <Audio src={staticFile("reels/tokenize_08/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutB - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/tokenize_08/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={chopTextCue} durationInFrames={30}>
        <Audio src={staticFile("reels/tokenize_08/sfx/riser.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={tokensLabeledCue} durationInFrames={25}>
        <Audio src={staticFile("reels/tokenize_08/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={buzzerShockCue} durationInFrames={30}>
        <Audio src={staticFile("reels/tokenize_08/sfx/error.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutD - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/tokenize_08/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={idsPopulateCue} durationInFrames={28}>
        <Audio src={staticFile("reels/tokenize_08/sfx/notification.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={Math.max(0, cutE - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/tokenize_08/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={piecesSplitCue} durationInFrames={20}>
        <Audio src={staticFile("reels/tokenize_08/sfx/pop.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={rsHighlightCue} durationInFrames={40}>
        <Audio src={staticFile("reels/tokenize_08/sfx/chime.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutF - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/tokenize_08/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={smugStampCue} durationInFrames={30}>
        <Audio src={staticFile("reels/tokenize_08/sfx/notification.mp3")} volume={0.66} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CAMERA WRAPPER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        {/* AMBIENT GLOW IN DARK WORLD */}
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
                background: inStageBC
                  ? "radial-gradient(circle, rgba(244, 63, 94, 0.22) 0%, rgba(0,0,0,0) 70%)"
                  : "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(0,0,0,0) 70%)",
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
                background: inStageE || inStageF
                  ? "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(0,0,0,0) 70%)"
                  : "radial-gradient(circle, rgba(255, 209, 102, 0.16) 0%, rgba(0,0,0,0) 70%)",
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
                  backgroundColor: inStageE || inStageF ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCoral,
                  boxShadow: `0 0 24px ${inStageE || inStageF ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCoral}`,
                }}
              />
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: isDarkWorld ? (inStageE || inStageF ? "#10B981" : "#F43F5E") : "#E11D48",
                }}
              >
                Ep.8 · LLM Tokenization
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
                color: isDarkWorld ? (inStageE || inStageF ? "#10B981" : "#F43F5E") : "#E11D48",
                fontFamily: nemiTheme.typography.fontFamily.mono,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              {inStageA ? "TOKENIZER TEST" : inStageBC ? "BYTE PAIR SLICER" : inStageD ? "VOCABULARY IDS" : inStageE ? "STRAWBERRY X-RAY" : "THE TRUTH"}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE A — FRAME-0 MONEY SHOT (STRAWBERRY SPLIT ANOMALY) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageA && (
          <>
            <div style={{ position: "absolute", top: 180, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div
                style={{
                  fontSize: 58,
                  fontWeight: 900,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                  color: frame >= wordSplitCue ? nemiTheme.colors.brandCoral : nemiTheme.colors.textLight,
                  transform: `scale(${
                    frame >= wordSplitCue
                      ? interpolate(frame - wordSplitCue, [0, 4, 8], [1.15, 1.05, 1.0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })
                      : interpolate(frame, [0, 5], [1.08, 1.0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })
                  })`,
                  textShadow: frame >= wordSplitCue ? "0 0 30px rgba(244, 63, 94, 0.3)" : "none",
                }}
              >
                {frame >= wordSplitCue ? (
                  <>CHATGPT HAS NEVER SEEN IT.</>
                ) : (
                  <>HOW MANY "R"S IN STRAWBERRY?</>
                )}
              </div>
            </div>

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
                border: "3.5px solid #06B6D4",
                boxShadow: "0 24px 80px rgba(6, 182, 212, 0.2)",
                padding: "36px 40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 32 }}>🤖</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>Tokenizer Word Slicer</span>
                </div>
                <span style={{ backgroundColor: "#CFFAFE", color: "#0891B2", border: "1.5px solid #67E8F9", padding: "8px 18px", borderRadius: 14, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  LIVE EXPERIMENT
                </span>
              </div>

              {/* Word Visual */}
              <div style={{ display: "flex", gap: 8, padding: "20px 36px", backgroundColor: "#F8FAFC", borderRadius: 24, border: "2px dashed #CBD5E1" }}>
                {["s", "t", "r", "a", "w", "b", "e", "r", "r", "y"].map((char, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 48,
                      fontWeight: 900,
                      fontFamily: nemiTheme.typography.fontFamily.mono,
                      color: char === "r" ? "#F43F5E" : "#0F172A",
                      padding: "4px 8px",
                      backgroundColor: char === "r" ? "#FFE4E6" : "transparent",
                      borderRadius: 10,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>

              {/* Sliced Tokens */}
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ backgroundColor: "#ECFEFF", padding: "18px 32px", borderRadius: 20, border: "2.5px solid #06B6D4", textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0891B2", fontFamily: nemiTheme.typography.fontFamily.mono }}>"straw"</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0E7490", marginTop: 4 }}>Token #496</div>
                </div>
                <div style={{ backgroundColor: "#FFF1F2", padding: "18px 32px", borderRadius: 20, border: "2.5px solid #F43F5E", textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#E11D48", fontFamily: nemiTheme.typography.fontFamily.mono }}>"berry"</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#BE123C", marginTop: 4 }}>Token #675</div>
                </div>
              </div>

              <div style={{ fontSize: 19, color: "#64748B", fontWeight: 700, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                The AI never receives raw characters — only integer chunk IDs!
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE B+C — THE BYTE PAIR SLICER & NEMI'S WRONG GUESS */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageBC && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#F43F5E" }}>
                Byte-Pair Slicing In Action
              </div>
            </div>

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
                padding: "32px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 32 }}>✂️</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>BPE Tokenizer Pipeline</span>
                </div>
                <span style={{ backgroundColor: "rgba(244, 63, 94, 0.2)", color: "#F43F5E", border: "1.5px solid #F43F5E", padding: "8px 18px", borderRadius: 14, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  AUTOMATIC CHUNKING
                </span>
              </div>

              {/* Slicing Step Visual */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ backgroundColor: "#0F172A", padding: "16px 20px", borderRadius: 18, border: "2px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94A3B8", fontSize: 18 }}>Raw Input:</span>
                  <span style={{ color: "#F8FAFC", fontSize: 24, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>"strawberry"</span>
                  <span style={{ color: "#F43F5E", fontWeight: 800 }}>10 Letters</span>
                </div>

                <div style={{ backgroundColor: "#0F172A", padding: "16px 20px", borderRadius: 18, border: "2px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94A3B8", fontSize: 18 }}>Chunk Slicer:</span>
                  <span style={{ color: "#06B6D4", fontSize: 24, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>["straw", "berry"]</span>
                  <span style={{ color: "#06B6D4", fontWeight: 800 }}>2 Chunks</span>
                </div>

                <div style={{ backgroundColor: "#0F172A", padding: "16px 20px", borderRadius: 18, border: "2px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94A3B8", fontSize: 18 }}>Model Receives:</span>
                  <span style={{ color: "#10B981", fontSize: 24, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>[496, 675]</span>
                  <span style={{ color: "#10B981", fontWeight: 800 }}>2 Number IDs</span>
                </div>
              </div>

              <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                The neural network processes number tokens — not individual letters!
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE D — VOCABULARY IDS (100,000 TOKEN DICTIONARY) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageD && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#06B6D4" }}>
                100,000 Token Dictionary 📚
              </div>
            </div>

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
                padding: "32px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 32 }}>📖</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Pre-Trained Vocabulary Lookup</span>
                </div>
                <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "8px 18px", borderRadius: 14, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  100,000+ TOKENS
                </span>
              </div>

              {/* Vocab Lookup Grid */}
              <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div style={{ backgroundColor: "#0F172A", padding: "18px", borderRadius: 18, border: "1.5px solid #1E293B", textAlign: "center" }}>
                  <div style={{ color: "#94A3B8", fontSize: 16 }}>Token #496</div>
                  <div style={{ color: "#06B6D4", fontSize: 26, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>"straw"</div>
                </div>
                <div style={{ backgroundColor: "#0F172A", padding: "18px", borderRadius: 18, border: "1.5px solid #1E293B", textAlign: "center" }}>
                  <div style={{ color: "#94A3B8", fontSize: 16 }}>Token #675</div>
                  <div style={{ color: "#F43F5E", fontSize: 26, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>"berry"</div>
                </div>
                <div style={{ backgroundColor: "#0F172A", padding: "18px", borderRadius: 18, border: "1.5px solid #1E293B", textAlign: "center" }}>
                  <div style={{ color: "#94A3B8", fontSize: 16 }}>Token #912</div>
                  <div style={{ color: "#FFD166", fontSize: 26, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>"apple"</div>
                </div>
              </div>

              <div style={{ width: "100%", backgroundColor: "#03140C", padding: "16px 22px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>Compression Ratio:</span>
                <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>~4 CHARACTERS PER TOKEN</span>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE E — THE PAYOFF: STRAWBERRY X-RAY REVEAL (~58%) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageE && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#10B981" }}>
                The Payoff: The Letters Are Trapped! 🍓
              </div>
            </div>

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
                boxShadow: "0 24px 80px rgba(16, 185, 129, 0.35)",
                padding: "32px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 32 }}>🔬</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Inside the AI's Perception</span>
                </div>
                <span style={{ backgroundColor: "rgba(16, 185, 129, 0.25)", color: "#10B981", border: "1.5px solid #10B981", padding: "8px 18px", borderRadius: 14, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  TRAPPED 'R'S
                </span>
              </div>

              {/* Trapped chunk boxes */}
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ backgroundColor: "#0F172A", padding: "20px 36px", borderRadius: 24, border: "2.5px solid #06B6D4", textAlign: "center" }}>
                  <div style={{ color: "#94A3B8", fontSize: 16 }}>Token #496</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#06B6D4", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
                    st<span style={{ color: "#F43F5E", textDecoration: "underline" }}>r</span>aw
                  </div>
                  <div style={{ color: "#10B981", fontSize: 17, fontWeight: 800, marginTop: 8 }}>Contains 1 'r'</div>
                </div>

                <div style={{ backgroundColor: "#0F172A", padding: "20px 36px", borderRadius: 24, border: "2.5px solid #F43F5E", textAlign: "center" }}>
                  <div style={{ color: "#94A3B8", fontSize: 16 }}>Token #675</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#F43F5E", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
                    be<span style={{ color: "#F43F5E", textDecoration: "underline" }}>rr</span>y
                  </div>
                  <div style={{ color: "#10B981", fontSize: 17, fontWeight: 800, marginTop: 8 }}>Contains 2 'r's</div>
                </div>
              </div>

              <div style={{ width: "100%", backgroundColor: "#03140C", padding: "16px 22px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>Total 'R's Count:</span>
                <span style={{ color: "#10B981", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>1 + 2 = 3 'R'S TOTAL! ✓</span>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE F — LOOP SEAM & CORE MENTAL MODEL */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageF && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#FFD166" }}>
                The Tokenizer Secret
              </div>
            </div>

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
                boxShadow: "0 24px 80px rgba(255, 209, 102, 0.25)",
                padding: "32px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                zIndex: 30,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 32 }}>💡</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#FFD166", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    CORE MENTAL MODEL
                  </span>
                </div>
                <span style={{ backgroundColor: "rgba(255, 209, 102, 0.2)", color: "#FFD166", border: "1.5px solid #FFD166", padding: "8px 18px", borderRadius: 14, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  TAKEAWAY
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ backgroundColor: "#0F172A", padding: "22px", borderRadius: 22, border: "2.5px solid #F43F5E" }}>
                  <div style={{ color: "#F43F5E", fontWeight: 900, fontSize: 24 }}>What You See 👀</div>
                  <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, marginTop: 10 }}>"s-t-r-a-w-b-e-r-r-y"</div>
                  <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>10 raw letters on your screen</div>
                </div>

                <div style={{ backgroundColor: "#0F172A", padding: "22px", borderRadius: 22, border: "2.5px solid #10B981" }}>
                  <div style={{ color: "#10B981", fontWeight: 900, fontSize: 24 }}>What AI Sees 🤖</div>
                  <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, marginTop: 10 }}>[496, 675]</div>
                  <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>2 pre-baked number tokens</div>
                </div>
              </div>

              <div style={{ backgroundColor: "#03070D", padding: "18px 24px", borderRadius: 20, border: "1.5px solid rgba(255, 209, 102, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Don't blame ChatGPT — blame the tokenizer!</span>
                <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>SOLVED ✓</span>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} fps={fps} />}
      </AbsoluteFill>

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
// DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px, sides: 65px)
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
