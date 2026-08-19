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
// NEMI EXPLAINS REEL #4 — HOW CHATGPT WORKS (FAST <22s ELI5)
// SILKY SMOOTH LIGHT -> DARK -> LIGHT COLOR INTERPOLATION
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
  const evAttentionPred = getEvent("ai04_attention_pred");
  const evSmug = getEvent("ai05_nemi_smug");

  // Semantic Cues
  const fTokenChop = getCueFrame("ai02_tokens", "token_chop", evTokens.start_frame + 20);
  const fVectorPop = getCueFrame("ai03_nemi_queen", "vector_pop", evQueen.start_frame + 35);
  const fDetectiveBeam = getCueFrame("ai04_attention_pred", "detective_beam", evAttentionPred.start_frame + 30);
  const fWordChosen = getCueFrame("ai04_attention_pred", "word_chosen", evAttentionPred.start_frame + 80);

  // ─── SILKY SMOOTH LIGHT -> DARK -> LIGHT TRANSITIONS (NO CSS GLITCH) ───
  // darkProgress: 0 = 100% Light Mode, 1 = 100% Dark Mode
  const darkProgress = interpolate(
    frame,
    [evTokens.start_frame - 15, evTokens.start_frame + 5, evSmug.start_frame - 10, evSmug.start_frame + 5],
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

  const textMuted = interpolateColors(
    darkProgress,
    [0, 1],
    ["#64748B", "#94A3B8"]
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
    [0, 50, 113, 231, 313, 451, 510],
    [1.0, 1.02, 1.01, 1.03, 1.02, 1.03, 1.0],
    { extrapolateRight: "clamp" }
  );

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < evTokens.start_frame) {
    nemiPose = "thinking";
  } else if (frame >= evTokens.start_frame && frame < evQueen.start_frame) {
    nemiPose = "puzzled";
  } else if (frame >= evQueen.start_frame && frame < evAttentionPred.start_frame) {
    nemiPose = "aha";
    if (frame >= evQueen.start_frame && frame < evQueen.end_frame + 6) {
      nemiSpeech = "King - Man + Woman = Queen? 👑🤔";
    }
  } else if (frame >= evAttentionPred.start_frame && frame < evSmug.start_frame) {
    nemiPose = "explaining";
  } else {
    nemiPose = "smug";
    if (frame >= evSmug.start_frame) {
      nemiSpeech = "It's just math, not magic! 😎⚡";
    }
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
      {/* MASTER AUDIO (<22s Dual-Voice + Fresh Melodic Tech BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/chatgpt_04/chatgpt_master_audio.mp3")} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SFX LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={10} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/typing.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={fTokenChop} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/pop.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={evQueen.start_frame} durationInFrames={30}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/pop.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={fDetectiveBeam} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/whoosh.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={fWordChosen} durationInFrames={35}>
        <Audio src={staticFile("reels/chatgpt_04/sfx/click.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={evSmug.start_frame} durationInFrames={45}>
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
              backgroundColor: "#A855F7",
              boxShadow: "0 0 20px #A855F7",
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
            AI Explained Simply
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
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          {frame < evTokens.start_frame && "STEP 1: 3D MAP"}
          {frame >= evTokens.start_frame && frame < evQueen.start_frame && "STEP 2: PUZZLE PIECES"}
          {frame >= evQueen.start_frame && frame < evAttentionPred.start_frame && "STEP 2B: WORD MATH"}
          {frame >= evAttentionPred.start_frame && frame < evSmug.start_frame && "STEP 3: CONTEXT & PREDICTION"}
          {frame >= evSmug.start_frame && "HOW AI THINKS"}
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
          <span style={{ color: "#A855F7" }}>In Simple Terms</span>
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
        <StageWrapper frame={frame} startFrame={0} endFrame={evTokens.start_frame + 4}>
          <Beat1LightPrompt frame={frame} fps={fps} />
        </StageWrapper>

        {/* BEAT 2: NUMBER PUZZLE PIECES (Dark Mode) */}
        <StageWrapper frame={frame} startFrame={evTokens.start_frame} endFrame={evQueen.start_frame + 4}>
          <Beat2DarkPuzzle frame={frame} fps={fps} startFrame={evTokens.start_frame} fTokenChop={fTokenChop} />
        </StageWrapper>

        {/* BEAT 3: WORD MATH (Dark Mode) */}
        <StageWrapper frame={frame} startFrame={evQueen.start_frame} endFrame={evAttentionPred.start_frame + 4}>
          <Beat3DarkMath frame={frame} fps={fps} startFrame={evQueen.start_frame} fVectorPop={fVectorPop} />
        </StageWrapper>

        {/* BEAT 4: CONTEXT DETECTIVE & PREDICTION (Dark Mode) */}
        <StageWrapper frame={frame} startFrame={evAttentionPred.start_frame} endFrame={evSmug.start_frame + 4}>
          <Beat4DarkAttentionPred
            frame={frame}
            fps={fps}
            startFrame={evAttentionPred.start_frame}
            fDetectiveBeam={fDetectiveBeam}
            fWordChosen={fWordChosen}
          />
        </StageWrapper>

        {/* BEAT 5: FINAL SUMMARY (Gold/Light Mode Payoff) */}
        <StageWrapper frame={frame} startFrame={evSmug.start_frame} endFrame={510}>
          <Beat5SummaryPayoff frame={frame} fps={fps} startFrame={evSmug.start_frame} />
        </StageWrapper>

        {/* ══════════════════════════════════════════════════════ */}
        {/* MID-SCREEN VISUAL ASSETS (Safe Zone: top: 960px) */}
        {/* ══════════════════════════════════════════════════════ */}
        <MidScreenVisualAssets
          frame={frame}
          fps={fps}
          evTokensFrame={evTokens.start_frame}
          evQueenFrame={evQueen.start_frame}
          evAttentionPredFrame={evAttentionPred.start_frame}
          evSmugFrame={evSmug.start_frame}
          darkProgress={darkProgress}
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
          <span style={{ fontSize: 26, fontWeight: 900, color: "#0F172A" }}>Your Question to AI</span>
        </div>
        <div style={{ backgroundColor: "#F3E8FF", color: "#9333EA", fontWeight: 900, fontSize: 19, padding: "8px 18px", borderRadius: 14, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          AI Input
        </div>
      </div>

      <div style={{ backgroundColor: "#F8FAFC", borderRadius: 24, border: "2px solid #E2E8F0", padding: "26px 28px" }}>
        <div style={{ fontSize: 17, color: "#64748B", fontWeight: 700 }}>Human English:</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", marginTop: 6, lineHeight: 1.25 }}>
          "The robot loves pizza on the river bank..."
        </div>
      </div>

      <div style={{ backgroundColor: "#F5F3FF", borderRadius: 24, padding: "24px 28px", border: "2.5px solid #C084FC" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 20, color: "#9333EA", fontWeight: 800 }}>🗺️ Giant 3D Meaning Map</span>
          <span style={{ fontSize: 19, color: "#0284C7", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>SPATIAL</span>
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#0284C7", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 8 }}>
          [ +0.84, -0.19, +0.51, ... +0.94 ]
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#64748B", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        ChatGPT turns your words into <span style={{ color: "#9333EA", fontWeight: 900 }}>points on a 3D map</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 2: DARK MODE PUZZLE PIECES (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat2DarkPuzzle: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fTokenChop: number;
}> = ({ frame, fps, startFrame, fTokenChop }) => {
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
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
        transform: `scale(${pop})`,
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
          {isChopped ? "4 PIECES READY" : "SLICING..."}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #8B5CF6" }}>
          <div style={{ fontSize: 17, color: "#C084FC", fontWeight: 800 }}>Piece #1</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>"The"</div>
          <div style={{ fontSize: 20, color: "#38BDF8", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>ID: 464</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #8B5CF6" }}>
          <div style={{ fontSize: 17, color: "#C084FC", fontWeight: 800 }}>Piece #2</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>" robot"</div>
          <div style={{ fontSize: 20, color: "#38BDF8", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>ID: 9246</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #8B5CF6" }}>
          <div style={{ fontSize: 17, color: "#C084FC", fontWeight: 800 }}>Piece #3</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>" loves"</div>
          <div style={{ fontSize: 20, color: "#38BDF8", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>ID: 12845</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: 20, border: "2px solid #10B981" }}>
          <div style={{ fontSize: 17, color: "#10B981", fontWeight: 800 }}>Piece #4</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>" pizza"</div>
          <div style={{ fontSize: 20, color: "#10B981", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>ID: 11452</div>
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Words become <span style={{ color: "#38BDF8", fontWeight: 900 }}>Numbers</span> and sit on the 3D Map
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 3: DARK MODE WORD MATH (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat3DarkMath: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fVectorPop: number;
}> = ({ frame, fps, startFrame, fVectorPop }) => {
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
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
        transform: `scale(${pop})`,
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
          MATCH: 98%
        </span>
      </div>

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
          ✓ MATCH!
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Words with similar meanings <span style={{ color: "#FFD166", fontWeight: 900 }}>live next to each other</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 4: DARK MODE CONTEXT DETECTIVE & PREDICTION (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat4DarkAttentionPred: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fDetectiveBeam: number;
  fWordChosen: number;
}> = ({ frame, fps, startFrame, fDetectiveBeam, fWordChosen }) => {
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
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
        border: "3.5px solid #06B6D4",
        boxShadow: "0 28px 70px rgba(6, 182, 212, 0.35)",
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
          <span style={{ fontSize: 32 }}>🕵️</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Detective & Next Word
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          15 MILLISECONDS
        </span>
      </div>

      {/* Top: Detective Context Clue */}
      <div style={{ backgroundColor: "#0F172A", padding: "18px 24px", borderRadius: 20, border: "2px solid #06B6D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🌊</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#F8FAFC" }}>River Bank Clue</div>
            <div style={{ fontSize: 16, color: "#94A3B8" }}>Attention confirms: Water Bank (94%)</div>
          </div>
        </div>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>✓ CONTEXT</span>
      </div>

      {/* Bottom: Next Word Prediction */}
      <div
        style={{
          backgroundColor: isChosen ? "rgba(16, 185, 129, 0.25)" : "#0F172A",
          padding: "20px 24px",
          borderRadius: 20,
          border: isChosen ? "3px solid #10B981" : "1px solid #1E293B",
          boxShadow: isChosen ? "0 0 35px rgba(16, 185, 129, 0.4)" : "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 36 }}>🍕</span>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>"pizza"</div>
            <div style={{ fontSize: 16, color: "#10B981" }}>Picked in 15ms</div>
          </div>
        </div>
        <span style={{ backgroundColor: "#10B981", color: "#FFFFFF", padding: "8px 18px", borderRadius: 12, fontSize: 18, fontWeight: 900 }}>
          84% LIKELY
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Attention scans context $\to$ picks next word in <span style={{ color: "#10B981", fontWeight: 900 }}>15ms</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 5: FINAL SUMMARY (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat5SummaryPayoff: React.FC<{
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
          ⚡ 4 STEPS BEHIND CHATGPT
        </span>
        <span style={{ fontSize: 20, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          AI BRAIN
        </span>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #8B5CF6" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>01. Number Puzzle Pieces</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Turns sentences into number IDs.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #FFD166" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>02. 3D Meaning Map</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>King - Man + Woman = Queen.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #06B6D4" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>03. Context Detective</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Scans surrounding words for meaning.</div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 22px", borderRadius: 16, borderLeft: "7px solid #10B981" }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>04. Next Word in 15ms</div>
        <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 2 }}>Emits the best answer instantly.</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MID-SCREEN CLEAN FLOATING ICONS (Safe Zone: top: 960px, sides: 65px)
// ═══════════════════════════════════════════════════════════════
const MidScreenVisualAssets: React.FC<{
  frame: number;
  fps: number;
  evTokensFrame: number;
  evQueenFrame: number;
  evAttentionPredFrame: number;
  evSmugFrame: number;
  darkProgress: number;
}> = ({ frame, fps, evTokensFrame, evQueenFrame, evAttentionPredFrame, evSmugFrame, darkProgress }) => {
  const isStage1 = frame < evTokensFrame;
  const isStage2 = frame >= evTokensFrame && frame < evQueenFrame;
  const isStage3 = frame >= evQueenFrame && frame < evAttentionPredFrame;
  const isStage4 = frame >= evAttentionPredFrame && frame < evSmugFrame;
  const isStage5 = frame >= evSmugFrame;

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
      {/* ─── STAGE 1: PROMPT TO 3D MAP (Light Mode) ─── */}
      {isStage1 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, border: "2px solid #C084FC", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 46 }}>🔤</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>Human Words</span>
            </div>

            <span style={{ fontSize: 32, color: "#9333EA", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, border: "2px solid #38BDF8", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 46 }}>🗺️</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#0284C7" }}>3D Word Map</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(147, 51, 234, 0.10)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(147, 51, 234, 0.35)", color: "#9333EA", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Words Turned into Spatial Coordinates
          </div>
        </>
      )}

      {/* ─── STAGE 2: PUZZLE PIECES (Dark Mode) ─── */}
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

      {/* ─── STAGE 3: WORD MATH (Dark Mode) ─── */}
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

      {/* ─── STAGE 4: DETECTIVE & PREDICTION (Dark Mode) ─── */}
      {isStage4 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(6, 182, 212, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🌊</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#06B6D4" }}>"River" Clue</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.7)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}>
              <span style={{ fontSize: 46 }}>🍕</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>"pizza"</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(6, 182, 212, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(6, 182, 212, 0.45)", color: "#06B6D4", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Attention Scans Context $\to$ Emits Next Word
          </div>
        </>
      )}

      {/* ─── STAGE 5: SUMMARY PAYOFF (Gold / Clean Mode) ─── */}
      {isStage5 && (
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
