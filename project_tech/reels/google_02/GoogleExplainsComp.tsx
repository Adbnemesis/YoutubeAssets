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

// ═══════════════════════════════════════════════════════════════════
// NEMI EXPLAINS REEL #2 — WHAT ACTUALLY HAPPENS WHEN YOU TYPE GOOGLE.COM?
// CONTINUOUS FLUID MULTI-STAGE ENGINE + SYNTHWAVE BGM + SFX LAYER (~19.72s @ 30fps)
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
  const isDarkScene = frame >= evDns.start_frame && frame < evRender.start_frame;
  const darkFade = interpolate(
    frame,
    [evDns.start_frame - 10, evDns.start_frame + 10, evRender.start_frame - 10, evRender.start_frame + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ─── Global Cinematic Camera Motion (Fluid, zero abrupt cuts) ───
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
      {/* 1. Address Bar Keystroke Typing (Frame 10) */}
      <Sequence from={10} durationInFrames={30}>
        <Audio src={staticFile("reels/google_02/sfx/typing.mp3")} volume={0.4} />
      </Sequence>

      {/* 2. Enter Press Click (Frame 36) */}
      <Sequence from={fEnterPress} durationInFrames={30}>
        <Audio src={staticFile("reels/google_02/sfx/click.mp3")} volume={0.8} />
      </Sequence>

      {/* 3. Packet Launch Ignition (Frame 78) */}
      <Sequence from={fPacketLaunch} durationInFrames={30}>
        <Audio src={staticFile("reels/google_02/sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>

      {/* 4. DNS IP Resolution Ping (Frame 164) */}
      <Sequence from={fIpResolved} durationInFrames={35}>
        <Audio src={staticFile("reels/google_02/sfx/ping.mp3")} volume={0.7} />
      </Sequence>

      {/* 5. Nemi "Where is that?" Pop (Frame 189) */}
      <Sequence from={evWhere.start_frame} durationInFrames={35}>
        <Audio src={staticFile("reels/google_02/sfx/pop.mp3")} volume={0.65} />
      </Sequence>

      {/* 6. Fiber Optic Packet Transit Whoosh (Frame 241) */}
      <Sequence from={fNetworkGrid} durationInFrames={35}>
        <Audio src={staticFile("reels/google_02/sfx/whoosh.mp3")} volume={0.55} />
      </Sequence>

      {/* 7. Server Response Ready Notification (Frame 353) */}
      <Sequence from={fServerProcess} durationInFrames={40}>
        <Audio src={staticFile("reels/google_02/sfx/notification.mp3")} volume={0.6} />
      </Sequence>

      {/* 8. Google UI Pop (Frame 469) */}
      <Sequence from={fGoogleUi} durationInFrames={35}>
        <Audio src={staticFile("reels/google_02/sfx/pop.mp3")} volume={0.7} />
      </Sequence>

      {/* 9. Final 64ms Latency Chime (Frame 521) */}
      <Sequence from={fPayoffTakeaway} durationInFrames={60}>
        <Audio src={staticFile("reels/google_02/sfx/chime.mp3")} volume={0.85} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PERSISTENT HEADER HUD */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: darkFade > 0.5 ? "#38BDF8" : "#2563EB",
              boxShadow: darkFade > 0.5 ? "0 0 16px #38BDF8" : "none",
            }}
          />
          <span
            style={{
              fontSize: 18,
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
            backgroundColor: darkFade > 0.5 ? "rgba(15, 23, 42, 0.8)" : "#FFFFFF",
            padding: "8px 18px",
            borderRadius: 20,
            border: darkFade > 0.5 ? "1px solid #1E293B" : `1px solid ${nemiTheme.colors.borderSubtle}`,
            fontSize: 14,
            fontWeight: 800,
            color: darkFade > 0.5 ? "#38BDF8" : nemiTheme.colors.brandCyan,
            fontFamily: nemiTheme.typography.fontFamily.mono,
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
      {/* TOPIC BANNER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 60,
          right: 60,
          zIndex: 50,
        }}
      >
        <h1
          style={{
            fontSize: 44,
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
        {/* MID-SCREEN RICH VISUAL ASSETS & GRAPHICAL PROPS */}
        {/* (Fills y: 860px to 1420px with rich illustrations)  */}
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
      {/* HERO MASCOT REACTOR STAGE (Smooth, zero teleportation) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
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
              fontSize: 22,
              padding: "12px 28px",
              borderRadius: 22,
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
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
          <NemiMascot pose={nemiPose} scale={1.3} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SILKY SMOOTH STAGE WRAPPER COMPONENT (Parallax slide + fade)
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

  // Smooth entrance: opacity 0 -> 1 over 10 frames, translateY 30px -> 0px
  const enterOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterY = interpolate(frame, [startFrame, startFrame + 10], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Smooth exit: opacity 1 -> 0 over 8 frames, translateY 0px -> -30px
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
// BEAT 1: BROWSER ADDRESS BAR & ENTER IGNITION
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

  // Keystrokes typing simulation
  const fullText = "https://google.com";
  const typedLen = Math.min(Math.floor((frame / fEnterPress) * fullText.length), fullText.length);
  const currentText = fullText.slice(0, Math.max(typedLen, 0));

  // Request packet launch animation
  const packetY = interpolate(frame, [fPacketLaunch, fPacketLaunch + 25], [460, 1100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 60,
        right: 60,
        height: 460,
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        border: `2px solid ${isEntered ? "#38BDF8" : nemiTheme.colors.borderSubtle}`,
        boxShadow: isEntered ? "0 24px 60px rgba(56, 189, 248, 0.25)" : "0 24px 60px rgba(0, 0, 0, 0.08)",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      {/* Browser Tab Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#EF4444" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
        <div style={{ marginLeft: 16, backgroundColor: "#F1F5F9", padding: "6px 18px", borderRadius: 8, fontSize: 13, color: "#64748B", fontWeight: 700 }}>
          New Tab — Chrome V128
        </div>
      </div>

      {/* URL Address Bar */}
      <div
        style={{
          backgroundColor: "#F8FAFC",
          borderRadius: 18,
          border: `2px solid ${isEntered ? "#0284C7" : "#E2E8F0"}`,
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 22 }}>🔒</span>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", fontFamily: nemiTheme.typography.fontFamily.mono }}>
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
            fontSize: 16,
            padding: "8px 16px",
            borderRadius: 10,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            transform: isEntered ? "scale(1.1)" : "scale(1.0)",
            boxShadow: isEntered ? "0 0 20px rgba(2, 132, 199, 0.4)" : "none",
          }}
        >
          ENTER ↵
        </div>
      </div>

      {/* Client Telemetry Badges */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ backgroundColor: "#F1F5F9", padding: "16px", borderRadius: 16 }}>
          <div style={{ fontSize: 12, color: "#64748B" }}>Protocol</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#0284C7", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            HTTP/3 (QUIC / UDP)
          </div>
        </div>
        <div style={{ backgroundColor: "#F1F5F9", padding: "16px", borderRadius: 16 }}>
          <div style={{ fontSize: 12, color: "#64748B" }}>Client Socket</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>
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
            padding: "10px 24px",
            borderRadius: 20,
            fontWeight: 900,
            fontSize: 16,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 0 30px #06B6D4",
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
// BEAT 2: RECURSIVE DNS RESOLUTION MATRIX
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
        left: 50,
        right: 50,
        height: 480,
        backgroundColor: "#070B12",
        borderRadius: 28,
        border: "2px solid rgba(56, 189, 248, 0.4)",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.6)",
        padding: "26px 30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#38BDF8", boxShadow: "0 0 12px #38BDF8" }} />
          <span style={{ fontSize: 17, fontWeight: 900, color: "#38BDF8", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            📡 Recursive DNS Resolution
          </span>
        </div>
        <span style={{ fontSize: 13, color: isResolved ? "#10B981" : "#F59E0B", fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {isResolved ? "RECORD FOUND (A)" : "RESOLVING HIERARCHY..."}
        </span>
      </div>

      {/* DNS Hierarchy Tree Nodes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "12px 18px", borderRadius: 14, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748B" }}>01. Root DNS Server (.)</div>
            <div style={{ fontSize: 15, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>
              Delegates to .com TLD Servers
            </div>
          </div>
          <span style={{ color: "#10B981" }}>✓</span>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "12px 18px", borderRadius: 14, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748B" }}>02. TLD Name Server (.com)</div>
            <div style={{ fontSize: 15, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>
              Delegates to ns1.google.com
            </div>
          </div>
          <span style={{ color: "#10B981" }}>✓</span>
        </div>

        {/* Resolved IP Box */}
        <div
          style={{
            backgroundColor: isResolved ? "rgba(16, 185, 129, 0.15)" : "#0F172A",
            padding: "16px 20px",
            borderRadius: 16,
            border: isResolved ? "2px solid #10B981" : "1px solid #1E293B",
            boxShadow: isResolved ? "0 0 30px rgba(16, 185, 129, 0.3)" : "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "all 0.3s ease",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: isResolved ? "#10B981" : "#64748B", fontWeight: 800 }}>
              03. Authoritative DNS (google.com)
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: isResolved ? "#F8FAFC" : "#64748B", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 2 }}>
              {isResolved ? "142.250.190.46" : "Awaiting response..."}
            </div>
          </div>
          <div
            style={{
              backgroundColor: isResolved ? "#10B981" : "#334155",
              color: "#FFFFFF",
              fontWeight: 900,
              fontSize: 14,
              padding: "6px 14px",
              borderRadius: 8,
              fontFamily: nemiTheme.typography.fontFamily.mono,
            }}
          >
            A RECORD
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Domain Name mapped to IPv4 Socket in <span style={{ color: "#38BDF8", fontWeight: 900 }}>14ms</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 3: UNDERSEA FIBER & BGP ROUTING GRID
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
        height: 500,
        backgroundColor: "#070B12",
        borderRadius: 28,
        border: "2px solid rgba(6, 182, 212, 0.4)",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.6)",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          🌊 Undersea Trans-Oceanic Fiber Transit (BGP)
        </span>
        <span style={{ fontSize: 13, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SPEED: 200,000 km/s (LIGHT IN GLASS)
        </span>
      </div>

      {/* 3D Routing Track */}
      <div style={{ width: "100%", height: 340, position: "relative" }}>
        <svg width="100%" height="100%" viewBox="0 0 900 340" style={{ overflow: "visible" }}>
          {/* Fiber Path Line */}
          <path
            d="M 120,60 C 300,60 300,170 500,170 C 700,170 700,280 820,280"
            fill="none"
            stroke="rgba(6, 182, 212, 0.25)"
            strokeWidth="8"
          />
          <path
            d="M 120,60 C 300,60 300,170 500,170 C 700,170 700,280 820,280"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="4"
            strokeDasharray="1200"
            strokeDashoffset={1200 * (1 - progress)}
            style={{ filter: "drop-shadow(0 0 10px #06B6D4)" }}
          />

          {/* Routing Node Markers */}
          <circle cx="120" cy="60" r="14" fill="#0F172A" stroke="#06B6D4" strokeWidth="4" />
          <circle cx="500" cy="170" r="14" fill="#0F172A" stroke="#FFD166" strokeWidth="4" />
          <circle cx="820" cy="280" r="18" fill="#10B981" stroke="#FFFFFF" strokeWidth="4" />
        </svg>

        {/* Node Labels */}
        <div style={{ position: "absolute", top: 40, left: 145, color: "#F8FAFC", fontSize: 14, fontWeight: 800 }}>
          01. Local ISP Gateway
        </div>
        <div style={{ position: "absolute", top: 150, left: 525, color: "#FFD166", fontSize: 14, fontWeight: 800 }}>
          02. Tier-1 Backbone (AS15169)
        </div>
        <div style={{ position: "absolute", top: 260, left: 630, color: "#10B981", fontSize: 16, fontWeight: 900 }}>
          03. Google Edge CDN ✓
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: nemiTheme.typography.fontFamily.mono, color: "#64748B" }}>
        <span>Packet: IP 192.168.1.105 → 142.250.190.46</span>
        <span style={{ color: "#06B6D4" }}>TTL: 56 Hops | Transit Latency: 22ms</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 4: GOOGLE EDGE SERVER & TLS 1.3 HANDSHAKE
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
        left: 50,
        right: 50,
        height: 480,
        backgroundColor: "#070B12",
        borderRadius: 28,
        border: "2px solid #10B981",
        boxShadow: "0 28px 70px rgba(16, 185, 129, 0.25)",
        padding: "26px 30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981", boxShadow: "0 0 12px #10B981" }} />
          <span style={{ fontSize: 17, fontWeight: 900, color: "#10B981", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            🖥️ Google Edge Data Center (Server Cluster)
          </span>
        </div>
        <span style={{ fontSize: 13, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          STATUS: 200 OK
        </span>
      </div>

      {/* Server Rack Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "18px", borderRadius: 16, border: "1px solid #1E293B" }}>
          <div style={{ fontSize: 12, color: "#64748B" }}>Cryptographic Handshake</div>
          <div style={{ fontSize: 19, fontWeight: 900, color: "#38BDF8", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
            TLS 1.3 (1-RTT Session)
          </div>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "18px", borderRadius: 16, border: "1px solid #1E293B" }}>
          <div style={{ fontSize: 12, color: "#64748B" }}>Generated Payload</div>
          <div style={{ fontSize: 19, fontWeight: 900, color: "#FFD166", fontFamily: nemiTheme.typography.fontFamily.mono, marginTop: 4 }}>
            42.8 KB (gzip HTML/CSS)
          </div>
        </div>
      </div>

      {/* Live Server Response Emission */}
      <div
        style={{
          backgroundColor: "#03070D",
          borderRadius: 16,
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#64748B" }}>HTTP/2 Stream #1</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Content-Type: text/html; charset=UTF-8
          </div>
        </div>

        <div
          style={{
            backgroundColor: isShootingBack ? "#10B981" : "#0284C7",
            color: "#FFFFFF",
            padding: "8px 18px",
            borderRadius: 12,
            fontWeight: 900,
            fontSize: 14,
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: isShootingBack ? "0 0 20px #10B981" : "none",
          }}
        >
          {isShootingBack ? "TRANSMITTING ⚡" : "GENERATING..."}
        </div>
      </div>

      <div style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Google Search Engine generated HTML payload in <span style={{ color: "#10B981", fontWeight: 900 }}>18ms</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 5: CRITICAL RENDERING PATH & DOM PAINT
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
        left: 50,
        right: 50,
        height: 480,
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        border: "2px solid #CBD5E1",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.1)",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <span style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", letterSpacing: "1px" }}>
            Critical Rendering Path (DOM + CSSOM)
          </span>
        </div>
        <span style={{ fontSize: 13, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          PAINT COMPLETE
        </span>
      </div>

      {/* Rendered Google Viewport */}
      <div
        style={{
          backgroundColor: "#F8FAFC",
          borderRadius: 20,
          border: "1px solid #E2E8F0",
          height: 260,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: "20px",
          boxShadow: isGoogleUiVisible ? "0 10px 30px rgba(0, 0, 0, 0.05)" : "none",
        }}
      >
        {/* Google Colorful Brand Logo */}
        <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-2px" }}>
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
            width: "80%",
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            border: "1px solid #CBD5E1",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <span style={{ fontSize: 16, color: "#94A3B8" }}>Search Google or type a URL</span>
          <span style={{ fontSize: 18 }}>🔍</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: nemiTheme.typography.fontFamily.mono, color: "#64748B" }}>
        <span>HTML Tokens → DOM Tree</span>
        <span style={{ color: "#10B981", fontWeight: 800 }}>GPU Raster Paint: 8ms</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 6: 3-POINT CS TAKEAWAY & 64ms LATENCY PAYOFF
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
        left: 50,
        right: 50,
        backgroundColor: "#18181B",
        borderRadius: 28,
        border: "2px solid #27272A",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.5)",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: nemiTheme.colors.brandYellow, letterSpacing: "1.5px" }}>
          ⚡ 3 ARCHITECTURAL PILLARS
        </span>
        <span style={{ fontSize: 15, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          TOTAL ROUND-TRIP: 64ms
        </span>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 20px", borderRadius: 14, borderLeft: "4px solid #38BDF8" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>01. Recursive DNS Hierarchy</div>
        <div style={{ fontSize: 15, color: "#94A3B8", marginTop: 2 }}>
          Domain resolved to server IP in a single sub-millisecond cached query.
        </div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 20px", borderRadius: 14, borderLeft: "4px solid #06B6D4" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>02. Undersea Fiber Optic BGP</div>
        <div style={{ fontSize: 15, color: "#94A3B8", marginTop: 2 }}>
          Photons travel thousands of kilometers across global backbones at light speed.
        </div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 20px", borderRadius: 14, borderLeft: "4px solid #10B981" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>03. GPU-Accelerated DOM Paint</div>
        <div style={{ fontSize: 15, color: "#94A3B8", marginTop: 2 }}>
          Browser parses HTML tokens and paints the viewport in single-digit milliseconds.
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MID-SCREEN CLEAN FLOATING ICONS & SUBTLE STAGE TAGS
// (Minimal, transparent, airy — zero heavy black box)
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
        top: 900,
        left: 60,
        right: 60,
        height: 260,
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        zIndex: 35,
      }}
    >
      {/* ─── STAGE 1: CLIENT LAPTOP & WI-FI ─── */}
      {isStage1 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", padding: "12px 20px", borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>💻</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>Client Device</span>
            </div>

            <span style={{ fontSize: 22, color: nemiTheme.colors.brandCyan }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", padding: "12px 20px", borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>📡</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#0284C7" }}>5GHz Wi-Fi</span>
            </div>

            <span style={{ fontSize: 22, color: nemiTheme.colors.brandCyan }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", padding: "12px 20px", borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>⚡</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#10B981" }}>QUIC / UDP</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(2, 132, 199, 0.1)", padding: "8px 22px", borderRadius: 20, border: "1px solid rgba(2, 132, 199, 0.25)", color: "#0284C7", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            HTTP/3 0-RTT Connection Initiated
          </div>
        </>
      )}

      {/* ─── STAGE 2: DNS PHONEBOOK ─── */}
      {isStage2 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "12px 20px", borderRadius: 20, border: "1px solid rgba(255, 209, 102, 0.3)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>📖</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#FFD166" }}>DNS Phonebook</span>
            </div>

            <span style={{ fontSize: 22, color: "#FFD166" }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "12px 20px", borderRadius: 20, border: "1px solid rgba(56, 189, 248, 0.3)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🔍</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#38BDF8" }}>"google.com"</span>
            </div>

            <span style={{ fontSize: 22, color: "#10B981" }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "12px 20px", borderRadius: 20, border: "1px solid rgba(16, 185, 129, 0.4)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🌐</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>142.250.190.46</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(56, 189, 248, 0.12)", padding: "8px 22px", borderRadius: 20, border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38BDF8", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Root ➔ TLD ➔ Authoritative (14ms)
          </div>
        </>
      )}

      {/* ─── STAGE 3: UNDERSEA FIBER TRANSIT ─── */}
      {isStage3 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "12px 20px", borderRadius: 20, border: "1px solid rgba(6, 182, 212, 0.3)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🏠</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC" }}>ISP Gateway</span>
            </div>

            <span style={{ fontSize: 22, color: "#06B6D4" }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "12px 20px", borderRadius: 20, border: "1px solid rgba(6, 182, 212, 0.5)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 0 25px rgba(6, 182, 212, 0.25)" }}>
              <span style={{ fontSize: 28 }}>🌊</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#06B6D4" }}>Undersea Fiber Cable</span>
            </div>

            <span style={{ fontSize: 22, color: "#10B981" }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "12px 20px", borderRadius: 20, border: "1px solid rgba(16, 185, 129, 0.4)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>📍</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#10B981" }}>Google Edge POP</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(6, 182, 212, 0.12)", padding: "8px 22px", borderRadius: 20, border: "1px solid rgba(6, 182, 212, 0.3)", color: "#06B6D4", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            DWDM Optical Laser Pulse (200,000 km/s)
          </div>
        </>
      )}

      {/* ─── STAGE 4: DATA CENTER SERVER RACK ─── */}
      {isStage4 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "12px 20px", borderRadius: 20, border: "1px solid rgba(16, 185, 129, 0.4)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🖥️</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC" }}>Borg Cluster</span>
            </div>

            <span style={{ fontSize: 22, color: "#38BDF8" }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "12px 20px", borderRadius: 20, border: "1px solid rgba(56, 189, 248, 0.4)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🔐</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#38BDF8" }}>TLS 1.3 Decrypt</span>
            </div>

            <span style={{ fontSize: 22, color: "#FFD166" }}>➔</span>

            <div style={{ backgroundColor: "rgba(15, 23, 42, 0.8)", padding: "12px 20px", borderRadius: 20, border: "1px solid rgba(255, 209, 102, 0.4)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>📦</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#FFD166" }}>42.8 KB Payload</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(16, 185, 129, 0.12)", padding: "8px 22px", borderRadius: 20, border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10B981", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            HTTP/2 200 OK • GFE Server Execution (18ms)
          </div>
        </>
      )}

      {/* ─── STAGE 5: DOM & UI PAINT ─── */}
      {isStage5 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", padding: "12px 20px", borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🌲</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>DOM Tree</span>
            </div>

            <span style={{ fontSize: 22, color: "#0284C7" }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", padding: "12px 20px", borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🎨</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#0284C7" }}>CSSOM Style</span>
            </div>

            <span style={{ fontSize: 22, color: "#10B981" }}>➔</span>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", padding: "12px 20px", borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🎮</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#10B981" }}>GPU Paint</span>
            </div>
          </div>

          <div style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "8px 22px", borderRadius: 20, border: "1px solid rgba(16, 185, 129, 0.25)", color: "#10B981", fontSize: 14, fontWeight: 800, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Blink Rendering Engine • 60 FPS Raster
          </div>
        </>
      )}

      {/* ─── STAGE 6: 64ms LATENCY PAYOFF ─── */}
      {isStage6 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.12)", padding: "12px 22px", borderRadius: 20, border: "1px solid rgba(239, 68, 68, 0.3)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26 }}>👁️</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#EF4444" }}>Human Blink: 300ms</span>
            </div>

            <span style={{ fontSize: 22, color: "#FFD166", fontWeight: 900 }}>VS</span>

            <div style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "12px 24px", borderRadius: 20, border: "2px solid #10B981", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)" }}>
              <span style={{ fontSize: 28 }}>⚡</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: "#10B981", fontFamily: nemiTheme.typography.fontFamily.mono }}>Round-Trip: 64ms</span>
            </div>
          </div>

          <div style={{ color: "#FFD166", fontSize: 15, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            5x Faster than Human Perception! 🚀
          </div>
        </>
      )}
    </div>
  );
};
