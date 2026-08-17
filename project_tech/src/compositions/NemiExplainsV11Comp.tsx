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
import cuesData from "../data/nemi_v11_cues.json";

// ═══════════════════════════════════════════════════════════════════
// NEMI EXPLAINS V11 — WHAT ACTUALLY HAPPENS WHEN YOU TYPE GOOGLE.COM?
// CONTINUOUS CINEMATIC JOURNEY & ZERO-OVERLAP ENGINE (~22s @ 30fps)
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

// Network Routing Nodes along the fiber track
const ROUTING_NODES = [
  { id: 1, label: "Home Router", ip: "192.168.1.1", x: 260, y: 520, delay: 0 },
  { id: 2, label: "ISP Fiber Gateway", ip: "10.0.4.1", x: 780, y: 680, delay: 15 },
  { id: 3, label: "Backbone Transit", ip: "72.14.215.1", x: 300, y: 880, delay: 30 },
  { id: 4, label: "Google Edge CDN", ip: "142.250.190.46", x: 760, y: 1040, delay: 45, isDestination: true },
];

export const NemiExplainsV11Comp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Timeline Events Derived from V11 Speaker Orchestration ───
  const evHook = getEvent("v11_narrator_01_hook");
  const evDns = getEvent("v11_narrator_02_dns");
  const evWhere = getEvent("v11_nemi_01_where");
  const evTravel = getEvent("v11_narrator_03_travel");
  const evServer = getEvent("v11_narrator_04_server");
  const evRender = getEvent("v11_narrator_05_render");
  const evPayoff = getEvent("v11_narrator_06_payoff");
  const evFast = getEvent("v11_nemi_02_fast");

  // Semantic Phrase Timing
  const fEnterPress = getCueFrame("v11_narrator_01_hook", "enter_press", evHook.start_frame + 20);
  const fPacketLaunch = getCueFrame("v11_narrator_01_hook", "packet_launch", evHook.start_frame + 50);
  const fDnsLookup = getCueFrame("v11_narrator_02_dns", "dns_lookup_enter", evDns.start_frame + 18);
  const fIpResolved = getCueFrame("v11_narrator_02_dns", "ip_resolved", evDns.start_frame + 45);
  const fNetworkGrid = getCueFrame("v11_narrator_03_travel", "network_grid_enter", evTravel.start_frame + 15);
  const fServerReach = getCueFrame("v11_narrator_03_travel", "server_edge_reach", evTravel.start_frame + 70);
  const fServerProcess = getCueFrame("v11_narrator_04_server", "server_process_light", evServer.start_frame + 15);
  const fResponseLaunch = getCueFrame("v11_narrator_04_server", "response_packet_launch", evServer.start_frame + 45);
  const fDomSnap = getCueFrame("v11_narrator_05_render", "dom_structure_snap", evRender.start_frame + 18);
  const fGoogleUi = getCueFrame("v11_narrator_05_render", "google_ui_illuminate", evRender.start_frame + 48);
  const fPayoffTakeaway = getCueFrame("v11_narrator_06_payoff", "master_takeaway", evPayoff.start_frame + 25);

  // ─── Visual Stages Classification (6 Continuous Beats) ───
  const isInputStage = frame < evDns.start_frame;
  const isDnsStage = frame >= evDns.start_frame && frame < evTravel.start_frame;
  const isTravelStage = frame >= evTravel.start_frame && frame < evServer.start_frame;
  const isServerStage = frame >= evServer.start_frame && frame < evRender.start_frame;
  const isRenderStage = frame >= evRender.start_frame && frame < fPayoffTakeaway;
  const isPayoffStage = frame >= fPayoffTakeaway;

  // ─── Background Theme Selection ───
  const isDarkScene = isDnsStage || isTravelStage || isServerStage;
  const bgColor = isDarkScene ? "#0D1117" : NEMI_THEME.colors.bg.cream;

  // ─── Continuous Camera Transforms ───
  let cameraZoom = 1.0;
  let cameraPanY = 0;

  if (isTravelStage) {
    // Camera smoothly tracks packet racing across network nodes
    cameraZoom = interpolate(frame, [evTravel.start_frame, fServerReach], [1.0, 1.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    cameraPanY = interpolate(frame, [evTravel.start_frame, fServerReach], [0, -100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (isServerStage) {
    cameraZoom = 1.15;
    cameraPanY = -100;
  }

  // ─── Nemi Dynamic Emotional Arc & Non-Overlapping Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;
  let speechStartFrame = 0;
  let nemiX = 160;
  let nemiY = 1660;
  let nemiScale = 1.45;

  if (isInputStage) {
    const hasTyped = frame >= fEnterPress;
    nemiPose = hasTyped ? "pointing" : "thinking";
    nemiX = 880;
    nemiY = 1620;
    nemiScale = 1.5;
  } else if (isDnsStage) {
    const isAsking = frame >= evWhere.start_frame;
    nemiPose = "puzzled";
    nemiX = 220;
    nemiY = 1620;
    nemiScale = 1.5;
    if (isAsking && frame < evWhere.end_frame + 10) {
      nemiSpeech = "Where is that? 🤔";
      speechStartFrame = evWhere.start_frame;
    }
  } else if (isTravelStage) {
    nemiPose = "explaining";
    nemiX = 180;
    nemiY = 1660;
    nemiScale = 1.35;
  } else if (isServerStage) {
    nemiPose = "shocked";
    nemiX = 200;
    nemiY = 1640;
    nemiScale = 1.45;
  } else if (isRenderStage) {
    nemiPose = "aha";
    nemiX = 880;
    nemiY = 1620;
    nemiScale = 1.5;
  } else if (isPayoffStage) {
    nemiPose = "smug";
    nemiX = 540;
    nemiY = 1580;
    nemiScale = 1.65;
    if (frame >= evFast.start_frame) {
      nemiSpeech = "That was fast! 😎⚡";
      speechStartFrame = evFast.start_frame;
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: "hidden", fontFamily: NEMI_THEME.typography.fontDisplay }}>

      {/* Dynamic Ambient Grid & Glows */}
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
              top: "10%",
              left: "25%",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
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
              top: "12%",
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

      {/* Universal Top Brand Header */}
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
            INTERNET PROTOCOLS · WEB ARCHITECTURE
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
          BEAT 1 — BROWSER INPUT & LAUNCH (0.0–3.2s)
         ═══════════════════════════════════════════════════════════ */}
      {isInputStage && (() => {
        const titlePop = spring({ frame, fps, config: NEMI_THEME.springs.snappy });
        const hasEntered = frame >= fEnterPress;
        const packetPop = frame >= fPacketLaunch ? spring({ frame: frame - fPacketLaunch, fps, config: NEMI_THEME.springs.pop }) : 0;
        const packetY = frame >= fPacketLaunch ? interpolate(frame, [fPacketLaunch, fPacketLaunch + 20], [600, 1100], { extrapolateRight: "clamp" }) : 600;

        // Animated typed text
        const urlText = "google.com";
        const charsToShow = Math.min(urlText.length, Math.floor(frame / 2.5));
        const currentTyped = urlText.substring(0, charsToShow);

        return (
          <>
            <div
              style={{
                position: "absolute",
                top: 170,
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
                  backgroundColor: "#FEF3C7",
                  color: "#B45309",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  marginBottom: 14,
                }}
              >
                THE URL JOURNEY
              </span>
              <h1
                style={{
                  fontSize: 58,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: NEMI_THEME.colors.text.headingDark,
                  letterSpacing: -2,
                  margin: 0,
                }}
              >
                You type google.com...
              </h1>
              <p style={{ fontSize: 26, fontWeight: 700, color: "#64748B", marginTop: 10 }}>
                What actually happens after you hit Enter?
              </p>
            </div>

            {/* Sleek Modern Browser Address Bar */}
            <div
              style={{
                position: "absolute",
                top: 440,
                left: 80,
                right: 80,
                padding: "24px 32px",
                borderRadius: 24,
                backgroundColor: "#FFFFFF",
                border: "3px solid #18181B",
                boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 25,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 22 }}>🔒</span>
                <span style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", fontFamily: NEMI_THEME.typography.fontCode }}>
                  https://<span style={{ color: "#2563EB" }}>{currentTyped}</span>
                  {frame % 15 < 8 && <span style={{ color: "#2563EB" }}>|</span>}
                </span>
              </div>

              <div
                style={{
                  padding: "10px 24px",
                  borderRadius: 14,
                  backgroundColor: hasEntered ? "#10B981" : "#F1F5F9",
                  color: hasEntered ? "#FFFFFF" : "#64748B",
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: 1,
                  boxShadow: hasEntered ? "0 0 20px rgba(16, 185, 129, 0.4)" : "none",
                }}
              >
                {hasEntered ? "ENTER ↵" : "RETURN"}
              </div>
            </div>

            {/* Outgoing Request Packet */}
            {packetPop > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: 540 - 130,
                  top: packetY,
                  width: 260,
                  height: 76,
                  borderRadius: 20,
                  backgroundColor: "rgba(6, 182, 212, 0.95)",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 0 35px rgba(6, 182, 212, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  transform: `scale(${packetPop})`,
                  zIndex: 35,
                }}
              >
                <span style={{ fontSize: 20 }}>📦</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#FFFFFF", fontFamily: NEMI_THEME.typography.fontCode }}>
                  HTTP GET /
                </span>
              </div>
            )}
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 2 — THE DNS DIRECTORY LOOKUP (3.2–6.5s)
         ═══════════════════════════════════════════════════════════ */}
      {isDnsStage && (() => {
        const isResolved = frame >= fIpResolved;
        const pop = spring({ frame: frame - evDns.start_frame, fps, config: NEMI_THEME.springs.snappy });

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
                STEP 1: DNS DIRECTORY
              </span>
              <h2 style={{ fontSize: 56, fontWeight: 900, color: "#F8FAFC", letterSpacing: -1.5, margin: 0 }}>
                First, it asks DNS for the address.
              </h2>
            </div>

            {/* DNS Lookup Card Stage */}
            <div
              style={{
                position: "absolute",
                top: 440,
                left: 80,
                right: 80,
                padding: "36px 44px",
                borderRadius: 28,
                backgroundColor: "rgba(24, 24, 27, 0.95)",
                border: `2.5px solid ${isResolved ? NEMI_THEME.colors.brand.emerald : NEMI_THEME.colors.brand.yellow}`,
                boxShadow: isResolved ? "0 0 50px rgba(16, 185, 129, 0.35)" : "0 25px 60px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                transform: `scale(${pop})`,
                zIndex: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#94A3B8", letterSpacing: 1.5 }}>
                  DOMAIN NAME SYSTEM RESOLVER
                </span>
                <span style={{ fontSize: 14, fontWeight: 900, color: isResolved ? "#34D399" : "#FBBF24" }}>
                  {isResolved ? "MATCH FOUND ✓" : "QUERYING ROOT SERVERS..."}
                </span>
              </div>

              {/* Transformation: Domain -> IP */}
              <div
                style={{
                  padding: "24px 32px",
                  borderRadius: 20,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 32, fontWeight: 900, color: "#F8FAFC", fontFamily: NEMI_THEME.typography.fontCode }}>
                  google.com
                </span>
                <span style={{ fontSize: 32, fontWeight: 900, color: NEMI_THEME.colors.brand.yellow }}>
                  ➔
                </span>
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: isResolved ? NEMI_THEME.colors.brand.emeraldGlow : "#64748B",
                    fontFamily: NEMI_THEME.typography.fontCode,
                  }}
                >
                  {isResolved ? "142.250.190.46" : "0.0.0.0"}
                </span>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 3 — CONTINUOUS NETWORK JOURNEY (6.5–11.5s)
         ═══════════════════════════════════════════════════════════ */}
      {isTravelStage && (() => {
        const local = frame - evTravel.start_frame;
        const progress = Math.min(1, local / (evTravel.end_frame - evTravel.start_frame));

        return (
          <>
            <div style={{ position: "absolute", top: 160, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(6, 182, 212, 0.2)",
                  color: NEMI_THEME.colors.brand.cyanGlow,
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 12,
                }}
              >
                STEP 2: GLOBAL NETWORK ROUTING
              </span>
              <h2 style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", letterSpacing: -1.5, margin: 0 }}>
                Races across the global internet grid...
              </h2>
            </div>

            {/* Virtual Network Grid with Continuous Camera Transform */}
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
              {/* Routing Path SVG Connectors */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}>
                {ROUTING_NODES.map((node, i) => {
                  if (i === ROUTING_NODES.length - 1) return null;
                  const next = ROUTING_NODES[i + 1];

                  return (
                    <line
                      key={node.id}
                      x1={node.x - 40}
                      y1={node.y - 320}
                      x2={next.x - 40}
                      y2={next.y - 320}
                      stroke={NEMI_THEME.colors.brand.cyanGlow}
                      strokeWidth={4}
                      strokeDasharray="8 6"
                      opacity={0.8}
                    />
                  );
                })}
              </svg>

              {/* Routing Node Badges */}
              {ROUTING_NODES.map((node, i) => {
                const isLit = progress >= (i / ROUTING_NODES.length);

                return (
                  <div
                    key={node.id}
                    style={{
                      position: "absolute",
                      left: node.x - 40 - 150,
                      top: node.y - 320 - 45,
                      width: 300,
                      height: 90,
                      borderRadius: 20,
                      backgroundColor: isLit ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.05)",
                      border: `2px solid ${isLit ? NEMI_THEME.colors.brand.cyan : "rgba(255, 255, 255, 0.12)"}`,
                      boxShadow: isLit ? "0 0 30px rgba(6, 182, 212, 0.4)" : "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: "0 24px",
                      gap: 4,
                      zIndex: 20,
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 900, color: isLit ? "#FFFFFF" : "#94A3B8" }}>
                      {node.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: isLit ? NEMI_THEME.colors.brand.cyanGlow : "#64748B", fontFamily: NEMI_THEME.typography.fontCode }}>
                      {node.ip}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 4 — SERVER ARRIVAL & RESPONSE (11.5–15.2s)
         ═══════════════════════════════════════════════════════════ */}
      {isServerStage && (() => {
        const isResponseLaunched = frame >= fResponseLaunch;
        const pop = spring({ frame: frame - evServer.start_frame, fps, config: NEMI_THEME.springs.pop });

        return (
          <>
            <div style={{ position: "absolute", top: 180, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  color: NEMI_THEME.colors.brand.emeraldGlow,
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                STEP 3: SERVER RESPONSE
              </span>
              <h2 style={{ fontSize: 56, fontWeight: 900, color: "#FFFFFF", letterSpacing: -1.5, margin: 0 }}>
                Server builds the response...
              </h2>
            </div>

            {/* Google Datacenter Server Rack Card */}
            <div
              style={{
                position: "absolute",
                top: 420,
                left: 80,
                right: 80,
                padding: "36px 44px",
                borderRadius: 28,
                backgroundColor: "rgba(24, 24, 27, 0.95)",
                border: `3px solid ${NEMI_THEME.colors.brand.emerald}`,
                boxShadow: "0 0 50px rgba(16, 185, 129, 0.35)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                transform: `scale(${pop})`,
                zIndex: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: NEMI_THEME.colors.brand.emeraldGlow, letterSpacing: 1.5 }}>
                  GOOGLE EDGE SERVER 0x88
                </span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#34D399" }}>
                  STATUS 200 OK ✓
                </span>
              </div>

              {/* Data Bundle */}
              <div
                style={{
                  padding: "24px 32px",
                  borderRadius: 20,
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 28 }}>📦</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#FFFFFF", fontFamily: NEMI_THEME.typography.fontCode }}>
                    HTTP/2 200 (HTML + CSS + JS)
                  </span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#A7F3D0" }}>
                  42 KB
                </span>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 5 — DOM ASSEMBLY & BROWSER RENDERING (15.2–19.5s)
         ═══════════════════════════════════════════════════════════ */}
      {isRenderStage && (() => {
        const local = frame - evRender.start_frame;
        const pop = spring({ frame: local, fps, config: NEMI_THEME.springs.snappy });
        const isUiLit = frame >= fGoogleUi;

        return (
          <>
            <div style={{ position: "absolute", top: 170, left: 60, right: 60, textAlign: "center", zIndex: 30 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 20px",
                  borderRadius: 9999,
                  backgroundColor: "#FEF3C7",
                  color: "#B45309",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2,
                  marginBottom: 14,
                }}
              >
                STEP 4: BROWSER RENDERING ENGINE
              </span>
              <h1 style={{ fontSize: 56, fontWeight: 900, color: NEMI_THEME.colors.text.headingDark, letterSpacing: -2, margin: 0 }}>
                Paints the page you see ✨
              </h1>
            </div>

            {/* Assembled Google Browser Viewport */}
            <div
              style={{
                position: "absolute",
                top: 380,
                left: 80,
                right: 80,
                height: 480,
                borderRadius: 28,
                backgroundColor: "#FFFFFF",
                border: "3px solid #18181B",
                boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 28,
                transform: `scale(${pop})`,
                zIndex: 20,
              }}
            >
              {/* Google Brand Logo */}
              <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: -2 }}>
                <span style={{ color: "#4285F4" }}>G</span>
                <span style={{ color: "#EA4335" }}>o</span>
                <span style={{ color: "#FBBC05" }}>o</span>
                <span style={{ color: "#4285F4" }}>g</span>
                <span style={{ color: "#34A853" }}>l</span>
                <span style={{ color: "#EA4335" }}>e</span>
              </div>

              {/* Search Bar */}
              <div
                style={{
                  width: "80%",
                  padding: "16px 28px",
                  borderRadius: 9999,
                  border: "2px solid #E2E8F0",
                  backgroundColor: "#F8FAFC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 18, color: "#94A3B8" }}>Search Google or type a URL</span>
                <span style={{ fontSize: 20 }}>🔍</span>
              </div>
            </div>
          </>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════
          BEAT 6 — FINAL PAYOFF & OUTRO (19.5–22.5s)
         ═══════════════════════════════════════════════════════════ */}
      {isPayoffStage && (() => {
        const local = frame - fPayoffTakeaway;
        const pop = spring({ frame: local, fps, config: NEMI_THEME.springs.snappy });

        return (
          <>
            <div
              style={{
                position: "absolute",
                top: 190,
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
                  fontSize: 60,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: NEMI_THEME.colors.text.headingDark,
                  letterSpacing: -2,
                  margin: 0,
                }}
              >
                All of that in milliseconds.
              </h1>
            </div>

            {/* High Density Takeaway Card */}
            <div
              style={{
                position: "absolute",
                top: 440,
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
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(6, 182, 212, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  🔍
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>DNS Finds The Address</div>
                  <div style={{ fontSize: 15, color: "#94A3B8" }}>Converts human domain into server IP.</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255, 209, 102, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>Fiber Network Routing</div>
                  <div style={{ fontSize: 15, color: "#94A3B8" }}>Packets race across global optical cables.</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  🌐
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>Browser Paints The DOM</div>
                  <div style={{ fontSize: 15, color: "#94A3B8" }}>Turns raw HTML/CSS into an interactive page.</div>
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
            left: isInputStage && nemiX > 500 ? undefined : isRenderStage ? undefined : nemiX + 90,
            right: isInputStage && nemiX > 500 ? 100 : isRenderStage ? 100 : undefined,
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
      <Audio src={staticFile("sounds/nemi_v11_master_audio.mp3")} volume={1.0} />
      <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.25} />
    </AbsoluteFill>
  );
};
