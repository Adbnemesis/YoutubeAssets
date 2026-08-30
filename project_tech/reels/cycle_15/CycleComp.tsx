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
import timelineData from "./timeline.json";

export const theme = {
  colors: {
    canvasCream: "#FAF8F5",
    canvasDark: "#080C14",
    cardCream: "#FFFFFF",
    cardDark: "rgba(15, 23, 42, 0.94)",
    textDarkHeading: "#0F172A",
    textLightHeading: "#F8FAFC",
    textMutedCream: "#64748B",
    textMutedDark: "#94A3B8",
    cyan: "#06B6D4",
    cyanLight: "#67E8F9",
    amber: "#F59E0B",
    amberLight: "#FDE68A",
    green: "#10B981",
    red: "#EF4444",
    purple: "#A855F7",
    purpleLight: "#D8B4FE",
    pink: "#EC4899",
  },
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
};

// Graph Node Layout:
// Linear segment: Node 1 -> Node 2 -> Node 3 (entrance to loop)
// Circular loop: Node 3 (top) -> Node 4 (right) -> Node 5 (bottom) -> Node 6 (left) -> back to Node 3
const NODES = [
  { id: 1, val: "1", cx: 160, cy: 500, inLoop: false },
  { id: 2, val: "2", cx: 380, cy: 500, inLoop: false },
  { id: 3, val: "3", cx: 650, cy: 500, inLoop: true },
  { id: 4, val: "4", cx: 840, cy: 690, inLoop: true },
  { id: 5, val: "5", cx: 650, cy: 880, inLoop: true },
  { id: 6, val: "6", cx: 460, cy: 690, inLoop: true },
];

export const CycleComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = timelineData.total_frames || 844;

  // ─── Timeline Boundaries ───
  // c01_hook: 0 - 125
  // c02_nemi: 126 - 222
  // c03_memory_trap: 223 - 394
  // c04_tortoise_hare: 395 - 559
  // c05_chase_collision: 560 - 738
  // c06_nemi_payoff: 739 - 844

  const isHook = frame < 126;
  const isNemiQuestion = frame >= 126 && frame < 223;
  const isMemoryTrap = frame >= 223 && frame < 395;
  const isPointerIntro = frame >= 395 && frame < 560;
  const isChaseStage = frame >= 560 && frame < 739;
  const isCollisionStage = frame >= 680 && frame < 739;
  const isPayoffStage = frame >= 739;

  // ─── White/Cream to Cyber Dark Canvas Interpolation ───
  // Frame 0-115: Pure Clean Cream (#FAF8F5)
  // Frame 115-135: Smooth crossfade to Cyber Dark (#080C14)
  // Frame 739-770: Smooth crossfade back to Warm Cream for celebratory outro
  const darkProgress = interpolate(
    frame,
    [115, 135, 745, 775],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const bgColor = darkProgress > 0.5 ? theme.colors.canvasDark : theme.colors.canvasCream;
  const isDarkCanvas = darkProgress > 0.5;

  // ─── Global Subtle Camera Breathing ───
  const cameraScale = interpolate(
    frame,
    [0, 126, 223, 395, 560, 680, 739, totalFrames],
    [1.0, 1.02, 1.01, 1.03, 1.04, 1.06, 1.02, 1.0],
    { extrapolateRight: "clamp" }
  );

  // ─── Mascot Pose & Speech Bubble ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (isHook) {
    nemiPose = "thinking";
  } else if (isNemiQuestion) {
    nemiPose = "puzzled";
    nemiSpeech = "Can't we just store visited nodes in a Hash Set?";
  } else if (isMemoryTrap) {
    nemiPose = "shocked";
  } else if (isPointerIntro) {
    nemiPose = "explaining";
  } else if (isChaseStage) {
    nemiPose = isCollisionStage ? "smug" : "pointing";
  } else if (isPayoffStage) {
    nemiPose = "aha";
    nemiSpeech = "Zero extra RAM and O(N) time!";
  }

  // ─── Active Subtitle & Karaoke Words ───
  const currentSubtitle = timelineData.subtitles.find(
    (s) => frame >= s.start_frame && frame <= s.end_frame
  );

  // ─── Turn Simulation for Tortoise & Hare ───
  // c04 (f: 395-559): Tortoise & Hare spawn at [1]
  // c05 (f: 560-738):
  //   Step 1 (f: 560-610): Slow at [2], Fast at [3]
  //   Step 2 (f: 610-660): Slow at [3], Fast at [5]
  //   Step 3 (f: 660-738): Slow at [4], Fast loops to [4] -> COLLISION!
  let slowNodeId = 1;
  let fastNodeId = 1;
  let turnStatusText = "Pointers initialized at Node [1]";

  if (frame < 395) {
    slowNodeId = 1;
    fastNodeId = 1;
  } else if (frame >= 395 && frame < 560) {
    slowNodeId = 1;
    fastNodeId = 1;
    turnStatusText = "🐢 Slow (+1/step)  |  🐇 Fast (+2/step)";
  } else if (frame >= 560 && frame < 610) {
    const p = spring({ frame: frame - 560, fps, config: { damping: 14 } });
    slowNodeId = p > 0.5 ? 2 : 1;
    fastNodeId = p > 0.5 ? 3 : 1;
    turnStatusText = "Turn 1: Slow at [2]  |  Fast leaps to [3] ⚡";
  } else if (frame >= 610 && frame < 660) {
    const p = spring({ frame: frame - 610, fps, config: { damping: 14 } });
    slowNodeId = p > 0.5 ? 3 : 2;
    fastNodeId = p > 0.5 ? 5 : 3;
    turnStatusText = "Turn 2: Slow enters [3]  |  Fast leaps to [5] ⚡";
  } else if (frame >= 660) {
    const p = spring({ frame: frame - 660, fps, config: { damping: 14 } });
    slowNodeId = p > 0.5 ? 4 : 3;
    fastNodeId = p > 0.5 ? 4 : 5;
    turnStatusText = "Turn 3: Slow moves to [4]  |  Fast loops to [4] 💥";
  }

  const slowNode = NODES.find((n) => n.id === slowNodeId) || NODES[0];
  const fastNode = NODES.find((n) => n.id === fastNodeId) || NODES[0];

  // Moving animated dash offset for continuous living energy along the wires
  const flowOffset = -(frame * 5) % 24;

  // Collision Shockwave Trigger (f: 680 to 686 - quick tactile white flash)
  const collisionImpact =
    frame >= 680 && frame < 686
      ? interpolate(frame, [680, 682, 686], [0, 0.7, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        fontFamily: theme.fonts.sans,
        color: isDarkCanvas ? theme.colors.textLightHeading : theme.colors.textDarkHeading,
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
        transformOrigin: "center center",
      }}
    >
      {/* ─── AUDIO ENGINE ─── */}
      <Audio src={staticFile("reels/cycle_15/voiceover.mp3")} volume={1.0} />
      <Audio
        src={staticFile("bgm/Synthwave Goose - Blade Runner 2049.mp3")}
        volume={0.16}
        loop
      />

      {/* SFX Tracks */}
      <Sequence from={0} durationInFrames={25}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={126} durationInFrames={25}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={223} durationInFrames={30}>
        <Audio src={staticFile("sfx/error.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={395} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={560} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={610} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={680} durationInFrames={40}>
        <Audio src={staticFile("sfx/anime-wow.mp3")} volume={0.75} />
      </Sequence>
      <Sequence from={739} durationInFrames={40}>
        <Audio src={staticFile("sfx/chime.mp3")} volume={0.6} />
      </Sequence>

      {/* ─── AMBIENT BACKGROUND GLOW (ACTIVE IN DARK MODE) ─── */}
      {isDarkCanvas && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 50% 15%, rgba(6, 182, 212, 0.18), transparent 50%),
              radial-gradient(circle at 75% 65%, rgba(168, 85, 247, 0.15), transparent 45%),
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 100% 100%, 60px 60px, 60px 60px",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ─── TOP HUD: LEETCODE BADGE (top: 85px) ─── */}
      <div
        style={{
          position: "absolute",
          top: "85px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: isDarkCanvas ? theme.colors.cardDark : "#FFFFFF",
          border: `1.5px solid ${isDarkCanvas ? "rgba(255, 255, 255, 0.15)" : "#E2E8F0"}`,
          borderRadius: "999px",
          padding: "8px 22px",
          boxShadow: isDarkCanvas
            ? "0 8px 30px rgba(0,0,0,0.5)"
            : "0 8px 24px rgba(0,0,0,0.06)",
          zIndex: 40,
        }}
      >
        <div
          style={{
            backgroundColor: "#FFA116",
            color: "#000000",
            fontSize: "14px",
            fontWeight: 900,
            padding: "2px 8px",
            borderRadius: "6px",
            letterSpacing: "0.5px",
          }}
        >
          LeetCode #141
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 800,
            color: isDarkCanvas ? "#F8FAFC" : "#0F172A",
          }}
        >
          Linked List Cycle Detection
        </div>
      </div>

      {/* ─── MAIN HEADLINE (top: 165px) ─── */}
      {isHook && (
        <div
          style={{
            position: "absolute",
            top: "165px",
            left: "60px",
            right: "60px",
            textAlign: "center",
            zIndex: 35,
          }}
        >
          <div
            style={{
              fontSize: "15px",
              fontWeight: 900,
              letterSpacing: "2.5px",
              color: "#0284C7",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Algorithm Mystery
          </div>
          <h1
            style={{
              fontSize: "46px",
              fontWeight: 900,
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-1.5px",
              color: "#0F172A",
              textTransform: "uppercase",
            }}
          >
            Detect An Infinite Loop In{" "}
            <span style={{ color: "#0284C7" }}>O(1) Space?</span>
          </h1>
        </div>
      )}

      {/* ─── SCENE 2 & 3: MEMORY TRAP / RAM CRASH (f: 223 - 395) ─── */}
      {isMemoryTrap && (
        <div
          style={{
            position: "absolute",
            top: "165px",
            left: "60px",
            right: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 35,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "2px solid #EF4444",
              borderRadius: "16px",
              padding: "10px 22px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontSize: "24px" }}>⚠️</span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: theme.colors.red,
                letterSpacing: "-0.3px",
              }}
            >
              Hash Set = O(N) Memory Trap
            </span>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "580px",
              backgroundColor: theme.colors.cardDark,
              border: "2px solid #334155",
              borderRadius: "20px",
              padding: "20px 24px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "17px",
                fontWeight: 800,
              }}
            >
              <span>Visited Nodes Hash Table</span>
              <span
                style={{
                  color: frame > 290 ? theme.colors.red : theme.colors.amber,
                  fontWeight: 900,
                }}
              >
                {frame > 290 ? "8.4 GB (CRASH!)" : "2.1 GB"}
              </span>
            </div>

            {/* RAM Progress Bar */}
            <div
              style={{
                width: "100%",
                height: "26px",
                backgroundColor: "#1E293B",
                borderRadius: "999px",
                overflow: "hidden",
                border: "1px solid #475569",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: frame > 290 ? "100%" : "65%",
                  backgroundColor: frame > 290 ? theme.colors.red : theme.colors.amber,
                  transition: "all 0.3s ease",
                  boxShadow:
                    frame > 290
                      ? "0 0 24px rgba(239, 68, 68, 0.9)"
                      : "0 0 12px rgba(245, 158, 11, 0.6)",
                }}
              />
            </div>

            {frame > 290 && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "10px",
                  backgroundColor: "rgba(239, 68, 68, 0.25)",
                  borderRadius: "10px",
                  border: "1px solid #EF4444",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: 900,
                  color: "#FCA5A5",
                }}
              >
                ❌ MEMORY LIMIT EXCEEDED (1B Nodes)
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SCENE 4: FLOYD POINTER HEADER (f: 395 - 680) ─── */}
      {(isPointerIntro || (isChaseStage && !isCollisionStage)) && (
        <div
          style={{
            position: "absolute",
            top: "165px",
            left: "50px",
            right: "50px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            zIndex: 35,
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            {/* Tortoise Card */}
            <div
              style={{
                flex: 1,
                backgroundColor: "rgba(6, 182, 212, 0.15)",
                border: `2px solid ${theme.colors.cyan}`,
                borderRadius: "16px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 8px 24px rgba(6, 182, 212, 0.25)",
              }}
            >
              <span style={{ fontSize: "32px" }}>🐢</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: theme.colors.cyanLight }}>
                  SLOW POINTER
                </div>
                <div style={{ fontSize: "19px", fontWeight: 900, color: "#FFF" }}>
                  +1 Step / Turn
                </div>
              </div>
            </div>

            {/* Hare Card */}
            <div
              style={{
                flex: 1,
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                border: `2px solid ${theme.colors.amber}`,
                borderRadius: "16px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 8px 24px rgba(245, 158, 11, 0.25)",
              }}
            >
              <span style={{ fontSize: "32px" }}>🐇</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: theme.colors.amberLight }}>
                  FAST POINTER
                </div>
                <div style={{ fontSize: "19px", fontWeight: 900, color: "#FFF" }}>
                  +2 Steps / Turn
                </div>
              </div>
            </div>
          </div>

          {/* Turn Tracker */}
          <div
            style={{
              backgroundColor: theme.colors.cardDark,
              border: "1.5px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "10px 18px",
              textAlign: "center",
              fontSize: "17px",
              fontWeight: 800,
              color: "#E2E8F0",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            {turnStatusText}
          </div>
        </div>
      )}

      {/* ─── SCENE 5: COLLISION BANNER (f: 680 - 739) ─── */}
      {isCollisionStage && (
        <div
          style={{
            position: "absolute",
            top: "165px",
            left: "50px",
            right: "50px",
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            border: `2.5px solid ${theme.colors.amber}`,
            borderRadius: "24px",
            padding: "20px 28px",
            boxShadow: "0 20px 50px rgba(245, 158, 11, 0.4)",
            textAlign: "center",
            zIndex: 35,
          }}
        >
          <div
            style={{
              fontSize: "30px",
              fontWeight: 900,
              color: theme.colors.amberLight,
              letterSpacing: "-0.5px",
              marginBottom: "6px",
            }}
          >
            💥 COLLISION AT NODE [4]!
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#E2E8F0",
              lineHeight: 1.4,
            }}
          >
            Relative Speed: <span style={{ color: theme.colors.cyanLight }}>2 - 1 = 1 node/turn</span>.
            <br />
            The fast pointer <span style={{ color: theme.colors.amber }}>always catches</span> the slow pointer inside the loop!
          </div>
        </div>
      )}

      {/* ─── SCENE 6: VICTORY SCORECARD (f >= 739) ─── */}
      {isPayoffStage && (
        <div
          style={{
            position: "absolute",
            top: "165px",
            left: "50px",
            right: "50px",
            backgroundColor: "#FFFFFF",
            border: "2px solid #10B981",
            borderRadius: "24px",
            padding: "24px 30px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
            zIndex: 35,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontSize: "28px" }}>🏆</span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 900,
                color: "#059669",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Floyd's Algorithm Victory
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* Time Card */}
            <div
              style={{
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                border: "1.5px solid #06B6D4",
                borderRadius: "16px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748B" }}>
                TIME COMPLEXITY
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#0891B2" }}>
                O(N) ⚡
              </div>
            </div>

            {/* Space Card */}
            <div
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1.5px solid #10B981",
                borderRadius: "16px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748B" }}>
                SPACE COMPLEXITY
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#059669" }}>
                O(1) 🧠
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DYNAMIC LINKED LIST GRAPH (CENTER STAGE) ─── */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "1080px",
          height: "1920px",
          zIndex: 10,
        }}
      >
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill={theme.colors.cyan} />
            </marker>

            <marker
              id="arrow-purple"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill={theme.colors.purple} />
            </marker>

            <marker
              id="arrow-pink"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill={theme.colors.pink} />
            </marker>
          </defs>

          {/* Linear Edge 1 -> 2 with moving energy dashes */}
          <line
            x1={NODES[0].cx + 42}
            y1={NODES[0].cy}
            x2={NODES[1].cx - 48}
            y2={NODES[1].cy}
            stroke={theme.colors.cyan}
            strokeWidth="5"
            strokeDasharray="8 6"
            strokeDashoffset={flowOffset}
            markerEnd="url(#arrow-cyan)"
          />

          {/* Linear Edge 2 -> 3 */}
          <line
            x1={NODES[1].cx + 42}
            y1={NODES[1].cy}
            x2={NODES[2].cx - 48}
            y2={NODES[2].cy}
            stroke={theme.colors.cyan}
            strokeWidth="5"
            strokeDasharray="8 6"
            strokeDashoffset={flowOffset}
            markerEnd="url(#arrow-cyan)"
          />

          {/* Circular Loop: 3 -> 4 */}
          <path
            d={`M ${NODES[2].cx + 35} ${NODES[2].cy + 25} A 190 190 0 0 1 ${NODES[3].cx - 20} ${NODES[3].cy - 35}`}
            fill="none"
            stroke={theme.colors.purple}
            strokeWidth="6"
            strokeDasharray="10 6"
            strokeDashoffset={flowOffset}
            markerEnd="url(#arrow-purple)"
          />

          {/* Circular Loop: 4 -> 5 */}
          <path
            d={`M ${NODES[3].cx - 25} ${NODES[3].cy + 35} A 190 190 0 0 1 ${NODES[4].cx + 35} ${NODES[4].cy - 20}`}
            fill="none"
            stroke={theme.colors.purple}
            strokeWidth="6"
            strokeDasharray="10 6"
            strokeDashoffset={flowOffset}
            markerEnd="url(#arrow-purple)"
          />

          {/* Circular Loop: 5 -> 6 */}
          <path
            d={`M ${NODES[4].cx - 35} ${NODES[4].cy - 20} A 190 190 0 0 1 ${NODES[5].cx + 25} ${NODES[5].cy + 35}`}
            fill="none"
            stroke={theme.colors.purple}
            strokeWidth="6"
            strokeDasharray="10 6"
            strokeDashoffset={flowOffset}
            markerEnd="url(#arrow-purple)"
          />

          {/* Circular Loop: 6 -> 3 (Return loop back to entrance) */}
          <path
            d={`M ${NODES[5].cx + 20} ${NODES[5].cy - 35} A 190 190 0 0 1 ${NODES[2].cx - 35} ${NODES[2].cy + 20}`}
            fill="none"
            stroke={theme.colors.pink}
            strokeWidth="6"
            strokeDasharray="8 6"
            strokeDashoffset={flowOffset * 1.5}
            markerEnd="url(#arrow-pink)"
          />
        </svg>

        {/* Loop Center Glow Badge */}
        <div
          style={{
            position: "absolute",
            left: "650px",
            top: "690px",
            transform: "translate(-50%, -50%)",
            backgroundColor: isDarkCanvas ? "rgba(168, 85, 247, 0.15)" : "rgba(168, 85, 247, 0.1)",
            border: "1.5px dashed #A855F7",
            borderRadius: "999px",
            padding: "8px 18px",
            fontSize: "15px",
            fontWeight: 900,
            color: isDarkCanvas ? "#D8B4FE" : "#7E22CE",
            letterSpacing: "0.5px",
          }}
        >
          🔄 INFINITE CYCLE
        </div>

        {/* Nodes */}
        {NODES.map((node) => {
          const isSlowHere = slowNodeId === node.id && frame >= 395;
          const isFastHere = fastNodeId === node.id && frame >= 395;
          const isCollisionNode = node.id === 4 && isCollisionStage;

          return (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: `${node.cx}px`,
                top: `${node.cy}px`,
                transform: "translate(-50%, -50%)",
                width: "82px",
                height: "82px",
                borderRadius: "50%",
                backgroundColor: isCollisionNode
                  ? "rgba(245, 158, 11, 0.3)"
                  : isDarkCanvas
                  ? theme.colors.nodeBg
                  : "#FFFFFF",
                border: isCollisionNode
                  ? `4.5px solid ${theme.colors.amber}`
                  : `4px solid ${node.inLoop ? theme.colors.purple : theme.colors.nodeBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: 900,
                color: isDarkCanvas ? "#FFFFFF" : "#0F172A",
                boxShadow: isCollisionNode
                  ? "0 0 45px rgba(245, 158, 11, 0.95)"
                  : node.inLoop
                  ? "0 0 25px rgba(168, 85, 247, 0.35)"
                  : "0 0 20px rgba(56, 189, 248, 0.35)",
                transition: "all 0.2s ease",
              }}
            >
              {node.val}
            </div>
          );
        })}

        {/* Animated Pointers */}
        {frame >= 395 && !isPayoffStage && (
          <>
            {/* Slow Pointer Badge */}
            <div
              style={{
                position: "absolute",
                left: `${slowNode.cx}px`,
                top: `${slowNode.cy - 68}px`,
                transform: "translate(-50%, -50%)",
                backgroundColor: theme.colors.cyan,
                color: "#000",
                fontSize: "20px",
                fontWeight: 900,
                padding: "4px 12px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 6px 20px rgba(6, 182, 212, 0.7)",
                zIndex: 30,
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <span style={{ fontSize: "22px" }}>🐢</span>
              <span>Slow</span>
            </div>

            {/* Fast Pointer Badge */}
            <div
              style={{
                position: "absolute",
                left: `${fastNode.cx}px`,
                top: `${fastNode.cy + 68}px`,
                transform: "translate(-50%, -50%)",
                backgroundColor: theme.colors.amber,
                color: "#000",
                fontSize: "20px",
                fontWeight: 900,
                padding: "4px 12px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 6px 20px rgba(245, 158, 11, 0.7)",
                zIndex: 30,
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <span style={{ fontSize: "22px" }}>🐇</span>
              <span>Fast</span>
            </div>
          </>
        )}
      </div>

      {/* ─── DYNAMIC VIRAL KARAOKE CAPTIONS (top: 1120px) ─── */}
      {!nemiSpeech && currentSubtitle && (
        <div
          style={{
            position: "absolute",
            top: "1120px",
            left: "60px",
            right: "60px",
            display: "flex",
            justifyContent: "center",
            zIndex: 45,
          }}
        >
          <div
            style={{
              backgroundColor: isDarkCanvas ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(16px)",
              border: `1.5px solid ${isDarkCanvas ? "rgba(255, 255, 255, 0.15)" : "#E2E8F0"}`,
              borderRadius: "20px",
              padding: "14px 28px",
              boxShadow: isDarkCanvas
                ? "0 12px 36px rgba(0,0,0,0.5)"
                : "0 10px 30px rgba(0,0,0,0.08)",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {currentSubtitle.words.map((w: any, idx: number) => {
              const isWordActive = frame >= w.start_frame && frame <= w.end_frame;
              return (
                <span
                  key={idx}
                  style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: isWordActive
                      ? theme.colors.amber
                      : isDarkCanvas
                      ? "#F8FAFC"
                      : "#0F172A",
                    transform: isWordActive ? "scale(1.16)" : "scale(1.0)",
                    display: "inline-block",
                    transition: "transform 0.1s ease, color 0.1s ease",
                    textShadow: isWordActive
                      ? `0 0 16px ${theme.colors.amber}`
                      : "none",
                  }}
                >
                  {w.word}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── NEMI FLOATING SPEECH BUBBLE (bottom: 380px) ─── */}
      {nemiSpeech && (
        <div
          style={{
            position: "absolute",
            bottom: "380px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#FFD166",
            color: "#0F172A",
            borderRadius: "24px",
            padding: "18px 28px",
            maxWidth: "620px",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: 900,
            lineHeight: 1.3,
            boxShadow: "0 12px 35px rgba(255, 209, 102, 0.4)",
            zIndex: 50,
          }}
        >
          {nemiSpeech}
          {/* Speech Bubble Arrow pointing down to Nemi */}
          <div
            style={{
              position: "absolute",
              bottom: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "14px solid #FFD166",
            }}
          />
        </div>
      )}

      {/* ─── DEDICATED BOTTOM-CENTER MASCOT DOCK (bottom: 50px) ─── */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          left: "50%",
          transform: "translateX(-50%) scale(1.4)",
          transformOrigin: "bottom center",
          zIndex: 45,
        }}
      >
        <NemiMascot pose={nemiPose} />
      </div>

      {/* ─── CHANNEL WATERMARK (bottom: 40px, right: 40px) ─── */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          fontSize: "14px",
          fontWeight: 800,
          color: isDarkCanvas ? "rgba(255, 255, 255, 0.3)" : "rgba(15, 23, 42, 0.3)",
          letterSpacing: "0.5px",
          zIndex: 40,
        }}
      >
        @nemi.explains
      </div>

      {/* ─── COLLISION FLASH OVERLAY ─── */}
      {collisionImpact > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFFFFF",
            opacity: collisionImpact * 0.7,
            pointerEvents: "none",
            zIndex: 99,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
