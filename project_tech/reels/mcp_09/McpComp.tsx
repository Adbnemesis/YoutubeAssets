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

  // ─── Stage Boundaries ───
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
      {/* AMBIENT BACKGROUND GLOW */}
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
      {/* TOP HUD (Appears strictly AFTER Second 2 — Frame 60+) */}
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
      {/* STAGE A — FRAME-0 HOOK: LIVING SIDE-BY-SIDE SHOWDOWN */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageA && (
        <>
          <div style={{ position: "absolute", top: 180, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
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

          <LivingDualHeroCard frame={frame} versusPopCue={versusPopCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE B+C — LEFT SIDE: LIVING $N \times M$ SPAGHETTI MESH */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageBC && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#F59E0B" }}>
              The API Trap: N × M Rewiring
            </div>
          </div>

          <LivingApiSpaghettiMesh frame={frame} cutB={cutB} apiSpaghettiCue={apiSpaghettiCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE D — RIGHT SIDE: LIVING MCP UNIVERSAL BUS */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageD && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#06B6D4" }}>
              The Solution: USB-C for AI 🔌
            </div>
          </div>

          <LivingMcpBusArchitecture frame={frame} cutD={cutD} usbcPlugCue={usbcPlugCue} />
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STAGE E — THE PAYOFF: LIVING DYNAMIC DISCOVERY & METER */}
      {/* ══════════════════════════════════════════════════════════ */}
      {inStageE && (
        <>
          <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -1.5, color: "#10B981" }}>
              The Payoff: Auto-Discovery! ⚡
            </div>
          </div>

          <LivingDynamicDiscoveryHandshake frame={frame} cutE={cutE} toolDiscoveryCue={toolDiscoveryCue} plugAndPlayCue={plugAndPlayCue} />
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

          <LivingComparisonVerdict frame={frame} cutF={cutF} />
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
// 1. LIVING DUAL HERO CARD (Stage A: Active Moving Data Streams)
// ═══════════════════════════════════════════════════════════════
const LivingDualHeroCard: React.FC<{ frame: number; versusPopCue: number }> = ({ frame, versusPopCue }) => {
  const dashOffset = -frame * 6;
  const pulse1 = (frame * 4) % 200;
  const pulse2 = ((frame + 40) * 4) % 200;

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
      {/* Left: REST API (Moving Tangled Cables) */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 36,
          border: "3.5px solid #F59E0B",
          boxShadow: "0 24px 60px rgba(245, 158, 11, 0.2)",
          padding: "24px 20px",
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

        {/* Animated Moving SVG Wire Network */}
        <svg width="400" height="220" viewBox="0 0 400 220">
          <circle cx="50" cy="110" r="30" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
          <text x="50" y="116" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#B45309">APP 💻</text>

          {/* 3 Hardcoded Server Nodes */}
          <circle cx="340" cy="40" r="22" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
          <text x="340" y="46" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#991B1B">DB</text>

          <circle cx="340" cy="110" r="22" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
          <text x="340" y="116" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#991B1B">API</text>

          <circle cx="340" cy="180" r="22" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
          <text x="340" y="186" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#991B1B">AUTH</text>

          {/* Moving Dashed Wires */}
          <path d="M 80 110 Q 200 40 318 40" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8 6" strokeDashoffset={dashOffset} />
          <path d="M 80 110 L 318 110" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="8 6" strokeDashoffset={dashOffset * 1.2} />
          <path d="M 80 110 Q 200 180 318 180" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8 6" strokeDashoffset={dashOffset * 0.9} />

          {/* Active moving packets */}
          <circle cx={80 + pulse1 * 1.15} cy={110 - Math.sin(pulse1 * 0.03) * 45} r="6" fill="#EF4444" />
          <circle cx={80 + pulse2 * 1.15} cy={110 + Math.sin(pulse2 * 0.03) * 45} r="6" fill="#F59E0B" />
        </svg>

        <div style={{ backgroundColor: "#FEF3C7", padding: "8px 20px", borderRadius: 16, border: "1.5px solid #FCD34D", color: "#B45309", fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ⚠️ Hardcoded N × M Endpoints
        </div>
      </div>

      {/* Right: MCP PROTOCOL (Moving Universal Bus Bar) */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 36,
          border: "3.5px solid #06B6D4",
          boxShadow: "0 24px 60px rgba(6, 182, 212, 0.2)",
          padding: "24px 20px",
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

        {/* Animated Universal Bus with Continuous Flow */}
        <svg width="400" height="220" viewBox="0 0 400 220">
          <circle cx="50" cy="110" r="30" fill="#CFFAFE" stroke="#06B6D4" strokeWidth="3.5" />
          <text x="50" y="116" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0E7490">AI 🤖</text>

          {/* Central High-Speed Bus Bar with moving pulse */}
          <line x1="90" y1="110" x2="260" y2="110" stroke="#06B6D4" strokeWidth="10" strokeLinecap="round" />
          <line x1="90" y1="110" x2="260" y2="110" stroke="#A5F3FC" strokeWidth="4" strokeDasharray="10 8" strokeDashoffset={dashOffset * 2} strokeLinecap="round" />

          {/* Drop lines to 3 tools */}
          <line x1="260" y1="110" x2="318" y2="40" stroke="#10B981" strokeWidth="3" strokeDasharray="6 4" strokeDashoffset={dashOffset} />
          <line x1="260" y1="110" x2="318" y2="110" stroke="#10B981" strokeWidth="3" strokeDasharray="6 4" strokeDashoffset={dashOffset} />
          <line x1="260" y1="110" x2="318" y2="180" stroke="#10B981" strokeWidth="3" strokeDasharray="6 4" strokeDashoffset={dashOffset} />

          <circle cx="340" cy="40" r="22" fill="#D1FAE5" stroke="#10B981" strokeWidth="2.5" />
          <text x="340" y="46" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#065F46">🐙</text>

          <circle cx="340" cy="110" r="22" fill="#D1FAE5" stroke="#10B981" strokeWidth="2.5" />
          <text x="340" y="116" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#065F46">💬</text>

          <circle cx="340" cy="180" r="22" fill="#D1FAE5" stroke="#10B981" strokeWidth="2.5" />
          <text x="340" y="186" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#065F46">🗄️</text>

          {/* Glowing Green Data Beams */}
          <circle cx={90 + ((frame * 6) % 170)} cy="110" r="7" fill="#10B981" />
          <circle cx={90 + (((frame + 40) * 6) % 170)} cy="110" r="7" fill="#06B6D4" />
        </svg>

        <div style={{ backgroundColor: "#D1FAE5", padding: "8px 20px", borderRadius: 16, border: "1.5px solid #6EE7B7", color: "#065F46", fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ⚡ 1 Universal USB-C Port
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2. LIVING API SPAGHETTI MESH (Stage B+C: Moving 9-Cable Nightmare)
// ═══════════════════════════════════════════════════════════════
const LivingApiSpaghettiMesh: React.FC<{ frame: number; cutB: number; apiSpaghettiCue: number }> = ({ frame, cutB, apiSpaghettiCue }) => {
  const dashOffset = -frame * 7;
  const pulse = Math.sin(frame * 0.25);
  const latency = 240 + Math.round(Math.sin(frame * 0.15) * 80);

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
        padding: "24px 36px",
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
          JITTER: {latency}ms ⚡
        </span>
      </div>

      {/* Living SVG Mesh with Streaming Lines */}
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

        {/* 9 Tangled Animated Streaming Lines */}
        <path d="M 180 57 C 400 57, 460 57, 680 57" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 6" strokeDashoffset={dashOffset} opacity="0.8" />
        <path d="M 180 57 C 400 57, 460 147, 680 147" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="8 6" strokeDashoffset={dashOffset * 1.3} opacity="0.9" />
        <path d="M 180 57 C 400 57, 460 237, 680 237" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 6" strokeDashoffset={dashOffset * 0.9} opacity="0.8" />

        <path d="M 180 147 C 400 147, 460 57, 680 57" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="8 6" strokeDashoffset={dashOffset * 1.1} opacity="0.9" />
        <path d="M 180 147 C 400 147, 460 147, 680 147" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 6" strokeDashoffset={dashOffset} opacity="0.8" />
        <path d="M 180 147 C 400 147, 460 237, 680 237" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="8 6" strokeDashoffset={dashOffset * 1.4} opacity="0.9" />

        <path d="M 180 237 C 400 237, 460 57, 680 57" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 6" strokeDashoffset={dashOffset * 0.8} opacity="0.8" />
        <path d="M 180 237 C 400 237, 460 147, 680 147" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="8 6" strokeDashoffset={dashOffset * 1.2} opacity="0.9" />
        <path d="M 180 237 C 400 237, 460 237, 680 237" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 6" strokeDashoffset={dashOffset} opacity="0.8" />

        {/* Pulsing Collision Nodes */}
        <g transform={`translate(430, 147) scale(${1 + pulse * 0.15})`}>
          <circle cx="0" cy="0" r="16" fill="#EF4444" />
          <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FFFFFF">⚠️</text>
        </g>
        <g transform={`translate(360, 100) scale(${1 - pulse * 0.15})`}>
          <circle cx="0" cy="0" r="14" fill="#EF4444" />
          <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">❌</text>
        </g>
        <g transform={`translate(500, 190) scale(${1 + pulse * 0.2})`}>
          <circle cx="0" cy="0" r="14" fill="#EF4444" />
          <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">❌</text>
        </g>
      </svg>

      <div style={{ width: "100%", backgroundColor: "#181005", padding: "12px 22px", borderRadius: 18, border: "2px solid #F59E0B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>3 AI Models × 3 Tools = 9 Custom Adapters:</span>
        <span style={{ color: "#F59E0B", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>N × M REWRITE HELL 🍝</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3. LIVING MCP BUS ARCHITECTURE (Stage D: Moving High-Speed Bus)
// ═══════════════════════════════════════════════════════════════
const LivingMcpBusArchitecture: React.FC<{ frame: number; cutD: number; usbcPlugCue: number }> = ({ frame, cutD, usbcPlugCue }) => {
  const streamOffset = -frame * 12;
  const packetRate = 1200 + Math.round(Math.sin(frame * 0.2) * 300);

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
        padding: "24px 36px",
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
          STREAM: {packetRate} PKTS/S ⚡
        </span>
      </div>

      {/* Living Circuit Bus with Multi-Lane Light Beams */}
      <svg width="860" height="300" viewBox="0 0 860 300">
        {/* Universal AI Agent Node */}
        <rect x="20" y="90" width="180" height="120" rx="20" fill="#1E293B" stroke="#06B6D4" strokeWidth="3" />
        <text x="110" y="135" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#F8FAFC">AI AGENT 🤖</text>
        <text x="110" y="165" textAnchor="middle" fontSize="14" fill="#94A3B8">Claude / Antigravity</text>
        <rect x="80" y="180" width="60" height="18" rx="6" fill="#0891B2" />
        <text x="110" y="193" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FFFFFF">USB-C PORT</text>

        {/* Central High-Speed Glowing Bus Trunk */}
        <line x1="200" y1="150" x2="620" y2="150" stroke="#06B6D4" strokeWidth="14" strokeLinecap="round" />
        <line x1="200" y1="150" x2="620" y2="150" stroke="#A5F3FC" strokeWidth="5" strokeDasharray="14 10" strokeDashoffset={streamOffset} strokeLinecap="round" />

        {/* Protocol Label */}
        <rect x="340" y="115" width="160" height="30" rx="8" fill="#0891B2" />
        <text x="420" y="135" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#FFFFFF">MCP HIGH-SPEED BUS</text>

        {/* Drop Connectors with Streaming Dashes */}
        <path d="M 620 150 L 670 60" stroke="#10B981" strokeWidth="3.5" strokeDasharray="8 6" strokeDashoffset={streamOffset} fill="none" />
        <path d="M 620 150 L 670 150" stroke="#10B981" strokeWidth="3.5" strokeDasharray="8 6" strokeDashoffset={streamOffset} fill="none" />
        <path d="M 620 150 L 670 240" stroke="#10B981" strokeWidth="3.5" strokeDasharray="8 6" strokeDashoffset={streamOffset} fill="none" />

        {/* Tool Cartridges */}
        <rect x="670" y="30" width="170" height="60" rx="14" fill="#064E3B" stroke="#10B981" strokeWidth="2.5" />
        <text x="755" y="65" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#A7F3D0">🐙 GitHub MCP</text>

        <rect x="670" y="120" width="170" height="60" rx="14" fill="#064E3B" stroke="#10B981" strokeWidth="2.5" />
        <text x="755" y="155" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#A7F3D0">💬 Slack MCP</text>

        <rect x="670" y="210" width="170" height="60" rx="14" fill="#064E3B" stroke="#10B981" strokeWidth="2.5" />
        <text x="755" y="245" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#A7F3D0">🗄️ Postgres MCP</text>

        {/* Multi-Particle Light Waves */}
        <circle cx={200 + ((frame * 8) % 420)} cy="150" r="8" fill="#10B981" />
        <circle cx={200 + (((frame + 25) * 8) % 420)} cy="150" r="8" fill="#FFD166" />
        <circle cx={200 + (((frame + 50) * 8) % 420)} cy="150" r="8" fill="#06B6D4" />
      </svg>

      <div style={{ width: "100%", backgroundColor: "#022C22", padding: "12px 22px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>1 Standard Client Implementation:</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>PLUGS INTO EVERY TOOL ⚡</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4. LIVING DYNAMIC DISCOVERY & METER (Stage E: Radar Sweep & Charging Meter)
// ═══════════════════════════════════════════════════════════════
const LivingDynamicDiscoveryHandshake: React.FC<{ frame: number; cutE: number; toolDiscoveryCue: number; plugAndPlayCue: number }> = ({ frame, cutE, toolDiscoveryCue, plugAndPlayCue }) => {
  const meterVal = interpolate(frame, [cutE, plugAndPlayCue], [15, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const radarSweep = (frame * 10) % 860;

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
        padding: "24px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Moving Radar Line across the card */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: radarSweep,
          width: 6,
          background: "linear-gradient(to bottom, transparent, #10B981, transparent)",
          boxShadow: "0 0 20px #10B981",
          pointerEvents: "none",
          zIndex: 40,
          opacity: 0.75,
        }}
      />

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

      {/* Surging Connection Meter actively filling */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#94A3B8" }}>
          <span>TOOL AUTONOMY GAUGE</span>
          <span style={{ color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>{Math.round(meterVal)}% PLUG & PLAY ⚡</span>
        </div>
        <div style={{ width: "100%", height: 18, backgroundColor: "#1E293B", borderRadius: 10, overflow: "hidden", border: "1.5px solid #334155" }}>
          <div style={{ width: `${meterVal}%`, height: "100%", background: "linear-gradient(to right, #06B6D4, #10B981)", boxShadow: "0 0 20px #10B981", borderRadius: 10 }} />
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. LIVING COMPARISON VERDICT (Stage F: Takeaway & Loop Seam)
// ═══════════════════════════════════════════════════════════════
const LivingComparisonVerdict: React.FC<{ frame: number; cutF: number }> = ({ frame, cutF }) => {
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
