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
import cuesData from "../../src/data/shazam_07_cues.json";

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

// Deterministic constellation points for the spectrogram fingerprint
const buildConstellation = () => {
  const rand = mulberry32(4242);
  const pts: { x: number; y: number; band: number }[] = [];
  for (let i = 0; i < 26; i++) {
    pts.push({
      x: 40 + rand() * 540,
      y: 30 + rand() * 400,
      band: Math.floor(rand() * 3),
    });
  }
  return pts.sort((a, b) => a.x - b.x);
};
const STARS = buildConstellation();

// Anchor→target pairs used in the mechanism stage (indices into STARS)
const PAIRS = [
  [1, 7], [2, 11], [3, 15], [5, 19], [6, 22], [8, 24],
];
const DELTAS = ["+0.00s", "+0.09s", "+0.21s", "+0.33s", "+0.48s", "+0.61s"];

export const ShazamComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 608;

  // ─── Timeline Events ───
  const evHook = getEvent("sh01_hook");
  const evSecret = getEvent("sh02_secret");
  const evGuess = getEvent("sh03_nemi_guess");
  const evReversal = getEvent("sh04_reversal");
  const evPayoff = getEvent("sh05_payoff");
  const evNemiPayoff = getEvent("sh06_nemi_payoff");
  const evLoop = getEvent("sh07_loop");

  // ─── Semantic Cue Frames ───
  const waveformChaos = getCue("sh01_hook", "waveform_chaos");
  const titlePop = getCue("sh01_hook", "title_pop");
  const spectrogramMorph = getCue("sh02_secret", "spectrogram_morph");
  const constellation = getCue("sh02_secret", "constellation");
  const buzzerShock = getCue("sh03_nemi_guess", "buzzer_shock");
  const starPairs = getCue("sh04_reversal", "star_pairs");
  const hashTable = getCue("sh04_reversal", "hash_table");
  const histBars = getCue("sh05_payoff", "hist_bars");
  const histSpike = getCue("sh05_payoff", "hist_spike");
  const smugStamp = getCue("sh06_nemi_payoff", "smug_stamp");
  const loopWave = getCue("sh07_loop", "loop_wave");
  const loopCheck = getCue("sh07_loop", "loop_check");

  // ─── Stage Boundaries (punch cuts) ───
  const cutB = evSecret.start_frame; // 95
  const cutD = evReversal.start_frame; // 228
  const cutE = evPayoff.start_frame; // 372
  const cutF = evNemiPayoff.start_frame - 1; // 472

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
    punch(titlePop) +
    punch(starPairs) +
    punch(hashTable) +
    punch(histSpike, 0.06) +
    punch(loopCheck) +
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
    nemiSpeech = "Search all songs?! 🤯";
  } else if (frame < evPayoff.start_frame) {
    nemiPose = "pointing";
  } else if (frame < cutF) {
    nemiPose = "aha";
  } else if (frame < evNemiPayoff.end_frame + 4) {
    nemiPose = "smug";
    nemiSpeech = "Stars don't lie! 😎";
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
      <Audio src={staticFile("reels/shazam_07/shazam_master_audio.mp3")} volume={0.9} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SFX LAYER (-3dB headroom doctrine) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/shazam_07/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={waveformChaos} durationInFrames={18}>
        <Audio src={staticFile("reels/shazam_07/sfx/pop.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={waveformChaos + 6} durationInFrames={18}>
        <Audio src={staticFile("reels/shazam_07/sfx/pop.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={titlePop} durationInFrames={30}>
        <Audio src={staticFile("reels/shazam_07/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutB - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/shazam_07/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={spectrogramMorph} durationInFrames={45}>
        <Audio src={staticFile("reels/shazam_07/sfx/riser.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={constellation} durationInFrames={25}>
        <Audio src={staticFile("reels/shazam_07/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={constellation + 5} durationInFrames={16}>
        <Audio src={staticFile("reels/shazam_07/sfx/pop.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={constellation + 10} durationInFrames={16}>
        <Audio src={staticFile("reels/shazam_07/sfx/pop.mp3")} volume={0.56} />
      </Sequence>
      <Sequence from={buzzerShock} durationInFrames={30}>
        <Audio src={staticFile("reels/shazam_07/sfx/error.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutD - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/shazam_07/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={starPairs} durationInFrames={28}>
        <Audio src={staticFile("reels/shazam_07/sfx/notification.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={hashTable} durationInFrames={25}>
        <Audio src={staticFile("reels/shazam_07/sfx/click.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={hashTable + 6} durationInFrames={25}>
        <Audio src={staticFile("reels/shazam_07/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={Math.max(0, cutE - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/shazam_07/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={histBars} durationInFrames={16}>
        <Audio src={staticFile("reels/shazam_07/sfx/pop.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={histBars + 5} durationInFrames={16}>
        <Audio src={staticFile("reels/shazam_07/sfx/pop.mp3")} volume={0.56} />
      </Sequence>
      <Sequence from={histSpike} durationInFrames={45}>
        <Audio src={staticFile("reels/shazam_07/sfx/chime.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={histSpike} durationInFrames={16}>
        <Audio src={staticFile("reels/shazam_07/sfx/pop.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={Math.max(0, cutF - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/shazam_07/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={smugStamp} durationInFrames={30}>
        <Audio src={staticFile("reels/shazam_07/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={loopCheck} durationInFrames={30}>
        <Audio src={staticFile("reels/shazam_07/sfx/ping.mp3")} volume={0.7} />
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
                  frame >= histSpike
                    ? "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(0,0,0,0) 70%)"
                    : "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(0,0,0,0) 70%)",
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
                  frame >= starPairs
                    ? "radial-gradient(circle, rgba(255, 209, 102, 0.16) 0%, rgba(0,0,0,0) 70%)"
                    : "radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(0,0,0,0) 70%)",
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
                  backgroundColor: frame >= histSpike ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandYellow,
                  boxShadow: `0 0 24px ${frame >= histSpike ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandYellow}`,
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
                Ep.7 · Audio Fingerprints
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
              {inStageA || inStageF ? "LIVE TEST" : inStageBC ? "SPECTROGRAM" : "HASH MATCH"}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE A — FRAME-0 HOOK */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageA && (
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
                  fontSize: 60,
                  fontWeight: 900,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                  color: frame >= titlePop ? nemiTheme.colors.textLight : nemiTheme.colors.textLight,
                  transform: `scale(${
                    frame >= titlePop
                      ? interpolate(frame - titlePop, [0, 4, 9], [1.22, 1.08, 1.0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })
                      : interpolate(frame, [0, 5], [1.12, 1.0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })
                  })`,
                }}
              >
                {frame >= titlePop ? (
                  <>
                    ...AND <span style={{ color: nemiTheme.colors.brandGreen }}>NAMED THE SONG.</span>
                  </>
                ) : (
                  <>
                    IT HEARD <span style={{ color: nemiTheme.colors.brandCoral }}>1 SECOND OF NOISE.</span>
                  </>
                )}
              </div>
            </div>

            <WaveformCard
              frame={frame}
              chaosActive={true}
              titlePop={titlePop}
              checkAt={-1}
            />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE B+C — SPECTROGRAM & CONSTELLATION */}
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
                IT NEVER RECORDS. IT{" "}
                <span style={{ color: nemiTheme.colors.brandYellow }}>DRAWS</span> THE SONG.
              </div>
            </div>

            <SpectrogramPanel
              frame={frame}
              cutB={cutB}
              spectrogramMorph={spectrogramMorph}
              constellation={constellation}
              buzzerShock={buzzerShock}
            />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE D — STAR PAIRS BECOME HASHES */}
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
                STAR PAIRS BECOME{" "}
                <span style={{ color: nemiTheme.colors.brandCyan }}>TINY CODES</span>
              </div>
            </div>

            <MechanismPanel frame={frame} starPairs={starPairs} hashTable={hashTable} />
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE E — OFFSET HISTOGRAM SPIKE (THE PAYOFF) */}
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
                  fontSize: frame >= histSpike ? 58 : 52,
                  fontWeight: 900,
                  letterSpacing: -1.5,
                  lineHeight: 1.12,
                  color: frame >= histSpike ? nemiTheme.colors.brandGreen : nemiTheme.colors.textDark,
                  transform: `scale(${interpolate(frame - cutE, [0, 5], [1.12, 1.0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                  textShadow: frame >= histSpike ? "0 0 34px rgba(16, 185, 129, 0.55)" : "none",
                }}
              >
                {frame >= histSpike ? (
                  <>ONE SPIKE <span style={{ color: nemiTheme.colors.brandGreen }}>= THE SONG</span></>
                ) : (
                  <>MATCH ENOUGH <span style={{ color: nemiTheme.colors.brandCyan }}>PAIRS...</span></>
                )}
              </div>
            </div>

            <HistogramPanel frame={frame} cutE={cutE} histBars={histBars} histSpike={histSpike} />
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
                ONE HEARTBEAT IS{" "}
                <span style={{ color: frame >= loopCheck ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandYellow }}>
                  ENOUGH.
                </span>
              </div>
            </div>

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
              {["NO RECORDING", "STAR-PAIR HASHES", "1 SECOND IS ENOUGH"].map((chip, i) => {
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

            <WaveformCard
              frame={frame}
              chaosActive={false}
              titlePop={cutF + 10}
              checkAt={loopCheck}
            />
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
// WAVEFORM CARD — the hook anomaly (chaos → song name), reused for loop seam
// ═══════════════════════════════════════════════════════════════
const WaveformCard: React.FC<{
  frame: number;
  chaosActive: boolean;
  titlePop: number;
  checkAt: number;
}> = ({ frame, chaosActive, titlePop, checkAt }) => {
  const cardTop = 420;
  const cardW = 880;
  const cardH = 500;

  const rand = mulberry32(99);
  const bars = Array.from({ length: 32 }, (_, i) => ({
    base: 0.25 + rand() * 0.75,
    phase: rand() * Math.PI * 2,
  }));

  const cardIn = interpolate(frame, [0, 6], [0.9, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleIn =
    frame >= titlePop
      ? interpolate(frame - titlePop, [0, 5, 9], [0, 1.15, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const checkIn =
    checkAt > 0 && frame >= checkAt
      ? interpolate(frame - checkAt, [0, 4, 8], [0, 1.35, 1.0], {
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
        {/* REC indicator */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: chaosActive ? nemiTheme.colors.brandCoral : nemiTheme.colors.brandGreen,
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
            {chaosActive ? "LISTENING…" : "IDENTIFIED ✓"}
          </span>
        </div>

        {/* Waveform bars */}
        <div
          style={{
            position: "absolute",
            bottom: titleIn > 0.5 ? 190 : 60,
            left: 44,
            right: 44,
            height: cardH - 200,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "none",
          }}
        >
          {bars.map((b, i) => {
            const h = chaosActive
              ? b.base * (0.55 + 0.45 * Math.abs(Math.sin(frame * 0.35 + b.phase)))
              : 0.35 * (1 + 0.3 * Math.sin(frame * 0.12 + b.phase));
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h * 100}%`,
                  minHeight: 8,
                  borderRadius: 6,
                  backgroundColor: chaosActive
                    ? i % 5 === 0
                      ? nemiTheme.colors.brandCoral
                      : "#94A3B8"
                    : nemiTheme.colors.brandGreen,
                  opacity: chaosActive ? 0.85 : 0.9,
                }}
              />
            );
          })}
        </div>

        {/* Song title pop */}
        {titleIn > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 36,
              left: "50%",
              transform: `translateX(-50%) scale(${titleIn})`,
              backgroundColor: nemiTheme.colors.cardDark,
              color: "#F8FAFC",
              padding: "20px 38px",
              borderRadius: 22,
              border: "3px solid #18181B",
              boxShadow: "0 18px 45px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              gap: 18,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 34 }}>♪</span>
            <div>
              <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.5 }}>
                NEON SKYLINE
              </div>
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: "#94A3B8",
                  fontFamily: nemiTheme.typography.fontFamily.mono,
                }}
              >
                VOLT AGE — 2014
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: nemiTheme.colors.brandGreen,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <path d="M4 12.5L9.5 18L20 6.5" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
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
// SPECTROGRAM PANEL — Stage B/C (draws the fingerprint)
// ═══════════════════════════════════════════════════════════════
const SpectrogramPanel: React.FC<{
  frame: number;
  cutB: number;
  spectrogramMorph: number;
  constellation: number;
  buzzerShock: number;
}> = ({ frame, cutB, spectrogramMorph, constellation, buzzerShock }) => {
  const panelW = 720;
  const panelH = 520;
  const cols = 24;
  const rows = 14;

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

  const rand = mulberry32(7);

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
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
          boxShadow: "0 30px 70px rgba(0,0,0,0.5), 0 0 50px rgba(168,85,247,0.12)",
          position: "relative",
          padding: 30,
        }}
      >
        {/* Spectral strips */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 5,
          }}
        >
          {Array.from({ length: cols }).map((_, c) => {
            const seed = rand();
            const litAt = spectrogramMorph + c * 2.2;
            const lit = frame >= litAt;
            const energy = 0.3 + seed * 0.7;
            return (
              <div
                key={c}
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  gap: 4,
                  opacity: lit ? 1 : 0.25,
                }}
              >
                {Array.from({ length: rows }).map((_, r) => {
                  const on =
                    lit &&
                    r < rows * energy * (0.7 + 0.3 * Math.sin(frame * 0.15 + c + r));
                  const isPeakDot =
                    on && r > rows * energy - 2.2 && r <= rows * energy;
                  return (
                    <div
                      key={r}
                      style={{
                        flex: 1,
                        borderRadius: 2.5,
                        backgroundColor: isPeakDot
                          ? nemiTheme.colors.brandPurple
                          : on
                            ? `rgba(34, 211, 238, ${0.16 + (r / rows) * 0.5})`
                            : "rgba(34, 211, 238, 0.05)",
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Constellation dots overlay */}
        {frame >= constellation &&
          STARS.map((pt, i) => {
            const dotAt = constellation + i * 2;
            if (frame < dotAt) return null;
            const pop = interpolate(frame - dotAt, [0, 4, 8], [0, 1.5, 1.0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 30 + pt.x * (1 - 60 / panelW),
                  top: 30 + pt.y * (1 - 60 / panelH),
                  width: 18,
                  height: 18,
                  marginLeft: -9,
                  marginTop: -9,
                  borderRadius: "50%",
                  backgroundColor: pt.band === 0 ? "#FFD166" : pt.band === 1 ? "#F0ABFC" : "#F8FAFC",
                  boxShadow: "0 0 16px rgba(240, 171, 252, 0.9), 0 0 34px rgba(255, 209, 102, 0.4)",
                  transform: `scale(${pop})`,
                }}
              />
            );
          })}

        {/* Label chip */}
        {frame >= constellation + 20 && (
          <div
            style={{
              position: "absolute",
              bottom: -24,
              left: "50%",
              transform: `translateX(-50%) scale(${interpolate(frame - (constellation + 20), [0, 6], [0.6, 1.0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })})`,
              backgroundColor: nemiTheme.colors.brandPurple,
              color: "#fff",
              fontSize: 21,
              fontWeight: 900,
              letterSpacing: 1,
              padding: "12px 26px",
              borderRadius: 18,
              fontFamily: nemiTheme.typography.fontFamily.mono,
              boxShadow: "0 12px 30px rgba(168, 85, 247, 0.4)",
              whiteSpace: "nowrap",
            }}
          >
            PEAK CONSTELLATION MAP
          </div>
        )}

        {/* WRONG stamp */}
        {stampIn > 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
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
// MECHANISM PANEL — Stage D (star pairs → hash codes)
// ═══════════════════════════════════════════════════════════════
const MechanismPanel: React.FC<{ frame: number; starPairs: number; hashTable: number }> = ({
  frame,
  starPairs,
  hashTable,
}) => {
  const panelW = 940;
  const panelTop = 380;

  const panelIn = interpolate(frame - (starPairs - 10), [0, 6], [0.85, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const miniCard = (label: string, w: number, h: number) => (
    <div
      style={{
        width: w,
        height: h,
        backgroundColor: "#0F172A",
        border: "3px dashed rgba(168, 85, 247, 0.55)",
        borderRadius: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 17,
          fontWeight: 900,
          color: "#64748B",
          fontFamily: nemiTheme.typography.fontFamily.mono,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );

  const hashChips = ["h(Δt,Δf)=0x3F9A", "row 88,214", "+1 MATCH"];

  return (
    <div
      style={{
        position: "absolute",
        top: panelTop,
        left: "50%",
        transform: `translateX(-50%) scale(${panelIn})`,
        zIndex: 30,
        width: panelW,
      }}
    >
      <div
        style={{
          backgroundColor: "#0F172A",
          borderRadius: 32,
          border: "3px solid #1E293B",
          boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
          padding: "36px 40px 30px",
          position: "relative",
        }}
      >
        {/* Clip vs database constellations */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 300 }}>
          {/* Clip */}
          <div style={{ position: "relative" }}>
            {miniCard("CLIP · 1s", 260, 280)}
            {STARS.slice(0, 8).map((pt, i) => {
              const dotAt = starPairs + i * 3;
              if (frame < dotAt) return null;
              const pop = interpolate(frame - dotAt, [0, 4, 8], [0, 1.5, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={`c${i}`}
                  style={{
                    position: "absolute",
                    left: 20 + pt.x * 0.38,
                    top: 16 + pt.y * 0.6,
                    width: 14,
                    height: 14,
                    marginLeft: -7,
                    marginTop: -7,
                    borderRadius: "50%",
                    backgroundColor: "#FFD166",
                    boxShadow: "0 0 12px rgba(255,209,102,0.9)",
                    transform: `scale(${pop})`,
                  }}
                />
              );
            })}
          </div>

          {/* Matching lines */}
          {frame >= starPairs + 12 && (
            <svg
              style={{ position: "absolute", left: 130, top: 30, width: panelW - 260, height: 300, pointerEvents: "none" }}
            >
              {PAIRS.map(([a, b], i) => {
                const lineAt = starPairs + 12 + i * 8;
                if (frame < lineAt) return null;
                const from = STARS[a];
                const to = STARS[b];
                return (
                  <line
                    key={i}
                    x1={from.x * 0.38 + 20}
                    y1={from.y * 0.6 + 16}
                    x2={panelW - 260 - 140 + to.x * 0.42 + 20}
                    y2={to.y * 0.62 + 16}
                    stroke={i % 2 === 0 ? "#FFD166" : "#06B6D4"}
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    strokeDasharray={12}
                    strokeDashoffset={-((frame - lineAt) * 6)}
                    opacity={0.8}
                  />
                );
              })}
            </svg>
          )}

          {/* Database */}
          <div style={{ position: "relative" }}>
            {miniCard("DATABASE SONG", 300, 280)}
            {STARS.map((pt, i) => {
              if (frame < starPairs) return null;
              const pop = interpolate(frame - starPairs - i * 2, [0, 4, 8], [0.3, 1.2, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={`d${i}`}
                  style={{
                    position: "absolute",
                    left: 20 + pt.x * 0.42,
                    top: 16 + pt.y * 0.62,
                    width: 13,
                    height: 13,
                    marginLeft: -6.5,
                    marginTop: -6.5,
                    borderRadius: "50%",
                    backgroundColor: PAIRS.some(([, b]) => b === i) ? "#22D3EE" : "rgba(34,211,238,0.45)",
                    boxShadow: PAIRS.some(([, b]) => b === i) ? "0 0 12px rgba(34,211,238,0.9)" : "none",
                    transform: `scale(${pop})`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Hash chips */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 26 }}>
          {hashChips.map((chip, i) => {
            const chipIn = interpolate(frame - (hashTable + i * 6), [0, 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={chip}
                style={{
                  backgroundColor: i === 2 ? "rgba(16,185,129,0.18)" : "rgba(168,85,247,0.16)",
                  border: `2px solid ${i === 2 ? "rgba(16,185,129,0.65)" : "rgba(168,85,247,0.65)"}`,
                  color: i === 2 ? "#6EE7B7" : "#D8B4FE",
                  fontSize: 23,
                  fontWeight: 900,
                  padding: "12px 24px",
                  borderRadius: 16,
                  fontFamily: nemiTheme.typography.fontFamily.mono,
                  opacity: chipIn,
                  transform: `translateY(${(1 - chipIn) * 18}px)`,
                  whiteSpace: "nowrap",
                }}
              >
                {chip}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HISTOGRAM PANEL — Stage E (offset voting spike = THE payoff)
// ═══════════════════════════════════════════════════════════════
const HistogramPanel: React.FC<{
  frame: number;
  cutE: number;
  histBars: number;
  histSpike: number;
}> = ({ frame, cutE, histBars, histSpike }) => {
  const panelW = 900;
  const panelTop = 430;
  const BAR_COUNT = 16;
  const SPIKE_INDEX = 10;

  const panelIn = interpolate(frame - cutE, [0, 6], [0.85, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spikePop =
    frame >= histSpike
      ? interpolate(frame - histSpike, [0, 5, 9], [0.15, 1.12, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const rand = mulberry32(31);
  const barSeeds = Array.from({ length: BAR_COUNT }, () => ({
    base: 0.08 + rand() * 0.16,
    phase: rand() * Math.PI * 2,
  }));

  const labelIn =
    frame >= histSpike + 6
      ? interpolate(frame - (histSpike + 6), [0, 5], [0, 1], {
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
        width: panelW,
      }}
    >
      <div
        style={{
          backgroundColor: "#0F172A",
          borderRadius: 32,
          border: "3px solid #1E293B",
          boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
          padding: "40px 44px 34px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontSize: 21,
              fontWeight: 900,
              color: "#64748B",
              fontFamily: nemiTheme.typography.fontFamily.mono,
              letterSpacing: 1,
            }}
          >
            TIME-OFFSET VOTES
          </span>
          <span
            style={{
              fontSize: 21,
              fontWeight: 900,
              color: "#64748B",
              fontFamily: nemiTheme.typography.fontFamily.mono,
            }}
          >
            62 PAIRS CHECKED
          </span>
        </div>

        {/* Bars */}
        <div
          style={{
            height: 300,
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            borderBottom: "3px solid #1E293B",
            paddingBottom: 2,
          }}
        >
          {barSeeds.map((b, i) => {
            const isSpiked = i === SPIKE_INDEX && frame >= histSpike;
            let h: number;
            if (isSpiked) {
              h = 0.96 * spikePop;
            } else {
              const jitter = 0.5 + 0.5 * Math.sin(frame * 0.3 + b.phase);
              h = b.base * (0.6 + 0.4 * jitter) + (frame >= histBars ? 0.04 : 0);
            }
            const dim = frame >= histSpike && !isSpiked;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.min(h, 1) * 100}%`,
                  minHeight: 10,
                  borderRadius: "8px 8px 0 0",
                  backgroundColor: isSpiked
                    ? nemiTheme.colors.brandGreen
                    : dim
                      ? "rgba(100, 116, 139, 0.3)"
                      : "rgba(34, 211, 238, 0.55)",
                  boxShadow: isSpiked ? "0 0 44px rgba(16, 185, 129, 0.85)" : "none",
                }}
              />
            );
          })}
        </div>

        {/* Spike label */}
        {labelIn > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 330,
              left: `${((SPIKE_INDEX + 0.5) / BAR_COUNT) * 100}%`,
              transform: `translateX(-50%) scale(${labelIn})`,
              backgroundColor: nemiTheme.colors.brandGreen,
              color: "#fff",
              fontSize: 24,
              fontWeight: 900,
              padding: "14px 26px",
              borderRadius: 18,
              fontFamily: nemiTheme.typography.fontFamily.mono,
              boxShadow: "0 14px 40px rgba(16, 185, 129, 0.55)",
              whiteSpace: "nowrap",
            }}
          >
            OFFSET +42.0s — MATCH ✓
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
