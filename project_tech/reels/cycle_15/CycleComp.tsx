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
    bgDark: "#080C14",
    bgCard: "rgba(15, 23, 42, 0.92)",
    borderDark: "rgba(255, 255, 255, 0.12)",
    cyan: "#06B6D4",
    cyanLight: "#67E8F9",
    amber: "#F59E0B",
    amberLight: "#FDE68A",
    green: "#10B981",
    red: "#EF4444",
    purple: "#A855F7",
    purpleLight: "#D8B4FE",
    pink: "#EC4899",
    textPrimary: "#F8FAFC",
    textMuted: "#94A3B8",
    nodeBorder: "#38BDF8",
    nodeBg: "#0F172A",
  },
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
};

// Symmetrical Circle Coordinates
// Loop Center: (640, 720), Radius = 190
// 1: Linear (140, 530)
// 2: Linear (360, 530)
// 3: Loop Top (640, 530)
// 4: Loop Right (830, 720)
// 5: Loop Bottom (640, 910)
// 6: Loop Left (450, 720)
const NODES = [
  { id: 1, val: "1", cx: 150, cy: 530, inLoop: false },
  { id: 2, val: "2", cx: 370, cy: 530, inLoop: false },
  { id: 3, val: "3", cx: 640, cy: 530, inLoop: true },
  { id: 4, val: "4", cx: 830, cy: 720, inLoop: true },
  { id: 5, val: "5", cx: 640, cy: 910, inLoop: true },
  { id: 6, val: "6", cx: 450, cy: 720, inLoop: true },
];

export const CycleComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Stage Flags ───
  const isHook = frame >= 0 && frame < 143;
  const isHashSetStage = frame >= 143 && frame < 433;
  const isPointerIntro = frame >= 433 && frame < 545;
  const isChaseStage = frame >= 545 && frame < 713;
  const isCollisionStage = frame >= 713 && frame < 921;
  const isPayoffStage = frame >= 921;

  // ─── Dynamic Mascot Pose ───
  let nemiPose: NemiPose = "thinking";
  if (isHook) nemiPose = "puzzled";
  else if (isHashSetStage) nemiPose = frame < 280 ? "explaining" : "shocked";
  else if (isPointerIntro) nemiPose = "thinking";
  else if (isChaseStage) nemiPose = "pointing";
  else if (isCollisionStage) nemiPose = "smug";
  else if (isPayoffStage) nemiPose = "aha";

  // ─── Active Subtitle ───
  const currentSubtitle = timelineData.subtitles.find(
    (s) => frame >= s.start_frame && frame <= s.end_frame
  );

  // ─── Turn Simulation ───
  let slowNodeId = 1;
  let fastNodeId = 1;
  let turnText = "Turn 0: Both pointers start at head [1]";

  if (frame >= 433 && frame < 545) {
    slowNodeId = 1;
    fastNodeId = 1;
    turnText = "Ready: Slow (+1) & Fast (+2) at Node [1]";
  } else if (frame >= 545 && frame < 600) {
    const t = spring({ frame: frame - 545, fps, config: { damping: 14 } });
    slowNodeId = t > 0.5 ? 2 : 1;
    fastNodeId = t > 0.5 ? 3 : 1;
    turnText = "Turn 1: Slow at [2]  |  Fast leaps to [3] ⚡";
  } else if (frame >= 600 && frame < 655) {
    const t = spring({ frame: frame - 600, fps, config: { damping: 14 } });
    slowNodeId = t > 0.5 ? 3 : 2;
    fastNodeId = t > 0.5 ? 5 : 3;
    turnText = "Turn 2: Slow enters [3]  |  Fast leaps to [5] ⚡";
  } else if (frame >= 655) {
    const t = spring({ frame: frame - 655, fps, config: { damping: 14 } });
    slowNodeId = t > 0.5 ? 4 : 3;
    fastNodeId = t > 0.5 ? 4 : 5;
    turnText = "Turn 3: Slow moves to [4]  |  Fast loops to [4] 💥";
  }

  // ─── Smooth Pointer Positions Interpolation ───
  const getPointerCoord = (nodeId: number) => {
    const node = NODES.find((n) => n.id === nodeId) || NODES[0];
    return { x: node.cx, y: node.cy };
  };

  const slowPos = getPointerCoord(slowNodeId);
  const fastPos = getPointerCoord(fastNodeId);

  // Quick 4-frame collision flash
  const collisionFlash =
    frame >= 713 && frame < 722
      ? interpolate(frame, [713, 715, 722], [0, 0.7, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bgDark,
        fontFamily: theme.fonts.sans,
        color: theme.colors.textPrimary,
        overflow: "hidden",
      }}
    >
      {/* ─── AUDIO ENGINE ─── */}
      <Audio src={staticFile("reels/cycle_15/voiceover.mp3")} volume={1.0} />
      <Audio
        src={staticFile("bgm/Synthwave Goose - Blade Runner 2049.mp3")}
        volume={0.12}
        loop
      />

      {/* SFX Cues */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={280} durationInFrames={30}>
        <Audio src={staticFile("sfx/error.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={433} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={545} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={600} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={713} durationInFrames={40}>
        <Audio src={staticFile("sfx/anime-wow.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={921} durationInFrames={40}>
        <Audio src={staticFile("sfx/chime.mp3")} volume={0.6} />
      </Sequence>

      {/* ─── AMBIENT GRID & NEON BACKGROUND ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 15%, rgba(6, 182, 212, 0.15), transparent 50%),
            radial-gradient(circle at 75% 65%, rgba(168, 85, 247, 0.15), transparent 45%),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 60px 60px, 60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* ─── HEADER BAR: LEETCODE BADGE ─── */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: theme.colors.bgCard,
          backdropFilter: "blur(16px)",
          border: `1.5px solid ${theme.colors.borderDark}`,
          borderRadius: "999px",
          padding: "10px 24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          zIndex: 40,
        }}
      >
        <div
          style={{
            backgroundColor: "#FFA116",
            color: "#000",
            fontSize: "15px",
            fontWeight: 900,
            padding: "3px 10px",
            borderRadius: "6px",
            letterSpacing: "0.5px",
          }}
        >
          LeetCode #141
        </div>
        <div
          style={{
            fontSize: "17px",
            fontWeight: 800,
            color: "#E2E8F0",
            letterSpacing: "0.2px",
          }}
        >
          Linked List Cycle Detection
        </div>
      </div>

      {/* ─── SCENE 1: HOOK (f: 0 - 143) ─── */}
      {isHook && (
        <div
          style={{
            position: "absolute",
            top: "160px",
            left: "60px",
            right: "60px",
            textAlign: "center",
            zIndex: 35,
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: theme.colors.cyanLight,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Algorithm Puzzle
          </div>
          <h1
            style={{
              fontSize: "44px",
              fontWeight: 900,
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-1px",
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            How To Detect An Infinite Loop In{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #06B6D4 0%, #38BDF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              O(1) Space?
            </span>
          </h1>
        </div>
      )}

      {/* ─── SCENE 2: HASHSET MEMORY EXPLOSION (f: 143 - 433) ─── */}
      {isHashSetStage && (
        <div
          style={{
            position: "absolute",
            top: "160px",
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
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              border: "1.5px solid rgba(239, 68, 68, 0.5)",
              borderRadius: "16px",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontSize: "24px" }}>⚠️</span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: theme.colors.red,
                letterSpacing: "-0.3px",
              }}
            >
              Brute Force Hash Set = O(N) RAM
            </span>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "580px",
              backgroundColor: theme.colors.bgCard,
              border: "2px solid #334155",
              borderRadius: "20px",
              padding: "20px 24px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "17px",
                fontWeight: 700,
              }}
            >
              <span>Visited Nodes Hash Table</span>
              <span
                style={{
                  color: frame > 280 ? theme.colors.red : theme.colors.amber,
                  fontWeight: 900,
                }}
              >
                {frame > 280 ? "8.4 GB (CRASH!)" : "2.1 GB"}
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
                  width: frame > 280 ? "100%" : "65%",
                  backgroundColor: frame > 280 ? theme.colors.red : theme.colors.amber,
                  transition: "all 0.3s ease",
                  boxShadow:
                    frame > 280
                      ? "0 0 24px rgba(239, 68, 68, 0.9)"
                      : "0 0 12px rgba(245, 158, 11, 0.6)",
                }}
              />
            </div>

            {frame > 280 && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "10px",
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  borderRadius: "10px",
                  border: "1px solid #EF4444",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#FCA5A5",
                }}
              >
                ❌ MEMORY LIMIT EXCEEDED (MLE)
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SCENE 3 & 4: FLOYD POINTER HEADER (f: 433 - 713) ─── */}
      {(isPointerIntro || isChaseStage) && (
        <div
          style={{
            position: "absolute",
            top: "160px",
            left: "50px",
            right: "50px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            zIndex: 35,
          }}
        >
          {/* Two Pointer Badges */}
          <div style={{ display: "flex", gap: "16px" }}>
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
                boxShadow: "0 8px 24px rgba(6, 182, 212, 0.2)",
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
                boxShadow: "0 8px 24px rgba(245, 158, 11, 0.2)",
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

          {/* Turn Tracker Banner */}
          {isChaseStage && (
            <div
              style={{
                backgroundColor: theme.colors.bgCard,
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
              {turnText}
            </div>
          )}
        </div>
      )}

      {/* ─── SCENE 5: COLLISION BANNER (f: 713 - 921) ─── */}
      {isCollisionStage && (
        <div
          style={{
            position: "absolute",
            top: "160px",
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
              marginBottom: "8px",
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

      {/* ─── SCENE 6: VICTORY SCORECARD (f >= 921) ─── */}
      {isPayoffStage && (
        <div
          style={{
            position: "absolute",
            top: "155px",
            left: "50px",
            right: "50px",
            backgroundColor: "rgba(15, 23, 42, 0.96)",
            border: "2px solid rgba(16, 185, 129, 0.6)",
            borderRadius: "24px",
            padding: "24px 30px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
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
                color: theme.colors.green,
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
              marginBottom: "16px",
            }}
          >
            {/* Time Card */}
            <div
              style={{
                backgroundColor: "rgba(6, 182, 212, 0.12)",
                border: `1.5px solid ${theme.colors.cyan}`,
                borderRadius: "16px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: 800, color: theme.colors.textMuted }}>
                TIME COMPLEXITY
              </div>
              <div style={{ fontSize: "30px", fontWeight: 900, color: theme.colors.cyan }}>
                O(N) ⚡
              </div>
            </div>

            {/* Space Card */}
            <div
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                border: `1.5px solid ${theme.colors.green}`,
                borderRadius: "16px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: 800, color: theme.colors.textMuted }}>
                SPACE COMPLEXITY
              </div>
              <div style={{ fontSize: "30px", fontWeight: 900, color: theme.colors.green }}>
                O(1) 🧠
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "16px",
              fontWeight: 700,
              color: "#CBD5E1",
            }}
          >
            Zero extra memory • Guaranteed cycle detection!
          </div>
        </div>
      )}

      {/* ─── PHASE 6: PYTHON CODE SNIPPET (f >= 921) ─── */}
      {isPayoffStage && (
        <div
          style={{
            position: "absolute",
            top: "1060px",
            left: "60px",
            right: "60px",
            backgroundColor: "rgba(10, 15, 26, 0.95)",
            border: "1.5px solid rgba(6, 182, 212, 0.4)",
            borderRadius: "20px",
            padding: "20px 24px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            fontFamily: theme.fonts.mono,
            zIndex: 35,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "8px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 800, color: theme.colors.cyanLight }}>
              python • solution.py
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#F59E0B" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10B981" }} />
            </div>
          </div>

          <div style={{ fontSize: "18px", lineHeight: "1.6", color: "#E2E8F0" }}>
            <div><span style={{ color: "#F43F5E" }}>def</span> <span style={{ color: "#67E8F9" }}>hasCycle</span>(head):</div>
            <div style={{ paddingLeft: "24px" }}>slow = fast = head</div>
            <div style={{ paddingLeft: "24px" }}><span style={{ color: "#F43F5E" }}>while</span> fast <span style={{ color: "#F43F5E" }}>and</span> fast.next:</div>
            <div style={{ paddingLeft: "48px" }}>slow = slow.next <span style={{ color: "#94A3B8" }}># 🐢 +1</span></div>
            <div style={{ paddingLeft: "48px" }}>fast = fast.next.next <span style={{ color: "#94A3B8" }}># 🐇 +2</span></div>
            <div style={{ paddingLeft: "48px" }}><span style={{ color: "#F43F5E" }}>if</span> slow == fast:</div>
            <div style={{ paddingLeft: "72px", color: "#34D399", fontWeight: 700 }}><span style={{ color: "#F43F5E" }}>return</span> True <span style={{ color: "#94A3B8" }}># 🎯 Cycle Found!</span></div>
          </div>
        </div>
      )}

      {/* ─── LINKED LIST GRAPH (CENTER STAGE) ─── */}
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
            {/* Cyan Arrowhead */}
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

            {/* Purple Arrowhead */}
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

            {/* Pink Loop Arrowhead */}
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

          {/* Linear Edge 1 -> 2 */}
          <line
            x1={NODES[0].cx + 42}
            y1={NODES[0].cy}
            x2={NODES[1].cx - 48}
            y2={NODES[1].cy}
            stroke={theme.colors.cyan}
            strokeWidth="5"
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
            markerEnd="url(#arrow-cyan)"
          />

          {/* Circular Loop Edges: */}
          {/* 3 -> 4: Arc along Top-Right */}
          <path
            d={`M ${NODES[2].cx + 35} ${NODES[2].cy + 25} A 190 190 0 0 1 ${NODES[3].cx - 20} ${NODES[3].cy - 35}`}
            fill="none"
            stroke={theme.colors.purple}
            strokeWidth="6"
            markerEnd="url(#arrow-purple)"
          />

          {/* 4 -> 5: Arc along Bottom-Right */}
          <path
            d={`M ${NODES[3].cx - 25} ${NODES[3].cy + 35} A 190 190 0 0 1 ${NODES[4].cx + 35} ${NODES[4].cy - 20}`}
            fill="none"
            stroke={theme.colors.purple}
            strokeWidth="6"
            markerEnd="url(#arrow-purple)"
          />

          {/* 5 -> 6: Arc along Bottom-Left */}
          <path
            d={`M ${NODES[4].cx - 35} ${NODES[4].cy - 20} A 190 190 0 0 1 ${NODES[5].cx + 25} ${NODES[5].cy + 35}`}
            fill="none"
            stroke={theme.colors.purple}
            strokeWidth="6"
            markerEnd="url(#arrow-purple)"
          />

          {/* 6 -> 3: Loop Arc along Top-Left back to entrance */}
          <path
            d={`M ${NODES[5].cx + 20} ${NODES[5].cy - 35} A 190 190 0 0 1 ${NODES[2].cx - 35} ${NODES[2].cy + 20}`}
            fill="none"
            stroke={theme.colors.pink}
            strokeWidth="6"
            strokeDasharray="8 6"
            markerEnd="url(#arrow-pink)"
          />
        </svg>

        {/* Loop Center Badge */}
        <div
          style={{
            position: "absolute",
            left: "640px",
            top: "720px",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(168, 85, 247, 0.15)",
            border: "1.5px dashed #A855F7",
            borderRadius: "999px",
            padding: "8px 18px",
            fontSize: "15px",
            fontWeight: 800,
            color: "#D8B4FE",
            letterSpacing: "0.5px",
          }}
        >
          🔄 INFINITE CYCLE
        </div>

        {/* Graph Nodes */}
        {NODES.map((node) => {
          const isSlowHere = slowNodeId === node.id && frame >= 433;
          const isFastHere = fastNodeId === node.id && frame >= 433;
          const isCollisionNode = node.id === 4 && isCollisionStage;

          return (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: `${node.cx}px`,
                top: `${node.cy}px`,
                transform: "translate(-50%, -50%)",
                width: "84px",
                height: "84px",
                borderRadius: "50%",
                backgroundColor: isCollisionNode
                  ? "rgba(245, 158, 11, 0.25)"
                  : theme.colors.nodeBg,
                border: isCollisionNode
                  ? `4.5px solid ${theme.colors.amber}`
                  : `4px solid ${node.inLoop ? theme.colors.purple : theme.colors.nodeBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: 900,
                color: "#FFFFFF",
                boxShadow: isCollisionNode
                  ? "0 0 45px rgba(245, 158, 11, 0.95)"
                  : node.inLoop
                  ? "0 0 25px rgba(168, 85, 247, 0.4)"
                  : "0 0 20px rgba(56, 189, 248, 0.4)",
                transition: "all 0.2s ease",
              }}
            >
              {node.val}
            </div>
          );
        })}

        {/* Dynamic Animated Pointer Avatars */}
        {frame >= 433 && (
          <>
            {/* Slow Pointer Avatar */}
            <div
              style={{
                position: "absolute",
                left: `${slowPos.x}px`,
                top: `${slowPos.y - 68}px`,
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
              <span style={{ fontSize: "24px" }}>🐢</span>
              <span>Slow</span>
            </div>

            {/* Fast Pointer Avatar */}
            <div
              style={{
                position: "absolute",
                left: `${fastPos.x}px`,
                top: `${fastPos.y + 68}px`,
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
              <span style={{ fontSize: "24px" }}>🐇</span>
              <span>Fast</span>
            </div>
          </>
        )}
      </div>

      {/* ─── KINETIC SUBTITLES (BOTTOM) ─── */}
      <div
        style={{
          position: "absolute",
          bottom: "290px",
          left: "50px",
          right: "50px",
          textAlign: "center",
          zIndex: 45,
        }}
      >
        {currentSubtitle && (
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(15, 23, 42, 0.92)",
              backdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "18px",
              padding: "14px 28px",
              boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
            }}
          >
            <span
              style={{
                fontSize: "26px",
                fontWeight: 800,
                lineHeight: 1.3,
                color: "#FFFFFF",
                letterSpacing: "-0.2px",
              }}
            >
              {currentSubtitle.text}
            </span>
          </div>
        )}
      </div>

      {/* ─── BOTTOM SECTION: NEMI MASCOT & CTA ─── */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "60px",
          right: "60px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          zIndex: 45,
        }}
      >
        {/* Nemi Mascot with Expression */}
        <div style={{ transform: "scale(1.15)", transformOrigin: "bottom left" }}>
          <NemiMascot pose={nemiPose} />
        </div>

        {/* CTA Banner */}
        <div
          style={{
            backgroundColor: theme.colors.bgCard,
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "18px",
            padding: "14px 22px",
            textAlign: "right",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 700, color: theme.colors.cyanLight }}>
            FOLLOW FOR DAILY LEETCODE & TECH
          </div>
          <div style={{ fontSize: "20px", fontWeight: 900, color: "#FFFFFF" }}>
            @nemi.explains 📌
          </div>
        </div>
      </div>

      {/* ─── COLLISION FLASH OVERLAY ─── */}
      {collisionFlash > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFFFFF",
            opacity: collisionFlash,
            pointerEvents: "none",
            zIndex: 99,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
