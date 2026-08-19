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
import cuesData from "../../src/data/chatgpt_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandPurple: "#8B5CF6",
    brandGreen: "#10B981",
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

// ═══════════════════════════════════════════════════════════════
// NEMI EXPLAINS REEL #4 — HOW CHATGPT ACTUALLY WORKS
// THE SUPER AUTOCOMPLETE ENGINE (<20s @ 30fps)
// ═══════════════════════════════════════════════════════════════

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

export const ChatGPTExplainsComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Timeline Events ───
  const evHook = getEvent("ai01_hook");
  const evProb = getEvent("ai02_probabilities");
  const evLoop = getEvent("ai03_loop");
  const evAha = getEvent("ai04_nemi_aha");
  const evOutro = getEvent("ai05_outro");

  // Semantic Cues
  const fProbBars = getCueFrame("ai02_probabilities", "prob_bars_rise", evProb.start_frame + 25);
  const fWordSnap = getCueFrame("ai03_loop", "word_snap", evLoop.start_frame + 20);
  const fLoopSpeed = getCueFrame("ai03_loop", "loop_speedup", evLoop.start_frame + 60);

  // ─── SILKY SMOOTH LIGHT -> DARK -> LIGHT TRANSITIONS ───
  const darkProgress = interpolate(
    frame,
    [evProb.start_frame - 15, evProb.start_frame + 5, evOutro.start_frame - 10, evOutro.start_frame + 5],
    [0, 1, 1, 0],
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
    ["rgba(255, 255, 255, 0.95)", "rgba(15, 23, 42, 0.90)"]
  );

  const hudBorder = interpolateColors(
    darkProgress,
    [0, 1],
    [nemiTheme.colors.borderLight, nemiTheme.colors.borderDark]
  );

  // ─── Camera Motion ───
  const cameraScale = interpolate(
    frame,
    [0, 40, 119, 229, 366, 440, 499],
    [1.0, 1.02, 1.01, 1.03, 1.02, 1.03, 1.0],
    { extrapolateRight: "clamp" }
  );

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < evProb.start_frame) {
    nemiPose = "thinking";
  } else if (frame >= evProb.start_frame && frame < evLoop.start_frame) {
    nemiPose = "explaining";
  } else if (frame >= evLoop.start_frame && frame < evAha.start_frame) {
    nemiPose = "pointing";
  } else if (frame >= evAha.start_frame && frame < evOutro.start_frame) {
    nemiPose = "shocked";
    nemiSpeech = "Predicting ONE word at a time?! 🤯";
  } else {
    nemiPose = "smug";
    nemiSpeech = "Just super autocomplete! 😎⚡";
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
      {/* MASTER AUDIO (Voice + Fresh Melodic Tech BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/chatgpt_04/chatgpt_master_audio.mp3")} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SFX LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={10} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/typing.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={fProbBars} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/pop.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={fWordSnap} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/click.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={fLoopSpeed} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={evAha.start_frame} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/notification.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={evOutro.start_frame} durationInFrames={45}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/chime.mp3")} volume={0.85} />
      </Sequence>

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
              backgroundColor: "#10B981",
              boxShadow: "0 0 20px #10B981",
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              color: "#10B981",
              textTransform: "uppercase",
            }}
          >
            How AI Actually Works
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
            color: "#10B981",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {frame < evProb.start_frame && "STEP 1: YOUR PROMPT"}
          {frame >= evProb.start_frame && frame < evLoop.start_frame && "STEP 2: WORD CHANCE"}
          {frame >= evLoop.start_frame && frame < evAha.start_frame && "STEP 3: 60 FPS LOOP"}
          {frame >= evAha.start_frame && "THE AI REALITY"}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOPIC BANNER (Safe Zone: top: 165px, sides: 70px) */}
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
            fontSize: 58,
            fontWeight: 900,
            color: textHeading,
            letterSpacing: "-1.5px",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          How ChatGPT Works:{" "}
          <span style={{ color: "#10B981" }}>Super Autocomplete</span>
        </h1>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE MANAGER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* BEAT 1: PROMPT INPUT (Light Mode) */}
        <StageWrapper frame={frame} startFrame={0} endFrame={evProb.start_frame + 4}>
          <Beat1LightPrompt frame={frame} fps={fps} />
        </StageWrapper>

        {/* BEAT 2: NEXT WORD PROBABILITY DISTRIBUTION (Dark Mode) */}
        <StageWrapper frame={frame} startFrame={evProb.start_frame} endFrame={evLoop.start_frame + 4}>
          <Beat2NextWordProbability frame={frame} fps={fps} startFrame={evProb.start_frame} fProbBars={fProbBars} />
        </StageWrapper>

        {/* BEAT 3: THE AUTOREGRESSIVE LOOP (Dark Mode) */}
        <StageWrapper frame={frame} startFrame={evLoop.start_frame} endFrame={evAha.start_frame + 4}>
          <Beat3AutocompleteLoop frame={frame} fps={fps} startFrame={evLoop.start_frame} fWordSnap={fWordSnap} />
        </StageWrapper>

        {/* BEAT 4: FINAL TRUTH (Light / Gold Mode Payoff) */}
        <StageWrapper frame={frame} startFrame={evAha.start_frame} endFrame={499}>
          <Beat4SummaryConsole frame={frame} fps={fps} startFrame={evAha.start_frame} />
        </StageWrapper>

        {/* ══════════════════════════════════════════════════════ */}
        {/* MID-SCREEN VISUAL ASSETS (Safe Zone: top: 960px) */}
        {/* ══════════════════════════════════════════════════════ */}
        <MidScreenVisualAssets
          frame={frame}
          fps={fps}
          evProbFrame={evProb.start_frame}
          evLoopFrame={evLoop.start_frame}
          evAhaFrame={evAha.start_frame}
        />
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
        <NemiMascot pose={nemiPose} scale={1.65} />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SPEECH BUBBLE (Always on Top of Nemi) */}
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
// SILKY SMOOTH STAGE WRAPPER
// ═══════════════════════════════════════════════════════════════
const StageWrapper: React.FC<{
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  endFrame: number;
}> = ({ children, frame, startFrame, endFrame }) => {
  if (frame < startFrame - 8 || frame > endFrame + 8) {
    return null;
  }

  const enterOpacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterY = interpolate(frame, [startFrame, startFrame + 8], [25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = interpolate(frame, [endFrame - 6, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(frame, [endFrame - 6, endFrame], [0, -25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = Math.min(enterOpacity, exitOpacity);
  const translateY = enterY + exitY;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: opacity > 0.1 ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 1: LIGHT MODE PROMPT (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat1LightPrompt: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 65,
        right: 65,
        height: 550,
        backgroundColor: "#FFFFFF",
        borderRadius: 32,
        border: "3.5px solid #E2E8F0",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.08)",
        padding: "34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${pop})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>💬</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#0F172A" }}>You Type a Sentence</span>
        </div>
        <div style={{ backgroundColor: "#DCFCE7", color: "#16A34A", fontWeight: 900, fontSize: 19, padding: "8px 18px", borderRadius: 14, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          PROMPT
        </div>
      </div>

      {/* ChatGPT Search Input */}
      <div style={{ backgroundColor: "#F8FAFC", borderRadius: 24, border: "2px solid #CBD5E1", padding: "26px 28px" }}>
        <div style={{ fontSize: 17, color: "#64748B", fontWeight: 700 }}>Your Input:</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", marginTop: 6, lineHeight: 1.25 }}>
          "The best pizza in Italy is in..."
        </div>
      </div>

      {/* What AI sees */}
      <div style={{ backgroundColor: "#F0FDF4", borderRadius: 24, padding: "24px 28px", border: "2.5px solid #86EFAC" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 20, color: "#16A34A", fontWeight: 800 }}>🤖 What ChatGPT Does:</span>
          <span style={{ fontSize: 19, color: "#16A34A", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>PREDICTS</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", marginTop: 8 }}>
          "What is the single most likely next word?"
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#64748B", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        ChatGPT is literally <span style={{ color: "#16A34A", fontWeight: 900 }}>Super Autocomplete</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 2: NEXT WORD PROBABILITY DISTRIBUTION (Dark Mode)
// ═══════════════════════════════════════════════════════════════
const Beat2NextWordProbability: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fProbBars: number;
}> = ({ frame, fps, startFrame, fProbBars }) => {
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isBarsUp = frame >= fProbBars;

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 65,
        right: 65,
        height: 550,
        backgroundColor: "#070B12",
        borderRadius: 32,
        border: "3.5px solid #10B981",
        boxShadow: "0 28px 70px rgba(16, 185, 129, 0.35)",
        padding: "30px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${pop})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 32 }}>📊</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Probability of Next Word
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          AI BRAIN
        </span>
      </div>

      {/* Probability Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Choice 1: Naples (88%) */}
        <div
          style={{
            backgroundColor: isBarsUp ? "rgba(16, 185, 129, 0.25)" : "#0F172A",
            padding: "16px 22px",
            borderRadius: 18,
            border: isBarsUp ? "3px solid #10B981" : "1px solid #1E293B",
            boxShadow: isBarsUp ? "0 0 35px rgba(16, 185, 129, 0.4)" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>🍕</span>
            <span style={{ fontSize: 30, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>"Naples"</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>88% Likely</span>
            <span style={{ backgroundColor: "#10B981", color: "#FFFFFF", padding: "6px 14px", borderRadius: 10, fontSize: 16, fontWeight: 900 }}>
              WINNER
            </span>
          </div>
        </div>

        {/* Choice 2: Rome (9%) */}
        <div style={{ backgroundColor: "#0F172A", padding: "16px 22px", borderRadius: 18, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>🏛️</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>"Rome"</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>9%</span>
        </div>

        {/* Choice 3: New York (2%) */}
        <div style={{ backgroundColor: "#0F172A", padding: "16px 22px", borderRadius: 18, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>🗽</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>"New York"</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>2%</span>
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        It scans all internet patterns ➔ calculates <span style={{ color: "#10B981", fontWeight: 900 }}>88% chance</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 3: THE AUTOREGRESSIVE LOOP (Dark Mode)
// ═══════════════════════════════════════════════════════════════
const Beat3AutocompleteLoop: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fWordSnap: number;
}> = ({ frame, fps, startFrame, fWordSnap }) => {
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isSnapped = frame >= fWordSnap;

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 65,
        right: 65,
        height: 550,
        backgroundColor: "#070B12",
        borderRadius: 32,
        border: "3.5px solid #38BDF8",
        boxShadow: "0 28px 70px rgba(56, 189, 248, 0.35)",
        padding: "30px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${pop})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 32 }}>🔄</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#38BDF8", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            The Autoregressive Loop
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          60 WORDS / SEC
        </span>
      </div>

      {/* Sentence Growing */}
      <div style={{ backgroundColor: "#0F172A", padding: "24px 28px", borderRadius: 24, border: "2px solid #1E293B" }}>
        <div style={{ fontSize: 17, color: "#94A3B8", fontWeight: 700 }}>Sentence Extended:</div>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#F8FAFC", marginTop: 8, lineHeight: 1.3 }}>
          "The best pizza in Italy is in{" "}
          <span style={{ color: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.2)", padding: "2px 10px", borderRadius: 8 }}>
            Naples
          </span>{" "}
          {isSnapped && (
            <span style={{ color: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.2)", padding: "2px 10px", borderRadius: 8 }}>
              because...
            </span>
          )}
          "
        </div>
      </div>

      {/* Next Prediction Preview */}
      <div style={{ backgroundColor: "#0F172A", padding: "18px 24px", borderRadius: 20, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#94A3B8", fontSize: 18 }}>Now predicting word #7...</span>
        <span style={{ color: "#38BDF8", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          "because" (76%) ➔
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        It predicts <span style={{ color: "#38BDF8", fontWeight: 900 }}>one single word</span>, appends it, and repeats!
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 4: FINAL SUMMARY SCORECARD (Payoff Mode)
// ═══════════════════════════════════════════════════════════════
const Beat4SummaryConsole: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 65,
        right: 65,
        backgroundColor: "#18181B",
        borderRadius: 32,
        border: "3.5px solid #27272A",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.5)",
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transform: `scale(${pop})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: nemiTheme.colors.brandYellow, letterSpacing: "1.5px" }}>
          ⚡ THE TRUTH ABOUT CHATGPT
        </span>
        <span style={{ fontSize: 20, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          AI EXPLAINED
        </span>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "16px 22px", borderRadius: 16, borderLeft: "7px solid #10B981" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>01. Read Your Sentence</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Scans every word in your prompt.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "16px 22px", borderRadius: 16, borderLeft: "7px solid #38BDF8" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>02. Calculate Next Word Chance</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Picks the highest probability word (Naples: 88%).</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "16px 22px", borderRadius: 16, borderLeft: "7px solid #FFD166" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>03. Repeat 60x / Sec</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Adds the word and repeats until done!</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MID-SCREEN VISUAL ASSETS (Safe Zone: top: 960px, sides: 65px)
// ═══════════════════════════════════════════════════════════════
const MidScreenVisualAssets: React.FC<{
  frame: number;
  fps: number;
  evProbFrame: number;
  evLoopFrame: number;
  evAhaFrame: number;
}> = ({ frame, fps, evProbFrame, evLoopFrame, evAhaFrame }) => {
  const isStage1 = frame < evProbFrame;
  const isStage2 = frame >= evProbFrame && frame < evLoopFrame;
  const isStage3 = frame >= evLoopFrame && frame < evAhaFrame;
  const isStage4 = frame >= evAhaFrame;

  return (
    <div
      style={{
        position: "absolute",
        top: 960,
        left: 65,
        right: 65,
        height: 300,
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        zIndex: 35,
      }}
    >
      {/* ─── STAGE 1: PROMPT (Light Mode) ─── */}
      {isStage1 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, border: "2px solid #86EFAC", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 46 }}>⌨️</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>Prompt</span>
            </div>

            <span style={{ fontSize: 32, color: "#16A34A", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, border: "2px solid #86EFAC", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 46 }}>🔮</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#16A34A" }}>Predict Next Word</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(22, 163, 74, 0.10)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(22, 163, 74, 0.35)", color: "#16A34A", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            World's Most Advanced Autocomplete
          </div>
        </>
      )}

      {/* ─── STAGE 2: PROBABILITY (Dark Mode) ─── */}
      {isStage2 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>📊</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Chance %</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.7)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}>
              <span style={{ fontSize: 46 }}>🍕</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>"Naples" (88%)</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(16, 185, 129, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(16, 185, 129, 0.45)", color: "#10B981", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Calculates the Next Word in 15ms
          </div>
        </>
      )}

      {/* ─── STAGE 3: THE LOOP (Dark Mode) ─── */}
      {isStage3 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(56, 189, 248, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>1️⃣</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#38BDF8" }}>Word 1</span>
            </div>

            <span style={{ fontSize: 32, color: "#38BDF8", fontWeight: 900 }}>➔ 2️⃣ ➔ 3️⃣ ➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(56, 189, 248, 0.7)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 30px rgba(56, 189, 248, 0.4)" }}>
              <span style={{ fontSize: 46 }}>📄</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#38BDF8" }}>Full Story</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(56, 189, 248, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(56, 189, 248, 0.45)", color: "#38BDF8", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Loops 60 Times Every Second
          </div>
        </>
      )}

      {/* ─── STAGE 4: PAYOFF ─── */}
      {isStage4 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.18)", padding: "16px 28px", borderRadius: 26, border: "2px solid rgba(239, 68, 68, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 40 }}>❌</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#EF4444" }}>Not Conscious</span>
            </div>

            <span style={{ fontSize: 30, color: "#FFD166", fontWeight: 900 }}>VS</span>

            <div style={{ backgroundColor: "rgba(16, 185, 129, 0.22)", padding: "16px 30px", borderRadius: 26, border: "3px solid #10B981", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 40px rgba(16, 185, 129, 0.45)" }}>
              <span style={{ fontSize: 40 }}>⚡</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>Pure Probability!</span>
            </div>
          </div>

          <div style={{ color: "#FFD166", fontSize: 21, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Predicting 1 Word at a Time = AI! 🚀
          </div>
        </>
      )}
    </div>
  );
};
