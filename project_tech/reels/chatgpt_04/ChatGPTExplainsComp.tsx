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
    brandPurple: "#A855F7",
    brandGreen: "#10B981",
    brandPink: "#EC4899",
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
  const evAttention = getEvent("ai02_attention");
  const evLayers = getEvent("ai03_layers");
  const evSampling = getEvent("ai04_sampling");
  const evAha = getEvent("ai05_nemi_aha");
  const evConfirm = getEvent("ai06_narrator_confirm");
  const evOutro = getEvent("ai07_nemi_outro");

  const totalFrames = cuesData.total_frames || 768;

  // Semantic Cues
  const fAttentionMatrix = getCueFrame("ai02_attention", "attention_matrix", evAttention.start_frame + 45);
  const fWeightsGlow = getCueFrame("ai03_layers", "weights_glow", evLayers.start_frame + 60);
  const fWordEmitted = getCueFrame("ai04_sampling", "word_emitted", evSampling.start_frame + 80);

  // ─── SILKY SMOOTH COLOR INTERPOLATION ───
  const darkProgress = interpolate(
    frame,
    [evAttention.start_frame - 15, evAttention.start_frame + 5, evOutro.start_frame - 10, evOutro.start_frame + 5],
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
    ["rgba(255, 255, 255, 0.95)", "rgba(15, 23, 42, 0.92)"]
  );

  const hudBorder = interpolateColors(
    darkProgress,
    [0, 1],
    [nemiTheme.colors.borderLight, nemiTheme.colors.borderDark]
  );

  // ─── Camera Breathing / Dynamic Zoom ───
  const cameraScale = interpolate(
    frame,
    [0, 60, evAttention.start_frame, evLayers.start_frame, evSampling.start_frame, evAha.start_frame, totalFrames],
    [1.0, 1.025, 1.01, 1.035, 1.02, 1.03, 1.0],
    { extrapolateRight: "clamp" }
  );

  // ─── Nemi Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < evAttention.start_frame) {
    nemiPose = "thinking";
  } else if (frame >= evAttention.start_frame && frame < evLayers.start_frame) {
    nemiPose = "explaining";
  } else if (frame >= evLayers.start_frame && frame < evSampling.start_frame) {
    nemiPose = "pointing";
  } else if (frame >= evSampling.start_frame && frame < evAha.start_frame) {
    nemiPose = "shocked";
  } else if (frame >= evAha.start_frame && frame < evOutro.start_frame) {
    nemiPose = "shocked";
    nemiSpeech = "96 layers of math predict words?! 🤯";
  } else {
    nemiPose = "smug";
    nemiSpeech = "Pure Transformer architecture! 😎⚡";
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
      {/* MASTER AUDIO (Voice + Enhanced BGM: Death of a Bluebird) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/chatgpt_04/chatgpt_master_audio.mp3")} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SFX LAYER (Audible & Punchy) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={15} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/typing.mp3")} volume={0.95} />
      </Sequence>
      <Sequence from={evAttention.start_frame} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/whoosh.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={fAttentionMatrix} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/pop.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={fWeightsGlow} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/notification.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={fWordEmitted} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/click.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={evOutro.start_frame} durationInFrames={45}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/chime.mp3")} volume={1.0} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC NEURAL BACKGROUND PARTICLES & ORBS */}
      {/* ══════════════════════════════════════════════════════════ */}
      <NeuralBackground frame={frame} darkProgress={darkProgress} />

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
              backgroundColor: "#A855F7",
              boxShadow: "0 0 24px #A855F7",
              transform: `scale(${interpolate(frame % 20, [0, 10, 20], [1.0, 1.3, 1.0])})`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              color: "#A855F7",
              textTransform: "uppercase",
            }}
          >
            Transformer Core
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
            color: "#A855F7",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {frame < evAttention.start_frame && "STEP 1: PROMPT INPUT"}
          {frame >= evAttention.start_frame && frame < evLayers.start_frame && "STEP 2: SELF-ATTENTION"}
          {frame >= evLayers.start_frame && frame < evSampling.start_frame && "STEP 3: 96 DEEP LAYERS"}
          {frame >= evSampling.start_frame && frame < evAha.start_frame && "STEP 4: 15ms SAMPLING"}
          {frame >= evAha.start_frame && "AI ARCHITECTURE"}
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
            fontSize: 56,
            fontWeight: 900,
            color: textHeading,
            letterSpacing: "-1.5px",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          How ChatGPT Works:{" "}
          <span style={{ color: "#A855F7" }}>The Transformer</span>
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
        {/* BEAT 1: PROMPT (Light Mode) */}
        <StageWrapper frame={frame} startFrame={0} endFrame={evAttention.start_frame + 4}>
          <Beat1LightPrompt frame={frame} fps={fps} />
        </StageWrapper>

        {/* BEAT 2: SELF-ATTENTION MATRIX (Dark Mode) */}
        <StageWrapper frame={frame} startFrame={evAttention.start_frame} endFrame={evLayers.start_frame + 4}>
          <Beat2SelfAttention frame={frame} fps={fps} startFrame={evAttention.start_frame} fAttentionMatrix={fAttentionMatrix} />
        </StageWrapper>

        {/* BEAT 3: 96 DEEP NEURAL LAYERS (Dark Mode) */}
        <StageWrapper frame={frame} startFrame={evLayers.start_frame} endFrame={evSampling.start_frame + 4}>
          <Beat3DeepLayers frame={frame} fps={fps} startFrame={evLayers.start_frame} fWeightsGlow={fWeightsGlow} />
        </StageWrapper>

        {/* BEAT 4: NEXT-TOKEN SAMPLING IN 15MS (Dark Mode) */}
        <StageWrapper frame={frame} startFrame={evSampling.start_frame} endFrame={evAha.start_frame + 4}>
          <Beat4NextTokenSampling frame={frame} fps={fps} startFrame={evSampling.start_frame} fWordEmitted={fWordEmitted} />
        </StageWrapper>

        {/* BEAT 5: FINAL SCORECARD & SUMMARY (Payoff Mode) */}
        <StageWrapper frame={frame} startFrame={evAha.start_frame} endFrame={totalFrames}>
          <Beat5SummaryConsole frame={frame} fps={fps} startFrame={evAha.start_frame} />
        </StageWrapper>

        {/* ══════════════════════════════════════════════════════ */}
        {/* DYNAMIC MID-SCREEN VISUAL ASSETS (Safe Zone: top: 920px) */}
        {/* ══════════════════════════════════════════════════════ */}
        <MidScreenVisualAssets
          frame={frame}
          fps={fps}
          evAttentionFrame={evAttention.start_frame}
          evLayersFrame={evLayers.start_frame}
          evSamplingFrame={evSampling.start_frame}
          evAhaFrame={evAha.start_frame}
        />

        {/* ══════════════════════════════════════════════════════ */}
        {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
        {/* Hidden when Nemi's Speech Bubble is active */}
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
        <NemiMascot pose={nemiPose} scale={1.65} />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SPEECH BUBBLE (Strictly on Top of Nemi) */}
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
// DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px, sides: 65px)
// Word-by-Word Highlight with Glowing Pill & Zero Asset Overlap
// ═══════════════════════════════════════════════════════════════
const DynamicKaraokeCaptions: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const subtitles = cuesData.subtitles || [];
  const currentChunk = subtitles.find(
    (chunk: any) => frame >= chunk.start_frame && frame <= chunk.end_frame + 2
  );

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
          backgroundColor: "rgba(10, 15, 30, 0.88)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          border: "2px solid rgba(168, 85, 247, 0.55)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(168, 85, 247, 0.25)",
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
// DYNAMIC NEURAL BACKGROUND (Pulsing Orbs & Wave Grid)
// ═══════════════════════════════════════════════════════════════
const NeuralBackground: React.FC<{ frame: number; darkProgress: number }> = ({ frame, darkProgress }) => {
  if (darkProgress < 0.05) return null;

  const orb1Y = 300 + Math.sin(frame * 0.05) * 40;
  const orb2Y = 800 + Math.cos(frame * 0.04) * 50;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: darkProgress * 0.85, zIndex: 5 }}>
      {/* Glowing Neural Ambient Orbs */}
      <div
        style={{
          position: "absolute",
          top: orb1Y,
          left: -100,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(168, 85, 247, 0) 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: orb2Y,
          right: -100,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0) 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
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
// BEAT 1: DYNAMIC LIGHT MODE PROMPT WITH TYPING & WORD HIGHLIGHTS
// ═══════════════════════════════════════════════════════════════
const Beat1LightPrompt: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const fullText = "The thieves robbed the bank near the river bank...";
  const charsShown = Math.min(fullText.length, Math.floor(interpolate(frame, [10, 75], [0, fullText.length])));
  const cursorBlink = Math.floor(frame / 8) % 2 === 0 ? "|" : "";

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: "#FFFFFF",
        borderRadius: 32,
        border: "3.5px solid #E2E8F0",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.08)",
        padding: "32px",
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
          <span style={{ fontSize: 26, fontWeight: 900, color: "#0F172A" }}>You Ask ChatGPT:</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ backgroundColor: "#F3E8FF", color: "#9333EA", fontWeight: 900, fontSize: 18, padding: "8px 16px", borderRadius: 14, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Tokens: 11 / 4096
          </div>
        </div>
      </div>

      {/* ChatGPT Search Input with Live Typing */}
      <div style={{ backgroundColor: "#F8FAFC", borderRadius: 24, border: "2.5px solid #CBD5E1", padding: "24px 28px", minHeight: 130 }}>
        <div style={{ fontSize: 16, color: "#64748B", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Prompt Input</div>
        <div style={{ fontSize: 29, fontWeight: 900, color: "#0F172A", marginTop: 8, lineHeight: 1.3 }}>
          "{fullText.slice(0, charsShown)}
          <span style={{ color: "#9333EA", fontWeight: 900 }}>{cursorBlink}</span>"
        </div>
      </div>

      {/* Curiosity Reveal */}
      <div style={{ backgroundColor: "#FDF4FF", borderRadius: 24, padding: "20px 28px", border: "2.5px solid #F0ABFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, color: "#C026D3", fontWeight: 800 }}>🤔 THE SECRET:</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", marginTop: 4 }}>
            It does not understand English.
          </div>
        </div>
        <span style={{ fontSize: 44, transform: `rotate(${Math.sin(frame * 0.1) * 15}deg)` }}>🚫</span>
      </div>

      <div style={{ fontSize: 19, color: "#64748B", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        How does it know which <span style={{ color: "#9333EA", fontWeight: 900 }}>"bank"</span> is money vs river?
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 2: DYNAMIC SELF-ATTENTION MATRIX WITH PULSING LASER LINKS
// ═══════════════════════════════════════════════════════════════
const Beat2SelfAttention: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fAttentionMatrix: number;
}> = ({ frame, fps, startFrame, fAttentionMatrix }) => {
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isMatrixOn = frame >= fAttentionMatrix;
  const pulse = interpolate(frame % 24, [0, 12, 24], [1.0, 1.04, 1.0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: "#070B12",
        borderRadius: 32,
        border: "3.5px solid #A855F7",
        boxShadow: "0 28px 70px rgba(168, 85, 247, 0.4)",
        padding: "28px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${pop})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 34, transform: `scale(${pulse})` }}>🧠</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#C084FC", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Self-Attention Mechanism
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#10B981", border: "1.5px solid #10B981", padding: "6px 14px", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          12 HEADS ACTIVE ⚡
        </span>
      </div>

      {/* Dynamic Multi-Head Attention Relationship Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Connection 1: Robbed -> Bank (Money) */}
        <div
          style={{
            backgroundColor: isMatrixOn ? "rgba(168, 85, 247, 0.25)" : "#0F172A",
            padding: "20px",
            borderRadius: 20,
            border: isMatrixOn ? "3px solid #C084FC" : "1px solid #1E293B",
            boxShadow: isMatrixOn ? "0 0 40px rgba(168, 85, 247, 0.5)" : "none",
            transform: isMatrixOn ? `scale(${pulse})` : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 34 }}>🏦</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#C084FC", fontFamily: nemiTheme.typography.fontFamily.mono }}>98% SCORE</span>
          </div>
          <div style={{ fontSize: 25, fontWeight: 900, color: "#F8FAFC", marginTop: 8 }}>Money Vault</div>
          <div style={{ fontSize: 16, color: "#C084FC", marginTop: 4, fontWeight: 700 }}>⚡ Attends to "robbed"</div>
        </div>

        {/* Connection 2: River -> Bank (Water) */}
        <div
          style={{
            backgroundColor: isMatrixOn ? "rgba(6, 182, 212, 0.25)" : "#0F172A",
            padding: "20px",
            borderRadius: 20,
            border: isMatrixOn ? "3px solid #06B6D4" : "1px solid #1E293B",
            boxShadow: isMatrixOn ? "0 0 40px rgba(6, 182, 212, 0.5)" : "none",
            transform: isMatrixOn ? `scale(${pulse})` : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 34 }}>🌊</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#06B6D4", fontFamily: nemiTheme.typography.fontFamily.mono }}>95% SCORE</span>
          </div>
          <div style={{ fontSize: 25, fontWeight: 900, color: "#F8FAFC", marginTop: 8 }}>Water Bank</div>
          <div style={{ fontSize: 16, color: "#06B6D4", marginTop: 4, fontWeight: 700 }}>⚡ Attends to "river"</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#03070D", padding: "16px 24px", borderRadius: 18, border: "1px solid rgba(255, 255, 255, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#94A3B8", fontSize: 18 }}>Attention connects all words simultaneously</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          Context Resolved! ✓
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Attention figures out the <span style={{ color: "#C084FC", fontWeight: 900 }}>exact meaning</span> from surroundings
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 3: DYNAMIC 96 DEEP NEURAL LAYERS WITH ENERGY CONVEYOR
// ═══════════════════════════════════════════════════════════════
const Beat3DeepLayers: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fWeightsGlow: number;
}> = ({ frame, fps, startFrame, fWeightsGlow }) => {
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isGlowing = frame >= fWeightsGlow;

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: "#070B12",
        borderRadius: 32,
        border: "3.5px solid #38BDF8",
        boxShadow: "0 28px 70px rgba(56, 189, 248, 0.4)",
        padding: "28px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${pop})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 34 }}>🥞</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#38BDF8", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            96 Transformer Layers
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(56, 189, 248, 0.2)", color: "#38BDF8", border: "1.5px solid #38BDF8", padding: "6px 14px", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          175B WEIGHTS 🌐
        </span>
      </div>

      {/* 3 Layer Blocks Stack with Energy Glow */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Layer 1: Syntax */}
        <div style={{ backgroundColor: "#0F172A", padding: "14px 22px", borderRadius: 16, border: "2px solid #38BDF8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 21, fontWeight: 900, color: "#F8FAFC" }}>Layer 01 – 32: Syntax & Grammar</div>
            <div style={{ fontSize: 15, color: "#94A3B8" }}>Identifies nouns, verbs, structure.</div>
          </div>
          <span style={{ color: "#38BDF8", fontWeight: 900, fontSize: 17 }}>✓ GRAMMAR</span>
        </div>

        {/* Layer 2: Knowledge */}
        <div style={{ backgroundColor: "#0F172A", padding: "14px 22px", borderRadius: 16, border: "2px solid #8B5CF6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 21, fontWeight: 900, color: "#F8FAFC" }}>Layer 33 – 64: World Knowledge</div>
            <div style={{ fontSize: 15, color: "#94A3B8" }}>Connects geography, physics, history.</div>
          </div>
          <span style={{ color: "#8B5CF6", fontWeight: 900, fontSize: 17 }}>✓ KNOWLEDGE</span>
        </div>

        {/* Layer 3: Reasoning */}
        <div
          style={{
            backgroundColor: isGlowing ? "rgba(16, 185, 129, 0.25)" : "#0F172A",
            padding: "14px 22px",
            borderRadius: 16,
            border: isGlowing ? "3px solid #10B981" : "2px solid #1E293B",
            boxShadow: isGlowing ? "0 0 35px rgba(16, 185, 129, 0.5)" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 21, fontWeight: 900, color: isGlowing ? "#10B981" : "#F8FAFC" }}>Layer 65 – 96: Deep Reasoning</div>
            <div style={{ fontSize: 15, color: "#94A3B8" }}>Synthesizes output context & logic.</div>
          </div>
          <span style={{ color: "#10B981", fontWeight: 900, fontSize: 17 }}>✓ REASONING</span>
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Trained on <span style={{ color: "#38BDF8", fontWeight: 900 }}>trillions of internet words</span> across 96 deep layers
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 4: DYNAMIC 100K TOKEN SCORING WITH RACE BARS & FLYING TOKEN
// ═══════════════════════════════════════════════════════════════
const Beat4NextTokenSampling: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fWordEmitted: number;
}> = ({ frame, fps, startFrame, fWordEmitted }) => {
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isEmitted = frame >= fWordEmitted;
  const barProgress = interpolate(localFrame, [10, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: "#070B12",
        borderRadius: 32,
        border: "3.5px solid #10B981",
        boxShadow: "0 28px 70px rgba(16, 185, 129, 0.4)",
        padding: "28px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${pop})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 34 }}>🎯</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            100,000 Token Scoring
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#10B981", border: "1.5px solid #10B981", padding: "6px 14px", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SPEED: 15ms ⚡
        </span>
      </div>

      {/* Dynamic Animated Token Probability Race Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Token 1: escape (91.4%) */}
        <div
          style={{
            backgroundColor: isEmitted ? "rgba(16, 185, 129, 0.25)" : "#0F172A",
            padding: "14px 22px",
            borderRadius: 18,
            border: isEmitted ? "3px solid #10B981" : "1px solid #1E293B",
            boxShadow: isEmitted ? "0 0 40px rgba(16, 185, 129, 0.5)" : "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${barProgress * 91.4}%`,
              backgroundColor: "rgba(16, 185, 129, 0.35)",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 32 }}>🏃‍♂️</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>"escape"</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>91.4%</span>
              <span style={{ backgroundColor: "#10B981", color: "#FFFFFF", padding: "6px 14px", borderRadius: 10, fontSize: 16, fontWeight: 900 }}>
                WINNER 🟢
              </span>
            </div>
          </div>
        </div>

        {/* Token 2: vault (5.2%) */}
        <div style={{ backgroundColor: "#0F172A", padding: "14px 22px", borderRadius: 18, border: "1px solid #1E293B", position: "relative", overflow: "hidden", opacity: 0.65 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barProgress * 35}%`, backgroundColor: "rgba(56, 189, 248, 0.2)", zIndex: 1 }} />
          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 32 }}>🔐</span>
              <span style={{ fontSize: 25, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>"vault"</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>5.2%</span>
          </div>
        </div>

        {/* Token 3: police (2.1%) */}
        <div style={{ backgroundColor: "#0F172A", padding: "14px 22px", borderRadius: 18, border: "1px solid #1E293B", position: "relative", overflow: "hidden", opacity: 0.45 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barProgress * 15}%`, backgroundColor: "rgba(168, 85, 247, 0.2)", zIndex: 1 }} />
          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 32 }}>🚓</span>
              <span style={{ fontSize: 25, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>"police"</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>2.1%</span>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Calculates and emits the best next word in <span style={{ color: "#10B981", fontWeight: 900 }}>15 milliseconds</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 5: DYNAMIC FINAL SUMMARY SCORECARD (Payoff Mode)
// ═══════════════════════════════════════════════════════════════
const Beat5SummaryConsole: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const pulse = interpolate(frame % 20, [0, 10, 20], [1.0, 1.03, 1.0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        backgroundColor: "#18181B",
        borderRadius: 32,
        border: "3.5px solid #27272A",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.5)",
        padding: "30px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transform: `scale(${pop})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: nemiTheme.colors.brandYellow, letterSpacing: "1.5px" }}>
          ⚡ TRANSFORMER ARCHITECTURE
        </span>
        <span style={{ backgroundColor: "#10B981", color: "#FFFFFF", padding: "6px 14px", borderRadius: 10, fontSize: 18, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono, transform: `scale(${pulse})` }}>
          AI CORE
        </span>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #A855F7" }}>
        <div style={{ fontSize: 23, fontWeight: 900, color: "#F8FAFC" }}>01. Self-Attention Engine</div>
        <div style={{ fontSize: 17, color: "#94A3B8", marginTop: 2 }}>Resolves multi-word context simultaneously.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #38BDF8" }}>
        <div style={{ fontSize: 23, fontWeight: 900, color: "#F8FAFC" }}>02. 96 Deep Neural Layers</div>
        <div style={{ fontSize: 17, color: "#94A3B8", marginTop: 2 }}>Pushes vectors across 175B learned weights.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #10B981" }}>
        <div style={{ fontSize: 23, fontWeight: 900, color: "#F8FAFC" }}>03. 15ms Next-Token Sampling</div>
        <div style={{ fontSize: 17, color: "#94A3B8", marginTop: 2 }}>Scores 100,000 candidates and loops!</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC MID-SCREEN VISUAL ASSETS (Safe Zone: top: 920px, sides: 65px)
// ═══════════════════════════════════════════════════════════════
const MidScreenVisualAssets: React.FC<{
  frame: number;
  fps: number;
  evAttentionFrame: number;
  evLayersFrame: number;
  evSamplingFrame: number;
  evAhaFrame: number;
}> = ({ frame, fps, evAttentionFrame, evLayersFrame, evSamplingFrame, evAhaFrame }) => {
  const isStage1 = frame < evAttentionFrame;
  const isStage2 = frame >= evAttentionFrame && frame < evLayersFrame;
  const isStage3 = frame >= evLayersFrame && frame < evSamplingFrame;
  const isStage4 = frame >= evSamplingFrame && frame < evAhaFrame;
  const isStage5 = frame >= evAhaFrame;
  const pulse = interpolate(frame % 20, [0, 10, 20], [1.0, 1.05, 1.0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 920,
        left: 65,
        right: 65,
        height: 200,
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        zIndex: 35,
      }}
    >
      {/* ─── STAGE 1: PROMPT (Light Mode) ─── */}
      {isStage1 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "14px 24px", borderRadius: 24, border: "2px solid #C084FC", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 38 }}>⌨️</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#0F172A" }}>User Words</span>
            </div>

            <span style={{ fontSize: 30, color: "#9333EA", fontWeight: 900, transform: `scale(${pulse})` }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "14px 24px", borderRadius: 24, border: "2px solid #C084FC", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 38 }}>🧠</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#9333EA" }}>Transformer Net</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(147, 51, 234, 0.10)", padding: "10px 24px", borderRadius: 20, border: "2px solid rgba(147, 51, 234, 0.35)", color: "#9333EA", fontSize: 18, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Behind Every Prompt is a Massive Neural Net
          </div>
        </>
      )}

      {/* ─── STAGE 2: ATTENTION MATRIX (Dark Mode) ─── */}
      {isStage2 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "14px 24px", borderRadius: 24, border: "2px solid rgba(168, 85, 247, 0.5)", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 38 }}>🔗</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#C084FC" }}>Word Links</span>
            </div>

            <span style={{ fontSize: 30, color: "#A855F7", fontWeight: 900, transform: `scale(${pulse})` }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "14px 24px", borderRadius: 24, border: "2px solid rgba(168, 85, 247, 0.7)", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)", transform: `scale(${pulse})` }}>
              <span style={{ fontSize: 38 }}>💡</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#C084FC" }}>True Meaning</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(168, 85, 247, 0.18)", padding: "10px 24px", borderRadius: 20, border: "2px solid rgba(168, 85, 247, 0.45)", color: "#C084FC", fontSize: 18, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Self-Attention Connects Every Word Together
          </div>
        </>
      )}

      {/* ─── STAGE 3: 96 DEEP LAYERS (Dark Mode) ─── */}
      {isStage3 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "14px 24px", borderRadius: 24, border: "2px solid rgba(56, 189, 248, 0.5)", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 38 }}>🥞</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#38BDF8" }}>96 Layers</span>
            </div>

            <span style={{ fontSize: 30, color: "#38BDF8", fontWeight: 900, transform: `scale(${pulse})` }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "14px 24px", borderRadius: 24, border: "2px solid rgba(56, 189, 248, 0.7)", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 0 30px rgba(56, 189, 248, 0.5)", transform: `scale(${pulse})` }}>
              <span style={{ fontSize: 38 }}>🌐</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#38BDF8" }}>175B Weights</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(56, 189, 248, 0.18)", padding: "10px 24px", borderRadius: 20, border: "2px solid rgba(56, 189, 248, 0.45)", color: "#38BDF8", fontSize: 18, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Pushes Vectors Across 96 Deep Neural Layers
          </div>
        </>
      )}

      {/* ─── STAGE 4: TOKEN SAMPLING (Dark Mode) ─── */}
      {isStage4 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "14px 24px", borderRadius: 24, border: "2px solid rgba(16, 185, 129, 0.5)", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 38 }}>📊</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#10B981" }}>100k Tokens</span>
            </div>

            <span style={{ fontSize: 30, color: "#10B981", fontWeight: 900, transform: `scale(${pulse})` }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "14px 24px", borderRadius: 24, border: "2px solid rgba(16, 185, 129, 0.7)", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)", transform: `scale(${pulse})` }}>
              <span style={{ fontSize: 38 }}>🎯</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#10B981" }}>15ms Winner</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(16, 185, 129, 0.18)", padding: "10px 24px", borderRadius: 20, border: "2px solid rgba(16, 185, 129, 0.45)", color: "#10B981", fontSize: 18, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Samples the Best Token & Loops Autoregressively
          </div>
        </>
      )}

      {/* ─── STAGE 5: PAYOFF ─── */}
      {isStage5 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.18)", padding: "14px 26px", borderRadius: 24, border: "2px solid rgba(239, 68, 68, 0.5)", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 36 }}>❌</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#EF4444" }}>Not Magic</span>
            </div>

            <span style={{ fontSize: 28, color: "#FFD166", fontWeight: 900 }}>VS</span>

            <div style={{ backgroundColor: "rgba(16, 185, 129, 0.22)", padding: "14px 28px", borderRadius: 24, border: "3px solid #10B981", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 0 40px rgba(16, 185, 129, 0.5)", transform: `scale(${pulse})` }}>
              <span style={{ fontSize: 36 }}>⚡</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>Transformer Net!</span>
            </div>
          </div>

          <div style={{ color: "#FFD166", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Self-Attention + 96 Layers = ChatGPT! 🚀
          </div>
        </>
      )}
    </div>
  );
};
