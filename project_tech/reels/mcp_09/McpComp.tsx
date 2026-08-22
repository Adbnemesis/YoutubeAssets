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
  const sideBySideCue = getCue("mcp07_loop", "side_by_side_summary"); // 580
  const loopSeamCue = getCue("mcp07_loop", "loop_seam_check"); // 680

  // ─── Stage Boundaries (Hard Punch Cuts) ───
  const cutB = evApiSide.start_frame; // 72 (API Focus)
  const cutD = evMcpSide.start_frame; // 239 (MCP Focus)
  const cutE = evPayoff.start_frame; // 360 (Payoff Discovery)
  const cutF = evNemiPayoff.start_frame - 1; // 500 (Outro Summary)

  // ─── Canvas Worlds ───
  const isDarkWorld = frame >= cutB;
  const canvasBg = isDarkWorld ? nemiTheme.colors.canvasDark : nemiTheme.colors.canvasLight;

  // ─── Camera: Continuous Breathing + Punch Accents ───
  const breathing = interpolate(frame, [0, totalFrames], [1.0, 1.03], {
    extrapolateRight: "clamp",
  });

  const punch = (at: number, amt = 0.045, dur = 7) => {
    const d = frame - at;
    if (at <= 0 || d < 0) return 0;
    return interpolate(d, [0, 2, dur], [amt, amt * 0.5, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const cutSettle = (at: number) => {
    const d = frame - at;
    if (d < 0) return 0;
    return interpolate(d, [0, 5], [0.05, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const punchTotal =
    punch(versusPopCue) +
    punch(splitRevealCue, 0.05) +
    punch(apiSpaghettiCue) +
    punch(mcpGlowCue) +
    punch(usbcPlugCue, 0.055) +
    punch(toolDiscoveryCue, 0.06) +
    punch(loopSeamCue) +
    cutSettle(cutB) +
    cutSettle(cutD) +
    cutSettle(cutE) +
    cutSettle(cutF);

  const cameraScale = breathing + punchTotal;

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
      <Sequence from={versusPopCue + 5} durationInFrames={20}>
        <Audio src={staticFile("reels/mcp_09/sfx/pop.mp3")} volume={0.6} />
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
      <Sequence from={toolDiscoveryCue + 5} durationInFrames={20}>
        <Audio src={staticFile("reels/mcp_09/sfx/pop.mp3")} volume={0.6} />
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
      <Sequence from={loopSeamCue} durationInFrames={30}>
        <Audio src={staticFile("reels/mcp_09/sfx/ping.mp3")} volume={0.7} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CAMERA WRAPPER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ transform: `scale(${cameraScale})` }}>
        {/* AMBIENT GLOW IN DARK WORLD */}
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
                  transform: `scale(${interpolate(frame % 20, [0, 10, 20], [1.0, 1.25, 1.0])})`,
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
        {/* STAGE A — FRAME-0 MONEY SHOT (SIDE-BY-SIDE DUEL OPENER) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageA && (
          <>
            {/* Contradiction overlay: ≤8 Words */}
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
                  fontSize: 56,
                  fontWeight: 900,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                  color: frame >= versusPopCue ? nemiTheme.colors.brandCoral : nemiTheme.colors.textLight,
                  transform: `scale(${
                    frame >= versusPopCue
                      ? interpolate(frame - versusPopCue, [0, 4, 9], [1.2, 1.06, 1.0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })
                      : interpolate(frame, [0, 5], [1.12, 1.0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        })
                  })`,
                  textShadow: frame >= versusPopCue ? "0 0 30px rgba(244, 63, 94, 0.35)" : "none",
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

            {/* Split Screen Dual Columns on Frame 0 */}
            <div
              style={{
                position: "absolute",
                top: 350,
                left: 65,
                right: 65,
                height: 530,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                zIndex: 30,
              }}
            >
              {/* Left Column: API */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 28,
                  border: "3.5px solid #F59E0B",
                  boxShadow: "0 20px 60px rgba(245, 158, 11, 0.2)",
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#D97706" }}>REST API 📦</div>
                  <div style={{ fontSize: 14, color: "#94A3B8", fontWeight: 700, marginTop: 4 }}>For Programmers</div>
                </div>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ backgroundColor: "#FEF3C7", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #FCD34D", color: "#92400E", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    POST /v1/chat
                  </div>
                  <div style={{ backgroundColor: "#FEF3C7", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #FCD34D", color: "#92400E", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    Bearer: sk-auth-xyz
                  </div>
                  <div style={{ backgroundColor: "#FEE2E2", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #FCA5A5", color: "#991B1B", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    ⚠️ Rigid JSON Schema
                  </div>
                </div>

                <div style={{ fontSize: 15, fontWeight: 800, color: "#D97706", textAlign: "center" }}>
                  Hardcoded Endpoints
                </div>
              </div>

              {/* Right Column: MCP */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 28,
                  border: "3.5px solid #06B6D4",
                  boxShadow: "0 20px 60px rgba(6, 182, 212, 0.2)",
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#0891B2" }}>MCP PROTOCOL 🔌</div>
                  <div style={{ fontSize: 14, color: "#94A3B8", fontWeight: 700, marginTop: 4 }}>For AI Models</div>
                </div>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ backgroundColor: "#CFFAFE", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #67E8F9", color: "#155E75", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    tools/list (Auto-Discover)
                  </div>
                  <div style={{ backgroundColor: "#CFFAFE", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #67E8F9", color: "#155E75", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    Universal USB-C Bus
                  </div>
                  <div style={{ backgroundColor: "#D1FAE5", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #6EE7B7", color: "#065F46", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    ⚡ Zero Code Changes
                  </div>
                </div>

                <div style={{ fontSize: 15, fontWeight: 800, color: "#0891B2", textAlign: "center" }}>
                  Dynamic Plug & Play
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE B+C — LEFT SIDE DEEP DIVE (THE API REWIRING TRAP) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageBC && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -1.5, color: "#F59E0B" }}>
                The API Trap: N × M Rewiring
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 350,
                left: 65,
                right: 65,
                height: 530,
                backgroundColor: "#0B1120",
                borderRadius: 32,
                border: "3.5px solid #F59E0B",
                boxShadow: "0 24px 80px rgba(245, 158, 11, 0.35)",
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>📦</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#F8FAFC" }}>Traditional REST API Architecture</span>
                </div>
                <span style={{ backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#F59E0B", border: "1.5px solid #F59E0B", padding: "6px 14px", borderRadius: 12, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  MANUAL REWIRING
                </span>
              </div>

              {/* Spaghetti wiring diagram */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ backgroundColor: "#0F172A", padding: "14px 18px", borderRadius: 16, border: "2px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800 }}>🧑‍💻 Developer</span>
                  <span style={{ color: "#F59E0B", fontSize: 16 }}>writes custom client SDK</span>
                  <span style={{ color: "#06B6D4", fontSize: 18, fontWeight: 800 }}>GitHub API 🐙</span>
                </div>

                <div style={{ backgroundColor: "#0F172A", padding: "14px 18px", borderRadius: 16, border: "2px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800 }}>🧑‍💻 Developer</span>
                  <span style={{ color: "#F59E0B", fontSize: 16 }}>writes new auth headers</span>
                  <span style={{ color: "#A855F7", fontSize: 18, fontWeight: 800 }}>Slack API 💬</span>
                </div>

                <div style={{ backgroundColor: "#0F172A", padding: "14px 18px", borderRadius: 16, border: "2px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 800 }}>🧑‍💻 Developer</span>
                  <span style={{ color: "#F43F5E", fontSize: 16 }}>re-deploys full application</span>
                  <span style={{ color: "#10B981", fontSize: 18, fontWeight: 800 }}>Postgres API 🗄️</span>
                </div>
              </div>

              <div style={{ width: "100%", backgroundColor: "#181005", padding: "14px 18px", borderRadius: 16, border: "2px solid #F59E0B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#F8FAFC", fontSize: 17 }}>If you connect 10 AI models to 10 tools:</span>
                <span style={{ color: "#F59E0B", fontWeight: 900, fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>100 CUSTOM APIS! 🍝</span>
              </div>

              <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                Every single integration requires human code edits!
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE D — RIGHT SIDE DEEP DIVE (MCP IS USB-C FOR AI) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageD && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -1.5, color: "#06B6D4" }}>
                The Solution: USB-C for AI 🔌
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 350,
                left: 65,
                right: 65,
                height: 530,
                backgroundColor: "#0B1120",
                borderRadius: 32,
                border: "3.5px solid #06B6D4",
                boxShadow: "0 24px 80px rgba(6, 182, 212, 0.35)",
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>🔌</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#F8FAFC" }}>Model Context Protocol Standard</span>
                </div>
                <span style={{ backgroundColor: "rgba(6, 182, 212, 0.2)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 14px", borderRadius: 12, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  UNIVERSAL PROTOCOL
                </span>
              </div>

              {/* Universal Hub Visual */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ backgroundColor: "#0F172A", padding: "18px 20px", borderRadius: 18, border: "2px solid #06B6D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 32 }}>🤖</span>
                    <div>
                      <div style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 900 }}>AI Client / Agent</div>
                      <div style={{ color: "#94A3B8", fontSize: 13 }}>Claude, Antigravity, Cursor</div>
                    </div>
                  </div>
                  <span style={{ backgroundColor: "rgba(6, 182, 212, 0.25)", color: "#06B6D4", padding: "6px 16px", borderRadius: 12, fontSize: 15, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                    ONE SINGLE MCP PORT ⚡
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "1.5px solid #1E293B", textAlign: "center" }}>
                    <div style={{ fontSize: 24 }}>🐙</div>
                    <div style={{ color: "#F8FAFC", fontSize: 16, fontWeight: 800, marginTop: 4 }}>GitHub MCP</div>
                  </div>
                  <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "1.5px solid #1E293B", textAlign: "center" }}>
                    <div style={{ fontSize: 24 }}>💬</div>
                    <div style={{ color: "#F8FAFC", fontSize: 16, fontWeight: 800, marginTop: 4 }}>Slack MCP</div>
                  </div>
                  <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "1.5px solid #1E293B", textAlign: "center" }}>
                    <div style={{ fontSize: 24 }}>🗄️</div>
                    <div style={{ color: "#F8FAFC", fontSize: 16, fontWeight: 800, marginTop: 4 }}>Postgres MCP</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                1 Protocol replaces thousands of custom API integrations!
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE E — THE PAYOFF: DYNAMIC TOOL DISCOVERY (58% MARK) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageE && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -1.5, color: "#10B981" }}>
                The Payoff: Dynamic Auto-Discovery! ⚡
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 350,
                left: 65,
                right: 65,
                height: 530,
                backgroundColor: "#0B1120",
                borderRadius: 32,
                border: "3.5px solid #10B981",
                boxShadow: "0 24px 80px rgba(16, 185, 129, 0.4)",
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 30,
              }}
            >
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>⚡</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#10B981" }}>Runtime Tool Execution</span>
                </div>
                <span style={{ backgroundColor: "rgba(16, 185, 129, 0.25)", color: "#10B981", border: "1.5px solid #10B981", padding: "6px 14px", borderRadius: 12, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  ZERO MANUAL CODE
                </span>
              </div>

              {/* Dynamic handshake flow */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ backgroundColor: "#0F172A", padding: "14px 18px", borderRadius: 16, border: "2px solid #06B6D4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#06B6D4", fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>1. tools/list</span>
                  <span style={{ color: "#F8FAFC", fontSize: 16 }}>AI asks what capabilities exist</span>
                  <span style={{ color: "#10B981", fontWeight: 900 }}>Auto-Discovered ✓</span>
                </div>

                <div style={{ backgroundColor: "#0F172A", padding: "14px 18px", borderRadius: 16, border: "2px solid #A855F7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#C084FC", fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>2. tools/call</span>
                  <span style={{ color: "#F8FAFC", fontSize: 16 }}>AI invokes parameters dynamically</span>
                  <span style={{ color: "#10B981", fontWeight: 900 }}>Executed ✓</span>
                </div>

                <div style={{ backgroundColor: "#0F172A", padding: "14px 18px", borderRadius: 16, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#10B981", fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>3. Context Sync</span>
                  <span style={{ color: "#F8FAFC", fontSize: 16 }}>Live database & file streams attached</span>
                  <span style={{ color: "#10B981", fontWeight: 900 }}>Connected ✓</span>
                </div>
              </div>

              <div style={{ width: "100%", backgroundColor: "#03140C", padding: "16px 20px", borderRadius: 18, border: "2px solid #10B981", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>Plug in any new tool:</span>
                <span style={{ color: "#10B981", fontWeight: 900, fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>INSTANTLY AVAILABLE! 🚀</span>
              </div>

              <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                The AI adapts itself without writing a single line of backend glue code!
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* STAGE F — LOOP SEAM & COMPARISON SUMMARY (DARK MODE SLEEK) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {inStageF && (
          <>
            <div style={{ position: "absolute", top: 165, left: 70, right: 70, textAlign: "center", zIndex: 55 }}>
              <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: -1.5, color: "#06B6D4" }}>
                The Golden Rule: API vs MCP
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 350,
                left: 65,
                right: 65,
                height: 530,
                backgroundColor: "#0B1120",
                borderRadius: 32,
                border: "3.5px solid #06B6D4",
                boxShadow: "0 24px 80px rgba(6, 182, 212, 0.35)",
                padding: "26px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                zIndex: 30,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>⚖️</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    FINAL COMPARISON
                  </span>
                </div>
                <span style={{ backgroundColor: "rgba(6, 182, 212, 0.25)", color: "#06B6D4", border: "1.5px solid #06B6D4", padding: "6px 14px", borderRadius: 12, fontSize: 16, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
                  TAKEAWAY
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ backgroundColor: "#0F172A", padding: "18px", borderRadius: 20, border: "2.5px solid #F59E0B" }}>
                  <div style={{ color: "#F59E0B", fontWeight: 900, fontSize: 22 }}>REST API 📦</div>
                  <div style={{ color: "#F8FAFC", fontSize: 16, fontWeight: 700, marginTop: 8 }}>• Connects App to App</div>
                  <div style={{ color: "#94A3B8", fontSize: 15, marginTop: 4 }}>• Fixed, rigid endpoints</div>
                  <div style={{ color: "#94A3B8", fontSize: 15, marginTop: 4 }}>• Manual developer code</div>
                </div>

                <div style={{ backgroundColor: "#0F172A", padding: "18px", borderRadius: 20, border: "2.5px solid #10B981" }}>
                  <div style={{ color: "#10B981", fontWeight: 900, fontSize: 22 }}>MCP PROTOCOL 🔌</div>
                  <div style={{ color: "#F8FAFC", fontSize: 16, fontWeight: 700, marginTop: 8 }}>• Connects AI to World</div>
                  <div style={{ color: "#94A3B8", fontSize: 15, marginTop: 4 }}>• Dynamic auto-discovery</div>
                  <div style={{ color: "#94A3B8", fontSize: 15, marginTop: 4 }}>• Zero code changes</div>
                </div>
              </div>

              <div style={{ backgroundColor: "#03070D", padding: "16px 20px", borderRadius: 18, border: "1.5px solid rgba(6, 182, 212, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>APIs for apps. MCP for agents!</span>
                <span style={{ color: "#10B981", fontWeight: 900, fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>SOLVED ✓</span>
              </div>

              <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                Share with a developer building AI agents! 👇
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} fps={fps} />}
      </AbsoluteFill>

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
              boxShadow: "0 18px 45px rgba(0, 0, 0, 0.5)",
              transform: `scale(${interpolate(frame % 30, [0, 15, 30], [1.0, 1.05, 1.0])})`,
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
          const wordPop = isWordActive
            ? interpolate(frame - w.start_frame, [0, 3, 7], [1.0, 1.18, 1.08], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1.0;

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
};
