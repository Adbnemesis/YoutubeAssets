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
import cuesData from "../../src/data/tokenize_08_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandPurple: "#A855F7",
    brandGreen: "#10B981",
    brandCoral: "#F43F5E",
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    cardDark: "#0F172A",
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
  const loopWaveCue = getCue("tk07_loop", "loop_wave"); // 563
  const loopCheckCue = getCue("tk07_loop", "loop_check"); // 627

  // ─── Stage Boundaries (Punch Cuts — Zero Slide Drift) ───
  const cutB = evSecret.start_frame; // 79
  const cutD = evReversal.start_frame; // 237
  const cutE = evPayoff.start_frame; // 363
  const cutF = evNemiPayoff.start_frame - 1; // 475

  // ─── Canvas Worlds (Cream for Stage A & Outro, Deep Cyber Dark for Tech Core) ───
  const isDarkWorld = frame >= cutB && frame < cutF;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;
  const textMain = isDarkWorld ? nemiTheme.colors.textDark : nemiTheme.colors.textLight;

  // ─── Dynamic Camera: Continuous Breathing + Punch Accents + Cut Settle ───
  const breathing = interpolate(frame, [0, totalFrames], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  const punch = (at: number, amt = 0.045, dur = 7) => {
    const d = frame - at;
    if (at <= 0 || d < 0) return 0;
    return interpolate(d, [0, 2, dur], [amt, amt * 0.5, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const cutSettle = (at: number) => {
    const d = frame - at;
    if (d < 0) return 0;
    return interpolate(d, [0, 5], [0.05, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const punchTotal =
    punch(wordSplitCue) +
    punch(tokenIdsCue, 0.055) +
    punch(chopTextCue) +
    punch(idsPopulateCue) +
    punch(piecesSplitCue, 0.055) +
    punch(rsHighlightCue, 0.06) +
    punch(loopCheckCue) +
    cutSettle(cutB) +
    cutSettle(cutD) +
    cutSettle(cutE) +
    cutSettle(cutF);

  const cameraScale = breathing + punchTotal;

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
      <Sequence from={dictCounterCue} durationInFrames={25}>
        <Audio src={staticFile("reels/tokenize_08/sfx/click.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={Math.max(0, cutE - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/tokenize_08/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={piecesSplitCue} durationInFrames={20}>
        <Audio src={staticFile("reels/tokenize_08/sfx/pop.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={piecesSplitCue + 6} durationInFrames={20}>
        <Audio src={staticFile("reels/tokenize_08/sfx/pop.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={rsHighlightCue} durationInFrames={45}>
        <Audio src={staticFile("reels/tokenize_08/sfx/chime.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutF - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/tokenize_08/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={smugStampCue} durationInFrames={30}>
        <Audio src={staticFile("reels/tokenize_08/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={loopCheckCue} durationInFrames={30}>
        <Audio src={staticFile("reels/tokenize_08/sfx/ping.mp3")} volume={0.7} />
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
                width: 620,
                height: 620,
                borderRadius: "50%",
                background: inStageE
                  ? "radial-gradient(circle, rgba(244, 63, 94, 0.24) 0%, rgba(0,0,0,0) 70%)"
                  : "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(80px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 700,
                right: -160,
                width: 620,
                height: 620,
                borderRadius: "50%",
                background: inStageE
                  ? "radial-gradient(circle, rgba(255, 209, 102, 0.18) 0%, rgba(0,0,0,0) 70%)"
                  : "radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(80px)",
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
                  backgroundColor: inStageE ? nemiTheme.colors.brandCoral : nemiTheme.colors.brandCyan,
                  boxShadow: `0 0 24px ${inStageE ? nemiTheme.colors.brandCoral : nemiTheme.colors.brandCyan}`,
                  transform: `scale(${interpolate(frame % 20, [0, 10, 20], [1.0, 1.25, 1.0])})`,
                }}
              />
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: isDarkWorld ? (inStageE ? "#F43F5E" : "#06B6D4") : "#0284C7",
                }}
              >
                Ep.8 · The Tokenizer Trap
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
                color: isDarkWorld ? (inStageE ? "#F43F5E" : "#06B6D4") : "#0284C7",
                fontFamily: nemiTheme.typography.fontFamily.mono,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              {inStageA ? "AI MYSTERY" : inStageBC ? "BYTE-PAIR ENCODING" : inStageD ? "100K VOCABULARY" : inStageE ? "STRAWBERRY X-RAY" : "THE TAKEAWAY"}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE A — FRAME-0 MONEY SHOT HOOK (Contradiction Punch) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageA && (
          <>
            {/* Contradiction overlay: ≤8 Words, Bold, Legible at Thumbnail Size */}
            <div
              style={{
                position: "absolute",
                top: 180,
                left: 70,
                right: 70,
                textAlign: "center",
                zIndex: 55,
              }}
            >
              <div
                style={{
                  fontSize: 58,
                  fontWeight: 900,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                  color: frame >= wordSplitCue ? nemiTheme.colors.brandCoral : nemiTheme.colors.textLight,
                  transform: `scale(${
                    frame >= wordSplitCue
                      ? interpolate(frame - wordSplitCue, [0, 4, 9], [1.2, 1.06, 1.0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })
                      : interpolate(frame, [0, 5], [1.12, 1.0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })
                  })`,
                  textShadow: frame >= wordSplitCue ? "0 0 30px rgba(244, 63, 94, 0.35)" : "none",
                }}
              >
                {frame >= wordSplitCue ? (
                  <>
                    CHATGPT HAS <span style={{ color: nemiTheme.colors.brandCoral }}>NEVER SEEN</span> IT.
                  </>
                ) : (
                  <>
                    HOW MANY "R"S IN STRAWBERRY?
                  </>
                )}
              </div>
            </div>

            {/* Frame-0 Anomaly Card */}
            <div
              style={{
                position: "absolute",
                top: 350,
                left: 65,
                right: 65,
                height: 530,
                backgroundColor: "#FFFFFF",
                borderRadius: 32,
                border: "3.5px solid #0284C7",
                boxShadow: "0 24px 70px rgba(2, 132, 199, 0.2)",
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>🤖</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#0F172A" }}>User Prompt & Token Split</span>
                </div>
                <span style={{ backgroundColor: "#E0F2FE", color: "#0369A1", border: "1.5px solid #BAE6FD", padding: "6px 14px", borderRadius: 12, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  FRAME 0 REVEAL
                </span>
              </div>

              {/* Central Word Tile Splitting */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%" }}>
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "2px dashed #CBD5E1",
                    padding: "16px 32px",
                    borderRadius: 20,
                    fontSize: 34,
                    fontWeight: 900,
                    letterSpacing: "4px",
                    fontFamily: nemiTheme.typography.fontFamily.mono,
                    color: "#0F172A",
                  }}
                >
                  "st<span style={{ color: "#F43F5E" }}>r</span>awbe<span style={{ color: "#F43F5E" }}>rr</span>y"
                </div>

                {/* Slicing Laser Beam */}
                <div style={{ width: "85%", height: 4, backgroundColor: "#06B6D4", position: "relative", boxShadow: "0 0 16px #06B6D4" }}>
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", backgroundColor: "#06B6D4", color: "#0F172A", padding: "2px 12px", borderRadius: 10, fontSize: 13, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    TOKENIZER LASER ✂️
                  </div>
                </div>

                {/* Sliced 3D Blocks */}
                <div style={{ display: "flex", gap: 20, justifyContent: "center", width: "100%" }}>
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "3px solid #06B6D4",
                      borderRadius: 22,
                      padding: "18px 24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: "0 12px 35px rgba(6, 182, 212, 0.25)",
                      transform: `scale(${frame >= wordSplitCue ? 1.05 : 1.0})`,
                      transition: "transform 0.2s ease",
                      minWidth: 150,
                    }}
                  >
                    <span style={{ fontSize: 32, fontWeight: 900, color: "#06B6D4", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                      "straw"
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#0284C7", marginTop: 8, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                      Token #496
                    </span>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "3px solid #F43F5E",
                      borderRadius: 22,
                      padding: "18px 24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: "0 12px 35px rgba(244, 63, 94, 0.25)",
                      transform: `scale(${frame >= wordSplitCue ? 1.05 : 1.0})`,
                      transition: "transform 0.2s ease",
                      minWidth: 150,
                    }}
                  >
                    <span style={{ fontSize: 32, fontWeight: 900, color: "#F43F5E", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                      "berry"
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#E11D48", marginTop: 8, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                      Token #675
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 18, fontWeight: 800, color: "#64748B", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                The AI never receives letters — only chunk numbers!
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE B+C — THE BYTE-PAIR TOKENIZER & NEMI'S WRONG GUESS */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageBC && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -1.5, color: "#06B6D4" }}>
                Step 1: Text Gets Sliced
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 350,
                left: 65,
                right: 65,
                height: 530,
                backgroundColor: "#0B1120",
                borderRadius: 32,
                border: "3.5px solid #06B6D4",
                boxShadow: "0 24px 75px rgba(6, 182, 212, 0.3)",
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>✂️</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#F8FAFC" }}>Byte-Pair Slicer</span>
                </div>
                <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 14px", borderRadius: 12, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  PRE-PROCESSING
                </span>
              </div>

              {/* Slicing Animation of Sentence */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ backgroundColor: "#0F172A", padding: "16px 20px", borderRadius: 18, border: "2px solid #1E293B" }}>
                  <span style={{ color: "#94A3B8", fontSize: 14, fontFamily: nemiTheme.typography.fontFamily.mono }}>RAW SENTENCE:</span>
                  <div style={{ color: "#F8FAFC", fontSize: 24, fontWeight: 800, marginTop: 4, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    "Before any thinking..."
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "2px solid #06B6D4", textAlign: "center" }}>
                    <span style={{ color: "#06B6D4", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>["Before"]</span>
                    <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>Chunk #1</div>
                  </div>
                  <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "2px solid #06B6D4", textAlign: "center" }}>
                    <span style={{ color: "#06B6D4", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>[" any"]</span>
                    <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>Chunk #2</div>
                  </div>
                  <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "2px solid #A855F7", textAlign: "center" }}>
                    <span style={{ color: "#C084FC", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>[" think"]</span>
                    <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>Chunk #3</div>
                  </div>
                  <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "2px solid #A855F7", textAlign: "center" }}>
                    <span style={{ color: "#C084FC", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>["ing"]</span>
                    <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>Chunk #4</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                Words are broken down into subword statistical pieces!
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE D — THE 100,000-ENTRY TOKEN VOCABULARY */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageD && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -1.5, color: "#C084FC" }}>
                Step 2: 100,000 Token IDs
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 350,
                left: 65,
                right: 65,
                height: 530,
                backgroundColor: "#0B1120",
                borderRadius: 32,
                border: "3.5px solid #A855F7",
                boxShadow: "0 24px 80px rgba(168, 85, 247, 0.35)",
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>📖</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#F8FAFC" }}>Vocabulary Hash Table</span>
                </div>
                <span style={{ backgroundColor: "rgba(168, 85, 247, 0.2)", color: "#C084FC", border: "1.5px solid #A855F7", padding: "6px 14px", borderRadius: 12, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  100,256 ENTRIES
                </span>
              </div>

              {/* Table of mapped tokens */}
              <div style={{ width: "100%", backgroundColor: "#0F172A", borderRadius: 20, border: "2px solid #1E293B", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { word: "the", id: "262", color: "#FFD166" },
                  { word: "straw", id: "496", color: "#06B6D4" },
                  { word: "berry", id: "675", color: "#F43F5E" },
                  { word: "ing", id: "278", color: "#A855F7" },
                ].map((item, idx) => (
                  <div
                    key={item.word}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderRadius: 12,
                      backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent",
                    }}
                  >
                    <span style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                      "{item.word}"
                    </span>
                    <span style={{ color: "#94A3B8", fontSize: 18 }}>➔</span>
                    <span style={{ color: item.color, fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                      #{item.id}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                Every common subword piece gets a permanent integer ID!
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE E — THE PAYOFF: STRAWBERRY X-RAY (LOST R's) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageE && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -1.5, color: "#F43F5E" }}>
                The X-Ray: Letters Locked In! 🍓
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 350,
                left: 65,
                right: 65,
                height: 530,
                backgroundColor: "#0B1120",
                borderRadius: 32,
                border: "3.5px solid #F43F5E",
                boxShadow: "0 24px 80px rgba(244, 63, 94, 0.4)",
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>🍓</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#F43F5E" }}>The 'R' Lock-In</span>
                </div>
                <span style={{ backgroundColor: "rgba(244, 63, 94, 0.25)", color: "#F43F5E", border: "1.5px solid #F43F5E", padding: "6px 14px", borderRadius: 12, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  PAYOFF REVEAL
                </span>
              </div>

              {/* Two Giant Token Capsules */}
              <div style={{ display: "flex", gap: 20, width: "100%" }}>
                <div style={{ flex: 1, backgroundColor: "#0F172A", borderRadius: 22, border: "2.5px solid #06B6D4", padding: "20px", textAlign: "center", boxShadow: "0 0 30px rgba(6, 182, 212, 0.2)" }}>
                  <div style={{ color: "#06B6D4", fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>TOKEN #496</div>
                  <div style={{ color: "#F8FAFC", fontSize: 36, fontWeight: 900, margin: "10px 0", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    st<span style={{ color: "#F43F5E", textShadow: "0 0 16px #F43F5E" }}>r</span>aw
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: 14 }}>1 'r' trapped</div>
                </div>

                <div style={{ flex: 1, backgroundColor: "#0F172A", borderRadius: 22, border: "2.5px solid #F43F5E", padding: "20px", textAlign: "center", boxShadow: "0 0 30px rgba(244, 63, 94, 0.25)" }}>
                  <div style={{ color: "#F43F5E", fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>TOKEN #675</div>
                  <div style={{ color: "#F8FAFC", fontSize: 36, fontWeight: 900, margin: "10px 0", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    be<span style={{ color: "#F43F5E", textShadow: "0 0 16px #F43F5E" }}>rr</span>y
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: 14 }}>2 'r's trapped</div>
                </div>
              </div>

              <div style={{ width: "100%", backgroundColor: "#03070D", padding: "16px 20px", borderRadius: 18, border: "2px solid #F43F5E", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>AI only sees numbers: <strong style={{ color: "#FFD166" }}>[496, 675]</strong></span>
                <span style={{ color: "#F43F5E", fontWeight: 900, fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>ZERO LETTERS! ❌</span>
              </div>

              <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                To count letters, AI has to guess from training weights, not raw vision!
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE F — LOOP SEAM & TAKEAWAY SUMMARY */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageF && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -1.5, color: "#10B981" }}>
                The Golden AI Rule
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 350,
                left: 65,
                right: 65,
                height: 530,
                backgroundColor: "#0B1120",
                borderRadius: 32,
                border: "3.5px solid #10B981",
                boxShadow: "0 24px 80px rgba(16, 185, 129, 0.35)",
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                zIndex: 30,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>💡</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    CORE MENTAL MODEL
                  </span>
                </div>
                <span style={{ backgroundColor: "rgba(16, 185, 129, 0.25)", color: "#10B981", border: "1.5px solid #10B981", padding: "6px 14px", borderRadius: 12, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  TAKEAWAY
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ backgroundColor: "#0F172A", padding: "16px", borderRadius: 16, border: "1.5px solid #1E293B" }}>
                  <div style={{ color: "#FFD166", fontWeight: 900, fontSize: 18 }}>1. No Character Grid</div>
                  <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>LLMs never see single letters</div>
                </div>
                <div style={{ backgroundColor: "#0F172A", padding: "16px", borderRadius: 16, border: "1.5px solid #1E293B" }}>
                  <div style={{ color: "#06B6D4", fontWeight: 900, fontSize: 18 }}>2. Token ID Stream</div>
                  <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>Only sequences of integers</div>
                </div>
                <div style={{ backgroundColor: "#0F172A", padding: "16px", borderRadius: 16, border: "1.5px solid #A855F7" }}>
                  <div style={{ color: "#A855F7", fontWeight: 900, fontSize: 18 }}>3. Subword Merges</div>
                  <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>Common chunks get compressed</div>
                </div>
                <div style={{ backgroundColor: "#0F172A", padding: "16px", borderRadius: 16, border: "1.5px solid #10B981" }}>
                  <div style={{ color: "#10B981", fontWeight: 900, fontSize: 18 }}>4. Always Ask 💡</div>
                  <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>"What does the AI actually see?"</div>
                </div>
              </div>

              <div style={{ backgroundColor: "#03070D", padding: "16px 20px", borderRadius: 18, border: "1px solid rgba(255, 255, 255, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#F8FAFC", fontSize: 18 }}>Next time AI miscounts, blame the tokens!</span>
                <span style={{ color: "#10B981", fontWeight: 900, fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>SOLVED ✓</span>
              </div>

              <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                Share with a friend who argued with ChatGPT! 👇
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
              boxShadow: "0 18px 45px rgba(0, 0, 0, 0.5)",
              transform: `scale(${interpolate(frame % 30, [0, 15, 30], [1.0, 1.05, 1.0])})`,
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
          const wordPop = isWordActive
            ? interpolate(frame - w.start_frame, [0, 3, 7], [1.0, 1.18, 1.08], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1.0;

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
                transform: `scale(${wordPop})`,
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
