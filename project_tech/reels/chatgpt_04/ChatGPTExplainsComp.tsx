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
import cuesData from "../../src/data/chatgpt_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandPurple: "#8B5CF6",
    brandGreen: "#10B981",
    canvasLight: "#FAF8F5",
    textHeading: "#18181B",
    textMuted: "#64748B",
    borderSubtle: "#E2E8F0",
  },
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// NEMI EXPLAINS REEL #4 — HOW CHATGPT ACTUALLY PREDICTS WORDS
// SAFE-ZONE PADDED EDITION (4-EDGE SAFE MARGINS + ON-TOP SUBTITLES)
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
  const evTokens = getEvent("ai02_tokens");
  const evQueen = getEvent("ai03_nemi_queen");
  const evAttention = getEvent("ai04_attention");
  const evSoftmax = getEvent("ai05_softmax");
  const evPayoff = getEvent("ai06_payoff");
  const evSmug = getEvent("ai07_nemi_smug");

  // Semantic Cue Frames
  const fPromptEnter = getCueFrame("ai01_hook", "prompt_enter", evHook.start_frame + 45);
  const fCoordsGlow = getCueFrame("ai01_hook", "coords_glow", evHook.start_frame + 113);
  const fTokenChop = getCueFrame("ai02_tokens", "token_chop", evTokens.start_frame + 32);
  const fVectorPop = getCueFrame("ai03_nemi_queen", "vector_equation_pop", evQueen.start_frame + 48);
  const fAttentionSweep = getCueFrame("ai04_attention", "attention_matrix_sweep", evAttention.start_frame + 47);
  const fContextResolved = getCueFrame("ai04_attention", "context_resolved", evAttention.start_frame + 118);
  const fSoftmaxRise = getCueFrame("ai05_softmax", "softmax_bars_rise", evSoftmax.start_frame + 41);
  const fTokenSelected = getCueFrame("ai05_softmax", "token_selected", evSoftmax.start_frame + 94);
  const fScorecardSnap = getCueFrame("ai06_payoff", "master_scorecard_snap", evPayoff.start_frame + 44);

  // ─── Continuous Background Dark Mode Interpolation ───
  const darkFade = interpolate(
    frame,
    [evTokens.start_frame - 10, evTokens.start_frame + 10, evPayoff.start_frame - 10, evPayoff.start_frame + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ─── Global Cinematic Camera Motion ───
  const cameraScale = interpolate(
    frame,
    [0, 50, 156, 252, 339, 502, 625, 801],
    [1.0, 1.02, 1.01, 1.04, 1.02, 1.05, 1.02, 1.0],
    { extrapolateRight: "clamp" }
  );

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < evTokens.start_frame) {
    nemiPose = "thinking";
  } else if (frame >= evTokens.start_frame && frame < evQueen.start_frame) {
    nemiPose = "puzzled";
  } else if (frame >= evQueen.start_frame && frame < evAttention.start_frame) {
    nemiPose = "aha";
    if (frame >= evQueen.start_frame && frame < evQueen.end_frame + 10) {
      nemiSpeech = "King - Man + Woman = Queen? 👑🤔";
    }
  } else if (frame >= evAttention.start_frame && frame < evSoftmax.start_frame) {
    nemiPose = "explaining";
  } else if (frame >= evSoftmax.start_frame && frame < evPayoff.start_frame) {
    nemiPose = "shocked";
  } else if (frame >= evPayoff.start_frame && frame < evSmug.start_frame) {
    nemiPose = "pointing";
  } else {
    nemiPose = "smug";
    if (frame >= evSmug.start_frame) {
      nemiSpeech = "Just pure vector geometry! 😎⚡";
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: darkFade > 0.5 ? "#070B12" : nemiTheme.colors.canvasLight,
        overflow: "hidden",
        fontFamily: nemiTheme.typography.fontFamily.sans,
        transition: "background-color 0.4s ease",
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Voice + Ducked Synthwave BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/chatgpt_04/chatgpt_master_audio.mp3")} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SOUND EFFECTS LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={15} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/typing.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={fCoordsGlow} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={fTokenChop} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/pop.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={evQueen.start_frame} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/pop.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={fAttentionSweep} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/whoosh.mp3")} volume={0.55} />
      </Sequence>
      <Sequence from={fContextResolved} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/notification.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={fTokenSelected} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/click.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={fScorecardSnap} durationInFrames={50}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/chime.mp3")} volume={0.85} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PERSISTENT HEADER HUD (Safe Zone: top: 85px, sides: 70px) */}
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
              backgroundColor: darkFade > 0.5 ? "#A855F7" : "#7C3AED",
              boxShadow: darkFade > 0.5 ? "0 0 20px #A855F7" : "none",
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              color: darkFade > 0.5 ? "#C084FC" : "#6B21A8",
              textTransform: "uppercase",
            }}
          >
            AI Architecture
          </span>
        </div>

        <div
          style={{
            backgroundColor: darkFade > 0.5 ? "rgba(15, 23, 42, 0.90)" : "#FFFFFF",
            padding: "12px 24px",
            borderRadius: 24,
            border: darkFade > 0.5 ? "2px solid #1E293B" : `2px solid ${nemiTheme.colors.borderSubtle}`,
            fontSize: 20,
            fontWeight: 900,
            color: darkFade > 0.5 ? "#A855F7" : "#7C3AED",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          {frame < evTokens.start_frame && "STAGE 1/4: VECTOR SPACE"}
          {frame >= evTokens.start_frame && frame < evQueen.start_frame && "STAGE 2/4: BPE TOKENIZER"}
          {frame >= evQueen.start_frame && frame < evAttention.start_frame && "STAGE 2B: EMBEDDING MATH"}
          {frame >= evAttention.start_frame && frame < evSoftmax.start_frame && "STAGE 3/4: SELF-ATTENTION"}
          {frame >= evSoftmax.start_frame && frame < evPayoff.start_frame && "STAGE 4/4: SOFTMAX SAMPLING"}
          {frame >= evPayoff.start_frame && "AI CORE: TRANSFORMER"}
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
            color: darkFade > 0.5 ? "#F8FAFC" : nemiTheme.colors.textHeading,
            letterSpacing: "-1.5px",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          How ChatGPT Predicts Words:{" "}
          <span style={{ color: "#8B5CF6" }}>Vectors & Attention</span>
        </h1>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MULTI-STAGE STAGE MANAGER (Top Cards) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* STAGE 1: PROMPT INPUT & 12,288D VECTOR SPACE */}
        <StageWrapper frame={frame} startFrame={0} endFrame={evTokens.start_frame + 6}>
          <Beat1VectorSpace
            frame={frame}
            fps={fps}
            fCoordsGlow={fCoordsGlow}
          />
        </StageWrapper>

        {/* STAGE 2: BYTE-PAIR TOKENIZER ENGINE */}
        <StageWrapper frame={frame} startFrame={evTokens.start_frame} endFrame={evQueen.start_frame + 6}>
          <Beat2TokenizerEngine
            frame={frame}
            fps={fps}
            startFrame={evTokens.start_frame}
            fTokenChop={fTokenChop}
          />
        </StageWrapper>

        {/* STAGE 3: VECTOR ARITHMETIC (KING - MAN + WOMAN = QUEEN) */}
        <StageWrapper frame={frame} startFrame={evQueen.start_frame} endFrame={evAttention.start_frame + 6}>
          <Beat3VectorArithmetic
            frame={frame}
            fps={fps}
            startFrame={evQueen.start_frame}
            fVectorPop={fVectorPop}
          />
        </StageWrapper>

        {/* STAGE 4: MULTI-HEAD SELF-ATTENTION (CONTEXT DISAMBIGUATION) */}
        <StageWrapper frame={frame} startFrame={evAttention.start_frame} endFrame={evSoftmax.start_frame + 6}>
          <Beat4SelfAttention
            frame={frame}
            fps={fps}
            startFrame={evAttention.start_frame}
            fContextResolved={fContextResolved}
          />
        </StageWrapper>

        {/* STAGE 5: SOFTMAX NEXT-TOKEN PROBABILITY DISTRIBUTION */}
        <StageWrapper frame={frame} startFrame={evSoftmax.start_frame} endFrame={evPayoff.start_frame + 6}>
          <Beat5SoftmaxPrediction
            frame={frame}
            fps={fps}
            startFrame={evSoftmax.start_frame}
            fTokenSelected={fTokenSelected}
          />
        </StageWrapper>

        {/* STAGE 6: 4-PILLAR AI SCORECARD */}
        <StageWrapper frame={frame} startFrame={evPayoff.start_frame} endFrame={801}>
          <Beat6ScorecardConsole
            frame={frame}
            fps={fps}
            startFrame={evPayoff.start_frame}
          />
        </StageWrapper>

        {/* ══════════════════════════════════════════════════════ */}
        {/* MID-SCREEN CLEAN FLOATING ICONS & STAGE TAGS */}
        {/* ══════════════════════════════════════════════════════ */}
        <MidScreenVisualAssets
          frame={frame}
          fps={fps}
          evTokensFrame={evTokens.start_frame}
          evQueenFrame={evQueen.start_frame}
          evAttentionFrame={evAttention.start_frame}
          evSoftmaxFrame={evSoftmax.start_frame}
          evPayoffFrame={evPayoff.start_frame}
        />
      </div>

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
      {/* NEMI SPEECH BUBBLE / SUBTITLE (Always on Top of Nemi) */}
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
          {/* Downward Pointer Tail */}
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
// SILKY SMOOTH STAGE WRAPPER COMPONENT
// ═══════════════════════════════════════════════════════════════
const StageWrapper: React.FC<{
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  endFrame: number;
}> = ({ children, frame, startFrame, endFrame }) => {
  if (frame < startFrame - 10 || frame > endFrame + 10) {
    return null;
  }

  const enterOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterY = interpolate(frame, [startFrame, startFrame + 10], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = interpolate(frame, [endFrame - 8, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(frame, [endFrame - 8, endFrame], [0, -30], {
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
// BEAT 1: PROMPT INPUT & 12,288D VECTOR SPACE (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat1VectorSpace: React.FC<{
  frame: number;
  fps: number;
  fCoordsGlow: number;
}> = ({ frame, fps, fCoordsGlow }) => {
  const popSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const isGlowing = frame >= fCoordsGlow;

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
        border: `3.5px solid ${isGlowing ? "#8B5CF6" : nemiTheme.colors.borderSubtle}`,
        boxShadow: isGlowing ? "0 28px 70px rgba(139, 92, 246, 0.35)" : "0 28px 70px rgba(0, 0, 0, 0.1)",
        padding: "34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>💬</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#18181B" }}>User Prompt Interface</span>
        </div>
        <div style={{ backgroundColor: "#F3E8FF", color: "#7C3AED", fontWeight: 900, fontSize: 19, padding: "8px 18px", borderRadius: 14, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          GPT-4o Embedding Engine
        </div>
      </div>

      {/* Prompt Chat Bubble */}
      <div style={{ backgroundColor: "#F8FAFC", borderRadius: 24, border: "2.5px solid #E2E8F0", padding: "24px 28px" }}>
        <div style={{ fontSize: 17, color: "#64748B", fontWeight: 700 }}>Input Text</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", marginTop: 6, lineHeight: 1.25 }}>
          "The robot loves pizza on the river bank..."
        </div>
      </div>

      {/* 12,288 Dimension Coordinates Vector */}
      <div
        style={{
          backgroundColor: isGlowing ? "#0F172A" : "#F1F5F9",
          borderRadius: 24,
          padding: "24px 28px",
          border: isGlowing ? "3.5px solid #8B5CF6" : "2px solid #CBD5E1",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 18, color: isGlowing ? "#C084FC" : "#64748B", fontWeight: 800 }}>
            Embedding Tensor (Hidden Space)
          </span>
          <span style={{ fontSize: 19, color: isGlowing ? "#38BDF8" : "#64748B", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            d_model = 12,288 DIMENSIONS
          </span>
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: isGlowing ? "#38BDF8" : "#1E293B", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 8 }}>
          [ +0.8421, -0.1938, +0.5120, ... +0.9415 ]
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono, color: "#64748B" }}>
        <span>Words mapped to spatial geometry</span>
        <span style={{ color: "#8B5CF6", fontWeight: 800 }}>Lookup: O(1) Matrix Map</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 2: BYTE-PAIR TOKENIZER ENGINE (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat2TokenizerEngine: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fTokenChop: number;
}> = ({ frame, fps, startFrame, fTokenChop }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isChopped = frame >= fTokenChop;

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
        border: "3.5px solid rgba(139, 92, 246, 0.6)",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.6)",
        padding: "30px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#A855F7", boxShadow: "0 0 18px #A855F7" }} />
          <span style={{ fontSize: 26, fontWeight: 900, color: "#A855F7", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            ✂️ Byte-Pair Tokenizer (tiktoken)
          </span>
        </div>
        <span style={{ fontSize: 19, color: isChopped ? "#10B981" : "#F59E0B", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isChopped ? "4 TOKENS GENERATED" : "CHOPPING STRING..."}
        </span>
      </div>

      {/* Token Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #8B5CF6", boxShadow: "0 0 25px rgba(139, 92, 246, 0.2)" }}>
          <div style={{ fontSize: 17, color: "#C084FC", fontWeight: 800 }}>Token #1</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>"The"</div>
          <div style={{ fontSize: 20, color: "#38BDF8", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>ID: 464</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #8B5CF6", boxShadow: "0 0 25px rgba(139, 92, 246, 0.2)" }}>
          <div style={{ fontSize: 17, color: "#C084FC", fontWeight: 800 }}>Token #2</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>" robot"</div>
          <div style={{ fontSize: 20, color: "#38BDF8", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>ID: 9246</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #8B5CF6", boxShadow: "0 0 25px rgba(139, 92, 246, 0.2)" }}>
          <div style={{ fontSize: 17, color: "#C084FC", fontWeight: 800 }}>Token #3</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>" loves"</div>
          <div style={{ fontSize: 20, color: "#38BDF8", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>ID: 12845</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #10B981", boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)" }}>
          <div style={{ fontSize: 17, color: "#10B981", fontWeight: 800 }}>Token #4 (Target)</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>" pizza"</div>
          <div style={{ fontSize: 20, color: "#10B981", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>ID: 11452</div>
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Vocabulary Size: <span style={{ color: "#38BDF8", fontWeight: 900 }}>100,277 Token IDs</span> (cl100k_base)
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 3: VECTOR ARITHMETIC (KING - MAN + WOMAN = QUEEN)
// ═══════════════════════════════════════════════════════════════
const Beat3VectorArithmetic: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fVectorPop: number;
}> = ({ frame, fps, startFrame, fVectorPop }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isPopped = frame >= fVectorPop;

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
        border: "3.5px solid #FFD166",
        boxShadow: "0 28px 70px rgba(255, 209, 102, 0.35)",
        padding: "30px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 32 }}>📐</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#FFD166", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Vector Arithmetic in Latent Space
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          COSINE SIMILARITY: 0.98
        </span>
      </div>

      {/* Glowing Vector Formula Container */}
      <div
        style={{
          backgroundColor: "#0F172A",
          borderRadius: 24,
          padding: "26px",
          border: "2.5px solid rgba(255, 209, 102, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44 }}>👑</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>King</div>
        </div>

        <span style={{ fontSize: 36, fontWeight: 900, color: "#EF4444" }}>-</span>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44 }}>👨</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>Man</div>
        </div>

        <span style={{ fontSize: 36, fontWeight: 900, color: "#10B981" }}>+</span>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44 }}>👩</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>Woman</div>
        </div>

        <span style={{ fontSize: 36, fontWeight: 900, color: "#FFD166" }}>=</span>

        <div
          style={{
            textAlign: "center",
            backgroundColor: isPopped ? "rgba(16, 185, 129, 0.25)" : "transparent",
            padding: "10px 20px",
            borderRadius: 18,
            border: isPopped ? "3px solid #10B981" : "none",
            boxShadow: isPopped ? "0 0 35px rgba(16, 185, 129, 0.5)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ fontSize: 44 }}>👸</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: isPopped ? "#10B981" : "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Queen
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#0F172A", padding: "18px 24px", borderRadius: 18, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#94A3B8", fontSize: 18 }}>Vector Direction: [Gender Component Transferred]</span>
        <span style={{ color: "#38BDF8", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          Δ = +0.724 θ
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Words with similar meanings cluster together in <span style={{ color: "#FFD166", fontWeight: 900 }}>Vector Space</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 4: MULTI-HEAD SELF-ATTENTION (CONTEXT DISAMBIGUATION)
// ═══════════════════════════════════════════════════════════════
const Beat4SelfAttention: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fContextResolved: number;
}> = ({ frame, fps, startFrame, fContextResolved }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isResolved = frame >= fContextResolved;

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
        border: "3.5px solid #06B6D4",
        boxShadow: "0 28px 70px rgba(6, 182, 212, 0.35)",
        padding: "30px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#06B6D4", boxShadow: "0 0 18px #06B6D4" }} />
          <span style={{ fontSize: 26, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            🧠 Multi-Head Self-Attention Matrix
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          Q × K^T / √d_k
        </span>
      </div>

      {/* Disambiguation Comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* River Bank (Active Match) */}
        <div
          style={{
            backgroundColor: isResolved ? "rgba(6, 182, 212, 0.22)" : "#0F172A",
            padding: "22px",
            borderRadius: 20,
            border: isResolved ? "3px solid #06B6D4" : "1px solid #1E293B",
            boxShadow: isResolved ? "0 0 35px rgba(6, 182, 212, 0.4)" : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 34 }}>🌊</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#06B6D4", fontFamily: nemiTheme.typography.fontFamily.mono }}>94% WEIGHT</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#F8FAFC", marginTop: 8 }}>River Bank</div>
          <div style={{ fontSize: 17, color: "#94A3B8", marginTop: 4 }}>Attention linked to "river" context</div>
        </div>

        {/* Money Bank (Suppressed) */}
        <div style={{ backgroundColor: "#0F172A", padding: "22px", borderRadius: 20, border: "1px solid #1E293B", opacity: isResolved ? 0.45 : 1.0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 34 }}>🏦</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#64748B", fontFamily: nemiTheme.typography.fontFamily.mono }}>6% WEIGHT</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#94A3B8", marginTop: 8 }}>Money Bank</div>
          <div style={{ fontSize: 17, color: "#64748B", marginTop: 4 }}>No financial tokens in prompt</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#03070D", padding: "18px 24px", borderRadius: 18, border: "1px solid rgba(255, 255, 255, 0.12)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#94A3B8", fontSize: 18 }}>Attention Heads: 96 Parallel Heads</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          Context Weight: 0.9412 ✓
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Attention mechanism computes how much each word relates to all other words
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 5: SOFTMAX NEXT-TOKEN PROBABILITY DISTRIBUTION
// ═══════════════════════════════════════════════════════════════
const Beat5SoftmaxPrediction: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fTokenSelected: number;
}> = ({ frame, fps, startFrame, fTokenSelected }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isSelected = frame >= fTokenSelected;

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
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#10B981", boxShadow: "0 0 18px #10B981" }} />
          <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            🎯 Softmax Probability Sampling
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          INFERENCE: 14.8ms
        </span>
      </div>

      {/* Probability Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Candidate 1: Pizza (84.2% - Winner) */}
        <div
          style={{
            backgroundColor: isSelected ? "rgba(16, 185, 129, 0.25)" : "#0F172A",
            padding: "16px 22px",
            borderRadius: 18,
            border: isSelected ? "3px solid #10B981" : "1px solid #1E293B",
            boxShadow: isSelected ? "0 0 35px rgba(16, 185, 129, 0.4)" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>🍕</span>
            <span style={{ fontSize: 28, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>"pizza"</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>84.2%</span>
            <span style={{ backgroundColor: "#10B981", color: "#FFFFFF", padding: "6px 14px", borderRadius: 10, fontSize: 16, fontWeight: 900 }}>
              SELECTED
            </span>
          </div>
        </div>

        {/* Candidate 2: Tacos (11.1%) */}
        <div style={{ backgroundColor: "#0F172A", padding: "16px 22px", borderRadius: 18, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>🌮</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>"tacos"</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>11.1%</span>
        </div>

        {/* Candidate 3: Burgers (4.7%) */}
        <div style={{ backgroundColor: "#0F172A", padding: "16px 22px", borderRadius: 18, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>🍔</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>"burgers"</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>4.7%</span>
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Softmax converts raw logits into a clean probability distribution that sums to <span style={{ color: "#10B981", fontWeight: 900 }}>1.00</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 6: 4-PILLAR AI ARCHITECTURE TAKEAWAY & SCORECARD
// ═══════════════════════════════════════════════════════════════
const Beat6ScorecardConsole: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });

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
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: nemiTheme.colors.brandYellow, letterSpacing: "1.5px" }}>
          ⚡ 4 TRANSFORMER PILLARS
        </span>
        <span style={{ fontSize: 20, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          LATENCY: 15ms / TOKEN
        </span>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #8B5CF6" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>01. Tokenization</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Chops text into numeric token IDs from 100k vocabulary.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #FFD166" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>02. Vector Embeddings</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Maps tokens into 12,288-dimensional spatial coordinates.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #06B6D4" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>03. Self-Attention</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Computes contextual relationships across all words in parallel.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #10B981" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>04. Softmax Sampling</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Calculates probabilities and emits the next word in 15ms.</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MID-SCREEN CLEAN FLOATING ICONS & STAGE TAGS (Safe Zone: top: 960px, sides: 65px)
// ═══════════════════════════════════════════════════════════════
const MidScreenVisualAssets: React.FC<{
  frame: number;
  fps: number;
  evTokensFrame: number;
  evQueenFrame: number;
  evAttentionFrame: number;
  evSoftmaxFrame: number;
  evPayoffFrame: number;
}> = ({ frame, fps, evTokensFrame, evQueenFrame, evAttentionFrame, evSoftmaxFrame, evPayoffFrame }) => {
  const isStage1 = frame < evTokensFrame;
  const isStage2 = frame >= evTokensFrame && frame < evQueenFrame;
  const isStage3 = frame >= evQueenFrame && frame < evAttentionFrame;
  const isStage4 = frame >= evAttentionFrame && frame < evSoftmaxFrame;
  const isStage5 = frame >= evSoftmaxFrame && frame < evPayoffFrame;
  const isStage6 = frame >= evPayoffFrame;

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
      {/* ─── STAGE 1: PROMPT TO VECTORS ─── */}
      {isStage1 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 30px rgba(0,0,0,0.09)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🔤</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#1E293B" }}>Text Words</span>
            </div>

            <span style={{ fontSize: 32, color: "#8B5CF6", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 30px rgba(0,0,0,0.09)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>📐</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#8B5CF6" }}>12,288-D Tensor</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 30px rgba(0,0,0,0.09)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🧠</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Transformer</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(139, 92, 246, 0.15)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(139, 92, 246, 0.4)", color: "#8B5CF6", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            High-Dimensional Coordinate Projection
          </div>
        </>
      )}

      {/* ─── STAGE 2: BPE TOKENIZER ─── */}
      {isStage2 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(139, 92, 246, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>✂️</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#C084FC" }}>Byte-Pair Encoding</span>
            </div>

            <span style={{ fontSize: 32, color: "#A855F7", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(56, 189, 248, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🔢</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#38BDF8", fontFamily: nemiTheme.typography.fontFamily.mono }}>[464, 9246, ...]</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(168, 85, 247, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(168, 85, 247, 0.45)", color: "#C084FC", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Compression Ratio: 4.2 Characters / Token
          </div>
        </>
      )}

      {/* ─── STAGE 3: VECTOR MATH ─── */}
      {isStage3 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(255, 209, 102, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>👑</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#FFD166" }}>King</span>
            </div>

            <span style={{ fontSize: 32, color: "#FFD166", fontWeight: 900 }}>- 👨 + 👩 ➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.7)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}>
              <span style={{ fontSize: 46 }}>👸</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Queen</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(255, 209, 102, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(255, 209, 102, 0.45)", color: "#FFD166", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Semantic Linear Algebra in Latent Space
          </div>
        </>
      )}

      {/* ─── STAGE 4: SELF-ATTENTION MATRIX ─── */}
      {isStage4 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(6, 182, 212, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🔍</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#06B6D4" }}>Query (Q)</span>
            </div>

            <span style={{ fontSize: 32, color: "#06B6D4", fontWeight: 900 }}>×</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(6, 182, 212, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🔑</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#06B6D4" }}>Key (K)</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>💡</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Context (V)</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(6, 182, 212, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(6, 182, 212, 0.45)", color: "#06B6D4", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            96 Heads • Scaled Dot-Product Attention
          </div>
        </>
      )}

      {/* ─── STAGE 5: SOFTMAX PREDICTION ─── */}
      {isStage5 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.55)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>📊</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Logits Tensor</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.7)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}>
              <span style={{ fontSize: 46 }}>⚡</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>Token: "pizza"</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(16, 185, 129, 0.16)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(16, 185, 129, 0.4)", color: "#10B981", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Greedy / Top-P Sampling at 60 Tokens/sec
          </div>
        </>
      )}

      {/* ─── STAGE 6: CS PAYOFF ─── */}
      {isStage6 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.18)", padding: "16px 28px", borderRadius: 26, border: "2px solid rgba(239, 68, 68, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 40 }}>❌</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#EF4444" }}>Not "Thinking"</span>
            </div>

            <span style={{ fontSize: 30, color: "#FFD166", fontWeight: 900 }}>VS</span>

            <div style={{ backgroundColor: "rgba(16, 185, 129, 0.22)", padding: "16px 30px", borderRadius: 26, border: "3px solid #10B981", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 40px rgba(16, 185, 129, 0.45)" }}>
              <span style={{ fontSize: 40 }}>📐</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>Vector Geometry!</span>
            </div>
          </div>

          <div style={{ color: "#FFD166", fontSize: 21, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Pure Linear Algebra & Matrix Math! 🚀
          </div>
        </>
      )}
    </div>
  );
};
