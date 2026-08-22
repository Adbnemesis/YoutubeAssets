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
import cuesData from "../../src/data/mcp_09_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandPurple: "#A855F7",
    brandGreen: "#10B981",
    brandCoral: "#F43F5E",
    brandAmber: "#F59E0B",
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    cardDark: "#0B1120",
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

export const McpComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = cuesData.total_frames || 713;

  // ─── Timeline Events ───
  const evHook = getEvent("mcp01_hook");
  const evApiSide = getEvent("mcp02_api_side");
  const evGuess = getEvent("mcp03_nemi_guess");
  const evMcpSide = getEvent("mcp04_mcp_side");
  const evPayoff = getEvent("mcp05_payoff");
  const evNemiPayoff = getEvent("mcp06_nemi_payoff");
  const evLoop = getEvent("mcp07_loop");

  // ─── Semantic Cue Frames ───
  const versusPopCue = getCue("mcp01_hook", "versus_pop"); // 27
  const splitRevealCue = getCue("mcp01_hook", "split_reveal"); // 55
  const apiEndpointsCue = getCue("mcp02_api_side", "api_endpoints"); // 113
  const apiSpaghettiCue = getCue("mcp02_api_side", "api_spaghetti"); // 163
  const buzzerShockCue = getCue("mcp03_nemi_guess", "buzzer_shock"); // 214
  const mcpGlowCue = getCue("mcp04_mcp_side", "mcp_glow"); // 292
  const usbcPlugCue = getCue("mcp04_mcp_side", "usbc_plug"); // 333
  const toolDiscoveryCue = getCue("mcp05_payoff", "tool_discovery"); // 418
  const plugAndPlayCue = getCue("mcp05_payoff", "plug_and_play"); // 470
  const smugStampCue = getCue("mcp06_nemi_payoff", "smug_stamp"); // 501
  const loopSeamCue = getCue("mcp07_loop", "loop_seam_check"); // 680

  // ─── Stage Boundaries (Punch Cuts) ───
  const cutB = evApiSide.start_frame; // 72 (API Deep Dive)
  const cutD = evMcpSide.start_frame; // 239 (MCP Deep Dive)
  const cutE = evPayoff.start_frame; // 360 (Payoff Discovery)
  const cutF = evNemiPayoff.start_frame - 1; // 500 (Outro Summary)

  // ─── Canvas Worlds ───
  const isDarkWorld = frame >= cutB;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;

  // ─── Nemi Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < cutB) {
    nemiPose = "thinking";
  } else if (frame < evGuess.start_frame) {
    nemiPose = "pointing";
  } else if (frame < cutD) {
    nemiPose = "shocked";
    nemiSpeech = "Rewrite code for every app?! 🤯";
  } else if (frame < evPayoff.start_frame) {
    nemiPose = "pointing";
  } else if (frame < cutF) {
    nemiPose = "aha";
  } else if (frame < evNemiPayoff.end_frame + 4) {
    nemiPose = "smug";
    nemiSpeech = "One plug for everything! 😎";
  } else {
    nemiPose = "smug";
  }

  const inStageA = frame < cutB;
  const inStageBC = frame >= cutB && frame < cutD;
  const inStageD = frame >= cutD && frame < cutE;
  const inStageE = frame >= cutE && frame < cutF;
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
      <Audio src={staticFile("reels/mcp_09/mcp_master_audio.mp3")} volume={0.9} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SFX LAYER (-3dB Headroom Doctrine, Frame-Synced) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/mcp_09/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={versusPopCue} durationInFrames={20}>
        <Audio src={staticFile("reels/mcp_09/sfx/pop.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={splitRevealCue} durationInFrames={30}>
        <Audio src={staticFile("reels/mcp_09/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutB - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/mcp_09/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={apiEndpointsCue} durationInFrames={25}>
        <Audio src={staticFile("reels/mcp_09/sfx/click.mp3")} volume={0.63} />
      </Sequence>
      <Sequence from={apiSpaghettiCue} durationInFrames={30}>
        <Audio src={staticFile("reels/mcp_09/sfx/notification.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={buzzerShockCue} durationInFrames={30}>
        <Audio src={staticFile("reels/mcp_09/sfx/error.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutD - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/mcp_09/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={mcpGlowCue} durationInFrames={35}>
        <Audio src={staticFile("reels/mcp_09/sfx/riser.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={usbcPlugCue} durationInFrames={25}>
        <Audio src={staticFile("reels/mcp_09/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutE - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/mcp_09/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={toolDiscoveryCue} durationInFrames={20}>
        <Audio src={staticFile("reels/mcp_09/sfx/pop.mp3")} volume={0.66} />
      </Sequence>
      <Sequence from={plugAndPlayCue} durationInFrames={40}>
        <Audio src={staticFile("reels/mcp_09/sfx/chime.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={Math.max(0, cutF - 1)} durationInFrames={35}>
        <Audio src={staticFile("reels/mcp_09/sfx/whoosh.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={smugStampCue} durationInFrames={30}>
        <Audio src={staticFile("reels/mcp_09/sfx/notification.mp3")} volume={0.66} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* AMBIENT BACKGROUND GLOW (Dark World Only) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {isDarkWorld && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
          <div
            style={{
              position: "absolute",
              top: 180,
              left: -160,
              width: 650,
              height: 650,
              borderRadius: "50%",
              background: inStageBC
                ? "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(90px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 700,
              right: -160,
              width: 650,
              height: 650,
              borderRadius: "50%",
              background: inStageD || inStageE || inStageF
                ? "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(0,0,0,0) 70%)",
              filter: "blur(90px)",
            }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP HUD (Safe Zone: top 85px) — appears AFTER Second 2 */}
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
                backgroundColor: inStageD || inStageE || inStageF ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandAmber,
                boxShadow: `0 0 24px ${inStageD || inStageE || inStageF ? nemiTheme.colors.brandGreen : nemiTheme.colors.brandAmber}`,
              }}
            />
            <span
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: isDarkWorld ? (inStageD || inStageE || inStageF ? "#10B981" : "#F59E0B") : "#D97706",
              }}
            >
              Ep.9 · System Protocols
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
              color: isDarkWorld ? (inStageD || inStageE || inStageF ? "#10B981" : "#F59E0B") : "#D97706",
              fontFamily: nemiTheme.typography.fontFamily.mono,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            {inStageA ? "THE DUEL" : inStageBC ? "LEFT: API TRAP" : inStageD ? "RIGHT: MCP USB-C" : inStageE ? "DYNAMIC DISCOVERY" : "THE VERDICT"}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE A — FRAME-0 HOOK: SIDE-BY-SIDE GRAPHICAL SHOWDOWN */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageA && (
        <>
          <div
            style={{
              position: "absolute",
              top: 180,
              left: 70,
              right: 70,
              textAlign: "center",
              zIndex: 55,
            }}
          >
            <div
              style={{
                fontSize: 58,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1.1,
                color: frame >= versusPopCue ? nemiTheme.colors.brandCoral : nemiTheme.colors.textLight,
              }}
            >
              {frame >= versusPopCue ? (
                <>
                  APIS CONNECT APPS. <span style={{ color: nemiTheme.colors.brandCyan }}>MCP CONNECTS AI.</span>
                </>
              ) : (
                <>
                  MCP VS API: WHAT'S THE DIFFERENCE?
                </>
              )}
            </div>
          </div>

          <DualHeroCard frame={frame} versusPopCue={versusPopCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE B+C — LEFT SIDE: THE SPAGHETTI NETWORK OF HELL */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageBC && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#F59E0B" }}>
              The API Trap: N × M Rewiring
            </div>
          </div>

          <ApiSpaghettiMatrix frame={frame} cutB={cutB} apiSpaghettiCue={apiSpaghettiCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE D — RIGHT SIDE: MCP IS USB-C FOR AI */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageD && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#06B6D4" }}>
              The Solution: USB-C for AI 🔌
            </div>
          </div>

          <McpBusArchitecture frame={frame} cutD={cutD} usbcPlugCue={usbcPlugCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE E — THE PAYOFF: DYNAMIC TOOL DISCOVERY & INJECTION */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageE && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#10B981" }}>
              The Payoff: Auto-Discovery! ⚡
            </div>
          </div>

          <DynamicDiscoveryHandshake frame={frame} cutE={cutE} toolDiscoveryCue={toolDiscoveryCue} plugAndPlayCue={plugAndPlayCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE F — LOOP SEAM & FINAL COMPARISON TABLE */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageF && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#06B6D4" }}>
              The Golden Rule: API vs MCP
            </div>
          </div>

          <ComparisonVerdict frame={frame} cutF={cutF} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} fps={fps} />}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASCOT DOCK (Safe Zone: bottom: 70px) */}
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
      {/* SPEECH BUBBLE (Strictly on Top of Nemi at bottom: 440px) */}
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
  );
};

// ═══════════════════════════════════════════════════════════════
// 1. DUAL HERO CARD (Stage A: Animated Side-by-Side Showdown)
// ═══════════════════════════════════════════════════════════════
const DualHeroCard: React.FC<{ frame: number; versusPopCue: number }> = ({ frame, versusPopCue }) => {
  const packetOffset = (frame * 7) % 200;

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 540,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        zIndex: 30,
      }}
    >
      {/* Left Side: REST API */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 36,
          border: "3.5px solid #F59E0B",
          boxShadow: "0 24px 60px rgba(245, 158, 11, 0.2)",
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#D97706" }}>REST API 📦</div>
          <div style={{ fontSize: 16, color: "#64748B", fontWeight: 800, marginTop: 4 }}>For Programmers</div>
        </div>

        {/* Animated Wire Diagram */}
        <svg width="380" height="200" viewBox="0 0 380 200">
          <circle cx="60" cy="100" r="30" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
          <text x="60" y="106" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#B45309">APP 💻</text>

          <circle cx="320" cy="40" r="22" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
          <text x="320" y="46" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#991B1B">DB</text>

          <circle cx="320" cy="100" r="22" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
          <text x="320" y="106" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#991B1B">API</text>

          <circle cx="320" cy="160" r="22" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
          <text x="320" y="166" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#991B1B">AUTH</text>

          <path d="M 90 100 Q 190 50 298 40" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 6" />
          <path d="M 90 100 L 298 100" fill="none" stroke="#F59E0B" strokeWidth="3" />
          <path d="M 90 100 Q 190 150 298 160" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 6" />

          <circle cx={90 + packetOffset * 1.05} cy="100" r="6" fill="#EF4444" />
        </svg>

        <div style={{ backgroundColor: "#FEF3C7", padding: "8px 20px", borderRadius: 16, border: "1.5px solid #FCD34D", color: "#B45309", fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ⚠️ Hardcoded N × M Endpoints
        </div>
      </div>

      {/* Right Side: MCP PROTOCOL */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 36,
          border: "3.5px solid #06B6D4",
          boxShadow: "0 24px 60px rgba(6, 182, 212, 0.2)",
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#0891B2" }}>MCP PROTOCOL 🔌</div>
          <div style={{ fontSize: 16, color: "#64748B", fontWeight: 800, marginTop: 4 }}>For AI Models</div>
        </div>

        {/* Animated Universal Bus Diagram */}
        <svg width="380" height="200" viewBox="0 0 380 200">
          <circle cx="60" cy="100" r="30" fill="#CFFAFE" stroke="#06B6D4" strokeWidth="3.5" />
          <text x="60" y="106" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0E7490">AI 🤖</text>

          <line x1="100" y1="100" x2="250" y2="100" stroke="#06B6D4" strokeWidth="8" strokeLinecap="round" />
          <line x1="100" y1="100" x2="250" y2="100" stroke="#67E8F9" strokeWidth="3" strokeLinecap="round" />

          <line x1="250" y1="100" x2="300" y2="40" stroke="#10B981" strokeWidth="3" />
          <line x1="250" y1="100" x2="300" y2="100" stroke="#10B981" strokeWidth="3" />
          <line x1="250" y1="100" x2="300" y2="160" stroke="#10B981" strokeWidth="3" />

          <circle cx="320" cy="40" r="22" fill="#D1FAE5" stroke="#10B981" strokeWidth="2.5" />
          <text x="320" y="46" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#065F46">🐙</text>

          <circle cx="320" cy="100" r="22" fill="#D1FAE5" stroke="#10B981" strokeWidth="2.5" />
          <text x="320" y="106" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#065F46">💬</text>

          <circle cx="320" cy="160" r="22" fill="#D1FAE5" stroke="#10B981" strokeWidth="2.5" />
          <text x="320" y="166" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#065F46">🗄️</text>

          <circle cx={100 + packetOffset * 0.75} cy="100" r="7" fill="#10B981" />
        </svg>

        <div style={{ backgroundColor: "#D1FAE5", padding: "8px 20px", borderRadius: 16, border: "1.5px solid #6EE7B7", color: "#065F46", fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ⚡ 1 Universal USB-C Port
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. API SPAGHETTI MATRIX (Stage B+C: Left Side Network Mesh)
// ═══════════════════════════════════════════════════════════
const ApiSpaghettiMatrix: React.FC<{ frame: number; cutB: number; apiSpaghettiCue: number }> = ({ frame, cutB, apiSpaghettiCue }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 540,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #F59E0B",
        boxShadow: "0 24px 80px rgba(245, 158, 11, 0.3)",
        padding: "28px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🍝</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>The N × M Integration Nightmare</span>
        </div>
        <span style={{ backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", border: "1.5px solid #F59E0B", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          MANUAL REWIRING
        </span>
      </div>

      {/* Full Animated SVG Mesh */}
      <svg width="860" height="300" viewBox="0 0 860 300">
        {/* Left Side: 3 AI Clients */}
        <rect x="20" y="30" width="160" height="55" rx="14" fill="#1E293B" stroke="#06B6D4" strokeWidth="2" />
        <text x="100" y="65" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#F8FAFC">Claude 🤖</text>

        <rect x="20" y="120" width="160" height="55" rx="14" fill="#1E293B" stroke="#06B6D4" strokeWidth="2" />
        <text x="100" y="155" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#F8FAFC">Cursor 💻</text>

        <rect x="20" y="210" width="160" height="55" rx="14" fill="#1E293B" stroke="#06B6D4" strokeWidth="2" />
        <text x="100" y="245" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#F8FAFC">Antigravity 🪐</text>

        {/* Right Side: 3 Tools */}
        <rect x="680" y="30" width="160" height="55" rx="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
        <text x="760" y="65" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#F8FAFC">GitHub API 🐙</text>

        <rect x="680" y="120" width="160" height="55" rx="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
        <text x="760" y="155" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#F8FAFC">Slack API 💬</text>

        <rect x="680" y="210" width="160" height="55" rx="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
        <text x="760" y="245" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#F8FAFC">Postgres API 🗄️</text>

        {/* Crisscrossing Tangled Spaghetti Lines */}
        <path d="M 180 57 C 400 57, 460 57, 680 57" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.6" />
        <path d="M 180 57 C 400 57, 460 147, 680 147" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.7" />
        <path d="M 180 57 C 400 57, 460 237, 680 237" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.6" />

        <path d="M 180 147 C 400 147, 460 57, 680 57" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.7" />
        <path d="M 180 147 C 400 147, 460 147, 680 147" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.6" />
        <path d="M 180 147 C 400 147, 460 237, 680 237" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.7" />

        <path d="M 180 237 C 400 237, 460 57, 680 57" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.6" />
        <path d="M 180 237 C 400 237, 460 147, 680 147" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.7" />
        <path d="M 180 237 C 400 237, 460 237, 680 237" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.6" />

        {/* Warning Badges in Center */}
        <circle cx="430" cy="147" r="14" fill="#EF4444" opacity="0.9" />
        <text x="430" y="152" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FFFFFF">⚠️</text>

        <circle cx="360" cy="100" r="12" fill="#EF4444" opacity="0.8" />
        <text x="360" y="104" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">❌</text>

        <circle cx="500" cy="190" r="12" fill="#EF4444" opacity="0.8" />
        <text x="500" y="194" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">❌</text>
      </svg>

      <div style={{ width: "100%", backgroundColor: "#181005", padding: "14px 22px", borderRadius: 18, border: "2px solid #F59E0B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>3 AI Models × 3 Tools = 9 Custom Adapters:</span>
        <span style={{ color: "#F59E0B", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>N × M REWRITE HELL 🍝</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// 3. MCP BUS ARCHITECTURE (Stage D: Right Side Universal Protocol Bus)
// ═══════════════════════════════════════════════════════════
const McpBusArchitecture: React.FC<{ frame: number; cutD: number; usbcPlugCue: number }> = ({ frame, cutD, usbcPlugCue }) => {
  const pulse = (frame * 5) % 260;

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 540,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #06B6D4",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.3)",
        padding: "28px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>🔌</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>Universal Hardware-Style Protocol Bus</span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          STANDARDIZED USB-C
        </span>
      </div>

      {/* High-Tech Circuit Bus Schematic */}
      <svg width="860" height="300" viewBox="0 0 860 300">
        <rect x="20" y="90" width="180" height="120" rx="20" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
        <text x="110" y="135" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#F8FAFC">AI AGENT 🤖</text>
        <text x="110" y="165" textAnchor="middle" fontSize="14" fill="#94A3B8">Claude / Antigravity</text>
        <rect x="80" y="180" width="60" height="18" rx="6" fill="#0891B2" />
        <text x="110" y="193" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">USB-C PORT</text>

        <line x1="200" y1="150" x2="620" y2="150" stroke="#06B6D4" strokeWidth="12" strokeLinecap="round" />
        <line x1="200" y1="150" x2="620" y2="150" stroke="#A5F3FC" strokeWidth="4" strokeLinecap="round" />

        <rect x="340" y="115" width="160" height="30" rx="8" fill="#0891B2" />
        <text x="420" y="135" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#FFFFFF">MCP HIGH-SPEED BUS</text>

        <path d="M 620 150 L 670 60" stroke="#10B981" strokeWidth="3" fill="none" />
        <path d="M 620 150 L 670 150" stroke="#10B981" strokeWidth="3" fill="none" />
        <path d="M 620 150 L 670 240" stroke="#10B981" strokeWidth="3" fill="none" />

        <rect x="670" y="30" width="170" height="60" rx="14" fill="#064E3B" stroke="#10B981" strokeWidth="2.5" />
        <text x="755" y="65" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#A7F3D0">🐙 GitHub MCP</text>

        <rect x="670" y="120" width="170" height="60" rx="14" fill="#064E3B" stroke="#10B981" strokeWidth="2.5" />
        <text x="755" y="155" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#A7F3D0">💬 Slack MCP</text>

        <rect x="670" y="210" width="170" height="60" rx="14" fill="#064E3B" stroke="#10B981" strokeWidth="2.5" />
        <text x="755" y="245" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#A7F3D0">🗄️ Postgres MCP</text>

        <circle cx={200 + pulse * 1.6} cy="150" r="9" fill="#10B981" />
      </svg>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "14px 22px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>1 Standard Client Implementation:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>PLUGS INTO EVERY TOOL ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. DYNAMIC DISCOVERY HANDSHAKE (Stage E: Payoff Tool Injection)
// ═══════════════════════════════════════════════════════════
const DynamicDiscoveryHandshake: React.FC<{ frame: number; cutE: number; toolDiscoveryCue: number; plugAndPlayCue: number }> = ({ frame, cutE, toolDiscoveryCue, plugAndPlayCue }) => {
  const meterVal = interpolate(frame, [cutE, plugAndPlayCue], [20, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 540,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #10B981",
        boxShadow: "0 24px 80px rgba(16, 185, 129, 0.35)",
        padding: "28px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>⚡</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>Live Runtime Tool Injection</span>
        </div>
        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.25)", color: "#10B981", border: "1.5px solid #10B981", padding: "6px 16px", borderRadius: 14, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ZERO MANUAL CODE
        </span>
      </div>

      {/* Interactive Handshake Console */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "16px 20px", borderRadius: 18, border: "2px solid #06B6D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#06B6D4", fontSize: 18, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>1. tools/list 🔍</span>
          <span style={{ color: "#F8FAFC", fontSize: 17, fontWeight: 700 }}>AI dynamically queries server capabilities</span>
          <span style={{ color: "#10B981", fontWeight: 900, fontSize: 17 }}>Discovered ✓</span>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "16px 20px", borderRadius: 18, border: "2px solid #A855F7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#C084FC", fontSize: 18, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>2. tools/call 🚀</span>
          <span style={{ color: "#F8FAFC", fontSize: 17, fontWeight: 700 }}>AI invokes function with runtime JSON schema</span>
          <span style={{ color: "#10B981", fontWeight: 900, fontSize: 17 }}>Executed ✓</span>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "16px 20px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#10B981", fontSize: 18, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>3. Context Sync 🔗</span>
          <span style={{ color: "#F8FAFC", fontSize: 17, fontWeight: 700 }}>Live resources & prompts injected into context</span>
          <span style={{ color: "#10B981", fontWeight: 900, fontSize: 17 }}>Attached ✓</span>
        </div>
      </div>

      {/* Surging Connection Meter */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: "#94A3B8" }}>
          <span>TOOL AUTONOMY STATUS</span>
          <span style={{ color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>{Math.round(meterVal)}% PLUG & PLAY</span>
        </div>
        <div style={{ width: "100%", height: 14, backgroundColor: "#1E293B", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ width: `${meterVal}%`, height: "100%", backgroundColor: "#10B981", boxShadow: "0 0 16px #10B981", borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. COMPARISON VERDICT (Stage F: Takeaway & Loop Seam)
// ═══════════════════════════════════════════════════════════════
const ComparisonVerdict: React.FC<{ frame: number; cutF: number }> = ({ frame, cutF }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: "50%",
        transform: "translateX(-50%)",
        width: 950,
        height: 540,
        backgroundColor: "#0B1120",
        borderRadius: 36,
        border: "3.5px solid #06B6D4",
        boxShadow: "0 24px 80px rgba(6, 182, 212, 0.3)",
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>⚖️</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            FINAL COMPARISON
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(6, 182, 212, 0.25)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "8px 18px", borderRadius: 14, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          TAKEAWAY
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "24px", borderRadius: 22, border: "2.5px solid #F59E0B" }}>
          <div style={{ color: "#F59E0B", fontWeight: 900, fontSize: 26 }}>REST API 📦</div>
          <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, marginTop: 10 }}>• Connects App to App</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• Fixed, hardcoded routes</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• Manual developer code</div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "24px", borderRadius: 22, border: "2.5px solid #10B981" }}>
          <div style={{ color: "#10B981", fontWeight: 900, fontSize: 26 }}>MCP PROTOCOL 🔌</div>
          <div style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800, marginTop: 10 }}>• Connects AI to World</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• Dynamic auto-discovery</div>
          <div style={{ color: "#94A3B8", fontSize: 16, marginTop: 6 }}>• Zero code changes</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#03070D", padding: "18px 24px", borderRadius: 20, border: "1.5px solid rgba(6, 182, 212, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>APIs for apps. MCP for agents!</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 20, fontFamily: nemiTheme.typography.fontFamily.mono }}>SOLVED ✓</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px, sides: 65px)
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
