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

export const nemiTheme = {
  colors: {
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandGreen: "#10B981",
    brandRed: "#EF4444",
    brandAmber: "#F59E0B",
    brandPurple: "#A855F7",
    brandPink: "#EC4899",
    textHeadingDark: "#0F172A",
    textHeadingLight: "#F8FAFC",
    textMutedLight: "#64748B",
    textMutedDark: "#94A3B8",
    cardDark: "rgba(15, 23, 42, 0.94)",
    borderDark: "rgba(255, 255, 255, 0.12)",
    borderLight: "#E2E8F0",
  },
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
  },
};

// Circular Linked List Geometry (Centered on 1080x1920 portrait canvas)
// Center of loop: (640, 680), Radius R = 200px
const NODES = [
  { id: 1, val: "1", cx: 140, cy: 570, inLoop: false },
  { id: 2, val: "2", cx: 370, cy: 570, inLoop: false },
  { id: 3, val: "3", cx: 640, cy: 570, inLoop: true },
  { id: 4, val: "4", cx: 840, cy: 770, inLoop: true },
  { id: 5, val: "5", cx: 640, cy: 970, inLoop: true },
  { id: 6, val: "6", cx: 440, cy: 770, inLoop: true },
];

export const CycleComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = timelineData.total_frames || 733;

  // ─── Timeline Boundaries ───
  // cy01_hook: 0 - 96
  // cy02_nemi: 98 - 171
  // cy03_memory_trap: 173 - 283
  // cy04_two_pointers: 285 - 410
  // cy05_chase: 413 - 555
  // cy06_nemi: 557 - 636
  // cy07_loop: 638 - 733

  const cutA = 0;
  const cutB = 98;   // Nemi question -> dark mode
  const cutC = 173;  // Memory trap
  const cutD = 285;  // Two pointers
  const cutE = 413;  // The chase
  const cutCollision = 530; // BAM!
  const cutF = 557;  // Nemi smug payoff -> light mode
  const cutG = 638;  // Loop seam

  // ─── White/Cream to Cyber Dark Canvas Interpolation ───
  const isDarkWorld = frame >= cutB && frame < cutF;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;

  // ─── Camera Breathing ───
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  // ─── Nemi Dynamic Emotional Arc & Speech ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "thinking";
  } else if (frame < cutC) {
    nemiPose = "puzzled";
    nemiSpeech = "Can't we just save visited nodes in a Hash Set? 🤔";
  } else if (frame < cutD) {
    nemiPose = "shocked";
  } else if (frame < cutE) {
    nemiPose = "explaining";
  } else if (frame < cutCollision) {
    nemiPose = "pointing";
  } else if (frame < cutF) {
    nemiPose = "smug";
  } else if (frame < cutG + 20) {
    nemiPose = "aha";
    nemiSpeech = "Zero extra RAM and O(N) time! 😎⚡";
  } else {
    nemiPose = "smug";
  }

  // ─── Turn Simulation for Tortoise & Hare ───
  let slowNodeId = 1;
  let fastNodeId = 1;
  let turnText = "Pointers initialized at Head Node [1]";

  if (frame < cutD) {
    slowNodeId = 1;
    fastNodeId = 1;
  } else if (frame >= cutD && frame < cutE) {
    slowNodeId = 1;
    fastNodeId = 1;
    turnText = "🐢 Slow (+1 Step)  |  🐇 Fast (+2 Steps)";
  } else if (frame >= cutE && frame < 455) {
    const p = spring({ frame: frame - cutE, fps, config: { damping: 14 } });
    slowNodeId = p > 0.5 ? 2 : 1;
    fastNodeId = p > 0.5 ? 3 : 1;
    turnText = "Turn 1: Slow at [2]  |  Fast leaps to [3] ⚡";
  } else if (frame >= 455 && frame < 500) {
    const p = spring({ frame: frame - 455, fps, config: { damping: 14 } });
    slowNodeId = p > 0.5 ? 3 : 2;
    fastNodeId = p > 0.5 ? 5 : 3;
    turnText = "Turn 2: Slow enters [3]  |  Fast leaps to [5] ⚡";
  } else if (frame >= 500) {
    const p = spring({ frame: frame - 500, fps, config: { damping: 14 } });
    slowNodeId = p > 0.5 ? 4 : 3;
    fastNodeId = p > 0.5 ? 4 : 5;
    turnText = "Turn 3: Slow moves to [4]  |  Fast loops to [4] 💥";
  }

  const slowNode = NODES.find((n) => n.id === slowNodeId) || NODES[0];
  const fastNode = NODES.find((n) => n.id === fastNodeId) || NODES[0];

  // Moving animated dash offset for continuous living energy
  const flowOffset = -(frame * 6) % 24;

  // Collision Shockwave Trigger (f: 530 to 536)
  const isCollisionActive = frame >= cutCollision && frame < cutF;
  const collisionImpact =
    frame >= 530 && frame < 536
      ? interpolate(frame, [530, 532, 536], [0, 0.7, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // Active Subtitle
  const currentSubtitle = timelineData.subtitles.find(
    (s: any) => frame >= s.start_frame && frame <= s.end_frame
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: canvasBg,
        fontFamily: nemiTheme.typography.fontFamily.sans,
        color: isDarkWorld ? nemiTheme.colors.textHeadingLight : nemiTheme.colors.textHeadingDark,
        overflow: "hidden",
        transform: `scale(${cameraScale})`,
        transformOrigin: "center center",
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Voice + Ducked BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/cycle_15/voiceover.mp3")} volume={1.0} />

      {/* Synchronized SFX Layer */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutB} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutC} durationInFrames={30}>
        <Audio src={staticFile("sfx/error.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={cutD} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={cutE} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={455} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={500} durationInFrames={20}>
        <Audio src={staticFile("sfx/click.mp3")} volume={0.45} />
      </Sequence>
      <Sequence from={530} durationInFrames={40}>
        <Audio src={staticFile("sfx/anime-wow.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={cutF} durationInFrames={40}>
        <Audio src={staticFile("sfx/chime.mp3")} volume={0.65} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* AMBIENT BACKGROUND GLOW (DARK WORLD) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isDarkWorld && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
          <div
            style={{
              position: "absolute",
              top: 200,
              left: -100,
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 600,
              right: -100,
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP HUD (Safe Zone: top: 85px) */}
      {/* ══════════════════════════════════════════════════════════ */}
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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: isDarkWorld ? nemiTheme.colors.brandCyan : nemiTheme.colors.brandGreen,
              boxShadow: `0 0 20px ${isDarkWorld ? nemiTheme.colors.brandCyan : nemiTheme.colors.brandGreen}`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: isDarkWorld ? "#06B6D4" : "#0891B2",
            }}
          >
            Ep.15 · Floyd's Cycle
          </span>
        </div>

        <div
          style={{
            backgroundColor: isDarkWorld ? nemiTheme.colors.cardDark : "#FFFFFF",
            padding: "10px 22px",
            borderRadius: 24,
            border: `2px solid ${isDarkWorld ? nemiTheme.colors.borderDark : nemiTheme.colors.borderLight}`,
            fontSize: 20,
            fontWeight: 900,
            color: isDarkWorld ? "#F8FAFC" : "#0F172A",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {frame < cutB
            ? "THE INFINITE LOOP"
            : frame < cutC
            ? "HASH SET TRAP"
            : frame < cutD
            ? "O(N) RAM EXPLOSION"
            : frame < cutE
            ? "2-POINTER STRATEGY"
            : frame < cutCollision
            ? "THE RACETRACK CHASE"
            : frame < cutF
            ? "BAM! COLLISION"
            : "O(1) SPACE VICTORY"}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MAIN HEADLINE TITLE (Safe Zone: top: 165px) */}
      {/* ══════════════════════════════════════════════════════════ */}
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
            lineHeight: 1.15,
            color: isDarkWorld ? "#F8FAFC" : nemiTheme.colors.textHeadingDark,
          }}
        >
          {frame < cutB ? (
            <>
              Detect An Infinite Loop In <span style={{ color: nemiTheme.colors.brandCyan }}>O(1) Memory!</span> 🌀
            </>
          ) : frame < cutC ? (
            <>
              Can We Just Store Visited In A <span style={{ color: nemiTheme.colors.brandYellow }}>Hash Set?</span> 🤔
            </>
          ) : frame < cutD ? (
            <>
              Hash Set = <span style={{ color: nemiTheme.colors.brandRed }}>O(N) RAM Trap!</span> 💥
            </>
          ) : frame < cutE ? (
            <>
              Use Two Pointers: <span style={{ color: nemiTheme.colors.brandCyan }}>🐢 Slow</span> &{" "}
              <span style={{ color: nemiTheme.colors.brandAmber }}>🐇 Fast!</span>
            </>
          ) : frame < cutCollision ? (
            <>
              Inside Loop: <span style={{ color: nemiTheme.colors.brandCyan }}>Hare Gains 1 Node/Turn!</span> ⚡
            </>
          ) : frame < cutF ? (
            <>
              💥 <span style={{ color: nemiTheme.colors.brandAmber }}>BAM! COLLISION AT NODE [4]!</span>
            </>
          ) : (
            <>
              Solved in <span style={{ color: nemiTheme.colors.brandGreen }}>O(1) Space</span> &{" "}
              <span style={{ color: nemiTheme.colors.brandCyan }}>O(N) Time!</span> 👑
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC VISUAL STAGES (Safe Zone: top: 290px, height: 720px) */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* STAGE 3: RAM CRASH OVERLOAD METER (f: 173 to 285) */}
      {frame >= cutC && frame < cutD && (
        <div
          style={{
            position: "absolute",
            top: 275,
            left: 70,
            right: 70,
            backgroundColor: nemiTheme.colors.cardDark,
            border: `2.5px solid ${nemiTheme.colors.brandRed}`,
            borderRadius: 24,
            padding: "20px 28px",
            boxShadow: "0 16px 40px rgba(239, 68, 68, 0.35)",
            zIndex: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>
              Visited Nodes Hash Table
            </span>
            <span
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: frame > 230 ? nemiTheme.colors.brandRed : nemiTheme.colors.brandAmber,
              }}
            >
              {frame > 230 ? "8.4 GB (CRASH!)" : "2.1 GB"}
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: 28,
              backgroundColor: "#1E293B",
              borderRadius: 999,
              overflow: "hidden",
              border: "1px solid #475569",
            }}
          >
            <div
              style={{
                height: "100%",
                width: frame > 230 ? "100%" : "65%",
                backgroundColor: frame > 230 ? nemiTheme.colors.brandRed : nemiTheme.colors.brandAmber,
                boxShadow: frame > 230 ? "0 0 30px #EF4444" : "0 0 15px #F59E0B",
                transition: "all 0.3s ease",
              }}
            />
          </div>

          {frame > 230 && (
            <div
              style={{
                marginTop: 14,
                padding: "8px 16px",
                backgroundColor: "rgba(239, 68, 68, 0.25)",
                borderRadius: 12,
                border: "1.5px solid #EF4444",
                textAlign: "center",
                fontSize: 22,
                fontWeight: 900,
                color: "#FCA5A5",
              }}
            >
              ❌ MEMORY LIMIT EXCEEDED (1 BILLION NODES)
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: TWO POINTER SPEEDOMETER CARDS (f: 285 to 413) */}
      {frame >= cutD && frame < cutE && (
        <div
          style={{
            position: "absolute",
            top: 275,
            left: 70,
            right: 70,
            display: "flex",
            gap: 20,
            zIndex: 40,
          }}
        >
          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(6, 182, 212, 0.18)",
              border: `2.5px solid ${nemiTheme.colors.brandCyan}`,
              borderRadius: 20,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              boxShadow: "0 10px 30px rgba(6, 182, 212, 0.35)",
            }}
          >
            <span style={{ fontSize: 44 }}>🐢</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#67E8F9" }}>
                SLOW POINTER
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#FFF" }}>
                +1 Step / Turn
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              backgroundColor: "rgba(245, 158, 11, 0.18)",
              border: `2.5px solid ${nemiTheme.colors.brandAmber}`,
              borderRadius: 20,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              boxShadow: "0 10px 30px rgba(245, 158, 11, 0.35)",
            }}
          >
            <span style={{ fontSize: 44 }}>🐇</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#FDE68A" }}>
                FAST POINTER
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#FFF" }}>
                +2 Steps / Turn
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 5: TURN TRACKER & RELATIVE SPEED (f: 413 to 557) */}
      {frame >= cutE && frame < cutF && (
        <div
          style={{
            position: "absolute",
            top: 275,
            left: 70,
            right: 70,
            backgroundColor: isCollisionActive
              ? "rgba(245, 158, 11, 0.25)"
              : nemiTheme.colors.cardDark,
            border: `2.5px solid ${isCollisionActive ? nemiTheme.colors.brandAmber : "rgba(255,255,255,0.2)"}`,
            borderRadius: 20,
            padding: "16px 24px",
            textAlign: "center",
            boxShadow: isCollisionActive
              ? "0 16px 45px rgba(245, 158, 11, 0.45)"
              : "0 10px 30px rgba(0,0,0,0.4)",
            zIndex: 40,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: isCollisionActive ? nemiTheme.colors.brandAmber : "#F8FAFC",
            }}
          >
            {turnText}
          </div>
          {isCollisionActive && (
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#E2E8F0",
                marginTop: 6,
              }}
            >
              Relative Speed: <span style={{ color: "#67E8F9" }}>2 - 1 = 1 node/turn</span>. Fast pointer always catches slow!
            </div>
          )}
        </div>
      )}

      {/* STAGE 6: VICTORY SCORECARD & CODE (f >= 557) */}
      {frame >= cutF && (
        <div
          style={{
            position: "absolute",
            top: 275,
            left: 70,
            right: 70,
            display: "flex",
            gap: 20,
            zIndex: 40,
          }}
        >
          <div
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              border: `2.5px solid ${nemiTheme.colors.brandCyan}`,
              borderRadius: 20,
              padding: "16px",
              textAlign: "center",
              boxShadow: "0 12px 35px rgba(6, 182, 212, 0.15)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 900, color: "#64748B" }}>
              TIME COMPLEXITY
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#0891B2" }}>
              O(N) ⚡
            </div>
          </div>

          <div
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              border: `2.5px solid ${nemiTheme.colors.brandGreen}`,
              borderRadius: 20,
              padding: "16px",
              textAlign: "center",
              boxShadow: "0 12px 35px rgba(16, 185, 129, 0.15)",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 900, color: "#64748B" }}>
              SPACE COMPLEXITY
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#059669" }}>
              O(1) 🧠
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC LINKED LIST GRAPH ENGINE */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1920,
          zIndex: 20,
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
              <path d="M 0 1 L 8 5 L 0 9 z" fill={nemiTheme.colors.brandCyan} />
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
              <path d="M 0 1 L 8 5 L 0 9 z" fill={nemiTheme.colors.brandPurple} />
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
              <path d="M 0 1 L 8 5 L 0 9 z" fill={nemiTheme.colors.brandPink} />
            </marker>
          </defs>

          {/* Linear Edge 1 -> 2 */}
          <line
            x1={NODES[0].cx + 48}
            y1={NODES[0].cy}
            x2={NODES[1].cx - 52}
            y2={NODES[1].cy}
            stroke={nemiTheme.colors.brandCyan}
            strokeWidth="6"
            strokeDasharray="10 6"
            strokeDashoffset={flowOffset}
            markerEnd="url(#arrow-cyan)"
          />

          {/* Linear Edge 2 -> 3 */}
          <line
            x1={NODES[1].cx + 48}
            y1={NODES[1].cy}
            x2={NODES[2].cx - 52}
            y2={NODES[2].cy}
            stroke={nemiTheme.colors.brandCyan}
            strokeWidth="6"
            strokeDasharray="10 6"
            strokeDashoffset={flowOffset}
            markerEnd="url(#arrow-cyan)"
          />

          {/* Circular Loop: 3 -> 4 */}
          <path
            d={`M ${NODES[2].cx + 38} ${NODES[2].cy + 28} A 200 200 0 0 1 ${NODES[3].cx - 24} ${NODES[3].cy - 38}`}
            fill="none"
            stroke={nemiTheme.colors.brandPurple}
            strokeWidth="7"
            strokeDasharray="12 6"
            strokeDashoffset={flowOffset}
            markerEnd="url(#arrow-purple)"
          />

          {/* Circular Loop: 4 -> 5 */}
          <path
            d={`M ${NODES[3].cx - 28} ${NODES[3].cy + 38} A 200 200 0 0 1 ${NODES[4].cx + 38} ${NODES[4].cy - 24}`}
            fill="none"
            stroke={nemiTheme.colors.brandPurple}
            strokeWidth="7"
            strokeDasharray="12 6"
            strokeDashoffset={flowOffset}
            markerEnd="url(#arrow-purple)"
          />

          {/* Circular Loop: 5 -> 6 */}
          <path
            d={`M ${NODES[4].cx - 38} ${NODES[4].cy - 24} A 200 200 0 0 1 ${NODES[5].cx + 28} ${NODES[5].cy + 38}`}
            fill="none"
            stroke={nemiTheme.colors.brandPurple}
            strokeWidth="7"
            strokeDasharray="12 6"
            strokeDashoffset={flowOffset}
            markerEnd="url(#arrow-purple)"
          />

          {/* Circular Loop: 6 -> 3 (Return loop) */}
          <path
            d={`M ${NODES[5].cx + 24} ${NODES[5].cy - 38} A 200 200 0 0 1 ${NODES[2].cx - 38} ${NODES[2].cy + 24}`}
            fill="none"
            stroke={nemiTheme.colors.brandPink}
            strokeWidth="7"
            strokeDasharray="10 6"
            strokeDashoffset={flowOffset * 1.5}
            markerEnd="url(#arrow-pink)"
          />
        </svg>

        {/* Loop Center Badge */}
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 770,
            transform: "translate(-50%, -50%)",
            backgroundColor: isDarkWorld ? "rgba(168, 85, 247, 0.18)" : "rgba(168, 85, 247, 0.12)",
            border: "2px dashed #A855F7",
            borderRadius: 999,
            padding: "10px 22px",
            fontSize: 18,
            fontWeight: 900,
            color: isDarkWorld ? "#D8B4FE" : "#7E22CE",
            letterSpacing: "0.5px",
          }}
        >
          🔄 INFINITE CYCLE
        </div>

        {/* Graph Nodes */}
        {NODES.map((node) => {
          const isCollisionNode = node.id === 4 && isCollisionActive;

          return (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: `${node.cx}px`,
                top: `${node.cy}px`,
                transform: "translate(-50%, -50%)",
                width: 96,
                height: 96,
                borderRadius: "50%",
                backgroundColor: isCollisionNode
                  ? "rgba(245, 158, 11, 0.35)"
                  : isDarkWorld
                  ? "#0F172A"
                  : "#FFFFFF",
                border: isCollisionNode
                  ? `5px solid ${nemiTheme.colors.brandAmber}`
                  : `4.5px solid ${node.inLoop ? nemiTheme.colors.brandPurple : nemiTheme.colors.brandCyan}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
                fontWeight: 900,
                color: isDarkWorld ? "#FFFFFF" : "#0F172A",
                boxShadow: isCollisionNode
                  ? "0 0 50px rgba(245, 158, 11, 1)"
                  : node.inLoop
                  ? "0 0 30px rgba(168, 85, 247, 0.4)"
                  : "0 0 25px rgba(6, 182, 212, 0.4)",
                transition: "all 0.2s ease",
              }}
            >
              {node.val}
            </div>
          );
        })}

        {/* Animated 2-Pointer Badges (f >= cutD to cutF) */}
        {frame >= cutD && frame < cutF && (
          <>
            {/* Slow Pointer Badge */}
            <div
              style={{
                position: "absolute",
                left: `${slowNode.cx}px`,
                top: `${slowNode.cy - 78}px`,
                transform: "translate(-50%, -50%)",
                backgroundColor: nemiTheme.colors.brandCyan,
                color: "#000000",
                fontSize: 22,
                fontWeight: 900,
                padding: "6px 16px",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 8px 24px rgba(6, 182, 212, 0.8)",
                zIndex: 30,
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <span style={{ fontSize: 26 }}>🐢</span>
              <span>Slow</span>
            </div>

            {/* Fast Pointer Badge */}
            <div
              style={{
                position: "absolute",
                left: `${fastNode.cx}px`,
                top: `${fastNode.cy + 78}px`,
                transform: "translate(-50%, -50%)",
                backgroundColor: nemiTheme.colors.brandAmber,
                color: "#000000",
                fontSize: 22,
                fontWeight: 900,
                padding: "6px 16px",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 8px 24px rgba(245, 158, 11, 0.8)",
                zIndex: 30,
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <span style={{ fontSize: 26 }}>🐇</span>
              <span>Fast</span>
            </div>
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC VIRAL KARAOKE SUBTITLES (Safe Zone: top: 1100px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {!nemiSpeech && currentSubtitle && (
        <div
          style={{
            position: "absolute",
            top: 1100,
            left: 60,
            right: 60,
            display: "flex",
            justifyContent: "center",
            zIndex: 45,
          }}
        >
          <div
            style={{
              backgroundColor: isDarkWorld
                ? "rgba(15, 23, 42, 0.92)"
                : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: `2px solid ${isDarkWorld ? "rgba(255, 255, 255, 0.15)" : "#CBD5E1"}`,
              borderRadius: 24,
              padding: "16px 32px",
              boxShadow: isDarkWorld
                ? "0 16px 40px rgba(0,0,0,0.6)"
                : "0 12px 35px rgba(0,0,0,0.1)",
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
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
                    fontSize: 36,
                    fontWeight: 900,
                    color: isWordActive
                      ? nemiTheme.colors.brandYellow
                      : isDarkWorld
                      ? "#F8FAFC"
                      : "#0F172A",
                    transform: isWordActive ? "scale(1.22)" : "scale(1.0)",
                    display: "inline-block",
                    transition: "transform 0.1s ease, color 0.1s ease",
                    textShadow: isWordActive
                      ? `0 0 20px ${nemiTheme.colors.brandYellow}`
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

      {/* ══════════════════════════════════════════════════════════ */}
      {/* NEMI FLOATING SPEECH BUBBLE (bottom: 390px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {nemiSpeech && (
        <div
          style={{
            position: "absolute",
            bottom: 390,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: nemiTheme.colors.brandYellow,
            color: "#0F172A",
            borderRadius: 28,
            padding: "20px 32px",
            maxWidth: 680,
            textAlign: "center",
            fontSize: 28,
            fontWeight: 900,
            lineHeight: 1.3,
            boxShadow: "0 16px 45px rgba(255, 209, 102, 0.5)",
            zIndex: 50,
          }}
        >
          {nemiSpeech}
          {/* Arrow pointing down to Nemi */}
          <div
            style={{
              position: "absolute",
              bottom: -14,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "16px solid transparent",
              borderRight: "16px solid transparent",
              borderTop: `16px solid ${nemiTheme.colors.brandYellow}`,
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DEDICATED BOTTOM-CENTER MASCOT DOCK (bottom: 40px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%) scale(1.55)",
          transformOrigin: "bottom center",
          zIndex: 45,
        }}
      >
        <NemiMascot pose={nemiPose} />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CHANNEL WATERMARK */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          fontSize: 16,
          fontWeight: 800,
          color: isDarkWorld ? "rgba(255, 255, 255, 0.35)" : "rgba(15, 23, 42, 0.35)",
          letterSpacing: "0.5px",
          zIndex: 40,
        }}
      >
        @nemi.explains
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TACTILE COLLISION FLASH */}
      {/* ══════════════════════════════════════════════════════════ */}
      {collisionImpact > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFFFFF",
            opacity: collisionImpact,
            pointerEvents: "none",
            zIndex: 99,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
