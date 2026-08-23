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
import cuesData from "../../src/data/gps_10_cues.json";

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
// Deterministic sky geometry — 3 satellites + intersection pin
// (chosen so the three distance rings visibly cross on ONE point)
// ═══════════════════════════════════════════════════════════════
const SATS = [
  { x: 190, y: 130, label: "SAT 12", dLabel: "19,700 km", color: "#06B6D4" },
  { x: 730, y: 170, label: "SAT 24", dLabel: "21,300 km", color: "#A855F7" },
  { x: 430, y: 90, label: "SAT 07", dLabel: "20,100 km", color: "#FFD166" },
];
const PIN = { x: 450, y: 400 }; // trilateration solution inside the panel

export const GpsComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 600;

  // ─── Timeline Events ───
  const evHook = getEvent("gp01_hook");
  const evSecret = getEvent("gp02_secret");
  const evGuess = getEvent("gp03_nemi_guess");
  const evReversal = getEvent("gp04_reversal");
  const evMechanism = getEvent("gp05_mechanism");
  const evPayoff = getEvent("gp06_payoff");
  const evNemiPayoff = getEvent("gp07_nemi_payoff");
  const evLoop = getEvent("gp08_loop");

  // ─── Semantic Cue Frames ───
  const silentMode = getCue("gp01_hook", "silent_mode");
  const spheresLock = getCue("gp01_hook", "spheres_lock");
  const txOff = getCue("gp02_secret", "tx_off");
  const timestampPop = getCue("gp02_secret", "timestamp_pop");
  const buzzerShock = getCue("gp03_nemi_guess", "buzzer_shock");
  const wrongStamp = getCue("gp04_reversal", "wrong_stamp");
  const sphereOne = getCue("gp04_reversal", "sphere_one");
  const sphereTwo = getCue("gp05_mechanism", "sphere_two");
  const sphereThree = getCue("gp05_mechanism", "sphere_three");
  const clockFix = getCue("gp06_payoff", "clock_fix");
  const pinDrop = getCue("gp06_payoff", "pin_drop");
  const smugStamp = getCue("gp07_nemi_payoff", "smug_stamp");
  const loopMap = getCue("gp08_loop", "loop_map");
  const loopSilent = getCue("gp08_loop", "loop_silent");

  // ─── Stage Boundaries (punch cuts) ───
  const cutB = evSecret.start_frame;
  const cutD = evReversal.start_frame;
  const cutE = evPayoff.start_frame;
  const cutF = evNemiPayoff.start_frame - 1;

  // ─── Canvas worlds ───
  const isDarkWorld = frame >= cutB && frame < cutF;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;

  // ─── Camera (one-sided guarded accents) ───
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
    punch(spheresLock) +
    punch(timestampPop) +
    punch(sphereOne) +
    punch(sphereTwo) +
    punch(pinDrop, 0.06) +
    punch(loopSilent) +
    cutSettle(cutB) +
    cutSettle(cutD) +
    cutSettle(cutE) +
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
    nemiSpeech = "So it tracks my phone?! 🤯";
  } else if (frame < evPayoff.start_frame) {
    nemiPose = "pointing";
  } else if (frame < cutF) {
    nemiPose = "aha";
  } else if (frame < evNemiPayoff.end_frame + 4) {
    nemiPose = "smug";
    nemiSpeech = "Silence is the trick! 😎";
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
      {/* MASTER AUDIO */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/gps_10/gps_master_audio.mp3")} volume={0.9} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SFX LAYER (-3dB headroom doctrine) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/gps_10/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={silentMode} durationInFrames={18}>
        <Audio src={staticFile("reels/gps_10/sfx/click.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={spheresLock} durationInFrames={30}>
        <Audio src={staticFile("reels/gps_10/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutB - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/gps_10/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={txOff} durationInFrames={20}>
        <Audio src={staticFile("reels/gps_10/sfx/error.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={timestampPop} durationInFrames={45}>
        <Audio src={staticFile("reels/gps_10/sfx/riser.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={buzzerShock} durationInFrames={30}>
        <Audio src={staticFile("reels/gps_10/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={wrongStamp} durationInFrames={30}>
        <Audio src={staticFile("reels/gps_10/sfx/error.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutD - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/gps_10/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={sphereOne} durationInFrames={25}>
        <Audio src={staticFile("reels/gps_10/sfx/pop.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={sphereTwo} durationInFrames={16}>
        <Audio src={staticFile("reels/gps_10/sfx/pop.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={sphereThree} durationInFrames={30}>
        <Audio src={staticFile("reels/gps_10/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={Math.max(0, cutE - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/gps_10/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={clockFix} durationInFrames={22}>
        <Audio src={staticFile("reels/gps_10/sfx/click.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={pinDrop} durationInFrames={45}>
        <Audio src={staticFile("reels/gps_10/sfx/chime.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={pinDrop} durationInFrames={16}>
        <Audio src={staticFile("reels/gps_10/sfx/pop.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={Math.max(0, cutF - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/gps_10/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={smugStamp} durationInFrames={30}>
        <Audio src={staticFile("reels/gps_10/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={loopSilent} durationInFrames={30}>
        <Audio src={staticFile("reels/gps_10/sfx/ping.mp3")} volume={0.7} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CAMERA WRAPPER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        {/* Ambient glow (dark world) */}
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
                  frame >= pinDrop
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
                  frame >= sphereThree
                    ? "radial-gradient(circle, rgba(255, 209, 102, 0.16) 0%, rgba(0,0,0,0) 70%)"
                    : "radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(80px)",
              }}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TOP HUD (appears after second 2) */}
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
                  backgroundColor: frame >= pinDrop ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandYellow,
                  boxShadow: `0 0 24px ${frame >= pinDrop ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandYellow}`,
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
                Ep.10 · Satellite Trilateration
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
                color: frame >= pinDrop ? nemiTheme.colors.brandGreen : isDarkWorld ? "#FFD166" : "#D97706",
                fontFamily: nemiTheme.typography.fontFamily.mono,
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                whiteSpace: "nowrap",
              }}
            >
              {frame >= pinDrop ? "4 SATS LOCKED ✓" : "LISTENING…"}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE A — FRAME-0 HOOK: silent phone + spheres locking */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageA && (
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
                  fontSize: 56,
                  fontWeight: 900,
                  letterSpacing: -1.5,
                  lineHeight: 1.12,
                  color: nemiTheme.colors.textLight,
                  transform: `scale(${interpolate(frame, [0, 5], [1.12, 1.0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                }}
              >
                {frame >= spheresLock ? (
                  <>THEY STILL <span style={{ color: nemiTheme.colors.brandCoral }}>FIND YOU.</span></>
                ) : (
                  <>YOUR PHONE IS <span style={{ color: nemiTheme.colors.brandCoral }}>SILENT.</span></>
                )}
              </div>
            </div>

            <PhoneMapCard
              frame={frame}
              silentMode={silentMode}
              spheresLock={spheresLock}
              loopCheck={-1}
            />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE B+C — THE SECRET: listen-only + atomic timestamps */}
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
                IT NEVER SENDS. IT ONLY{" "}
                <span style={{ color: nemiTheme.colors.brandYellow }}>LISTENS.</span>
              </div>
            </div>

            <SpacePanel
              frame={frame}
              cutB={cutB}
              txOff={txOff}
              timestampPop={timestampPop}
              buzzerShock={buzzerShock}
              wrongStamp={wrongStamp}
            />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE D — DISTANCE SPHERES (mechanism) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageDE && frame < cutE && (
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
                  transform: `scale(${interpolate(frame - cutD, [0, 5], [1.12, 1.0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                }}
              >
                EVERY SAT PAINTS A{" "}
                <span style={{ color: nemiTheme.colors.brandCyan }}>DISTANCE SPHERE</span>
              </div>
            </div>

            <TrilaterationPanel
              frame={frame}
              cutD={cutD}
              sphereOne={sphereOne}
              sphereTwo={sphereTwo}
              sphereThree={sphereThree}
            />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE E — CLOCK FIX + PIN DROP (THE PAYOFF) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageDE && frame >= cutE && (
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
                  fontSize: frame >= pinDrop ? 58 : 52,
                  fontWeight: 900,
                  letterSpacing: -1.5,
                  lineHeight: 1.12,
                  color: frame >= pinDrop ? nemiTheme.colors.brandGreen : nemiTheme.colors.textDark,
                  transform: `scale(${interpolate(frame - cutE, [0, 5], [1.12, 1.0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                  textShadow: frame >= pinDrop ? "0 0 34px rgba(16, 185, 129, 0.55)" : "none",
                }}
              >
                {frame >= pinDrop ? (
                  <>PIN DROPPED <span style={{ color: nemiTheme.colors.brandGreen }}>✓ YOU ARE HERE</span></>
                ) : (
                  <>THE <span style={{ color: nemiTheme.colors.brandYellow }}>4TH SAT</span> FIXES YOUR CLOCK</>
                )}
              </div>
            </div>

            <PayoffPanel
              frame={frame}
              cutE={cutE}
              clockFix={clockFix}
              pinDrop={pinDrop}
            />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE F — PAYOFF & LOOP SEAM */}
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
                YOUR PHONE NEVER{" "}
                <span style={{ color: frame >= loopSilent ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCoral }}>
                  SAID A WORD.
                </span>
              </div>
            </div>

            <PhoneMapCard
              frame={frame - cutF}
              silentMode={8}
              spheresLock={Math.max(24, loopMap - cutF)}
              loopCheck={Math.max(46, loopSilent - cutF)}
            />

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
              {["PHONE LISTENS ONLY", "3 SPHERES = POSITION", "4TH FIXES THE CLOCK"].map((chip, i) => {
                const chipIn = interpolate(frame - (cutF + 8 + i * 6), [0, 6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <div
                    key={chip}
                    style={{
                      backgroundColor: i === 1 ? nemiTheme.colors.brandGreen : nemiTheme.colors.cardDark,
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
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* KARAOKE CAPTIONS (top: 1140px) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} />}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* MASCOT DOCK (bottom: 70px) */}
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
        {/* SPEECH BUBBLE */}
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

        {/* WATERMARK */}
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
// PHONE MAP CARD — the hook anomaly (silent phone + spheres locking),
// reused for the loop seam
// ═══════════════════════════════════════════════════════════════
const PhoneMapCard: React.FC<{
  frame: number;
  silentMode: number;
  spheresLock: number;
  loopCheck: number;
}> = ({ frame, silentMode, spheresLock, loopCheck }) => {
  const cardTop = 420;
  const cardW = 880;
  const cardH = 500;

  // Panel-local geometry: satellites above, one shared solution point below
  const sats = [
    { x: 190, y: 130, color: "#06B6D4", delay: 0 },
    { x: 690, y: 140, color: "#A855F7", delay: 5 },
    { x: 430, y: 80, color: "#F59E0B", delay: 10 },
  ];
  const pin = { x: 440, y: 360 };
  const radii = sats.map((s) => Math.hypot(pin.x - s.x, pin.y - s.y));

  const cardIn = interpolate(frame, [0, 6], [0.9, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lockIn =
    frame >= spheresLock
      ? interpolate(frame - spheresLock, [0, 5, 9], [0, 1.2, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const checkIn =
    loopCheck > 0 && frame >= loopCheck
      ? interpolate(frame - loopCheck, [0, 4, 8], [0, 1.35, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: cardTop,
        left: "50%",
        transform: `translateX(-50%) scale(${cardIn})`,
        zIndex: 30,
      }}
    >
      <div
        style={{
          width: cardW,
          height: cardH,
          backgroundColor: "#FFFFFF",
          borderRadius: 36,
          border: "3px solid #E2E8F0",
          boxShadow: "0 30px 70px rgba(15, 23, 42, 0.22)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Status bar */}
        <div style={{ position: "absolute", top: 28, left: 32, display: "flex", alignItems: "center", gap: 12, zIndex: 3 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: frame >= silentMode ? nemiTheme.colors.brandCoral : nemiTheme.colors.brandGreen,
              opacity: frame % 24 < 12 ? 1 : 0.35,
            }}
          />
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 2,
              color: "#64748B",
              fontFamily: nemiTheme.typography.fontFamily.mono,
            }}
          >
            {frame >= silentMode ? "TX: OFF ✕ · RX: ON" : "GPS MAP"}
          </span>
        </div>

        {/* Map grid + rings + satellites */}
        <svg width={cardW} height={cardH} style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <linearGradient id="mapBgGps" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EFF6FF" />
              <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
          </defs>
          <rect width={cardW} height={cardH} fill="url(#mapBgGps)" opacity={0.55} />
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 88} y1={0} x2={i * 88} y2={cardH} stroke="#CBD5E1" strokeWidth={1} opacity={0.6} />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 83} x2={cardW} y2={i * 83} stroke="#CBD5E1" strokeWidth={1} opacity={0.6} />
          ))}

          {/* Distance rings expanding from each satellite toward the pin */}
          {sats.map((s, si) => {
            // Rings grow from the very start of the card's local timeline so the
            // trilateration solve is already mid-action at Frame 0 (money shot)
            const startAt = 6 + s.delay * 2;
            const grow =
              frame >= startAt
                ? interpolate(frame - startAt, [0, 16], [0, radii[si]], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 0;
            if (grow <= 0) return null;
            return (
              <circle
                key={`ring${si}`}
                cx={s.x}
                cy={s.y}
                r={grow}
                fill="none"
                stroke={s.color}
                strokeWidth={frame >= spheresLock ? 4 : 3}
                strokeDasharray="10 8"
                opacity={frame >= spheresLock ? 0.85 : 0.65}
              />
            );
          })}

          {/* Satellites */}
          {sats.map((s, si) => (
            <g key={`sat${si}`}>
              <circle cx={s.x} cy={s.y} r={17} fill={s.color} />
              <circle cx={s.x} cy={s.y} r={24} fill="none" stroke={s.color} strokeWidth={2} opacity={0.35} />
            </g>
          ))}
        </svg>

        {/* The locked pin (trilateration solution) */}
        {lockIn > 0 && (
          <div
            style={{
              position: "absolute",
              left: pin.x - 40,
              top: pin.y - 84,
              transform: `scale(${lockIn})`,
              transformOrigin: "bottom center",
              filter: "drop-shadow(0 12px 24px rgba(244, 63, 94, 0.5))",
              zIndex: 2,
            }}
          >
            <svg width={80} height={92} viewBox="0 0 80 92">
              <path
                d="M40 88 C40 88 8 52 8 32 A32 32 0 1 1 72 32 C72 52 40 88 40 88 Z"
                fill="#F43F5E"
                stroke="#FFFFFF"
                strokeWidth={5}
              />
              <circle cx={40} cy={33} r={11} fill="#FFFFFF" />
            </svg>
          </div>
        )}

        {/* Loop check ring */}
        {checkIn > 0 && (
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${checkIn})`,
              width: 170,
              height: 170,
              borderRadius: "50%",
              backgroundColor: nemiTheme.colors.brandGreen,
              border: "8px solid #FFFFFF",
              boxShadow: "0 0 60px rgba(16,185,129,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            <svg width={96} height={96} viewBox="0 0 24 24" fill="none">
              <path d="M4 12.5L9.5 18L20 6.5" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SPACE PANEL — Stage B/C (listen-only + atomic timestamps + WRONG stamp)
// ═══════════════════════════════════════════════════════════════
const SpacePanel: React.FC<{
  frame: number;
  cutB: number;
  txOff: number;
  timestampPop: number;
  buzzerShock: number;
  wrongStamp: number;
}> = ({ frame, cutB, txOff, timestampPop, buzzerShock, wrongStamp }) => {
  const panelW = 940;
  const panelH = 620;
  const panelTop = 380;

  const panelIn = interpolate(frame - cutB, [0, 6], [0.85, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const txOffIn =
    frame >= txOff
      ? interpolate(frame - txOff, [0, 4, 7], [1.6, 0.92, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const stampIn =
    frame >= buzzerShock
      ? interpolate(frame - buzzerShock, [0, 4, 7], [2.2, 0.92, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const rand = mulberry32(101);
  const stars = Array.from({ length: 34 }, () => ({
    x: rand() * panelW,
    y: rand() * (panelH - 160),
    r: 1 + rand() * 2.2,
    phase: rand() * Math.PI * 2,
  }));

  // Satellite positions inside the panel + the listening phone below
  const sats = [
    { x: 170, y: 130, color: "#06B6D4", chip: "t = 0.000000012s" },
    { x: 770, y: 110, color: "#A855F7", chip: "t = 0.000000046s" },
    { x: 470, y: 70, color: "#FFD166", chip: "t = 0.000000031s" },
  ];
  const phone = { x: panelW / 2, y: panelH - 120 };

  return (
    <div
      style={{
        position: "absolute",
        top: panelTop,
        left: "50%",
        transform: `translateX(-50%) scale(${panelIn})`,
        zIndex: 30,
      }}
    >
      <div
        style={{
          width: panelW,
          height: panelH,
          backgroundColor: "#0F172A",
          borderRadius: 32,
          border: "3px solid #1E293B",
          boxShadow: "0 30px 70px rgba(0,0,0,0.5), 0 0 50px rgba(6,182,212,0.10)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Twinkling starfield */}
        {stars.map((st, i) => (
          <div
            key={`star${i}`}
            style={{
              position: "absolute",
              left: st.x,
              top: st.y,
              width: st.r * 2,
              height: st.r * 2,
              borderRadius: "50%",
              backgroundColor: "#E2E8F0",
              opacity: 0.25 + 0.55 * Math.abs(Math.sin(frame * 0.08 + st.phase)),
            }}
          />
        ))}

        {/* Earth arc */}
        <div
          style={{
            position: "absolute",
            bottom: -340,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1400,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle at 50% 0%, #134E4A 0%, #0F172A 70%)",
            border: "3px solid rgba(16, 185, 129, 0.45)",
          }}
        />

        {/* Satellites with live downlink beams */}
        {sats.map((s, si) => {
          const beamOn = frame >= cutB + 10 + si * 4;
          return (
            <div key={`sat${si}`}>
              <div
                style={{
                  position: "absolute",
                  left: s.x - 26,
                  top: s.y - 26,
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  boxShadow: `0 0 34px ${s.color}`,
                }}
              >
                🛰
              </div>
              {/* Downlink beam (dashed animated line) */}
              <svg
                width={panelW}
                height={panelH}
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
              >
                {beamOn && (
                  <line
                    x1={s.x}
                    y1={s.y + 26}
                    x2={phone.x}
                    y2={phone.y - 20}
                    stroke={s.color}
                    strokeWidth={3}
                    strokeDasharray="12 10"
                    strokeDashoffset={-(frame * 3)}
                    opacity={0.75}
                  />
                )}
              </svg>
              {/* Atomic timestamp chip */}
              {frame >= timestampPop && (
                <div
                  style={{
                    position: "absolute",
                    left: s.x - 110,
                    top: s.y + 34,
                    width: 220,
                    textAlign: "center",
                    backgroundColor: "rgba(7, 11, 18, 0.92)",
                    border: `2px solid ${s.color}`,
                    borderRadius: 14,
                    color: s.color,
                    fontSize: 18,
                    fontWeight: 900,
                    fontFamily: nemiTheme.typography.fontFamily.mono,
                    padding: "8px 10px",
                    opacity: interpolate(frame - timestampPop, [0, 6], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    transform: `scale(${interpolate(frame - timestampPop - si * 3, [0, 5, 9], [0.6, 1.15, 1.0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })})`,
                  }}
                >
                  {s.chip}
                </div>
              )}
            </div>
          );
        })}

        {/* Listening phone */}
        <div
          style={{
            position: "absolute",
            left: phone.x - 46,
            top: phone.y - 60,
            width: 92,
            height: 130,
            backgroundColor: "#18181B",
            border: "4px solid #334155",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px rgba(16, 185, 129, 0.35)",
          }}
        >
          <span style={{ fontSize: 44 }}>📱</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: phone.x - 120,
            top: phone.y + 76,
            width: 240,
            textAlign: "center",
            fontSize: 19,
            fontWeight: 900,
            letterSpacing: 2,
            color: nemiTheme.colors.brandGreen,
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          RX ONLY · LISTENING
        </div>

        {/* TRANSMIT OFF crossed badge */}
        {txOffIn > 0 && (
          <div
            style={{
              position: "absolute",
              top: 250,
              left: "50%",
              transform: `translate(-50%, 0) scale(${txOffIn})`,
              backgroundColor: "rgba(244, 63, 94, 0.16)",
              border: "4px solid #F43F5E",
              borderRadius: 20,
              padding: "14px 34px",
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: 2,
              color: "#FB7185",
              fontFamily: nemiTheme.typography.fontFamily.mono,
              textDecoration: "line-through",
              textDecorationThickness: 5,
              boxShadow: "0 0 50px rgba(244, 63, 94, 0.35)",
              whiteSpace: "nowrap",
            }}
          >
            TRANSMIT: ON
          </div>
        )}

        {/* WRONG stamp */}
        {stampIn > 0 && (
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(-12deg) scale(${stampIn})`,
              fontSize: 92,
              fontWeight: 900,
              color: nemiTheme.colors.brandCoral,
              border: `10px solid ${nemiTheme.colors.brandCoral}`,
              borderRadius: 20,
              padding: "8px 36px",
              letterSpacing: 4,
              background: "rgba(7, 11, 18, 0.72)",
              textShadow: "0 0 40px rgba(244, 63, 94, 0.6)",
              boxShadow: "0 0 70px rgba(244, 63, 94, 0.4)",
              zIndex: 5,
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
// TRILATERATION PANEL — Stage D (three spheres → one intersection)
// ═══════════════════════════════════════════════════════════════
const TRILAT_SATS = [
  { x: 190, y: 140, r: 20, color: "#06B6D4", label: "SAT 12", d: "19,700 km" },
  { x: 750, y: 160, r: 20, color: "#A855F7", label: "SAT 24", d: "21,300 km" },
  { x: 460, y: 90, r: 20, color: "#FFD166", label: "SAT 07", d: "20,100 km" },
];
const TRILAT_PIN = { x: 460, y: 470 };

const TrilaterationPanel: React.FC<{
  frame: number;
  cutD: number;
  sphereOne: number;
  sphereTwo: number;
  sphereThree: number;
}> = ({ frame, cutD, sphereOne, sphereTwo, sphereThree }) => {
  const panelW = 940;
  const panelH = 620;
  const panelTop = 380;

  const panelIn = interpolate(frame - cutD, [0, 6], [0.85, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const growStarts = [sphereOne, sphereTwo, sphereThree];
  const radii = TRILAT_SATS.map((s) => Math.hypot(TRILAT_PIN.x - s.x, TRILAT_PIN.y - s.y));

  const solveIn =
    frame >= sphereThree
      ? interpolate(frame - sphereThree, [0, 5, 9], [0, 1.5, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: panelTop,
        left: "50%",
        transform: `translateX(-50%) scale(${panelIn})`,
        zIndex: 30,
      }}
    >
      <div
        style={{
          width: panelW,
          height: panelH,
          backgroundColor: "#0F172A",
          borderRadius: 32,
          border: "3px solid #1E293B",
          boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: 2,
            color: "#64748B",
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          TRILATERATION · 2D CROSS-SECTION
        </div>

        <svg width={panelW} height={panelH} style={{ position: "absolute", top: 0, left: 0 }}>
          {/* Growing distance circles */}
          {TRILAT_SATS.map((s, si) => {
            const startAt = growStarts[si];
            const grow =
              frame >= startAt
                ? interpolate(frame - startAt, [0, 18], [0, radii[si]], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 0;
            if (grow <= 0) return null;
            return (
              <circle
                key={`c${si}`}
                cx={s.x}
                cy={s.y}
                r={grow}
                fill={`${s.color}14`}
                stroke={s.color}
                strokeWidth={4}
                strokeDasharray="14 10"
                strokeDashoffset={-(frame * 2.4)}
              />
            );
          })}

          {/* Satellites */}
          {TRILAT_SATS.map((s, si) => (
            <g key={`ts${si}`}>
              <circle cx={s.x} cy={s.y} r={s.r} fill={s.color} />
              <text
                x={s.x}
                y={s.y - 34}
                textAnchor="middle"
                fontSize={19}
                fontWeight={900}
                fill={s.color}
                fontFamily="'JetBrains Mono', monospace"
              >
                {s.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Distance chips */}
        {TRILAT_SATS.map((s, si) => {
          const chipIn =
            frame >= growStarts[si] + 6
              ? interpolate(frame - (growStarts[si] + 6), [0, 6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;
          if (chipIn <= 0) return null;
          return (
            <div
              key={`dc${si}`}
              style={{
                position: "absolute",
                left: s.x - 80,
                top: s.y + 30,
                width: 160,
                textAlign: "center",
                backgroundColor: "rgba(7, 11, 18, 0.92)",
                border: `2px solid ${s.color}`,
                borderRadius: 12,
                color: s.color,
                fontSize: 17,
                fontWeight: 900,
                fontFamily: nemiTheme.typography.fontFamily.mono,
                padding: "6px 8px",
                opacity: chipIn,
              }}
            >
              d = {s.d}
            </div>
          );
        })}

        {/* Solution point */}
        {solveIn > 0 && (
          <>
            <svg
              width={panelW}
              height={panelH}
              style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            >
              <circle
                cx={TRILAT_PIN.x}
                cy={TRILAT_PIN.y}
                r={14 + 4 * Math.sin(frame * 0.35)}
                fill={nemiTheme.colors.brandGreen}
              />
              <circle
                cx={TRILAT_PIN.x}
                cy={TRILAT_PIN.y}
                r={30 + 10 * Math.abs(Math.sin(frame * 0.2))}
                fill="none"
                stroke={nemiTheme.colors.brandGreen}
                strokeWidth={3}
                opacity={0.5}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                left: TRILAT_PIN.x - 130,
                top: TRILAT_PIN.y + 34,
                width: 260,
                textAlign: "center",
                backgroundColor: nemiTheme.colors.brandGreen,
                color: "#fff",
                fontSize: 22,
                fontWeight: 900,
                padding: "10px 18px",
                borderRadius: 14,
                fontFamily: nemiTheme.typography.fontFamily.mono,
                transform: `scale(${solveIn})`,
                boxShadow: "0 12px 34px rgba(16, 185, 129, 0.5)",
                whiteSpace: "nowrap",
              }}
            >
              3 SPHERES → 1 POINT
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAYOFF PANEL — Stage E (4th satellite kills the clock error, pin drops)
// ═══════════════════════════════════════════════════════════════
const PayoffPanel: React.FC<{
  frame: number;
  cutE: number;
  clockFix: number;
  pinDrop: number;
}> = ({ frame, cutE, clockFix, pinDrop }) => {
  const panelW = 940;
  const panelH = 620;
  const panelTop = 380;

  const panelIn = interpolate(frame - cutE, [0, 6], [0.85, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Full constellation incl. the 4th satellite that solves clock bias
  const satsAll = [
    ...TRILAT_SATS,
    { x: 790, y: 500, r: 20, color: "#F59E0B", label: "SAT 11", d: "18,900 km" },
  ];
  const radii = satsAll.map((s) => Math.hypot(TRILAT_PIN.x - s.x, TRILAT_PIN.y - s.y));

  const pinY =
    frame >= pinDrop
      ? interpolate(frame - pinDrop, [0, 8], [-420, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : -420;

  const pinPop =
    frame >= pinDrop
      ? interpolate(frame - pinDrop, [0, 5, 9], [0.7, 1.15, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0.7;

  const labelIn =
    frame >= pinDrop + 10
      ? interpolate(frame - (pinDrop + 10), [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: panelTop,
        left: "50%",
        transform: `translateX(-50%) scale(${panelIn})`,
        zIndex: 30,
      }}
    >
      <div
        style={{
          width: panelW,
          height: panelH,
          backgroundColor: "#0F172A",
          borderRadius: 32,
          border: "3px solid #1E293B",
          boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg width={panelW} height={panelH} style={{ position: "absolute", top: 0, left: 0 }}>
          {/* All four distance circles (4th one dashed amber) */}
          {satsAll.map((s, si) => {
            const isFourth = si === 3;
            const startAt = isFourth ? clockFix : cutE + 2 + si * 3;
            const grow =
              frame >= startAt
                ? interpolate(frame - startAt, [0, 16], [0, radii[si]], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 0;
            if (grow <= 0) return null;
            return (
              <circle
                key={`pc${si}`}
                cx={s.x}
                cy={s.y}
                r={grow}
                fill="none"
                stroke={s.color}
                strokeWidth={isFourth ? 5 : 3}
                strokeDasharray={isFourth ? "6 6" : "14 10"}
                strokeDashoffset={-(frame * 2.4)}
                opacity={frame >= pinDrop ? (isFourth ? 1 : 0.45) : 0.85}
              />
            );
          })}

          {/* Satellites */}
          {satsAll.map((s, si) => (
            <g key={`ps${si}`}>
              <circle cx={s.x} cy={s.y} r={s.r} fill={s.color} />
              <text
                x={s.x}
                y={s.y - 30}
                textAnchor="middle"
                fontSize={18}
                fontWeight={900}
                fill={s.color}
                fontFamily="'JetBrains Mono', monospace"
              >
                {s.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Clock error chip → synced */}
        <div
          style={{
            position: "absolute",
            left: TRILAT_PIN.x - 150,
            top: TRILAT_PIN.y - 96,
            width: 300,
            textAlign: "center",
            backgroundColor: "rgba(7, 11, 18, 0.94)",
            border: `3px solid ${frame >= clockFix ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCoral}`,
            borderRadius: 14,
            fontSize: 20,
            fontWeight: 900,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            padding: "10px 12px",
            color: frame >= clockFix ? nemiTheme.colors.brandGreen : "#FB7185",
            whiteSpace: "nowrap",
          }}
        >
          {frame >= clockFix ? "CLOCK DRIFT FIXED ✓" : "+19 ns CLOCK DRIFT ✕"}
        </div>

        {/* The dropped pin */}
        {frame >= pinDrop && (
          <div
            style={{
              position: "absolute",
              left: TRILAT_PIN.x - 46,
              top: TRILAT_PIN.y - 90 + pinY,
              transform: `scale(${pinPop})`,
              transformOrigin: "bottom center",
              filter: "drop-shadow(0 0 34px rgba(16, 185, 129, 0.85))",
            }}
          >
            <svg width={92} height={106} viewBox="0 0 80 92">
              <path
                d="M40 88 C40 88 8 52 8 32 A32 32 0 1 1 72 32 C72 52 40 88 40 88 Z"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth={5}
              />
              <circle cx={40} cy={33} r={11} fill="#FFFFFF" />
            </svg>
          </div>
        )}

        {/* YOU ARE HERE label */}
        {labelIn > 0 && (
          <div
            style={{
              position: "absolute",
              left: TRILAT_PIN.x - 170,
              top: TRILAT_PIN.y + 44,
              width: 340,
              textAlign: "center",
              backgroundColor: nemiTheme.colors.brandGreen,
              color: "#FFFFFF",
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: 1,
              padding: "12px 22px",
              borderRadius: 16,
              fontFamily: nemiTheme.typography.fontFamily.mono,
              transform: `scale(${labelIn})`,
              boxShadow: "0 16px 44px rgba(16, 185, 129, 0.55)",
              whiteSpace: "nowrap",
            }}
          >
            ✓ YOU ARE HERE
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// KARAOKE CAPTIONS
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
