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
import timingData from "../data/nemi_v3_cues.json";

// ─────────────────────────────────────────────────────────────
// NEMI EXPLAINS V3 — STORY-DRIVEN HIGH-RETENTION COMPOSITION
// Synchronized with studio neural narration + Blade Runner 2049 BGM
// ─────────────────────────────────────────────────────────────

interface MemObj {
  id: number;
  label: string;
  alive: boolean;
  col: number; // 0..3
  row: number; // 0..2
  enterFrame: number;
  isSurprise?: boolean; // The object that initially looks dead but is saved!
}

const OBJECTS: MemObj[] = [
  { id: 1,  label: "app",           alive: true,  col: 0, row: 0, enterFrame: 4   },
  { id: 2,  label: "user",          alive: true,  col: 1, row: 0, enterFrame: 12  },
  { id: 3,  label: "orphan_cache",  alive: false, col: 2, row: 0, enterFrame: 20  },
  { id: 4,  label: "jwt_token",     alive: true,  col: 3, row: 0, enterFrame: 28  },
  { id: 5,  label: "tmp_buffer",    alive: false, col: 0, row: 1, enterFrame: 36  },
  { id: 6,  label: "db_client",     alive: true,  col: 1, row: 1, enterFrame: 44  },
  { id: 7,  label: "leaked_event",  alive: false, col: 2, row: 1, enterFrame: 52  },
  { id: 8,  label: "socket",        alive: true,  col: 3, row: 1, enterFrame: 60  },
  { id: 9,  label: "dead_listener", alive: false, col: 0, row: 2, enterFrame: 68  },
  { id: 10, label: "session_cache", alive: true,  col: 1, row: 2, enterFrame: 76  },
  { id: 11, label: "dom_orphan",    alive: false, col: 2, row: 2, enterFrame: 84  },
  { id: 12, label: "hidden_ref",    alive: true,  col: 3, row: 2, enterFrame: 92, isSurprise: true },
];

// Tracing connections
// Normal trace path
const TRACE_CONNECTIONS = [
  { fromId: 0, toId: 1, startFrame: 370 }, // ROOT -> app
  { fromId: 1, toId: 2, startFrame: 400 }, // app -> user
  { fromId: 1, toId: 6, startFrame: 425 }, // app -> db_client
  { fromId: 2, toId: 4, startFrame: 450 }, // user -> jwt_token
  { fromId: 6, toId: 8, startFrame: 475 }, // db_client -> socket
  { fromId: 6, toId: 10, startFrame: 500 }, // db_client -> session_cache
];

// The Surprise Connection (Act 5: from user -> hidden_ref!)
const SURPRISE_CONNECTION = { fromId: 2, toId: 12, startFrame: 565 };

const ALIVE_OBJECTS = OBJECTS.filter((o) => o.alive);

// ─── DIAGRAM LAYOUT ───
const DIAGRAM = { top: 380, left: 45, right: 45, height: 880 };
const DIAGRAM_W = 1080 - DIAGRAM.left - DIAGRAM.right;
const DIAGRAM_CX = DIAGRAM_W / 2;

const CELL_W = 215;
const CELL_H = 175;
const GRID_TOP = 120;
const GRID_LEFT = (DIAGRAM_W - 3 * CELL_W) / 2;
const ROOT_POS = { cx: DIAGRAM_CX, cy: 58 };

function objCenter(col: number, row: number) {
  return { cx: GRID_LEFT + col * CELL_W, cy: GRID_TOP + row * CELL_H };
}

function compactCenter(idx: number, total: number) {
  const cw = 155;
  const tw = (total - 1) * cw;
  return { cx: DIAGRAM_CX - tw / 2 + idx * cw, cy: GRID_TOP + CELL_H };
}

export const NemiExplainsV3Comp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Timings derived from JSON cue points ───
  // Act 1 (0..143): The Mess
  // Act 2 (143..279): The Question
  // Act 3 (279..366): Viewer Prediction
  // Act 4 (366..550): The Investigation
  // Act 5 (550..617): The Surprise ("Not so fast")
  // Act 6 (617..696): Delete the Garbage
  // Act 7 (696..785): Compaction
  // Act 8 (785..1006): Payoff & Outro

  // ─── Nemi Dynamic Pose ───
  let nemiPose: NemiPose = "thinking";
  if (frame < 50) nemiPose = "thinking";
  else if (frame < 143) nemiPose = "shocked";
  else if (frame < 279) nemiPose = "puzzled";
  else if (frame < 366) nemiPose = "thinking";
  else if (frame < 550) nemiPose = "thinking";
  else if (frame < 575) nemiPose = "puzzled"; // looking at isolated object
  else if (frame < 617) nemiPose = "aha"; // surprise!
  else if (frame < 696) nemiPose = "aha"; // watching garbage purge
  else nemiPose = "smug"; // proud & satisfied!

  // ─── Nemi Dialogue Beats ───
  let nemiSpeech = "";
  if (frame >= 40 && frame < 140) nemiSpeech = "...that's a lot of objects";
  else if (frame >= 150 && frame < 270) nemiSpeech = "who gets deleted?";
  else if (frame >= 540 && frame < 575) nemiSpeech = "that one's dead!";
  else if (frame >= 575 && frame < 615) nemiSpeech = "Wait! It's connected!";
  else if (frame >= 625 && frame < 685) nemiSpeech = "bye! 👋";
  else if (frame >= 800 && frame < 940) nemiSpeech = "Much better. 😎";

  // Speech bubble opacity fade
  const speechOpacity = nemiSpeech
    ? interpolate(frame % 100, [0, 8], [0, 1], { extrapolateRight: "clamp" })
    : 0;

  // ─── Minimal Bold Top Header Text ───
  let topHeader = "ALLOCATING HEAP...";
  let headerColor = NEMI_THEME.colors.text.headingDark;

  if (frame < 143) {
    topHeader = "YOUR PROGRAM CREATES OBJECTS";
    headerColor = NEMI_THEME.colors.text.headingDark;
  } else if (frame < 279) {
    topHeader = "SO WHO CLEANS THIS MESS?";
    headerColor = NEMI_THEME.colors.brand.coral;
  } else if (frame < 366) {
    topHeader = "WHICH ONES SURVIVE?";
    headerColor = NEMI_THEME.colors.brand.yellow;
  } else if (frame < 550) {
    topHeader = "V8 TRACES FROM ROOTS";
    headerColor = NEMI_THEME.colors.brand.cyan;
  } else if (frame < 617) {
    topHeader = "HIDDEN CONNECTION FOUND!";
    headerColor = NEMI_THEME.colors.brand.emerald;
  } else if (frame < 696) {
    topHeader = "PURGING UNREACHABLE GARBAGE";
    headerColor = NEMI_THEME.colors.brand.coral;
  } else if (frame < 785) {
    topHeader = "PACKING CONTIGUOUS RAM";
    headerColor = NEMI_THEME.colors.brand.emerald;
  } else {
    topHeader = "GARBAGE COLLECTION DONE";
    headerColor = NEMI_THEME.colors.brand.yellow;
  }

  // ─── Reached Objects Set ───
  const reachedSet = new Set<number>();
  if (frame >= 380) reachedSet.add(1); // app
  if (frame >= 410) reachedSet.add(2); // user
  if (frame >= 435) reachedSet.add(6); // db_client
  if (frame >= 460) reachedSet.add(4); // jwt_token
  if (frame >= 485) reachedSet.add(8); // socket
  if (frame >= 510) reachedSet.add(10); // session_cache
  if (frame >= 580) reachedSet.add(12); // hidden_ref (The Surprise!)

  // ─── Compact Spring Animation ───
  const compactSpring = frame >= 696
    ? spring({ frame: frame - 696, fps, config: { damping: 14, stiffness: 120, mass: 0.9 } })
    : 0;

  // ─── Nemi Entrance Spring ───
  const nemiScale = spring({ frame, fps, config: { damping: 12, stiffness: 160, mass: 0.8 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NEMI_THEME.colors.bg.cream,
        overflow: "hidden",
        fontFamily: NEMI_THEME.typography.fontDisplay,
      }}
    >
      {/* ═══ BACKGROUND: Clean Editorial Dot Grid ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(#D1D5DB 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          opacity: 0.45,
        }}
      />

      {/* ══════════════════════════════════════════════════════
          TOP ZONE — Minimal Anchor Text (Voice Explains, Text Anchors)
         ══════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 50,
          right: 50,
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Brand Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 18px",
            borderRadius: 9999,
            backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
            marginBottom: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: 2,
              color: NEMI_THEME.colors.brand.yellow,
              fontFamily: NEMI_THEME.typography.fontHeading,
            }}
          >
            ⚡ NEMI EXPLAINS
          </span>
        </div>

        {/* Dynamic Story Header */}
        <h1
          style={{
            margin: 0,
            fontSize: 46,
            fontWeight: 900,
            lineHeight: 1.15,
            textAlign: "center",
            color: headerColor,
            letterSpacing: -1,
          }}
        >
          {topHeader}
        </h1>

        {/* Prediction Countdown Indicator in Act 3 */}
        {frame >= 279 && frame < 366 && (
          <div
            style={{
              marginTop: 12,
              padding: "6px 20px",
              borderRadius: 12,
              backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
              border: "1px solid #FBBF24",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 16, color: "#FFD166" }}>⏱</span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#F8FAFC",
                fontFamily: NEMI_THEME.typography.fontHeading,
              }}
            >
              PREDICT BEFORE SCAN
            </span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          CENTER STAGE — Dark Charcoal Memory Heap Box
         ══════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: DIAGRAM.top,
          left: DIAGRAM.left,
          right: DIAGRAM.right,
          height: DIAGRAM.height,
          borderRadius: 28,
          backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
          border: `2px solid ${NEMI_THEME.colors.bg.borderCharcoal}`,
          boxShadow: "0 25px 65px -10px rgba(0,0,0,0.35)",
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        {/* Minimal Diagram Label */}
        <div style={{ position: "absolute", top: 16, left: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: NEMI_THEME.colors.brand.yellow }} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#64748B",
              letterSpacing: 1.5,
              fontFamily: NEMI_THEME.typography.fontHeading,
            }}
          >
            HEAP MEMORY
          </span>
        </div>

        {/* ── ROOT NODE ── */}
        {frame >= 366 && (
          <div
            style={{
              position: "absolute",
              left: ROOT_POS.cx - 44,
              top: ROOT_POS.cy - 20,
              width: 88,
              height: 40,
              borderRadius: 10,
              backgroundColor: "rgba(6, 182, 212, 0.2)",
              border: `2px solid ${NEMI_THEME.colors.brand.cyan}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 25px rgba(6, 182, 212, 0.4)",
              opacity: interpolate(frame, [366, 376], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 900,
                color: NEMI_THEME.colors.brand.cyanGlow,
                fontFamily: NEMI_THEME.typography.fontCode,
              }}
            >
              ROOT
            </span>
          </div>
        )}

        {/* ── CONNECTION LINES (SVG Trace) ── */}
        {frame >= 366 && (
          <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {/* Standard trace connections */}
            {TRACE_CONNECTIONS.map((conn, i) => {
              if (frame < conn.startFrame) return null;

              const progress = interpolate(frame, [conn.startFrame, conn.startFrame + 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              let fromCx: number, fromCy: number;
              if (conn.fromId === 0) {
                fromCx = ROOT_POS.cx;
                fromCy = ROOT_POS.cy + 20;
              } else {
                const prev = OBJECTS.find((o) => o.id === conn.fromId)!;
                const pc = objCenter(prev.col, prev.row);
                fromCx = pc.cx;
                fromCy = pc.cy + 36;
              }

              const to = OBJECTS.find((o) => o.id === conn.toId)!;
              const tc = objCenter(to.col, to.row);
              const endX = fromCx + (tc.cx - fromCx) * progress;
              const endY = fromCy + (tc.cy - 36 - fromCy) * progress;

              return (
                <g key={i}>
                  <line
                    x1={fromCx}
                    y1={fromCy}
                    x2={endX}
                    y2={endY}
                    stroke={NEMI_THEME.colors.brand.cyanGlow}
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    opacity={0.7}
                  />
                  {progress < 1 && (
                    <circle cx={endX} cy={endY} r={5} fill={NEMI_THEME.colors.brand.cyanGlow} />
                  )}
                </g>
              );
            })}

            {/* The Surprise Connection in Act 5 (user -> hidden_ref!) */}
            {frame >= SURPRISE_CONNECTION.startFrame && (
              (() => {
                const sProg = interpolate(
                  frame,
                  [SURPRISE_CONNECTION.startFrame, SURPRISE_CONNECTION.startFrame + 22],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const fromObj = OBJECTS.find((o) => o.id === 2)!;
                const toObj = OBJECTS.find((o) => o.id === 12)!;
                const fc = objCenter(fromObj.col, fromObj.row);
                const tc = objCenter(toObj.col, toObj.row);
                const curX = fc.cx + (tc.cx - fc.cx) * sProg;
                const curY = fc.cy + (tc.cy - fc.cy) * sProg;

                return (
                  <g>
                    <line
                      x1={fc.cx}
                      y1={fc.cy}
                      x2={curX}
                      y2={curY}
                      stroke={NEMI_THEME.colors.brand.emeraldGlow}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      opacity={0.9}
                    />
                    <circle cx={curX} cy={curY} r={6} fill={NEMI_THEME.colors.brand.emeraldGlow} />
                  </g>
                );
              })()
            )}
          </svg>
        )}

        {/* ── MEMORY OBJECT CARDS ── */}
        {OBJECTS.map((obj) => {
          if (frame < obj.enterFrame) return null;

          const enterT = spring({
            frame: frame - obj.enterFrame,
            fps,
            config: NEMI_THEME.springs.pop,
          });

          const { cx, cy } = objCenter(obj.col, obj.row);
          const isReached = reachedSet.has(obj.id);
          const isTracing = frame >= 366;
          const isSweeping = frame >= 617;
          const isGarbage = !obj.alive;

          // Garbage Dissolve
          let garbageScale = 1;
          let garbageOpacity = 1;
          if (isGarbage && isSweeping) {
            garbageScale = interpolate(frame, [617, 685], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            garbageOpacity = interpolate(frame, [617, 675], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
          }
          if (isGarbage && frame >= 685) return null;

          // Compaction position interpolation
          let finalCx = cx;
          let finalCy = cy;
          if (obj.alive && frame >= 696) {
            const aliveIdx = ALIVE_OBJECTS.indexOf(obj);
            const cp = compactCenter(aliveIdx, ALIVE_OBJECTS.length);
            finalCx = cx + (cp.cx - cx) * compactSpring;
            finalCy = cy + (cp.cy - cy) * compactSpring;
          }

          // Colors & Semantic Styling
          let border = "rgba(255, 255, 255, 0.12)";
          let bg = "rgba(255, 255, 255, 0.04)";
          let textCol = "#E2E8F0";
          let glow = "none";

          // Prediction highlight in Act 3
          if (frame >= 279 && frame < 366) {
            border = "rgba(255, 209, 102, 0.35)";
            glow = "0 0 12px rgba(255, 209, 102, 0.2)";
          }

          if (isTracing && isReached) {
            border = NEMI_THEME.colors.brand.emerald;
            bg = "rgba(16, 185, 129, 0.18)";
            textCol = NEMI_THEME.colors.brand.emeraldGlow;
            glow = "0 0 20px rgba(16, 185, 129, 0.4)";
          } else if (isTracing && isGarbage && frame >= 500) {
            border = NEMI_THEME.colors.brand.coral;
            bg = "rgba(244, 63, 94, 0.15)";
            textCol = NEMI_THEME.colors.brand.coralGlow;
            glow = "0 0 20px rgba(244, 63, 94, 0.3)";
          } else if (obj.isSurprise && frame >= 540 && frame < 580) {
            // Nemi thinks it's dead before surprise!
            border = NEMI_THEME.colors.brand.yellow;
            glow = "0 0 25px rgba(255, 209, 102, 0.6)";
          }

          const W = 145, H = 76;

          return (
            <div
              key={obj.id}
              style={{
                position: "absolute",
                left: finalCx - W / 2,
                top: finalCy - H / 2,
                width: W,
                height: H,
                borderRadius: 16,
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
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: textCol,
                  fontFamily: NEMI_THEME.typography.fontCode,
                }}
              >
                {obj.label}
              </span>
              {isTracing && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: isReached ? "#34D399" : (frame >= 500 ? "#FB7185" : "#94A3B8"),
                    letterSpacing: 0.8,
                    fontFamily: NEMI_THEME.typography.fontHeading,
                  }}
                >
                  {isReached ? "✓ REACHABLE" : (frame >= 500 ? "✕ DEAD" : "UNCHECKED")}
                </span>
              )}
            </div>
          );
        })}

        {/* ── PAYOFF RESULT BADGE ── */}
        {frame >= 785 && (
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              opacity: interpolate(frame, [785, 795], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div
              style={{
                padding: "10px 24px",
                borderRadius: 14,
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: `1.5px solid ${NEMI_THEME.colors.brand.emerald}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)",
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 900, color: NEMI_THEME.colors.brand.emeraldGlow, fontFamily: NEMI_THEME.typography.fontCode }}>
                6 SURVIVORS
              </span>
              <span style={{ fontSize: 14, color: "#64748B" }}>·</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: NEMI_THEME.colors.brand.yellow, fontFamily: NEMI_THEME.typography.fontCode }}>
                0 FRAGMENTATION ⚡
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          BOTTOM ZONE — Nemi Reaction Anchor & Dialogue
         ══════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 45,
          right: 45,
          zIndex: 30,
          display: "flex",
          alignItems: "flex-end",
          gap: 16,
        }}
      >
        {/* Nemi Mascot with Dynamic Pose */}
        <div style={{ transform: `scale(${nemiScale * 0.95})`, transformOrigin: "bottom left", flexShrink: 0 }}>
          <NemiMascot pose={nemiPose} scale={1.1} />
        </div>

        {/* Nemi Speech Bubble */}
        {nemiSpeech && (
          <div
            style={{
              padding: "14px 22px",
              borderRadius: "20px 20px 20px 4px",
              backgroundColor: "#FFFFFF",
              border: `2px solid ${NEMI_THEME.colors.bg.borderMuted}`,
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              maxWidth: 460,
              opacity: speechOpacity,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: NEMI_THEME.colors.text.headingDark,
                lineHeight: 1.3,
              }}
            >
              {nemiSpeech}
            </span>
          </div>
        )}

        {/* Brand Watermark (Bottom Right) */}
        <div
          style={{
            marginLeft: "auto",
            padding: "10px 20px",
            borderRadius: 9999,
            backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: 0.85,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", fontFamily: NEMI_THEME.typography.fontHeading }}>
            @nemi.explains
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          AUDIO ENGINE — Master Audio Track + Accent SFX
         ══════════════════════════════════════════════════════ */}
      {/* Master Narration + Ducked Synthwave Goose Track */}
      <Audio src={staticFile("sounds/nemi_v3_master_audio.mp3")} volume={1.0} />

      {/* Accent SFX */}
      <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.4} />
      {frame >= 617 && frame < 650 && (
        <Audio src={staticFile("sounds/correct_chime.wav")} volume={0.25} playbackRate={1.3} />
      )}
    </AbsoluteFill>
  );
};
