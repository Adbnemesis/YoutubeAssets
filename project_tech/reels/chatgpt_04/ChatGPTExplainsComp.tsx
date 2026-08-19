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
    canvasDark: "#070B12",
    canvasCard: "#0F172A",
    textHeading: "#F8FAFC",
    textMuted: "#94A3B8",
    borderSubtle: "#1E293B",
  },
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// NEMI EXPLAINS REEL #4 — HOW CHATGPT ACTUALLY WORKS (ELI5 EDITION)
// CONSISTENT SLEEK DARK CANVAS + ZERO GLITCH + FRESH BGM
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
  const fMapGlow = getCueFrame("ai01_hook", "map_glow", evHook.start_frame + 100);
  const fTokenChop = getCueFrame("ai02_tokens", "token_chop", evTokens.start_frame + 30);
  const fVectorPop = getCueFrame("ai03_nemi_queen", "vector_equation_pop", evQueen.start_frame + 45);
  const fAttentionBeam = getCueFrame("ai04_attention", "attention_beam", evAttention.start_frame + 55);
  const fContextResolved = getCueFrame("ai04_attention", "context_resolved", evAttention.start_frame + 120);
  const fProbRise = getCueFrame("ai05_softmax", "prob_bars_rise", evSoftmax.start_frame + 35);
  const fWordChosen = getCueFrame("ai05_softmax", "word_chosen", evSoftmax.start_frame + 75);
  const fScorecardSnap = getCueFrame("ai06_payoff", "scorecard_snap", evPayoff.start_frame + 30);

  // ─── Global Cinematic Camera Motion ───
  const cameraScale = interpolate(
    frame,
    [0, 50, 147, 242, 328, 516, 607, 766],
    [1.0, 1.02, 1.01, 1.03, 1.02, 1.04, 1.02, 1.0],
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
    if (frame >= evQueen.start_frame && frame < evQueen.end_frame + 8) {
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
      nemiSpeech = "It's just math, not magic! 😎⚡";
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: nemiTheme.colors.canvasDark,
        overflow: "hidden",
        fontFamily: nemiTheme.typography.fontFamily.sans,
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Voice + Fresh Ducked Melodic Track) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/chatgpt_04/chatgpt_master_audio.mp3")} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SOUND EFFECTS LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={15} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/typing.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={fMapGlow} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={fTokenChop} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/pop.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={evQueen.start_frame} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/pop.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={fAttentionBeam} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/whoosh.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={fContextResolved} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/notification.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={fWordChosen} durationInFrames={35}>
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
              backgroundColor: "#A855F7",
              boxShadow: "0 0 20px #A855F7",
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              color: "#C084FC",
              textTransform: "uppercase",
            }}
          >
            AI Explained Simply
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.90)",
            padding: "12px 24px",
            borderRadius: 24,
            border: "2px solid #1E293B",
            fontSize: 20,
            fontWeight: 900,
            color: "#A855F7",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {frame < evTokens.start_frame && "STEP 1: 3D WORD MAP"}
          {frame >= evTokens.start_frame && frame < evQueen.start_frame && "STEP 2: PUZZLE PIECES"}
          {frame >= evQueen.start_frame && frame < evAttention.start_frame && "STEP 2B: WORD MATH"}
          {frame >= evAttention.start_frame && frame < evSoftmax.start_frame && "STEP 3: CONTEXT DETECTIVE"}
          {frame >= evSoftmax.start_frame && frame < evPayoff.start_frame && "STEP 4: PICK NEXT WORD"}
          {frame >= evPayoff.start_frame && "HOW AI THINKS"}
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
            color: "#F8FAFC",
            letterSpacing: "-1.5px",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          How ChatGPT Works:{" "}
          <span style={{ color: "#A855F7" }}>In Simple Terms</span>
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
        {/* STAGE 1: PROMPT INPUT & 3D MEANING MAP */}
        <StageWrapper frame={frame} startFrame={0} endFrame={evTokens.start_frame + 6}>
          <Beat1SimpleMap
            frame={frame}
            fps={fps}
            fMapGlow={fMapGlow}
          />
        </StageWrapper>

        {/* STAGE 2: NUMBER PUZZLE PIECES */}
        <StageWrapper frame={frame} startFrame={evTokens.start_frame} endFrame={evQueen.start_frame + 6}>
          <Beat2PuzzlePieces
            frame={frame}
            fps={fps}
            startFrame={evTokens.start_frame}
            fTokenChop={fTokenChop}
          />
        </StageWrapper>

        {/* STAGE 3: WORD GEOMETRY FORMULA (KING - MAN + WOMAN = QUEEN) */}
        <StageWrapper frame={frame} startFrame={evQueen.start_frame} endFrame={evAttention.start_frame + 6}>
          <Beat3WordMath
            frame={frame}
            fps={fps}
            startFrame={evQueen.start_frame}
            fVectorPop={fVectorPop}
          />
        </StageWrapper>

        {/* STAGE 4: THE CONTEXT DETECTIVE (SELF-ATTENTION) */}
        <StageWrapper frame={frame} startFrame={evAttention.start_frame} endFrame={evSoftmax.start_frame + 6}>
          <Beat4ContextDetective
            frame={frame}
            fps={fps}
            startFrame={evAttention.start_frame}
            fContextResolved={fContextResolved}
          />
        </StageWrapper>

        {/* STAGE 5: PICKING THE MOST LIKELY NEXT WORD */}
        <StageWrapper frame={frame} startFrame={evSoftmax.start_frame} endFrame={evPayoff.start_frame + 6}>
          <Beat5NextWordPicker
            frame={frame}
            fps={fps}
            startFrame={evSoftmax.start_frame}
            fWordChosen={fWordChosen}
          />
        </StageWrapper>

        {/* STAGE 6: 4-STEP AI SUMMARY SCORECARD */}
        <StageWrapper frame={frame} startFrame={evPayoff.start_frame} endFrame={766}>
          <Beat6SummaryConsole
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
// BEAT 1: PROMPT INPUT & 3D MEANING MAP (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat1SimpleMap: React.FC<{
  frame: number;
  fps: number;
  fMapGlow: number;
}> = ({ frame, fps, fMapGlow }) => {
  const popSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const isGlowing = frame >= fMapGlow;

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 65,
        right: 65,
        height: 550,
        backgroundColor: "#0F172A",
        borderRadius: 32,
        border: `3.5px solid ${isGlowing ? "#A855F7" : "rgba(168, 85, 247, 0.4)"}`,
        boxShadow: isGlowing ? "0 28px 70px rgba(168, 85, 247, 0.35)" : "0 28px 70px rgba(0, 0, 0, 0.6)",
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
          <span style={{ fontSize: 26, fontWeight: 900, color: "#F8FAFC" }}>Your Question to AI</span>
        </div>
        <div style={{ backgroundColor: "#3B0764", color: "#C084FC", fontWeight: 900, fontSize: 19, padding: "8px 18px", borderRadius: 14, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          AI Brain
        </div>
      </div>

      {/* Prompt Chat Bubble */}
      <div style={{ backgroundColor: "#1E293B", borderRadius: 24, border: "2px solid #334155", padding: "24px 28px" }}>
        <div style={{ fontSize: 17, color: "#94A3B8", fontWeight: 700 }}>Human English:</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: "#F8FAFC", marginTop: 6, lineHeight: 1.25 }}>
          "The robot loves pizza on the river bank..."
        </div>
      </div>

      {/* 3D Map Analogy Box */}
      <div
        style={{
          backgroundColor: isGlowing ? "rgba(168, 85, 247, 0.22)" : "#1E293B",
          borderRadius: 24,
          padding: "24px 28px",
          border: isGlowing ? "3.5px solid #A855F7" : "2px solid #334155",
          boxShadow: isGlowing ? "0 0 35px rgba(168, 85, 247, 0.4)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 20, color: isGlowing ? "#C084FC" : "#94A3B8", fontWeight: 800 }}>
            🗺️ Giant 3D Meaning Map
          </span>
          <span style={{ fontSize: 19, color: "#38BDF8", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            SPATIAL MAP
          </span>
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#38BDF8", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 8 }}>
          [ +0.84, -0.19, +0.51, ... +0.94 ]
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        ChatGPT turns your words into <span style={{ color: "#FFD166", fontWeight: 900 }}>points on a 3D map</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 2: NUMBER PUZZLE PIECES (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat2PuzzlePieces: React.FC<{
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
        border: "3.5px solid rgba(168, 85, 247, 0.6)",
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
            🧩 Number Puzzle Pieces
          </span>
        </div>
        <span style={{ fontSize: 19, color: isChopped ? "#10B981" : "#F59E0B", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isChopped ? "4 PIECES READY" : "SLICING SENTENCE..."}
        </span>
      </div>

      {/* 4 Puzzle Pieces Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #8B5CF6", boxShadow: "0 0 25px rgba(139, 92, 246, 0.2)" }}>
          <div style={{ fontSize: 17, color: "#C084FC", fontWeight: 800 }}>Piece #1</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>"The"</div>
          <div style={{ fontSize: 20, color: "#38BDF8", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>Number: 464</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #8B5CF6", boxShadow: "0 0 25px rgba(139, 92, 246, 0.2)" }}>
          <div style={{ fontSize: 17, color: "#C084FC", fontWeight: 800 }}>Piece #2</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>" robot"</div>
          <div style={{ fontSize: 20, color: "#38BDF8", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>Number: 9246</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #8B5CF6", boxShadow: "0 0 25px rgba(139, 92, 246, 0.2)" }}>
          <div style={{ fontSize: 17, color: "#C084FC", fontWeight: 800 }}>Piece #3</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>" loves"</div>
          <div style={{ fontSize: 20, color: "#38BDF8", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>Number: 12845</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #10B981", boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)" }}>
          <div style={{ fontSize: 17, color: "#10B981", fontWeight: 800 }}>Piece #4</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>" pizza"</div>
          <div style={{ fontSize: 20, color: "#10B981", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>Number: 11452</div>
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        AI doesn't read letters — it only understands <span style={{ color: "#38BDF8", fontWeight: 900 }}>Number IDs</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 3: WORD GEOMETRY (KING - MAN + WOMAN = QUEEN)
// ═══════════════════════════════════════════════════════════════
const Beat3WordMath: React.FC<{
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
            Word Math on the 3D Map
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          MATH MATCH: 98%
        </span>
      </div>

      {/* The Famous Word Equation */}
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
        <span style={{ color: "#94A3B8", fontSize: 18 }}>Royalty - Male + Female = Female Royalty</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ✓ PERFECT MATCH
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Words with similar meanings <span style={{ color: "#FFD166", fontWeight: 900 }}>live next to each other</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 4: THE CONTEXT DETECTIVE (SELF-ATTENTION)
// ═══════════════════════════════════════════════════════════════
const Beat4ContextDetective: React.FC<{
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
          <span style={{ fontSize: 32 }}>🕵️</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            The Context Detective (Attention)
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          CLUE: "RIVER"
        </span>
      </div>

      {/* Disambiguation Cards */}
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
            <span style={{ fontSize: 22, fontWeight: 900, color: "#06B6D4", fontFamily: nemiTheme.typography.fontFamily.mono }}>94% SURE</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#F8FAFC", marginTop: 8 }}>River Bank</div>
          <div style={{ fontSize: 17, color: "#94A3B8", marginTop: 4 }}>Because the word "river" was nearby!</div>
        </div>

        {/* Money Bank (Suppressed) */}
        <div style={{ backgroundColor: "#0F172A", padding: "22px", borderRadius: 20, border: "1px solid #1E293B", opacity: isResolved ? 0.45 : 1.0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 34 }}>🏦</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#64748B", fontFamily: nemiTheme.typography.fontFamily.mono }}>6% SURE</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#94A3B8", marginTop: 8 }}>Money Bank</div>
          <div style={{ fontSize: 17, color: "#64748B", marginTop: 4 }}>No money words in prompt</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#03070D", padding: "18px 24px", borderRadius: 18, border: "1px solid rgba(255, 255, 255, 0.12)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#94A3B8", fontSize: 18 }}>Attention scans all nearby words together</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          Context Found! ✓
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Attention acts like a detective to find the <span style={{ color: "#06B6D4", fontWeight: 900 }}>true meaning</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 5: PICKING THE MOST LIKELY NEXT WORD
// ═══════════════════════════════════════════════════════════════
const Beat5NextWordPicker: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fWordChosen: number;
}> = ({ frame, fps, startFrame, fWordChosen }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isChosen = frame >= fWordChosen;

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
          <span style={{ fontSize: 32 }}>🎲</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Picking the Next Word
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SPEED: 15ms
        </span>
      </div>

      {/* Word Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Choice 1: Pizza (84%) */}
        <div
          style={{
            backgroundColor: isChosen ? "rgba(16, 185, 129, 0.25)" : "#0F172A",
            padding: "16px 22px",
            borderRadius: 18,
            border: isChosen ? "3px solid #10B981" : "1px solid #1E293B",
            boxShadow: isChosen ? "0 0 35px rgba(16, 185, 129, 0.4)" : "none",
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
            <span style={{ fontSize: 28, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>84% Likely</span>
            <span style={{ backgroundColor: "#10B981", color: "#FFFFFF", padding: "6px 14px", borderRadius: 10, fontSize: 16, fontWeight: 900 }}>
              WINNER
            </span>
          </div>
        </div>

        {/* Choice 2: Tacos (11%) */}
        <div style={{ backgroundColor: "#0F172A", padding: "16px 22px", borderRadius: 18, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>🌮</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>"tacos"</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>11%</span>
        </div>

        {/* Choice 3: Burgers (5%) */}
        <div style={{ backgroundColor: "#0F172A", padding: "16px 22px", borderRadius: 18, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 32 }}>🍔</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>"burgers"</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>5%</span>
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        ChatGPT picks the next word one by one in <span style={{ color: "#10B981", fontWeight: 900 }}>15 milliseconds</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 6: 4-STEP AI SUMMARY SCORECARD
// ═══════════════════════════════════════════════════════════════
const Beat6SummaryConsole: React.FC<{
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
          ⚡ 4 STEPS BEHIND CHATGPT
        </span>
        <span style={{ fontSize: 20, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          60 WORDS / SEC
        </span>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #8B5CF6" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>01. Number Puzzle Pieces</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Turns sentences into number IDs.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #FFD166" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>02. Giant 3D Meaning Map</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Places similar words next to each other.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #06B6D4" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>03. The Context Detective</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Figures out the exact meaning from surrounding words.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #10B981" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>04. Pick Next Word</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Emits the most likely answer in 15 milliseconds.</div>
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
      {/* ─── STAGE 1: PROMPT TO 3D MAP ─── */}
      {isStage1 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(168, 85, 247, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🔤</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Human Words</span>
            </div>

            <span style={{ fontSize: 32, color: "#A855F7", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(56, 189, 248, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🗺️</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#38BDF8" }}>3D Word Map</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(168, 85, 247, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(168, 85, 247, 0.45)", color: "#C084FC", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Words Turned into Spatial Coordinates
          </div>
        </>
      )}

      {/* ─── STAGE 2: PUZZLE PIECES ─── */}
      {isStage2 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(168, 85, 247, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🧩</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#C084FC" }}>Puzzle Slices</span>
            </div>

            <span style={{ fontSize: 32, color: "#A855F7", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(56, 189, 248, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🔢</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#38BDF8", fontFamily: nemiTheme.typography.fontFamily.mono }}>[464, 9246, ...]</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(168, 85, 247, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(168, 85, 247, 0.45)", color: "#C084FC", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Each Word Gets a Unique Number ID
          </div>
        </>
      )}

      {/* ─── STAGE 3: WORD MATH ─── */}
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
            Word Meanings Connect through Math
          </div>
        </>
      )}

      {/* ─── STAGE 4: CONTEXT DETECTIVE ─── */}
      {isStage4 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(6, 182, 212, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🌊</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#06B6D4" }}>"River" Clue</span>
            </div>

            <span style={{ fontSize: 32, color: "#06B6D4", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.7)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}>
              <span style={{ fontSize: 46 }}>💡</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Water Bank</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(6, 182, 212, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(6, 182, 212, 0.45)", color: "#06B6D4", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Surrounding Words Reveal the Meaning
          </div>
        </>
      )}

      {/* ─── STAGE 5: NEXT WORD ─── */}
      {isStage5 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.55)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🎲</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Most Likely</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.7)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}>
              <span style={{ fontSize: 46 }}>🍕</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>"pizza"</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(16, 185, 129, 0.16)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(16, 185, 129, 0.4)", color: "#10B981", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Predicts Next Word in 15 Milliseconds
          </div>
        </>
      )}

      {/* ─── STAGE 6: CS PAYOFF ─── */}
      {isStage6 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.18)", padding: "16px 28px", borderRadius: 26, border: "2px solid rgba(239, 68, 68, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 40 }}>❌</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#EF4444" }}>Not Magic</span>
            </div>

            <span style={{ fontSize: 30, color: "#FFD166", fontWeight: 900 }}>VS</span>

            <div style={{ backgroundColor: "rgba(16, 185, 129, 0.22)", padding: "16px 30px", borderRadius: 26, border: "3px solid #10B981", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 40px rgba(16, 185, 129, 0.45)" }}>
              <span style={{ fontSize: 40 }}>⚡</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>Just Pure Math!</span>
            </div>
          </div>

          <div style={{ color: "#FFD166", fontSize: 21, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Numbers + 3D Map + Context = AI! 🚀
          </div>
        </>
      )}
    </div>
  );
};
