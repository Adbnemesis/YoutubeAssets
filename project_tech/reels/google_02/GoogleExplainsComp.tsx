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
import cuesData from "../../src/data/google_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    canvasLight: "#FAF8F5",
    textHeading: "#18181B",
    textMuted: "#64748B",
    borderSubtle: "#E2E8F0",
  },
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// NEMI EXPLAINS REEL #2 — WHAT ACTUALLY HAPPENS WHEN YOU TYPE GOOGLE.COM?
// +10% HIGH-VISIBILITY SCALE ENHANCEMENT (~19.72s @ 30fps)
// ═══════════════════════════════════════════════════════════════

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

export const GoogleExplainsComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Timeline Events Derived from Speaker Orchestration ───
  const evHook = getEvent("g01_hook");
  const evDns = getEvent("g02_dns");
  const evWhere = getEvent("g03_nemi_where");
  const evTravel = getEvent("g04_fiber");
  const evServer = getEvent("g05_server");
  const evRender = getEvent("g06_render");
  const evPayoff = getEvent("g07_payoff");
  const evFast = getEvent("g08_nemi_fast");

  // Exact Cue Timestamps
  const fEnterPress = getCueFrame("g01_hook", "enter_press", evHook.start_frame + 36);
  const fPacketLaunch = getCueFrame("g01_hook", "packet_launch", evHook.start_frame + 78);
  const fDnsLookup = getCueFrame("g02_dns", "dns_lookup_enter", evDns.start_frame + 22);
  const fIpResolved = getCueFrame("g02_dns", "ip_resolved", evDns.start_frame + 54);
  const fNetworkGrid = getCueFrame("g04_fiber", "network_grid_enter", evTravel.start_frame + 27);
  const fServerReach = getCueFrame("g04_fiber", "server_edge_reach", evTravel.start_frame + 93);
  const fServerProcess = getCueFrame("g05_server", "server_process_light", evServer.start_frame + 21);
  const fResponseLaunch = getCueFrame("g05_server", "response_packet_launch", evServer.start_frame + 53);
  const fDomSnap = getCueFrame("g06_render", "dom_structure_snap", evRender.start_frame + 29);
  const fGoogleUi = getCueFrame("g06_render", "google_ui_illuminate", evRender.start_frame + 58);
  const fPayoffTakeaway = getCueFrame("g07_payoff", "master_takeaway", evPayoff.start_frame + 30);

  // ─── Continuous Background Interpolation ───
  const darkFade = interpolate(
    frame,
    [evDns.start_frame - 10, evDns.start_frame + 10, evRender.start_frame - 10, evRender.start_frame + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ─── Global Cinematic Camera Motion ───
  const cameraScale = interpolate(
    frame,
    [0, 36, 42, 110, 213, 326, 404, 493, 592],
    [1.0, 1.03, 1.01, 1.02, 1.05, 1.03, 1.04, 1.02, 1.0],
    { extrapolateRight: "clamp" }
  );

  // ─── Nemi Dynamic Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < evDns.start_frame) {
    nemiPose = frame >= fEnterPress ? "pointing" : "thinking";
  } else if (frame >= evDns.start_frame && frame < evTravel.start_frame) {
    nemiPose = "puzzled";
    if (frame >= evWhere.start_frame && frame < evWhere.end_frame + 12) {
      nemiSpeech = "Where is that? 🤔";
    }
  } else if (frame >= evTravel.start_frame && frame < evServer.start_frame) {
    nemiPose = "explaining";
  } else if (frame >= evServer.start_frame && frame < evRender.start_frame) {
    nemiPose = "shocked";
  } else if (frame >= evRender.start_frame && frame < fPayoffTakeaway) {
    nemiPose = "aha";
  } else {
    nemiPose = "smug";
    if (frame >= evFast.start_frame) {
      nemiSpeech = "That was fast! 😎⚡";
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: darkFade > 0.5 ? "#070B12" : nemiTheme.colors.canvasLight,
        overflow: "hidden",
        fontFamily: nemiTheme.typography.fontFamily.sans,
        transition: "background-color 0.4s ease",
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Voice + Ducked Synthwave BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/google_02/google_master_audio.mp3")} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* RICH SYNCHRONIZED SOUND EFFECTS LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={10} durationInFrames={30}>
        <Audio src={staticFile("reels/google_02/sfx/typing.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={fEnterPress} durationInFrames={30}>
        <Audio src={staticFile("reels/google_02/sfx/click.mp3")} volume={0.8} />
      </Sequence>
      <Sequence from={fPacketLaunch} durationInFrames={30}>
        <Audio src={staticFile("reels/google_02/sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={fIpResolved} durationInFrames={35}>
        <Audio src={staticFile("reels/google_02/sfx/ping.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={evWhere.start_frame} durationInFrames={35}>
        <Audio src={staticFile("reels/google_02/sfx/pop.mp3")} volume={0.65} />
      </Sequence>
      <Sequence from={fNetworkGrid} durationInFrames={35}>
        <Audio src={staticFile("reels/google_02/sfx/whoosh.mp3")} volume={0.55} />
      </Sequence>
      <Sequence from={fServerProcess} durationInFrames={40}>
        <Audio src={staticFile("reels/google_02/sfx/notification.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={fGoogleUi} durationInFrames={35}>
        <Audio src={staticFile("reels/google_02/sfx/pop.mp3")} volume={0.7} />
      </Sequence>
      <Sequence from={fPayoffTakeaway} durationInFrames={60}>
        <Audio src={staticFile("reels/google_02/sfx/chime.mp3")} volume={0.85} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PERSISTENT HEADER HUD (+10% Boosted) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 55,
          right: 55,
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
              backgroundColor: darkFade > 0.5 ? "#38BDF8" : "#2563EB",
              boxShadow: darkFade > 0.5 ? "0 0 20px #38BDF8" : "none",
            }}
          />
          <span
            style={{
              fontSize: 25,
              fontWeight: 900,
              letterSpacing: "1.5px",
              color: darkFade > 0.5 ? "#94A3B8" : nemiTheme.colors.textMuted,
              textTransform: "uppercase",
            }}
          >
            Internet Architecture
          </span>
        </div>

        <div
          style={{
            backgroundColor: darkFade > 0.5 ? "rgba(15, 23, 42, 0.88)" : "#FFFFFF",
            padding: "12px 24px",
            borderRadius: 24,
            border: darkFade > 0.5 ? "1.5px solid #1E293B" : `1.5px solid ${nemiTheme.colors.borderSubtle}`,
            fontSize: 19,
            fontWeight: 900,
            color: darkFade > 0.5 ? "#38BDF8" : nemiTheme.colors.brandCyan,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          {frame < evDns.start_frame && "STAGE 1/5: CLIENT"}
          {frame >= evDns.start_frame && frame < evTravel.start_frame && "STAGE 2/5: DNS"}
          {frame >= evTravel.start_frame && frame < evServer.start_frame && "STAGE 3/5: BGP ROUTING"}
          {frame >= evServer.start_frame && frame < evRender.start_frame && "STAGE 4/5: EDGE SERVER"}
          {frame >= evRender.start_frame && frame < fPayoffTakeaway && "STAGE 5/5: DOM ENGINE"}
          {frame >= fPayoffTakeaway && "COMPLETE: 64ms"}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOPIC BANNER (+10% Boosted to 56px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 55,
          right: 55,
          zIndex: 50,
        }}
      >
        <h1
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: darkFade > 0.5 ? "#F8FAFC" : nemiTheme.colors.textHeading,
            letterSpacing: "-1.5px",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          What Happens When You Type{" "}
          <span style={{ color: nemiTheme.colors.brandCyan }}>google.com</span>?
        </h1>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CONTINUOUS MULTI-STAGE STAGE MANAGER (Top Cards) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* STAGE 1: BROWSER ADDRESS BAR & ENTER IGNITION */}
        <StageWrapper frame={frame} startFrame={0} endFrame={evDns.start_frame + 6}>
          <Beat1AddressBar
            frame={frame}
            fps={fps}
            fEnterPress={fEnterPress}
            fPacketLaunch={fPacketLaunch}
          />
        </StageWrapper>

        {/* STAGE 2: RECURSIVE DNS RESOLUTION MATRIX */}
        <StageWrapper frame={frame} startFrame={evDns.start_frame} endFrame={evTravel.start_frame + 6}>
          <Beat2DnsResolution
            frame={frame}
            fps={fps}
            startFrame={evDns.start_frame}
            fIpResolved={fIpResolved}
          />
        </StageWrapper>

        {/* STAGE 3: UNDERSEA FIBER & BGP ROUTING GRID */}
        <StageWrapper frame={frame} startFrame={evTravel.start_frame} endFrame={evServer.start_frame + 6}>
          <Beat3FiberRouting
            frame={frame}
            fps={fps}
            startFrame={evTravel.start_frame}
            fServerReach={fServerReach}
          />
        </StageWrapper>

        {/* STAGE 4: GOOGLE EDGE SERVER & TLS 1.3 HANDSHAKE */}
        <StageWrapper frame={frame} startFrame={evServer.start_frame} endFrame={evRender.start_frame + 6}>
          <Beat4EdgeServer
            frame={frame}
            fps={fps}
            startFrame={evServer.start_frame}
            fResponseLaunch={fResponseLaunch}
          />
        </StageWrapper>

        {/* STAGE 5: CRITICAL RENDERING PATH & DOM PAINT */}
        <StageWrapper frame={frame} startFrame={evRender.start_frame} endFrame={fPayoffTakeaway + 6}>
          <Beat5DomRendering
            frame={frame}
            fps={fps}
            startFrame={evRender.start_frame}
            fGoogleUi={fGoogleUi}
          />
        </StageWrapper>

        {/* STAGE 6: 3-POINT CS TAKEAWAY & 64ms LATENCY PAYOFF */}
        <StageWrapper frame={frame} startFrame={fPayoffTakeaway} endFrame={592}>
          <Beat6TakeawayConsole
            frame={frame}
            fps={fps}
            startFrame={fPayoffTakeaway}
          />
        </StageWrapper>

        {/* ══════════════════════════════════════════════════════ */}
        {/* MID-SCREEN CLEAN FLOATING ICONS & SUBTLE STAGE TAGS */}
        {/* ══════════════════════════════════════════════════════ */}
        <MidScreenVisualAssets
          frame={frame}
          fps={fps}
          evDnsFrame={evDns.start_frame}
          evTravelFrame={evTravel.start_frame}
          evServerFrame={evServer.start_frame}
          evRenderFrame={evRender.start_frame}
          evPayoffFrame={fPayoffTakeaway}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* HERO MASCOT REACTOR STAGE (+10% Scaled up to 1.56) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 25,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 60,
        }}
      >
        {/* Animated Speech Bubble */}
        {nemiSpeech && (
          <div
            style={{
              backgroundColor: nemiTheme.colors.brandYellow,
              color: "#18181B",
              fontWeight: 900,
              fontSize: 30,
              padding: "16px 38px",
              borderRadius: 26,
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)",
              marginBottom: 16,
              transform: `scale(${interpolate(frame % 30, [0, 15, 30], [1.0, 1.06, 1.0])})`,
              whiteSpace: "nowrap",
            }}
          >
            {nemiSpeech}
          </div>
        )}

        {/* Breathing Mascot */}
        <div style={{ transform: `translateY(${Math.sin(frame * 0.1) * 6}px)` }}>
          <NemiMascot pose={nemiPose} scale={1.56} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SILKY SMOOTH STAGE WRAPPER COMPONENT
// ═══════════════════════════════════════════════════════════════
const StageWrapper: React.FC<{
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  endFrame: number;
}> = ({ children, frame, startFrame, endFrame }) => {
  if (frame < startFrame - 10 || frame > endFrame + 10) {
    return null;
  }

  const enterOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterY = interpolate(frame, [startFrame, startFrame + 10], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = interpolate(frame, [endFrame - 8, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(frame, [endFrame - 8, endFrame], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = Math.min(enterOpacity, exitOpacity);
  const translateY = enterY + exitY;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: opacity > 0.1 ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 1: BROWSER ADDRESS BAR & ENTER IGNITION (+10% Boosted)
// ═══════════════════════════════════════════════════════════════
const Beat1AddressBar: React.FC<{
  frame: number;
  fps: number;
  fEnterPress: number;
  fPacketLaunch: number;
}> = ({ frame, fps, fEnterPress, fPacketLaunch }) => {
  const popSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const isEntered = frame >= fEnterPress;
  const isLaunched = frame >= fPacketLaunch;

  const fullText = "https://google.com";
  const typedLen = Math.min(Math.floor((frame / fEnterPress) * fullText.length), fullText.length);
  const currentText = fullText.slice(0, Math.max(typedLen, 0));

  const packetY = interpolate(frame, [fPacketLaunch, fPacketLaunch + 25], [520, 1100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 50,
        right: 50,
        height: 520,
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        border: `3px solid ${isEntered ? "#38BDF8" : nemiTheme.colors.borderSubtle}`,
        boxShadow: isEntered ? "0 28px 70px rgba(56, 189, 248, 0.28)" : "0 28px 70px rgba(0, 0, 0, 0.09)",
        padding: "34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      {/* Browser Tab Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#EF4444" }} />
        <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
        <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#10B981" }} />
        <div style={{ marginLeft: 16, backgroundColor: "#F1F5F9", padding: "10px 22px", borderRadius: 12, fontSize: 18, color: "#64748B", fontWeight: 800 }}>
          New Tab — Chrome V128
        </div>
      </div>

      {/* URL Address Bar */}
      <div
        style={{
          backgroundColor: "#F8FAFC",
          borderRadius: 22,
          border: `3px solid ${isEntered ? "#0284C7" : "#E2E8F0"}`,
          padding: "22px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontSize: 32 }}>🔒</span>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            {currentText}
            {frame < fEnterPress && (frame % 15 < 8) && (
              <span style={{ color: "#0284C7" }}>|</span>
            )}
          </span>
        </div>

        {/* Enter Key Badge */}
        <div
          style={{
            backgroundColor: isEntered ? "#0284C7" : "#E2E8F0",
            color: isEntered ? "#FFFFFF" : "#64748B",
            fontWeight: 900,
            fontSize: 22,
            padding: "12px 22px",
            borderRadius: 14,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            transform: isEntered ? "scale(1.1)" : "scale(1.0)",
            boxShadow: isEntered ? "0 0 24px rgba(2, 132, 199, 0.45)" : "none",
          }}
        >
          ENTER ↵
        </div>
      </div>

      {/* Client Telemetry Badges */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ backgroundColor: "#F1F5F9", padding: "20px", borderRadius: 20 }}>
          <div style={{ fontSize: 16, color: "#64748B", fontWeight: 700 }}>Protocol</div>
          <div style={{ fontSize: 25, fontWeight: 900, color: "#0284C7", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
            HTTP/3 (QUIC / UDP)
          </div>
        </div>
        <div style={{ backgroundColor: "#F1F5F9", padding: "20px", borderRadius: 20 }}>
          <div style={{ fontSize: 16, color: "#64748B", fontWeight: 700 }}>Client Socket</div>
          <div style={{ fontSize: 25, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
            192.168.1.105:54321
          </div>
        </div>
      </div>

      {/* Firing Request Packet */}
      {isLaunched && (
        <div
          style={{
            position: "absolute",
            top: packetY,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#06B6D4",
            color: "#FFFFFF",
            padding: "14px 32px",
            borderRadius: 26,
            fontWeight: 900,
            fontSize: 23,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 0 35px #06B6D4",
            zIndex: 100,
          }}
        >
          ⚡ GET / HTTP/3 (SYN)
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 2: RECURSIVE DNS RESOLUTION MATRIX (+10% Boosted)
// ═══════════════════════════════════════════════════════════════
const Beat2DnsResolution: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fIpResolved: number;
}> = ({ frame, fps, startFrame, fIpResolved }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isResolved = frame >= fIpResolved;

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 45,
        right: 45,
        height: 530,
        backgroundColor: "#070B12",
        borderRadius: 30,
        border: "3px solid rgba(56, 189, 248, 0.55)",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.6)",
        padding: "30px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#38BDF8", boxShadow: "0 0 16px #38BDF8" }} />
          <span style={{ fontSize: 25, fontWeight: 900, color: "#38BDF8", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            📡 Recursive DNS Resolution
          </span>
        </div>
        <span style={{ fontSize: 18, color: isResolved ? "#10B981" : "#F59E0B", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isResolved ? "RECORD FOUND (A)" : "RESOLVING HIERARCHY..."}
        </span>
      </div>

      {/* DNS Hierarchy Tree Nodes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "16px 22px", borderRadius: 18, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, color: "#64748B", fontWeight: 700 }}>01. Root DNS Server (.)</div>
            <div style={{ fontSize: 20, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 2 }}>
              Delegates to .com TLD Servers
            </div>
          </div>
          <span style={{ color: "#10B981", fontSize: 24 }}>✓</span>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "16px 22px", borderRadius: 18, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, color: "#64748B", fontWeight: 700 }}>02. TLD Name Server (.com)</div>
            <div style={{ fontSize: 20, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 2 }}>
              Delegates to ns1.google.com
            </div>
          </div>
          <span style={{ color: "#10B981", fontSize: 24 }}>✓</span>
        </div>

        {/* Resolved IP Box */}
        <div
          style={{
            backgroundColor: isResolved ? "rgba(16, 185, 129, 0.18)" : "#0F172A",
            padding: "20px 26px",
            borderRadius: 20,
            border: isResolved ? "3px solid #10B981" : "1px solid #1E293B",
            boxShadow: isResolved ? "0 0 40px rgba(16, 185, 129, 0.35)" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "all 0.3s ease",
          }}
        >
          <div>
            <div style={{ fontSize: 16, color: isResolved ? "#10B981" : "#64748B", fontWeight: 800 }}>
              03. Authoritative DNS (google.com)
            </div>
            <div style={{ fontSize: 34, fontWeight: 900, color: isResolved ? "#F8FAFC" : "#64748B", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
              {isResolved ? "142.250.190.46" : "Awaiting response..."}
            </div>
          </div>
          <div
            style={{
              backgroundColor: isResolved ? "#10B981" : "#334155",
              color: "#FFFFFF",
              fontWeight: 900,
              fontSize: 19,
              padding: "10px 20px",
              borderRadius: 12,
              fontFamily: nemiTheme.typography.fontFamily.mono,
            }}
          >
            A RECORD
          </div>
        </div>
      </div>

      <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Domain Name mapped to IPv4 Socket in <span style={{ color: "#38BDF8", fontWeight: 900 }}>14ms</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 3: UNDERSEA FIBER & BGP ROUTING GRID (+10% Boosted)
// ═══════════════════════════════════════════════════════════════
const Beat3FiberRouting: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fServerReach: number;
}> = ({ frame, fps, startFrame, fServerReach }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const progress = Math.min(localFrame / (fServerReach - startFrame), 1.0);

  return (
    <div
      style={{
        position: "absolute",
        top: 340,
        left: 40,
        right: 40,
        height: 540,
        backgroundColor: "#070B12",
        borderRadius: 30,
        border: "3px solid rgba(6, 182, 212, 0.55)",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.6)",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 23, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          🌊 Undersea Trans-Oceanic Fiber Transit (BGP)
        </span>
        <span style={{ fontSize: 18, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SPEED: 200,000 km/s (LIGHT)
        </span>
      </div>

      {/* 3D Routing Track */}
      <div style={{ width: "100%", height: 360, position: "relative" }}>
        <svg width="100%" height="100%" viewBox="0 0 900 360" style={{ overflow: "visible" }}>
          <path
            d="M 120,60 C 300,60 300,180 500,180 C 700,180 700,300 820,300"
            fill="none"
            stroke="rgba(6, 182, 212, 0.25)"
            strokeWidth="14"
          />
          <path
            d="M 120,60 C 300,60 300,180 500,180 C 700,180 700,300 820,300"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="7"
            strokeDasharray="1200"
            strokeDashoffset={1200 * (1 - progress)}
            style={{ filter: "drop-shadow(0 0 16px #06B6D4)" }}
          />

          <circle cx="120" cy="60" r="20" fill="#0F172A" stroke="#06B6D4" strokeWidth="6" />
          <circle cx="500" cy="180" r="20" fill="#0F172A" stroke="#FFD166" strokeWidth="6" />
          <circle cx="820" cy="300" r="26" fill="#10B981" stroke="#FFFFFF" strokeWidth="6" />
        </svg>

        {/* Node Labels */}
        <div style={{ position: "absolute", top: 40, left: 160, color: "#F8FAFC", fontSize: 20, fontWeight: 800 }}>
          01. Local ISP Gateway
        </div>
        <div style={{ position: "absolute", top: 160, left: 540, color: "#FFD166", fontSize: 20, fontWeight: 800 }}>
          02. Tier-1 Backbone (AS15169)
        </div>
        <div style={{ position: "absolute", top: 280, left: 610, color: "#10B981", fontSize: 23, fontWeight: 900 }}>
          03. Google Edge CDN ✓
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontFamily: nemiTheme.typography.fontFamily.mono, color: "#94A3B8" }}>
        <span>Packet: IP 192.168.1.105 → 142.250.190.46</span>
        <span style={{ color: "#06B6D4", fontWeight: 800 }}>TTL: 56 Hops | Transit Latency: 22ms</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 4: GOOGLE EDGE SERVER & TLS 1.3 HANDSHAKE (+10% Boosted)
// ═══════════════════════════════════════════════════════════════
const Beat4EdgeServer: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fResponseLaunch: number;
}> = ({ frame, fps, startFrame, fResponseLaunch }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isShootingBack = frame >= fResponseLaunch;

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 45,
        right: 45,
        height: 530,
        backgroundColor: "#070B12",
        borderRadius: 30,
        border: "3px solid #10B981",
        boxShadow: "0 28px 70px rgba(16, 185, 129, 0.28)",
        padding: "30px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#10B981", boxShadow: "0 0 16px #10B981" }} />
          <span style={{ fontSize: 25, fontWeight: 900, color: "#10B981", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            🖥️ Google Edge Data Center (Server Cluster)
          </span>
        </div>
        <span style={{ fontSize: 18, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          STATUS: 200 OK
        </span>
      </div>

      {/* Server Rack Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "22px", borderRadius: 20, border: "1px solid #1E293B" }}>
          <div style={{ fontSize: 16, color: "#64748B", fontWeight: 700 }}>Cryptographic Handshake</div>
          <div style={{ fontSize: 25, fontWeight: 900, color: "#38BDF8", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
            TLS 1.3 (1-RTT Session)
          </div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "22px", borderRadius: 20, border: "1px solid #1E293B" }}>
          <div style={{ fontSize: 16, color: "#64748B", fontWeight: 700 }}>Generated Payload</div>
          <div style={{ fontSize: 25, fontWeight: 900, color: "#FFD166", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
            42.8 KB (gzip HTML/CSS)
          </div>
        </div>
      </div>

      {/* Live Server Response Emission */}
      <div
        style={{
          backgroundColor: "#03070D",
          borderRadius: 20,
          padding: "24px",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 16, color: "#64748B", fontWeight: 700 }}>HTTP/2 Stream #1</div>
          <div style={{ fontSize: 25, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Content-Type: text/html; charset=UTF-8
          </div>
        </div>

        <div
          style={{
            backgroundColor: isShootingBack ? "#10B981" : "#0284C7",
            color: "#FFFFFF",
            padding: "12px 22px",
            borderRadius: 16,
            fontWeight: 900,
            fontSize: 19,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: isShootingBack ? "0 0 28px #10B981" : "none",
          }}
        >
          {isShootingBack ? "TRANSMITTING ⚡" : "GENERATING..."}
        </div>
      </div>

      <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Google Search Engine generated HTML payload in <span style={{ color: "#10B981", fontWeight: 900 }}>18ms</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 5: CRITICAL RENDERING PATH & DOM PAINT (+10% Boosted)
// ═══════════════════════════════════════════════════════════════
const Beat5DomRendering: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  fGoogleUi: number;
}> = ({ frame, fps, startFrame, fGoogleUi }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isGoogleUiVisible = frame >= fGoogleUi;

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 45,
        right: 45,
        height: 530,
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        border: "3px solid #CBD5E1",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.12)",
        padding: "34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 30 }}>⚡</span>
          <span style={{ fontSize: 25, fontWeight: 900, color: "#0F172A", letterSpacing: "1px" }}>
            Critical Rendering Path (DOM + CSSOM)
          </span>
        </div>
        <span style={{ fontSize: 18, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          PAINT COMPLETE
        </span>
      </div>

      {/* Rendered Google Viewport */}
      <div
        style={{
          backgroundColor: "#F8FAFC",
          borderRadius: 24,
          border: "1px solid #E2E8F0",
          height: 290,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "26px",
          boxShadow: isGoogleUiVisible ? "0 10px 30px rgba(0, 0, 0, 0.05)" : "none",
        }}
      >
        {/* Google Colorful Brand Logo */}
        <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: "-2px" }}>
          <span style={{ color: "#4285F4" }}>G</span>
          <span style={{ color: "#EA4335" }}>o</span>
          <span style={{ color: "#FBBC05" }}>o</span>
          <span style={{ color: "#4285F4" }}>g</span>
          <span style={{ color: "#34A853" }}>l</span>
          <span style={{ color: "#EA4335" }}>e</span>
        </div>

        {/* Google Search Bar */}
        <div
          style={{
            width: "88%",
            backgroundColor: "#FFFFFF",
            borderRadius: 30,
            border: "1.5px solid #CBD5E1",
            padding: "16px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
          }}
        >
          <span style={{ fontSize: 23, color: "#94A3B8" }}>Search Google or type a URL</span>
          <span style={{ fontSize: 28 }}>🔍</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono, color: "#64748B" }}>
        <span>HTML Tokens → DOM Tree</span>
        <span style={{ color: "#10B981", fontWeight: 800 }}>GPU Raster Paint: 8ms</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 6: 3-POINT CS TAKEAWAY & 64ms LATENCY PAYOFF (+10% Boosted)
// ═══════════════════════════════════════════════════════════════
const Beat6TakeawayConsole: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  const localFrame = frame - startFrame;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 45,
        right: 45,
        backgroundColor: "#18181B",
        borderRadius: 30,
        border: "3px solid #27272A",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.5)",
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 25, fontWeight: 900, color: nemiTheme.colors.brandYellow, letterSpacing: "1.5px" }}>
          ⚡ 3 ARCHITECTURAL PILLARS
        </span>
        <span style={{ fontSize: 20, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          TOTAL ROUND-TRIP: 64ms
        </span>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "18px 24px", borderRadius: 18, borderLeft: "6px solid #38BDF8" }}>
        <div style={{ fontSize: 25, fontWeight: 900, color: "#F8FAFC" }}>01. Recursive DNS Hierarchy</div>
        <div style={{ fontSize: 19, color: "#94A3B8", marginTop: 4 }}>
          Domain resolved to server IP in a single sub-millisecond cached query.
        </div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "18px 24px", borderRadius: 18, borderLeft: "6px solid #06B6D4" }}>
        <div style={{ fontSize: 25, fontWeight: 900, color: "#F8FAFC" }}>02. Undersea Fiber Optic BGP</div>
        <div style={{ fontSize: 19, color: "#94A3B8", marginTop: 4 }}>
          Photons travel thousands of kilometers across global backbones at light speed.
        </div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "18px 24px", borderRadius: 18, borderLeft: "6px solid #10B981" }}>
        <div style={{ fontSize: 25, fontWeight: 900, color: "#F8FAFC" }}>03. GPU-Accelerated DOM Paint</div>
        <div style={{ fontSize: 19, color: "#94A3B8", marginTop: 4 }}>
          Browser parses HTML tokens and paints the viewport in single-digit milliseconds.
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MID-SCREEN CLEAN FLOATING ICONS & SUBTLE STAGE TAGS (+10% Boosted)
// ═══════════════════════════════════════════════════════════════
const MidScreenVisualAssets: React.FC<{
  frame: number;
  fps: number;
  evDnsFrame: number;
  evTravelFrame: number;
  evServerFrame: number;
  evRenderFrame: number;
  evPayoffFrame: number;
}> = ({ frame, fps, evDnsFrame, evTravelFrame, evServerFrame, evRenderFrame, evPayoffFrame }) => {
  const isStage1 = frame < evDnsFrame;
  const isStage2 = frame >= evDnsFrame && frame < evTravelFrame;
  const isStage3 = frame >= evTravelFrame && frame < evServerFrame;
  const isStage4 = frame >= evServerFrame && frame < evRenderFrame;
  const isStage5 = frame >= evRenderFrame && frame < evPayoffFrame;
  const isStage6 = frame >= evPayoffFrame;

  return (
    <div
      style={{
        position: "absolute",
        top: 910,
        left: 45,
        right: 45,
        height: 290,
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        zIndex: 35,
      }}
    >
      {/* ─── STAGE 1: CLIENT LAPTOP & WI-FI ─── */}
      {isStage1 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 28px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>💻</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#1E293B" }}>Client Device</span>
            </div>

            <span style={{ fontSize: 32, color: nemiTheme.colors.brandCyan, fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 28px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>📡</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#0284C7" }}>5GHz Wi-Fi</span>
            </div>

            <span style={{ fontSize: 32, color: nemiTheme.colors.brandCyan, fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 28px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>⚡</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#10B981" }}>QUIC / UDP</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(2, 132, 199, 0.14)", padding: "12px 28px", borderRadius: 24, border: "1.5px solid rgba(2, 132, 199, 0.35)", color: "#0284C7", fontSize: 19, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            HTTP/3 0-RTT Connection Initiated
          </div>
        </>
      )}

      {/* ─── STAGE 2: DNS PHONEBOOK ─── */}
      {isStage2 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.88)", padding: "16px 26px", borderRadius: 26, border: "1.5px solid rgba(255, 209, 102, 0.4)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>📖</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#FFD166" }}>DNS Phonebook</span>
            </div>

            <span style={{ fontSize: 32, color: "#FFD166", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.88)", padding: "16px 26px", borderRadius: 26, border: "1.5px solid rgba(56, 189, 248, 0.4)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>🔍</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#38BDF8" }}>"google.com"</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.88)", padding: "16px 26px", borderRadius: 26, border: "1.5px solid rgba(16, 185, 129, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>🌐</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>142.250.190.46</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(56, 189, 248, 0.16)", padding: "12px 28px", borderRadius: 24, border: "1.5px solid rgba(56, 189, 248, 0.4)", color: "#38BDF8", fontSize: 19, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Root ➔ TLD ➔ Authoritative (14ms)
          </div>
        </>
      )}

      {/* ─── STAGE 3: UNDERSEA FIBER TRANSIT ─── */}
      {isStage3 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.88)", padding: "16px 26px", borderRadius: 26, border: "1.5px solid rgba(6, 182, 212, 0.4)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>🏠</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#F8FAFC" }}>ISP Gateway</span>
            </div>

            <span style={{ fontSize: 32, color: "#06B6D4", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.88)", padding: "16px 26px", borderRadius: 26, border: "1.5px solid rgba(6, 182, 212, 0.6)", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 28px rgba(6, 182, 212, 0.35)" }}>
              <span style={{ fontSize: 44 }}>🌊</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#06B6D4" }}>Undersea Fiber Cable</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.88)", padding: "16px 26px", borderRadius: 26, border: "1.5px solid rgba(16, 185, 129, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>📍</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#10B981" }}>Google Edge POP</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(6, 182, 212, 0.16)", padding: "12px 28px", borderRadius: 24, border: "1.5px solid rgba(6, 182, 212, 0.4)", color: "#06B6D4", fontSize: 19, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            DWDM Optical Laser Pulse (200,000 km/s)
          </div>
        </>
      )}

      {/* ─── STAGE 4: DATA CENTER SERVER RACK ─── */}
      {isStage4 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.88)", padding: "16px 26px", borderRadius: 26, border: "1.5px solid rgba(16, 185, 129, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>🖥️</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#F8FAFC" }}>Borg Cluster</span>
            </div>

            <span style={{ fontSize: 32, color: "#38BDF8", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.88)", padding: "16px 26px", borderRadius: 26, border: "1.5px solid rgba(56, 189, 248, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>🔐</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#38BDF8" }}>TLS 1.3 Decrypt</span>
            </div>

            <span style={{ fontSize: 32, color: "#FFD166", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.88)", padding: "16px 26px", borderRadius: 26, border: "1.5px solid rgba(255, 209, 102, 0.5)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>📦</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#FFD166" }}>42.8 KB Payload</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(16, 185, 129, 0.16)", padding: "12px 28px", borderRadius: 24, border: "1.5px solid rgba(16, 185, 129, 0.4)", color: "#10B981", fontSize: 19, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            HTTP/2 200 OK • GFE Server Execution (18ms)
          </div>
        </>
      )}

      {/* ─── STAGE 5: DOM & UI PAINT ─── */}
      {isStage5 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 28px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>🌲</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#1E293B" }}>DOM Tree</span>
            </div>

            <span style={{ fontSize: 32, color: "#0284C7", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 28px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>🎨</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#0284C7" }}>CSSOM Style</span>
            </div>

            <span style={{ fontSize: 32, color: "#10B981", fontWeight: 900 }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", padding: "16px 26px", borderRadius: 26, boxShadow: "0 10px 28px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>🎮</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#10B981" }}>GPU Paint</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(16, 185, 129, 0.14)", padding: "12px 28px", borderRadius: 24, border: "1.5px solid rgba(16, 185, 129, 0.35)", color: "#10B981", fontSize: 19, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Blink Rendering Engine • 60 FPS Raster
          </div>
        </>
      )}

      {/* ─── STAGE 6: 64ms LATENCY PAYOFF ─── */}
      {isStage6 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.16)", padding: "16px 28px", borderRadius: 26, border: "1.5px solid rgba(239, 68, 68, 0.45)", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 38 }}>👁️</span>
              <span style={{ fontSize: 23, fontWeight: 900, color: "#EF4444" }}>Human Blink: 300ms</span>
            </div>

            <span style={{ fontSize: 30, color: "#FFD166", fontWeight: 900 }}>VS</span>

            <div style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", padding: "16px 30px", borderRadius: 26, border: "2.5px solid #10B981", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 0 35px rgba(16, 185, 129, 0.4)" }}>
              <span style={{ fontSize: 38 }}>⚡</span>
              <span style={{ fontSize: 25, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>Round-Trip: 64ms</span>
            </div>
          </div>

          <div style={{ color: "#FFD166", fontSize: 20, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            5x Faster than Human Perception! 🚀
          </div>
        </>
      )}
    </div>
  );
};
