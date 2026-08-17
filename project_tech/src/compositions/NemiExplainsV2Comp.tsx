import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NemiMascot, NemiPose } from "../components/NemiMascot";
import { NEMI_THEME } from "../constants/nemiTheme";

// ─────────────────────────────────────────────────────────────
// STORY (29s @ 30fps = 870 frames)
//
// ACT 1 — THE PROBLEM (0–7s)
//   0–2s:   Hook fades in. Objects start popping into heap.
//   2–5s:   Objects keep flooding. Counter climbs. Nemi goes from calm to shocked.
//   5–7s:   "So who cleans all this up?" — question hangs.
//
// ACT 2 — THE INVESTIGATION (7–18s)
//   7–8s:   "FIND THE SURVIVORS" — ROOT node appears.
//   8–13s:  Cyan connection lines trace from root → alive objects (one every 25f).
//   13–15s: All unreached objects now marked red. "DELETE THE REST".
//   15–18s: Garbage objects shrink to 0 and dissolve.
//
// ACT 3 — THE PAYOFF (18–27s)
//   18–22s: "PACK IT TIGHT" — alive objects spring into a compact row.
//   22–25s: "That's garbage collection." + satisfaction badge.
//   25–27s: "It runs behind every line of JS you write."
//
// LOOP (27–29s)
//   Ghost objects pop in. Hook text fades back. Visual restart.
// ─────────────────────────────────────────────────────────────

interface MemObj {
  id: number;
  label: string;
  alive: boolean;
  col: number;
  row: number;
  enterFrame: number;
}

const OBJECTS: MemObj[] = [
  { id: 1,  label: "app",       alive: true,  col: 0, row: 0, enterFrame: 6  },
  { id: 2,  label: "user",      alive: true,  col: 1, row: 0, enterFrame: 14 },
  { id: 3,  label: "cache",     alive: false, col: 2, row: 0, enterFrame: 22 },
  { id: 4,  label: "token",     alive: true,  col: 3, row: 0, enterFrame: 30 },
  { id: 5,  label: "tmp_buf",   alive: false, col: 0, row: 1, enterFrame: 38 },
  { id: 6,  label: "session",   alive: true,  col: 1, row: 1, enterFrame: 46 },
  { id: 7,  label: "old_ref",   alive: false, col: 2, row: 1, enterFrame: 54 },
  { id: 8,  label: "db_pool",   alive: true,  col: 3, row: 1, enterFrame: 62 },
  { id: 9,  label: "listener",  alive: false, col: 0, row: 2, enterFrame: 70 },
  { id: 10, label: "socket",    alive: true,  col: 1, row: 2, enterFrame: 80 },
  { id: 11, label: "leak",      alive: false, col: 2, row: 2, enterFrame: 90 },
  { id: 12, label: "dom_ref",   alive: false, col: 3, row: 2, enterFrame: 100 },
];

// Trace path: ROOT → app → user → token → session → db_pool → socket
const TRACE_PATH: number[] = [1, 2, 4, 6, 8, 10];
const ALIVE_OBJECTS = OBJECTS.filter((o) => o.alive);

// ─── DIAGRAM LAYOUT ───
const DIAGRAM = { top: 400, left: 45, right: 45, height: 880 };
const DIAGRAM_W = 1080 - DIAGRAM.left - DIAGRAM.right;
const DIAGRAM_CX = DIAGRAM_W / 2;

const CELL_W = 210;
const CELL_H = 175;
const GRID_TOP = 120;
const GRID_LEFT = (DIAGRAM_W - 3 * CELL_W) / 2;
const ROOT_POS = { cx: DIAGRAM_CX, cy: 58 };

function objCenter(col: number, row: number) {
  return { cx: GRID_LEFT + col * CELL_W, cy: GRID_TOP + row * CELL_H };
}

function compactCenter(idx: number, total: number) {
  const cw = 160;
  const tw = (total - 1) * cw;
  return { cx: DIAGRAM_CX - tw / 2 + idx * cw, cy: GRID_TOP + CELL_H };
}

// ─── BEAT TIMINGS ───
const B = {
  hookLine2: 25,
  questionIn: 150,      // 5s
  traceStart: 210,      // 7s
  traceDone: 385,       // ~12.8s (6 connections × 25f + buffer)
  sweepLabel: 390,      // ~13s
  sweepStart: 410,      // ~13.7s
  sweepDone: 510,       // ~17s
  compactStart: 530,    // ~17.7s
  compactDone: 650,     // ~21.7s
  payoffIn: 660,        // 22s
  closingIn: 750,       // 25s
  brandIn: 780,         // 26s
  loopStart: 830,       // ~27.7s
  end: 870,
};

// ─── SPEECH TEXT with frame ranges for fade ───
interface SpeechBeat {
  text: string;
  start: number;
  end: number;
}
const SPEECH_BEATS: SpeechBeat[] = [
  { text: "...that's a LOT of objects", start: 50, end: B.questionIn },
  { text: "follow the root...",         start: 230, end: 310 },
  { text: "yep. those can go.",         start: B.sweepLabel, end: B.sweepDone },
  { text: "clean. fast. done.",         start: B.payoffIn, end: B.brandIn },
];

// ═══════════════════════════════════════════════════════════
export const NemiExplainsV2Comp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Nemi pose ───
  const nemiPose: NemiPose =
    frame < 40 ? "thinking" :
    frame < B.questionIn ? "shocked" :
    frame < B.traceStart ? "puzzled" :
    frame < B.traceDone ? "thinking" :
    frame < B.sweepDone ? "aha" :
    "smug";

  // ─── Current speech beat ───
  const currentSpeech = SPEECH_BEATS.find((s) => frame >= s.start && frame < s.end);
  const speechOpacity = currentSpeech
    ? interpolate(frame, [currentSpeech.start, currentSpeech.start + 10], [0, 1], { extrapolateRight: "clamp" })
      * interpolate(frame, [currentSpeech.end - 10, currentSpeech.end], [1, 0], { extrapolateRight: "clamp" })
    : 0;

  // ─── Trace progress ───
  const traceCount = frame >= B.traceStart
    ? Math.min(
        TRACE_PATH.length,
        Math.floor(
          interpolate(frame, [B.traceStart, B.traceDone], [0, TRACE_PATH.length + 0.5], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        )
      )
    : 0;
  const reachedSet = new Set(TRACE_PATH.slice(0, traceCount));

  // ─── Compact (spring-based) ───
  const compactRaw = frame >= B.compactStart
    ? spring({ frame: frame - B.compactStart, fps, config: { damping: 16, stiffness: 100, mass: 1 } })
    : 0;

  // ─── Object counter ───
  const visibleCount = OBJECTS.filter((o) => frame >= o.enterFrame).length;

  // ─── Nemi entrance ───
  const nemiScale = spring({ frame, fps, config: { damping: 12, stiffness: 160, mass: 0.8 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NEMI_THEME.colors.bg.cream,
        overflow: "hidden",
        fontFamily: NEMI_THEME.typography.fontDisplay,
      }}
    >
      {/* BG dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(#D1D5DB 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          opacity: 0.45,
        }}
      />

      {/* ═══════════════════════════════════════════
          TOP ZONE — All text lives here
         ═══════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 75,
          left: 55,
          right: 55,
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Brand pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 18px",
            borderRadius: 9999,
            backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
            marginBottom: 18,
            opacity: 0.9,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 2,
              color: NEMI_THEME.colors.brand.yellow,
              fontFamily: NEMI_THEME.typography.fontHeading,
            }}
          >
            NEMI EXPLAINS
          </span>
        </div>

        {/* ── HOOK (0–5s) ── */}
        {frame < B.questionIn && (
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                margin: 0,
                fontSize: 54,
                fontWeight: 900,
                lineHeight: 1.12,
                color: NEMI_THEME.colors.text.headingDark,
                letterSpacing: -1.5,
                opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              Your code keeps
              <br />
              creating objects.
            </h1>
            {frame >= B.hookLine2 && (
              <h1
                style={{
                  margin: "10px 0 0 0",
                  fontSize: 54,
                  fontWeight: 900,
                  lineHeight: 1.12,
                  color: NEMI_THEME.colors.brand.coral,
                  letterSpacing: -1.5,
                  opacity: interpolate(frame, [B.hookLine2, B.hookLine2 + 12], [0, 1], { extrapolateRight: "clamp" }),
                }}
              >
                Who deletes them?
              </h1>
            )}
          </div>
        )}

        {/* ── QUESTION (5–7s) ── */}
        {frame >= B.questionIn && frame < B.traceStart && (
          <h2
            style={{
              margin: 0,
              fontSize: 48,
              fontWeight: 900,
              textAlign: "center",
              lineHeight: 1.2,
              color: NEMI_THEME.colors.text.headingDark,
              opacity: interpolate(frame, [B.questionIn, B.questionIn + 12], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            So who cleans
            <br />
            all this up?
          </h2>
        )}

        {/* ── FIND THE SURVIVORS (7–13s) ── */}
        {frame >= B.traceStart && frame < B.sweepLabel && (
          <h2
            style={{
              margin: 0,
              fontSize: 40,
              fontWeight: 900,
              textAlign: "center",
              letterSpacing: 4,
              color: NEMI_THEME.colors.brand.cyan,
              fontFamily: NEMI_THEME.typography.fontHeading,
              opacity: interpolate(frame, [B.traceStart, B.traceStart + 12], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            FIND THE SURVIVORS
          </h2>
        )}

        {/* ── DELETE THE REST (13–17.7s) ── */}
        {frame >= B.sweepLabel && frame < B.compactStart && (
          <h2
            style={{
              margin: 0,
              fontSize: 40,
              fontWeight: 900,
              textAlign: "center",
              letterSpacing: 4,
              color: NEMI_THEME.colors.brand.coral,
              fontFamily: NEMI_THEME.typography.fontHeading,
              opacity: interpolate(frame, [B.sweepLabel, B.sweepLabel + 12], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            DELETE THE REST
          </h2>
        )}

        {/* ── PACK IT TIGHT (17.7–22s) ── */}
        {frame >= B.compactStart && frame < B.payoffIn && (
          <h2
            style={{
              margin: 0,
              fontSize: 40,
              fontWeight: 900,
              textAlign: "center",
              letterSpacing: 4,
              color: NEMI_THEME.colors.brand.emerald,
              fontFamily: NEMI_THEME.typography.fontHeading,
              opacity: interpolate(frame, [B.compactStart, B.compactStart + 12], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            PACK IT TIGHT
          </h2>
        )}

        {/* ── PAYOFF (22–26s) ── */}
        {frame >= B.payoffIn && frame < B.brandIn && (
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                margin: 0,
                fontSize: 44,
                fontWeight: 900,
                color: NEMI_THEME.colors.text.headingDark,
                opacity: interpolate(frame, [B.payoffIn, B.payoffIn + 12], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              That's garbage collection.
            </h2>
            {frame >= B.closingIn && (
              <p
                style={{
                  margin: "14px 0 0 0",
                  fontSize: 24,
                  fontWeight: 600,
                  color: NEMI_THEME.colors.text.bodyMuted,
                  opacity: interpolate(frame, [B.closingIn, B.closingIn + 12], [0, 1], { extrapolateRight: "clamp" }),
                }}
              >
                It runs behind every line of
                <br />
                JavaScript you write.
              </p>
            )}
          </div>
        )}

        {/* ── BRAND / LOOP (26–29s) ── */}
        {frame >= B.brandIn && (
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color: NEMI_THEME.colors.text.headingDark,
                opacity: interpolate(frame, [B.brandIn, B.brandIn + 12], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              Follow{" "}
              <span style={{ color: NEMI_THEME.colors.brand.yellow, fontWeight: 900 }}>@nemi.explains</span>
            </p>
            {/* Loop text — hook re-emerges */}
            {frame >= B.loopStart && (
              <p
                style={{
                  margin: "16px 0 0 0",
                  fontSize: 22,
                  fontWeight: 700,
                  color: NEMI_THEME.colors.text.bodyMuted,
                  opacity: interpolate(frame, [B.loopStart, B.loopStart + 15], [0, 0.6], { extrapolateRight: "clamp" }),
                  fontStyle: "italic",
                }}
              >
                Your code keeps creating objects...
              </p>
            )}
          </div>
        )}

        {/* Object counter (Act 1 only) */}
        {frame >= 18 && frame < B.traceStart && (
          <div
            style={{
              marginTop: 14,
              padding: "7px 18px",
              borderRadius: 10,
              backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              opacity: interpolate(frame, [18, 30], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: NEMI_THEME.colors.brand.yellow,
                fontFamily: NEMI_THEME.typography.fontCode,
              }}
            >
              {visibleCount}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8" }}>
              objects in heap
            </span>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          CENTER — Charcoal Heap Diagram
         ═══════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: DIAGRAM.top,
          left: DIAGRAM.left,
          right: DIAGRAM.right,
          height: DIAGRAM.height,
          borderRadius: 26,
          backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
          border: `2px solid ${NEMI_THEME.colors.bg.borderCharcoal}`,
          boxShadow: "0 25px 55px -10px rgba(0,0,0,0.28)",
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        {/* Diagram label */}
        <div style={{ position: "absolute", top: 16, left: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: NEMI_THEME.colors.brand.yellow }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#52596B", letterSpacing: 1.5, fontFamily: NEMI_THEME.typography.fontHeading }}>
            HEAP
          </span>
        </div>

        {/* ROOT NODE */}
        {frame >= B.traceStart && (
          <div
            style={{
              position: "absolute",
              left: ROOT_POS.cx - 42,
              top: ROOT_POS.cy - 20,
              width: 84,
              height: 40,
              borderRadius: 10,
              backgroundColor: "rgba(6, 182, 212, 0.2)",
              border: `2px solid ${NEMI_THEME.colors.brand.cyan}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 22px rgba(6, 182, 212, 0.35)",
              opacity: interpolate(frame, [B.traceStart, B.traceStart + 10], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 900, color: NEMI_THEME.colors.brand.cyanGlow, fontFamily: NEMI_THEME.typography.fontCode }}>
              ROOT
            </span>
          </div>
        )}

        {/* CONNECTION LINES — animated trace */}
        {frame >= B.traceStart && (
          <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {TRACE_PATH.map((targetId, i) => {
              const connStart = B.traceStart + i * 25;
              if (frame < connStart) return null;

              const progress = interpolate(frame, [connStart, connStart + 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              let fromCx: number, fromCy: number;
              if (i === 0) {
                fromCx = ROOT_POS.cx;
                fromCy = ROOT_POS.cy + 20;
              } else {
                const prev = OBJECTS.find((o) => o.id === TRACE_PATH[i - 1])!;
                const pc = objCenter(prev.col, prev.row);
                fromCx = pc.cx;
                fromCy = pc.cy + 36;
              }

              const to = OBJECTS.find((o) => o.id === targetId)!;
              const tc = objCenter(to.col, to.row);
              const endX = fromCx + (tc.cx - fromCx) * progress;
              const endY = fromCy + (tc.cy - 36 - fromCy) * progress;

              return (
                <g key={i}>
                  <line
                    x1={fromCx} y1={fromCy}
                    x2={endX} y2={endY}
                    stroke={NEMI_THEME.colors.brand.cyanGlow}
                    strokeWidth={3}
                    strokeLinecap="round"
                    opacity={0.6}
                  />
                  {/* Traveling dot at the tip */}
                  {progress < 1 && (
                    <circle
                      cx={endX}
                      cy={endY}
                      r={5}
                      fill={NEMI_THEME.colors.brand.cyanGlow}
                      opacity={0.9}
                    >
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* MEMORY OBJECT CARDS */}
        {OBJECTS.map((obj) => {
          if (frame < obj.enterFrame) return null;

          const enterT = spring({
            frame: frame - obj.enterFrame,
            fps,
            config: NEMI_THEME.springs.pop,
          });

          const { cx, cy } = objCenter(obj.col, obj.row);
          const isGarbage = !obj.alive;
          const isReached = reachedSet.has(obj.id);
          const isTracing = frame >= B.traceStart;
          const isSweeping = frame >= B.sweepStart;

          // Garbage dissolve
          let garbageScale = 1;
          let garbageOpacity = 1;
          if (isGarbage && isSweeping) {
            garbageScale = interpolate(frame, [B.sweepStart, B.sweepDone], [1, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            garbageOpacity = interpolate(frame, [B.sweepStart, B.sweepDone - 20], [1, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
          }
          if (isGarbage && frame >= B.sweepDone) return null;

          // Compact — spring-based
          let finalCx = cx;
          let finalCy = cy;
          if (obj.alive && frame >= B.compactStart) {
            const aliveIdx = ALIVE_OBJECTS.indexOf(obj);
            const cp = compactCenter(aliveIdx, ALIVE_OBJECTS.length);
            finalCx = cx + (cp.cx - cx) * compactRaw;
            finalCy = cy + (cp.cy - cy) * compactRaw;
          }

          // Colors
          let border = "rgba(255, 255, 255, 0.1)";
          let bg = "rgba(255, 255, 255, 0.04)";
          let textCol = "#E2E8F0";
          let glow = "none";

          if (isTracing && isReached) {
            border = NEMI_THEME.colors.brand.emerald;
            bg = "rgba(16, 185, 129, 0.15)";
            textCol = NEMI_THEME.colors.brand.emeraldGlow;
            glow = "0 0 18px rgba(16, 185, 129, 0.3)";
          } else if (isTracing && isGarbage && frame >= B.traceDone) {
            border = NEMI_THEME.colors.brand.coral;
            bg = "rgba(244, 63, 94, 0.12)";
            textCol = NEMI_THEME.colors.brand.coralGlow;
            glow = "0 0 18px rgba(244, 63, 94, 0.25)";
          }

          const W = 140, H = 72;

          return (
            <div
              key={obj.id}
              style={{
                position: "absolute",
                left: finalCx - W / 2,
                top: finalCy - H / 2,
                width: W,
                height: H,
                borderRadius: 14,
                backgroundColor: bg,
                border: `2px solid ${border}`,
                boxShadow: glow,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                transform: `scale(${enterT * garbageScale})`,
                opacity: garbageOpacity,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 800, color: textCol, fontFamily: NEMI_THEME.typography.fontCode }}>
                {obj.label}
              </span>
              {isTracing && frame >= B.traceDone && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: obj.alive ? "#34D399" : "#FB7185",
                    letterSpacing: 0.8,
                    fontFamily: NEMI_THEME.typography.fontHeading,
                  }}
                >
                  {obj.alive ? "✓ ALIVE" : "✕ GONE"}
                </span>
              )}
            </div>
          );
        })}

        {/* LOOP: Ghost objects re-appearing at the end */}
        {frame >= B.loopStart && (
          <>
            {[
              { label: "new_req", col: 0, delay: 0 },
              { label: "promise", col: 1, delay: 8 },
              { label: "buffer",  col: 2, delay: 16 },
            ].map((g, i) => {
              const gf = frame - B.loopStart - g.delay;
              if (gf < 0) return null;
              const gs = spring({ frame: gf, fps, config: NEMI_THEME.springs.pop });
              const gc = objCenter(g.col, 0);
              return (
                <div
                  key={`g-${i}`}
                  style={{
                    position: "absolute",
                    left: gc.cx - 70,
                    top: gc.cy - 36,
                    width: 140,
                    height: 72,
                    borderRadius: 14,
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${gs})`,
                    opacity: 0.6,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#E2E8F0", fontFamily: NEMI_THEME.typography.fontCode }}>
                    {g.label}
                  </span>
                </div>
              );
            })}
          </>
        )}

        {/* RESULT BADGE */}
        {frame >= B.payoffIn && (
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              opacity: interpolate(frame, [B.payoffIn, B.payoffIn + 12], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div
              style={{
                padding: "10px 22px",
                borderRadius: 12,
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                border: `1px solid ${NEMI_THEME.colors.brand.emerald}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 900, color: NEMI_THEME.colors.brand.emeraldGlow, fontFamily: NEMI_THEME.typography.fontCode }}>
                6 kept
              </span>
              <span style={{ fontSize: 14, color: "#4B5563" }}>·</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: NEMI_THEME.colors.brand.coralGlow, fontFamily: NEMI_THEME.typography.fontCode }}>
                6 deleted
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          BOTTOM — Nemi + Speech
         ═══════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 55,
          left: 45,
          right: 45,
          zIndex: 30,
          display: "flex",
          alignItems: "flex-end",
          gap: 14,
        }}
      >
        <div style={{ transform: `scale(${nemiScale * 0.95})`, transformOrigin: "bottom left", flexShrink: 0 }}>
          <NemiMascot pose={nemiPose} scale={1.1} />
        </div>

        {/* Speech bubble with proper fade in/out per phrase */}
        {currentSpeech && speechOpacity > 0.01 && (
          <div
            style={{
              padding: "12px 20px",
              borderRadius: "18px 18px 18px 4px",
              backgroundColor: "#FFFFFF",
              border: `2px solid ${NEMI_THEME.colors.bg.borderMuted}`,
              boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
              maxWidth: 460,
              opacity: speechOpacity,
            }}
          >
            <span
              style={{
                fontSize: 21,
                fontWeight: 700,
                color: NEMI_THEME.colors.text.headingDark,
                lineHeight: 1.3,
                fontStyle: "italic",
              }}
            >
              {currentSpeech.text}
            </span>
          </div>
        )}
      </div>

      {/* ═══ AUDIO ═══ */}
      <Audio src={staticFile("bgm/Synthwave Goose - Blade Runner 2049.mp3")} volume={0.11} startFrom={30 * 30} />
      <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.4} />
      {/* Chime on sweep completion */}
      <Audio src={staticFile("sounds/correct_chime.wav")} volume={0.25} startFrom={0} playbackRate={1.2}
        // @ts-ignore
        style={{ position: "absolute" }}
      />
    </AbsoluteFill>
  );
};
