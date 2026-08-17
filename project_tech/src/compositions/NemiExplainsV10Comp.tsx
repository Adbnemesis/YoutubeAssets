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
import cuesData from "../data/nemi_v10_cues.json";

// ═══════════════════════════════════════════════════════════════════
// NEMI EXPLAINS V10 — MASTER FINAL STANDARD COMPOSITION
// 10-BEAT NARRATIVE + CONTINUOUS CAMERA JOURNEY + 0MS OVERLAP (~20.5s)
// ═══════════════════════════════════════════════════════════════════

const getEvent = (id: string) => {
  const ev = cuesData.timeline_events.find((x) => x.id === id);
  return ev ?? { start_frame: 0, end_frame: 0, start_time_ms: 0, end_time_ms: 0, duration_s: 0, semantic_cues: [] };
};

const getCueFrame = (eventId: string, cueName: string, fallback: number) => {
  const ev = cuesData.timeline_events.find((x) => x.id === eventId);
  if (!ev) return fallback;
  const sc = ev.semantic_cues.find((x: any) => x.cue === cueName);
  return sc ? sc.frame : fallback;
};

// Cascading Allocation Objects for Beat 1
const HOOK_OBJECTS = [
  { label: "new WebSocket()", type: "NET", x: 280, y: 480, size: "64 KB", delay: 0 },
  { label: "cache.set('sess')", type: "MEM", x: 800, y: 420, size: "128 KB", delay: 3 },
  { label: "jwt_auth_token", type: "AUTH", x: 300, y: 640, size: "16 KB", delay: 6 },
  { label: "leaked_listener()", type: "DOM", x: 800, y: 660, size: "256 KB", delay: 9 },
  { label: "render_buffer", type: "GPU", x: 260, y: 840, size: "512 KB", delay: 12 },
  { label: "db_client_pool", type: "SQL", x: 780, y: 880, size: "1.2 MB", delay: 15 },
  { label: "orphan_cache", type: "MEM", x: 360, y: 1040, size: "84 KB", delay: 18 },
  { label: "hidden_closure", type: "SCOPE", x: 760, y: 1080, size: "32 KB", delay: 21 },
];

// Challenge Cards (3 Objects for Ultra-Fast Viewer Inspection)
const CHALLENGE_CARDS = [
  { id: "user", label: "user_session", type: "ACTIVE ROOT", addr: "0x7FFE81", size: "48 KB", x: 300, y: 580 },
  { id: "orphan", label: "orphan_cache", type: "DANGLING REF", addr: "0x7FFE94", size: "120 KB", x: 780, y: 580 },
  { id: "hidden", label: "hidden_ref", type: "CLOSURE TRAP", addr: "0x7FFEC2", size: "64 KB", x: 540, y: 860, isTarget: true },
];

// Tree Node Coordinates (X: Center, Y: Top)
const ROOT_NODE = { x: 540, y: 440, w: 260, h: 76, label: "GLOBAL ROOT" };
const TREE_NODES = [
  { id: 1, label: "app", type: "OBJECT", x: 320, y: 660, w: 210, h: 80, parentX: 540, parentY: 440 + 76, delayOffset: 3 },
  { id: 2, label: "user", type: "OBJECT", x: 760, y: 660, w: 210, h: 80, parentX: 540, parentY: 440 + 76, delayOffset: 6 },
  { id: 3, label: "db_client", type: "CLIENT", x: 190, y: 900, w: 170, h: 78, parentX: 320, parentY: 660 + 80, delayOffset: 10 },
  { id: 4, label: "jwt_token", type: "STRING", x: 420, y: 900, w: 170, h: 78, parentX: 320, parentY: 660 + 80, delayOffset: 13 },
  { id: 5, label: "socket", type: "NET", x: 660, y: 900, w: 170, h: 78, parentX: 760, parentY: 660 + 80, delayOffset: 16 },
  { id: 6, label: "hidden_ref", type: "CLOSURE", x: 890, y: 900, w: 170, h: 78, parentX: 760, parentY: 660 + 80, delayOffset: 19 },
];

// Orphaned Objects
const ORPHAN_OBJECTS = [
  { id: 7, label: "orphan_cache", size: "128 KB", type: "UNLINKED" },
  { id: 8, label: "tmp_buffer", size: "256 KB", type: "DETACHED" },
  { id: 9, label: "dead_listener", size: "64 KB", type: "ORPHAN" },
];

export const NemiExplainsV10Comp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Timeline Events Derived from V10 Speaker Orchestration ───
  const evHook = getEvent("v10_narrator_01_hook");
  const evChallenge = getEvent("v10_narrator_02_challenge");
  const evGuess = getEvent("v10_nemi_01_guess");
  const evWait = getEvent("v10_narrator_02b_wait");
  const evOh = getEvent("v10_nemi_02_oh");
  const evDiscovery = getEvent("v10_narrator_03_discovery");
  const evRule = getEvent("v10_narrator_04_rule");
  const evBye = getEvent("v10_nemi_03_bye");
  const evPayoff = getEvent("v10_narrator_05_payoff");
  const evBetter = getEvent("v10_nemi_04_better");

  // Semantic Phrase Timing
  const fRamSurge = getCueFrame("v10_narrator_01_hook", "ram_surge", evHook.start_frame + 35);
  const fQuestion = getCueFrame("v10_narrator_01_hook", "question_pause", evHook.start_frame + 65);
  const fGrid = getCueFrame("v10_narrator_02_challenge", "challenge_grid", evChallenge.start_frame + 10);
  const fPoint = evGuess.start_frame;
  const fFreeze = evWait.start_frame;
  const fLaser = getCueFrame("v10_narrator_02b_wait", "laser_reveal", evWait.start_frame + 15);
  const fZoomRoot = getCueFrame("v10_narrator_03_discovery", "camera_zoom_root", evDiscovery.start_frame + 8);
  const fFollowEdge = getCueFrame("v10_narrator_03_discovery", "camera_follow_edge", evDiscovery.start_frame + 20);
  const fGreenGlow = getCueFrame("v10_narrator_04_rule", "green_reachable_glow", evRule.start_frame + 10);
  const fCoralGlow = getCueFrame("v10_narrator_04_rule", "coral_garbage_highlight", evRule.start_frame + 25);
  const fVaporize = evBye.start_frame;
  const fCompactSnap = getCueFrame("v10_narrator_05_payoff", "compaction_snap", evPayoff.start_frame + 12);
  const fPayoffSummary = getCueFrame("v10_narrator_05_payoff", "master_takeaway", evPayoff.start_frame + 30);

  // ─── Scene State Classification (10 Beats) ───
  const isHookScene = frame < evChallenge.start_frame;
  const isChallengeScene = frame >= evChallenge.start_frame && frame < evWait.start_frame;
  const isFreezeScene = frame >= evWait.start_frame && frame < evDiscovery.start_frame;
  const isDiscoveryScene = frame >= evDiscovery.start_frame && frame < evRule.start_frame;
  const isRuleScene = frame >= evRule.start_frame && frame < evBye.start_frame;
  const isClimaxScene = frame >= evBye.start_frame && frame < fCompactSnap;
  const isCompactScene = frame >= fCompactSnap && frame < fPayoffSummary;
  const isPayoffScene = frame >= fPayoffSummary;

  // ─── Background Theme Selection ───
  const isDarkScene = !isHookScene && !isPayoffScene;
  const bgColor = isDarkScene ? "#0D1117" : NEMI_THEME.colors.bg.cream;

  // ─── Continuous Camera Primitives (Zoom & Pan) ───
  let cameraZoom = 1.0;
  let cameraPanY = 0;

  if (isDiscoveryScene) {
    // Camera Push into Global Root, then pans down following edges
    cameraZoom = interpolate(frame, [evDiscovery.start_frame, fZoomRoot, fFollowEdge], [1.0, 1.28, 1.15], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cameraPanY = interpolate(frame, [evDiscovery.start_frame, fFollowEdge, evDiscovery.end_frame], [0, -60, -120], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (isRuleScene) {
    // Camera Pulls Back to Wide Frame revealing full tree vs orphan trash
    cameraZoom = interpolate(frame, [evRule.start_frame, fCoralGlow], [1.15, 0.95], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cameraPanY = interpolate(frame, [evRule.start_frame, fCoralGlow], [-120, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // ─── Nemi Dynamic Emotional Arc & Non-Overlapping Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;
  let speechStartFrame = 0;
  let nemiX = 120;
  let nemiY = 1680;
  let nemiScale = 1.45;

  if (isHookScene) {
    const isAsking = frame >= fQuestion;
    nemiPose = isAsking ? "puzzled" : "shocked";
    nemiX = isAsking ? 240 : 880;
    nemiY = 1620;
    nemiScale = 1.5;
  } else if (isChallengeScene) {
    const isPointing = frame >= fPoint;
    nemiPose = isPointing ? "pointing" : "thinking";
    nemiX = 880;
    nemiY = 1620;
    nemiScale = 1.55;
    if (isPointing && frame < evGuess.end_frame + 8) {
      nemiSpeech = "That one! 👉";
      speechStartFrame = fPoint;
    }
  } else if (isFreezeScene) {
    const isOhActive = frame >= evOh.start_frame;
    nemiPose = "shocked";
    nemiX = 220;
    nemiY = 1620;
    nemiScale = 1.55;
    if (isOhActive && frame < evOh.end_frame + 8) {
      nemiSpeech = "Oh. 🤯";
      speechStartFrame = evOh.start_frame;
    }
  } else if (isDiscoveryScene || isRuleScene) {
    nemiPose = "explaining";
    nemiX = 180;
    nemiY = 1660;
    nemiScale = 1.35;
  } else if (isClimaxScene) {
    nemiPose = "smug";
    nemiX = 880;
    nemiY = 1640;
    nemiScale = 1.55;
    if (frame >= evBye.start_frame && frame < evBye.end_frame + 10) {
      nemiSpeech = "Bye. 👋🧹";
      speechStartFrame = evBye.start_frame;
    }
  } else if (isCompactScene) {
    nemiPose = "smug";
    nemiX = 880;
    nemiY = 1640;
    nemiScale = 1.4;
  } else if (isPayoffScene) {
    nemiPose = "aha";
    nemiX = 540;
    nemiY = 1580;
    nemiScale = 1.65;
    if (frame >= evBetter.start_frame) {
      nemiSpeech = "Much better! 😎✨";
      speechStartFrame = evBetter.start_frame;
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: "hidden", fontFamily: NEMI_THEME.typography.fontDisplay }}>

      {/* Dynamic Background Lighting & Grid */}
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
          BEAT 1 & 2 — THE MESS & THE PROBLEM (0.0–3.0s)
         ═══════════════════════════════════════════════════════════ */}
      {isHookScene && (() => {
        const isSurging = frame >= fRamSurge;
        const isAsking = frame >= fQuestion;
        const ramMB = Math.min(512, Math.floor(interpolate(frame, [0, evChallenge.start_frame], [18, 492], { extrapolateRight: "clamp" })));
        const titlePop = spring({ frame, fps, config: NEMI_THEME.springs.snappy });

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
                transform: `scale(${titlePop})`,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 18px",
                  borderRadius: 9999,
                  backgroundColor: isSurging ? "#FEE2E2" : "#FEF3C7",
                  color: isSurging ? "#EF4444" : "#B45309",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  marginBottom: 14,
                }}
              >
                {isAsking ? "THE RUNTIME DILEMMA" : isSurging ? "HEAP ALLOCATION SPIKE ⚠️" : "HEAP MEMORY"}
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
                {isAsking ? "So who cleans this up?" : "Your JavaScript keeps creating objects..."}
              </h1>

              {isSurging && !isAsking && (
                <div
                  style={{
                    marginTop: 12,
                    transform: `scale(${spring({ frame: frame - fRamSurge, fps, config: NEMI_THEME.springs.pop })})`,
                  }}
                >
                  <span style={{ fontSize: 62, fontWeight: 900, color: "#E11D48", letterSpacing: -2 }}>
                    A LOT of them. 💥
                  </span>
                </div>
              )}
            </div>

            {/* Cascading Memory Blocks Spawning Rapidly */}
            {!isAsking &&
              HOOK_OBJECTS.map((item, i) => {
                const local = frame - item.delay;
                if (local < 0) return null;
                const pop = spring({ frame: local, fps, config: { damping: 9, stiffness: 260, mass: 0.5 } });

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

            {/* Context Card during Question */}
            {isAsking && (
              <div
                style={{
                  position: "absolute",
                  top: 380,
                  left: 80,
                  right: 80,
                  padding: "32px 40px",
                  borderRadius: 24,
                  backgroundColor: "rgba(24, 24, 27, 0.06)",
                  border: "2px dashed rgba(0,0,0,0.14)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  transform: `scale(${spring({ frame: frame - fQuestion, fps, config: NEMI_THEME.springs.snappy })})`,
                  zIndex: 25,
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 800, color: "#64748B" }}>
                  Unlike C / C++ / Rust:
                </span>
                <span style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", fontFamily: NEMI_THEME.typography.fontCode }}>
                  JavaScript has no <span style={{ color: "#EF4444" }}>free()</span> or <span style={{ color: "#EF4444" }}>delete</span>
                </span>
              </div>
            )}

            {/* RAM Meter Gauge */}
            {!isAsking && (
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
                  <span style={{ fontSize: 24, fontWeight: 900, color: isSurging ? "#FB7185" : "#38BDF8", fontFamily: NEMI_THEME.typography.fontCode }}>
                    {ramMB} MB / 512 MB
                  </span>
                </div>
                <div style={{ width: "100%", height: 12, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(ramMB / 512) * 100}%`,
                      height: "100%",
                      borderRadius: 6,
                      backgroundColor: isSurging ? "#F43F5E" : "#06B6D4",
                      boxShadow: isSurging ? "0 0 15px #F43F5E" : "0 0 15px #06B6D4",
                    }}
                  />
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 3 & 4 — VIEWER CHALLENGE & NEMI GUESS (3.2–6.2s)
         ═══════════════════════════════════════════════════════════ */}
      {isChallengeScene && (() => {
        const isPointing = frame >= fPoint;
        const pop = spring({ frame: frame - evChallenge.start_frame, fps, config: NEMI_THEME.springs.pop });

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
                INTERACTIVE CHALLENGE
              </span>
              <h2 style={{ fontSize: 58, fontWeight: 900, color: "#F8FAFC", letterSpacing: -1.5, margin: 0 }}>
                Which one gets deleted?
              </h2>
            </div>

            {/* 3 Focused Challenge Cards for Instant Comprehension */}
            <div style={{ position: "absolute", top: 380, left: 60, right: 60, height: 750, zIndex: 20 }}>
              {CHALLENGE_CARDS.map((card) => {
                const isSelected = card.id === "hidden" && isPointing;

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
          BEAT 5 — THE REVERSAL & LASER LINK (6.2–7.8s)
         ═══════════════════════════════════════════════════════════ */}
      {isFreezeScene && (() => {
        const lineProgress = frame >= fLaser ? interpolate(frame, [fLaser, fLaser + 12], [0, 1], { extrapolateRight: "clamp" }) : 0;

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

              {/* Exact Laser SVG Connector */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 25 }}>
                {lineProgress > 0 && (
                  <>
                    <line
                      x1={250}
                      y1={240}
                      x2={250 + 400 * lineProgress}
                      y2={240 + 200 * lineProgress}
                      stroke={NEMI_THEME.colors.brand.emeraldGlow}
                      strokeWidth={5}
                      strokeDasharray="10 6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={250 + 400 * lineProgress}
                      cy={240 + 200 * lineProgress}
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
          BEAT 6 & 7 — CONTINUOUS CAMERA JOURNEY & RULE (7.8–13.5s)
         ═══════════════════════════════════════════════════════════ */}
      {(isDiscoveryScene || isRuleScene) && (() => {
        const isRuleActive = isRuleScene;

        return (
          <>
            <div style={{ position: "absolute", top: 160, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: isRuleActive ? "rgba(244, 63, 94, 0.2)" : "rgba(6, 182, 212, 0.2)",
                  color: isRuleActive ? NEMI_THEME.colors.brand.coralGlow : NEMI_THEME.colors.brand.cyanGlow,
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 12,
                }}
              >
                {isRuleActive ? "THE GOLDEN RULE OF GC" : "MARK-AND-SWEEP TRACE"}
              </span>
              <h2
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: isRuleActive ? NEMI_THEME.colors.brand.coralGlow : "#FFFFFF",
                  letterSpacing: -1.5,
                  margin: 0,
                }}
              >
                {isRuleActive ? "If it can't... it's garbage. 💥" : "V8 starts from roots & follows connections..."}
              </h2>
            </div>

            {/* Virtual Memory Canvas with Continuous Camera Transform */}
            <div
              style={{
                position: "absolute",
                top: 320,
                left: 40,
                right: 40,
                height: 950,
                transform: `scale(${cameraZoom}) translateY(${cameraPanY}px)`,
                transformOrigin: "center 30%",
                zIndex: 20,
              }}
            >
              {/* Connector SVG Lines */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}>
                {TREE_NODES.map((node) => {
                  const nodeTrigger = evDiscovery.start_frame + node.delayOffset;
                  const nodeActive = frame >= nodeTrigger;
                  const progress = nodeActive ? Math.min(1, (frame - nodeTrigger) / 6) : 0;
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
                  left: ROOT_NODE.x - 40 - ROOT_NODE.w / 2,
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
                const nodeTrigger = evDiscovery.start_frame + node.delayOffset;
                const isLit = frame >= nodeTrigger;
                const pop = isLit ? spring({ frame: frame - nodeTrigger, fps, config: NEMI_THEME.springs.snappy }) : 0;

                return (
                  <div
                    key={node.id}
                    style={{
                      position: "absolute",
                      left: node.x - 40 - node.w / 2,
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

              {/* Unreachable Orphan Region */}
              <div
                style={{
                  position: "absolute",
                  top: 700,
                  left: 40,
                  right: 40,
                  padding: "20px 28px",
                  borderRadius: 24,
                  backgroundColor: isRuleActive ? "rgba(244, 63, 94, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  border: `2px dashed ${isRuleActive ? NEMI_THEME.colors.brand.coral : "rgba(255, 255, 255, 0.1)"}`,
                  zIndex: 20,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: isRuleActive ? "#FB7185" : "#64748B", letterSpacing: 1.5 }}>
                    ISOLATED HEAP OBJECTS (0 ROOT LINKS)
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: isRuleActive ? "#FB7185" : "#64748B" }}>
                    {isRuleActive ? "MARKED FOR TRASH 🚨" : "UNREACHABLE"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 14, justifyContent: "space-between" }}>
                  {ORPHAN_OBJECTS.map((orphan) => (
                    <div
                      key={orphan.id}
                      style={{
                        flex: 1,
                        height: 76,
                        borderRadius: 16,
                        backgroundColor: isRuleActive ? "rgba(244, 63, 94, 0.25)" : "rgba(255, 255, 255, 0.05)",
                        border: `1.5px solid ${isRuleActive ? NEMI_THEME.colors.brand.coral : "rgba(255, 255, 255, 0.1)"}`,
                        boxShadow: isRuleActive ? "0 0 25px rgba(244, 63, 94, 0.35)" : "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 900, color: isRuleActive ? NEMI_THEME.colors.brand.coralGlow : "#94A3B8", fontFamily: NEMI_THEME.typography.fontCode }}>
                        {orphan.label}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: isRuleActive ? "#FB7185" : "#64748B" }}>
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
          BEAT 8 — RAPID CLEANUP CLIMAX (13.5–16.0s)
         ═══════════════════════════════════════════════════════════ */}
      {isClimaxScene && (() => {
        const local = frame - evBye.start_frame;

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
                SWEEP PHASE
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
              {ORPHAN_OBJECTS.map((orphan) => {
                const pop = Math.max(0, 1 - local / 12);
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
          BEAT 9 — MEMORY TRANSFORMATION & COMPACTION (16.0–18.5s)
         ═══════════════════════════════════════════════════════════ */}
      {isCompactScene && (() => {
        const local = frame - fCompactSnap;
        const snap = spring({ frame: local, fps, config: { damping: 12, stiffness: 200, mass: 0.7 } });
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
          BEAT 10 — FINAL PAYOFF & BRAND OUTRO (18.5–20.5s)
         ═══════════════════════════════════════════════════════════ */}
      {isPayoffScene && (() => {
        const local = frame - fPayoffSummary;
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

            {/* Clean Takeaway Card */}
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

      {/* Dynamic Speech Bubble */}
      {nemiSpeech && (
        <div
          style={{
            position: "absolute",
            left: isHookScene && nemiX > 500 ? undefined : isChallengeScene || isClimaxScene ? undefined : nemiX + 90,
            right: isHookScene && nemiX > 500 ? 100 : isChallengeScene || isClimaxScene ? 100 : undefined,
            top: nemiY - 220,
            zIndex: 45,
            padding: "16px 28px",
            borderRadius: nemiX > 500 ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
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
          AUDIO TRACKS (Master Audio + Sub Impacts)
         ═══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("sounds/nemi_v10_master_audio.mp3")} volume={1.0} />
      <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.25} />
      {frame >= evBye.start_frame && frame < evBye.start_frame + 25 && (
        <Audio src={staticFile("sounds/correct_chime.wav")} volume={0.3} playbackRate={1.2} />
      )}
    </AbsoluteFill>
  );
};
