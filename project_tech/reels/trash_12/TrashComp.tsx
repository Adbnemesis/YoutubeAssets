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
import cuesData from "../../src/data/trash_12_cues.json";

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

// Deterministic file positions for the bin burst
const rand = mulberry32(777);
const FILES = Array.from({ length: 9 }, (_, i) => ({
  angle: -90 + (i - 4) * 24 + rand() * 10,
  dist: 260 + rand() * 220,
  size: 52 + rand() * 30,
  delay: i * 2,
  rot: (i % 2 === 0 ? 1 : -1) * (20 + rand() * 25),
}));

// ═══════════════════════════════════════════════════════════════
// BIN BURST — FULL-BLEED Frame-0 money shot (also the loop seam).
// Lid flies off, files burst out but GHOST-REFORM back into the bin.
// ═══════════════════════════════════════════════════════════════
const BinBurstScene: React.FC<{
  frame: number;
  showTags: boolean;
  ghostProg: number; // 0..1 how fully files have reformed back
}> = ({ frame, showTags, ghostProg }) => {
  const cx = 540;
  const cy = 1050;

  return (
    <AbsoluteFill style={{ backgroundColor: nemiTheme.colors.canvasLight }}>
      {/* ambient glow */}
      <div style={{ position: "absolute", top: 900, left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,209,102,0.22) 0%, rgba(0,0,0,0) 70%)", filter: "blur(70px)" }} />

      {/* bursting files */}
      {FILES.map((f, i) => {
        const local = Math.max(0, frame - f.delay);
        // burst out fast, then ghost-reform back as ghostProg rises
        const outT = interpolate(local, [0, 14], [0, f.dist], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const backT = interpolate(ghostProg, [0, 1], [0, outT * 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const d = outT - backT;
        const rad = (f.angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * d;
        const y = cy + Math.sin(rad) * d - 60;
        const rot = interpolate(local, [0, 30], [0, f.rot], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={`file${i}`} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)`, fontSize: f.size, opacity: showTags ? 0.55 : 0.95, zIndex: 6 }}>
            📄
            {showTags && (
              <div style={{ position: "absolute", top: -26, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: 15, fontWeight: 900, color: "#F8FAFC", backgroundColor: nemiTheme.colors.brandCoral, padding: "2px 8px", borderRadius: 8, fontFamily: nemiTheme.typography.fontFamily.mono, opacity: interpolate(frame % 26, [0, 13, 26], [1, 0.45, 1]) }}>
                STILL HERE
              </div>
            )}
          </div>
        );
      })}

      {/* the bin */}
      <div style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%, -50%) scale(${interpolate(frame, [0, 6], [1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`, zIndex: 8 }}>
        <div style={{ fontSize: 300, lineHeight: 1, filter: "drop-shadow(0 30px 60px rgba(15,23,42,0.35))" }}>🗑️</div>
        {/* flying lid */}
        <div style={{ position: "absolute", top: -190, left: "50%", transform: `translateX(-50%) rotate(${interpolate(frame, [0, 24], [0, -28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}deg) translateY(${interpolate(frame, [0, 24], [0, -70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`, fontSize: 110, opacity: interpolate(frame, [0, 24], [1, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          🛸
        </div>
      </div>
    </AbsoluteFill>
  );
};// ═══════════════════════════════════════════════════════════════
// X-RAY SCENE — the 2.5s pattern interrupt: light→dark world flip,
// bin becomes translucent, files visible inside with red tags
// ═══════════════════════════════════════════════════════════════
const XrayScene: React.FC<{ frame: number }> = ({ frame }) => {
  const rand2 = mulberry32(424);
  const inside = Array.from({ length: 7 }, () => ({
    x: 380 + rand2() * 320,
    y: 980 + rand2() * 260,
    size: 44 + rand2() * 20,
    phase: rand2() * Math.PI * 2,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: nemiTheme.colors.canvasDark }}>
      <div style={{ position: "absolute", left: 540, top: 1080, transform: "translate(-50%, -50%)", fontSize: 340, lineHeight: 1, opacity: 0.28, filter: "drop-shadow(0 0 60px rgba(6,182,212,0.5))" }}>
        🗑️
      </div>
      {inside.map((f, i) => (
        <div key={`in${i}`} style={{ position: "absolute", left: f.x, top: f.y + Math.sin(frame * 0.08 + f.phase) * 8, fontSize: f.size, filter: "drop-shadow(0 0 18px rgba(255,209,102,0.7))", zIndex: 5 }}>
          📄
          <div style={{ position: "absolute", top: -24, left: "50%", transform: `translateX(-50%) scale(${interpolate(frame % 30, [0, 15, 30], [1, 1.12, 1])})`, whiteSpace: "nowrap", fontSize: 14, fontWeight: 900, color: "#F8FAFC", backgroundColor: nemiTheme.colors.brandCoral, padding: "2px 8px", borderRadius: 8, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            STILL HERE
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", top: 700, width: "100%", textAlign: "center", zIndex: 6 }}>
        <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: 3, color: nemiTheme.colors.brandCyan, fontFamily: nemiTheme.typography.fontFamily.mono, textShadow: "0 0 30px rgba(6,182,212,0.8)" }}>
          ⚡ TRASH — X-RAY VIEW
        </span>
      </div>
    </AbsoluteFill>
  );
};// ═══════════════════════════════════════════════════════════════
// HEX WORLD — deep disk view: hex rows, free-space marker,
// scan sweep line, byte zoom, erase beam at payoff
// ═══════════════════════════════════════════════════════════════
const HEX_ROWS = Array.from({ length: 16 }, (_, r) => {
  const randH = mulberry32(1000 + r);
  return Array.from({ length: 10 }, (_, c) => ({
    v: Math.floor(randH() * 255).toString(16).toUpperCase().padStart(2, "0"),
    dead: randH() < 0.45,
  }));
});

const HexWorld: React.FC<{
  frame: number;
  showMarker: boolean;
  showSweep: boolean;
  zoomByte: boolean;
  wipeProg: number;
}> = ({ frame, showMarker, showSweep, zoomByte, wipeProg }) => {
  const sweepX = interpolate((frame % 90) / 90, [0, 1], [-40, 1120]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#04070D" }}>
      {HEX_ROWS.map((row, r) => (
        <div key={`r${r}`} style={{ position: "absolute", top: 420 + r * 62, left: 70, display: "flex", gap: 26 }}>
          {row.map((cell, c) => {
            const wiped = wipeProg > (r * 10 + c) / 160;
            const isZoom = zoomByte && r === 7 && c === 4;
            return (
              <span
                key={`${r}-${c}`}
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                  fontFamily: nemiTheme.typography.fontFamily.mono,
                  color: wiped ? "rgba(16,185,129,0.25)" : cell.dead ? nemiTheme.colors.brandCoral : "#334155",
                  textShadow: wiped || !cell.dead ? "none" : "0 0 14px rgba(244,63,94,0.55)",
                  transform: isZoom ? "scale(2.1)" : "scale(1)",
                  zIndex: isZoom ? 6 : 1,
                }}
              >
                {wiped ? "00" : cell.v}
              </span>
            );
          })}
        </div>
      ))}

      {showMarker && (
        <div style={{ position: "absolute", top: 800, right: 80, zIndex: 5, padding: "10px 22px", borderRadius: 16, border: `3px solid ${nemiTheme.colors.brandYellow}`, backgroundColor: "rgba(255,209,102,0.12)", transform: `rotate(3deg) scale(${interpolate(frame % 36, [0, 18, 36], [1, 1.08, 1])})` }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: nemiTheme.colors.brandYellow, fontFamily: nemiTheme.typography.fontFamily.mono }}>MARKED: FREE SPACE</span>
        </div>
      )}

      {showSweep && (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: sweepX, width: 6, background: "linear-gradient(to bottom, transparent, #06B6D4, transparent)", boxShadow: "0 0 40px rgba(6,182,212,0.9)", zIndex: 5 }} />
      )}

      {wipeProg > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, height: 140 * wipeProg, top: 1480 - 140 * wipeProg, background: "linear-gradient(to bottom, rgba(16,185,129,0), rgba(16,185,129,0.85))", filter: "blur(2px)", zIndex: 7 }} />
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// REWARD FLOOD — payoff overlay
// ═══════════════════════════════════════════════════════════════
const RewardFlood: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  if (frame < startFrame) return null;
  const d = frame - startFrame;
  const opacity = interpolate(d, [0, 6, 40], [0, 0.92, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampIn = interpolate(d, [2, 6, 10], [2.2, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 70 }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(16,185,129,0.95) 0%, rgba(16,185,129,0.35) 45%, rgba(7,11,18,0.1) 80%)", opacity }} />
      <div style={{ position: "absolute", top: "44%", left: "50%", transform: `translate(-50%, -50%) rotate(-6deg) scale(${stampIn})`, textAlign: "center" }}>
        <div style={{ fontSize: 110, fontWeight: 900, color: "#F8FAFC", letterSpacing: 4, textShadow: "0 0 60px rgba(16,185,129,1)", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          INVISIBLE ✓
        </div>
      </div>
    </AbsoluteFill>
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
          border: "2px solid rgba(255, 209, 102, 0.55)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(255, 209, 102, 0.25)",
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
export const TrashComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 600;

  const evAss = getEvent("nc02_twist");
  const evGuess = getEvent("nc03_nemi_guess");
  const evRev = getEvent("nc04_secret");
  const evMech = getEvent("nc05_mechanism");
  const evPay = getEvent("nc06_payoff");
  const evNemiPay = getEvent("nc07_nemi_payoff");

  const tapHit = getCue("tr01_hook", "tap_hit");
  const binBurst = getCue("tr01_hook", "bin_burst");
  const ghostReform = getCue("nc02_twist", "ghost_reform");
  const stillTags = getCue("nc02_twist", "still_tags");
  const buzzerShock = getCue("nc03_nemi_guess", "nemi_shock");
  const hexDive = getCue("nc04_secret", "hex_dive");
  const freeMarker = getCue("nc04_secret", "free_marker");
  const scanSweep = getCue("nc05_mechanism", "scan_sweep");
  const byteZoom = getCue("nc05_mechanism", "byte_zoom");
  const wipeInvisible = getCue("nc06_payoff", "wipe_invisible");
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

  // ghost files reform during the twist beat → fully reformed by hex dive
  const ghostProg = interpolate(frame, [ghostReform, Math.max(ghostReform + 2, hexDive)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // erase progress at payoff
  const wipeProg = interpolate(frame, [wipeInvisible, wipeInvisible + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
    punch(binBurst, 0.06) +
    punch(ghostReform, 0.055) +
    punch(hexDive, 0.05) +
    punch(byteZoom) +
    punch(wipeInvisible, 0.06) +
    punch(smugStamp) +
    cutSettle(cutB) + cutSettle(cutD) + cutSettle(cutE) + cutSettle(cutF);
  const cameraScale = 1 + punchTotal + interpolate(frame, [0, totalFrames], [0, 0.02], { extrapolateRight: "clamp" });

  let nemiPose: NemiPose = "shocked";
  let nemiSpeech: string | null = null;
  if (frame < cutB) nemiPose = "shocked";
  else if (frame < evGuess.start_frame) nemiPose = "thinking";
  else if (frame < cutD) { nemiPose = "puzzled"; nemiSpeech = "Wait... then where did my files go?!"; }
  else if (frame < cutE) nemiPose = "explaining";
  else if (frame < cutF) nemiPose = "aha";
  else if (frame < evNemiPay.end_frame + 4) { nemiPose = "smug"; nemiSpeech = "So my trash bin was always a lie? 🤨"; }
  else nemiPose = "smug";

  return (
    <AbsoluteFill style={{ backgroundColor: nemiTheme.colors.canvasLight, overflow: "hidden", fontFamily: nemiTheme.typography.fontFamily.sans }}>
      <Audio src={staticFile("reels/trash_12/trash_master_audio.mp3")} volume={0.9} />

      {/* SFX LAYER — SFX-ONLY SOUND DESIGN (no BGM bed by design, Ep.12 experiment) */}
      <Sequence from={0} durationInFrames={30}><Audio src={staticFile("reels/trash_12/sfx/pop.mp3")} volume={0.72} /></Sequence>
      <Sequence from={Math.max(0, tapHit)} durationInFrames={14}><Audio src={staticFile("reels/trash_12/sfx/click.mp3")} volume={0.66} /></Sequence>
      <Sequence from={Math.max(0, binBurst)} durationInFrames={35}><Audio src={staticFile("reels/trash_12/sfx/whoosh.mp3")} volume={0.7} /></Sequence>
      <Sequence from={Math.max(0, ghostReform)} durationInFrames={45}><Audio src={staticFile("reels/trash_12/sfx/riser.mp3")} volume={0.7} /></Sequence>
      <Sequence from={stillTags} durationInFrames={18}><Audio src={staticFile("reels/trash_12/sfx/error.mp3")} volume={0.62} /></Sequence>
      <Sequence from={buzzerShock} durationInFrames={30}><Audio src={staticFile("reels/trash_12/sfx/notification.mp3")} volume={0.66} /></Sequence>
      <Sequence from={Math.max(0, cutD - 1)} durationInFrames={35}><Audio src={staticFile("reels/trash_12/sfx/whoosh.mp3")} volume={0.7} /></Sequence>
      <Sequence from={hexDive} durationInFrames={22}><Audio src={staticFile("reels/trash_12/sfx/ping.mp3")} volume={0.66} /></Sequence>
      <Sequence from={freeMarker} durationInFrames={16}><Audio src={staticFile("reels/trash_12/sfx/pop.mp3")} volume={0.63} /></Sequence>
      <Sequence from={scanSweep} durationInFrames={45}><Audio src={staticFile("reels/trash_12/sfx/riser.mp3")} volume={0.66} /></Sequence>
      <Sequence from={byteZoom} durationInFrames={16}><Audio src={staticFile("reels/trash_12/sfx/click.mp3")} volume={0.63} /></Sequence>
      <Sequence from={Math.max(0, cutE - 1)} durationInFrames={35}><Audio src={staticFile("reels/trash_12/sfx/whoosh.mp3")} volume={0.7} /></Sequence>
      <Sequence from={wipeInvisible} durationInFrames={45}><Audio src={staticFile("reels/trash_12/sfx/chime.mp3")} volume={0.7} /></Sequence>
      <Sequence from={Math.max(0, cutF - 1)} durationInFrames={35}><Audio src={staticFile("reels/trash_12/sfx/whoosh.mp3")} volume={0.7} /></Sequence>
      <Sequence from={smugStamp} durationInFrames={30}><Audio src={staticFile("reels/trash_12/sfx/notification.mp3")} volume={0.66} /></Sequence>
      <Sequence from={loopFight} durationInFrames={30}><Audio src={staticFile("reels/trash_12/sfx/ping.mp3")} volume={0.7} /></Sequence>{/* CAMERA WRAPPER */}
      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        {/* TOP HUD — only after the hook (Visual Hook System v3: no chrome at open) */}
        {frame >= 60 && (
          <div style={{ position: "absolute", top: 85, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 50, opacity: interpolate(frame, [60, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: wipeProg > 0.9 ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCoral, boxShadow: `0 0 24px ${wipeProg > 0.9 ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCoral}`, transform: `scale(${interpolate(frame % 20, [0, 10, 20], [1, 1.25, 1])})` }} />
              <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase", color: inStageDE || inStageF ? "#FFD166" : "#D97706" }}>Ep.12 · File Deletion</span>
            </div>
            <div style={{ backgroundColor: inStageDE || inStageF ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.96)", padding: "12px 24px", borderRadius: 24, border: `2px solid ${inStageDE || inStageF ? nemiTheme.colors.borderDark : nemiTheme.colors.borderLight}`, fontSize: 20, fontWeight: 900, color: wipeProg > 0.9 ? nemiTheme.colors.brandGreen : "#D97706", fontFamily: nemiTheme.typography.fontFamily.mono, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>
              {wipeProg > 0.9 ? "INVISIBLE ✓" : `FILES: 128 → 128`}
            </div>
          </div>
        )}

        {/* STAGE A — FULL-BLEED FRAME-0 MONEY SHOT */}
        {inStageA && (
          <>
            <BinBurstScene frame={frame} showTags={false} ghostProg={interpolate(frame, [binBurst, Math.max(binBurst + 2, cutB)], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            {/* TEXT SLAM — lands by frame 8, muted-legible */}
            <AbsoluteFill style={{ zIndex: 90, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: 320, left: 40, right: 40, textAlign: "center" }}>
                <div
                  style={{
                    fontSize: frame >= ghostReform - 6 ? 96 : 92,
                    fontWeight: 900,
                    letterSpacing: -2,
                    lineHeight: 1.08,
                    color: nemiTheme.colors.textLight,
                    WebkitTextStrokeWidth: 2,
                    WebkitTextStrokeColor: "#FAF8F5",
                    transform: `scale(${interpolate(frame, [0, 8], [1.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                  }}
                >
                  YOU JUST EMPTIED
                </div>
                <div
                  style={{
                    fontSize: 104,
                    fontWeight: 900,
                    letterSpacing: -2,
                    lineHeight: 1.08,
                    marginTop: 8,
                    opacity: interpolate(frame, [10, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    transform: `scale(${interpolate(frame, [10, 16], [1.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                  }}
                >
                  YOUR <span style={{ color: nemiTheme.colors.brandCoral }}>TRASH.</span>
                </div>
              </div>
            </AbsoluteFill>
          </>
        )}

        {/* STAGE B — THE TWIST: X-ray world flip (⚡ pattern interrupt) */}
        {inStageB && (
          <>
            <XrayScene frame={frame - cutB + 20} />
            <AbsoluteFill style={{ zIndex: 90, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
                <div style={{ fontSize: 92, fontWeight: 900, letterSpacing: -2, lineHeight: 1.08, color: nemiTheme.colors.textDark, textShadow: "0 6px 30px rgba(0,0,0,0.85)", transform: `scale(${interpolate(frame - cutB, [0, 8], [1.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
                  NOTHING GOT <span style={{ color: nemiTheme.colors.brandCoral }}>DELETED.</span>
                </div>
              </div>
            </AbsoluteFill>
          </>
        )}{/* STAGE D/E — HEX WORLD: secret → mechanism → payoff */}
        {inStageDE && (
          <>
            <HexWorld
              frame={frame - cutD}
              showMarker={frame >= freeMarker}
              showSweep={frame >= scanSweep}
              zoomByte={frame >= byteZoom && frame < wipeInvisible}
              wipeProg={wipeProg}
            />
            <AbsoluteFill style={{ zIndex: 90, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: 240, left: 50, right: 50, textAlign: "center" }}>
                <div style={{ fontSize: frame >= wipeInvisible ? 88 : 76, fontWeight: 900, letterSpacing: -2, lineHeight: 1.1, color: nemiTheme.colors.textDark, textShadow: "0 6px 30px rgba(0,0,0,0.9)", transform: `scale(${interpolate(frame - cutD, [0, 8], [1.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
                  {frame >= wipeInvisible ? (
                    <>SO "DELETE" MEANS<br /><span style={{ color: nemiTheme.colors.brandGreen }}>INVISIBLE.</span></>
                  ) : (
                    <>STILL ON YOUR <span style={{ color: nemiTheme.colors.brandCyan }}>DISK.</span></>
                  )}
                </div>
              </div>
            </AbsoluteFill>
          </>
        )}

        {/* STAGE F — NEMI STAMP + LOOP SEAM back to bin */}
        {inStageF && (
          <>
            <BinBurstScene frame={frame - cutF} showTags={false} ghostProg={interpolate(frame - cutF, [0, loopFight - cutF], [0.2, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <AbsoluteFill style={{ zIndex: 90, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: 300, left: 40, right: 40, textAlign: "center" }}>
                <div style={{ fontSize: 84, fontWeight: 900, letterSpacing: -2, lineHeight: 1.08, color: nemiTheme.colors.textLight, WebkitTextStrokeWidth: 2, WebkitTextStrokeColor: "#FAF8F5", transform: `scale(${interpolate(frame - cutF, [0, 8], [1.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
                  THE FILES <span style={{ color: frame >= loopFight ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandCoral }}>DON'T CARE.</span>
                </div>
              </div>
            </AbsoluteFill>
            {/* recap chips */}
            <div style={{ position: "absolute", top: 1560, left: 70, right: 70, display: "flex", justifyContent: "center", gap: 14, zIndex: 55 }}>
              {["DELETE = HIDE", "BYTES SURVIVE", "OVERWRITE = GONE"].map((chip, i) => {
                const cIn = interpolate(frame - (cutF + 8 + i * 6), [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={chip} style={{ backgroundColor: i === 2 ? nemiTheme.colors.brandGreen : nemiTheme.colors.cardDark, color: "#F8FAFC", fontSize: 19, fontWeight: 900, letterSpacing: 0.5, padding: "12px 18px", borderRadius: 18, opacity: cIn, transform: `scale(${0.7 + cIn * 0.3})`, boxShadow: "0 10px 26px rgba(0,0,0,0.25)", fontFamily: nemiTheme.typography.fontFamily.mono, whiteSpace: "nowrap" }}>
                    {chip}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* REWARD FLOOD */}
        <RewardFlood frame={frame} startFrame={wipeInvisible} />

        {/* KARAOKE CAPTIONS */}
        {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} />}

        {/* MASCOT DOCK */}
        <div style={{ position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 75 }}>
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
        <div style={{ position: "absolute", bottom: 40, right: 40, zIndex: 90, fontSize: 22, fontWeight: 900, color: inStageDE || inStageF ? "rgba(248,250,252,0.55)" : "rgba(15,23,42,0.45)", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          @nemi.explains
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};