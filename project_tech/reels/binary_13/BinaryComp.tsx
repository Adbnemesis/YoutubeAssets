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
import cuesData from "../../src/data/binary_13_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandPurple: "#A855F7",
    brandGreen: "#10B981",
    brandRed: "#EF4444",
    brandCoral: "#F43F5E",
    brandAmber: "#F59E0B",
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    cardDark: "#0F172A",
    cardSurface: "#1E293B",
    textLight: "#0F172A",
    textDark: "#F8FAFC",
    textMuted: "#94A3B8",
    borderLight: "#E2E8F0",
    borderDark: "#334155",
  },
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
  },
};

const getEvent = (id: string) => {
  const ev = (cuesData.timeline_events as any[]).find((x) => x.id === id);
  return ev ?? {
    start_frame: 0,
    end_frame: 0,
    start_time_ms: 0,
    end_time_ms: 0,
    duration_s: 0,
    semantic_cues: [],
  };
};

const getCue = (eventId: string, cueName: string): number => {
  const ev = getEvent(eventId);
  const c = (ev.semantic_cues ?? []).find((x: any) => x.cue === cueName);
  return c ? c.frame : ev.start_frame;
};

export const BinaryComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 742;

  // ─── Timeline Events ───
  const evHook = getEvent("bn01_hook");
  const evLinear = getEvent("bn02_linear");
  const evNemi = getEvent("bn03_nemi");
  const evHalve = getEvent("bn04_halve");
  const evStep2 = getEvent("bn05_step2");
  const evScale = getEvent("bn06_scale");
  const evNemiSmug = getEvent("bn07_nemi");
  const evLoop = getEvent("bn08_loop");

  // ─── Semantic Cues ───
  const rangeSpawnCue = getCue("bn01_hook", "range_spawn"); // 38
  const sevenSlamCue = getCue("bn01_hook", "seven_slam"); // 71
  const linearCrossCue = getCue("bn02_linear", "linear_cross"); // 111
  const midFiftyCue = getCue("bn02_linear", "mid_fifty"); // 154
  const target73Cue = getCue("bn03_nemi", "target_73"); // 230
  const higherVerdictCue = getCue("bn04_halve", "higher_verdict"); // 280
  const purgeLeftCue = getCue("bn04_halve", "purge_left"); // 336
  const mid75Cue = getCue("bn05_step2", "mid_75"); // 401
  const purgeRightCue = getCue("bn05_step2", "purge_right"); // 452
  const halfCascadeCue = getCue("bn06_scale", "half_cascade"); // 525
  const billionPayoffCue = getCue("bn06_scale", "billion_payoff"); // 584
  const nemiSmugCue = getCue("bn07_nemi", "nemi_smug"); // 644
  const loopSeamCue = getCue("bn08_loop", "loop_seam"); // 721

  // ─── Stage Boundaries ───
  const cutB = evLinear.start_frame; // 87
  const cutC = evNemi.start_frame; // 186
  const cutD = evHalve.start_frame; // 251
  const cutE = evStep2.start_frame; // 368
  const cutF = evScale.start_frame; // 484
  const cutG = evNemiSmug.start_frame; // 605
  const cutH = evLoop.start_frame; // 668

  // ─── Smooth Background Theme ───
  const isDarkWorld = frame >= cutB && frame < loopSeamCue;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;

  // ─── Camera Breathing ───
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.025], {
    extrapolateRight: "clamp",
  });

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "thinking";
  } else if (frame < cutC) {
    nemiPose = "explaining";
  } else if (frame < cutD) {
    nemiPose = "puzzled";
    nemiSpeech = "What if the secret is 73? 🤔";
  } else if (frame < cutE) {
    nemiPose = "aha";
  } else if (frame < cutF) {
    nemiPose = "pointing";
  } else if (frame < cutG) {
    nemiPose = "aha";
  } else if (frame < cutH + 15) {
    nemiPose = "smug";
    nemiSpeech = "That's why computers are so fast! 😎⚡";
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
      {/* MASTER AUDIO (Voice + Ducked BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/binary_13/binary_master_audio.mp3")} volume={0.92} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SFX LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/binary_13/sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={sevenSlamCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/pop.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutB - 2)} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={linearCrossCue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/error.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={midFiftyCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={target73Cue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/pop.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={Math.max(0, cutD - 2)} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={higherVerdictCue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/notification.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={purgeLeftCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/pop.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={mid75Cue} durationInFrames={25}>
        <Audio src={staticFile("reels/binary_13/sfx/ping.mp3")} volume={0.68} />
      </Sequence>
      <Sequence from={purgeRightCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/pop.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutF - 2)} durationInFrames={35}>
        <Audio src={staticFile("reels/binary_13/sfx/riser.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={billionPayoffCue} durationInFrames={40}>
        <Audio src={staticFile("reels/binary_13/sfx/chime.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={nemiSmugCue} durationInFrames={30}>
        <Audio src={staticFile("reels/binary_13/sfx/pop.mp3")} volume={0.66} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CAMERA & AMBIENT WORLD */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        {/* Dynamic Background Glows */}
        {isDarkWorld && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
            <div
              style={{
                position: "absolute",
                top: 200,
                left: -120,
                width: 600,
                height: 600,
                borderRadius: "50%",
                background: frame < cutE
                  ? "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(0,0,0,0) 70%)"
                  : "radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(90px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 680,
                right: -120,
                width: 600,
                height: 600,
                borderRadius: "50%",
                background: frame >= cutF
                  ? "radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(0,0,0,0) 70%)"
                  : "radial-gradient(circle, rgba(255, 209, 102, 0.2) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(90px)",
              }}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TOP HUD (Safe Zone: top 85px) — appears frame 60+ */}
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
                  backgroundColor: frame >= cutF ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCyan,
                  boxShadow: `0 0 20px ${frame >= cutF ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCyan}`,
                }}
              />
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: isDarkWorld ? (frame >= cutF ? "#10B981" : "#06B6D4") : "#0891B2",
                }}
              >
                Ep.13 · Binary Search
              </span>
            </div>

            <div
              style={{
                backgroundColor: isDarkWorld ? "rgba(15, 23, 42, 0.94)" : "#FFFFFF",
                padding: "12px 24px",
                borderRadius: 24,
                border: `2px solid ${isDarkWorld ? nemiTheme.colors.borderDark : nemiTheme.colors.borderLight}`,
                fontSize: 20,
                fontWeight: 900,
                color: isDarkWorld ? (frame >= cutF ? "#10B981" : "#06B6D4") : "#0891B2",
                fontFamily: nemiTheme.typography.fontFamily.mono,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              {frame < cutB ? "THE 1-TO-100 GAME" : frame < cutD ? "MIDPOINT PROBE (50)" : frame < cutE ? "50% PURGED IN 1 CUT" : frame < cutF ? "BINARY DECISION TREE" : frame < cutG ? "1 BILLION IN 30 OPS" : "O(log N) COMPLEXITY GRAPH"}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* HEADLINE TITLE (Safe Zone: top: 165px) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              letterSpacing: -1.5,
              lineHeight: 1.15,
              color: isDarkWorld ? "#F8FAFC" : nemiTheme.colors.textLight,
            }}
          >
            {frame < cutB ? (
              <>
                Guess 1 to 100 in <span style={{ color: nemiTheme.colors.brandCoral }}>7 Guesses!</span>
              </>
            ) : frame < cutC ? (
              <>
                Never Guess 1 By 1. <span style={{ color: nemiTheme.colors.brandCyan }}>Always Pick 50!</span> ⚡
              </>
            ) : frame < cutD ? (
              <>
                Secret is 73: <span style={{ color: nemiTheme.colors.brandYellow }}>73 &gt; 50 (Higher!)</span>
              </>
            ) : frame < cutE ? (
              <>
                73 Is Higher! <span style={{ color: "#F43F5E" }}>1 to 50 Discarded!</span> 💥
              </>
            ) : frame < cutF ? (
              <>
                Next Probe 75: <span style={{ color: nemiTheme.colors.brandCyan }}>73 &lt; 75 (Too High!)</span> 👈
              </>
            ) : frame < cutG ? (
              <>
                1 Billion Items: <span style={{ color: nemiTheme.colors.brandYellow }}>Solved in 30 Cuts!</span> 👑
              </>
            ) : (
              <>
                The Power of <span style={{ color: nemiTheme.colors.brandCyan }}>O(log N) Time</span> ⚡
              </>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* MAIN VISUAL CARD STAGES (Safe Zone: top: 310px, height: 600px) */}
        {/* ══════════════════════════════════════════════════════════ */}

        {/* STAGE 1: DYNAMIC SPECTRUM DENSITY WAVEFORM (0 to 87) */}
        {frame < cutB && (
          <Visual1_SpectrumWaveform frame={frame} sevenSlamCue={sevenSlamCue} />
        )}

        {/* STAGE 2: LASER MIDPOINT RETICLE ON 50 (87 to 186) */}
        {frame >= cutB && frame < cutC && (
          <Visual2_MidpointReticle frame={frame} linearCrossCue={linearCrossCue} midFiftyCue={midFiftyCue} />
        )}

        {/* STAGE 3: TARGET BEACON 73 & DECISION PROBE (186 to 251) */}
        {frame >= cutC && frame < cutD && (
          <Visual3_TargetBeacon frame={frame} target73Cue={target73Cue} />
        )}

        {/* STAGE 4: THE 50% PARTICLE DISINTEGRATION SLICE (251 to 368) */}
        {frame >= cutD && frame < cutE && (
          <Visual4_ParticleShatter frame={frame} higherVerdictCue={higherVerdictCue} purgeLeftCue={purgeLeftCue} />
        )}

        {/* STAGE 5: ANIMATED SVG BINARY DECISION TREE (368 to 484) */}
        {frame >= cutE && frame < cutF && (
          <Visual5_BinaryDecisionTree frame={frame} mid75Cue={mid75Cue} purgeRightCue={purgeRightCue} />
        )}

        {/* STAGE 6: 1 BILLION EXPONENTIAL TELESCOPE FUNNEL (484 to 605) */}
        {frame >= cutF && frame < cutG && (
          <Visual6_ExponentialFunnel frame={frame} halfCascadeCue={halfCascadeCue} billionPayoffCue={billionPayoffCue} />
        )}

        {/* STAGE 7 & 8: O(N) VS O(log N) INTERACTIVE GRAPH SHOWDOWN (605 to 742) */}
        {frame >= cutG && (
          <Visual7_ComplexityGraph frame={frame} cutG={cutG} loopSeamCue={loopSeamCue} />
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} fps={fps} />}

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
        {/* NEMI SPEECH BUBBLE (Strictly at bottom: 440px) */}
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
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 1. STAGE 1: DYNAMIC SPECTRUM DENSITY WAVEFORM (0-87)
// ═══════════════════════════════════════════════════════════════
const Visual1_SpectrumWaveform: React.FC<{ frame: number; sevenSlamCue: number }> = ({ frame, sevenSlamCue }) => {
  const isSlammed = frame >= sevenSlamCue;
  const pulse = Math.sin(frame * 0.25);
  const scanSweep = (frame * 14) % 860;

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#FFFFFF",
        borderRadius: 36,
        border: isSlammed ? "4px solid #06B6D4" : "3.5px solid #E2E8F0",
        boxShadow: isSlammed ? "0 24px 80px rgba(6, 182, 212, 0.35)" : "0 24px 80px rgba(0, 0, 0, 0.08)",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>📊</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>Search Space: 100 Ordered Elements</span>
        </div>
        <span style={{ backgroundColor: "#ECFEFF", color: "#0891B2", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SECRET = ??? 🔒
        </span>
      </div>

      {/* SVG 100-Bar Frequency Waveform Spectrum */}
      <div style={{ width: "100%", height: 260, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="250" viewBox="0 0 880 250">
          <defs>
            <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="midGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Vertical Density Waveform Bars */}
          {Array.from({ length: 50 }, (_, i) => {
            const x = 30 + i * 16.5;
            const isCenter = i >= 23 && i <= 26;
            const barH = 50 + Math.sin(i * 0.18 + frame * 0.12) * 35 + (isCenter ? 55 : 0);
            const y = 190 - barH;

            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="10"
                height={barH}
                rx="5"
                fill={isCenter ? "url(#midGrad)" : "url(#barGrad)"}
                opacity={isCenter ? 1 : 0.7}
              />
            );
          })}

          {/* Base Axis Line */}
          <line x1="30" y1="195" x2="855" y2="195" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

          {/* Active Red Linear Scanning Beam */}
          {!isSlammed && (
            <g transform={`translate(${scanSweep}, 0)`}>
              <line x1="30" y1="10" x2="30" y2="200" stroke="#EF4444" strokeWidth="5" />
              <polygon points="20,10 40,10 30,25" fill="#EF4444" />
            </g>
          )}

          {/* Text Labels on Axis */}
          <text x="35" y="230" fill="#0F172A" fontSize="22" fontWeight="900" fontFamily="monospace">1</text>
          <text x="440" y="230" fill="#0891B2" fontSize="24" fontWeight="900" fontFamily="monospace" textAnchor="middle">50 (MID)</text>
          <text x="845" y="230" fill="#0F172A" fontSize="22" fontWeight="900" fontFamily="monospace" textAnchor="end">100</text>
        </svg>
      </div>

      {/* Gold Slam Badge or Linear Scan Callout */}
      {isSlammed ? (
        <div
          style={{
            backgroundColor: "#ECFEFF",
            border: "3.5px solid #06B6D4",
            borderRadius: 22,
            padding: "16px 36px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 14px 40px rgba(6, 182, 212, 0.35)",
            transform: `scale(${1 + pulse * 0.03})`,
          }}
        >
          <span style={{ fontSize: 36 }}>⚡</span>
          <span style={{ fontSize: 28, fontWeight: 900, color: "#0E7490", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            SOLVED IN MAXIMUM 7 GUESSES!
          </span>
        </div>
      ) : (
        <div style={{ width: "100%", backgroundColor: "#F8FAFC", padding: "16px 24px", borderRadius: 18, border: "1.5px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#64748B", fontSize: 19, fontWeight: 700 }}>Linear scan tests 1 by 1:</span>
          <span style={{ color: "#EF4444", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>UP TO 100 TRIES (TOO SLOW! 🐌)</span>
        </div>
      )}

      <div style={{ width: "100%", backgroundColor: "#F0FDFA", padding: "14px 24px", borderRadius: 18, border: "2px solid #06B6D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#0F172A", fontSize: 18, fontWeight: 700 }}>Halve the entire array on every single question:</span>
        <span style={{ color: "#0891B2", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>O(log N) SPEED ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. STAGE 2: LASER MIDPOINT RETICLE ON 50 (87-186)
// ═══════════════════════════════════════════════════════════════
const Visual2_MidpointReticle: React.FC<{ frame: number; linearCrossCue: number; midFiftyCue: number }> = ({ frame, linearCrossCue, midFiftyCue }) => {
  const isMid = frame >= midFiftyCue;
  const pulse = Math.sin(frame * 0.3);

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #06B6D4",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.3)",
        padding: "28px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🎯</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Rule #1: Always Probe The Exact Center</span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          PROBE: 50 ⚡
        </span>
      </div>

      {/* SVG High-Tech Radar & Midpoint Reticle */}
      <div style={{ width: "100%", height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="260" viewBox="0 0 880 260">
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Left Partition Box (1-50) */}
          <rect x="30" y="60" width="390" height="130" rx="18" fill="rgba(6, 182, 212, 0.08)" stroke="#06B6D4" strokeWidth="2.5" strokeDasharray="8,8" />
          <text x="225" y="115" fill="#06B6D4" fontSize="22" fontWeight="900" textAnchor="middle">LEFT PARTITION</text>
          <text x="225" y="155" fill="#38BDF8" fontSize="28" fontWeight="900" textAnchor="middle" fontFamily="monospace">1 — 50</text>

          {/* Right Partition Box (51-100) */}
          <rect x="460" y="60" width="390" height="130" rx="18" fill="rgba(168, 85, 247, 0.08)" stroke="#A855F7" strokeWidth="2.5" strokeDasharray="8,8" />
          <text x="655" y="115" fill="#A855F7" fontSize="22" fontWeight="900" textAnchor="middle">RIGHT PARTITION</text>
          <text x="655" y="155" fill="#C084FC" fontSize="28" fontWeight="900" textAnchor="middle" fontFamily="monospace">51 — 100</text>

          {/* Center Laser Guillotine Beam at X=440 */}
          <line x1="440" y1="10" x2="440" y2="245" stroke={isMid ? "#10B981" : "#06B6D4"} strokeWidth="6" />
          <circle cx="440" cy="125" r="44" fill="url(#radarGlow)" />
          <circle cx="440" cy="125" r="28" fill="#0B1120" stroke={isMid ? "#10B981" : "#06B6D4"} strokeWidth="4" />
          <text x="440" y="133" fill={isMid ? "#10B981" : "#06B6D4"} fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="monospace">50</text>

          {/* Top Target Arrow */}
          <polygon points="440,50 425,30 455,30" fill={isMid ? "#10B981" : "#06B6D4"} />
        </svg>
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "16px 24px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>One question tests 50 numbers at once:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>50% ELIMINATED INSTANTLY ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. STAGE 3: TARGET BEACON 73 & DECISION PROBE (186-251)
// ═══════════════════════════════════════════════════════════════
const Visual3_TargetBeacon: React.FC<{ frame: number; target73Cue: number }> = ({ frame, target73Cue }) => {
  const pulse = Math.sin(frame * 0.3);

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #FFD166",
        boxShadow: "0 24px 80px rgba(255, 209, 102, 0.3)",
        padding: "28px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🔐</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Secret Target = 73 (Is 73 &gt; 50?)</span>
        </div>
        <span style={{ backgroundColor: "rgba(255, 209, 102, 0.2)", color: "#FFD166", border: "1.5px solid #FFD166", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          VERDICT: HIGHER! 👉
        </span>
      </div>

      {/* SVG Interactive Compass & Target Beacon */}
      <div style={{ width: "100%", height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="260" viewBox="0 0 880 260">
          {/* Axis Track */}
          <line x1="40" y1="130" x2="840" y2="130" stroke="#334155" strokeWidth="6" strokeLinecap="round" />

          {/* Left Half (1-50): Marked for Elimination */}
          <rect x="40" y="80" width="390" height="100" rx="16" fill="rgba(239, 68, 68, 0.12)" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="6,6" />
          <text x="235" y="125" fill="#FDA4AF" fontSize="24" fontWeight="900" textAnchor="middle" textDecoration="line-through">1 — 50</text>
          <text x="235" y="155" fill="#EF4444" fontSize="16" fontWeight="900" textAnchor="middle">❌ TOO LOW (DISCARD)</text>

          {/* 50 Center Marker */}
          <circle cx="440" cy="130" r="20" fill="#06B6D4" />
          <text x="440" y="137" fill="#0B1120" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">50</text>

          {/* 73 Target Beacon with Radial Pulsing Waves */}
          <g transform="translate(640, 130)">
            <circle cx="0" cy="0" r={36 + pulse * 6} fill="none" stroke="#FFD166" strokeWidth="2.5" opacity="0.6" />
            <circle cx="0" cy="0" r="24" fill="#FFD166" />
            <text x="0" y="7" fill="#0B1120" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">73</text>
            <text x="0" y="-45" fill="#FFD166" fontSize="22" fontWeight="900" textAnchor="middle">🎯 SECRET = 73</text>
          </g>

          {/* Energy Arrow pointing from 50 to 73 */}
          <path d="M 470 130 Q 550 80 610 115" fill="none" stroke="#10B981" strokeWidth="5" strokeDasharray="8,8" />
          <polygon points="615,115 600,105 605,122" fill="#10B981" />
        </svg>
      </div>

      <div style={{ width: "100%", backgroundColor: "#1E293B", padding: "16px 24px", borderRadius: 18, border: "2px solid #FFD166", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>Because 73 &gt; 50, the secret is guaranteed on the right:</span>
        <span style={{ color: "#FFD166", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>TARGET IS HIGHER 👉</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STAGE 4: 50% PARTICLE DISINTEGRATION SLICE (251-368)
// ═══════════════════════════════════════════════════════════════
const Visual4_ParticleShatter: React.FC<{ frame: number; higherVerdictCue: number; purgeLeftCue: number }> = ({ frame, higherVerdictCue, purgeLeftCue }) => {
  const isPurged = frame >= purgeLeftCue;
  const purgeProgress = interpolate(frame - purgeLeftCue, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #F43F5E",
        boxShadow: "0 24px 80px rgba(244, 63, 94, 0.35)",
        padding: "28px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>✂️</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>73 is Higher: 1 to 50 Disintegrated in 1 Step!</span>
        </div>
        <span style={{ backgroundColor: "rgba(244, 63, 94, 0.25)", color: "#F43F5E", border: "1.5px solid #F43F5E", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          -50% DISCARDED 💥
        </span>
      </div>

      {/* SVG Particle Shatter & Slicing Blade */}
      <div style={{ width: "100%", height: 280, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <svg width="880" height="260" viewBox="0 0 880 260">
          {/* Left Half (1-50): Smashed & Falling Shards */}
          <g opacity={1 - purgeProgress * 0.7}>
            <rect x="30" y="50" width="380" height="150" rx="20" fill="#4C0519" stroke="#F43F5E" strokeWidth="3" strokeDasharray="8,8" />
            <text x="220" y="115" fill="#FDA4AF" fontSize="28" fontWeight="900" textAnchor="middle" textDecoration="line-through">1 — 50</text>
            <text x="220" y="160" fill="#F43F5E" fontSize="20" fontWeight="900" textAnchor="middle">❌ PURGED FOREVER</text>
          </g>

          {/* Falling Disintegration Particles */}
          {isPurged && Array.from({ length: 22 }, (_, i) => {
            const px = 50 + (i * 18) % 340;
            const py = 50 + purgeProgress * (130 + (i * 14) % 80);
            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={3.5 + (i % 3)}
                fill="#F43F5E"
                opacity={1 - purgeProgress}
              />
            );
          })}

          {/* Neon Guillotine Slicing Blade at X=425 */}
          <line x1="425" y1="10" x2="425" y2="250" stroke="#F43F5E" strokeWidth="6" />
          <polygon points="425,250 412,230 438,230" fill="#F43F5E" />

          {/* Right Half (51-100): Expanding into Focus */}
          <g transform={`translate(${interpolate(purgeProgress, [0, 1], [0, -35])}, 0)`}>
            <rect x="450" y="45" width="400" height="160" rx="22" fill="#064E3B" stroke="#10B981" strokeWidth="3.5" />
            <text x="650" y="110" fill="#A7F3D0" fontSize="22" fontWeight="900" textAnchor="middle">NEW SEARCH RANGE</text>
            <text x="650" y="160" fill="#10B981" fontSize="46" fontWeight="900" textAnchor="middle" fontFamily="monospace">51 — 100</text>
            <circle cx="760" cy="150" r="16" fill="#FFD166" />
            <text x="760" y="156" fill="#0B1120" fontSize="14" fontWeight="900" textAnchor="middle">73</text>
          </g>
        </svg>
      </div>

      <div style={{ width: "100%", backgroundColor: "#18060B", padding: "16px 24px", borderRadius: 18, border: "2px solid #F43F5E", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>In a single question, half the search space vanished:</span>
        <span style={{ color: "#F43F5E", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>50 NUMBERS PURGED ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. STAGE 5: ANIMATED SVG BINARY DECISION TREE (368-484)
// ═══════════════════════════════════════════════════════════════
const Visual5_BinaryDecisionTree: React.FC<{ frame: number; mid75Cue: number; purgeRightCue: number }> = ({ frame, mid75Cue, purgeRightCue }) => {
  const isRightPurged = frame >= purgeRightCue;

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #06B6D4",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.3)",
        padding: "24px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🌳</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Binary Decision Tree: Probe 75</span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          73 &lt; 75 (TOO HIGH!)
        </span>
      </div>

      {/* SVG 3-Tier Binary Tree with Enhanced Bold Geometry */}
      <div style={{ width: "100%", height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="300" viewBox="0 0 880 300">
          {/* Level 0: Root Node [1 .. 100] */}
          <rect x="340" y="10" width="200" height="52" rx="16" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
          <text x="440" y="42" fill="#F8FAFC" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="monospace">[1 .. 100]</text>

          {/* Level 0 to Level 1 Branches */}
          <path d="M 380 62 Q 240 95 240 120" fill="none" stroke="#F43F5E" strokeWidth="4" strokeDasharray="6,6" />
          <path d="M 500 62 Q 640 95 640 120" fill="none" stroke="#10B981" strokeWidth="4.5" />

          {/* Level 1 Left Node: [1 .. 50] (Purged) */}
          <rect x="140" y="120" width="200" height="52" rx="16" fill="#4C0519" stroke="#F43F5E" strokeWidth="2.5" opacity="0.4" />
          <text x="240" y="152" fill="#FDA4AF" fontSize="20" fontWeight="900" textAnchor="middle" textDecoration="line-through">[1 .. 50] ❌</text>

          {/* Level 1 Right Node: [51 .. 100] (Split by 75) */}
          <rect x="540" y="120" width="200" height="52" rx="16" fill="#064E3B" stroke="#10B981" strokeWidth="3" />
          <text x="640" y="152" fill="#A7F3D0" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace">[51 .. 100] ✓</text>

          {/* Level 1 to Level 2 Branches */}
          <path d="M 590 172 Q 490 205 490 230" fill="none" stroke="#10B981" strokeWidth="4.5" />
          <path d="M 690 172 Q 780 205 780 230" fill="none" stroke="#F43F5E" strokeWidth="4" strokeDasharray="6,6" />

          {/* Level 2 Left Node: [51 .. 74] (Target 73 is HERE!) */}
          <rect x="380" y="230" width="220" height="56" rx="18" fill="#064E3B" stroke="#FFD166" strokeWidth="3.5" />
          <text x="490" y="265" fill="#FFD166" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="monospace">🎯 [51 .. 74]</text>

          {/* Level 2 Right Node: [76 .. 100] (Purged) */}
          <rect x="670" y="230" width="220" height="56" rx="18" fill="#4C0519" stroke="#F43F5E" strokeWidth="2.5" opacity={isRightPurged ? 0.35 : 1} />
          <text x="780" y="265" fill="#FDA4AF" fontSize="20" fontWeight="900" textAnchor="middle" textDecoration={isRightPurged ? "line-through" : "none"}>[76 .. 100] ❌</text>
        </svg>
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "14px 24px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>In just 2 questions, only 24 items remain:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>75% TOTAL PURGED ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 6. STAGE 6: 1 BILLION EXPONENTIAL TELESCOPE FUNNEL (484-605)
// ═══════════════════════════════════════════════════════════════
const Visual6_ExponentialFunnel: React.FC<{ frame: number; halfCascadeCue: number; billionPayoffCue: number }> = ({ frame, halfCascadeCue, billionPayoffCue }) => {
  const isBillion = frame >= billionPayoffCue;
  const count = interpolate(frame - halfCascadeCue, [0, 45], [1, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #FFD166",
        boxShadow: "0 24px 80px rgba(255, 209, 102, 0.3)",
        padding: "24px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>👑</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#FFD166" }}>Scaling to 1 Billion: 2³⁰ = 1,073,741,824</span>
        </div>
        <span style={{ backgroundColor: "rgba(255, 209, 102, 0.2)", color: "#FFD166", border: "1.5px solid #FFD166", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          CUT {Math.round(count)} / 30 ⚡
        </span>
      </div>

      {/* SVG 30-Tier Exponential Halving Funnel Matrix */}
      <div style={{ width: "100%", height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="300" viewBox="0 0 880 300">
          {/* Cascading Halving Rings */}
          {[
            { n: "1,000,000,000", w: 780, y: 15 },
            { n: "500,000,000", w: 620, y: 52 },
            { n: "250,000,000", w: 480, y: 89 },
            { n: "125,000,000", w: 360, y: 126 },
            { n: "62,500,000", w: 260, y: 163 },
            { n: "...", w: 180, y: 200 },
            { n: "1 EXACT ITEM", w: 140, y: 237 },
          ].map((tier, idx) => {
            const x = (880 - tier.w) / 2;
            const isFinal = idx === 6 && isBillion;
            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={tier.y}
                  width={tier.w}
                  height="30"
                  rx="15"
                  fill={isFinal ? "#10B981" : idx * 4 < count ? "#FFD166" : "#1E293B"}
                  stroke={isFinal ? "#A7F3D0" : idx * 4 < count ? "#FDE047" : "#334155"}
                  strokeWidth="2.5"
                />
                <text
                  x="440"
                  y={tier.y + 21}
                  fill={idx * 4 < count ? "#0B1120" : "#94A3B8"}
                  fontSize="15"
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {tier.n}
                </text>
              </g>
            );
          })}

          {/* Central Laser Beam Plunge */}
          <line x1="440" y1="5" x2="440" y2="280" stroke="#10B981" strokeWidth="4" strokeDasharray="6,6" />
        </svg>
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "14px 24px", borderRadius: 18, border: "2.5px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 800 }}>Search 1,000,000,000 Items:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isBillion ? "EXACTLY 30 QUESTIONS! ✓" : "Narrowing (1B → 1)..."}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 7. STAGE 7 & 8: O(N) VS O(log N) COMPLEXITY GRAPH SHOWDOWN (605-742)
// ═══════════════════════════════════════════════════════════════
const Visual7_ComplexityGraph: React.FC<{ frame: number; cutG: number; loopSeamCue: number }> = ({ frame, cutG, loopSeamCue }) => {
  const drawProgress = interpolate(frame - cutG, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #06B6D4",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.3)",
        padding: "24px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>📈</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Time Complexity: O(N) vs O(log N)
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.25)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          O(log N) TIME
        </span>
      </div>

      {/* SVG Mathematical Complexity Graph Plotter */}
      <div style={{ width: "100%", height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="300" viewBox="0 0 880 300">
          {/* Grid lines */}
          <line x1="100" y1="40" x2="840" y2="40" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="6,6" />
          <line x1="100" y1="120" x2="840" y2="120" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="6,6" />
          <line x1="100" y1="200" x2="840" y2="200" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="6,6" />

          {/* Coordinate Axes */}
          <line x1="100" y1="20" x2="100" y2="260" stroke="#64748B" strokeWidth="3.5" />
          <line x1="100" y1="260" x2="840" y2="260" stroke="#64748B" strokeWidth="3.5" />

          {/* Axis Labels */}
          <text x="85" y="45" fill="#EF4444" fontSize="18" fontWeight="900" textAnchor="end">1B Ops</text>
          <text x="85" y="255" fill="#10B981" fontSize="18" fontWeight="900" textAnchor="end">30 Ops</text>
          <text x="840" y="290" fill="#94A3B8" fontSize="18" fontWeight="900" textAnchor="end">N (1 Billion Items)</text>

          {/* O(N) Red Line Rocketing Straight to Ceiling */}
          <path
            d="M 100 260 L 520 30"
            fill="none"
            stroke="#EF4444"
            strokeWidth="6"
            strokeDasharray="700"
            strokeDashoffset={700 * (1 - drawProgress)}
          />
          <text x="535" y="40" fill="#EF4444" fontSize="22" fontWeight="900">O(N) Linear (1B Checks! 🐌❌)</text>

          {/* O(log N) Green Logarithmic Curve (Flatline Speed) */}
          <path
            d="M 100 260 Q 240 250 840 245"
            fill="none"
            stroke="#10B981"
            strokeWidth="6"
            strokeDasharray="800"
            strokeDashoffset={800 * (1 - drawProgress)}
          />
          <text x="560" y="230" fill="#10B981" fontSize="22" fontWeight="900">O(log N) Binary (30 Ops! ⚡✓)</text>
          <circle cx="840" cy="245" r="9" fill="#10B981" />
        </svg>
      </div>

      <div style={{ width: "100%", backgroundColor: "#03070D", padding: "14px 24px", borderRadius: 18, border: "1.5px solid rgba(6, 182, 212, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800 }}>Ask better questions — halve the search space!</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>HIRED 😎✓</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px)
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
