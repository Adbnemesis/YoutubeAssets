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
import cues from "../data/nemi_v7_cues.json";

// ═══════════════════════════════════════════════════════════════════
// NEMI EXPLAINS V07 — MASTER MICRO-STORY REBUILD
// 10-BEAT PSYCHOLOGICAL STORYTELLING GRAMMAR (22.08s @ 30fps)
// ═══════════════════════════════════════════════════════════════════

const seg = (id: string) => {
  const s = cues.segments.find((x) => x.id === id);
  return s ?? { start_frame: 0, end_frame: 0, start_time_ms: 0, end_time_ms: 0, duration_s: 0 };
};

// ─── Beat Timing Boundaries (Derived from V7 Cues) ───
const BEATS = {
  hook:        { start: 0,   end: 86 },
  question:    { start: 87,  end: 158 },
  challenge:   { start: 159, end: 219 },
  freeze:      { start: 220, end: 318 },
  trace:       { start: 319, end: 409 },
  rule:        { start: 410, end: 513 },
  climax:      { start: 514, end: 546 },
  compact:     { start: 547, end: 587 },
  payoff:      { start: 588, end: 645 },
  outro:       { start: 646, end: cues.total_frames },
};

// Hook Cascading Memory Objects
const HOOK_ITEMS = [
  { label: "new WebSocket()", type: "NET", x: 280, y: 480, size: "64 KB", delay: 0 },
  { label: "cache.set('sess')", type: "MEM", x: 800, y: 420, size: "128 KB", delay: 4 },
  { label: "jwt_auth_token", type: "AUTH", x: 300, y: 640, size: "16 KB", delay: 8 },
  { label: "leaked_listener()", type: "DOM", x: 800, y: 660, size: "256 KB", delay: 12 },
  { label: "render_buffer", type: "GPU", x: 260, y: 840, size: "512 KB", delay: 16 },
  { label: "db_client_pool", type: "SQL", x: 780, y: 880, size: "1.2 MB", delay: 20 },
  { label: "orphan_cache", type: "MEM", x: 360, y: 1040, size: "84 KB", delay: 24 },
  { label: "hidden_closure", type: "SCOPE", x: 760, y: 1080, size: "32 KB", delay: 28 },
];

// Challenge Cards (2x2 Grid, centered in viewport)
const CHALLENGE_CARDS = [
  { id: "user", label: "user_session", type: "ACTIVE ROOT", addr: "0x7FFE81", size: "48 KB", x: 300, y: 600, reachable: true },
  { id: "orphan", label: "orphan_cache", type: "DANGLING REF", addr: "0x7FFE94", size: "120 KB", x: 780, y: 600, reachable: false },
  { id: "db", label: "db_client", type: "SOCKET CONN", addr: "0x7FFEAA", size: "250 KB", x: 300, y: 880, reachable: true },
  { id: "hidden", label: "hidden_ref", type: "CLOSURE TRAP", addr: "0x7FFEC2", size: "64 KB", x: 780, y: 880, reachable: true, isSurprise: true },
];

// Tree Node Coordinates (X is Center, Y is Top)
const ROOT_NODE = { x: 540, y: 440, w: 260, h: 76, label: "GLOBAL ROOT" };
const TREE_NODES = [
  { id: 1, label: "app", type: "OBJECT", x: 320, y: 660, w: 210, h: 80, parentX: 540, parentY: 440 + 76, delay: 330 },
  { id: 2, label: "user", type: "OBJECT", x: 760, y: 660, w: 210, h: 80, parentX: 540, parentY: 440 + 76, delay: 345 },
  { id: 3, label: "db_client", type: "CLIENT", x: 190, y: 900, w: 170, h: 78, parentX: 320, parentY: 660 + 80, delay: 368 },
  { id: 4, label: "jwt_token", type: "STRING", x: 420, y: 900, w: 170, h: 78, parentX: 320, parentY: 660 + 80, delay: 380 },
  { id: 5, label: "socket", type: "NET", x: 660, y: 900, w: 170, h: 78, parentX: 760, parentY: 660 + 80, delay: 395 },
  { id: 6, label: "hidden_ref", type: "CLOSURE", x: 890, y: 900, w: 170, h: 78, parentX: 760, parentY: 660 + 80, delay: 405 },
];

// Orphaned Nodes in Isolated Region
const ORPHAN_NODES = [
  { id: 7, label: "orphan_cache", size: "128 KB", type: "UNLINKED" },
  { id: 8, label: "tmp_buffer", size: "256 KB", type: "DETACHED" },
  { id: 9, label: "dead_listener", size: "64 KB", type: "ORPHAN" },
];

export const NemiExplainsV7Comp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Current Beat Detection ───
  const isHook = frame < BEATS.hook.end;
  const isQuestion = frame >= BEATS.question.start && frame < BEATS.question.end;
  const isChallenge = frame >= BEATS.challenge.start && frame < BEATS.challenge.end;
  const isFreeze = frame >= BEATS.freeze.start && frame < BEATS.freeze.end;
  const isTrace = frame >= BEATS.trace.start && frame < BEATS.trace.end;
  const isRule = frame >= BEATS.rule.start && frame < BEATS.rule.end;
  const isClimax = frame >= BEATS.climax.start && frame < BEATS.climax.end;
  const isCompact = frame >= BEATS.compact.start && frame < BEATS.compact.end;
  const isPayoff = frame >= BEATS.payoff.start && frame < BEATS.payoff.end;
  const isOutro = frame >= BEATS.outro.start;

  // ─── Background Theme Selection ───
  const isDarkScene = isChallenge || isFreeze || isTrace || isRule || isClimax || isCompact;
  const bgColor = isDarkScene ? "#0D1117" : NEMI_THEME.colors.bg.cream;

  // ─── Nemi Dynamic State ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;
  let speechStartFrame = 0;
  let nemiX = 120;
  let nemiY = 1680;
  let nemiScale = 1.45;
  let showNemi = true;

  if (isHook) {
    nemiPose = "shocked";
    nemiX = 880;
    nemiY = 1680;
    nemiScale = 1.5;
  } else if (isQuestion) {
    nemiPose = "puzzled";
    nemiX = 240;
    nemiY = 1600;
    nemiScale = 1.55;
    if (frame >= seg("v7_004_nemi_nope").start_frame && frame < seg("v7_004_nemi_nope").end_frame + 10) {
      nemiSpeech = "Because I'm not doing it. 🙅‍♂️";
      speechStartFrame = seg("v7_004_nemi_nope").start_frame;
    }
  } else if (isChallenge) {
    const isPointing = frame >= seg("v7_006_nemi_point").start_frame;
    nemiPose = isPointing ? "pointing" : "thinking";
    nemiX = 880;
    nemiY = 1620;
    nemiScale = 1.55;
    if (isPointing && frame < seg("v7_006_nemi_point").end_frame + 12) {
      nemiSpeech = "That one! 👉";
      speechStartFrame = seg("v7_006_nemi_point").start_frame;
    }
  } else if (isFreeze) {
    const hasRealized = frame >= seg("v7_008_nemi_oh").start_frame;
    nemiPose = hasRealized ? "shocked" : "puzzled";
    nemiX = 220;
    nemiY = 1620;
    nemiScale = 1.55;
    if (hasRealized && frame < seg("v7_008_nemi_oh").end_frame + 15) {
      nemiSpeech = "Wait... Oh. 🤯";
      speechStartFrame = seg("v7_008_nemi_oh").start_frame;
    }
  } else if (isTrace || isRule) {
    nemiPose = "explaining";
    nemiX = 180;
    nemiY = 1660;
    nemiScale = 1.35;
  } else if (isClimax) {
    nemiPose = "smug";
    nemiX = 880;
    nemiY = 1640;
    nemiScale = 1.55;
    if (frame >= seg("v7_015_nemi_bye").start_frame && frame < seg("v7_015_nemi_bye").end_frame + 15) {
      nemiSpeech = "Bye. 👋🧹";
      speechStartFrame = seg("v7_015_nemi_bye").start_frame;
    }
  } else if (isCompact) {
    nemiPose = "smug";
    nemiX = 880;
    nemiY = 1640;
    nemiScale = 1.4;
  } else if (isPayoff || isOutro) {
    nemiPose = "aha";
    nemiX = 540;
    nemiY = 1580;
    nemiScale = 1.65;
    if (frame >= seg("v7_018_nemi_better").start_frame) {
      nemiSpeech = "Much better! 😎✨";
      speechStartFrame = seg("v7_018_nemi_better").start_frame;
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: "hidden", fontFamily: NEMI_THEME.typography.fontDisplay }}>

      {/* Dynamic Background Grid & Lighting */}
      {isDarkScene ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: "25%",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)",
              backgroundSize: "32px 32px",
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "20%",
              width: "700px",
              height: "700px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 209, 102, 0.15) 0%, transparent 70%)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Top Universal Brand Header */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          right: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: NEMI_THEME.colors.brand.yellow,
              boxShadow: "0 0 12px #FFD166",
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: 2,
              color: isDarkScene ? "#94A3B8" : "#475569",
              fontFamily: NEMI_THEME.typography.fontHeading,
            }}
          >
            V8 ENGINE · MEMORY MANAGEMENT
          </span>
        </div>

        <div
          style={{
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: isDarkScene ? "rgba(255,255,255,0.08)" : "rgba(24, 24, 27, 0.06)",
            border: `1px solid ${isDarkScene ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
            backdropFilter: "blur(10px)",
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
      </div>

      {/* ═══════════════════════════════════════════════════════════
          BEAT 1 — HOOK: RAPID OBJECT CREATION CASCADE
         ═══════════════════════════════════════════════════════════ */}
      {isHook && (() => {
        const titleSpring = spring({ frame, fps, config: NEMI_THEME.springs.snappy });
        const isALot = frame >= seg("v7_002_hook_alot").start_frame;
        const ramMB = Math.min(512, Math.floor(interpolate(frame, [0, 85], [12, 480], { extrapolateRight: "clamp" })));

        return (
          <>
            <div
              style={{
                position: "absolute",
                top: 160,
                left: 60,
                right: 60,
                textAlign: "center",
                zIndex: 30,
                transform: `scale(${titleSpring})`,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 18px",
                  borderRadius: 9999,
                  backgroundColor: "#FEE2E2",
                  color: "#EF4444",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  marginBottom: 14,
                }}
              >
                HEAP ALLOCATION SPIKE
              </span>
              <h1
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: NEMI_THEME.colors.text.headingDark,
                  letterSpacing: -2,
                  margin: 0,
                }}
              >
                Your JavaScript keeps making stuff...
              </h1>

              {isALot && (
                <div
                  style={{
                    marginTop: 14,
                    transform: `scale(${spring({ frame: frame - seg("v7_002_hook_alot").start_frame, fps, config: NEMI_THEME.springs.pop })})`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 62,
                      fontWeight: 900,
                      color: "#E11D48",
                      letterSpacing: -2,
                      textShadow: "0 4px 25px rgba(225, 29, 72, 0.3)",
                    }}
                  >
                    A LOT of stuff. ⚠️
                  </span>
                </div>
              )}
            </div>

            {/* Cascading Cards */}
            {HOOK_ITEMS.map((item, i) => {
              const itemLocal = frame - item.delay;
              if (itemLocal < 0) return null;
              const pop = spring({ frame: itemLocal, fps, config: { damping: 9, stiffness: 260, mass: 0.5 } });

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: item.x - 140,
                    top: item.y - 40,
                    width: 280,
                    height: 80,
                    borderRadius: 18,
                    backgroundColor: "rgba(24, 24, 27, 0.94)",
                    border: "2px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 22px",
                    transform: `scale(${pop})`,
                    zIndex: 20,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC", fontFamily: NEMI_THEME.typography.fontCode }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: NEMI_THEME.colors.brand.yellow, letterSpacing: 1 }}>
                      {item.type}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#94A3B8", fontFamily: NEMI_THEME.typography.fontCode }}>
                    {item.size}
                  </span>
                </div>
              );
            })}

            {/* Live RAM Monitor */}
            <div
              style={{
                position: "absolute",
                bottom: 240,
                left: 100,
                right: 100,
                padding: "20px 28px",
                borderRadius: 22,
                backgroundColor: "rgba(24, 24, 27, 0.92)",
                border: "2px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                zIndex: 25,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#94A3B8", letterSpacing: 1.5 }}>
                  TOTAL HEAP CONSUMPTION
                </span>
                <span style={{ fontSize: 24, fontWeight: 900, color: isALot ? "#FB7185" : "#38BDF8", fontFamily: NEMI_THEME.typography.fontCode }}>
                  {ramMB} MB / 512 MB
                </span>
              </div>
              <div style={{ width: "100%", height: 12, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(ramMB / 512) * 100}%`,
                    height: "100%",
                    borderRadius: 6,
                    backgroundColor: isALot ? "#F43F5E" : "#06B6D4",
                    boxShadow: isALot ? "0 0 15px #F43F5E" : "0 0 15px #06B6D4",
                  }}
                />
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 2 — QUESTION: THE CORE MYSTERY
         ═══════════════════════════════════════════════════════════ */}
      {isQuestion && (() => {
        const local = frame - BEATS.question.start;
        const textSpring = spring({ frame: local, fps, config: NEMI_THEME.springs.snappy });

        return (
          <>
            <div
              style={{
                position: "absolute",
                top: 360,
                left: 80,
                right: 80,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                zIndex: 30,
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: NEMI_THEME.colors.brand.yellow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 52,
                  boxShadow: "0 20px 40px rgba(255, 209, 102, 0.45)",
                  marginBottom: 36,
                  transform: `scale(${textSpring})`,
                }}
              >
                ❓
              </div>

              <h1
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  lineHeight: 1.12,
                  color: NEMI_THEME.colors.text.headingDark,
                  letterSpacing: -2.5,
                  margin: 0,
                  transform: `scale(${textSpring}) translateY(${(1 - textSpring) * 30}px)`,
                }}
              >
                So who cleans it up?
              </h1>

              {/* Technical Context Card */}
              <div
                style={{
                  marginTop: 60,
                  padding: "26px 40px",
                  borderRadius: 24,
                  backgroundColor: "rgba(24, 24, 27, 0.05)",
                  border: "2px dashed rgba(0,0,0,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  opacity: interpolate(local, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 800, color: "#64748B" }}>
                  Unlike C / C++ / Rust:
                </span>
                <span style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", fontFamily: NEMI_THEME.typography.fontCode }}>
                  JavaScript has no <span style={{ color: "#EF4444" }}>free()</span> or <span style={{ color: "#EF4444" }}>delete</span>
                </span>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 3 — VIEWER CHALLENGE & WRONG GUESS (2x2 Grid)
         ═══════════════════════════════════════════════════════════ */}
      {isChallenge && (() => {
        const local = frame - BEATS.challenge.start;
        const isPointing = frame >= seg("v7_006_nemi_point").start_frame;

        return (
          <>
            <div style={{ position: "absolute", top: 180, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(255, 209, 102, 0.15)",
                  color: NEMI_THEME.colors.brand.yellow,
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                SPOT THE GARBAGE
              </span>
              <h2 style={{ fontSize: 56, fontWeight: 900, color: "#F8FAFC", letterSpacing: -1.5, margin: 0 }}>
                Which one gets deleted?
              </h2>
            </div>

            {/* 2x2 Centered Cards */}
            <div style={{ position: "absolute", top: 380, left: 60, right: 60, height: 750, zIndex: 20 }}>
              {CHALLENGE_CARDS.map((card) => {
                const isSelected = card.id === "hidden" && isPointing;
                const pop = spring({ frame: local, fps, config: NEMI_THEME.springs.pop });

                return (
                  <div
                    key={card.id}
                    style={{
                      position: "absolute",
                      left: card.x - 210,
                      top: card.y - 480,
                      width: 420,
                      height: 220,
                      borderRadius: 24,
                      backgroundColor: isSelected ? "rgba(244, 63, 94, 0.16)" : "rgba(255, 255, 255, 0.05)",
                      border: `2.5px solid ${isSelected ? NEMI_THEME.colors.brand.coral : "rgba(255, 255, 255, 0.12)"}`,
                      boxShadow: isSelected ? "0 0 45px rgba(244, 63, 94, 0.45)" : "0 15px 35px rgba(0,0,0,0.3)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "26px 32px",
                      transform: `scale(${pop})`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: NEMI_THEME.colors.brand.yellow, letterSpacing: 1.5 }}>
                        {card.type}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#64748B", fontFamily: NEMI_THEME.typography.fontCode }}>
                        {card.addr} · {card.size}
                      </span>
                    </div>

                    <span style={{ fontSize: 28, fontWeight: 900, color: "#F8FAFC", fontFamily: NEMI_THEME.typography.fontCode }}>
                      {card.label}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: isSelected ? "#F43F5E" : "#94A3B8" }} />
                      <span style={{ fontSize: 14, fontWeight: 800, color: isSelected ? "#FB7185" : "#94A3B8" }}>
                        {isSelected ? "NEMI'S GUESS: GARBAGE? ❌" : "INSPECT ROOT REFERENCE"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 4 — FREEZE & SURPRISE REVEAL: HIDDEN CLOSURE
         ═══════════════════════════════════════════════════════════ */}
      {isFreeze && (() => {
        const local = frame - BEATS.freeze.start;
        const revealStart = seg("v7_009_reachable").start_frame - BEATS.freeze.start;
        const lineProgress = local >= revealStart ? interpolate(local, [revealStart, revealStart + 15], [0, 1], { extrapolateRight: "clamp" }) : 0;

        return (
          <>
            <div style={{ position: "absolute", top: 180, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: lineProgress > 0.5 ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)",
                  color: lineProgress > 0.5 ? NEMI_THEME.colors.brand.emeraldGlow : NEMI_THEME.colors.brand.coralGlow,
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                {lineProgress > 0.5 ? "REACHABILITY DISCOVERY" : "HOLD ON..."}
              </span>
              <h2
                style={{
                  fontSize: 58,
                  fontWeight: 900,
                  color: lineProgress > 0.5 ? NEMI_THEME.colors.brand.emeraldGlow : "#FFFFFF",
                  letterSpacing: -1.5,
                  margin: 0,
                }}
              >
                {lineProgress > 0.5 ? "IT'S STILL REACHABLE!" : "WAIT."}
              </h2>
            </div>

            {/* Spotlight Stage */}
            <div style={{ position: "absolute", top: 400, left: 80, right: 80, height: 750, zIndex: 20 }}>
              {/* User Session Node (Top Left) */}
              <div
                style={{
                  position: "absolute",
                  left: 60,
                  top: 60,
                  width: 380,
                  height: 180,
                  borderRadius: 24,
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  border: `3px solid ${NEMI_THEME.colors.brand.emerald}`,
                  boxShadow: "0 0 35px rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 32px",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 900, color: NEMI_THEME.colors.brand.emeraldGlow, letterSpacing: 1.5 }}>
                  ROOT POINTER
                </span>
                <span style={{ fontSize: 26, fontWeight: 900, color: "#FFFFFF", fontFamily: NEMI_THEME.typography.fontCode }}>
                  user_session
                </span>
                <span style={{ fontSize: 14, color: "#A7F3D0" }}>✓ Retained in scope</span>
              </div>

              {/* Exact Laser SVG Connector from Bottom of user_session to Top of hidden_ref */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 25 }}>
                {lineProgress > 0 && (
                  <>
                    <line
                      x1={250}
                      y1={240}
                      x2={250 + (400) * lineProgress}
                      y2={240 + (200) * lineProgress}
                      stroke={NEMI_THEME.colors.brand.emeraldGlow}
                      strokeWidth={5}
                      strokeDasharray="10 6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={250 + (400) * lineProgress}
                      cy={240 + (200) * lineProgress}
                      r={9}
                      fill={NEMI_THEME.colors.brand.emeraldGlow}
                    />
                  </>
                )}
              </svg>

              {/* Hidden Ref Node (Bottom Right) */}
              <div
                style={{
                  position: "absolute",
                  right: 60,
                  top: 440,
                  width: 380,
                  height: 180,
                  borderRadius: 24,
                  backgroundColor: lineProgress > 0.5 ? "rgba(16, 185, 129, 0.18)" : "rgba(244, 63, 94, 0.15)",
                  border: `3px solid ${lineProgress > 0.5 ? NEMI_THEME.colors.brand.emerald : NEMI_THEME.colors.brand.coral}`,
                  boxShadow: lineProgress > 0.5 ? "0 0 45px rgba(16, 185, 129, 0.45)" : "0 0 30px rgba(244, 63, 94, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 32px",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: lineProgress > 0.5 ? NEMI_THEME.colors.brand.emeraldGlow : NEMI_THEME.colors.brand.coralGlow,
                    letterSpacing: 1.5,
                  }}
                >
                  {lineProgress > 0.5 ? "HIDDEN CLOSURE CAPTURE" : "LOOKED DEAD"}
                </span>
                <span style={{ fontSize: 26, fontWeight: 900, color: "#FFFFFF", fontFamily: NEMI_THEME.typography.fontCode }}>
                  hidden_ref
                </span>
                <span style={{ fontSize: 14, fontWeight: 900, color: lineProgress > 0.5 ? "#34D399" : "#FB7185" }}>
                  {lineProgress > 0.5 ? "SURVIVES GC! ✓" : "TRASH CANDIDATE? ❌"}
                </span>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEATS 5 & 6 — ROOT TRACE & THE RULE (Full Graph)
         ═══════════════════════════════════════════════════════════ */}
      {(isTrace || isRule) && (() => {
        const isRulePhase = isRule;
        const isCantReach = frame >= seg("v7_013_cant").start_frame;

        return (
          <>
            <div style={{ position: "absolute", top: 160, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: isCantReach ? "rgba(244, 63, 94, 0.2)" : "rgba(6, 182, 212, 0.2)",
                  color: isCantReach ? NEMI_THEME.colors.brand.coralGlow : NEMI_THEME.colors.brand.cyanGlow,
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 12,
                }}
              >
                {isRulePhase ? "THE GOLDEN RULE OF GC" : "MARK-AND-SWEEP TRACE"}
              </span>
              <h2
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: isCantReach ? NEMI_THEME.colors.brand.coralGlow : "#FFFFFF",
                  letterSpacing: -1.5,
                  margin: 0,
                }}
              >
                {!isRulePhase ? "V8 starts from the roots..." : isCantReach ? "If it can't reach... IT GOES! 💥" : "If it can reach it, IT STAYS! ✓"}
              </h2>
            </div>

            {/* Tree Graph Layout Area */}
            <div style={{ position: "absolute", top: 320, left: 40, right: 40, height: 950, zIndex: 20 }}>
              {/* Connector SVG Lines (Pixel Perfect Center-to-Center) */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}>
                {TREE_NODES.map((node) => {
                  const nodeActive = frame >= node.delay;
                  const progress = nodeActive ? Math.min(1, (frame - node.delay) / 10) : 0;
                  if (progress <= 0) return null;

                  const startX = node.parentX - 40;
                  const startY = node.parentY - 320;
                  const targetX = node.x - 40;
                  const targetY = node.y - 320;

                  const curX = startX + (targetX - startX) * progress;
                  const curY = startY + (targetY - startY) * progress;

                  return (
                    <g key={node.id}>
                      <line
                        x1={startX}
                        y1={startY}
                        x2={curX}
                        y2={curY}
                        stroke={NEMI_THEME.colors.brand.emeraldGlow}
                        strokeWidth={3.5}
                        strokeLinecap="round"
                        opacity={0.85}
                      />
                      {progress < 1 && (
                        <circle cx={curX} cy={curY} r={6} fill={NEMI_THEME.colors.brand.cyanGlow} />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Global Root Badge */}
              <div
                style={{
                  position: "absolute",
                  left: ROOT_NODE.x - 40 - (ROOT_NODE.w / 2),
                  top: ROOT_NODE.y - 320,
                  width: ROOT_NODE.w,
                  height: ROOT_NODE.h,
                  borderRadius: 18,
                  backgroundColor: "rgba(6, 182, 212, 0.25)",
                  border: `2.5px solid ${NEMI_THEME.colors.brand.cyan}`,
                  boxShadow: "0 0 35px rgba(6, 182, 212, 0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 20,
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 900, color: NEMI_THEME.colors.brand.cyanGlow, fontFamily: NEMI_THEME.typography.fontCode }}>
                  🌐 WINDOW ROOT
                </span>
              </div>

              {/* Reachable Tree Nodes */}
              {TREE_NODES.map((node) => {
                const isLit = frame >= node.delay;
                const pop = isLit ? spring({ frame: frame - node.delay, fps, config: NEMI_THEME.springs.snappy }) : 0;

                return (
                  <div
                    key={node.id}
                    style={{
                      position: "absolute",
                      left: node.x - 40 - (node.w / 2),
                      top: node.y - 320,
                      width: node.w,
                      height: node.h,
                      borderRadius: 18,
                      backgroundColor: isLit ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: `2px solid ${isLit ? NEMI_THEME.colors.brand.emerald : "rgba(255, 255, 255, 0.12)"}`,
                      boxShadow: isLit ? "0 0 25px rgba(16, 185, 129, 0.35)" : "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      transform: `scale(${pop})`,
                      zIndex: 20,
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 900, color: isLit ? NEMI_THEME.colors.brand.emeraldGlow : "#E2E8F0", fontFamily: NEMI_THEME.typography.fontCode }}>
                      {node.label}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: isLit ? "#34D399" : "#64748B" }}>
                      {isLit ? "✓ REACHABLE" : "SCANNING"}
                    </span>
                  </div>
                );
              })}

              {/* Unreachable Orphan Region Box */}
              <div
                style={{
                  position: "absolute",
                  top: 700,
                  left: 20,
                  right: 20,
                  padding: "20px 24px",
                  borderRadius: 24,
                  backgroundColor: isCantReach ? "rgba(244, 63, 94, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  border: `2px dashed ${isCantReach ? NEMI_THEME.colors.brand.coral : "rgba(255, 255, 255, 0.1)"}`,
                  zIndex: 20,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: isCantReach ? "#FB7185" : "#64748B", letterSpacing: 1.5 }}>
                    ISOLATED HEAP OBJECTS (0 ROOT LINKS)
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 900, color: isCantReach ? "#FB7185" : "#64748B" }}>
                    {isCantReach ? "MARKED FOR TRASH 🚨" : "UNREACHABLE"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 14, justifyContent: "space-between" }}>
                  {ORPHAN_NODES.map((orphan) => (
                    <div
                      key={orphan.id}
                      style={{
                        flex: 1,
                        height: 76,
                        borderRadius: 16,
                        backgroundColor: isCantReach ? "rgba(244, 63, 94, 0.25)" : "rgba(255, 255, 255, 0.05)",
                        border: `1.5px solid ${isCantReach ? NEMI_THEME.colors.brand.coral : "rgba(255, 255, 255, 0.1)"}`,
                        boxShadow: isCantReach ? "0 0 25px rgba(244, 63, 94, 0.35)" : "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 900, color: isCantReach ? NEMI_THEME.colors.brand.coralGlow : "#94A3B8", fontFamily: NEMI_THEME.typography.fontCode }}>
                        {orphan.label}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: isCantReach ? "#FB7185" : "#64748B" }}>
                        {orphan.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 7 — CLIMAX: RAPID GARBAGE SWEEP & MEMORY FREED
         ═══════════════════════════════════════════════════════════ */}
      {isClimax && (() => {
        const local = frame - BEATS.climax.start;
        return (
          <>
            <div style={{ position: "absolute", top: 240, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 22px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(244, 63, 94, 0.25)",
                  color: "#FB7185",
                  fontSize: 15,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 16,
                }}
              >
                SWEEP PHASE COMPLETE
              </span>
              <h1 style={{ fontSize: 68, fontWeight: 900, color: "#FFFFFF", letterSpacing: -2, margin: 0 }}>
                CLEANING UNREACHABLE RAM 🧹
              </h1>
            </div>

            {/* Vanishing Deletion Chips */}
            <div
              style={{
                position: "absolute",
                top: 480,
                left: 80,
                right: 80,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                zIndex: 20,
              }}
            >
              {ORPHAN_NODES.map((orphan) => {
                const pop = Math.max(0, 1 - (local / 14));
                return (
                  <div
                    key={orphan.id}
                    style={{
                      padding: "24px 36px",
                      borderRadius: 22,
                      backgroundColor: "rgba(244, 63, 94, 0.2)",
                      border: "2px solid #F43F5E",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      opacity: pop,
                      transform: `scale(${pop * 1.05})`,
                    }}
                  >
                    <span style={{ fontSize: 24, fontWeight: 900, color: "#FB7185", fontFamily: NEMI_THEME.typography.fontCode }}>
                      {orphan.label}
                    </span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: "#34D399", fontFamily: NEMI_THEME.typography.fontCode }}>
                      +{orphan.size} FREED ✨
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 8 — COMPACTION: MEMORY DEFRAGMENTATION
         ═══════════════════════════════════════════════════════════ */}
      {isCompact && (() => {
        const local = frame - BEATS.compact.start;
        const snap = spring({ frame: local, fps, config: { damping: 12, stiffness: 180, mass: 0.8 } });
        const SURVIVORS = ["app", "user", "jwt_token", "db_client", "socket", "hidden_ref", "session"];

        return (
          <>
            <div style={{ position: "absolute", top: 220, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(255, 209, 102, 0.15)",
                  color: NEMI_THEME.colors.brand.yellow,
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                HEAP COMPACTION
              </span>
              <h2 style={{ fontSize: 62, fontWeight: 900, color: "#FFFFFF", letterSpacing: -2, margin: 0 }}>
                Packed & Compacted ⚡
              </h2>
            </div>

            {/* RAM Slot Bar */}
            <div
              style={{
                position: "absolute",
                top: 480,
                left: 80,
                right: 80,
                padding: "36px",
                borderRadius: 28,
                backgroundColor: "rgba(24, 24, 27, 0.9)",
                border: "2px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
                zIndex: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#94A3B8" }}>
                  CONTINUOUS PHYSICAL MEMORY SPACE
                </span>
                <span style={{ fontSize: 16, fontWeight: 900, color: NEMI_THEME.colors.brand.emeraldGlow }}>
                  0% FRAGMENTATION
                </span>
              </div>

              <div style={{ display: "flex", gap: 8, height: 110 }}>
                {SURVIVORS.map((name, i) => {
                  const initialOffset = (6 - i) * 60;
                  const currentOffset = initialOffset * (1 - snap);

                  return (
                    <div
                      key={name}
                      style={{
                        flex: 1,
                        borderRadius: 14,
                        backgroundColor: "rgba(16, 185, 129, 0.25)",
                        border: `2px solid ${NEMI_THEME.colors.brand.emerald}`,
                        boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `translateX(${currentOffset}px)`,
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 900, color: "#A7F3D0", fontFamily: NEMI_THEME.typography.fontCode, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                        {name}
                      </span>
                    </div>
                  );
                })}

                <div
                  style={{
                    flex: 3,
                    borderRadius: 14,
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "2px dashed rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 900, color: "#64748B" }}>
                    FREE CONTIGUOUS RAM (440 MB)
                  </span>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEATS 9 & 10 — PAYOFF & GRAND SUMMARY
         ═══════════════════════════════════════════════════════════ */}
      {(isPayoff || isOutro) && (() => {
        const local = frame - BEATS.payoff.start;
        const pop = spring({ frame: local, fps, config: NEMI_THEME.springs.snappy });

        return (
          <>
            <div
              style={{
                position: "absolute",
                top: 200,
                left: 60,
                right: 60,
                textAlign: "center",
                zIndex: 30,
                transform: `scale(${pop})`,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 22px",
                  borderRadius: 9999,
                  backgroundColor: "#FEF3C7",
                  color: "#B45309",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 16,
                }}
              >
                CORE TAKEAWAY
              </span>
              <h1
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: NEMI_THEME.colors.text.headingDark,
                  letterSpacing: -2,
                  margin: 0,
                }}
              >
                Garbage collection isn't magic.
              </h1>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#64748B",
                  marginTop: 14,
                  lineHeight: 1.3,
                }}
              >
                It finds what's still alive... and clears the rest.
              </p>
            </div>

            {/* Master Summary Card */}
            <div
              style={{
                position: "absolute",
                top: 480,
                left: 80,
                right: 80,
                padding: "36px 44px",
                borderRadius: 28,
                backgroundColor: "rgba(24, 24, 27, 0.95)",
                border: "2px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                zIndex: 20,
                transform: `scale(${pop})`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  🧠
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>Reachability = Survival</div>
                  <div style={{ fontSize: 15, color: "#94A3B8" }}>Only objects linked to Root stay in memory.</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(6, 182, 212, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>Mark & Sweep in V8</div>
                  <div style={{ fontSize: 15, color: "#94A3B8" }}>Runs automatically in the background.</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255, 209, 102, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  🛡️
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>Beware of Unwanted Closures</div>
                  <div style={{ fontSize: 15, color: "#94A3B8" }}>Trapped references prevent garbage cleanup!</div>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          NEMI MASCOT HERO & SPEECH BUBBLE
         ═══════════════════════════════════════════════════════════ */}
      {showNemi && (
        <div
          style={{
            position: "absolute",
            left: nemiX - 90,
            top: nemiY - 110,
            zIndex: 40,
            transform: `scale(${spring({ frame: Math.max(0, frame - 5), fps, config: NEMI_THEME.springs.bouncy }) * nemiScale})`,
            transformOrigin: "bottom center",
          }}
        >
          <NemiMascot pose={nemiPose} scale={1.0} />
        </div>
      )}

      {/* Dynamic Speech Bubble */}
      {nemiSpeech && (
        <div
          style={{
            position: "absolute",
            left: isHook || isChallenge || isClimax ? undefined : nemiX + 90,
            right: isHook || isChallenge || isClimax ? 100 : undefined,
            top: nemiY - 220,
            zIndex: 45,
            padding: "16px 28px",
            borderRadius: isHook || isChallenge || isClimax ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
            backgroundColor: "#FFFFFF",
            border: "2.5px solid #18181B",
            boxShadow: "0 15px 35px rgba(0,0,0,0.18)",
            maxWidth: 420,
            transform: `scale(${spring({ frame: Math.max(0, frame - speechStartFrame), fps, config: NEMI_THEME.springs.pop })})`,
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", lineHeight: 1.25 }}>
            {nemiSpeech}
          </span>
        </div>
      )}

      {/* Bottom Channel Tag Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          padding: "8px 18px",
          borderRadius: 9999,
          backgroundColor: isDarkScene ? "rgba(255,255,255,0.08)" : "rgba(24, 24, 27, 0.8)",
          backdropFilter: "blur(10px)",
          zIndex: 50,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF", fontFamily: NEMI_THEME.typography.fontHeading }}>
          @nemi.explains
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          AUDIO TRACKS (Master Narration + Dynamic BGM + SFX)
         ═══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("sounds/nemi_v7_master_audio.mp3")} volume={1.0} />
      <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.25} />
      {frame >= BEATS.climax.start && frame < BEATS.climax.start + 25 && (
        <Audio src={staticFile("sounds/correct_chime.wav")} volume={0.3} playbackRate={1.2} />
      )}
    </AbsoluteFill>
  );
};
