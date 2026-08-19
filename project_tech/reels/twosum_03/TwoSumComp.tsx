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
import cuesData from "../../src/data/twosum_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandGreen: "#10B981",
    brandRed: "#EF4444",
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
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
// NEMI EXPLAINS REEL #3 — TWO SUM (LEETCODE #1)
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

export const TwoSumComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Timeline Events Derived from Speaker Pipeline ───
  const evHook = getEvent("ts01_hook");
  const evBrute = getEvent("ts02_brute");
  const evQuestion = getEvent("ts03_nemi_question");
  const evFormula = getEvent("ts04_formula");
  const evResolution = getEvent("ts05_resolution");
  const evPayoff = getEvent("ts06_payoff");
  const evSmug = getEvent("ts07_nemi_smug");

  // Semantic Audio Cues
  const fArrayEnter = getCueFrame("ts01_hook", "array_enter", 35);
  const fTargetGlow = getCueFrame("ts01_hook", "target_glow", 75);
  const fBruteScan = getCueFrame("ts02_brute", "brute_scan_start", 171);
  const fN2Alarm = getCueFrame("ts02_brute", "n_squared_alarm", 222);
  const fHashMapSpawn = getCueFrame("ts04_formula", "hash_map_spawn", 341);
  const fFormulaIlluminate = getCueFrame("ts04_formula", "formula_illuminate", 395);
  const fMapInsertTwo = getCueFrame("ts05_resolution", "map_insert_two", 469);
  const fCalcSeven = getCueFrame("ts05_resolution", "calc_seven_two", 523);
  const fInstantMatch = getCueFrame("ts05_resolution", "instant_collision_match", 561);
  const fLinearPayoff = getCueFrame("ts06_payoff", "linear_payoff_glow", 636);

  // ─── Smooth Background Theme Interpolation ───
  const darkFade = interpolate(
    frame,
    [evBrute.start_frame - 10, evBrute.start_frame + 10, evPayoff.start_frame - 10, evPayoff.start_frame + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ─── Global Cinematic Camera Motion ───
  const cameraScale = interpolate(
    frame,
    [0, 35, 106, 256, 306, 430, 561, 591, 734],
    [1.0, 1.02, 1.04, 1.01, 1.03, 1.04, 1.06, 1.02, 1.0],
    { extrapolateRight: "clamp" }
  );

  // ─── Nemi Dynamic Emotional Arc & Speech ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < evBrute.start_frame) {
    nemiPose = "thinking";
  } else if (frame >= evBrute.start_frame && frame < evQuestion.start_frame) {
    nemiPose = "shocked";
  } else if (frame >= evQuestion.start_frame && frame < evFormula.start_frame) {
    nemiPose = "puzzled";
    nemiSpeech = "Can we do it in one pass? 🤔";
  } else if (frame >= evFormula.start_frame && frame < evResolution.start_frame) {
    nemiPose = "explaining";
  } else if (frame >= evResolution.start_frame && frame < fInstantMatch) {
    nemiPose = "pointing";
  } else if (frame >= fInstantMatch && frame < evPayoff.start_frame) {
    nemiPose = "aha";
  } else {
    nemiPose = "smug";
    if (frame >= evSmug.start_frame) {
      nemiSpeech = "One pass, instant hire! 😎⚡";
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: darkFade > 0.5 ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight,
        overflow: "hidden",
        fontFamily: nemiTheme.typography.fontFamily.sans,
        transition: "background-color 0.4s ease",
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Dual Voice + Ducked Synthwave BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/twosum_03/twosum_master_audio.mp3")} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SFX LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={fArrayEnter} durationInFrames={30}>
        <Audio src={staticFile("reels/twosum_03/sfx/whoosh.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={fTargetGlow} durationInFrames={30}>
        <Audio src={staticFile("reels/twosum_03/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={fN2Alarm} durationInFrames={35}>
        <Audio src={staticFile("reels/twosum_03/sfx/error.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={evQuestion.start_frame} durationInFrames={30}>
        <Audio src={staticFile("reels/twosum_03/sfx/pop.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={fHashMapSpawn} durationInFrames={35}>
        <Audio src={staticFile("reels/twosum_03/sfx/whoosh.mp3")} volume={0.55} />
      </Sequence>
      <Sequence from={fMapInsertTwo} durationInFrames={30}>
        <Audio src={staticFile("reels/twosum_03/sfx/click.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={fInstantMatch} durationInFrames={40}>
        <Audio src={staticFile("reels/twosum_03/sfx/notification.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={fLinearPayoff} durationInFrames={60}>
        <Audio src={staticFile("reels/twosum_03/sfx/chime.mp3")} volume={0.85} />
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
              backgroundColor: darkFade > 0.5 ? "#38BDF8" : "#2563EB",
              boxShadow: darkFade > 0.5 ? "0 0 20px #38BDF8" : "none",
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              color: darkFade > 0.5 ? "#94A3B8" : nemiTheme.colors.textMuted,
              textTransform: "uppercase",
            }}
          >
            LeetCode #1 • FAANG Top 100
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
            color: darkFade > 0.5 ? "#38BDF8" : nemiTheme.colors.brandCyan,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          {frame < evBrute.start_frame && "SETUP: ARRAY & TARGET"}
          {frame >= evBrute.start_frame && frame < evFormula.start_frame && "TRAP: O(N²) BRUTE FORCE"}
          {frame >= evFormula.start_frame && frame < evResolution.start_frame && "LOGIC: COMPLEMENT FORMULA"}
          {frame >= evResolution.start_frame && frame < fInstantMatch && "STEP: HASH MAP INSERTION"}
          {frame >= fInstantMatch && frame < evPayoff.start_frame && "MATCH: O(1) COLLISION"}
          {frame >= evPayoff.start_frame && "COMPLETE: O(N) 1-PASS"}
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
          How to Solve{" "}
          <span style={{ color: nemiTheme.colors.brandCyan }}>Two Sum</span> in{" "}
          <span style={{ color: "#10B981" }}>O(N)</span> Time!
        </h1>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MULTI-STAGE ANIMATION MANAGER (Top Cards) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* STAGE 1: PROBLEM SETUP & ARRAY PRESENTATION */}
        <StageWrapper frame={frame} startFrame={0} endFrame={evBrute.start_frame + 6}>
          <Beat1ArraySetup frame={frame} fps={fps} fTargetGlow={fTargetGlow} />
        </StageWrapper>

        {/* STAGE 2: BRUTE FORCE O(N^2) TRAP */}
        <StageWrapper frame={frame} startFrame={evBrute.start_frame} endFrame={evFormula.start_frame + 6}>
          <Beat2BruteForce frame={frame} fps={fps} startFrame={evBrute.start_frame} fN2Alarm={fN2Alarm} />
        </StageWrapper>

        {/* STAGE 3: COMPLEMENT FORMULA & HASH MAP ARCHITECTURE */}
        <StageWrapper frame={frame} startFrame={evFormula.start_frame} endFrame={evResolution.start_frame + 6}>
          <Beat3ComplementFormula frame={frame} fps={fps} startFrame={evFormula.start_frame} fFormulaIlluminate={fFormulaIlluminate} />
        </StageWrapper>

        {/* STAGE 4: LIVE RESOLUTION & INSTANT COLLISION */}
        <StageWrapper frame={frame} startFrame={evResolution.start_frame} endFrame={evPayoff.start_frame + 6}>
          <Beat4LiveResolution
            frame={frame}
            fps={fps}
            startFrame={evResolution.start_frame}
            fMapInsertTwo={fMapInsertTwo}
            fCalcSeven={fCalcSeven}
            fInstantMatch={fInstantMatch}
          />
        </StageWrapper>

        {/* STAGE 5: LINEAR TIME PAYOFF & SCORECARD */}
        <StageWrapper frame={frame} startFrame={evPayoff.start_frame} endFrame={734}>
          <Beat5PayoffScorecard frame={frame} fps={fps} startFrame={evPayoff.start_frame} />
        </StageWrapper>

        {/* ══════════════════════════════════════════════════════ */}
        {/* MID-SCREEN CLEAN FLOATING ICONS & SUBTLE STAGE TAGS */}
        {/* ══════════════════════════════════════════════════════ */}
        <MidScreenTwoSumAssets
          frame={frame}
          fps={fps}
          evBruteFrame={evBrute.start_frame}
          evFormulaFrame={evFormula.start_frame}
          evResolutionFrame={evResolution.start_frame}
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
          {/* Downward Speech Tail Pointing directly to Nemi */}
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
// BEAT 1: PROBLEM SETUP & ARRAY PRESENTATION (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat1ArraySetup: React.FC<{
  frame: number;
  fps: number;
  fTargetGlow: number;
}> = ({ frame, fps, fTargetGlow }) => {
  const popSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const isTargetGlow = frame >= fTargetGlow;
  const numbers = [2, 7, 11, 15];

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
        border: `3.5px solid ${isTargetGlow ? "#38BDF8" : nemiTheme.colors.borderSubtle}`,
        boxShadow: isTargetGlow ? "0 28px 70px rgba(56, 189, 248, 0.32)" : "0 28px 70px rgba(0, 0, 0, 0.1)",
        padding: "34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      {/* Target Pill Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 34 }}>🎯</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#0F172A" }}>
            Given Array & Target
          </span>
        </div>
        <div
          style={{
            backgroundColor: isTargetGlow ? "#0284C7" : "#F1F5F9",
            color: isTargetGlow ? "#FFFFFF" : "#64748B",
            fontWeight: 900,
            fontSize: 24,
            padding: "12px 26px",
            borderRadius: 18,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: isTargetGlow ? "0 0 28px rgba(2, 132, 199, 0.5)" : "none",
          }}
        >
          TARGET = 9
        </div>
      </div>

      {/* Array Tiles Grid */}
      <div>
        <div style={{ fontSize: 19, fontWeight: 800, color: "#64748B", marginBottom: 12, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          nums = [ 2,  7, 11, 15 ]
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {numbers.map((val, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: idx <= 1 && isTargetGlow ? "rgba(2, 132, 199, 0.12)" : "#F8FAFC",
                border: idx <= 1 && isTargetGlow ? "3.5px solid #0284C7" : "2.5px solid #E2E8F0",
                borderRadius: 22,
                padding: "22px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16, color: "#94A3B8", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                index [{idx}]
              </span>
              <span style={{ fontSize: 44, fontWeight: 900, color: "#0F172A", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Explanation Box */}
      <div
        style={{
          backgroundColor: "#F1F5F9",
          borderRadius: 20,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 800, color: "#334155" }}>
          Goal: Return indices [i, j] such that nums[i] + nums[j] == 9
        </span>
        <span style={{ fontSize: 30 }}>💡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 2: BRUTE FORCE O(N^2) TRAP (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat2BruteForce: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fN2Alarm: number;
}> = ({ frame, fps, startFrame, fN2Alarm }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isAlarm = frame >= fN2Alarm;

  const scanStep = Math.max(0, Math.floor(Math.max(0, localFrame) / 15) % 4);
  const pairs = [
    { i: 0, j: 1, sum: "2 + 7 = 9", match: true },
    { i: 0, j: 2, sum: "2 + 11 = 13", match: false },
    { i: 0, j: 3, sum: "2 + 15 = 17", match: false },
    { i: 1, j: 2, sum: "7 + 11 = 18", match: false },
  ];
  const currentPair = pairs[scanStep] || pairs[0];

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
        border: `3.5px solid ${isAlarm ? "#EF4444" : "rgba(239, 68, 68, 0.55)"}`,
        boxShadow: isAlarm ? "0 28px 70px rgba(239, 68, 68, 0.45)" : "0 28px 70px rgba(0, 0, 0, 0.6)",
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
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#EF4444", boxShadow: "0 0 18px #EF4444" }} />
          <span style={{ fontSize: 26, fontWeight: 900, color: "#EF4444", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            ❌ The Naive Nested Loops Trap
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#EF4444", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          TIME: O(N²)
        </span>
      </div>

      {/* Dual Pointer Scanner Simulation */}
      <div style={{ backgroundColor: "#0F172A", padding: "22px", borderRadius: 20, border: "1px solid #1E293B" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ color: "#94A3B8", fontSize: 19, fontWeight: 700 }}>Nested For-Loops (i, j):</span>
          <span style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Testing Pair: {currentPair.sum}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[2, 7, 11, 15].map((val, idx) => {
            const isI = idx === currentPair.i;
            const isJ = idx === currentPair.j;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: isI || isJ ? "rgba(239, 68, 68, 0.32)" : "#1E293B",
                  border: isI || isJ ? "3.5px solid #EF4444" : "1px solid #334155",
                  borderRadius: 18,
                  padding: "18px 6px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 15, color: isI ? "#FFD166" : isJ ? "#38BDF8" : "#64748B", fontWeight: 900 }}>
                  {isI ? "Pointer i" : isJ ? "Pointer j" : `[${idx}]`}
                </span>
                <span style={{ fontSize: 34, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* O(N^2) Warning Alert */}
      <div
        style={{
          backgroundColor: "rgba(239, 68, 68, 0.18)",
          borderRadius: 20,
          padding: "18px 24px",
          border: "1.5px solid rgba(239, 68, 68, 0.5)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 17, color: "#EF4444", fontWeight: 800 }}>N = 100,000 Elements</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 2 }}>
            10,000,000,000 Operations (Time Limit Exceeded 💥)
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 3: COMPLEMENT FORMULA & HASH MAP LOGIC (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat3ComplementFormula: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fFormulaIlluminate: number;
}> = ({ frame, fps, startFrame, fFormulaIlluminate }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isFormula = frame >= fFormulaIlluminate;

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
        boxShadow: "0 28px 70px rgba(56, 189, 248, 0.32)",
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
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#38BDF8", boxShadow: "0 0 18px #38BDF8" }} />
          <span style={{ fontSize: 26, fontWeight: 900, color: "#38BDF8", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            🧠 The Complement Formula
          </span>
        </div>
        <span style={{ fontSize: 19, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          LOOKUP: O(1)
        </span>
      </div>

      {/* Complement Math Formula Box */}
      <div
        style={{
          backgroundColor: isFormula ? "rgba(56, 189, 248, 0.18)" : "#0F172A",
          padding: "24px 28px",
          borderRadius: 22,
          border: isFormula ? "3.5px solid #38BDF8" : "1px solid #1E293B",
          boxShadow: isFormula ? "0 0 45px rgba(56, 189, 248, 0.4)" : "none",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 17, color: "#94A3B8", fontWeight: 800, marginBottom: 6 }}>
          INSTEAD OF SEARCHING FORWARD, REMEMBER THE PAST:
        </div>
        <div style={{ fontSize: 38, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          Complement = Target − Current
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#FFD166", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
          Complement = 9 − Current Number
        </div>
      </div>

      {/* Hash Map Concept Schema */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "20px", borderRadius: 20, border: "1px solid #1E293B" }}>
          <div style={{ fontSize: 17, color: "#64748B", fontWeight: 700 }}>Map Key</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#38BDF8", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
            Number Value (x)
          </div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "20px", borderRadius: 20, border: "1px solid #1E293B" }}>
          <div style={{ fontSize: 17, color: "#64748B", fontWeight: 700 }}>Map Value</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
            Array Index (i)
          </div>
        </div>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Hash Map gives instant <span style={{ color: "#10B981", fontWeight: 900 }}>O(1) lookups</span> in single pass!
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 4: LIVE RESOLUTION & INSTANT COLLISION MATCH (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat4LiveResolution: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fMapInsertTwo: number;
  fCalcSeven: number;
  fInstantMatch: number;
}> = ({ frame, fps, startFrame, fMapInsertTwo, fCalcSeven, fInstantMatch }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });

  const hasTwoInserted = frame >= fMapInsertTwo;
  const isMatched = frame >= fInstantMatch;

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
        border: `3.5px solid ${isMatched ? "#10B981" : "#38BDF8"}`,
        boxShadow: isMatched ? "0 28px 70px rgba(16, 185, 129, 0.45)" : "0 28px 70px rgba(0, 0, 0, 0.6)",
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
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: isMatched ? "#10B981" : "#38BDF8", boxShadow: `0 0 18px ${isMatched ? "#10B981" : "#38BDF8"}` }} />
          <span style={{ fontSize: 26, fontWeight: 900, color: isMatched ? "#10B981" : "#38BDF8", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            {isMatched ? "🎉 SOLUTION FOUND (1-PASS)" : "⚡ LIVE HASH MAP EXECUTION"}
          </span>
        </div>
        <span style={{ fontSize: 19, color: isMatched ? "#10B981" : "#FFD166", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isMatched ? "RETURN [0, 1]" : "SCANNING INDEX 1"}
        </span>
      </div>

      {/* Live Traversal Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Step 1: Element 2 at Index 0 */}
        <div style={{ backgroundColor: "#0F172A", padding: "16px 22px", borderRadius: 18, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, color: "#64748B", fontWeight: 700 }}>Step 1: nums[0] = 2 (Need 9 - 2 = 7)</div>
            <div style={{ fontSize: 21, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 2 }}>
              7 not in map → Store &#123; 2 : index 0 &#125;
            </div>
          </div>
          <span style={{ color: hasTwoInserted ? "#10B981" : "#64748B", fontSize: 24, fontWeight: 900 }}>
            {hasTwoInserted ? "STORED ✓" : "..."}
          </span>
        </div>

        {/* Step 2: Element 7 at Index 1 */}
        <div
          style={{
            backgroundColor: isMatched ? "rgba(16, 185, 129, 0.22)" : "#0F172A",
            padding: "18px 22px",
            borderRadius: 18,
            border: isMatched ? "3.5px solid #10B981" : "1px solid #1E293B",
            boxShadow: isMatched ? "0 0 40px rgba(16, 185, 129, 0.4)" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 16, color: isMatched ? "#10B981" : "#64748B", fontWeight: 800 }}>
              Step 2: nums[1] = 7 (Need 9 - 7 = 2)
            </div>
            <div style={{ fontSize: 29, fontWeight: 900, color: isMatched ? "#F8FAFC" : "#64748B", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 2 }}>
              {isMatched ? "KEY 2 FOUND IN MAP AT INDEX 0! 🎯" : "Calculating 9 - 7..."}
            </div>
          </div>
          <div
            style={{
              backgroundColor: isMatched ? "#10B981" : "#334155",
              color: "#FFFFFF",
              fontWeight: 900,
              fontSize: 20,
              padding: "10px 20px",
              borderRadius: 12,
              fontFamily: nemiTheme.typography.fontFamily.mono,
            }}
          >
            {isMatched ? "[0, 1] MATCH" : "O(1) CHECK"}
          </div>
        </div>
      </div>

      {/* Return Solution Banner */}
      <div
        style={{
          backgroundColor: isMatched ? "#10B981" : "#03070D",
          color: "#FFFFFF",
          borderRadius: 18,
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: nemiTheme.typography.fontFamily.mono,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 900 }}>
          {isMatched ? "result = [0, 1] // nums[0] + nums[1] == 9" : "hash_map = { 2: 0 }"}
        </span>
        <span style={{ fontSize: 28 }}>⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 5: LINEAR TIME PAYOFF & SCORECARD (Safe Zone: sides: 65px)
// ═══════════════════════════════════════════════════════════════
const Beat5PayoffScorecard: React.FC<{
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
        gap: 18,
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: nemiTheme.colors.brandYellow, letterSpacing: "1.5px" }}>
          ⚡ TWO SUM SCORECARD
        </span>
        <span style={{ fontSize: 20, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          TIME COMPLEXITY: O(N)
        </span>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "18px 24px", borderRadius: 18, borderLeft: "7px solid #EF4444" }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#EF4444" }}>❌ Naive Brute Force (Nested Loops)</div>
        <div style={{ fontSize: 20, color: "#94A3B8", marginTop: 4 }}>
          Time: O(N²) • Space: O(1) • 100K items = 10 Billion operations (TLE)
        </div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "18px 24px", borderRadius: 18, borderLeft: "7px solid #10B981" }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#10B981" }}>⚡ 1-Pass Hash Map (Complement Storage)</div>
        <div style={{ fontSize: 20, color: "#94A3B8", marginTop: 4 }}>
          Time: O(N) • Space: O(N) • 100K items = 100,000 operations (1ms instant)
        </div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "18px 24px", borderRadius: 18, borderLeft: "7px solid #38BDF8" }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#38BDF8" }}>🚀 Core Interview Takeaway</div>
        <div style={{ fontSize: 20, color: "#94A3B8", marginTop: 4 }}>
          Trade a little bit of O(N) RAM space to achieve lightning-fast O(N) time!
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MID-SCREEN CLEAN FLOATING ICONS & SUBTLE STAGE TAGS (Safe Zone: top: 960px, sides: 65px)
// ═══════════════════════════════════════════════════════════════
const MidScreenTwoSumAssets: React.FC<{
  frame: number;
  fps: number;
  evBruteFrame: number;
  evFormulaFrame: number;
  evResolutionFrame: number;
  evPayoffFrame: number;
}> = ({ frame, fps, evBruteFrame, evFormulaFrame, evResolutionFrame, evPayoffFrame }) => {
  const isStage1 = frame < evBruteFrame;
  const isStage2 = frame >= evBruteFrame && frame < evFormulaFrame;
  const isStage3 = frame >= evFormulaFrame && frame < evResolutionFrame;
  const isStage4 = frame >= evResolutionFrame && frame < evPayoffFrame;
  const isStage5 = frame >= evPayoffFrame;

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
      {/* ─── STAGE 1: ARRAY TILES ─── */}
      {isStage1 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 30px rgba(0,0,0,0.09)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🔢</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#1E293B" }}>nums = [2, 7, 11, 15]</span>
            </div>

            <span style={{ fontSize: 32, color: nemiTheme.colors.brandCyan, fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 30px rgba(0,0,0,0.09)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🎯</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#0284C7" }}>Target = 9</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(2, 132, 199, 0.15)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(2, 132, 199, 0.4)", color: "#0284C7", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Find 2 Array Elements That Add Up to 9
          </div>
        </>
      )}

      {/* ─── STAGE 2: BRUTE FORCE SCANNER ─── */}
      {isStage2 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(239, 68, 68, 0.55)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🔴</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#EF4444" }}>Outer Loop i</span>
            </div>

            <span style={{ fontSize: 32, color: "#EF4444", fontWeight: 900 }}>✕</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(239, 68, 68, 0.55)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🔴</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#EF4444" }}>Inner Loop j</span>
            </div>

            <span style={{ fontSize: 32, color: "#EF4444", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(239, 68, 68, 0.55)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>💥</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#EF4444" }}>O(N²) Redline</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(239, 68, 68, 0.45)", color: "#EF4444", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Checking All N*(N-1)/2 Combinations!
          </div>
        </>
      )}

      {/* ─── STAGE 3: COMPLEMENT FORMULA ─── */}
      {isStage3 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(56, 189, 248, 0.55)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>📐</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#38BDF8" }}>9 − Current</span>
            </div>

            <span style={{ fontSize: 32, color: "#38BDF8", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(255, 209, 102, 0.55)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>📦</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#FFD166" }}>Hash Map Lookup</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.55)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>⚡</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>O(1) Speed</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(56, 189, 248, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(56, 189, 248, 0.45)", color: "#38BDF8", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Store Visited Elements • Constant Time Check
          </div>
        </>
      )}

      {/* ─── STAGE 4: LIVE RESOLUTION & COLLISION ─── */}
      {isStage4 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.55)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>📥</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Map: &#123; 2: 0 &#125;</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(56, 189, 248, 0.55)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 46 }}>🔍</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#38BDF8" }}>9 − 7 = 2</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.90)", padding: "16px 26px", borderRadius: 26, border: "2px solid rgba(16, 185, 129, 0.7)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 32px rgba(16, 185, 129, 0.4)" }}>
              <span style={{ fontSize: 46 }}>🎉</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Match: [0, 1]!</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(16, 185, 129, 0.18)", padding: "12px 28px", borderRadius: 24, border: "2px solid rgba(16, 185, 129, 0.45)", color: "#10B981", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Element 7 Found Matching Key 2 in 1 Lookup!
          </div>
        </>
      )}

      {/* ─── STAGE 5: SCORECARD ─── */}
      {isStage5 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.18)", padding: "16px 28px", borderRadius: 26, border: "2px solid rgba(239, 68, 68, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 40 }}>🐢</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#EF4444" }}>O(N²): 10,000ms</span>
            </div>

            <span style={{ fontSize: 30, color: "#FFD166", fontWeight: 900 }}>VS</span>

            <div style={{ backgroundColor: "rgba(16, 185, 129, 0.22)", padding: "16px 30px", borderRadius: 26, border: "3px solid #10B981", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 40px rgba(16, 185, 129, 0.45)" }}>
              <span style={{ fontSize: 40 }}>🚀</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>O(N): 1ms</span>
            </div>
          </div>

          <div style={{ color: "#FFD166", fontSize: 21, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            10,000x Speedup with 1-Pass Hash Map! 🚀
          </div>
        </>
      )}
    </div>
  );
};
