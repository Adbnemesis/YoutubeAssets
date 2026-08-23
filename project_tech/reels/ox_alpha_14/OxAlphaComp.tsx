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

export const OxAlphaComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 693;

  // ─── Timeline Events ───
  const evHook = getEvent("ox01_hook");
  const evSpecs = getEvent("ox02_specs");
  const evNemi = getEvent("ox03_nemi");
  const evSwe = getEvent("ox04_swe_bench");
  const evWarning = getEvent("ox05_warning");
  const evNemiExcited = getEvent("ox06_nemi");
  const evLoop = getEvent("ox07_loop");

  // ─── Semantic Cues ───
  const modelSpawnCue = getCue("ox01_hook", "model_spawn"); // 47
  const mysteryBadgeCue = getCue("ox01_hook", "mystery_badge"); // 80
  const millionContextCue = getCue("ox02_specs", "million_context"); // 155
  const freeZeroDollarCue = getCue("ox02_specs", "free_zero_dollar"); // 219
  const nemiCuriousCue = getCue("ox03_nemi", "nemi_curious"); // 281
  const swe80PercentCue = getCue("ox04_swe_bench", "swe_80_percent"); // 350
  const dnaMatchZhipuCue = getCue("ox04_swe_bench", "dna_match_zhipu"); // 442
  const sevenDayTimerCue = getCue("ox05_warning", "seven_day_timer"); // 502
  const vaultWarningCue = getCue("ox05_warning", "vault_warning"); // 544
  const nemiExcitedCue = getCue("ox06_nemi", "nemi_excited"); // 639
  const loopSeamCue = getCue("ox07_loop", "loop_seam"); // 675

  // ─── Stage Boundaries ───
  const cutB = evSpecs.start_frame; // 97
  const cutC = evNemi.start_frame; // 244
  const cutD = evSwe.start_frame; // 300
  const cutE = evWarning.start_frame; // 470
  const cutF = evNemiExcited.start_frame; // 566
  const cutG = evLoop.start_frame; // 660

  // ─── Smooth Theme ───
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
    nemiSpeech = "Wait, who secretly built this? 🤔";
  } else if (frame < cutE) {
    nemiPose = "aha";
  } else if (frame < cutF) {
    nemiPose = "pointing";
  } else if (frame < cutG + 15) {
    nemiPose = "smug";
    nemiSpeech = "Free coding AI? I'm using this right now! 😎⚡";
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
      <Audio src={staticFile("reels/ox_alpha_14/ox_alpha_master_audio.mp3")} volume={0.92} />

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
      {/* CAMERA & AMBIENT WORLD */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        {/* Dynamic Ambient Glows */}
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
                background: frame < cutD
                  ? "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0,0,0,0) 70%)"
                  : "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(0,0,0,0) 70%)",
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
                background: frame >= cutE
                  ? "radial-gradient(circle, rgba(239, 68, 68, 0.28) 0%, rgba(0,0,0,0) 70%)"
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
                  backgroundColor: frame >= cutE ? nemiTheme.colors.brandRed : nemiTheme.colors.brandGreen,
                  boxShadow: `0 0 20px ${frame >= cutE ? nemiTheme.colors.brandRed : nemiTheme.colors.brandGreen}`,
                }}
              />
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: isDarkWorld ? (frame >= cutE ? "#EF4444" : "#10B981") : "#059669",
                }}
              >
                AI News · 0x-Alpha
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
                color: isDarkWorld ? (frame >= cutE ? "#EF4444" : "#10B981") : "#059669",
                fontFamily: nemiTheme.typography.fontFamily.mono,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              {frame < cutB ? "STEALTH DROP" : frame < cutD ? "1M CONTEXT · $0.00" : frame < cutE ? "80% SWE-BENCH · GLM-5.3" : "7-DAY TIMER · PRIVACY WARNING"}
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
                A Mystery AI Just Dropped <span style={{ color: nemiTheme.colors.brandGreen }}>For 100% Free!</span> 🤯⚡
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
            ) : frame < cutG ? (
              <>
                Free Frontier Coding AI: <span style={{ color: "#10B981" }}>Active Right Now!</span> ⚡🚀
              </>
            ) : (
              <>
                The Secret Behind <span style={{ color: nemiTheme.colors.brandCyan }}>0x-alpha</span> ⚡
              </>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* MAIN VISUAL CARD STAGES (Safe Zone: top: 310px, height: 600px) */}
        {/* ══════════════════════════════════════════════════════════ */}

        {/* STAGE 1: CYBERPUNK RADAR SCANNER (0 to 96) */}
        {frame < cutB && (
          <Visual1_RadarScanner frame={frame} modelSpawnCue={modelSpawnCue} mysteryBadgeCue={mysteryBadgeCue} />
        )}

        {/* STAGE 2: 1-MILLION TOKEN HOLOGRAPHIC BUFFER (97 to 243) */}
        {frame >= cutB && frame < cutC && (
          <Visual2_MillionTokenBuffer frame={frame} millionContextCue={millionContextCue} freeZeroDollarCue={freeZeroDollarCue} />
        )}

        {/* STAGE 3: NEMI DETECTIVE SPOTLIGHT (244 to 299) */}
        {frame >= cutC && frame < cutD && (
          <Visual3_DetectiveSpotlight frame={frame} nemiCuriousCue={nemiCuriousCue} />
        )}

        {/* STAGE 4: SWE-BENCH BAR GRAPH & TOKENIZER DNA MATCH (300 to 469) */}
        {frame >= cutD && frame < cutE && (
          <Visual4_SweDnaMatch frame={frame} swe80PercentCue={swe80PercentCue} dnaMatchZhipuCue={dnaMatchZhipuCue} />
        )}

        {/* STAGE 5: 7-DAY TIMER & SECURITY VAULT WARNING (470 to 659) */}
        {frame >= cutE && frame < cutG && (
          <Visual5_TimerVaultWarning frame={frame} sevenDayTimerCue={sevenDayTimerCue} vaultWarningCue={vaultWarningCue} />
        )}

        {/* STAGE 6: LOOP SEAM RADAR RETURN (660 to 693) */}
        {frame >= cutG && (
          <Visual1_RadarScanner frame={frame} modelSpawnCue={0} mysteryBadgeCue={0} />
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
// 1. STAGE 1: CYBERPUNK RADAR SCANNER (0-96)
// ═══════════════════════════════════════════════════════════════
const Visual1_RadarScanner: React.FC<{ frame: number; modelSpawnCue: number; mysteryBadgeCue: number }> = ({ frame, modelSpawnCue, mysteryBadgeCue }) => {
  const isSpawned = frame >= modelSpawnCue;
  const isBadged = frame >= mysteryBadgeCue;
  const radarAngle = (frame * 12) % 360;

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
        border: isBadged ? "4px solid #10B981" : "3.5px solid #E2E8F0",
        boxShadow: isBadged ? "0 24px 80px rgba(16, 185, 129, 0.35)" : "0 24px 80px rgba(0, 0, 0, 0.08)",
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
          <span style={{ fontSize: 32 }}>📡</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>OpenRouter Live Feed: stealth/0x-alpha</span>
        </div>
        <span style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1.5px solid #10B981", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          STATUS: ONLINE 🟢
        </span>
      </div>

      {/* SVG Radar Terminal & Target Lock */}
      <div style={{ width: "100%", height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="260" viewBox="0 0 880 260">
          <defs>
            <radialGradient id="radarScan" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Radar Circles */}
          <circle cx="440" cy="130" r="110" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="6,6" />
          <circle cx="440" cy="130" r="70" fill="none" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="440" cy="130" r="30" fill="#F1F5F9" stroke="#10B981" strokeWidth="3" />

          {/* Crosshairs */}
          <line x1="300" y1="130" x2="580" y2="130" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="440" y1="10" x2="440" y2="250" stroke="#CBD5E1" strokeWidth="2" />

          {/* Rotating Radar Sweep Line */}
          <g transform={`rotate(${radarAngle} 440 130)`}>
            <line x1="440" y1="130" x2="550" y2="130" stroke="#10B981" strokeWidth="4" />
            <polygon points="440,130 550,110 550,150" fill="url(#radarScan)" />
          </g>

          {/* Locked Model Target Badge */}
          {isSpawned && (
            <g transform="translate(440, 130)">
              <rect x="-140" y="-35" width="280" height="70" rx="20" fill="#0F172A" stroke="#10B981" strokeWidth="3.5" />
              <text x="0" y="8" fill="#10B981" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                stealth/0x-alpha
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Gold Price Tag Callout */}
      {isBadged ? (
        <div
          style={{
            backgroundColor: "#ECFDF5",
            border: "3.5px solid #10B981",
            borderRadius: 22,
            padding: "14px 36px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 14px 40px rgba(16, 185, 129, 0.35)",
          }}
        >
          <span style={{ fontSize: 32 }}>💎</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#065F46", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            PRICED AT $0.00 / 1M TOKENS!
          </span>
        </div>
      ) : (
        <div style={{ width: "100%", backgroundColor: "#F8FAFC", padding: "14px 24px", borderRadius: 18, border: "1.5px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#64748B", fontSize: 18, fontWeight: 700 }}>Anonymous Stealth Provider:</span>
          <span style={{ color: "#0F172A", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>LIMITED PREVIEW ⚡</span>
        </div>
      )}

      <div style={{ width: "100%", backgroundColor: "#F0FDF4", padding: "14px 24px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#0F172A", fontSize: 18, fontWeight: 700 }}>OpenRouter & OpenCode endpoints:</span>
        <span style={{ color: "#059669", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>100% FREE ACTIVE NOW ✓</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. STAGE 2: 1-MILLION TOKEN HOLOGRAPHIC BUFFER (97-243)
// ═══════════════════════════════════════════════════════════════
const Visual2_MillionTokenBuffer: React.FC<{ frame: number; millionContextCue: number; freeZeroDollarCue: number }> = ({ frame, millionContextCue, freeZeroDollarCue }) => {
  const isFree = frame >= freeZeroDollarCue;
  const ringRotate = (frame * 3) % 360;

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
        padding: "26px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🪐</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Context Memory Buffer Architecture</span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          1,048,576 TOKENS ⚡
        </span>
      </div>

      {/* SVG Concentric 1M Token Ring */}
      <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="280" viewBox="0 0 880 280">
          {/* Left: Standard 8k/32k Box */}
          <rect x="40" y="70" width="240" height="130" rx="20" fill="rgba(239, 68, 68, 0.08)" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="6,6" />
          <text x="160" y="120" fill="#FDA4AF" fontSize="22" fontWeight="900" textAnchor="middle">STANDARD AI</text>
          <text x="160" y="160" fill="#EF4444" fontSize="28" fontWeight="900" textAnchor="middle" fontFamily="monospace">32k Tokens</text>
          <text x="160" y="185" fill="#94A3B8" fontSize="14" fontWeight="700" textAnchor="middle">(~10 code files)</text>

          {/* Central Connecting Conduit */}
          <line x1="280" y1="135" x2="380" y2="135" stroke="#334155" strokeWidth="4" strokeDasharray="6,6" />

          {/* Right: 1 Million Token Hologram */}
          <g transform="translate(620, 135)">
            {/* Outer Rotating Data Stream Ring */}
            <circle cx="0" cy="0" r="105" fill="none" stroke="#06B6D4" strokeWidth="3" strokeDasharray="16,8" transform={`rotate(${ringRotate})`} />
            <circle cx="0" cy="0" r="85" fill="rgba(6, 182, 212, 0.12)" stroke="#38BDF8" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="60" fill="#0F172A" stroke="#10B981" strokeWidth="3.5" />

            <text x="0" y="-8" fill="#F8FAFC" fontSize="20" fontWeight="900" textAnchor="middle">1 MILLION</text>
            <text x="0" y="20" fill="#10B981" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="monospace">1,048,576</text>
            <text x="0" y="40" fill="#38BDF8" fontSize="12" fontWeight="900" textAnchor="middle">FULL REPOSITORY BUFFER</text>
          </g>
        </svg>
      </div>

      <div style={{ width: "100%", backgroundColor: isFree ? "#022C22" : "#1E293B", padding: "14px 24px", borderRadius: 18, border: isFree ? "2.5px solid #10B981" : "2px solid #06B6D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>Reads 300+ code files simultaneously:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isFree ? "100% FREE ($0.00) ✓" : "1M Context Window"}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. STAGE 3: NEMI DETECTIVE SPOTLIGHT (244-299)
// ═══════════════════════════════════════════════════════════════
const Visual3_DetectiveSpotlight: React.FC<{ frame: number; nemiCuriousCue: number }> = ({ frame, nemiCuriousCue }) => {
  const pulse = Math.sin(frame * 0.3);

  return (
    <div
      style={{
        position: "absolute",
        top: 310,
        left: "50%",
        transform: "translateX(-50)",
        width: 950,
        height: 600,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #FFD166",
        boxShadow: "0 24px 80px rgba(255, 209, 102, 0.3)",
        padding: "26px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🕵️‍♂️</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>The Mystery: Who Secretly Built It?</span>
        </div>
        <span style={{ backgroundColor: "rgba(255, 209, 102, 0.2)", color: "#FFD166", border: "1.5px solid #FFD166", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          PROVIDER: STEALTH 🔒
        </span>
      </div>

      {/* SVG Magnifying Glass Radar */}
      <div style={{ width: "100%", height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="280" viewBox="0 0 880 280">
          {/* Mystery Model File Card */}
          <rect x="240" y="40" width="400" height="180" rx="24" fill="#1E293B" stroke="#FFD166" strokeWidth="3" />
          <text x="440" y="90" fill="#94A3B8" fontSize="18" fontWeight="800" textAnchor="middle">MODEL_METADATA_HEADER</text>
          <text x="440" y="135" fill="#F8FAFC" fontSize="32" fontWeight="900" textAnchor="middle" fontFamily="monospace">0x-alpha [???]</text>
          <text x="440" y="180" fill="#FFD166" fontSize="20" fontWeight="900" textAnchor="middle">AUTHOR: ANONYMOUS LAB</text>

          {/* Animated Magnifying Glass Reticle */}
          <g transform={`translate(${440 + pulse * 20}, 130)`}>
            <circle cx="0" cy="0" r="60" fill="none" stroke="#06B6D4" strokeWidth="4" strokeDasharray="8,8" />
            <line x1="42" y1="42" x2="85" y2="85" stroke="#06B6D4" strokeWidth="6" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <div style={{ width: "100%", backgroundColor: "#1E293B", padding: "14px 24px", borderRadius: 18, border: "2px solid #FFD166", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>Zero corporate branding released:</span>
        <span style={{ color: "#FFD166", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>INVESTIGATING DNA 🧬</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STAGE 4: SWE-BENCH BAR GRAPH & TOKENIZER DNA MATCH (300-469)
// ═══════════════════════════════════════════════════════════════
const Visual4_SweDnaMatch: React.FC<{ frame: number; swe80PercentCue: number; dnaMatchZhipuCue: number }> = ({ frame, swe80PercentCue, dnaMatchZhipuCue }) => {
  const isDna = frame >= dnaMatchZhipuCue;
  const barAnim = interpolate(frame - swe80PercentCue, [0, 25], [0, 1], {
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
        border: isDna ? "4px solid #10B981" : "3.5px solid #06B6D4",
        boxShadow: isDna ? "0 24px 80px rgba(16, 185, 129, 0.35)" : "0 24px 80px rgba(6, 182, 212, 0.3)",
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
          <span style={{ fontSize: 32 }}>🧬</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>SWE-Bench Pass@1 & Tokenizer DNA Match</span>
        </div>
        <span style={{ backgroundColor: isDna ? "#064E3B" : "rgba(6, 182, 212, 0.2)", color: isDna ? "#10B981" : "#06B6D4", border: "1.5px solid #10B981", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isDna ? "MATCH: ZHIPU GLM-5.3 ✓" : "BENCHMARK SCORE: 80%"}
        </span>
      </div>

      {/* SVG Comparative Bar Graph & DNA Conduit */}
      <div style={{ width: "100%", height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="300" viewBox="0 0 880 300">
          {/* Bar 1: 0x-alpha (80% Green Winner) */}
          <text x="50" y="45" fill="#10B981" fontSize="20" fontWeight="900" fontFamily="monospace">0x-alpha</text>
          <rect x="220" y="25" width={560 * barAnim} height="36" rx="14" fill="#10B981" />
          <text x={240 + 560 * barAnim} y="49" fill="#10B981" fontSize="22" fontWeight="900">80% ⚡</text>

          {/* Bar 2: Claude 3.5 Sonnet (72%) */}
          <text x="50" y="105" fill="#94A3B8" fontSize="18" fontWeight="800">Claude 3.5</text>
          <rect x="220" y="85" width="500" height="30" rx="12" fill="#334155" />
          <text x="735" y="107" fill="#94A3B8" fontSize="18" fontWeight="800">72%</text>

          {/* Bar 3: GPT-4o (65%) */}
          <text x="50" y="160" fill="#94A3B8" fontSize="18" fontWeight="800">GPT-4o</text>
          <rect x="220" y="140" width="440" height="30" rx="12" fill="#334155" />
          <text x="675" y="162" fill="#94A3B8" fontSize="18" fontWeight="800">65%</text>

          {/* Bottom DNA Fingerprint Match Conduit */}
          {isDna && (
            <g transform="translate(0, 200)">
              <rect x="50" y="15" width="780" height="65" rx="18" fill="#022C22" stroke="#10B981" strokeWidth="2.5" />
              <text x="100" y="52" fill="#A7F3D0" fontSize="18" fontWeight="900">Tokenizer Byte-Pair DNA:</text>
              <text x="450" y="52" fill="#FFD166" fontSize="20" fontWeight="900" fontFamily="monospace">99% MATCH → Zhipu GLM-5.3 🇨🇳</text>
            </g>
          )}
        </svg>
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "14px 24px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>Stack traces & vocabulary fingerprint match:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>SECRET GLM-5.3 PREVIEW ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. STAGE 5: 7-DAY TIMER & SECURITY VAULT WARNING (470-659)
// ═══════════════════════════════════════════════════════════════
const Visual5_TimerVaultWarning: React.FC<{ frame: number; sevenDayTimerCue: number; vaultWarningCue: number }> = ({ frame, sevenDayTimerCue, vaultWarningCue }) => {
  const isVault = frame >= vaultWarningCue;
  const pulse = Math.sin(frame * 0.35);

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
        border: "3.5px solid #EF4444",
        boxShadow: "0 24px 80px rgba(239, 68, 68, 0.35)",
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
          <span style={{ fontSize: 32 }}>⚠️</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#EF4444" }}>Free Window & Privacy Hazard Rules</span>
        </div>
        <span style={{ backgroundColor: "rgba(239, 68, 68, 0.25)", color: "#EF4444", border: "1.5px solid #EF4444", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          LIMITED 7 DAYS ONLY ⏳
        </span>
      </div>

      {/* SVG Countdown Clock & Hazard Shield */}
      <div style={{ width: "100%", height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="880" height="300" viewBox="0 0 880 300">
          {/* 7-Day Countdown Timer Box */}
          <rect x="50" y="30" width="360" height="220" rx="24" fill="#1E293B" stroke="#10B981" strokeWidth="3" />
          <text x="230" y="80" fill="#94A3B8" fontSize="18" fontWeight="900" textAnchor="middle">FREE TESTING WINDOW</text>
          <text x="230" y="145" fill="#10B981" fontSize="48" fontWeight="900" textAnchor="middle" fontFamily="monospace">7 DAYS</text>
          <text x="230" y="195" fill="#34D399" fontSize="18" fontWeight="800" textAnchor="middle">Expires ~August 27th</text>

          {/* Privacy Hazard Lock Shield */}
          <g transform="translate(630, 140)">
            <rect x="-180" y="-110" width="360" height="220" rx="24" fill="#450A0A" stroke="#EF4444" strokeWidth="3.5" />
            <circle cx="0" cy="-35" r="30" fill="none" stroke="#EF4444" strokeWidth="6" />
            <rect x="-35" y="-35" width="70" height="50" rx="10" fill="#EF4444" />
            <text x="0" y="45" fill="#FCA5A5" fontSize="20" fontWeight="900" textAnchor="middle">PRIVACY WARNING</text>
            <text x="0" y="75" fill="#EF4444" fontSize="16" fontWeight="900" textAnchor="middle">DO NOT PASTE API KEYS!</text>
          </g>
        </svg>
      </div>

      <div style={{ width: "100%", backgroundColor: "#450A0A", padding: "14px 24px", borderRadius: 18, border: "2px solid #EF4444", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>OpenRouter logs prompts for training:</span>
        <span style={{ color: "#F87171", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>USE FOR CODE ONLY ⚡</span>
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
