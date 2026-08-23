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
import cuesData from "../../src/data/qr_06_cues.json";

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
  const ev = cuesData.timeline_events.find((x: any) => x.id === id);
  return ev ?? { start_frame: 0, end_frame: 0, start_time_ms: 0, end_time_ms: 0, duration_s: 0, semantic_cues: [] };
};

const getCue = (eventId: string, cueName: string): number => {
  const ev = getEvent(eventId);
  const c = (ev.semantic_cues ?? []).find((x: any) => x.cue === cueName);
  return c ? c.frame : ev.start_frame;
};

// Deterministic PRNG so the QR pattern is identical on every render
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

const GRID = 21;
const isFinder = (r: number, c: number) =>
  (r < 7 && c < 7) || (r < 7 && c >= GRID - 7) || (r >= GRID - 7 && c < 7);

const buildMatrix = () => {
  const rand = mulberry32(1337);
  const dark: boolean[][] = [];
  const parity: boolean[][] = [];
  for (let r = 0; r < GRID; r++) {
    dark[r] = [];
    parity[r] = [];
    for (let c = 0; c < GRID; c++) {
      if (isFinder(r, c)) {
        const fr = r < 7 ? r : r - (GRID - 7);
        const fc = c < 7 ? c : c - (GRID - 7);
        const ring = fr === 0 || fr === 6 || fc === 0 || fc === 6;
        const core = fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4;
        dark[r][c] = ring || core;
        parity[r][c] = false;
      } else if (r === 6 || c === 6) {
        dark[r][c] = (r + c) % 2 === 0;
        parity[r][c] = false;
      } else {
        dark[r][c] = rand() < 0.48;
        parity[r][c] = (r * 5 + c * 11) % 19 < 5;
      }
    }
  }
  return { dark, parity };
};
const QR = buildMatrix();

// Erased chunk region (rows 9-13, cols 12-17) — the "destroyed" zone
const isErased = (r: number, c: number) => r >= 9 && r <= 13 && c >= 12 && c <= 17;

export const QrCodeComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 544;

  // ─── Timeline Events ───
  const evHook = getEvent("qr01_hook");
  const evSecret = getEvent("qr02_secret");
  const evGuess = getEvent("qr03_nemi_guess");
  const evReversal = getEvent("qr04_reversal");
  const evPayoff = getEvent("qr05_payoff");
  const evNemiPayoff = getEvent("qr06_nemi_payoff");
  const evLoop = getEvent("qr07_loop");

  // ─── Semantic Cue Frames ───
  const scribbleBurst = getCue("qr01_hook", "scribble_burst");
  const scanCheck = getCue("qr01_hook", "scan_check");
  const gridReveal = getCue("qr02_secret", "grid_reveal");
  const goldModules = getCue("qr02_secret", "gold_modules");
  const buzzerShock = getCue("qr03_nemi_guess", "buzzer_shock");
  const rsTitle = getCue("qr04_reversal", "rs_title");
  const laserRebuild = getCue("qr04_reversal", "laser_rebuild");
  const meterSurge = getCue("qr05_payoff", "meter_surge");
  const rebuiltChime = getCue("qr05_payoff", "rebuilt_chime");
  // Visuals flip with the spoken word "perfectly" (~10 frames before the chime accent)
  // so the REBUILT state gets a full beat on screen before the loop cut.
  const rebuiltVisual = rebuiltChime - 10;
  const smugStamp = getCue("qr06_nemi_payoff", "smug_stamp");
  const scribbleAgain = getCue("qr07_loop", "scribble_again");
  const loopCheck = getCue("qr07_loop", "loop_check");

  // ─── Stage Boundaries (punch cuts) ───
  const cutB = evSecret.start_frame; // 88
  const cutD = evReversal.start_frame; // 211
  const cutF = evNemiPayoff.start_frame - 1; // 415

  // ─── Canvas: cream for hook + loop payoff, dark for the deep dive ───
  const isDarkWorld = frame >= cutB && frame < cutF;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;
  const textMain = isDarkWorld ? nemiTheme.colors.textDark : nemiTheme.colors.textLight;

  // ─── Camera: continuous breathing + punch-in accents + cut settle ───
  const breathing = interpolate(frame, [0, totalFrames], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });
  const punch = (at: number, amt = 0.045, dur = 7) => {
    const d = frame - at;
    if (at <= 0 || d < 0) return 0;
    return interpolate(d, [0, 2, dur], [amt, amt * 0.5, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };
  const cutSettle = (at: number) => {
    const d = frame - at;
    if (d < 0) return 0;
    return interpolate(d, [0, 5], [0.05, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };
  const punchTotal =
    punch(scanCheck) +
    punch(rsTitle) +
    punch(laserRebuild, 0.055) +
    punch(rebuiltVisual, 0.055) +
    punch(loopCheck) +
    cutSettle(cutB) +
    cutSettle(cutD) +
    cutSettle(cutF);
  const cameraScale = breathing + punchTotal;

  // ─── Nemi Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "shocked";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "shocked";
  } else if (frame < evGuess.start_frame) {
    nemiPose = "thinking";
  } else if (frame < cutD) {
    nemiPose = "shocked";
    nemiSpeech = "Spare copies?! 🤯";
  } else if (frame < evPayoff.start_frame) {
    nemiPose = "pointing";
  } else if (frame < cutF) {
    nemiPose = "aha";
  } else if (frame < evNemiPayoff.end_frame + 4) {
    nemiPose = "smug";
    nemiSpeech = "Math wins again! 😎";
  } else {
    nemiPose = "smug";
  }

  const inStageA = frame < cutB;
  const inStageBC = frame >= cutB && frame < cutD;
  const inStageDE = frame >= cutD && frame < cutF;
  const inStageF = frame >= cutF;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: canvasBg,
        overflow: "hidden",
        fontFamily: nemiTheme.typography.fontFamily.sans,
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Voice + Luminary BGM with dynamic story arc) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/qr_06/qr_master_audio.mp3")} volume={0.9} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SFX LAYER (frame-synced, whoosh leads cuts by 15ms) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/qr_06/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={scribbleBurst} durationInFrames={20}>
        <Audio src={staticFile("reels/qr_06/sfx/pop.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={scribbleBurst + 5} durationInFrames={20}>
        <Audio src={staticFile("reels/qr_06/sfx/pop.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={scribbleBurst + 10} durationInFrames={20}>
        <Audio src={staticFile("reels/qr_06/sfx/pop.mp3")} volume={0.56} />
      </Sequence>
      <Sequence from={scanCheck} durationInFrames={30}>
        <Audio src={staticFile("reels/qr_06/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutB - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/qr_06/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={gridReveal} durationInFrames={18}>
        <Audio src={staticFile("reels/qr_06/sfx/pop.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={gridReveal + 5} durationInFrames={18}>
        <Audio src={staticFile("reels/qr_06/sfx/pop.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={gridReveal + 10} durationInFrames={18}>
        <Audio src={staticFile("reels/qr_06/sfx/pop.mp3")} volume={0.56} />
      </Sequence>
      <Sequence from={goldModules} durationInFrames={30}>
        <Audio src={staticFile("reels/qr_06/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={buzzerShock} durationInFrames={30}>
        <Audio src={staticFile("reels/qr_06/sfx/error.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutD - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/qr_06/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={rsTitle} durationInFrames={30}>
        <Audio src={staticFile("reels/qr_06/sfx/notification.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={laserRebuild} durationInFrames={50}>
        <Audio src={staticFile("reels/qr_06/sfx/riser.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={meterSurge} durationInFrames={25}>
        <Audio src={staticFile("reels/qr_06/sfx/click.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={rebuiltChime} durationInFrames={45}>
        <Audio src={staticFile("reels/qr_06/sfx/chime.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={rebuiltChime} durationInFrames={18}>
        <Audio src={staticFile("reels/qr_06/sfx/pop.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={rebuiltChime + 5} durationInFrames={18}>
        <Audio src={staticFile("reels/qr_06/sfx/pop.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={rebuiltChime + 10} durationInFrames={18}>
        <Audio src={staticFile("reels/qr_06/sfx/pop.mp3")} volume={0.56} />
      </Sequence>
      <Sequence from={Math.max(0, cutF - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/qr_06/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={smugStamp} durationInFrames={30}>
        <Audio src={staticFile("reels/qr_06/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={loopCheck} durationInFrames={30}>
        <Audio src={staticFile("reels/qr_06/sfx/ping.mp3")} volume={0.7} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CAMERA WRAPPER (continuous breathing + punch accents) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        {/* ══════════════════════════════════════════════════════════ */}
        {/* AMBIENT GLOW (dark world only) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {isDarkWorld && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
            <div
              style={{
                position: "absolute",
                top: 180,
                left: -160,
                width: 620,
                height: 620,
                borderRadius: "50%",
                background:
                  frame >= rebuiltVisual
                    ? "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(0,0,0,0) 70%)"
                    : "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(80px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 700,
                right: -160,
                width: 620,
                height: 620,
                borderRadius: "50%",
                background:
                  frame >= laserRebuild
                    ? "radial-gradient(circle, rgba(255, 209, 102, 0.18) 0%, rgba(0,0,0,0) 70%)"
                    : "radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(80px)",
              }}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TOP HUD (Safe Zone: top 85px) — appears AFTER second 2 */}
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
                  backgroundColor: frame >= rebuiltVisual ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandYellow,
                  boxShadow: `0 0 24px ${frame >= rebuiltVisual ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandYellow}`,
                  transform: `scale(${interpolate(frame % 20, [0, 10, 20], [1.0, 1.25, 1.0])})`,
                }}
              />
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: isDarkWorld ? "#FFD166" : "#D97706",
                }}
              >
                Ep.6 · QR Error Correction
              </span>
            </div>
            <div
              style={{
                backgroundColor: isDarkWorld ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.96)",
                padding: "12px 24px",
                borderRadius: 24,
                border: `2px solid ${isDarkWorld ? nemiTheme.colors.borderDark : nemiTheme.colors.borderLight}`,
                fontSize: 20,
                fontWeight: 900,
                color: isDarkWorld ? "#FFD166" : "#D97706",
                fontFamily: nemiTheme.typography.fontFamily.mono,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              {inStageA || inStageF ? "SCAN TEST" : inStageBC ? "UNDER THE GRID" : "REED-SOLOMON"}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE A — FRAME-0 HOOK: destroyed QR code scans anyway */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageA && (
          <>
            {/* Contradiction overlay — the hook text, NOT a topic title */}
            <div
              style={{
                position: "absolute",
                top: 190,
                left: 70,
                right: 70,
                textAlign: "center",
                zIndex: 55,
              }}
            >
              <div
                style={{
                  fontSize: 62,
                  fontWeight: 900,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                  color: frame >= scanCheck ? nemiTheme.colors.brandGreen : nemiTheme.colors.textLight,
                  transform: `scale(${
                    frame >= scanCheck
                      ? interpolate(frame - scanCheck, [0, 4, 9], [1.25, 1.08, 1.0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })
                      : interpolate(frame, [0, 5], [1.15, 1.0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })
                  })`,
                  textShadow: frame >= scanCheck ? "0 0 30px rgba(16, 185, 129, 0.45)" : "none",
                }}
              >
                {frame >= scanCheck ? (
                  <>
                    IT STILL <span style={{ color: nemiTheme.colors.brandGreen }}>SCANNED.</span>
                  </>
                ) : (
                  <>
                    YOU DESTROYED THIS CODE.
                  </>
                )}
              </div>
            </div>

            <QrCard
              frame={frame}
              scanCheck={scanCheck}
              scribbleBurst={scribbleBurst}
              scribblesDrawn={false}
              scanning={frame >= 6}
            />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE B+C — THE GRID & NEMI'S WRONG GUESS */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageBC && (
          <>
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
                  lineHeight: 1.12,
                  color: nemiTheme.colors.textDark,
                  transform: `scale(${interpolate(frame - cutB, [0, 5], [1.12, 1.0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                }}
              >
                EVERY CODE HIDES{" "}
                <span style={{ color: nemiTheme.colors.brandYellow }}>BACKUP MATH</span>
              </div>
            </div>

            <ModuleGridPanel frame={frame} cutB={cutB} gridReveal={gridReveal} goldModules={goldModules} buzzerShock={buzzerShock} />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE D+E — REED-SOLOMON MECHANISM & RECONSTRUCTION CLIMAX */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageDE && (
          <>
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
                  fontSize: frame >= rebuiltVisual ? 54 : 58,
                  fontWeight: 900,
                  letterSpacing: -1.5,
                  lineHeight: 1.12,
                  color: frame >= rebuiltVisual ? nemiTheme.colors.brandGreen : nemiTheme.colors.textDark,
                  transform: `scale(${interpolate(frame - cutD, [0, 5], [1.12, 1.0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                  textShadow: frame >= rebuiltVisual ? "0 0 30px rgba(16, 185, 129, 0.5)" : "none",
                }}
              >
                {frame >= rebuiltVisual ? (
                  <>REBUILT FROM <span style={{ color: nemiTheme.colors.brandGreen }}>PURE MATH</span></>
                ) : (
                  <>NOT COPIES — <span style={{ color: nemiTheme.colors.brandCyan }}>EQUATIONS</span></>
                )}
              </div>
            </div>

            <MechanismPanel
              frame={frame}
              rsTitle={rsTitle}
              laserRebuild={laserRebuild}
              meterSurge={meterSurge}
              rebuiltVisual={rebuiltVisual}
            />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE F — PAYOFF & LOOP SEAM (matches Frame 0) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageF && (
          <>
            <div
              style={{
                position: "absolute",
                top: 190,
                left: 70,
                right: 70,
                textAlign: "center",
                zIndex: 55,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                  color: nemiTheme.colors.textLight,
                  transform: `scale(${interpolate(frame - cutF, [0, 5], [1.12, 1.0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                }}
              >
                SCRIBBLE AWAY.{" "}
                <span style={{ color: frame >= loopCheck ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandYellow }}>
                  {frame >= loopCheck ? "IT SCANNED." : "IT ALWAYS SCANS."}
                </span>
              </div>
            </div>

            {/* Compact takeaway chips (mid-screen badge zone) */}
            <div
              style={{
                position: "absolute",
                top: 1020,
                left: 70,
                right: 70,
                display: "flex",
                justifyContent: "center",
                gap: 16,
                zIndex: 55,
              }}
            >
              {["30% DESTROYED", "REBUILT BY EQUATIONS", "SCANS EVERY TIME"].map((chip, i) => {
                const chipIn = interpolate(frame - (cutF + 8 + i * 6), [0, 6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <div
                    key={chip}
                    style={{
                      backgroundColor: i === 2 ? nemiTheme.colors.brandGreen : nemiTheme.colors.cardDark,
                      color: "#F8FAFC",
                      fontSize: 19,
                      fontWeight: 900,
                      letterSpacing: 0.5,
                      padding: "12px 20px",
                      borderRadius: 18,
                      opacity: chipIn,
                      transform: `scale(${0.7 + chipIn * 0.3})`,
                      boxShadow: "0 10px 26px rgba(0,0,0,0.25)",
                      fontFamily: nemiTheme.typography.fontFamily.mono,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chip}
                  </div>
                );
              })}
            </div>

            <QrCard
              frame={frame}
              scanCheck={loopCheck}
              scribbleBurst={scribbleAgain}
              scribblesDrawn={true}
              scanning={frame >= loopCheck - 14}
            />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top 1140px) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} />}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* MASCOT DOCK (Safe Zone: bottom 70px) */}
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
        {/* SPEECH BUBBLE (Strictly above Nemi) */}
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

        {/* ══════════════════════════════════════════════════════════ */}
        {/* CHANNEL WATERMARK */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            zIndex: 90,
            fontSize: 22,
            fontWeight: 900,
            color: isDarkWorld ? "rgba(248, 250, 252, 0.55)" : "rgba(15, 23, 42, 0.45)",
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          @nemi.explains
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// QR CARD — the hero anomaly (used in Stage A and Stage F for the loop seam)
// ═══════════════════════════════════════════════════════════════
const QrCard: React.FC<{
  frame: number;
  scanCheck: number;
  scribbleBurst: number;
  scribblesDrawn: boolean;
  scanning: boolean;
}> = ({ frame, scanCheck, scribbleBurst, scribblesDrawn, scanning }) => {
  const cardTop = 400;
  const cardSize = 600;
  const quiet = 40;
  const moduleSize = (cardSize - quiet * 2) / GRID;

  const cardPop = interpolate(frame, [0, 6], [0.9, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scanner beam sweep
  const beamProgress = scanning
    ? interpolate(frame, [scanCheck - 14, scanCheck], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Check pop
  const checkIn = frame >= scanCheck
    ? interpolate(frame - scanCheck, [0, 4, 8], [0, 1.35, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const scribbleProgress = scribblesDrawn
    ? 1
    : interpolate(frame, [scribbleBurst, scribbleBurst + 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return (
    <div
      style={{
        position: "absolute",
        top: cardTop,
        left: "50%",
        transform: `translateX(-50%) scale(${cardPop})`,
        zIndex: 30,
      }}
    >
      <div
        style={{
          width: cardSize,
          height: cardSize,
          backgroundColor: "#FFFFFF",
          borderRadius: 36,
          border: "3px solid #E2E8F0",
          boxShadow: "0 30px 70px rgba(15, 23, 42, 0.22)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* QR modules */}
        <div
          style={{
            position: "absolute",
            top: quiet,
            left: quiet,
            width: cardSize - quiet * 2,
            height: cardSize - quiet * 2,
            display: "grid",
            gridTemplateColumns: `repeat(${GRID}, ${moduleSize}px)`,
            gridTemplateRows: `repeat(${GRID}, ${moduleSize}px)`,
          }}
        >
          {QR.dark.map((row, r) =>
            row.map((isDark, c) =>
              isDark ? (
                <div
                  key={`${r}_${c}`}
                  style={{
                    backgroundColor: "#18181B",
                    borderRadius: moduleSize * 0.22,
                    width: moduleSize - 2.5,
                    height: moduleSize - 2.5,
                  }}
                />
              ) : (
                <div key={`${r}_${c}`} />
              )
            )
          )}
        </div>

        {/* Marker scribbles (SVG overlay) */}
        <svg
          width={cardSize}
          height={cardSize}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <path
            d="M 120 180 C 220 140, 320 240, 430 190 S 540 260, 480 320"
            stroke="#1E293B"
            strokeWidth={26}
            strokeLinecap="round"
            fill="none"
            opacity={0.92}
            strokeDasharray={900}
            strokeDashoffset={900 * (1 - scribbleProgress)}
          />
          <path
            d="M 100 380 C 200 430, 340 330, 460 400 S 520 480, 430 500"
            stroke="#334155"
            strokeWidth={22}
            strokeLinecap="round"
            fill="none"
            opacity={0.88}
            strokeDasharray={820}
            strokeDashoffset={820 * (1 - scribbleProgress)}
          />
          <path
            d="M 170 90 C 260 120, 300 60, 420 100"
            stroke="#1E293B"
            strokeWidth={20}
            strokeLinecap="round"
            fill="none"
            opacity={0.85}
            strokeDasharray={420}
            strokeDashoffset={420 * (1 - scribbleProgress)}
          />
        </svg>

        {/* Scanner beam */}
        {beamProgress > 0 && beamProgress < 1 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: beamProgress * cardSize,
              height: 8,
              background:
                "linear-gradient(90deg, rgba(6,182,212,0) 0%, #06B6D4 20%, #22D3EE 50%, #06B6D4 80%, rgba(6,182,212,0) 100%)",
              boxShadow: "0 0 30px rgba(6, 182, 212, 0.9), 0 0 60px rgba(6, 182, 212, 0.5)",
            }}
          />
        )}

        {/* Green check pop */}
        {checkIn > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${checkIn})`,
              width: 190,
              height: 190,
              borderRadius: "50%",
              backgroundColor: nemiTheme.colors.brandGreen,
              border: "8px solid #FFFFFF",
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.85), 0 24px 60px rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={110} height={110} viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5L9.5 18L20 6.5"
                stroke="#FFFFFF"
                strokeWidth={3.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MODULE GRID PANEL — Stage B+C (the hidden backup math)
// ═══════════════════════════════════════════════════════════════
const ModuleGridPanel: React.FC<{
  frame: number;
  cutB: number;
  gridReveal: number;
  goldModules: number;
  buzzerShock: number;
}> = ({ frame, cutB, gridReveal, goldModules, buzzerShock }) => {
  const panelSize = 620;
  const moduleSize = panelSize / GRID;

  const panelIn = interpolate(frame - cutB, [0, 6], [0.85, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stampIn =
    frame >= buzzerShock
      ? interpolate(frame - buzzerShock, [0, 4, 7], [2.2, 0.92, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 400,
        left: "50%",
        transform: `translateX(-50%) scale(${panelIn})`,
        zIndex: 30,
      }}
    >
      <div
        style={{
          width: panelSize,
          height: panelSize,
          backgroundColor: "#0F172A",
          borderRadius: 32,
          border: "3px solid #1E293B",
          boxShadow: "0 30px 70px rgba(0, 0, 0, 0.5), 0 0 50px rgba(6, 182, 212, 0.12)",
          position: "relative",
          padding: 34,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${GRID}, 1fr)`,
            gridTemplateRows: `repeat(${GRID}, 1fr)`,
            gap: 2.5,
          }}
        >
          {QR.dark.map((row, r) =>
            row.map((isDark, c) => {
              const dist = Math.abs(r - 10) + Math.abs(c - 10);
              const revealAt = gridReveal + dist * 1.4;
              const revealed = frame >= revealAt;
              const goldDelay = ((r * 7 + c * 3) % 12) * 2;
              const goldLit =
                frame >= goldModules + goldDelay && QR.parity[r][c] && !isFinder(r, c);
              const pop = goldLit
                ? interpolate(frame - (goldModules + goldDelay), [0, 4, 8], [0.5, 1.3, 1.0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 1;
              const erasedHere = isErased(r, c) && frame >= buzzerShock;

              return (
                <div
                  key={`${r}_${c}`}
                  style={{
                    backgroundColor: erasedHere
                      ? "transparent"
                      : goldLit
                        ? nemiTheme.colors.brandYellow
                        : isDark
                          ? revealed
                            ? "#22D3EE"
                            : "rgba(34, 211, 238, 0.08)"
                          : revealed
                            ? "rgba(34, 211, 238, 0.10)"
                            : "rgba(34, 211, 238, 0.03)",
                    borderRadius: 2.5,
                    transform: `scale(${revealed ? pop : 0.4})`,
                    boxShadow: goldLit ? "0 0 14px rgba(255, 209, 102, 0.75)" : "none",
                    border: erasedHere ? "1.5px dashed rgba(244, 63, 94, 0.5)" : "none",
                  }}
                />
              );
            })
          )}
        </div>

        {/* Gold parity label */}
        {frame >= goldModules + 14 && (
          <div
            style={{
              position: "absolute",
              bottom: -22,
              left: "50%",
              transform: `translateX(-50%) scale(${interpolate(frame - (goldModules + 14), [0, 6], [0.6, 1.0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })})`,
              backgroundColor: nemiTheme.colors.brandYellow,
              color: "#18181B",
              fontSize: 21,
              fontWeight: 900,
              letterSpacing: 1,
              padding: "12px 26px",
              borderRadius: 18,
              fontFamily: nemiTheme.typography.fontFamily.mono,
              boxShadow: "0 12px 30px rgba(255, 209, 102, 0.35)",
              whiteSpace: "nowrap",
            }}
          >
            HIDDEN PARITY MATH
          </div>
        )}

        {/* Red wrong-guess stamp */}
        {stampIn > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(-12deg) scale(${stampIn})`,
              fontSize: 96,
              fontWeight: 900,
              color: nemiTheme.colors.brandCoral,
              border: `10px solid ${nemiTheme.colors.brandCoral}`,
              borderRadius: 20,
              padding: "8px 36px",
              letterSpacing: 4,
              background: "rgba(7, 11, 18, 0.72)",
              textShadow: "0 0 40px rgba(244, 63, 94, 0.6)",
              boxShadow: "0 0 70px rgba(244, 63, 94, 0.4)",
            }}
          >
            WRONG!
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MECHANISM PANEL — Stage D+E (equations rebuild the erased chunk)
// ═══════════════════════════════════════════════════════════════
const MechanismPanel: React.FC<{
  frame: number;
  rsTitle: number;
  laserRebuild: number;
  meterSurge: number;
  rebuiltVisual: number;
}> = ({ frame, rsTitle, laserRebuild, meterSurge, rebuiltVisual }) => {
  const panelWidth = 900;
  const panelTop = 400;
  const panelHeight = 460;

  const panelIn = interpolate(frame - (rsTitle - 8), [0, 6], [0.85, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Erased chunk slots refill in a wave after laserRebuild
  const refillProgress =
    frame >= laserRebuild
      ? interpolate(frame, [laserRebuild, rebuiltVisual + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // Damage meter: fills to 30% red, then sweeps to 100% green
  const meterFill =
    frame < meterSurge
      ? 0
      : frame < rebuiltVisual
        ? interpolate(frame, [meterSurge, meterSurge + 12], [0, 30], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : interpolate(frame, [rebuiltVisual, rebuiltVisual + 14], [30, 100], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

  const eqChips = ["P(x) · αᵏ", "GF(256)", "Σ syndromes"];

  return (
    <div
      style={{
        position: "absolute",
        top: panelTop,
        left: "50%",
        transform: `translateX(-50%) scale(${panelIn})`,
        zIndex: 30,
        width: panelWidth,
      }}
    >
      <div
        style={{
          backgroundColor: "#0F172A",
          borderRadius: 32,
          border: "3px solid #1E293B",
          boxShadow: "0 30px 70px rgba(0, 0, 0, 0.5), 0 0 50px rgba(6, 182, 212, 0.1)",
          padding: "34px 40px",
          position: "relative",
        }}
      >
        {/* Equation chips */}
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 28 }}>
          {eqChips.map((chip, i) => {
            const chipIn = interpolate(frame - (rsTitle + 4 + i * 6), [0, 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={chip}
                style={{
                  backgroundColor: "rgba(168, 85, 247, 0.16)",
                  border: "2px solid rgba(168, 85, 247, 0.65)",
                  color: "#D8B4FE",
                  fontSize: 24,
                  fontWeight: 900,
                  padding: "12px 26px",
                  borderRadius: 16,
                  fontFamily: nemiTheme.typography.fontFamily.mono,
                  opacity: chipIn,
                  transform: `translateY(${(1 - chipIn) * 18}px)`,
                  boxShadow: "0 0 24px rgba(168, 85, 247, 0.25)",
                }}
              >
                {chip}
              </div>
            );
          })}
        </div>

        {/* Survivor grid + beams + erased chunk */}
        <div style={{ position: "relative", height: 210 }}>
          {/* Survivors (right side) */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 10,
              width: 250,
              height: 190,
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 5,
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const lit = frame >= rsTitle + i * 2;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: lit ? "#22D3EE" : "rgba(34, 211, 238, 0.08)",
                    borderRadius: 4,
                    boxShadow: lit ? "0 0 10px rgba(34, 211, 238, 0.6)" : "none",
                  }}
                />
              );
            })}
          </div>

          {/* Beams from survivors to the erased chunk */}
          {frame >= laserRebuild &&
            [0, 1, 2].map((b) => (
              <svg
                key={b}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <line
                  x1={panelWidth - 80 - 250}
                  y1={40 + b * 65}
                  x2={250}
                  y2={105}
                  stroke={b === 1 ? "#FFD166" : "#06B6D4"}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={14}
                  strokeDashoffset={-((frame - laserRebuild) * 9)}
                  opacity={0.85}
                  filter="drop-shadow(0 0 8px rgba(34, 211, 238, 0.9))"
                />
              </svg>
            ))}

          {/* Erased chunk being rebuilt */}
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 10,
              width: 250,
              height: 190,
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 5,
              border: "3px dashed rgba(244, 63, 94, 0.65)",
              borderRadius: 14,
              padding: 10,
            }}
          >
            {Array.from({ length: 18 }).map((_, i) => {
              const slotAt = laserRebuild + 10 + i * 5;
              const filled = frame >= slotAt;
              const pop = filled
                ? interpolate(frame - slotAt, [0, 4, 7], [0.3, 1.35, 1.0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 0.25;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: filled ? nemiTheme.colors.brandGreen : "rgba(244, 63, 94, 0.12)",
                    borderRadius: 4,
                    transform: `scale(${pop})`,
                    boxShadow: filled ? "0 0 12px rgba(16, 185, 129, 0.7)" : "none",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Damage → Rebuilt meter */}
        <div style={{ marginTop: 30 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                fontFamily: nemiTheme.typography.fontFamily.mono,
                color: frame >= rebuiltVisual ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCoral,
                letterSpacing: 1,
              }}
            >
              {frame >= rebuiltVisual ? "REBUILT 100% ✓" : `DAMAGE ${Math.round(meterFill)}%`}
            </span>
            <span
              style={{
                fontSize: 19,
                fontWeight: 900,
                color: "#64748B",
                fontFamily: nemiTheme.typography.fontFamily.mono,
              }}
            >
              REED–SOLOMON LIMIT: 30%
            </span>
          </div>
          <div
            style={{
              height: 26,
              borderRadius: 13,
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              border: "2px solid #1E293B",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${meterFill}%`,
                height: "100%",
                borderRadius: 11,
                background:
                  frame >= rebuiltVisual
                    ? "linear-gradient(90deg, #10B981, #34D399)"
                    : "linear-gradient(90deg, #F43F5E, #FB7185)",
                boxShadow:
                  frame >= rebuiltVisual
                    ? "0 0 24px rgba(16, 185, 129, 0.8)"
                    : "0 0 24px rgba(244, 63, 94, 0.7)",
                transition: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top 1140px)
// ═══════════════════════════════════════════════════════════════
const DynamicKaraokeCaptions: React.FC<{ frame: number }> = ({ frame }) => {
  const subtitles = cuesData.subtitles || [];
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
          border: "2px solid rgba(168, 85, 247, 0.55)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(168, 85, 247, 0.25)",
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
};
