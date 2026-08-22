import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  interpolateColors,
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
    brandIce: "#38BDF8",
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    cardLight: "#FFFFFF",
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
  const wordSplitCue = getCue("tk01_hook", "word_split");
  const chopTextCue = getCue("tk02_secret", "chop_text");
  const tokensLabeledCue = getCue("tk02_secret", "tokens_labeled");
  const buzzerShockCue = getCue("tk03_nemi_guess", "buzzer_shock");
  const idsPopulateCue = getCue("tk04_reversal", "ids_populate");
  const dictCounterCue = getCue("tk04_reversal", "dict_counter");
  const piecesSplitCue = getCue("tk05_payoff", "pieces_split");
  const rsHighlightCue = getCue("tk05_payoff", "rs_highlight");
  const smugStampCue = getCue("tk06_nemi_payoff", "smug_stamp");
  const loopWaveCue = getCue("tk07_loop", "loop_wave");

  // ─── SILKY SMOOTH COLOR INTERPOLATION (Light -> Dark Transition) ───
  const darkProgress = interpolate(
    frame,
    [evSecret.start_frame - 15, evSecret.start_frame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const canvasBg = interpolateColors(
    darkProgress,
    [0, 1],
    [nemiTheme.colors.canvasLight, nemiTheme.colors.canvasDark]
  );

  const textHeading = interpolateColors(
    darkProgress,
    [0, 1],
    [nemiTheme.colors.textLight, nemiTheme.colors.textDark]
  );

  const hudBg = interpolateColors(
    darkProgress,
    [0, 1],
    ["rgba(255, 255, 255, 0.96)", "rgba(15, 23, 42, 0.95)"]
  );

  const hudBorder = interpolateColors(
    darkProgress,
    [0, 1],
    [nemiTheme.colors.borderLight, nemiTheme.colors.borderDark]
  );

  // ─── Rock-Solid Cinematic Camera ───
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.018], {
    extrapolateRight: "clamp",
  });

  // ─── Nemi Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < evSecret.start_frame) {
    nemiPose = "thinking";
  } else if (frame >= evSecret.start_frame && frame < evGuess.start_frame) {
    nemiPose = "pointing";
  } else if (frame >= evGuess.start_frame && frame < evReversal.start_frame) {
    nemiPose = "shocked";
    nemiSpeech = "Whole words though?! 🤯";
  } else if (frame >= evReversal.start_frame && frame < evPayoff.start_frame) {
    nemiPose = "explaining";
  } else if (frame >= evPayoff.start_frame && frame < evNemiPayoff.start_frame) {
    nemiPose = "shocked";
  } else if (frame >= evNemiPayoff.start_frame && frame < evLoop.start_frame) {
    nemiPose = "smug";
    nemiSpeech = "Blame the chunks! 😎⚡";
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
      {/* MASTER AUDIO (Voice + Synthwave Ducked BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/tokenize_08/token_master_audio.mp3")} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SFX LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/tokenize_08/sfx/whoosh.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={wordSplitCue} durationInFrames={25}>
        <Audio src={staticFile("reels/tokenize_08/sfx/click.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={chopTextCue} durationInFrames={30}>
        <Audio src={staticFile("reels/tokenize_08/sfx/whoosh.mp3")} volume={0.95} />
      </Sequence>
      <Sequence from={tokensLabeledCue} durationInFrames={25}>
        <Audio src={staticFile("reels/tokenize_08/sfx/pop.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={buzzerShockCue} durationInFrames={30}>
        <Audio src={staticFile("reels/tokenize_08/sfx/error.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={idsPopulateCue} durationInFrames={30}>
        <Audio src={staticFile("reels/tokenize_08/sfx/notification.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={piecesSplitCue} durationInFrames={35}>
        <Audio src={staticFile("reels/tokenize_08/sfx/whoosh.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={rsHighlightCue} durationInFrames={30}>
        <Audio src={staticFile("reels/tokenize_08/sfx/ping.mp3")} volume={0.95} />
      </Sequence>
      <Sequence from={smugStampCue} durationInFrames={40}>
        <Audio src={staticFile("reels/tokenize_08/sfx/chime.mp3")} volume={1.0} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STATIC HIGH-RES STUDIO GLOW */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5, opacity: darkProgress }}>
        <div
          style={{
            position: "absolute",
            top: 200,
            left: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: frame >= evPayoff.start_frame
              ? "radial-gradient(circle, rgba(244, 63, 94, 0.22) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 650,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: frame >= evPayoff.start_frame
              ? "radial-gradient(circle, rgba(255, 209, 102, 0.18) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP HUD (Safe Zone: top: 85px, sides: 70px) */}
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
              backgroundColor: frame >= evPayoff.start_frame ? nemiTheme.colors.brandCoral : nemiTheme.colors.brandCyan,
              boxShadow: `0 0 24px ${frame >= evPayoff.start_frame ? nemiTheme.colors.brandCoral : nemiTheme.colors.brandCyan}`,
              transform: `scale(${interpolate(frame % 20, [0, 10, 20], [1.0, 1.25, 1.0])})`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              color: frame >= evPayoff.start_frame ? nemiTheme.colors.brandCoral : "#0284C7",
              textTransform: "uppercase",
            }}
          >
            {frame >= evPayoff.start_frame ? "THE STRAWBERRY PARADOX" : "AI INTERNALS"}
          </span>
        </div>

        <div
          style={{
            backgroundColor: hudBg,
            padding: "12px 24px",
            borderRadius: 24,
            border: `2px solid ${hudBorder}`,
            fontSize: 20,
            fontWeight: 900,
            color: frame >= evPayoff.start_frame ? "#F43F5E" : "#0284C7",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {frame < evSecret.start_frame && "PHASE 1: THE MYSTERY"}
          {frame >= evSecret.start_frame && frame < evReversal.start_frame && "PHASE 2: TOKENIZER"}
          {frame >= evReversal.start_frame && frame < evPayoff.start_frame && "PHASE 3: 100K VOCAB"}
          {frame >= evPayoff.start_frame && frame < evLoop.start_frame && "PHASE 4: X-RAY REVEAL"}
          {frame >= evLoop.start_frame && "PHASE 5: CORE LESSON"}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOPIC HEADLINE (Safe Zone: top: 165px, sides: 70px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 165,
          left: 70,
          right: 70,
          zIndex: 50,
        }}
      >
        <h1
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: textHeading,
            letterSpacing: "-1.5px",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          How AI Sees Words:{" "}
          <span style={{ color: frame >= evPayoff.start_frame ? "#F43F5E" : "#0284C7" }}>
            {frame >= evPayoff.start_frame ? "The Tokenizer Trap! 🍓" : "Zero Letters Exist"}
          </span>
        </h1>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC STAGE CONTAINER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* BEAT 1 & 2: THE HOOK & TOKENIZER CHOPPING */}
        <StageWrapper frame={frame} startFrame={0} endFrame={evGuess.start_frame + 6}>
          <Beat1WordSplitStage
            frame={frame}
            fps={fps}
            wordSplitCue={wordSplitCue}
            chopTextCue={chopTextCue}
            tokensLabeledCue={tokensLabeledCue}
            darkProgress={darkProgress}
          />
        </StageWrapper>

        {/* BEAT 3: NEMI GUESS & REVERSAL — 100K DICTIONARY */}
        <StageWrapper frame={frame} startFrame={evGuess.start_frame} endFrame={evPayoff.start_frame + 6}>
          <Beat2DictionaryStage
            frame={frame}
            fps={fps}
            startFrame={evGuess.start_frame}
            idsPopulateCue={idsPopulateCue}
            dictCounterCue={dictCounterCue}
          />
        </StageWrapper>

        {/* BEAT 4: THE PAYOFF — STRAWBERRY X-RAY (LOST R's) */}
        <StageWrapper frame={frame} startFrame={evPayoff.start_frame} endFrame={evLoop.start_frame + 6}>
          <Beat3StrawberryPayoffStage
            frame={frame}
            fps={fps}
            startFrame={evPayoff.start_frame}
            piecesSplitCue={piecesSplitCue}
            rsHighlightCue={rsHighlightCue}
          />
        </StageWrapper>

        {/* BEAT 5: LOOP SEAM & TAKEAWAY SUMMARY */}
        <StageWrapper frame={frame} startFrame={evLoop.start_frame} endFrame={totalFrames}>
          <Beat4SummaryStage frame={frame} fps={fps} startFrame={evLoop.start_frame} />
        </StageWrapper>

        {/* ══════════════════════════════════════════════════════ */}
        {/* DYNAMIC MID-SCREEN VISUAL BADGES (Safe Zone: top: 920px) */}
        {/* ══════════════════════════════════════════════════════ */}
        <MidScreenDynamicBadges
          frame={frame}
          evSecret={evSecret.start_frame}
          evGuess={evGuess.start_frame}
          evReversal={evReversal.start_frame}
          evPayoff={evPayoff.start_frame}
          darkProgress={darkProgress}
        />

        {/* ══════════════════════════════════════════════════════ */}
        {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
        {/* ══════════════════════════════════════════════════════ */}
        {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} fps={fps} />}
      </div>

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
        {/* Frame 0-40 Floating Wonder Reactions */}
        {frame < 40 && (
          <div
            style={{
              position: "absolute",
              top: -60,
              display: "flex",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 36, filter: "drop-shadow(0 4px 12px rgba(6, 182, 212, 0.5))" }}>🧩</span>
            <span style={{ fontSize: 44, transform: "translateY(-10px)", filter: "drop-shadow(0 4px 12px rgba(6, 182, 212, 0.6))" }}>🤔</span>
            <span style={{ fontSize: 36, filter: "drop-shadow(0 4px 12px rgba(6, 182, 212, 0.5))" }}>🔢</span>
          </div>
        )}
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
// STAGE 1: THE WORD SPLIT & TOKENIZER CHOPPING ENGINE
// ═══════════════════════════════════════════════════════════════
const Beat1WordSplitStage: React.FC<{
  frame: number;
  fps: number;
  wordSplitCue: number;
  chopTextCue: number;
  tokensLabeledCue: number;
  darkProgress: number;
}> = ({ frame, fps, wordSplitCue, chopTextCue, tokensLabeledCue, darkProgress }) => {
  const isChopActive = frame >= chopTextCue;
  const isLabeled = frame >= tokensLabeledCue;

  const cardBg = interpolateColors(darkProgress, [0, 1], ["#FFFFFF", "#0B1120"]);
  const cardBorder = interpolateColors(
    darkProgress,
    [0, 1],
    ["#E2E8F0", isChopActive ? "#06B6D4" : "#F59E0B"]
  );
  const textColor = interpolateColors(darkProgress, [0, 1], ["#0F172A", "#F8FAFC"]);

  // Hook intro spring animation
  const hookPop = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });

  // Split tokens for "strawberry"
  const tokens = [
    { text: "straw", id: "496", color: "#06B6D4" },
    { text: "berry", id: "675", color: "#F43F5E" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: cardBg,
        borderRadius: 32,
        border: `3.5px solid ${cardBorder}`,
        boxShadow: darkProgress > 0.5
          ? "0 24px 70px rgba(6, 182, 212, 0.25)"
          : "0 24px 60px rgba(0, 0, 0, 0.08)",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      {/* Top Header Strip */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>✂️</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: textColor }}>The BPE Tokenizer</span>
        </div>
        <div
          style={{
            backgroundColor: darkProgress < 0.5 ? "#E0F2FE" : "rgba(6, 182, 212, 0.2)",
            color: darkProgress < 0.5 ? "#0369A1" : "#06B6D4",
            border: `1.5px solid ${darkProgress < 0.5 ? "#BAE6FD" : "#06B6D4"}`,
            padding: "6px 14px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 900,
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          {isChopActive ? "BYTE-PAIR CHUNKING" : "RAW HUMAN TEXT"}
        </div>
      </div>

      {/* Frame 0-35 Hook Badge Overlay */}
      {frame < 35 && (
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 30,
            right: 30,
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            borderRadius: 24,
            border: "3.5px solid #0284C7",
            boxShadow: "0 20px 50px rgba(2, 132, 199, 0.35)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `scale(${hookPop})`,
            zIndex: 50,
          }}
        >
          <span style={{ fontSize: 48 }}>🤖❌🔤</span>
          <span style={{ fontSize: 28, fontWeight: 900, color: "#0369A1", marginTop: 8, textAlign: "center" }}>
            AI HAS NO EYES FOR LETTERS
          </span>
          <div
            style={{
              backgroundColor: "#E0F2FE",
              border: "1.5px solid #BAE6FD",
              padding: "6px 16px",
              borderRadius: 12,
              fontSize: 15,
              color: "#0284C7",
              fontWeight: 900,
              marginTop: 8,
            }}
          >
            🔥 WHY CHATGPT CAN'T COUNT 'R's!
          </div>
        </div>
      )}

      {/* Main Visual: Splitting Word into 3D Physical Token Blocks */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          width: "100%",
        }}
      >
        {/* Raw Text Input Pill */}
        <div
          style={{
            backgroundColor: darkProgress < 0.5 ? "#F1F5F9" : "#1E293B",
            padding: "16px 36px",
            borderRadius: 20,
            border: `2px dashed ${darkProgress < 0.5 ? "#CBD5E1" : "#475569"}`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 20, color: "#94A3B8" }}>Input:</span>
          <span
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: textColor,
              letterSpacing: "4px",
              fontFamily: nemiTheme.typography.fontFamily.mono,
            }}
          >
            "strawberry"
          </span>
        </div>

        {/* Laser Slicing Beam */}
        <div
          style={{
            width: "80%",
            height: 4,
            backgroundColor: isChopActive ? "#06B6D4" : "transparent",
            boxShadow: isChopActive ? "0 0 20px #06B6D4" : "none",
            position: "relative",
          }}
        >
          {isChopActive && (
            <div
              style={{
                position: "absolute",
                top: -14,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#06B6D4",
                color: "#0F172A",
                padding: "2px 12px",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 900,
                fontFamily: nemiTheme.typography.fontFamily.mono,
              }}
            >
              CHOP! ✂️
            </div>
          )}
        </div>

        {/* Token Tiles Container */}
        <div style={{ display: "flex", gap: 20, justifyContent: "center", width: "100%" }}>
          {tokens.map((tok, idx) => {
            const tileSpring = spring({
              frame: frame - (frame >= chopTextCue ? chopTextCue + idx * 8 : 0),
              fps,
              config: { damping: 12, stiffness: 140 },
            });
            const scale = frame >= chopTextCue ? tileSpring : 1.0;

            return (
              <div
                key={tok.text}
                style={{
                  backgroundColor: darkProgress < 0.5 ? "#FFFFFF" : "#0F172A",
                  border: `3px solid ${tok.color}`,
                  borderRadius: 22,
                  padding: "18px 28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: `0 14px 40px ${tok.color}33`,
                  transform: `scale(${scale})`,
                  minWidth: 160,
                }}
              >
                <span
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    color: tok.color,
                    fontFamily: nemiTheme.typography.fontFamily.mono,
                  }}
                >
                  "{tok.text}"
                </span>
                {isLabeled && (
                  <div
                    style={{
                      backgroundColor: `${tok.color}22`,
                      border: `1.5px solid ${tok.color}`,
                      borderRadius: 10,
                      padding: "4px 12px",
                      fontSize: 16,
                      fontWeight: 900,
                      color: tok.color,
                      marginTop: 8,
                      fontFamily: nemiTheme.typography.fontFamily.mono,
                    }}
                  >
                    Token #{tok.id}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: 18, color: darkProgress < 0.5 ? "#64748B" : "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        {isChopActive
          ? "Text is sliced into token chunks before the neural net begins!"
          : "Humans see letters • Neural networks see math tokens"}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// STAGE 2: NEMI'S WRONG GUESS & THE 100,000-ENTRY DICTIONARY
// ═══════════════════════════════════════════════════════════════
const Beat2DictionaryStage: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  idsPopulateCue: number;
  dictCounterCue: number;
}> = ({ frame, fps, startFrame, idsPopulateCue, dictCounterCue }) => {
  const isIdsActive = frame >= idsPopulateCue;
  const isDictCounter = frame >= dictCounterCue;

  // Counter counting up to 100,000
  const vocabCount = isDictCounter
    ? Math.floor(interpolate(frame - dictCounterCue, [0, 25], [50000, 100256], { extrapolateRight: "clamp" }))
    : 100256;

  const sampleVocab = [
    { chunk: "the", id: 262 },
    { chunk: "straw", id: 496 },
    { chunk: "berry", id: 675 },
    { chunk: "ing", id: 278 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: "#0B1120",
        borderRadius: 32,
        border: "3.5px solid #A855F7",
        boxShadow: "0 28px 70px rgba(168, 85, 247, 0.35)",
        padding: "24px 28px",
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
          <span style={{ fontSize: 24, fontWeight: 900, color: "#C084FC" }}>The Token Dictionary</span>
        </div>
        <div
          style={{
            backgroundColor: "rgba(168, 85, 247, 0.2)",
            color: "#C084FC",
            border: "1.5px solid #A855F7",
            padding: "6px 14px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 900,
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          {vocabCount.toLocaleString()} TOKENS IN VOCAB
        </div>
      </div>

      {/* Dictionary Table Preview */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#0F172A",
          borderRadius: 22,
          border: "2px solid #1E293B",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            color: "#94A3B8",
            fontSize: 14,
            fontWeight: 900,
            borderBottom: "1.5px solid #334155",
            paddingBottom: 8,
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          <span>TEXT CHUNK</span>
          <span style={{ textAlign: "center" }}>BPE MAPPING</span>
          <span style={{ textAlign: "right" }}>TOKEN ID</span>
        </div>

        {sampleVocab.map((item, idx) => {
          const itemPop = spring({
            frame: frame - (startFrame + idx * 6),
            fps,
            config: { damping: 12, stiffness: 140 },
          });

          return (
            <div
              key={item.chunk}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                alignItems: "center",
                padding: "8px 0",
                transform: `scale(${Math.max(0, Math.min(1.0, itemPop))})`,
              }}
            >
              <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                "{item.chunk}"
              </span>
              <span style={{ color: "#A855F7", fontSize: 18, textAlign: "center", fontWeight: 900 }}>
                ➔
              </span>
              <span
                style={{
                  color: "#FFD166",
                  fontSize: 22,
                  fontWeight: 900,
                  textAlign: "right",
                  fontFamily: nemiTheme.typography.fontFamily.mono,
                }}
              >
                #{item.id}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Every word, syllable, and code snippet gets a permanent ID number!
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// STAGE 3: THE PAYOFF — STRAWBERRY X-RAY (LOST R's)
// ═══════════════════════════════════════════════════════════════
const Beat3StrawberryPayoffStage: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  piecesSplitCue: number;
  rsHighlightCue: number;
}> = ({ frame, fps, startFrame, piecesSplitCue, rsHighlightCue }) => {
  const isRsActive = frame >= rsHighlightCue;

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: "#0B1120",
        borderRadius: 32,
        border: "3.5px solid #F43F5E",
        boxShadow: "0 28px 80px rgba(244, 63, 94, 0.45)",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 32 }}>🍓</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#F43F5E", letterSpacing: "1px" }}>
            THE STRAWBERRY REVEAL
          </span>
        </div>
        <div
          style={{
            backgroundColor: "rgba(244, 63, 94, 0.25)",
            color: "#F43F5E",
            border: "1.5px solid #F43F5E",
            padding: "6px 14px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 900,
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          {isRsActive ? "3 'R's TRAPPED IN EMBEDDINGS" : "CHUNK X-RAY"}
        </div>
      </div>

      {/* Dual Token Breakdown */}
      <div style={{ display: "flex", gap: 24, justifyContent: "center", width: "100%" }}>
        {/* Token 1: straw */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#0F172A",
            borderRadius: 22,
            border: "2.5px solid #06B6D4",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 0 35px rgba(6, 182, 212, 0.25)",
          }}
        >
          <span style={{ fontSize: 16, color: "#06B6D4", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            TOKEN #496
          </span>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", margin: "8px 0", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            st<span style={{ color: isRsActive ? "#F43F5E" : "#F8FAFC", textShadow: isRsActive ? "0 0 16px #F43F5E" : "none" }}>r</span>aw
          </span>
          <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>
            Contains 1 'r'
          </div>
        </div>

        {/* Token 2: berry */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#0F172A",
            borderRadius: 22,
            border: "2.5px solid #F43F5E",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 0 35px rgba(244, 63, 94, 0.3)",
          }}
        >
          <span style={{ fontSize: 16, color: "#F43F5E", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            TOKEN #675
          </span>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", margin: "8px 0", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            be<span style={{ color: isRsActive ? "#F43F5E" : "#F8FAFC", textShadow: isRsActive ? "0 0 16px #F43F5E" : "none" }}>rr</span>y
          </span>
          <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>
            Contains 2 'r's
          </div>
        </div>
      </div>

      {/* Fatal Conclusion Banner */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#03070D",
          padding: "16px 20px",
          borderRadius: 18,
          border: "2px solid #F43F5E",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>
          AI only sees two numbers: <strong style={{ color: "#FFD166" }}>[496, 675]</strong>
        </span>
        <span style={{ color: "#F43F5E", fontWeight: 900, fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ZERO LETTERS! ❌
        </span>
      </div>

      <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        To count letters, the AI has to guess from training memory, not raw vision!
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// STAGE 4: LOOP SEAM & TAKEAWAY SUMMARY
// ═══════════════════════════════════════════════════════════════
const Beat4SummaryStage: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: "#0B1120",
        borderRadius: 32,
        border: "3.5px solid #10B981",
        boxShadow: "0 28px 80px rgba(16, 185, 129, 0.35)",
        padding: "26px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 34 }}>🧠</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            The AI Reality Check
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.25)", color: "#10B981", border: "1.5px solid #10B981", padding: "6px 14px", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          CORE PRINCIPLE
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

      <div style={{ backgroundColor: "#03070D", padding: "16px 24px", borderRadius: 18, border: "1px solid rgba(255, 255, 255, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18 }}>Next time AI miscounts, blame the tokens!</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SOLVED ✓
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Share with a friend who argued with ChatGPT! 👇
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC MID-SCREEN VISUAL BADGES (Safe Zone: top: 920px)
// ═══════════════════════════════════════════════════════════════
const MidScreenDynamicBadges: React.FC<{
  frame: number;
  evSecret: number;
  evGuess: number;
  evReversal: number;
  evPayoff: number;
  darkProgress: number;
}> = ({ frame, evSecret, evGuess, evReversal, evPayoff, darkProgress }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 920,
        left: 70,
        right: 70,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 35,
      }}
    >
      {frame < evSecret && (
        <div
          style={{
            backgroundColor: darkProgress < 0.5 ? "#E0F2FE" : "rgba(6, 182, 212, 0.15)",
            border: `2px solid ${darkProgress < 0.5 ? "#0284C7" : "#06B6D4"}`,
            padding: "12px 28px",
            borderRadius: 20,
            color: darkProgress < 0.5 ? "#0369A1" : "#06B6D4",
            fontSize: 22,
            fontWeight: 900,
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          🧩 "How many Rs are in strawberry?"
        </div>
      )}

      {frame >= evSecret && frame < evGuess && (
        <div style={{ backgroundColor: "rgba(6, 182, 212, 0.15)", border: "2px solid #06B6D4", padding: "12px 28px", borderRadius: 20, color: "#06B6D4", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ✂️ Slicing Text into Subword Tokens
        </div>
      )}

      {frame >= evGuess && frame < evReversal && (
        <div style={{ backgroundColor: "rgba(244, 63, 94, 0.2)", border: "2.5px solid #F43F5E", padding: "12px 28px", borderRadius: 20, color: "#F43F5E", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ❌ AI NEVER SEES WHOLE WORDS
        </div>
      )}

      {frame >= evReversal && frame < evPayoff && (
        <div style={{ backgroundColor: "rgba(168, 85, 247, 0.2)", border: "2.5px solid #A855F7", padding: "12px 28px", borderRadius: 20, color: "#C084FC", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          📖 100,000-Entry Token Vocabulary
        </div>
      )}

      {frame >= evPayoff && frame < 510 && (
        <div style={{ backgroundColor: "rgba(244, 63, 94, 0.2)", border: "2.5px solid #F43F5E", padding: "12px 28px", borderRadius: 20, color: "#F43F5E", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          🍓 [straw] + [berry] = Letters Hidden!
        </div>
      )}

      {frame >= 510 && (
        <div style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", border: "2.5px solid #10B981", padding: "12px 28px", borderRadius: 20, color: "#10B981", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          💡 Never Ask AI to Count Letters!
        </div>
      )}
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

// ═══════════════════════════════════════════════════════════════
// SILKY SMOOTH CROSS-FADE STAGE WRAPPER
// ═══════════════════════════════════════════════════════════════
const StageWrapper: React.FC<{
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  endFrame: number;
}> = ({ children, frame, startFrame, endFrame }) => {
  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const enterOpacity = interpolate(frame, [startFrame, startFrame + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = interpolate(frame, [endFrame - 6, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = Math.min(enterOpacity, exitOpacity);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: opacity > 0.1 ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
};
