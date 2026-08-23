import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { NemiMascot, NemiPose } from "../../src/components/NemiMascot";
import cuesData from "../../src/data/noise_11_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandPurple: "#A855F7",
    brandGreen: "#10B981",
    brandCoral: "#F43F5E",
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
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
  const ev = (cuesData.timeline_events as any[]).find((x) => x.id === id);
  return ev ?? {
    start_frame: 0, end_frame: 0, start_time_ms: 0, end_time_ms: 0, duration_s: 0, semantic_cues: [],
  };
};

const getCue = (eventId: string, cueName: string): number => {
  const ev = getEvent(eventId);
  const c = (ev.semantic_cues ?? []).find((x: any) => x.cue === cueName);
  return c ? c.frame : ev.start_frame;
};

const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// ═══════════════════════════════════════════════════════════════
// Wave math — deterministic pseudo-noise oscilloscope trace
// ═══════════════════════════════════════════════════════════════
const TAU = Math.PI * 2;
const WAVE_COUNT = 72;

function waveY(i: number, count: number, phase: number, seed: number) {
  const norm = (i / count) * TAU;
  return (
    0.6 * Math.sin(norm + phase) +
    0.26 * Math.sin(norm * 2.7 + phase * 1.7 + seed * 0.7) +
    0.14 * Math.sin(norm * 5.3 + phase * 3.1 + seed * 1.3)
  );
}

function wavePath(amp: number, cy: number, phase: number, seed: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= WAVE_COUNT; i++) {
    const x = (i / WAVE_COUNT) * 870 + 38;
    const y = cy - waveY(i, WAVE_COUNT, phase, seed) * amp;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}// ═══════════════════════════════════════════════════════════════
// CONSOLE CARD — the hero "money shot" oscilloscope:
// Lane 1: NOISE IN (red) | Lane 2: MIRROR ×−1 (blue, dashed)
// Lane 3: YOU HEAR (red until mirror fires, then flat green ZERO)
// ═══════════════════════════════════════════════════════════════
const ConsoleCard: React.FC<{
  frame: number;
  showAnti: boolean;
  cancelProg: number;
}> = ({ frame, showAnti, cancelProg }) => {
  const cardW = 940;
  const cardH = 640;
  const phase = frame * 0.06;
  const amp = 64;
  const redAmp = amp * (1 - cancelProg);
  const youHearAmp = showAnti ? 0 : amp * 0.85 * (1 - cancelProg);

  const lane = (label: string, color: string, y: number) => (
    <div style={{ position: "absolute", left: 38, top: y - 72, zIndex: 4 }}>
      <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: 1, color, fontFamily: nemiTheme.typography.fontFamily.mono }}>
        {label}
      </span>
    </div>
  );

  return (
    <div style={{ position: "absolute", top: 380, left: "50%", transform: "translateX(-50%)", zIndex: 30 }}>
      <div
        style={{
          width: cardW,
          height: cardH,
          backgroundColor: "#0B1120",
          borderRadius: 36,
          border: "3px solid #1E293B",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(6,182,212,0.10)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header bar */}
        <div style={{ position: "absolute", top: 26, left: 32, display: "flex", alignItems: "center", gap: 12, zIndex: 3 }}>
          <div
            style={{
              width: 15,
              height: 15,
              borderRadius: "50%",
              backgroundColor: cancelProg > 0.85 ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCyan,
              opacity: frame % 22 < 11 ? 1 : 0.4,
            }}
          />
          <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: 1.5, color: "#CBD5E1", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            INVERSE-PHASE CANCELLATION · LIVE
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 26,
            right: 30,
            padding: "7px 16px",
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: 1,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            color: cancelProg > 0.85 ? "#0B1120" : nemiTheme.colors.brandYellow,
            backgroundColor: cancelProg > 0.85 ? nemiTheme.colors.brandGreen : "rgba(255,209,102,0.14)",
            border: `2px solid ${cancelProg > 0.85 ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandYellow}`,
            zIndex: 3,
          }}
        >
          {cancelProg > 0.85 ? "= 0 ✓" : "RAW → MIRROR"}
        </div>{/* Grid */}
        <svg width={cardW} height={cardH} style={{ position: "absolute", top: 0, left: 0 }}>
          {Array.from({ length: 21 }).map((_, gi) => (
            <line key={`vg${gi}`} x1={gi * 47} y1={0} x2={gi * 47} y2={cardH} stroke="#1E293B" strokeWidth={1} opacity={0.7} />
          ))}
          {Array.from({ length: 13 }).map((_, hg) => (
            <line key={`hg${hg}`} x1={0} y1={hg * 52} x2={cardW} y2={hg * 52} stroke="#1E293B" strokeWidth={1} opacity={0.5} />
          ))}
        </svg>

        {/* Lane labels */}
        {lane("NOISE IN", "#F43F5E", 190)}
        {lane("MIRROR ×−1", "#06B6D4", 390)}
        {lane("YOU HEAR", "#10B981", 590)}

        {/* Lane guides */}
        <div style={{ position: "absolute", top: 190, left: 34, right: 34, height: 2, backgroundColor: "rgba(51,65,85,0.8)" }} />
        <div style={{ position: "absolute", top: 390, left: 34, right: 34, height: 2, backgroundColor: "rgba(51,65,85,0.8)" }} />
        <div style={{ position: "absolute", top: 590, left: 34, right: 34, height: 2, backgroundColor: "rgba(51,65,85,0.8)" }} />

        {/* WAVES */}
        <svg width={cardW} height={cardH} style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}>
          {redAmp > 1 && (
            <path d={wavePath(redAmp, 190, phase, 7)} stroke="#F43F5E" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.95} />
          )}
          {showAnti && (
            <path
              d={wavePath(190 * (1 - cancelProg * 0.45), 390, phase + Math.PI, 23)}
              stroke="#06B6D4"
              strokeWidth={6}
              fill="none"
              strokeDasharray="12 9"
              strokeLinecap="round"
              opacity={0.95}
            />
          )}
          {!showAnti && youHearAmp > 1 && (
            <path d={wavePath(youHearAmp, 590, phase, 3)} stroke="#F43F5E" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.6} />
          )}
          {showAnti && (
            <path
              d={`M34,${590} L${cardW - 34},${590}`}
              stroke={nemiTheme.colors.brandGreen}
              strokeWidth={cancelProg > 0.85 ? 8 : 4}
              strokeLinecap="round"
              style={{ filter: cancelProg > 0.85 ? "drop-shadow(0 0 18px rgba(16,185,129,0.9))" : "none" }}
              opacity={interpolate(cancelProg, [0, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            />
          )}
        </svg>

        {/* SILENCE badge on YOU HEAR lane */}
        {showAnti && cancelProg > 0.55 && (
          <div
            style={{
              position: "absolute",
              top: 590 - 54,
              right: 34,
              zIndex: 5,
              transform: `scale(${interpolate(frame % 40, [0, 20, 40], [1, 1.1, 1])})`,
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                fontFamily: nemiTheme.typography.fontFamily.mono,
                color: nemiTheme.colors.brandGreen,
                textShadow: "0 0 22px rgba(16,185,129,0.8)",
              }}
            >
              SILENCE ✓ 0
            </div>
          </div>
        )}
      </div>
    </div>
  );
};// ═══════════════════════════════════════════════════════════════
// DYNAMIC KARAOKE CAPTIONS
// ═══════════════════════════════════════════════════════════════
const DynamicKaraokeCaptions: React.FC<{ frame: number }> = ({ frame }) => {
  const subtitles = (cuesData.subtitles || []) as any[];
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
          const wordPop = isWordActive
            ? interpolate(frame - w.start_frame, [0, 3, 7], [1.0, 1.18, 1.08], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1.0;

          const activeColor = idx % 2 === 0 ? "#FFD166" : "#22D3EE";

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
};// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export const NoiseComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 600;

  const evAss = getEvent("nc02_assumption");
  const evGuess = getEvent("nc03_nemi_guess");
  const evRev = getEvent("nc04_reversal");
  const evPay = getEvent("nc06_payoff");
  const evNemiPay = getEvent("nc07_nemi_payoff");

  const waveCollapse = getCue("nc01_hook", "wave_collapse");
  const deadenStamp = getCue("nc02_assumption", "deaden_stamp");
  const earplugBump = getCue("nc02_assumption", "earplug_bump");
  const buzzerShock = getCue("nc03_nemi_guess", "buzzer_shock");
  const micIn = getCue("nc04_reversal", "mic_in");
  const mirrorFlip = getCue("nc04_reversal", "mirror_flip");
  const antiFire = getCue("nc04_reversal", "anti_fire");
  const cancelZero = getCue("nc06_payoff", "cancel_zero");
  const flatlineZero = getCue("nc06_payoff", "flatline_zero");
  const smugStamp = getCue("nc07_nemi_payoff", "smug_stamp");
  const loopFight = getCue("nc08_loop", "loop_fight");

  const cutB = evAss.start_frame;
  const cutD = evRev.start_frame;
  const cutE = evPay.start_frame;
  const cutF = evNemiPay.start_frame - 1;

  const inStageA = frame < cutB;
  const inStageB = frame >= cutB && frame < cutD;
  const inStageDE = frame >= cutD && frame < cutF;
  const inStageF = frame >= cutF;

  // Console state in the explain stage (D/E):
  const showAnti = inStageDE ? frame >= mirrorFlip : true;
  const cancelProg = inStageA
    ? interpolate(frame, [0, Math.max(2, waveCollapse)], [0.25, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : inStageDE
      ? interpolate(frame, [cancelZero, cancelZero + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 1;

  const punch = (at: number, amt = 0.045, dur = 7) => {
    const d = frame - at;
    if (at <= 0 || d < 0) return 0;
    return interpolate(d, [0, 2, dur], [amt, amt * 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };
  const cutSettle = (at: number) => {
    const d = frame - at;
    if (d < 0) return 0;
    return interpolate(d, [0, 5], [0.05, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };
  const punchTotal =
    punch(waveCollapse, 0.05) +
    punch(mirrorFlip, 0.05) +
    punch(cancelZero, 0.06) +
    punch(buzzerShock) +
    punch(smugStamp) +
    cutSettle(cutB) + cutSettle(cutD) + cutSettle(cutE) + cutSettle(cutF);
  const cameraScale = 1 + punchTotal + interpolate(frame, [0, totalFrames], [0.0, 0.02], { extrapolateRight: "clamp" });

  let nemiPose: NemiPose = "shocked";
  let nemiSpeech: string | null = null;
  if (frame < cutB) nemiPose = "shocked";
  else if (frame < evGuess.start_frame) nemiPose = "thinking";
  else if (frame < cutD) { nemiPose = "puzzled"; nemiSpeech = "So it just muffles the noise?!?!"; }
  else if (frame < cutE) nemiPose = "explaining";
  else if (frame < cutF) nemiPose = "aha";
  else if (frame < evNemiPay.end_frame + 4) { nemiPose = "smug"; nemiSpeech = "So quiet is just math? 😎"; }
  else nemiPose = "smug";

  return (
    <AbsoluteFill style={{ backgroundColor: nemiTheme.colors.canvasLight, overflow: "hidden", fontFamily: nemiTheme.typography.fontFamily.sans }}>
      <Audio src={staticFile("reels/noise_11/noise_master_audio.mp3")} volume={0.9} />

      {/* SFX LAYER */}
      <Sequence from={0} durationInFrames={35}><Audio src={staticFile("reels/noise_11/sfx/whoosh.mp3")} volume={0.7} /></Sequence>
      <Sequence from={Math.max(0, waveCollapse)} durationInFrames={30}><Audio src={staticFile("reels/noise_11/sfx/riser.mp3")} volume={0.66} /></Sequence>
      <Sequence from={Math.max(0, cutB - 1)} durationInFrames={35}><Audio src={staticFile("reels/noise_11/sfx/whoosh.mp3")} volume={0.7} /></Sequence>
      <Sequence from={earplugBump} durationInFrames={22}><Audio src={staticFile("reels/noise_11/sfx/pop.mp3")} volume={0.63} /></Sequence>
      <Sequence from={buzzerShock} durationInFrames={30}><Audio src={staticFile("reels/noise_11/sfx/notification.mp3")} volume={0.66} /></Sequence>
      <Sequence from={Math.max(0, cutD - 1)} durationInFrames={35}><Audio src={staticFile("reels/noise_11/sfx/whoosh.mp3")} volume={0.7} /></Sequence>
      <Sequence from={micIn} durationInFrames={20}><Audio src={staticFile("reels/noise_11/sfx/ping.mp3")} volume={0.66} /></Sequence>
      <Sequence from={mirrorFlip} durationInFrames={35}><Audio src={staticFile("reels/noise_11/sfx/riser.mp3")} volume={0.7} /></Sequence>
      <Sequence from={antiFire} durationInFrames={16}><Audio src={staticFile("reels/noise_11/sfx/click.mp3")} volume={0.63} /></Sequence>
      <Sequence from={Math.max(0, cutE - 1)} durationInFrames={35}><Audio src={staticFile("reels/noise_11/sfx/whoosh.mp3")} volume={0.7} /></Sequence>
      <Sequence from={cancelZero} durationInFrames={30}><Audio src={staticFile("reels/noise_11/sfx/error.mp3")} volume={0.66} /></Sequence>
      <Sequence from={flatlineZero} durationInFrames={40}><Audio src={staticFile("reels/noise_11/sfx/chime.mp3")} volume={0.7} /></Sequence>
      <Sequence from={Math.max(0, cutF - 1)} durationInFrames={35}><Audio src={staticFile("reels/noise_11/sfx/whoosh.mp3")} volume={0.7} /></Sequence>
      <Sequence from={smugStamp} durationInFrames={30}><Audio src={staticFile("reels/noise_11/sfx/notification.mp3")} volume={0.66} /></Sequence>
      <Sequence from={loopFight} durationInFrames={30}><Audio src={staticFile("reels/noise_11/sfx/ping.mp3")} volume={0.7} /></Sequence>{/* CAMERA WRAPPER */}
      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        {/* Ambient tint glow */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
          <div style={{ position: "absolute", top: 140, left: -160, width: 640, height: 640, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(0,0,0,0) 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", top: 800, right: -160, width: 640, height: 640, borderRadius: "50%", background: cancelProg > 0.9 ? "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(0,0,0,0) 70%)" : "radial-gradient(circle, rgba(244,63,94,0.16) 0%, rgba(0,0,0,0) 70%)", filter: "blur(80px)" }} />
        </div>

        {/* TOP HUD */}
        {frame >= 55 && (
          <div style={{ position: "absolute", top: 85, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 50, opacity: interpolate(frame, [55, 63], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: cancelProg > 0.9 ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCyan, boxShadow: `0 0 24px ${cancelProg > 0.9 ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCyan}`, transform: `scale(${interpolate(frame % 20, [0, 10, 20], [1, 1.25, 1])})` }} />
              <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", color: "#D97706" }}>Ep.11 · Active Noise Cancelling</span>
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.96)", padding: "12px 24px", borderRadius: 24, border: "2px solid #E2E8F0", fontSize: 20, fontWeight: 900, color: cancelProg > 0.9 ? nemiTheme.colors.brandGreen : "#D97706", fontFamily: nemiTheme.typography.fontFamily.mono, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>
              {cancelProg > 0.9 ? "CANCELLED ✓" : "RAW NOISE…"}
            </div>
          </div>
        )}

        {/* STAGE A — FRAME-0 MONEY SHOT: waves colliding to flat */}
        {inStageA && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.12, color: nemiTheme.colors.textLight, transform: `scale(${interpolate(frame, [0, 5], [1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
                SILENCE IS MADE OF <span style={{ color: nemiTheme.colors.brandCoral }}>SOUND.</span>
              </div>
            </div>
            <ConsoleCard frame={frame} showAnti={true} cancelProg={cancelProg} />
          </>
        )}

        {/* STAGE B — assumption: earplugs don't scale */}
        {inStageB && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.12, color: nemiTheme.colors.textLight, transform: `scale(${interpolate(frame - cutB, [0, 5], [1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
                YOU THINK IT <span style={{ color: nemiTheme.colors.brandCoral }}>BLOCKS</span> THE NOISE.
              </div>
            </div>
            <div style={{ position: "absolute", top: 560, left: "50%", transform: "translateX(-50%)", zIndex: 35 }}>
              <div style={{ width: 880, height: 480, backgroundColor: "#FFFFFF", borderRadius: 36, border: "3px solid #E2E8F0", boxShadow: "0 30px 70px rgba(15, 23, 42, 0.22)", position: "relative" }}>
                <div style={{ position: "absolute", top: 30, left: 36, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: nemiTheme.colors.brandCoral, opacity: frame % 24 < 12 ? 1 : 0.35 }} />
                  <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2, color: "#64748B", fontFamily: nemiTheme.typography.fontFamily.mono }}>PASSIVE · FOAM</span>
                </div>
                <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center" }}>
                  <span style={{ fontSize: 96, display: "inline-block", transform: `scale(${1 + Math.sin(frame / 9) * 0.06})` }}>🔊</span>
                  <span style={{ fontSize: 56, fontWeight: 900, color: nemiTheme.colors.brandCoral, margin: "0 24px" }}>✕</span>
                  <span style={{ fontSize: 96 }}>🦻</span>
                </div>
                <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center" }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#64748B", fontFamily: nemiTheme.typography.fontFamily.mono }}>EARPLUGS MUTE EVERYTHING — INCLUDING THE WORLD.</span>
                </div>
              </div>
            </div>
          </>
        )}{/* STAGE D/E — the mechanism: mic → mirror → cancel */}
        {inStageDE && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: frame >= cancelZero ? 56 : 52, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.12, color: frame >= cancelZero ? nemiTheme.colors.brandGreen : nemiTheme.colors.textLight, transform: `scale(${interpolate(frame - cutD, [0, 5], [1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`, textShadow: frame >= cancelZero ? "0 0 34px rgba(16,185,129,0.55)" : "none" }}>
                {frame >= cancelZero ? (
                  <>PEAK + ANTI-PEAK = <span style={{ color: nemiTheme.colors.brandGreen }}>0</span> → SILENCE</>
                ) : (
                  <>IT PLAYS A <span style={{ color: nemiTheme.colors.brandCyan }}>MIRROR IMAGE</span> BACK</>
                )}
              </div>
            </div>
            <ConsoleCard frame={frame} showAnti={showAnti} cancelProg={cancelProg} />
            <div style={{ position: "absolute", top: 362, left: 70, right: 70, display: "flex", justifyContent: "center", gap: 16, zIndex: 55 }}>
              {[
                { label: "MIC HEARS", on: frame >= micIn, color: nemiTheme.colors.brandCyan },
                { label: "× −1 INVERT", on: frame >= mirrorFlip, color: nemiTheme.colors.brandYellow },
                { label: "SPEAKER FIRES", on: frame >= antiFire, color: nemiTheme.colors.brandGreen },
              ].map((chip, i) => {
                const ci = interpolate(frame - (cutD + 4 + i * 7), [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={chip.label} style={{ backgroundColor: chip.on ? chip.color : nemiTheme.colors.cardDark, color: "#F8FAFC", fontSize: 20, fontWeight: 900, letterSpacing: 0.5, padding: "12px 22px", borderRadius: 18, opacity: chip.on ? 1 : 0.5, transform: `scale(${0.7 + 0.3 * (chip.on ? 1 : ci * 0.5)})`, boxShadow: "0 10px 26px rgba(0,0,0,0.25)", fontFamily: nemiTheme.typography.fontFamily.mono, whiteSpace: "nowrap" }}>
                    {chip.label}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* STAGE F — LOOP SEAM */}
        {inStageF && (
          <>
            <div style={{ position: "absolute", top: 190, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, lineHeight: 1.1, color: nemiTheme.colors.textLight, transform: `scale(${interpolate(frame - cutF, [0, 5], [1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
                YOUR QUIET IS <span style={{ color: frame >= loopFight ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCyan }}>A FIGHT.</span>
              </div>
            </div>
            <ConsoleCard frame={frame - cutF} showAnti={true} cancelProg={1} />
            <div style={{ position: "absolute", top: 1030, left: 70, right: 70, display: "flex", justifyContent: "center", gap: 16, zIndex: 55 }}>
              {["1 MIC HEARS", "2 WAVE INVERTED", "3 PEAK + ANTI-PEAK = 0"].map((chip, i) => {
                const cIn = interpolate(frame - (cutF + 8 + i * 6), [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={chip} style={{ backgroundColor: i === 2 ? nemiTheme.colors.brandGreen : nemiTheme.colors.cardDark, color: "#F8FAFC", fontSize: 19, fontWeight: 900, letterSpacing: 0.5, padding: "12px 20px", borderRadius: 18, opacity: cIn, transform: `scale(${0.7 + cIn * 0.3})`, boxShadow: "0 10px 26px rgba(0,0,0,0.25)", fontFamily: nemiTheme.typography.fontFamily.mono, whiteSpace: "nowrap" }}>
                    {chip}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* KARAOKE CAPTIONS */}
        {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} />}

        {/* MASCOT DOCK */}
        <div style={{ position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 60 }}>
          <NemiMascot pose={nemiPose} scale={1.65} />
        </div>

        {/* SPEECH BUBBLE */}
        {nemiSpeech && (
          <div style={{ position: "absolute", bottom: 440, left: "50%", transform: "translateX(-50%)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ backgroundColor: nemiTheme.colors.brandYellow, color: "#18181B", fontWeight: 900, fontSize: 32, padding: "16px 36px", borderRadius: 26, border: "3.5px solid #18181B", boxShadow: "0 18px 45px rgba(0,0,0,0.45)", transform: `scale(${interpolate(frame % 30, [0, 15, 30], [1, 1.05, 1])})`, whiteSpace: "nowrap" }}>
              {nemiSpeech}
            </div>
            <div style={{ width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: "14px solid #18181B", marginTop: -2 }} />
          </div>
        )}

        {/* WATERMARK */}
        <div style={{ position: "absolute", bottom: 40, right: 40, zIndex: 90, fontSize: 22, fontWeight: 900, color: "rgba(15, 23, 42, 0.45)", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          @nemi.explains
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};