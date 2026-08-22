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

  // ─── Stage Boundaries (Punch Cuts) ───
  const cutB = evSecret.start_frame; // 79
  const cutD = evReversal.start_frame; // 237
  const cutE = evPayoff.start_frame; // 363
  const cutF = evNemiPayoff.start_frame - 1; // 475

  // ─── Canvas Worlds ───
  const isDarkWorld = frame >= cutB;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;

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
      {/* AMBIENT BACKGROUND GLOW (Dark World Only) */}
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
              background: inStageBC
                ? "radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(0,0,0,0) 70%)",
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
                ? "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(255, 209, 102, 0.18) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(90px)",
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP HUD (Safe Zone: top 85px) — appears strictly AFTER Second 2 */}
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
      {/* STAGE A — FRAME-0 HOOK: LASER WORD SLICER */}
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
              }}
            >
              {frame >= wordSplitCue ? (
                <>CHATGPT HAS NEVER SEEN IT.</>
              ) : (
                <>HOW MANY "R"S IN STRAWBERRY?</>
              )}
            </div>
          </div>

          <LaserTokenizerCard frame={frame} wordSplitCue={wordSplitCue} tokenIdsCue={tokenIdsCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE B+C — THE BYTE PAIR SLICER & FREQUENCY MATRIX */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageBC && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#F43F5E" }}>
              Byte-Pair Slicing In Action
            </div>
          </div>

          <BpeFrequencyMatrix frame={frame} cutB={cutB} chopTextCue={chopTextCue} />
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

          <VocabLookupGrid frame={frame} cutD={cutD} idsPopulateCue={idsPopulateCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE E — THE PAYOFF: STRAWBERRY BLUEPRINT X-RAY */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageE && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#10B981" }}>
              The Payoff: The Letters Are Trapped! 🍓
            </div>
          </div>

          <StrawberryXrayPanel frame={frame} cutE={cutE} piecesSplitCue={piecesSplitCue} rsHighlightCue={rsHighlightCue} />
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

          <TokenizerTakeaway frame={frame} cutF={cutF} />
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
// 1. LASER TOKENIZER CARD (Stage A: Animated Slicing Conveyor)
// ═══════════════════════════════════════════════════════════════
const LaserTokenizerCard: React.FC<{ frame: number; wordSplitCue: number; tokenIdsCue: number }> = ({ frame, wordSplitCue, tokenIdsCue }) => {
  const isSplit = frame >= wordSplitCue;
  const splitGap = interpolate(frame - wordSplitCue, [0, 8], [0, 48], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const laserSweep = interpolate(frame, [wordSplitCue - 6, wordSplitCue + 6], [0, 180], {
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
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>✂️</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>Hardware Byte-Pair Laser Slicer</span>
        </div>
        <span style={{ backgroundColor: "#CFFAFE", color: "#0891B2", border: "1.5px solid #67E8F9", padding: "8px 18px", borderRadius: 14, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          LIVE TOKENIZER ENGINE
        </span>
      </div>

      {/* Slicing Conveyor Bed */}
      <div style={{ width: "100%", height: 260, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Conveyor Bed Track */}
        <div style={{ position: "absolute", width: "100%", height: 120, backgroundColor: "#F1F5F9", borderRadius: 24, border: "2px solid #E2E8F0" }} />

        {/* Word Chunks Splitting */}
        <div style={{ display: "flex", alignItems: "center", zIndex: 10 }}>
          {/* Chunk 1: "straw" */}
          <div
            style={{
              transform: `translateX(-${isSplit ? splitGap : 0}px)`,
              backgroundColor: isSplit ? "#ECFEFF" : "#FFFFFF",
              border: isSplit ? "3px solid #06B6D4" : "2px solid #CBD5E1",
              borderRadius: 20,
              padding: "16px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: isSplit ? "0 10px 30px rgba(6, 182, 212, 0.25)" : "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {["s", "t", "r", "a", "w"].map((c, i) => (
                <span key={i} style={{ fontSize: 48, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, color: c === "r" ? "#F43F5E" : "#0F172A" }}>{c}</span>
              ))}
            </div>
            {isSplit && (
              <div style={{ backgroundColor: "#06B6D4", color: "#FFFFFF", padding: "4px 16px", borderRadius: 10, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 8 }}>
                Token #496
              </div>
            )}
          </div>

          {/* Chunk 2: "berry" */}
          <div
            style={{
              transform: `translateX(${isSplit ? splitGap : 0}px)`,
              backgroundColor: isSplit ? "#FFF1F2" : "#FFFFFF",
              border: isSplit ? "3px solid #F43F5E" : "2px solid #CBD5E1",
              borderRadius: 20,
              padding: "16px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: isSplit ? "0 10px 30px rgba(244, 63, 94, 0.25)" : "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {["b", "e", "r", "r", "y"].map((c, i) => (
                <span key={i} style={{ fontSize: 48, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, color: c === "r" ? "#F43F5E" : "#0F172A" }}>{c}</span>
              ))}
            </div>
            {isSplit && (
              <div style={{ backgroundColor: "#F43F5E", color: "#FFFFFF", padding: "4px 16px", borderRadius: 10, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 8 }}>
                Token #675
              </div>
            )}
          </div>
        </div>

        {/* Laser Beam Slicing down on split frame */}
        {frame >= wordSplitCue - 4 && frame <= wordSplitCue + 10 && (
          <div style={{ position: "absolute", top: 10, width: 4, height: 240, backgroundColor: "#06B6D4", boxShadow: "0 0 20px #06B6D4, 0 0 40px #06B6D4", zIndex: 30 }} />
        )}
      </div>

      <div style={{ fontSize: 19, color: "#64748B", fontWeight: 700, fontFamily: nemiTheme.typography.fontFamily.mono }}>
        The LLM only sees Token IDs: [496, 675] — never individual letters!
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. BPE FREQUENCY MATRIX (Stage B+C: Merge Tree Animation)
// ═══════════════════════════════════════════════════════════
const BpeFrequencyMatrix: React.FC<{ frame: number; cutB: number; chopTextCue: number }> = ({ frame, cutB, chopTextCue }) => {
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
        padding: "28px 36px",
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
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Byte-Pair Encoding Pipeline</span>
        </div>
        <span style={{ backgroundColor: "rgba(244, 63, 94, 0.2)", color: "#F43F5E", border: "1.5px solid #F43F5E", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          FREQUENCY MERGE
        </span>
      </div>

      {/* Visual BPE Tree Diagram */}
      <svg width="860" height="280" viewBox="0 0 860 280">
        {/* Top: 10 Raw ASCII Letter Blocks */}
        {["s", "t", "r", "a", "w", "b", "e", "r", "r", "y"].map((char, i) => (
          <g key={i} transform={`translate(${45 + i * 78}, 20)`}>
            <rect width="64" height="50" rx="12" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            <text x="32" y="34" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#F8FAFC" fontFamily="monospace">{char}</text>
          </g>
        ))}

        {/* Merge Branch Lines */}
        <path d="M 77 70 L 233 130" stroke="#06B6D4" strokeWidth="2.5" />
        <path d="M 155 70 L 233 130" stroke="#06B6D4" strokeWidth="2.5" />
        <path d="M 233 70 L 233 130" stroke="#06B6D4" strokeWidth="2.5" />
        <path d="M 311 70 L 233 130" stroke="#06B6D4" strokeWidth="2.5" />
        <path d="M 389 70 L 233 130" stroke="#06B6D4" strokeWidth="2.5" />

        <path d="M 467 70 L 623 130" stroke="#F43F5E" strokeWidth="2.5" />
        <path d="M 545 70 L 623 130" stroke="#F43F5E" strokeWidth="2.5" />
        <path d="M 623 70 L 623 130" stroke="#F43F5E" strokeWidth="2.5" />
        <path d="M 701 70 L 623 130" stroke="#F43F5E" strokeWidth="2.5" />
        <path d="M 779 70 L 623 130" stroke="#F43F5E" strokeWidth="2.5" />

        {/* Level 2: Merged Subword Blocks */}
        <rect x="110" y="130" width="246" height="55" rx="16" fill="#083344" stroke="#06B6D4" strokeWidth="2.5" />
        <text x="233" y="165" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#67E8F9">"straw" (Subword)</text>

        <rect x="500" y="130" width="246" height="55" rx="16" fill="#4C0519" stroke="#F43F5E" strokeWidth="2.5" />
        <text x="623" y="165" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#FDA4AF">"berry" (Subword)</text>

        {/* Level 3: Token Numbers */}
        <line x1="233" y1="185" x2="233" y2="215" stroke="#10B981" strokeWidth="3" />
        <line x1="623" y1="185" x2="623" y2="215" stroke="#10B981" strokeWidth="3" />

        <rect x="140" y="215" width="186" height="45" rx="12" fill="#064E3B" stroke="#10B981" strokeWidth="2" />
        <text x="233" y="245" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#A7F3D0" fontFamily="monospace">Token #496</text>

        <rect x="530" y="215" width="186" height="45" rx="12" fill="#064E3B" stroke="#10B981" strokeWidth="2" />
        <text x="623" y="245" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#A7F3D0" fontFamily="monospace">Token #675</text>
      </svg>

      <div style={{ width: "100%", backgroundColor: "#18060B", padding: "14px 22px", borderRadius: 18, border: "2px solid #F43F5E", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>BPE merges frequent character pairs:</span>
        <span style={{ color: "#F43F5E", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>LETTERS GET PACKED 📦</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. VOCAB LOOKUP GRID (Stage D: 100,000 Token Dictionary)
// ═══════════════════════════════════════════════════════════════
const VocabLookupGrid: React.FC<{ frame: number; cutD: number; idsPopulateCue: number }> = ({ frame, cutD, idsPopulateCue }) => {
  const count = Math.min(100000, Math.round(interpolate(frame - cutD, [0, 40], [1000, 100000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })));

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
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>📖</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Fixed Vocabulary Lookup Table</span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {count.toLocaleString()} TOKENS
        </span>
      </div>

      {/* Vocabulary Cards */}
      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "20px", borderRadius: 20, border: "2px solid #06B6D4", textAlign: "center" }}>
          <div style={{ color: "#94A3B8", fontSize: 16, fontFamily: nemiTheme.typography.fontFamily.mono }}>Index #496</div>
          <div style={{ color: "#06B6D4", fontSize: 32, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 6 }}>"straw"</div>
          <div style={{ color: "#10B981", fontSize: 15, fontWeight: 800, marginTop: 8 }}>1 Token</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px", borderRadius: 20, border: "2px solid #F43F5E", textAlign: "center" }}>
          <div style={{ color: "#94A3B8", fontSize: 16, fontFamily: nemiTheme.typography.fontFamily.mono }}>Index #675</div>
          <div style={{ color: "#F43F5E", fontSize: 32, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 6 }}>"berry"</div>
          <div style={{ color: "#10B981", fontSize: 15, fontWeight: 800, marginTop: 8 }}>1 Token</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px", borderRadius: 20, border: "2px solid #FFD166", textAlign: "center" }}>
          <div style={{ color: "#94A3B8", fontSize: 16, fontFamily: nemiTheme.typography.fontFamily.mono }}>Index #912</div>
          <div style={{ color: "#FFD166", fontSize: 32, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 6 }}>"apple"</div>
          <div style={{ color: "#10B981", fontSize: 15, fontWeight: 800, marginTop: 8 }}>1 Token</div>
        </div>
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "14px 22px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>Average English Compression:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>~4 CHARACTERS PER TOKEN ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STRAWBERRY X-RAY PANEL (Stage E: Payoff 3 'R's Reveal)
// ═══════════════════════════════════════════════════════════
const StrawberryXrayPanel: React.FC<{ frame: number; cutE: number; piecesSplitCue: number; rsHighlightCue: number }> = ({ frame, cutE, piecesSplitCue, rsHighlightCue }) => {
  const isHighlighted = frame >= rsHighlightCue;

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
        boxShadow: "0 24px 80px rgba(16, 185, 129, 0.35)",
        padding: "28px 36px",
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
          <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Inside the AI's Neural Perception</span>
        </div>
        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.25)", color: "#10B981", border: "1.5px solid #10B981", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          TRAPPED 'R'S FOUND
        </span>
      </div>

      {/* Interactive Blueprint Chambers */}
      <div style={{ display: "flex", gap: 24 }}>
        {/* Chamber 1: "straw" */}
        <div style={{ backgroundColor: "#0F172A", padding: "24px 38px", borderRadius: 24, border: "3px solid #06B6D4", textAlign: "center", boxShadow: "0 10px 30px rgba(6, 182, 212, 0.25)" }}>
          <div style={{ color: "#94A3B8", fontSize: 16, fontFamily: nemiTheme.typography.fontFamily.mono }}>Token #496</div>
          <div style={{ fontSize: 44, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, color: "#06B6D4", marginTop: 4 }}>
            st<span style={{ color: isHighlighted ? "#10B981" : "#F43F5E", textDecoration: "underline", textShadow: isHighlighted ? "0 0 20px #10B981" : "none" }}>r</span>aw
          </div>
          <div style={{ color: isHighlighted ? "#10B981" : "#94A3B8", fontSize: 18, fontWeight: 900, marginTop: 8 }}>
            1 'r' Trapped
          </div>
        </div>

        {/* Chamber 2: "berry" */}
        <div style={{ backgroundColor: "#0F172A", padding: "24px 38px", borderRadius: 24, border: "3px solid #F43F5E", textAlign: "center", boxShadow: "0 10px 30px rgba(244, 63, 94, 0.25)" }}>
          <div style={{ color: "#94A3B8", fontSize: 16, fontFamily: nemiTheme.typography.fontFamily.mono }}>Token #675</div>
          <div style={{ fontSize: 44, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, color: "#F43F5E", marginTop: 4 }}>
            be<span style={{ color: isHighlighted ? "#10B981" : "#F43F5E", textDecoration: "underline", textShadow: isHighlighted ? "0 0 20px #10B981" : "none" }}>rr</span>y
          </div>
          <div style={{ color: isHighlighted ? "#10B981" : "#94A3B8", fontSize: 18, fontWeight: 900, marginTop: 8 }}>
            2 'r's Trapped
          </div>
        </div>
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "14px 22px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>Total 'R's Counted:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>1 + 2 = 3 'R'S TOTAL! ✓</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. TOKENIZER TAKEAWAY (Stage F: Core Mental Model)
// ═══════════════════════════════════════════════════════════
const TokenizerTakeaway: React.FC<{ frame: number; cutF: number }> = ({ frame, cutF }) => {
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
        <div style={{ backgroundColor: "#0F172A", padding: "24px", borderRadius: 22, border: "2.5px solid #F43F5E" }}>
          <div style={{ color: "#F43F5E", fontWeight: 900, fontSize: 26 }}>What You See 👀</div>
          <div style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800, marginTop: 10 }}>"s-t-r-a-w-b-e-r-r-y"</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>10 raw letters on your screen</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "24px", borderRadius: 22, border: "2.5px solid #10B981" }}>
          <div style={{ color: "#10B981", fontWeight: 900, fontSize: 26 }}>What AI Sees 🤖</div>
          <div style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800, marginTop: 10 }}>[496, 675]</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>2 pre-baked numeric tokens</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#03070D", padding: "18px 24px", borderRadius: 20, border: "1.5px solid rgba(255, 209, 102, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Don't blame ChatGPT — blame the tokenizer!</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>SOLVED ✓</span>
      </div>
    </div>
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
