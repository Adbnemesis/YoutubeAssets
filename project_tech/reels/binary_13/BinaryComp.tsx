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

  // ─── Smooth Background Theme Interpolation ───
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
        {isDarkWorld && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
            <div
              style={{
                position: "absolute",
                top: 180,
                left: -150,
                width: 650,
                height: 650,
                borderRadius: "50%",
                background: frame < cutE
                  ? "radial-gradient(circle, rgba(6, 182, 212, 0.28) 0%, rgba(0,0,0,0) 70%)"
                  : "radial-gradient(circle, rgba(244, 63, 94, 0.28) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(90px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 720,
                right: -150,
                width: 650,
                height: 650,
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
        {/* PERSISTENT HEADER HUD (Appears frame 60+) */}
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
              {frame < cutB ? "THE 1-TO-100 GAME" : frame < cutD ? "STEP 1: ALWAYS PICK 50" : frame < cutE ? "STEP 2: 1-50 PURGED" : frame < cutF ? "STEP 3: CHECK 75" : "SCALE: 1 BILLION IN 30 OPS"}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* HEADLINE TITLE (Safe Zone: top: 165px) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
          <div
            style={{
              fontSize: 54,
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
                Target is 73: <span style={{ color: nemiTheme.colors.brandYellow }}>73 &gt; 50!</span>
              </>
            ) : frame < cutE ? (
              <>
                73 Is Higher! <span style={{ color: "#F43F5E" }}>1 to 50 Discarded!</span> 💥
              </>
            ) : frame < cutF ? (
              <>
                Check 75: <span style={{ color: nemiTheme.colors.brandCyan }}>73 &lt; 75 (Too High!)</span> 👈
              </>
            ) : frame < cutG ? (
              <>
                1 Billion Items: <span style={{ color: nemiTheme.colors.brandYellow }}>Solved in 30 Cuts!</span> 👑
              </>
            ) : (
              <>
                The Magic of <span style={{ color: nemiTheme.colors.brandCyan }}>Binary Search</span> ⚡
              </>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* MAIN VISUAL STAGES (Safe Zone: top: 310px, height: 600px) */}
        {/* ══════════════════════════════════════════════════════════ */}

        {/* STAGE 1: THE 1-100 CHALLENGE (0 to 87) */}
        {frame < cutB && (
          <Stage1GuessChallenge frame={frame} sevenSlamCue={sevenSlamCue} />
        )}

        {/* STAGE 2: ALWAYS PICK 50 (87 to 186) */}
        {frame >= cutB && frame < cutC && (
          <Stage2PickFifty frame={frame} linearCrossCue={linearCrossCue} midFiftyCue={midFiftyCue} />
        )}

        {/* STAGE 3: NEMI ASKS: WHAT IF SECRET IS 73? (186 to 251) */}
        {frame >= cutC && frame < cutD && (
          <Stage3Secret73 frame={frame} target73Cue={target73Cue} />
        )}

        {/* STAGE 4: 1 TO 50 DISCARDED IN 1 STEP (251 to 368) */}
        {frame >= cutD && frame < cutE && (
          <Stage4PurgeFifty frame={frame} higherVerdictCue={higherVerdictCue} purgeLeftCue={purgeLeftCue} />
        )}

        {/* STAGE 5: CHECK 75 & DISCARD 76-100 (368 to 484) */}
        {frame >= cutE && frame < cutF && (
          <Stage5Check75 frame={frame} mid75Cue={mid75Cue} purgeRightCue={purgeRightCue} />
        )}

        {/* STAGE 6: 1 BILLION SCALE IN 30 CUTS (484 to 605) */}
        {frame >= cutF && frame < cutG && (
          <Stage6BillionScale frame={frame} halfCascadeCue={halfCascadeCue} billionPayoffCue={billionPayoffCue} />
        )}

        {/* STAGE 7 & 8: NEMI SMUG & SUMMARY SCORECARD (605 to 742) */}
        {frame >= cutG && (
          <Stage7SummaryScorecard frame={frame} cutG={cutG} loopSeamCue={loopSeamCue} />
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
// 1. STAGE 1: GUESS CHALLENGE (1 TO 100)
// ═══════════════════════════════════════════════════════════════
const Stage1GuessChallenge: React.FC<{ frame: number; sevenSlamCue: number }> = ({ frame, sevenSlamCue }) => {
  const isSlammed = frame >= sevenSlamCue;
  const pulse = Math.sin(frame * 0.25);

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
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🎮</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A" }}>Game: Guess A Secret Number (1 to 100)</span>
        </div>
        <span style={{ backgroundColor: "#ECFEFF", color: "#0891B2", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SECRET = ??? 🔒
        </span>
      </div>

      {/* Visual Number Line */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <div style={{ width: "100%", height: 36, backgroundColor: "#F1F5F9", borderRadius: 18, border: "2px solid #CBD5E1", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, background: "linear-gradient(90deg, #06B6D4 0%, #3B82F6 50%, #A855F7 100%)", opacity: 0.25 }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 4, backgroundColor: "#06B6D4", boxShadow: "0 0 10px #06B6D4" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontFamily: nemiTheme.typography.fontFamily.mono, fontSize: 26, fontWeight: 900, color: "#0F172A" }}>
          <span>1</span>
          <span style={{ color: "#0891B2" }}>50 (MID)</span>
          <span>100</span>
        </div>
      </div>

      {/* Gold Slam Badge */}
      {isSlammed ? (
        <div
          style={{
            backgroundColor: "#ECFEFF",
            border: "3.5px solid #06B6D4",
            borderRadius: 24,
            padding: "18px 36px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 14px 40px rgba(6, 182, 212, 0.35)",
            transform: `scale(${1 + pulse * 0.03})`,
          }}
        >
          <span style={{ fontSize: 38 }}>⚡</span>
          <span style={{ fontSize: 30, fontWeight: 900, color: "#0E7490", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            SOLVED IN MAXIMUM 7 GUESSES!
          </span>
        </div>
      ) : (
        <div style={{ width: "100%", backgroundColor: "#F8FAFC", padding: "16px 24px", borderRadius: 18, border: "1.5px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#64748B", fontSize: 19, fontWeight: 700 }}>Guessing 1, 2, 3... takes up to:</span>
          <span style={{ color: "#EF4444", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>100 TRIES 🐌</span>
        </div>
      )}

      <div style={{ width: "100%", backgroundColor: "#F0FDFA", padding: "14px 24px", borderRadius: 18, border: "2px solid #06B6D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#0F172A", fontSize: 18, fontWeight: 700 }}>How do we guarantee finding it in 7 steps?</span>
        <span style={{ color: "#0891B2", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>CUT IN HALF ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. STAGE 2: ALWAYS PICK 50 (MIDPOINT)
// ═══════════════════════════════════════════════════════════════
const Stage2PickFifty: React.FC<{ frame: number; linearCrossCue: number; midFiftyCue: number }> = ({ frame, linearCrossCue, midFiftyCue }) => {
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
        padding: "30px 34px",
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
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Rule #1: Always Guess The Exact Middle</span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          GUESS #1: 50 ⚡
        </span>
      </div>

      {/* Number Line with Center Lock */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <div style={{ width: "100%", height: 48, backgroundColor: "#1E293B", borderRadius: 24, border: "2px solid #334155", position: "relative", overflow: "hidden" }}>
          {/* Active 50 Marker */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: 8,
              transform: "translateX(-50%)",
              backgroundColor: isMid ? "#10B981" : "#06B6D4",
              boxShadow: `0 0 25px ${isMid ? "#10B981" : "#06B6D4"}`,
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontFamily: nemiTheme.typography.fontFamily.mono, fontSize: 28, fontWeight: 900 }}>
          <span style={{ color: "#64748B" }}>1</span>
          <span style={{ color: isMid ? "#10B981" : "#06B6D4", transform: `scale(${1 + pulse * 0.08})` }}>
            ↓ 50 (MIDPOINT)
          </span>
          <span style={{ color: "#64748B" }}>100</span>
        </div>
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "16px 24px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>One question tests 50 numbers at once:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>50% ELIMINATED ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. STAGE 3: SECRET NUMBER IS 73
// ═══════════════════════════════════════════════════════════════
const Stage3Secret73: React.FC<{ frame: number; target73Cue: number }> = ({ frame, target73Cue }) => {
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
        padding: "30px 34px",
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
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Secret Target = 73</span>
        </div>
        <span style={{ backgroundColor: "rgba(255, 209, 102, 0.2)", color: "#FFD166", border: "1.5px solid #FFD166", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          TESTING: 73 &gt; 50?
        </span>
      </div>

      {/* Number Line with Target Beacon at 73% */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <div style={{ width: "100%", height: 48, backgroundColor: "#1E293B", borderRadius: 24, border: "2px solid #334155", position: "relative", overflow: "hidden" }}>
          {/* Mid at 50% */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 4, backgroundColor: "#06B6D4" }} />
          {/* Target at 73% */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "73%",
              width: 8,
              transform: "translateX(-50%)",
              backgroundColor: "#FFD166",
              boxShadow: "0 0 25px #FFD166",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontFamily: nemiTheme.typography.fontFamily.mono, fontSize: 26, fontWeight: 900 }}>
          <span style={{ color: "#64748B" }}>1</span>
          <span style={{ color: "#06B6D4" }}>50 (Guess)</span>
          <span style={{ color: "#FFD166", transform: `scale(${1 + pulse * 0.08})` }}>🎯 73 (Secret!)</span>
          <span style={{ color: "#64748B" }}>100</span>
        </div>
      </div>

      <div style={{ width: "100%", backgroundColor: "#1E293B", padding: "16px 24px", borderRadius: 18, border: "2px solid #FFD166", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>Is 73 higher than 50?</span>
        <span style={{ color: "#FFD166", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>YES! HIGHER 👉</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. STAGE 4: 1 TO 50 DISCARDED IN ONE STEP
// ═══════════════════════════════════════════════════════════════
const Stage4PurgeFifty: React.FC<{ frame: number; higherVerdictCue: number; purgeLeftCue: number }> = ({ frame, higherVerdictCue, purgeLeftCue }) => {
  const isPurged = frame >= purgeLeftCue;

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
        padding: "30px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>✂️</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>73 is Higher: Discard Numbers 1 to 50!</span>
        </div>
        <span style={{ backgroundColor: "rgba(244, 63, 94, 0.25)", color: "#F43F5E", border: "1.5px solid #F43F5E", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          -50 NUMBERS PURGED 💥
        </span>
      </div>

      {/* Slashed Left Half & Active Right Half */}
      <div style={{ display: "flex", gap: 20, width: "100%" }}>
        {/* Left Half (1-50): Slashed Out */}
        <div
          style={{
            flex: 1,
            height: 180,
            backgroundColor: "#4C0519",
            border: "2.5px dashed #F43F5E",
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: isPurged ? 0.4 : 1,
          }}
        >
          <span style={{ color: "#FDA4AF", fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>Range [1 .. 50]</span>
          <span style={{ color: "#F43F5E", fontSize: 44, fontWeight: 900, textDecoration: "line-through" }}>1 — 50</span>
          <span style={{ color: "#F43F5E", fontSize: 16, fontWeight: 900 }}>❌ PURGED FOREVER</span>
        </div>

        {/* Right Half (51-100): Kept Active */}
        <div
          style={{
            flex: 1,
            height: 180,
            backgroundColor: "#064E3B",
            border: "3.5px solid #10B981",
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 0 35px rgba(16, 185, 129, 0.35)",
          }}
        >
          <span style={{ color: "#A7F3D0", fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>New Search Range</span>
          <span style={{ color: "#10B981", fontSize: 44, fontWeight: 900 }}>51 — 100</span>
          <span style={{ color: "#FFD166", fontSize: 16, fontWeight: 900 }}>✓ TARGET 73 IS HERE!</span>
        </div>
      </div>

      <div style={{ width: "100%", backgroundColor: "#18060B", padding: "16px 24px", borderRadius: 18, border: "2px solid #F43F5E", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>In a single guess, half the universe disappeared:</span>
        <span style={{ color: "#F43F5E", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>50 NUMBERS ELIMINATED ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. STAGE 5: CHECK 75 & DISCARD 76 TO 100
// ═══════════════════════════════════════════════════════════════
const Stage5Check75: React.FC<{ frame: number; mid75Cue: number; purgeRightCue: number }> = ({ frame, mid75Cue, purgeRightCue }) => {
  const isPurged = frame >= purgeRightCue;

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
        padding: "30px 34px",
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
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Guess #2: Middle of 51 to 100 is 75!</span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          73 &lt; 75 (TOO HIGH!)
        </span>
      </div>

      {/* Active Range & Right Slashed */}
      <div style={{ display: "flex", gap: 20, width: "100%" }}>
        {/* Remaining Range (51-74): Target is here */}
        <div
          style={{
            flex: 1,
            height: 180,
            backgroundColor: "#064E3B",
            border: "3.5px solid #10B981",
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 0 35px rgba(16, 185, 129, 0.35)",
          }}
        >
          <span style={{ color: "#A7F3D0", fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>Remaining Search Range</span>
          <span style={{ color: "#10B981", fontSize: 44, fontWeight: 900 }}>51 — 74</span>
          <span style={{ color: "#FFD166", fontSize: 16, fontWeight: 900 }}>🎯 73 LOCKED IN 4 MORE CUTS!</span>
        </div>

        {/* Right Half (76-100): Slashed Out */}
        <div
          style={{
            flex: 1,
            height: 180,
            backgroundColor: "#4C0519",
            border: "2.5px dashed #F43F5E",
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: isPurged ? 0.4 : 1,
          }}
        >
          <span style={{ color: "#FDA4AF", fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>Range [76 .. 100]</span>
          <span style={{ color: "#F43F5E", fontSize: 44, fontWeight: 900, textDecoration: "line-through" }}>76 — 100</span>
          <span style={{ color: "#F43F5E", fontSize: 16, fontWeight: 900 }}>❌ 75% TOTAL ELIMINATED</span>
        </div>
      </div>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "16px 24px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 19, fontWeight: 700 }}>In just 2 questions, only 24 numbers remain:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>EXPONENTIAL SPEED ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 6. STAGE 6: 1 BILLION SCALE IN 30 CUTS
// ═══════════════════════════════════════════════════════════════
const Stage6BillionScale: React.FC<{ frame: number; halfCascadeCue: number; billionPayoffCue: number }> = ({ frame, halfCascadeCue, billionPayoffCue }) => {
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
        padding: "30px 34px",
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
          <span style={{ fontSize: 24, fontWeight: 900, color: "#FFD166" }}>Scaling to 1 Billion Items: 2³⁰ &gt; 10⁹</span>
        </div>
        <span style={{ backgroundColor: "rgba(255, 209, 102, 0.2)", color: "#FFD166", border: "1.5px solid #FFD166", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          STEP {Math.round(count)} / 30 ⚡
        </span>
      </div>

      {/* 30 Steps Progress Matrix */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 10, width: "100%" }}>
        {Array.from({ length: 30 }, (_, i) => {
          const isActive = i < count;
          const isFinal = i === 29 && isBillion;
          return (
            <div
              key={i}
              style={{
                height: 52,
                borderRadius: 10,
                backgroundColor: isFinal ? "#10B981" : isActive ? "#FFD166" : "#1E293B",
                border: isFinal ? "2px solid #A7F3D0" : isActive ? "1.5px solid #FDE047" : "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isActive ? "#0B1120" : "#64748B",
                fontWeight: 900,
                fontSize: 15,
                fontFamily: nemiTheme.typography.fontFamily.mono,
                boxShadow: isFinal ? "0 0 22px #10B981" : "none",
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* Result Box */}
      <div style={{ backgroundColor: "#022C22", padding: "18px 32px", borderRadius: 20, border: "2.5px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>1,000,000,000 Items:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 26, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isBillion ? "EXACTLY 30 QUESTIONS! ✓" : "Narrowing (1B → 1)..."}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 7. STAGE 7 & 8: SUMMARY SCORECARD & LOOP SEAM
// ═══════════════════════════════════════════════════════════════
const Stage7SummaryScorecard: React.FC<{ frame: number; cutG: number; loopSeamCue: number }> = ({ frame, cutG, loopSeamCue }) => {
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
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>💡</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            BINARY SEARCH SECRET
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.25)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          O(log N) TIME
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "24px", borderRadius: 22, border: "2.5px solid #F43F5E" }}>
          <div style={{ color: "#F43F5E", fontWeight: 900, fontSize: 26 }}>Linear Scan: O(N) 🐌</div>
          <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, marginTop: 10 }}>• 100 items = 100 tries</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• 1 Billion = 1B tries</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• Freezes the computer</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "24px", borderRadius: 22, border: "2.5px solid #10B981" }}>
          <div style={{ color: "#10B981", fontWeight: 900, fontSize: 26 }}>Binary Search: O(log N) ⚡</div>
          <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, marginTop: 10 }}>• 100 items = 7 tries</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• 1 Billion = 30 tries</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• Microsecond lookup</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#03070D", padding: "18px 24px", borderRadius: 20, border: "1.5px solid rgba(6, 182, 212, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>Ask better questions — halve the search space!</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>SOLVED 😎✓</span>
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
