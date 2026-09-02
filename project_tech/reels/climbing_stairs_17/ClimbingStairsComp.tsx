import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { NemiMascot, NemiPose } from "../../src/components/NemiMascot";
import timelineData from "./timeline.json";

export const nemiTheme = {
  colors: {
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandGreen: "#10B981",
    brandRed: "#EF4444",
    brandAmber: "#F59E0B",
    brandPurple: "#A855F7",
    brandBlue: "#3B82F6",
    textHeadingDark: "#0F172A",
    textHeadingLight: "#F8FAFC",
    textMutedLight: "#64748B",
    textMutedDark: "#94A3B8",
    cardDark: "#0B1120",
    borderDark: "rgba(255, 255, 255, 0.12)",
    borderLight: "#E2E8F0",
  },
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
  },
};

export const ClimbingStairsComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = timelineData.total_frames || 868;

  // ─── Stage Boundaries (Synced with new Timeline Blocks) ───
  const cutB = 126;  // Nemi question -> dark mode
  const cutC = 245;  // Recursion tree meltdown
  const cutD = 364;  // Fibonacci secret
  const cutE = 507;  // DP 2-variable slider
  const cutF = 775;  // Victory -> light mode crossfade
  const cutG = 778;  // Loop seam

  // ─── Smooth Background Crossfade Transition (Light <-> Dark) ───
  const darkOpacity = interpolate(
    frame,
    [cutB - 12, cutB + 8, cutF - 12, cutF + 8],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const isDarkWorld = darkOpacity > 0.5;

  // Smoothly interpolated text and border colors
  const titleColor = interpolateColors(darkOpacity, [0, 1], ["#0F172A", "#F8FAFC"]);
  const hudBg = interpolateColors(darkOpacity, [0, 1], ["#FFFFFF", "#0F172A"]);
  const hudBorder = interpolateColors(darkOpacity, [0, 1], ["#E2E8F0", "rgba(255, 255, 255, 0.14)"]);
  const hudTextColor = interpolateColors(darkOpacity, [0, 1], ["#0F172A", "#F8FAFC"]);

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
    nemiPose = "puzzled";
    nemiSpeech = "Can't we just return climb(n-1) plus climb(n-2)? 🤔";
  } else if (frame < cutD) {
    nemiPose = "shocked";
  } else if (frame < cutE) {
    nemiPose = "explaining";
  } else if (frame < 647) {
    nemiPose = "aha";
  } else if (frame < 778) {
    nemiPose = "smug";
    nemiSpeech = "No 100-size array needed, just two numbers sliding up to 100! 😎⚡";
  } else {
    nemiPose = "smug";
  }

  // Meltdown impact flash
  const meltdownImpact =
    frame >= 280 && frame < 288
      ? interpolate(frame, [280, 283, 288], [0, 0.6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: nemiTheme.colors.canvasLight,
        fontFamily: nemiTheme.typography.fontFamily.sans,
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
        transformOrigin: "center center",
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* SMOOTH CROSSFADE DARK WORLD LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AbsoluteFill
        style={{
          backgroundColor: nemiTheme.colors.canvasDark,
          opacity: darkOpacity,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Voice + Ducked BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/climbing_stairs_17/voiceover.mp3")} volume={1.0} />

      {/* Synchronized SFX Layer */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutB} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutC} durationInFrames={30}>
        <Audio src={staticFile("sfx/error.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={cutD} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutE} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={580} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={cutG} durationInFrames={40}>
        <Audio src={staticFile("sfx/anime-wow.mp3")} volume={0.8} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* AMBIENT BACKGROUND GLOW (SMOOTH FADE) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: darkOpacity }}>
        <div
          style={{
            position: "absolute",
            top: 250,
            left: -100,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: frame < cutD
              ? "radial-gradient(circle, rgba(239, 68, 68, 0.22) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 600,
            right: -100,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP HUD (Safe Zone: top: 85px) */}
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
              backgroundColor: isDarkWorld
                ? (frame >= cutD ? nemiTheme.colors.brandCyan : nemiTheme.colors.brandRed)
                : nemiTheme.colors.brandAmber,
              boxShadow: `0 0 20px ${isDarkWorld ? (frame >= cutD ? "#06B6D4" : "#EF4444") : "#F59E0B"}`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: isDarkWorld ? (frame >= cutD ? "#06B6D4" : "#EF4444") : "#D97706",
            }}
          >
            Ep.17 · Climbing Stairs
          </span>
        </div>

        <div
          style={{
            backgroundColor: hudBg,
            padding: "10px 22px",
            borderRadius: 24,
            border: `2px solid ${hudBorder}`,
            fontSize: 20,
            fontWeight: 900,
            color: hudTextColor,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {frame < cutB
            ? "100-STEP PUZZLE"
            : frame < cutC
            ? "RECURSION TRAP"
            : frame < cutD
            ? "O(2^N) MELTDOWN"
            : frame < cutE
            ? "FIBONACCI LAW"
            : frame < cutG
            ? "2-VARIABLE SLIDER"
            : "O(1) SPACE VICTORY"}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MAIN HEADLINE TITLE (Safe Zone: top: 165px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 165,
          left: 70,
          right: 70,
          textAlign: "center",
          zIndex: 55,
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            letterSpacing: -1.5,
            lineHeight: 1.15,
            color: titleColor,
          }}
        >
          {frame < cutB ? (
            <>
              How Many Ways To <span style={{ color: nemiTheme.colors.brandAmber }}>Climb 100 Stairs?</span> 🪜
            </>
          ) : frame < cutC ? (
            <>
              Can We Just Call <span style={{ color: nemiTheme.colors.brandYellow }}>climb(n-1) + climb(n-2)?</span> 🤔
            </>
          ) : frame < cutD ? (
            <>
              Pure Recursion = <span style={{ color: nemiTheme.colors.brandRed }}>O(2^N) CPU Melt!</span> 💥
            </>
          ) : frame < cutE ? (
            <>
              Step N = <span style={{ color: nemiTheme.colors.brandCyan }}>Step(N-1) + Step(N-2)!</span> ⚡
            </>
          ) : frame < cutG ? (
            <>
              How 2 Variables <span style={{ color: nemiTheme.colors.brandGreen }}>Slide Up In O(N) Time!</span> 🚀
            </>
          ) : (
            <>
              Solved in <span style={{ color: nemiTheme.colors.brandGreen }}>O(1) Space</span> &{" "}
              <span style={{ color: nemiTheme.colors.brandCyan }}>O(N) Time!</span> 👑
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC OPEN-CANVAS SPATIAL VISUAL STAGES */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* STAGE 1: DYNAMIC LEAPING ISOMETRIC STAIRCASE (0 to 126) */}
      {frame < cutB + 6 && (
        <div style={{ opacity: interpolate(frame, [cutB - 6, cutB + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <OpenVisual1_Staircase frame={frame} />
        </div>
      )}

      {/* STAGE 2: EXPONENTIAL RECURSION TREE MELTDOWN & SIZZLING CPU (126 to 364) */}
      {frame >= cutB - 6 && frame < cutD + 6 && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [cutB - 6, cutB + 6, cutD - 6, cutD + 6],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <OpenVisual2_RecursionMeltdown frame={frame} cutC={cutC} />
        </div>
      )}

      {/* STAGE 3: FIBONACCI STEP-BACK CONVERGENCE CONDUITS (364 to 507) */}
      {frame >= cutD - 6 && frame < cutE + 6 && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [cutD - 6, cutD + 6, cutE - 6, cutE + 6],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <OpenVisual3_FibonacciLaw frame={frame} />
        </div>
      )}

      {/* STAGE 4: EXPLICIT 2-VARIABLE SLIDING MEMORY ENGINE (507 to 777) */}
      {frame >= cutE - 6 && frame < cutG + 6 && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [cutE - 6, cutE + 6, cutG - 6, cutG + 6],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <OpenVisual4_DPSlider frame={frame} />
        </div>
      )}

      {/* STAGE 5: VICTORY PYTHON CODE & SCANLINE COMPLEXITY (777 to 868) */}
      {frame >= cutG - 6 && (
        <div style={{ opacity: interpolate(frame, [cutG - 6, cutG + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <OpenVisual5_VictoryCode frame={frame} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} />}

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

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CHANNEL WATERMARK */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          fontSize: 16,
          fontWeight: 800,
          color: isDarkWorld ? "rgba(255, 255, 255, 0.35)" : "rgba(15, 23, 42, 0.35)",
          letterSpacing: "0.5px",
          zIndex: 40,
        }}
      >
        @nemi.explains
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TACTILE MELTDOWN FLASH */}
      {/* ══════════════════════════════════════════════════════════ */}
      {meltdownImpact > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#EF4444",
            opacity: meltdownImpact,
            pointerEvents: "none",
            zIndex: 99,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 1. STAGE 1: DYNAMIC LEAPING ISOMETRIC STAIRCASE (0 to 126)
// ═══════════════════════════════════════════════════════════════
const OpenVisual1_Staircase: React.FC<{ frame: number }> = ({ frame }) => {
  const stepPositions = [
    { x: 120, y: 420 }, // Ground
    { x: 260, y: 350 }, // Step 1
    { x: 400, y: 280 }, // Step 2
    { x: 540, y: 210 }, // Step 3
    { x: 680, y: 140 }, // Step 4
    { x: 825, y: 70 },  // Step 100
  ];

  const totalSteps = stepPositions.length - 1;
  const cycleProgress = (frame * 0.05) % totalSteps;
  const currentStepIdx = Math.floor(cycleProgress);
  const nextStepIdx = Math.min(currentStepIdx + 1, totalSteps);
  const stepT = cycleProgress - currentStepIdx;

  const fromPos = stepPositions[currentStepIdx];
  const toPos = stepPositions[nextStepIdx];
  const orbX = fromPos.x + (toPos.x - fromPos.x) * stepT;
  const arcHeight = 70;
  const orbY = fromPos.y + (toPos.y - fromPos.y) * stepT - 4 * arcHeight * stepT * (1 - stepT);

  const dashOffset = -frame * 8;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Challenge Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FFFFFF",
          border: "2px solid #F59E0B",
          borderRadius: 999,
          padding: "10px 28px",
          boxShadow: "0 8px 25px rgba(245, 158, 11, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 22 }}>🪜</span>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#B45309", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          LEETCODE 70: CLIMB 100 STAIRS (1 OR 2 STEPS AT A TIME)
        </span>
      </div>

      {/* SVG Neon Staircase with Dynamic Jumping Orb */}
      <div style={{ position: "absolute", top: 380, left: 70, right: 70, height: 500 }}>
        <svg width="940" height="500" viewBox="0 0 940 500">
          <defs>
            <linearGradient id="stairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="arc1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="arc2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* 6 Escalating Stair Steps */}
          {[
            { step: "Ground", x: 60, y: 420, w: 120, h: 50, val: "0" },
            { step: "Step 1", x: 200, y: 350, w: 120, h: 120, val: "1 Way" },
            { step: "Step 2", x: 340, y: 280, w: 120, h: 190, val: "2 Ways" },
            { step: "Step 3", x: 480, y: 210, w: 120, h: 260, val: "3 Ways" },
            { step: "Step 4", x: 620, y: 140, w: 120, h: 330, val: "5 Ways" },
            { step: "Step 100", x: 760, y: 70, w: 130, h: 400, val: "? Ways" },
          ].map((s, idx) => {
            const isStepActive = currentStepIdx === idx;
            return (
              <g key={idx}>
                <rect
                  x={s.x}
                  y={s.y}
                  width={s.w}
                  height={s.h}
                  rx="14"
                  fill={idx === 5 ? "url(#stairGrad)" : isStepActive ? "#FEF3C7" : "#FFFFFF"}
                  stroke={idx === 5 ? "#D97706" : isStepActive ? "#F59E0B" : "#CBD5E1"}
                  strokeWidth={isStepActive ? "4" : "3"}
                />
                <text x={s.x + s.w / 2} y={s.y + 36} fill="#0F172A" fontSize="18" fontWeight="900" textAnchor="middle">
                  {s.step}
                </text>
                <text x={s.x + s.w / 2} y={s.y + 64} fill={idx === 5 ? "#B45309" : "#64748B"} fontSize="15" fontWeight="800" textAnchor="middle" fontFamily="monospace">
                  {s.val}
                </text>
              </g>
            );
          })}

          {/* Flowing Laser Arc: +1 Step (Cyan) */}
          <path
            d="M 260 350 Q 330 260 400 280"
            fill="none"
            stroke="url(#arc1Grad)"
            strokeWidth="4"
            strokeDasharray="8 6"
            strokeDashoffset={dashOffset}
          />
          <text x="330" y="270" fill="#0891B2" fontSize="16" fontWeight="900" textAnchor="middle">
            +1 Step 👉
          </text>

          {/* Flowing Laser Arc: +2 Steps (Amber) */}
          <path
            d="M 260 350 Q 400 130 540 210"
            fill="none"
            stroke="url(#arc2Grad)"
            strokeWidth="5"
            strokeDasharray="10 8"
            strokeDashoffset={dashOffset * 1.2}
          />
          <text x="400" y="160" fill="#DC2626" fontSize="18" fontWeight="900" textAnchor="middle">
            +2 Steps 🚀
          </text>

          {/* Living Jumping Energy Orb */}
          <g transform={`translate(${orbX}, ${orbY})`}>
            <circle r="22" fill="#F59E0B" opacity="0.4" filter="blur(6px)" />
            <circle r="14" fill="#FFD166" stroke="#B45309" strokeWidth="3" />
            <text x="0" y="5" fill="#18181B" fontSize="12" fontWeight="900" textAnchor="middle">🏃</text>
          </g>
        </svg>
      </div>

      {/* Floating Bottom Callout Banner */}
      <div
        style={{
          position: "absolute",
          top: 940,
          left: 80,
          right: 80,
          backgroundColor: "#FFFFFF",
          padding: "16px 28px",
          borderRadius: 20,
          border: "2px solid #E2E8F0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#64748B", fontSize: 18, fontWeight: 700 }}>Decision at every step:</span>
        <span style={{ color: "#D97706", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          CHOOSE 1 STEP OR 2 STEPS! 🪜
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. STAGE 2: EXPONENTIAL RECURSION TREE MELTDOWN & SIZZLING CPU (126 to 364)
// ═══════════════════════════════════════════════════════════════
const OpenVisual2_RecursionMeltdown: React.FC<{ frame: number; cutC: number }> = ({ frame, cutC }) => {
  const isMeltdown = frame >= cutC;
  const pulse = Math.sin(frame * 0.4);
  const scanLaserY = 120 + 200 * (0.5 + 0.5 * Math.sin(frame * 0.15));

  const cpuTemp = isMeltdown
    ? Math.min(125, Math.floor(65 + (frame - cutC) * 0.6 + 5 * Math.sin(frame * 0.8)))
    : 45;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Telemetry Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: isMeltdown ? "rgba(239, 68, 68, 0.25)" : "rgba(245, 158, 11, 0.2)",
            border: `2px solid ${isMeltdown ? "#EF4444" : "#F59E0B"}`,
            borderRadius: 999,
            padding: "8px 24px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>{isMeltdown ? "💥" : "🌲"}</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: isMeltdown ? "#FCA5A5" : "#FDE68A" }}>
            {isMeltdown ? "O(2^N) RECURSION TREE EXPLOSION" : "NAIVE RECURSION: climb(n-1) + climb(n-2)"}
          </span>
        </div>

        {/* Live CPU Sizzle Meter */}
        <div
          style={{
            backgroundColor: isMeltdown ? "rgba(239, 68, 68, 0.35)" : "rgba(15, 23, 42, 0.9)",
            border: `2px solid ${isMeltdown ? "#EF4444" : "#F59E0B"}`,
            borderRadius: 999,
            padding: "8px 24px",
            fontSize: 18,
            fontWeight: 900,
            color: isMeltdown ? "#FF8080" : "#F59E0B",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>{isMeltdown ? "🔥" : "❄️"}</span>
          <span>{`CPU TEMP: ${cpuTemp}°C`}</span>
        </div>
      </div>

      {/* SVG Branching Recursion Tree (top: 380px) */}
      <div style={{ position: "absolute", top: 380, left: 70, right: 70, height: 480 }}>
        <svg width="940" height="480" viewBox="0 0 940 480">
          {/* Scanning Red Laser Beam during Meltdown */}
          {isMeltdown && (
            <line
              x1="50"
              y1={scanLaserY}
              x2="890"
              y2={scanLaserY}
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              opacity="0.85"
            />
          )}

          {/* Tree Branches */}
          <line x1="470" y1="60" x2="270" y2="180" stroke={isMeltdown ? "#EF4444" : "#475569"} strokeWidth="3" />
          <line x1="470" y1="60" x2="670" y2="180" stroke={isMeltdown ? "#EF4444" : "#475569"} strokeWidth="3" />
          
          <line x1="270" y1="180" x2="160" y2="310" stroke={isMeltdown ? "#EF4444" : "#475569"} strokeWidth="2.5" />
          <line x1="270" y1="180" x2="360" y2="310" stroke={isMeltdown ? "#EF4444" : "#475569"} strokeWidth="2.5" />
          
          <line x1="670" y1="180" x2="570" y2="310" stroke={isMeltdown ? "#EF4444" : "#475569"} strokeWidth="2.5" />
          <line x1="670" y1="180" x2="770" y2="310" stroke={isMeltdown ? "#EF4444" : "#475569"} strokeWidth="2.5" />

          {/* Level 0: Root */}
          <g transform="translate(470, 60)">
            <circle r="42" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
            <text x="0" y="8" fill="#FFF" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace">f(5)</text>
          </g>

          {/* Level 1 */}
          <g transform="translate(270, 180)">
            <circle r="38" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
            <text x="0" y="7" fill="#FFF" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">f(4)</text>
          </g>
          <g transform="translate(670, 180)">
            {/* Duplicate f(3) in Red with Pulsing Shockwave */}
            {isMeltdown && <circle r={46 + pulse * 4} fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.6" />}
            <circle r="38" fill={isMeltdown ? "rgba(239, 68, 68, 0.4)" : "#1E293B"} stroke={isMeltdown ? "#EF4444" : "#F59E0B"} strokeWidth="3.5" />
            <text x="0" y="7" fill="#FFF" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">f(3) ⚠️</text>
          </g>

          {/* Level 2: Duplicates */}
          <g transform="translate(160, 310)">
            {/* Duplicate f(3) in Red */}
            {isMeltdown && <circle r={42 + pulse * 4} fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.6" />}
            <circle r="34" fill={isMeltdown ? "rgba(239, 68, 68, 0.4)" : "#1E293B"} stroke={isMeltdown ? "#EF4444" : "#F59E0B"} strokeWidth="3.5" />
            <text x="0" y="6" fill="#FFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">f(3) ⚠️</text>
          </g>
          <g transform="translate(360, 310)">
            <circle r="34" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
            <text x="0" y="6" fill="#FFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">f(2)</text>
          </g>
          <g transform="translate(570, 310)">
            <circle r="34" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
            <text x="0" y="6" fill="#FFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">f(2)</text>
          </g>
          <g transform="translate(770, 310)">
            <circle r="34" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
            <text x="0" y="6" fill="#FFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">f(1)</text>
          </g>
        </svg>
      </div>

      {/* Floating Warning Banner (top: 890px) */}
      <div
        style={{
          position: "absolute",
          top: 890,
          left: 70,
          right: 70,
          backgroundColor: isMeltdown ? "rgba(239, 68, 68, 0.25)" : "#0F172A",
          padding: "18px 28px",
          borderRadius: 20,
          border: `2px solid ${isMeltdown ? "#EF4444" : "#475569"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>
          {isMeltdown ? "💥 Redundant Duplicate Computations:" : "Tree branches duplicate wildly:"}
        </span>
        <span style={{ color: isMeltdown ? "#EF4444" : "#F59E0B", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isMeltdown ? "f(3) RECALCULATED MULTIPLE TIMES!" : "O(2^N) TIME"}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. STAGE 3: FIBONACCI STEP-BACK CONVERGENCE CONDUITS (364 to 507)
// ═══════════════════════════════════════════════════════════════
const OpenVisual3_FibonacciLaw: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.25);
  const flowOffset = -frame * 10;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Dual Feeder Source Cards */}
      <div style={{ position: "absolute", top: 320, left: 70, right: 70, display: "flex", gap: 24 }}>
        {/* Source 1: Step N-1 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(6, 182, 212, 0.16)",
            border: "3px solid #06B6D4",
            borderRadius: 28,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: "0 16px 45px rgba(6, 182, 212, 0.35)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 44 }}>1️⃣</span>
            <span style={{ backgroundColor: "#06B6D4", color: "#000", fontSize: 18, fontWeight: 900, padding: "6px 16px", borderRadius: 14 }}>
              1 STEP JUMP
            </span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#FFF" }}>From Step N-1</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#67E8F9" }}>ways(N-1) total paths!</div>
        </div>

        {/* Source 2: Step N-2 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(245, 158, 11, 0.16)",
            border: "3px solid #F59E0B",
            borderRadius: 28,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: "0 16px 45px rgba(245, 158, 11, 0.35)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 44 }}>2️⃣</span>
            <span style={{ backgroundColor: "#F59E0B", color: "#000", fontSize: 18, fontWeight: 900, padding: "6px 16px", borderRadius: 14 }}>
              2 STEP JUMP
            </span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#FFF" }}>From Step N-2</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#FDE68A" }}>ways(N-2) total paths!</div>
        </div>
      </div>

      {/* Fibonacci Convergence Equation Box with Flowing Energy Paths (top: 590px) */}
      <div style={{ position: "absolute", top: 590, left: 70, right: 70, height: 260 }}>
        <svg width="940" height="260" viewBox="0 0 940 260">
          {/* Flowing Energy Beams into Center */}
          <path
            d="M 180 0 Q 300 80 470 80"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3.5"
            strokeDasharray="8 6"
            strokeDashoffset={flowOffset}
          />
          <path
            d="M 760 0 Q 640 80 470 80"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.5"
            strokeDasharray="8 6"
            strokeDashoffset={flowOffset}
          />

          <rect x="80" y="30" width="780" height="200" rx="24" fill="#0B1120" stroke="#06B6D4" strokeWidth="3" />
          <text x="470" y="85" fill="#67E8F9" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            THE CLIMBING STAIRS LAW:
          </text>
          <text x="470" y="145" fill="#FFD166" fontSize="36" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            ways(N) = ways(N-1) + ways(N-2) ⚡
          </text>
          <text x="470" y="195" fill="#94A3B8" fontSize="18" fontWeight="700" textAnchor="middle">
            (Every path to Step N MUST pass through N-1 or N-2!)
          </text>
        </svg>
      </div>

      {/* Floating Bottom Rule Banner (top: 890px) */}
      <div
        style={{
          position: "absolute",
          top: 890,
          left: 70,
          right: 70,
          backgroundColor: "#03070D",
          padding: "20px 32px",
          borderRadius: 24,
          border: "2.5px solid #06B6D4",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 16px 45px rgba(6, 182, 212, 0.25)",
          transform: `scale(${1 + pulse * 0.02})`,
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 800 }}>Mathematical Insight:</span>
        <span style={{ color: "#FFD166", fontWeight: 900, fontSize: 26, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          IT IS LITERALLY FIBONACCI! 🧠
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STAGE 4: EXPLICIT 2-VARIABLE SLIDING MEMORY ENGINE (507 to 777)
// ═══════════════════════════════════════════════════════════════
const OpenVisual4_DPSlider: React.FC<{ frame: number }> = ({ frame }) => {
  // Clear Step-by-Step Simulation Progression perfectly aligned with voiceover:
  // Frame 508-545 ("Start with a at 1 and b at 2"): Registers init
  // Frame 545-585 ("Add them to get the next step"): 1 + 2 = 3 (Step 3)
  // Frame 585-645 ("then slide them forward!"): Shift a<-2, b<-3, 2+3=5 (Step 4), a<-3, b<-5
  // Frame 647-777 (Nemi: "No 100-size array needed, just two numbers sliding up to 100!"): Flash forward to 100!
  let currentStep = 3;
  let valA = 1;
  let valB = 2;
  let nextSum = 3;
  let phaseText = "INITIALIZE: a = 1 (Step 1), b = 2 (Step 2)";

  if (frame >= 545 && frame < 585) {
    currentStep = 3;
    valA = 1;
    valB = 2;
    nextSum = 3;
    phaseText = "ADD: 1 + 2 = 3 (Step 3 Ways)";
  } else if (frame >= 585 && frame < 620) {
    currentStep = 4;
    valA = 2;
    valB = 3;
    nextSum = 5;
    phaseText = "SLIDE: a ← 2, b ← 3 → Next Sum = 5 (Step 4)";
  } else if (frame >= 620 && frame < 647) {
    currentStep = 5;
    valA = 3;
    valB = 5;
    nextSum = 8;
    phaseText = "SLIDE: a ← 3, b ← 5 → Next Sum = 8 (Step 5)";
  } else if (frame >= 647) {
    currentStep = 100;
    valA = 218922995834555169026;
    valB = 354224848179261915075;
    nextSum = 354224848179261915075;
    phaseText = "SLID TO STEP 100! 🚀 NO ARRAY ALLOCATED!";
  }

  const pulse = Math.sin(frame * 0.3);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Top Telemetry Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.22)",
            border: "2px solid #10B981",
            borderRadius: 999,
            padding: "10px 28px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 24 }}>⚡</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#6EE7B7", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            {phaseText}
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            border: "2px solid #10B981",
            borderRadius: 999,
            padding: "10px 24px",
            fontSize: 20,
            fontWeight: 900,
            color: "#10B981",
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          O(1) SPACE (2 INTEGERS)
        </div>
      </div>

      {/* 2 Big Glowing Memory Registers in Center (top: 380px) */}
      <div style={{ position: "absolute", top: 380, left: 70, right: 70, display: "flex", gap: 30 }}>
        {/* Register A */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(6, 182, 212, 0.14)",
            border: "3.5px solid #06B6D4",
            borderRadius: 28,
            padding: "26px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 18px 50px rgba(6, 182, 212, 0.3)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <span style={{ backgroundColor: "#06B6D4", color: "#000", fontSize: 16, fontWeight: 900, padding: "4px 14px", borderRadius: 12 }}>
              VARIABLE A
            </span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#67E8F9" }}>Step (N-2)</span>
          </div>
          <div style={{ fontSize: 64, fontWeight: 900, color: "#FFFFFF", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            {currentStep === 100 ? "218Q..." : valA}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#94A3B8" }}>Previous-2 ways</div>
        </div>

        {/* Central Plus Fusion Icon */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#10B981",
              color: "#000",
              fontSize: 34,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 25px rgba(16, 185, 129, 0.6)",
              transform: `scale(${1 + pulse * 0.08})`,
            }}
          >
            +
          </div>
        </div>

        {/* Register B */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(245, 158, 11, 0.14)",
            border: "3.5px solid #F59E0B",
            borderRadius: 28,
            padding: "26px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 18px 50px rgba(245, 158, 11, 0.3)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <span style={{ backgroundColor: "#F59E0B", color: "#000", fontSize: 16, fontWeight: 900, padding: "4px 14px", borderRadius: 12 }}>
              VARIABLE B
            </span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#FDE68A" }}>Step (N-1)</span>
          </div>
          <div style={{ fontSize: 64, fontWeight: 900, color: "#FFFFFF", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            {currentStep === 100 ? "354Q..." : valB}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#94A3B8" }}>Previous-1 ways</div>
        </div>
      </div>

      {/* Real-time Calculation & Shifting Box (top: 640px) */}
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 70,
          right: 70,
          backgroundColor: "#0B1120",
          borderRadius: 26,
          border: "2.5px solid #10B981",
          padding: "20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          boxShadow: "0 16px 45px rgba(16, 185, 129, 0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#6EE7B7", fontSize: 18, fontWeight: 900, letterSpacing: "1px" }}>
            HOW THE TWO VARIABLES SLIDE:
          </span>
          <span style={{ color: "#FFD166", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            a, b = b, a + b
          </span>
        </div>

        {/* Shift explanation step */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#FFF", fontSize: 24, fontWeight: 800 }}>
          <div>
            1. New Sum = <span style={{ color: "#10B981" }}>{currentStep === 100 ? "354 Quintillion 🚀" : nextSum}</span>
          </div>
          <div>👉</div>
          <div>
            2. Shift: <span style={{ color: "#06B6D4" }}>a ← {currentStep === 100 ? "218Q" : valB}</span>,{" "}
            <span style={{ color: "#F59E0B" }}>b ← {currentStep === 100 ? "354Q" : nextSum}</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Ledger (top: 890px) */}
      <div
        style={{
          position: "absolute",
          top: 890,
          left: 70,
          right: 70,
          backgroundColor: "#03070D",
          padding: "18px 28px",
          borderRadius: 22,
          border: "2px solid #10B981",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 14px 40px rgba(16, 185, 129, 0.25)",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Memory Optimization:</span>
        <span style={{ color: "#6EE7B7", fontWeight: 900, fontSize: 22, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ZERO ARRAY ALLOCATIONS (2 INTEGERS ONLY!) ✓
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. STAGE 5: VICTORY PYTHON CODE & SCANLINE COMPLEXITY (777 to 868)
// ═══════════════════════════════════════════════════════════════
const OpenVisual5_VictoryCode: React.FC<{ frame: number }> = ({ frame }) => {
  const scanlineY = ((frame * 4) % 180) + 20;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25 }}>
      {/* Floating Victory Header Pill */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FFFFFF",
          border: "2.5px solid #10B981",
          borderRadius: 999,
          padding: "10px 32px",
          boxShadow: "0 12px 35px rgba(16, 185, 129, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 26 }}>🏆</span>
        <span style={{ fontSize: 22, fontWeight: 900, color: "#059669", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Climbing Stairs Victory
        </span>
      </div>

      {/* Floating Python Code Card with Scanline Laser (top: 380px) */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 70,
          right: 70,
          backgroundColor: "#0B1120",
          borderRadius: 28,
          border: "3px solid #06B6D4",
          padding: "26px 36px",
          fontFamily: nemiTheme.typography.fontFamily.mono,
          color: "#E2E8F0",
          fontSize: 22,
          lineHeight: 1.6,
          boxShadow: "0 20px 60px rgba(6, 182, 212, 0.25)",
          overflow: "hidden",
        }}
      >
        {/* Active Laser Scanning Beam */}
        <div
          style={{
            position: "absolute",
            top: scanlineY,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent, #06B6D4, transparent)",
            boxShadow: "0 0 12px #06B6D4",
          }}
        />

        <div><span style={{ color: "#F43F5E" }}>def</span> <span style={{ color: "#67E8F9" }}>climbStairs</span>(n: <span style={{ color: "#FBBF24" }}>int</span>) -&gt; <span style={{ color: "#FBBF24" }}>int</span>:</div>
        <div style={{ paddingLeft: 32 }}>a, b = <span style={{ color: "#A78BFA" }}>1</span>, <span style={{ color: "#A78BFA" }}>2</span></div>
        <div style={{ paddingLeft: 32 }}><span style={{ color: "#F43F5E" }}>for</span> _ <span style={{ color: "#F43F5E" }}>in</span> <span style={{ color: "#67E8F9" }}>range</span>(n - <span style={{ color: "#A78BFA" }}>1</span>):</div>
        <div style={{ paddingLeft: 64 }}>a, b = b, a + b</div>
        <div style={{ paddingLeft: 32, color: "#10B981", fontWeight: 700 }}><span style={{ color: "#F43F5E" }}>return</span> a <span style={{ color: "#94A3B8" }}># 🎯 O(1) Space!</span></div>
      </div>

      {/* Floating Complexity Scorecard (top: 840px) */}
      <div style={{ position: "absolute", top: 840, left: 70, right: 70, display: "flex", gap: 24 }}>
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            border: "3px solid #06B6D4",
            borderRadius: 24,
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 12px 35px rgba(6, 182, 212, 0.15)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: "#64748B" }}>TIME COMPLEXITY</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: "#0891B2" }}>O(N) ⚡</div>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            border: "3px solid #10B981",
            borderRadius: 24,
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 12px 35px rgba(16, 185, 129, 0.15)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: "#64748B" }}>SPACE COMPLEXITY</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: "#059669" }}>O(1) 🧠</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px)
// ═══════════════════════════════════════════════════════════════
const DynamicKaraokeCaptions: React.FC<{ frame: number }> = ({ frame }) => {
  const subtitles = timelineData.subtitles || [];

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
