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

export const IslandsComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = timelineData.total_frames || 662;

  // ─── Stage Timing Cut Points (Strict 22.08s / 662 frames) ───
  const cutB = 142; // Stage 1 -> Stage 2 (Double-Count Loop Trap)
  const cutC = 202; // Stage 2 -> Stage 3 (Tsunami Sink Impact)
  const cutD = 335; // Stage 3 -> Stage 4 (4-Way DFS Compass Laser)
  const cutE = 445; // Stage 4 -> Stage 5 (High-Speed Radar Sweep across Islands 2 & 3)
  const cutF = 530; // Stage 5 -> Stage 6 (LeetCode 200 Victory Arena & Light Mode Loop)

  // ─── Smooth Background Crossfade (Light <-> Dark) ───
  const darkOpacity = interpolate(
    frame,
    [cutB - 10, cutB + 8, cutF - 10, cutF + 8],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const isDarkWorld = darkOpacity > 0.5;

  const titleColor = interpolateColors(darkOpacity, [0, 1], ["#0F172A", "#F8FAFC"]);
  const hudBg = interpolateColors(darkOpacity, [0, 1], ["#FFFFFF", "#0F172A"]);
  const hudBorder = interpolateColors(darkOpacity, [0, 1], ["#E2E8F0", "rgba(255, 255, 255, 0.14)"]);
  const hudTextColor = interpolateColors(darkOpacity, [0, 1], ["#0F172A", "#F8FAFC"]);

  // Camera Zoom Ramp (High Energy)
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "thinking";
  } else if (frame < cutC) {
    nemiPose = "puzzled";
    nemiSpeech = "Won't we count the same island ten times? 🤔";
  } else if (frame < cutD) {
    nemiPose = "explaining";
  } else if (frame < cutE) {
    nemiPose = "aha";
  } else if (frame < cutF) {
    nemiPose = "smug";
    nemiSpeech = "So the island vanishes, and we never double-count it! 😎⚡";
  } else {
    nemiPose = "smug";
  }

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
      {/* Dark World Layer */}
      <AbsoluteFill
        style={{
          backgroundColor: nemiTheme.colors.canvasDark,
          opacity: darkOpacity,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Master Audio Track */}
      <Audio src={staticFile("reels/islands_19/voiceover.mp3")} volume={1.0} />

      {/* Synchronized SFX */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutB} durationInFrames={25}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutC} durationInFrames={30}>
        <Audio src={staticFile("sfx/error.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={cutD} durationInFrames={30}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutF} durationInFrames={35}>
        <Audio src={staticFile("sfx/anime-wow.mp3")} volume={0.8} />
      </Sequence>

      {/* Ambient Radial Glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: darkOpacity }}>
        <div
          style={{
            position: "absolute",
            top: 250,
            left: -100,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)",
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
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* TOP HUD (Safe Zone: top: 85px) */}
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
              backgroundColor: isDarkWorld ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandBlue,
              boxShadow: `0 0 20px ${isDarkWorld ? "#10B981" : "#3B82F6"}`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: isDarkWorld ? "#10B981" : "#2563EB",
            }}
          >
            LeetCode 200
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
            ? "OCEAN MAP RADAR"
            : frame < cutC
            ? "DOUBLE-COUNT TRAP"
            : frame < cutD
            ? "TSUNAMI SINK"
            : frame < cutE
            ? "4-WAY DFS COMPASS"
            : "O(M×N) LINEAR SWEEP"}
        </div>
      </div>

      {/* MAIN HEADLINE TITLE (Safe Zone: top: 165px) */}
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
              How To Count Islands In <span style={{ color: nemiTheme.colors.brandGreen }}>Just 1 Pass?</span> 🏝️⚡
            </>
          ) : frame < cutC ? (
            <>
              Won't We Count The <span style={{ color: nemiTheme.colors.brandRed }}>Same Island 10 Times?</span> ⚠️
            </>
          ) : frame < cutD ? (
            <>
              Touch A Land Tile? <span style={{ color: nemiTheme.colors.brandCyan }}>Sink It Underwater!</span> 🌊
            </>
          ) : frame < cutE ? (
            <>
              4-Way DFS Compass <span style={{ color: nemiTheme.colors.brandGreen }}>Fires In All Directions!</span> 🧭
            </>
          ) : (
            <>
              All Islands Sunk In <span style={{ color: nemiTheme.colors.brandGreen }}>O(M × N) Time!</span> 👑
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 6 DIVERSE, DYNAMIC, PHYSICAL VISUAL STAGES */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* STAGE 1: THE TOP-DOWN SATELLITE OCEAN ARCHIPELAGO (0 to 142) */}
      {frame < cutB + 6 && (
        <div style={{ opacity: interpolate(frame, [cutB - 6, cutB + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Stage1_OceanArchipelago frame={frame} />
        </div>
      )}

      {/* STAGE 2: THE INFINITE DOUBLE-COUNT LOOP TRAP (142 to 202) */}
      {frame >= cutB - 6 && frame < cutC + 6 && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [cutB - 6, cutB + 6, cutC - 6, cutC + 6],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <Stage2_DoubleCountTrap frame={frame} />
        </div>
      )}

      {/* STAGE 3: THE TSUNAMI SINK WATER IMPACT (202 to 335) */}
      {frame >= cutC - 6 && frame < cutD + 6 && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [cutC - 6, cutC + 6, cutD - 6, cutD + 6],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <Stage3_TsunamiSink frame={frame} />
        </div>
      )}

      {/* STAGE 4: THE 4-WAY DFS LASER COMPASS (335 to 445) */}
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
          <Stage4_DFSCompass frame={frame} />
        </div>
      )}

      {/* STAGE 5: HIGH-SPEED RADAR SWEEP & MULTI-ISLAND VICTORY (445 to 662) */}
      {frame >= cutE - 6 && (
        <div style={{ opacity: interpolate(frame, [cutE - 6, cutE + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Stage5_RadarSweepVictory frame={frame} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} />}

      {/* HERO MASCOT DOCK (Safe Zone: bottom: 70px) */}
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

      {/* NEMI SPEECH BUBBLE (bottom: 440px) */}
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
            width: "90%",
            maxWidth: 920,
          }}
        >
          <div
            style={{
              backgroundColor: nemiTheme.colors.brandYellow,
              color: "#18181B",
              fontWeight: 900,
              fontSize: 28,
              lineHeight: 1.3,
              padding: "16px 32px",
              borderRadius: 26,
              border: "3.5px solid #18181B",
              boxShadow: "0 18px 45px rgba(0, 0, 0, 0.45)",
              textAlign: "center",
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

      {/* CHANNEL WATERMARK */}
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
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// 1. STAGE 1: SATELLITE OCEAN ARCHIPELAGO (0 to 142)
// ═══════════════════════════════════════════════════════════════
const Stage1_OceanArchipelago: React.FC<{ frame: number }> = ({ frame }) => {
  const radarAngle = (frame * 3.5) % 360;
  const pulse = Math.sin(frame * 0.2);

  return (
    <div style={{ position: "absolute", top: 340, left: 70, right: 70, height: 620, zIndex: 30 }}>
      {/* 3D Top-Down Ocean Viewport */}
      <div
        style={{
          width: "100%",
          height: 500,
          backgroundColor: "#082F49",
          borderRadius: 32,
          border: "3.5px solid #0284C7",
          boxShadow: "0 25px 70px rgba(2, 132, 199, 0.35)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Water Ripple Rings */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <circle cx="280" cy="220" r={80 + pulse * 10} fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="3" />
          <circle cx="700" cy="180" r={70 + pulse * 8} fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="3" />
          <circle cx="480" cy="380" r={65 + pulse * 8} fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="3" />

          {/* Rotating Radar Scanner Cone */}
          <line
            x1="470"
            y1="250"
            x2={470 + 400 * Math.cos((radarAngle * Math.PI) / 180)}
            y2={250 + 400 * Math.sin((radarAngle * Math.PI) / 180)}
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            opacity="0.85"
          />
        </svg>

        {/* 3 Physical Island Landmasses */}
        {/* Island 1 (Alpha - Top Left) */}
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 180,
            width: 180,
            height: 140,
            backgroundColor: "#10B981",
            borderRadius: "45% 55% 60% 40%",
            border: "4px solid #6EE7B7",
            boxShadow: "0 12px 30px rgba(16, 185, 129, 0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 32 }}>🌴</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#FFF", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Island #1 [1 1]
          </span>
        </div>

        {/* Island 2 (Beta - Top Right) */}
        <div
          style={{
            position: "absolute",
            top: 110,
            right: 140,
            width: 150,
            height: 180,
            backgroundColor: "#10B981",
            borderRadius: "50% 50% 40% 60%",
            border: "4px solid #6EE7B7",
            boxShadow: "0 12px 30px rgba(16, 185, 129, 0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 32 }}>🌴</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#FFF", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Island #2 [1]
          </span>
        </div>

        {/* Island 3 (Gamma - Bottom Center) */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 380,
            width: 170,
            height: 120,
            backgroundColor: "#10B981",
            borderRadius: "60% 40% 50% 50%",
            border: "4px solid #6EE7B7",
            boxShadow: "0 12px 30px rgba(16, 185, 129, 0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 30 }}>🌴</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#FFF", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Island #3 [1]
          </span>
        </div>
      </div>

      {/* Floating Bottom Question Badge */}
      <div
        style={{
          marginTop: 20,
          backgroundColor: "#FFFFFF",
          padding: "16px 28px",
          borderRadius: 20,
          border: "2.5px solid #0284C7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <span style={{ color: "#64748B", fontSize: 18, fontWeight: 700 }}>2D Matrix Dimension:</span>
        <span style={{ color: "#0284C7", fontWeight: 900, fontSize: 24, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          M × N Grid (Land '1' vs Water '0') 🌊
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. STAGE 2: DOUBLE-COUNT LOOP TRAP (142 to 202)
// ═══════════════════════════════════════════════════════════════
const Stage2_DoubleCountTrap: React.FC<{ frame: number }> = ({ frame }) => {
  const spin = (frame * 8) % 360;

  return (
    <div style={{ position: "absolute", top: 340, left: 70, right: 70, height: 620, zIndex: 30 }}>
      <div
        style={{
          width: "100%",
          height: 480,
          backgroundColor: "#180D10",
          borderRadius: 32,
          border: "3.5px solid #EF4444",
          boxShadow: "0 25px 70px rgba(239, 68, 68, 0.4)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Infinite Spinning Loop Trap Circle */}
        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "6px dashed #EF4444",
            transform: `rotate(${spin}deg)`,
            position: "absolute",
          }}
        />

        {/* Trapped Land Node */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 24,
            backgroundColor: "#EF4444",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 40px #EF4444",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 38 }}>⚠️</span>
          <span style={{ color: "#FFF", fontWeight: 900, fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            LOOP TRAP
          </span>
        </div>

        {/* Alarm Banner */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            border: "2px solid #EF4444",
            padding: "10px 24px",
            borderRadius: 16,
            color: "#FCA5A5",
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          COUNT: 1 ➔ 2 ➔ 3 ➔ 4 ➔ ∞ (DUPLICATE ERROR!) ❌
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. STAGE 3: TSUNAMI SINK WATER IMPACT (202 to 335)
// ═══════════════════════════════════════════════════════════════
const Stage3_TsunamiSink: React.FC<{ frame: number }> = ({ frame }) => {
  const waveDropY = interpolate(frame, [202, 235], [-120, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const waterSplashScale = interpolate(frame, [230, 260], [0.5, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const landSinkOpacity = interpolate(frame, [230, 265], [1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", top: 340, left: 70, right: 70, height: 620, zIndex: 30 }}>
      <div
        style={{
          width: "100%",
          height: 500,
          backgroundColor: "#030712",
          borderRadius: 32,
          border: "3.5px solid #06B6D4",
          boxShadow: "0 25px 70px rgba(6, 182, 212, 0.35)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Falling Tsunami Flood Wave */}
        {frame < 260 && (
          <div
            style={{
              position: "absolute",
              top: waveDropY,
              width: "100%",
              height: 180,
              background: "linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.85))",
              filter: "blur(8px)",
              zIndex: 15,
            }}
          />
        )}

        {/* Central Sinking Island Tile */}
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: 30,
            backgroundColor: frame >= 240 ? "rgba(6, 182, 212, 0.3)" : "#10B981",
            border: `4px solid ${frame >= 240 ? "#06B6D4" : "#6EE7B7"}`,
            boxShadow: `0 0 50px ${frame >= 240 ? "#06B6D4" : "#10B981"}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity: landSinkOpacity,
            transform: `scale(${frame >= 240 ? 0.9 : 1.0})`,
            transition: "all 0.2s ease",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 50 }}>{frame >= 240 ? "🌊" : "🌴"}</span>
          <span style={{ fontSize: 34, fontWeight: 900, color: "#FFF", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            {frame >= 240 ? "0 (WATER)" : "1 (LAND)"}
          </span>
          <span style={{ fontSize: 16, fontWeight: 800, color: frame >= 240 ? "#67E8F9" : "#D1FAE5" }}>
            {frame >= 240 ? "SUNK INTO OCEAN ✓" : "TOUCHED BY SCANNER"}
          </span>
        </div>

        {/* Giant Water Splash Ring */}
        {frame >= 235 && (
          <div
            style={{
              position: "absolute",
              width: 320 * waterSplashScale,
              height: 320 * waterSplashScale,
              borderRadius: "50%",
              border: "5px solid #38BDF8",
              opacity: interpolate(waterSplashScale, [0.5, 1.4], [1, 0]),
              pointerEvents: "none",
            }}
          />
        )}

        {/* Counter Pop Badge */}
        <div
          style={{
            position: "absolute",
            top: 25,
            right: 25,
            backgroundColor: "#10B981",
            color: "#FFF",
            padding: "12px 24px",
            borderRadius: 20,
            fontSize: 22,
            fontWeight: 900,
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.6)",
          }}
        >
          ISLAND COUNT: +1 🏝️
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STAGE 4: 4-WAY DFS LASER COMPASS (335 to 445)
// ═══════════════════════════════════════════════════════════════
const Stage4_DFSCompass: React.FC<{ frame: number }> = ({ frame }) => {
  const laserReach = interpolate(frame, [335, 375], [0, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", top: 340, left: 70, right: 70, height: 620, zIndex: 30 }}>
      <div
        style={{
          width: "100%",
          height: 500,
          backgroundColor: "#030712",
          borderRadius: 32,
          border: "3.5px solid #10B981",
          boxShadow: "0 25px 70px rgba(16, 185, 129, 0.35)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* SVG Compass Directional Lasers */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          {/* UP Laser */}
          <line x1="470" y1="250" x2="470" y2={250 - laserReach} stroke="#10B981" strokeWidth="5" filter="drop-shadow(0 0 10px #10B981)" />
          {/* DOWN Laser */}
          <line x1="470" y1="250" x2="470" y2={250 + laserReach} stroke="#10B981" strokeWidth="5" filter="drop-shadow(0 0 10px #10B981)" />
          {/* LEFT Laser */}
          <line x1="470" y1="250" x2={470 - laserReach} y2="250" stroke="#10B981" strokeWidth="5" filter="drop-shadow(0 0 10px #10B981)" />
          {/* RIGHT Laser */}
          <line x1="470" y1="250" x2={470 + laserReach} y2="250" stroke="#10B981" strokeWidth="5" filter="drop-shadow(0 0 10px #10B981)" />
        </svg>

        {/* Central Active Node */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 24,
            backgroundColor: "#10B981",
            boxShadow: "0 0 45px #10B981",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 32 }}>🧭</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#FFF", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            DFS (r, c)
          </span>
        </div>

        {/* 4 Directional Badges */}
        <div style={{ position: "absolute", top: 40, color: "#6EE7B7", fontWeight: 900, fontSize: 18 }}>▲ UP (-1, 0)</div>
        <div style={{ position: "absolute", bottom: 40, color: "#6EE7B7", fontWeight: 900, fontSize: 18 }}>▼ DOWN (+1, 0)</div>
        <div style={{ position: "absolute", left: 40, color: "#6EE7B7", fontWeight: 900, fontSize: 18 }}>◀ LEFT (0, -1)</div>
        <div style={{ position: "absolute", right: 40, color: "#6EE7B7", fontWeight: 900, fontSize: 18 }}>▶ RIGHT (0, +1)</div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. STAGE 5: RADAR SWEEP & VICTORY ARENA (445 to 662)
// ═══════════════════════════════════════════════════════════════
const Stage5_RadarSweepVictory: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div style={{ position: "absolute", top: 340, left: 70, right: 70, height: 620, zIndex: 30 }}>
      {/* Big Victory Showcase Card */}
      <div
        style={{
          width: "100%",
          height: 380,
          backgroundColor: "#0B1120",
          borderRadius: 30,
          border: "3.5px solid #10B981",
          boxShadow: "0 20px 60px rgba(16, 185, 129, 0.3)",
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#6EE7B7", fontSize: 22, fontWeight: 900 }}>ALL 3 ISLANDS SUNK ✓</span>
          <span style={{ color: "#FFD166", fontSize: 26, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            COUNT = 3 🏝️
          </span>
        </div>

        {/* 3 Sunk Island Badges */}
        <div style={{ display: "flex", gap: 16 }}>
          {["Island #1: 4 Cells Sunk", "Island #2: 3 Cells Sunk", "Island #3: 2 Cells Sunk"].map((lbl, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "2px solid #10B981",
                borderRadius: 18,
                padding: "14px 10px",
                textAlign: "center",
                color: "#D1FAE5",
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              {lbl}
            </div>
          ))}
        </div>

        {/* In-Place Mutation Zero-Memory Highlight */}
        <div
          style={{
            backgroundColor: "#030712",
            padding: "12px 20px",
            borderRadius: 16,
            border: "1.5px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
            color: "#94A3B8",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          ⚡ In-Place Grid Sinking = <span style={{ color: "#10B981", fontWeight: 900 }}>ZERO Visited Set Memory!</span>
        </div>
      </div>

      {/* Floating Split Complexity Metrics (top: 410px) */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            border: "3px solid #06B6D4",
            borderRadius: 22,
            padding: "16px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(6, 182, 212, 0.15)",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 900, color: "#64748B" }}>TIME COMPLEXITY</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: "#0891B2" }}>O(M × N) ⚡</div>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            border: "3px solid #10B981",
            borderRadius: 22,
            padding: "16px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.15)",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 900, color: "#64748B" }}>SPACE COMPLEXITY</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: "#059669" }}>O(M × N) 🧠</div>
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
          border: "2px solid rgba(16, 185, 129, 0.55)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(16, 185, 129, 0.25)",
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
          const activeColor = idx % 2 === 0 ? "#FFD166" : "#10B981";

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
