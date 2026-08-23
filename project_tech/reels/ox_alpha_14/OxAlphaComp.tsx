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
import cuesData from "../../src/data/ox_alpha_14_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandEmerald: "#10B981",
    brandRed: "#EF4444",
    brandPurple: "#A855F7",
    brandOrange: "#F97316",
    canvasDark: "#060A14",
    textLight: "#F8FAFC",
    textMuted: "#94A3B8",
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

export const OxAlphaComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 669;

  // ─── Timeline Events ───
  const evHook = getEvent("ox01_hook");
  const evSpecs = getEvent("ox02_specs");
  const evNemi = getEvent("ox03_nemi");
  const evSwe = getEvent("ox04_swe_bench");
  const evWarning = getEvent("ox05_warning");
  const evNemiExcited = getEvent("ox06_nemi");

  // ─── Semantic Cues ───
  const modelSpawnCue = getCue("ox01_hook", "model_spawn");
  const mysteryBadgeCue = getCue("ox01_hook", "mystery_badge");
  const millionContextCue = getCue("ox02_specs", "million_context");
  const freeZeroDollarCue = getCue("ox02_specs", "free_zero_dollar");
  const nemiCuriousCue = getCue("ox03_nemi", "nemi_curious");
  const swe80PercentCue = getCue("ox04_swe_bench", "swe_80_percent");
  const dnaMatchZhipuCue = getCue("ox04_swe_bench", "dna_match_zhipu");
  const sevenDayTimerCue = getCue("ox05_warning", "seven_day_timer");
  const vaultWarningCue = getCue("ox05_warning", "vault_warning");
  const nemiExcitedCue = getCue("ox06_nemi", "nemi_excited");

  // ─── Stage Boundaries ───
  const cutB = evSpecs.start_frame; // ~89
  const cutC = evNemi.start_frame; // ~232
  const cutD = evSwe.start_frame; // ~288
  const cutE = evWarning.start_frame; // ~442
  const cutF = evNemiExcited.start_frame; // ~527

  // ─── Camera Breathing ───
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.03], {
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
    nemiSpeech = "Wait, who secretly built this? 🤔";
  } else if (frame < cutE) {
    nemiPose = "aha";
  } else if (frame < cutF) {
    nemiPose = "pointing";
  } else {
    nemiPose = "smug";
    nemiSpeech = "Free frontier AI? I'm using this before it disappears! 😎⚡";
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
      {/* MASTER AUDIO (Voice + Ducked BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/ox_alpha_14/ox_alpha_master_audio.mp3")} volume={0.95} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SFX LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={mysteryBadgeCue} durationInFrames={30}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/pop.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutB - 2)} durationInFrames={30}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={millionContextCue} durationInFrames={30}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={freeZeroDollarCue} durationInFrames={30}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/chime.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={Math.max(0, cutC - 2)} durationInFrames={25}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/pop.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={Math.max(0, cutD - 2)} durationInFrames={30}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/whoosh.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={swe80PercentCue} durationInFrames={35}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/notification.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={dnaMatchZhipuCue} durationInFrames={30}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/chime.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={Math.max(0, cutE - 2)} durationInFrames={30}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/error.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={nemiExcitedCue} durationInFrames={30}>
        <Audio src={staticFile("reels/ox_alpha_14/sfx/pop.mp3")} volume={0.68} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CAMERA & MULTI-LAYERED SPATIAL BACKGROUND */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        {/* Dynamic Volumetric Neon Glow Nebulas */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
          <div
            style={{
              position: "absolute",
              top: 150,
              left: -180,
              width: 750,
              height: 750,
              borderRadius: "50%",
              background: frame < cutD
                ? "radial-gradient(circle, rgba(16, 185, 129, 0.32) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(6, 182, 212, 0.32) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(120px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 550,
              right: -180,
              width: 750,
              height: 750,
              borderRadius: "50%",
              background: frame >= cutE
                ? "radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(255, 209, 102, 0.25) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(120px)",
            }}
          />

          {/* Cyber-Grid Spatial Floor Lines */}
          <svg
            width="1080"
            height="1920"
            style={{ position: "absolute", top: 0, left: 0, opacity: 0.18 }}
          >
            <defs>
              <pattern id="cyberGrid" width="70" height="70" patternUnits="userSpaceOnUse">
                <path d="M 70 0 L 0 0 0 70" fill="none" stroke="#38BDF8" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1080" height="1920" fill="url(#cyberGrid)" />
          </svg>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TOP HUD (Safe Zone: top 85px) */}
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
                backgroundColor: frame >= cutE ? nemiTheme.colors.brandRed : nemiTheme.colors.brandEmerald,
                boxShadow: `0 0 24px ${frame >= cutE ? nemiTheme.colors.brandRed : nemiTheme.colors.brandEmerald}`,
              }}
            />
            <span
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: frame >= cutE ? "#EF4444" : "#10B981",
              }}
            >
              AI News · 0x-Alpha
            </span>
          </div>

          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.88)",
              padding: "10px 24px",
              borderRadius: 22,
              border: `1.5px solid ${frame >= cutE ? "rgba(239, 68, 68, 0.5)" : "rgba(16, 185, 129, 0.5)"}`,
              fontSize: 18,
              fontWeight: 900,
              color: frame >= cutE ? "#EF4444" : "#10B981",
              fontFamily: nemiTheme.typography.fontFamily.mono,
              boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
            }}
          >
            {frame < cutB ? "STEALTH DROP 📡" : frame < cutD ? "1M CONTEXT · $0.00" : frame < cutE ? "80% SWE-BENCH · GLM-5.3" : "7-DAY TIMER · PRIVACY WARNING"}
          </div>
        </div>

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
              color: "#F8FAFC",
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            }}
          >
            {frame < cutB ? (
              <>
                A Mystery AI Just Dropped <span style={{ color: nemiTheme.colors.brandEmerald }}>For 100% Free!</span> 🤯⚡
              </>
            ) : frame < cutC ? (
              <>
                1 Million Tokens Context: <span style={{ color: nemiTheme.colors.brandCyan }}>$0.00 / Million</span> 💎
              </>
            ) : frame < cutD ? (
              <>
                Who Secretly Built <span style={{ color: nemiTheme.colors.brandYellow }}>0x-alpha?</span> 🕵️‍♂️
              </>
            ) : frame < cutE ? (
              <>
                80% SWE-Bench Score: <span style={{ color: "#10B981" }}>It's Zhipu's GLM-5.3!</span> 🧬
              </>
            ) : frame < cutF ? (
              <>
                Free for 7 Days: <span style={{ color: "#EF4444" }}>Don't Leak Private Keys!</span> ⚠️🔒
              </>
            ) : (
              <>
                Free Frontier Coding AI: <span style={{ color: "#10B981" }}>Grab It Now!</span> ⚡🚀
              </>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* OPEN-CANVAS SPATIAL VISUAL ENGINES (Zero Box Enclosure) */}
        {/* ══════════════════════════════════════════════════════════ */}

        {/* STAGE 1: OPEN-CANVAS HOLOGRAPHIC RADAR SCANNER */}
        {frame < cutB && (
          <OpenVisual1_RadarScanner frame={frame} modelSpawnCue={modelSpawnCue} mysteryBadgeCue={mysteryBadgeCue} />
        )}

        {/* STAGE 2: OPEN-CANVAS 3D PLANETARY MEMORY ORBITS */}
        {frame >= cutB && frame < cutC && (
          <OpenVisual2_PlanetaryMemoryRings frame={frame} millionContextCue={millionContextCue} freeZeroDollarCue={freeZeroDollarCue} />
        )}

        {/* STAGE 3: OPEN-CANVAS LASER DE-ANONYMIZER HUD */}
        {frame >= cutC && frame < cutD && (
          <OpenVisual3_DeAnonymizerLaser frame={frame} nemiCuriousCue={nemiCuriousCue} />
        )}

        {/* STAGE 4: OPEN-CANVAS FLOATING LEADERBOARD & DNA CONDUIT */}
        {frame >= cutD && frame < cutE && (
          <OpenVisual4_LeaderboardDnaConduit frame={frame} swe80PercentCue={swe80PercentCue} dnaMatchZhipuCue={dnaMatchZhipuCue} />
        )}

        {/* STAGE 5: OPEN-CANVAS 7-DAY COUNTDOWN & HAZARD SHIELD */}
        {frame >= cutE && frame < cutF && (
          <OpenVisual5_TimerHazardShield frame={frame} sevenDayTimerCue={sevenDayTimerCue} vaultWarningCue={vaultWarningCue} />
        )}

        {/* STAGE 6: OPEN-CANVAS CELEBRATORY CODE SPEEDRUN & PARTICLES */}
        {frame >= cutF && (
          <OpenVisual6_CodeSpeedrunStream frame={frame} nemiExcitedCue={nemiExcitedCue} />
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
// 1. OPEN-CANVAS STAGE 1: CYBERPUNK RADAR & TARGET LOCK (0-100)
// ═══════════════════════════════════════════════════════════════
const OpenVisual1_RadarScanner: React.FC<{ frame: number; modelSpawnCue: number; mysteryBadgeCue: number }> = ({ frame, modelSpawnCue, mysteryBadgeCue }) => {
  const isSpawned = frame >= modelSpawnCue;
  const isBadged = frame >= mysteryBadgeCue;
  const radarAngle = (frame * 10) % 360;

  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 0,
        right: 0,
        height: 680,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 30,
      }}
    >
      <svg width="1040" height="660" viewBox="0 0 1040 660">
        <defs>
          <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Telemetry Data Columns on Left and Right */}
        <g opacity="0.7" fontFamily="monospace" fontSize="14" fill="#38BDF8">
          <text x="60" y="180">LAT: 39.9042° N</text>
          <text x="60" y="210">LON: 116.4074° E</text>
          <text x="60" y="240">PORT: 443 [HTTPS]</text>
          <text x="60" y="270">STATUS: ACTIVE 🟢</text>
          <text x="60" y="300">PROTO: SSE_STREAM</text>

          <text x="860" y="180">CTX: 1,048,576</text>
          <text x="860" y="210">OUT: 131,072</text>
          <text x="860" y="240">COST: $0.00 / 1M</text>
          <text x="860" y="270">AUTH: STEALTH</text>
          <text x="860" y="300">BENCH: 80% SWE</text>
        </g>

        {/* Outer Circular Holographic Grid Rings */}
        <circle cx="520" cy="310" r="270" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="14,14" opacity="0.4" />
        <circle cx="520" cy="310" r="200" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="8,8" opacity="0.6" />
        <circle cx="520" cy="310" r="130" fill="rgba(16, 185, 129, 0.08)" stroke="#10B981" strokeWidth="3" filter="url(#glowGreen)" />
        <circle cx="520" cy="310" r="45" fill="#0F172A" stroke="#10B981" strokeWidth="3.5" />

        {/* Spatial Compass Axes */}
        <line x1="180" y1="310" x2="860" y2="310" stroke="#334155" strokeWidth="2" strokeDasharray="6,6" />
        <line x1="520" y1="30" x2="520" y2="590" stroke="#334155" strokeWidth="2" strokeDasharray="6,6" />

        {/* Rotating Radar Sweep Beam */}
        <g transform={`rotate(${radarAngle} 520 310)`}>
          <line x1="520" y1="310" x2="790" y2="310" stroke="#10B981" strokeWidth="4" />
          <polygon points="520,310 790,240 790,380" fill="url(#radarSweep)" />
        </g>

        {/* Orbiting Spatial Data Nodes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = ((deg + frame * 3) * Math.PI) / 180;
          const nx = 520 + Math.cos(rad) * 200;
          const ny = 310 + Math.sin(rad) * 200;
          return <circle key={i} cx={nx} cy={ny} r="7" fill="#38BDF8" filter="url(#glowGreen)" />;
        })}

        {/* Center Target Lock Capsule */}
        {isSpawned && (
          <g transform="translate(520, 310)">
            <rect x="-190" y="-50" width="380" height="100" rx="30" fill="#0B1120" stroke="#10B981" strokeWidth="4" filter="url(#glowGreen)" />
            <text x="0" y="-10" fill="#F8FAFC" fontSize="20" fontWeight="900" textAnchor="middle">ANONYMOUS STEALTH MODEL</text>
            <text x="0" y="26" fill="#10B981" fontSize="30" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              stealth/0x-alpha
            </text>
          </g>
        )}
      </svg>

      {/* Floating Spatial Pill Badges */}
      {isBadged && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            backgroundColor: "rgba(16, 185, 129, 0.25)",
            border: "3px solid #10B981",
            borderRadius: 32,
            padding: "14px 44px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 0 50px rgba(16, 185, 129, 0.5)",
          }}
        >
          <span style={{ fontSize: 32 }}>💎</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#A7F3D0", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            PRICED AT $0.00 / 1M TOKENS!
          </span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. OPEN-CANVAS STAGE 2: 3D PLANETARY MEMORY ORBITS (100-213)
// ═══════════════════════════════════════════════════════════════
const OpenVisual2_PlanetaryMemoryRings: React.FC<{ frame: number; millionContextCue: number; freeZeroDollarCue: number }> = ({ frame, millionContextCue, freeZeroDollarCue }) => {
  const isFree = frame >= freeZeroDollarCue;
  const rot1 = (frame * 4) % 360;
  const rot2 = (frame * -3) % 360;

  const files = [
    { name: "App.tsx", color: "#38BDF8" },
    { name: "server.go", color: "#00ADD8" },
    { name: "model.py", color: "#FFD166" },
    { name: "schema.sql", color: "#10B981" },
    { name: "auth.rs", color: "#F97316" },
    { name: "routes.ts", color: "#A855F7" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 0,
        right: 0,
        height: 680,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 30,
      }}
    >
      <svg width="1040" height="660" viewBox="0 0 1040 660">
        <defs>
          <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Left Side: Standard AI 32k Limitation Orbit */}
        <g transform="translate(230, 310)">
          <circle cx="0" cy="0" r="120" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="8,8" opacity="0.5" />
          <circle cx="0" cy="0" r="75" fill="rgba(239, 68, 68, 0.08)" stroke="#EF4444" strokeWidth="3" />
          <text x="0" y="-12" fill="#FCA5A5" fontSize="18" fontWeight="900" textAnchor="middle">STANDARD AI</text>
          <text x="0" y="22" fill="#EF4444" fontSize="32" fontWeight="900" textAnchor="middle" fontFamily="monospace">32k</text>
          <text x="0" y="48" fill="#94A3B8" fontSize="14" fontWeight="800" textAnchor="middle">(~10 code files)</text>
        </g>

        {/* Spatial Connecting Laser Bridge */}
        <line x1="360" y1="310" x2="490" y2="310" stroke="#38BDF8" strokeWidth="3" strokeDasharray="8,8" opacity="0.6" />

        {/* Right Side: 0x-alpha 1-Million Token Planetary Giant */}
        <g transform="translate(710, 310)">
          {/* Outer Orbit 1 */}
          <ellipse cx="0" cy="0" rx="220" ry="160" fill="none" stroke="#06B6D4" strokeWidth="3" strokeDasharray="16,10" transform={`rotate(${rot1})`} filter="url(#glowCyan)" />
          {/* Inner Orbit 2 */}
          <ellipse cx="0" cy="0" rx="170" ry="120" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="12,8" transform={`rotate(${rot2})`} />

          {/* Central Glowing Planetary Core */}
          <circle cx="0" cy="0" r="95" fill="#0B1120" stroke="#06B6D4" strokeWidth="4.5" filter="url(#glowCyan)" />
          <circle cx="0" cy="0" r="75" fill="rgba(6, 182, 212, 0.25)" />

          <text x="0" y="-18" fill="#F8FAFC" fontSize="24" fontWeight="900" textAnchor="middle">1 MILLION</text>
          <text x="0" y="18" fill="#10B981" fontSize="30" fontWeight="900" textAnchor="middle" fontFamily="monospace">1,048,576</text>
          <text x="0" y="44" fill="#38BDF8" fontSize="13" fontWeight="900" textAnchor="middle">300+ FILES IN MEMORY</text>

          {/* Orbiting Satellite Code Files in 3D Orbit */}
          {files.map((file, i) => {
            const angle = ((i * (360 / files.length) + frame * 3.5) * Math.PI) / 180;
            const fx = Math.cos(angle) * 190;
            const fy = Math.sin(angle) * 140;
            return (
              <g key={i} transform={`translate(${fx}, ${fy})`}>
                <rect x="-38" y="-15" width="76" height="30" rx="10" fill="#0F172A" stroke={file.color} strokeWidth="2" />
                <text x="0" y="5" fill={file.color} fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                  {file.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Bottom Zero-Dollar Hologram */}
      {isFree && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            backgroundColor: "rgba(6, 182, 212, 0.25)",
            border: "3px solid #06B6D4",
            borderRadius: 32,
            padding: "14px 44px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 0 50px rgba(6, 182, 212, 0.5)",
          }}
        >
          <span style={{ fontSize: 32 }}>🪐</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#BAE6FD", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            FULL REPO IN MEMORY · $0.00 FREE!
          </span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. OPEN-CANVAS STAGE 3: LASER DE-ANONYMIZER HUD (213-269)
// ═══════════════════════════════════════════════════════════════
const OpenVisual3_DeAnonymizerLaser: React.FC<{ frame: number; nemiCuriousCue: number }> = ({ frame, nemiCuriousCue }) => {
  const scanY = 220 + Math.sin(frame * 0.25) * 90;

  const hexLines = [
    "0x00A0: 7F 45 4C 46 02 01 01 00 [ZHIPU_BYTE_ENCODER]",
    "0x00B0: 47 4C 4D 2D 35 2E 33 00 [MATCH_SIGNATURE_FOUND]",
    "0x00C0: 53 54 45 41 4C 54 48 5F [DECRYPTING_VOCABULARY]",
    "0x00D0: 31 4D 5F 54 4F 4B 45 4E [AGENTIC_CODE_PREVIEW]",
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 0,
        right: 0,
        height: 680,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 30,
      }}
    >
      <svg width="1040" height="660" viewBox="0 0 1040 660">
        <defs>
          <filter id="glowYellow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Forensic Hex Code Matrix Background */}
        <g opacity="0.6" fontFamily="monospace" fontSize="16" fill="#38BDF8">
          {hexLines.map((line, idx) => (
            <text key={idx} x="120" y={140 + idx * 36}>
              {line}
            </text>
          ))}
        </g>

        {/* Center Floating Decryption Reticle */}
        <g transform="translate(520, 310)">
          <circle cx="0" cy="0" r="170" fill="rgba(255, 209, 102, 0.06)" stroke="#FFD166" strokeWidth="2.5" strokeDasharray="12,12" />
          <circle cx="0" cy="0" r="120" fill="#0B1120" stroke="#FFD166" strokeWidth="4" filter="url(#glowYellow)" />

          <text x="0" y="-28" fill="#94A3B8" fontSize="18" fontWeight="800" textAnchor="middle">ANONYMOUS LAB</text>
          <text x="0" y="16" fill="#F8FAFC" fontSize="40" fontWeight="900" textAnchor="middle" fontFamily="monospace">0x-alpha</text>
          <text x="0" y="52" fill="#FFD166" fontSize="19" fontWeight="900" textAnchor="middle">DECRYPTING DNA 🧬</text>
        </g>

        {/* Dynamic Sweeping Laser Scanner Bar */}
        <line x1="200" y1={scanY} x2="840" y2={scanY} stroke="#06B6D4" strokeWidth="5" filter="url(#glowYellow)" />
        <circle cx="200" cy={scanY} r="9" fill="#06B6D4" />
        <circle cx="840" cy={scanY} r="9" fill="#06B6D4" />
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. OPEN-CANVAS STAGE 4: FLOATING LEADERBOARD & DNA MATCH (269-425)
// ═══════════════════════════════════════════════════════════════
const OpenVisual4_LeaderboardDnaConduit: React.FC<{ frame: number; swe80PercentCue: number; dnaMatchZhipuCue: number }> = ({ frame, swe80PercentCue, dnaMatchZhipuCue }) => {
  const isDna = frame >= dnaMatchZhipuCue;
  const barAnim = interpolate(frame - swe80PercentCue, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 0,
        right: 0,
        height: 680,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 30,
      }}
    >
      <svg width="1040" height="660" viewBox="0 0 1040 660">
        <defs>
          <filter id="glowGreenBar" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Leaderboard Header */}
        <text x="120" y="55" fill="#94A3B8" fontSize="22" fontWeight="900" letterSpacing="1px">SWE-BENCH CODING PASS@1 LEADERBOARD</text>

        {/* Bar 1: 0x-alpha (80% Green Winner) */}
        <g transform="translate(120, 90)">
          <text x="0" y="30" fill="#10B981" fontSize="28" fontWeight="900" fontFamily="monospace">0x-alpha</text>
          <rect x="220" y="0" width={560 * barAnim} height="44" rx="18" fill="#10B981" filter="url(#glowGreenBar)" />
          <text x={245 + 560 * barAnim} y="31" fill="#10B981" fontSize="28" fontWeight="900">80% ⚡</text>
        </g>

        {/* Bar 2: Claude 3.5 Sonnet (72%) */}
        <g transform="translate(120, 160)">
          <text x="0" y="26" fill="#94A3B8" fontSize="22" fontWeight="800">Claude 3.5</text>
          <rect x="220" y="0" width="500" height="34" rx="14" fill="#334155" opacity="0.8" />
          <text x="735" y="26" fill="#94A3B8" fontSize="22" fontWeight="800">72%</text>
        </g>

        {/* Bar 3: GPT-4o (65%) */}
        <g transform="translate(120, 220)">
          <text x="0" y="26" fill="#94A3B8" fontSize="22" fontWeight="800">GPT-4o</text>
          <rect x="220" y="0" width="440" height="34" rx="14" fill="#334155" opacity="0.8" />
          <text x="675" y="26" fill="#94A3B8" fontSize="22" fontWeight="800">65%</text>
        </g>

        {/* Bottom Double-Helix DNA Match Conduit */}
        <g transform="translate(120, 310)">
          <rect x="0" y="0" width="800" height="95" rx="26" fill={isDna ? "rgba(16, 185, 129, 0.18)" : "rgba(30, 41, 59, 0.5)"} stroke={isDna ? "#10B981" : "#334155"} strokeWidth="3" filter={isDna ? "url(#glowGreenBar)" : undefined} />
          <text x="40" y="40" fill="#A7F3D0" fontSize="19" fontWeight="900">TOKENIZER BYTE-PAIR FINGERPRINT:</text>
          <text x="40" y="72" fill={isDna ? "#FFD166" : "#94A3B8"} fontSize="26" fontWeight="900" fontFamily="monospace">
            {isDna ? "99% MATCH → Zhipu GLM-5.3 🇨🇳" : "ANALYZING STACK TRACES..."}
          </text>
          {isDna && (
            <>
              <circle cx="740" cy="48" r="22" fill="#10B981" />
              <text x="740" y="56" fill="#0F172A" fontSize="24" fontWeight="900" textAnchor="middle">✓</text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. OPEN-CANVAS STAGE 5: 7-DAY TIMER & HAZARD SHIELD (425-501)
// ═══════════════════════════════════════════════════════════════
const OpenVisual5_TimerHazardShield: React.FC<{ frame: number; sevenDayTimerCue: number; vaultWarningCue: number }> = ({ frame, sevenDayTimerCue, vaultWarningCue }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 0,
        right: 0,
        height: 680,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 30,
      }}
    >
      <svg width="1040" height="660" viewBox="0 0 1040 660">
        <defs>
          <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Left Side: 7-Day Countdown Gauge */}
        <g transform="translate(260, 310)">
          <circle cx="0" cy="0" r="140" fill="#0B1120" stroke="#10B981" strokeWidth="4.5" />
          <circle cx="0" cy="0" r="110" fill="rgba(16, 185, 129, 0.12)" />
          <text x="0" y="-32" fill="#94A3B8" fontSize="19" fontWeight="900" textAnchor="middle">FREE WINDOW</text>
          <text x="0" y="28" fill="#10B981" fontSize="58" fontWeight="900" textAnchor="middle" fontFamily="monospace">7 DAYS</text>
          <text x="0" y="65" fill="#34D399" fontSize="17" fontWeight="800" textAnchor="middle">Expires This Week</text>
        </g>

        {/* Right Side: Red Privacy Warning Lock */}
        <g transform="translate(740, 310)">
          <circle cx="0" cy="0" r="140" fill="#450A0A" stroke="#EF4444" strokeWidth="4.5" filter="url(#glowRed)" />
          {/* Padlock Icon */}
          <rect x="-40" y="-15" width="80" height="60" rx="14" fill="#EF4444" />
          <path d="M -24 -15 V -40 C -24 -56 24 -56 24 -40 V -15" fill="none" stroke="#EF4444" strokeWidth="9" />
          <circle cx="0" cy="12" r="7" fill="#FEE2E2" />

          <text x="0" y="82" fill="#FCA5A5" fontSize="19" fontWeight="900" textAnchor="middle">PROMPTS RECORDED!</text>
          <text x="0" y="108" fill="#EF4444" fontSize="16" fontWeight="900" textAnchor="middle">NO PRIVATE PASSWORDS</text>
        </g>
      </svg>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 6. OPEN-CANVAS STAGE 6: CODE SPEEDRUN & PARTICLES (501-621)
// ═══════════════════════════════════════════════════════════════
const OpenVisual6_CodeSpeedrunStream: React.FC<{ frame: number; nemiExcitedCue: number }> = ({ frame, nemiExcitedCue }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 0,
        right: 0,
        height: 680,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {/* Glowing Terminal Code Window */}
        <div
          style={{
            backgroundColor: "rgba(11, 17, 32, 0.95)",
            border: "3.5px solid #10B981",
            borderRadius: 28,
            padding: "24px 38px",
            width: 820,
            boxShadow: "0 0 60px rgba(16, 185, 129, 0.45)",
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#EF4444" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#10B981" }} />
            <span style={{ color: "#94A3B8", fontSize: 14, marginLeft: 10, fontWeight: 700 }}>terminal — 0x-alpha agent</span>
          </div>
          <div style={{ color: "#A7F3D0", fontSize: 20, lineHeight: 1.6 }}>
            <div><span style={{ color: "#F43F5E" }}>import</span> <span style={{ color: "#38BDF8" }}>stealth_0x_alpha</span></div>
            <div>agent = <span style={{ color: "#38BDF8" }}>stealth_0x_alpha</span>.<span style={{ color: "#FFD166" }}>Agent</span>(context=<span style={{ color: "#34D399" }}>"1,000,000"</span>)</div>
            <div>agent.<span style={{ color: "#FFD166" }}>solve_all_bugs</span>(repo=<span style={{ color: "#34D399" }}>"full_project"</span>)</div>
            <div style={{ color: "#FFD166", marginTop: 8 }}>✓ 80% SWE-Bench Solved in 14s! ⚡</div>
          </div>
        </div>

        {/* Floating Neon Badges */}
        <div style={{ display: "flex", gap: 20 }}>
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.25)",
              border: "3px solid #10B981",
              borderRadius: 24,
              padding: "12px 32px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 0 35px rgba(16, 185, 129, 0.4)",
            }}
          >
            <span style={{ fontSize: 24 }}>⚡</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#F8FAFC" }}>100% FREE ACTIVE</span>
          </div>

          <div
            style={{
              backgroundColor: "rgba(6, 182, 212, 0.25)",
              border: "3px solid #06B6D4",
              borderRadius: 24,
              padding: "12px 32px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 0 35px rgba(6, 182, 212, 0.4)",
            }}
          >
            <span style={{ fontSize: 24 }}>🪐</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#38BDF8" }}>1M TOKEN BUFFER</span>
          </div>
        </div>
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
