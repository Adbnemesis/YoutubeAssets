import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { NemiMascot, NemiPose } from "../../src/components/NemiMascot";
import cuesData from "../../src/data/riddle_05_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandPurple: "#A855F7",
    brandGreen: "#10B981",
    brandCoral: "#F43F5E",
    brandIce: "#38BDF8",
    canvasLight: "#FAF8F5",
    canvasDark: "#070B12",
    cardLight: "#FFFFFF",
    cardDark: "#0F172A",
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

export const RiddleDeadlockComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Timeline Events ───
  const evHook = getEvent("rd01_hook");
  const evSetup = getEvent("rd02_setup_masters");
  const evLeftGrab = getEvent("rd03_left_grab");
  const evStarve = getEvent("rd04_starvation_trap");
  const evCountdown = getEvent("rd05_countdown_prompt");
  const evNemiGuess = getEvent("rd06_nemi_guess");
  const evReveal = getEvent("rd07_reveal_deadlock");
  const evPayoff = getEvent("rd08_nemi_payoff");

  const totalFrames = cuesData.total_frames || 775;

  // ─── SILKY SMOOTH COLOR INTERPOLATION (Light -> Dark Transition) ───
  const darkProgress = interpolate(
    frame,
    [evLeftGrab.start_frame - 15, evLeftGrab.start_frame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const canvasBg = interpolateColors(
    darkProgress,
    [0, 1],
    [nemiTheme.colors.canvasLight, nemiTheme.colors.canvasDark]
  );

  const textHeading = interpolateColors(
    darkProgress,
    [0, 1],
    [nemiTheme.colors.textLight, nemiTheme.colors.textDark]
  );

  const hudBg = interpolateColors(
    darkProgress,
    [0, 1],
    ["rgba(255, 255, 255, 0.96)", "rgba(15, 23, 42, 0.95)"]
  );

  const hudBorder = interpolateColors(
    darkProgress,
    [0, 1],
    [nemiTheme.colors.borderLight, nemiTheme.colors.borderDark]
  );

  // ─── Rock-Solid Cinematic Camera ───
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.018], {
    extrapolateRight: "clamp",
  });

  // ─── Nemi Emotional Arc & Dialogue ───
  let nemiPose: NemiPose = "thinking";
  let nemiSpeech: string | null = null;

  if (frame < evLeftGrab.start_frame) {
    nemiPose = "thinking";
  } else if (frame >= evLeftGrab.start_frame && frame < evCountdown.start_frame) {
    nemiPose = "pointing";
  } else if (frame >= evCountdown.start_frame && frame < evNemiGuess.start_frame) {
    nemiPose = "puzzled";
  } else if (frame >= evNemiGuess.start_frame && frame < evReveal.start_frame) {
    nemiPose = "shocked";
    nemiSpeech = "A curse from the chef?! 🤔";
  } else if (frame >= evReveal.start_frame && frame < evPayoff.start_frame) {
    nemiPose = "explaining";
  } else {
    nemiPose = "smug";
    nemiSpeech = "Circular wait = frozen servers! ❄️💀";
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: canvasBg,
        overflow: "hidden",
        fontFamily: nemiTheme.typography.fontFamily.sans,
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO (Voice + Synthwave Goose Ducked BGM) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/riddle_05/riddle_master_audio.mp3")} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SYNCHRONIZED SFX LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile("reels/riddle_05/sfx/whoosh.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={35} durationInFrames={25}>
        <Audio src={staticFile("reels/riddle_05/sfx/pop.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={45} durationInFrames={25}>
        <Audio src={staticFile("reels/riddle_05/sfx/pop.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={55} durationInFrames={25}>
        <Audio src={staticFile("reels/riddle_05/sfx/pop.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={65} durationInFrames={25}>
        <Audio src={staticFile("reels/riddle_05/sfx/pop.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={75} durationInFrames={25}>
        <Audio src={staticFile("reels/riddle_05/sfx/pop.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={95} durationInFrames={30}>
        <Audio src={staticFile("reels/riddle_05/sfx/notification.mp3")} volume={0.95} />
      </Sequence>
      <Sequence from={evLeftGrab.start_frame} durationInFrames={35}>
        <Audio src={staticFile("reels/riddle_05/sfx/whoosh.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={evStarve.start_frame} durationInFrames={35}>
        <Audio src={staticFile("reels/riddle_05/sfx/notification.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={evCountdown.start_frame} durationInFrames={40}>
        <Audio src={staticFile("reels/riddle_05/sfx/clock-ticking.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={evNemiGuess.start_frame + 10} durationInFrames={30}>
        <Audio src={staticFile("reels/riddle_05/sfx/error.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={evReveal.start_frame} durationInFrames={40}>
        <Audio src={staticFile("reels/riddle_05/sfx/notification.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={evPayoff.start_frame} durationInFrames={45}>
        <Audio src={staticFile("reels/riddle_05/sfx/chime.mp3")} volume={1.0} />
      </Sequence>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* STATIC HIGH-RES STUDIO GLOW */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5, opacity: darkProgress }}>
        <div
          style={{
            position: "absolute",
            top: 200,
            left: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: frame >= evReveal.start_frame
              ? "radial-gradient(circle, rgba(244, 63, 94, 0.2) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 650,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: frame >= evReveal.start_frame
              ? "radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(255, 209, 102, 0.14) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOP HUD (Safe Zone: top: 85px, sides: 70px) */}
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
              backgroundColor: frame >= evReveal.start_frame ? nemiTheme.colors.brandCoral : nemiTheme.colors.brandYellow,
              boxShadow: `0 0 24px ${frame >= evReveal.start_frame ? nemiTheme.colors.brandCoral : nemiTheme.colors.brandYellow}`,
              transform: `scale(${interpolate(frame % 20, [0, 10, 20], [1.0, 1.25, 1.0])})`,
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: "1.5px",
              color: frame >= evReveal.start_frame ? nemiTheme.colors.brandCoral : "#D97706",
              textTransform: "uppercase",
            }}
          >
            {frame >= evReveal.start_frame ? "DEADLOCK DETECTED" : "LOGIC PUZZLE"}
          </span>
        </div>

        <div
          style={{
            backgroundColor: hudBg,
            padding: "12px 24px",
            borderRadius: 24,
            border: `2px solid ${hudBorder}`,
            fontSize: 20,
            fontWeight: 900,
            color: frame >= evReveal.start_frame ? "#F43F5E" : "#D97706",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {frame < evCountdown.start_frame && "PHASE 1: THE RIDDLE"}
          {frame >= evCountdown.start_frame && frame < evReveal.start_frame && "PHASE 2: 3s COUNTDOWN"}
          {frame >= evReveal.start_frame && "PHASE 3: CS REVELATION"}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TOPIC HEADLINE (Safe Zone: top: 165px, sides: 70px) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          top: 165,
          left: 70,
          right: 70,
          zIndex: 50,
        }}
      >
        <h1
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: textHeading,
            letterSpacing: "-1.5px",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Can You Solve This:{" "}
          <span style={{ color: frame >= evReveal.start_frame ? "#F43F5E" : "#D97706" }}>
            {frame >= evReveal.start_frame ? "The System Deadlock!" : "The 5 Masters Riddle"}
          </span>
        </h1>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DYNAMIC STAGE CONTAINER */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* BEAT 1 & 2: THE 5 MASTERS TABLE & CIRCULAR TRAP */}
        <StageWrapper frame={frame} startFrame={0} endFrame={evCountdown.start_frame + 6}>
          <Beat1PhilosophersTable
            frame={frame}
            fps={fps}
            evLeftGrab={evLeftGrab.start_frame}
            evStarve={evStarve.start_frame}
            darkProgress={darkProgress}
          />
        </StageWrapper>

        {/* BEAT 3: 3-SECOND TICKING COUNTDOWN & NEMI WRONG GUESS */}
        <StageWrapper frame={frame} startFrame={evCountdown.start_frame} endFrame={evReveal.start_frame + 6}>
          <Beat2CountdownAndGuess frame={frame} fps={fps} startFrame={evCountdown.start_frame} nemiGuessFrame={evNemiGuess.start_frame} />
        </StageWrapper>

        {/* BEAT 4: THE REVELATION — OS THREAD DEADLOCK */}
        <StageWrapper frame={frame} startFrame={evReveal.start_frame} endFrame={evPayoff.start_frame + 6}>
          <Beat3DeadlockMechanism frame={frame} fps={fps} startFrame={evReveal.start_frame} />
        </StageWrapper>

        {/* BEAT 5: MASCOT PAYOFF & FINAL SUMMARY */}
        <StageWrapper frame={frame} startFrame={evPayoff.start_frame} endFrame={totalFrames}>
          <Beat4SummaryCard frame={frame} fps={fps} startFrame={evPayoff.start_frame} />
        </StageWrapper>

        {/* ══════════════════════════════════════════════════════ */}
        {/* DYNAMIC MID-SCREEN VISUAL ASSETS (Safe Zone: top: 920px) */}
        {/* ══════════════════════════════════════════════════════ */}
        <MidScreenDynamicBadges
          frame={frame}
          evLeftGrab={evLeftGrab.start_frame}
          evStarve={evStarve.start_frame}
          evCountdown={evCountdown.start_frame}
          evReveal={evReveal.start_frame}
          darkProgress={darkProgress}
        />

        {/* ══════════════════════════════════════════════════════ */}
        {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
        {/* ══════════════════════════════════════════════════════ */}
        {!nemiSpeech && <DynamicKaraokeCaptions frame={frame} fps={fps} />}
      </div>

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
        {/* Bouncy Floating Question Mark in Hook (Frames 0-35) */}
        {frame < 40 && (
          <div
            style={{
              position: "absolute",
              top: -60,
              display: "flex",
              gap: 12,
              animation: "bounce 1s infinite",
            }}
          >
            <span style={{ fontSize: 36, filter: "drop-shadow(0 4px 12px rgba(245, 158, 11, 0.5))" }}>❓</span>
            <span style={{ fontSize: 44, transform: "translateY(-10px)", filter: "drop-shadow(0 4px 12px rgba(245, 158, 11, 0.6))" }}>🤔</span>
            <span style={{ fontSize: 36, filter: "drop-shadow(0 4px 12px rgba(245, 158, 11, 0.5))" }}>❓</span>
          </div>
        )}
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
// STAGE 1: THE 5 PHILOSOPHERS TABLE WITH KINETIC HOOK & SPAWNS
// ═══════════════════════════════════════════════════════════════
const Beat1PhilosophersTable: React.FC<{
  frame: number;
  fps: number;
  evLeftGrab: number;
  evStarve: number;
  darkProgress: number;
}> = ({ frame, fps, evLeftGrab, evStarve, darkProgress }) => {
  const isLeftGrabbed = frame >= evLeftGrab;
  const isStarving = frame >= evStarve;

  const cardBg = interpolateColors(darkProgress, [0, 1], ["#FFFFFF", "#0B1120"]);
  const cardBorder = interpolateColors(
    darkProgress,
    [0, 1],
    [
      "#E2E8F0",
      isStarving ? "#F43F5E" : isLeftGrabbed ? "#FFD166" : "#06B6D4",
    ]
  );
  const tableFill = interpolateColors(darkProgress, [0, 1], ["#F1F5F9", "#111C35"]);
  const tableStroke = interpolateColors(darkProgress, [0, 1], ["#CBD5E1", isStarving ? "#F43F5E" : "#1E293B"]);
  const textColor = interpolateColors(darkProgress, [0, 1], ["#0F172A", "#F8FAFC"]);

  // 5 Philosophers at 72 deg angles around center (240, 210)
  const philosophers = [
    { id: 0, label: "1", angle: -90, spawnFrame: 35 },
    { id: 1, label: "2", angle: -18, spawnFrame: 45 },
    { id: 2, label: "3", angle: 54, spawnFrame: 55 },
    { id: 3, label: "4", angle: 126, spawnFrame: 65 },
    { id: 4, label: "5", angle: 198, spawnFrame: 75 },
  ];

  const tableRadius = 160;
  const centerX = 240;
  const centerY = 210;

  // Frame 0-35 Hook: Animated Mystery Badge
  const isHookIntro = frame < 36;
  const hookPop = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });

  // Steam floating animation for the ramen bowl
  const steamY1 = (frame * 1.5) % 30;
  const steamY2 = ((frame + 15) * 1.5) % 30;

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: cardBg,
        borderRadius: 32,
        border: `3.5px solid ${cardBorder}`,
        boxShadow: darkProgress > 0.5
          ? `0 24px 70px ${isStarving ? "rgba(244, 63, 94, 0.3)" : "rgba(6, 182, 212, 0.25)"}`
          : "0 24px 60px rgba(0, 0, 0, 0.08)",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      {/* Top Table Status Bar */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🥢</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: textColor }}>The Dining Table</span>
        </div>
        <div
          style={{
            backgroundColor: darkProgress < 0.5
              ? "#FEF3C7"
              : isStarving
              ? "rgba(244, 63, 94, 0.25)"
              : "rgba(6, 182, 212, 0.2)",
            color: darkProgress < 0.5
              ? "#D97706"
              : isStarving
              ? "#F43F5E"
              : "#06B6D4",
            border: `1.5px solid ${darkProgress < 0.5 ? "#FDE68A" : isStarving ? "#F43F5E" : "#06B6D4"}`,
            padding: "6px 14px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 900,
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          {isStarving ? "⚠️ DEADLOCK STARVATION" : isLeftGrabbed ? "HOLDING 1 CHOPSTICK" : "RULE: NEED 2 TO EAT"}
        </div>
      </div>

      {/* SVG Circular Table Diagram with High-Energy Kinetic Drop-ins */}
      <div style={{ position: "relative", width: 480, height: 390 }}>
        {/* Frame 0-35 Hook Badge Overlay */}
        {isHookIntro && (
          <div
            style={{
              position: "absolute",
              top: 60,
              left: 30,
              right: 30,
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              borderRadius: 24,
              border: "3.5px solid #F59E0B",
              boxShadow: "0 20px 50px rgba(245, 158, 11, 0.4)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `scale(${hookPop})`,
              zIndex: 50,
            }}
          >
            <span style={{ fontSize: 48 }}>🤔❓</span>
            <span style={{ fontSize: 28, fontWeight: 900, color: "#92400E", marginTop: 8, textAlign: "center" }}>
              50-YEAR-OLD RIDDLE
            </span>
            <div
              style={{
                backgroundColor: "#FEF3C7",
                border: "1.5px solid #FCD34D",
                padding: "6px 16px",
                borderRadius: 12,
                fontSize: 15,
                color: "#B45309",
                fontWeight: 900,
                marginTop: 8,
              }}
            >
              🔥 99% OF PROGRAMMERS FAIL!
            </div>
          </div>
        )}

        <svg width="480" height="390" viewBox="0 0 480 420">
          {/* Outer Table Circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={tableRadius}
            fill={tableFill}
            stroke={tableStroke}
            strokeWidth="4"
          />

          {/* Central Rice Bowl with Animated Steam */}
          <g>
            <circle cx={centerX} cy={centerY} r={50} fill={darkProgress < 0.5 ? "#E2E8F0" : "#1E293B"} stroke={darkProgress < 0.5 ? "#CBD5E1" : "#334155"} strokeWidth="3" />
            <text x={centerX} y={centerY + 8} textAnchor="middle" fill="#FFD166" fontSize="28" fontWeight="900">
              🍜
            </text>
            {/* Rising Steam Lines */}
            <path
              d={`M ${centerX - 12} ${centerY - 25 - steamY1} Q ${centerX - 6} ${centerY - 35 - steamY1} ${centerX - 12} ${centerY - 45 - steamY1}`}
              stroke="#CBD5E1"
              strokeWidth="2.5"
              fill="none"
              opacity={Math.max(0, 1 - steamY1 / 30)}
            />
            <path
              d={`M ${centerX + 12} ${centerY - 25 - steamY2} Q ${centerX + 18} ${centerY - 35 - steamY2} ${centerX + 12} ${centerY - 45 - steamY2}`}
              stroke="#CBD5E1"
              strokeWidth="2.5"
              fill="none"
              opacity={Math.max(0, 1 - steamY2 / 30)}
            />
          </g>

          {/* Circular Red Dependency Arrows when Starving */}
          {isStarving && (
            <circle
              cx={centerX}
              cy={centerY}
              r={tableRadius - 28}
              fill="none"
              stroke="#F43F5E"
              strokeWidth="4"
              strokeDasharray="14 8"
            />
          )}

          {/* Render 5 Philosophers & 5 Chopsticks with Drop-in Animation */}
          {philosophers.map((p, idx) => {
            const rad = (p.angle * Math.PI) / 180;
            const px = centerX + tableRadius * Math.cos(rad);
            const py = centerY + tableRadius * Math.sin(rad);

            // Chopstick angle halfway between this and next philosopher
            const midAngle = p.angle + 36;
            const midRad = (midAngle * Math.PI) / 180;
            const cx = centerX + (tableRadius - 52) * Math.cos(midRad);
            const cy = centerY + (tableRadius - 52) * Math.sin(midRad);

            // Staggered drop-in scale for philosophers in the first 5 seconds
            const philosopherPop = spring({
              frame: frame - p.spawnFrame,
              fps,
              config: { damping: 12, stiffness: 130 },
            });
            const pScale = frame >= p.spawnFrame ? Math.min(1.0, Math.max(0, philosopherPop)) : 0;

            // Chopsticks fly in starting at frame 90
            const chopstickPop = spring({
              frame: frame - (90 + idx * 4),
              fps,
              config: { damping: 12, stiffness: 130 },
            });
            const cScale = frame >= (90 + idx * 4) ? Math.min(1.0, Math.max(0, chopstickPop)) : (frame >= 36 ? 0.6 : 0);

            return (
              <g key={p.id}>
                {/* Left Grab Line when active */}
                {isLeftGrabbed && (
                  <line
                    x1={px}
                    y1={py}
                    x2={cx}
                    y2={cy}
                    stroke="#FFD166"
                    strokeWidth="4"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Chopstick Icon with Elastic Entry */}
                <g transform={`translate(${cx}, ${cy}) scale(${cScale}) translate(${-cx}, ${-cy})`}>
                  <circle cx={cx} cy={cy} r={20} fill={isLeftGrabbed ? "#FFD166" : darkProgress < 0.5 ? "#CBD5E1" : "#334155"} />
                  <text x={cx} y={cy + 6} textAnchor="middle" fill="#0F172A" fontSize="16" fontWeight="900">
                    🥢
                  </text>
                </g>

                {/* Philosopher Node with Staggered Drop-in */}
                <g transform={`translate(${px}, ${py}) scale(${pScale}) translate(${-px}, ${-py})`}>
                  <circle
                    cx={px}
                    cy={py}
                    r={32}
                    fill={isStarving ? "#F43F5E" : isLeftGrabbed ? "#FFD166" : darkProgress < 0.5 ? "#0284C7" : "#06B6D4"}
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                  />
                  <text x={px} y={py + 8} textAnchor="middle" fill="#0F172A" fontSize="20" fontWeight="900">
                    {isStarving ? "💀" : "🧙‍♂️"}
                  </text>
                  {/* Master ID Badge */}
                  {!isStarving && (
                    <g transform={`translate(${px + 22}, ${py - 22})`}>
                      <circle cx={0} cy={0} r={12} fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
                      <text x={0} y={4} textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900">
                        {p.label}
                      </text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ fontSize: 18, color: darkProgress < 0.5 ? "#64748B" : "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        {isStarving
          ? "Nobody drops their chopstick ➔ Infinite Circular Wait!"
          : isLeftGrabbed
          ? "All 5 grabbed left... now waiting for right!"
          : "5 Masters • 5 Chopsticks • 2 needed per meal"}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// STAGE 2: 3-SECOND COUNTDOWN & NEMI'S WRONG GUESS
// ═══════════════════════════════════════════════════════════════
const Beat2CountdownAndGuess: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  nemiGuessFrame: number;
}> = ({ frame, fps, startFrame, nemiGuessFrame }) => {
  const localFrame = frame - startFrame;
  const isGuessActive = frame >= nemiGuessFrame;

  // 3-second countdown calculation
  const secondsLeft = Math.max(1, 3 - Math.floor(localFrame / 20));

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: "#0B1120",
        borderRadius: 32,
        border: "3.5px solid #FFD166",
        boxShadow: "0 28px 70px rgba(255, 209, 102, 0.35)",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 30,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 22, color: "#FFD166", fontWeight: 900, letterSpacing: "1.5px", textTransform: "uppercase" }}>
          ⏱️ CAN YOU SOLVE IT?
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#F8FAFC", marginTop: 8 }}>
          What invisible curse killed them?
        </div>
      </div>

      {/* Massive Ticking Countdown Clock */}
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          backgroundColor: "#0F172A",
          border: "5px solid #FFD166",
          boxShadow: "0 0 45px rgba(255, 209, 102, 0.5)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 68, fontWeight: 900, color: "#FFD166", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          {secondsLeft}
        </span>
        <span style={{ fontSize: 16, color: "#94A3B8", fontWeight: 800 }}>SECONDS</span>
      </div>

      {/* Nemi Guess & Red Wrong Stamp */}
      <div style={{ width: "100%", textAlign: "center" }}>
        {isGuessActive ? (
          <div
            style={{
              backgroundColor: "rgba(244, 63, 94, 0.25)",
              border: "2.5px solid #F43F5E",
              borderRadius: 20,
              padding: "16px 24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 34 }}>❌</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#F43F5E" }}>
              WRONG GUESS: "Food Poisoning" 🙅‍♂️
            </span>
          </div>
        ) : (
          <div style={{ fontSize: 22, color: "#64748B", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            Pause to guess or comment below 👇
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// STAGE 3: THE CS REVELATION — OPERATING SYSTEM THREAD DEADLOCK
// ═══════════════════════════════════════════════════════════════
const Beat3DeadlockMechanism: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: "#0B1120",
        borderRadius: 32,
        border: "3.5px solid #F43F5E",
        boxShadow: "0 28px 80px rgba(244, 63, 94, 0.45)",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 34 }}>🚨</span>
          <span style={{ fontSize: 28, fontWeight: 900, color: "#F43F5E", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            IT'S A DEADLOCK!
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(244, 63, 94, 0.25)", color: "#F43F5E", border: "1.5px solid #F43F5E", padding: "6px 14px", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          CPU 100% FROZEN ❄️
        </span>
      </div>

      {/* Dual Thread Deadlock Diagram */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Thread A */}
        <div
          style={{
            backgroundColor: "#0F172A",
            padding: "20px",
            borderRadius: 22,
            border: "2px solid #38BDF8",
            boxShadow: "0 0 30px rgba(56, 189, 248, 0.25)",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, color: "#38BDF8" }}>🧵 THREAD A</div>
          <div style={{ fontSize: 18, color: "#10B981", marginTop: 8, fontWeight: 800 }}>🔒 Holds: Lock 1</div>
          <div style={{ fontSize: 18, color: "#F43F5E", marginTop: 4, fontWeight: 800 }}>⏳ Waiting: Lock 2</div>
        </div>

        {/* Thread B */}
        <div
          style={{
            backgroundColor: "#0F172A",
            padding: "20px",
            borderRadius: 22,
            border: "2px solid #A855F7",
            boxShadow: "0 0 30px rgba(168, 85, 247, 0.25)",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, color: "#C084FC" }}>🧵 THREAD B</div>
          <div style={{ fontSize: 18, color: "#10B981", marginTop: 8, fontWeight: 800 }}>🔒 Holds: Lock 2</div>
          <div style={{ fontSize: 18, color: "#F43F5E", marginTop: 4, fontWeight: 800 }}>⏳ Waiting: Lock 1</div>
        </div>
      </div>

      {/* Fatal Circular Dependency Strip */}
      <div
        style={{
          backgroundColor: "#03070D",
          padding: "16px 22px",
          borderRadius: 18,
          border: "2px solid #F43F5E",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700 }}>
          Neither thread releases until the other finishes!
        </span>
        <span style={{ color: "#F43F5E", fontWeight: 900, fontSize: 19, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          Circular Lock 🛑
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        This 50-year-old riddle explains why <span style={{ color: "#F43F5E", fontWeight: 900 }}>multi-threaded servers freeze!</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// STAGE 4: MASCOT PAYOFF & 4 COFFMAN CONDITIONS CONSOLE
// ═══════════════════════════════════════════════════════════════
const Beat4SummaryCard: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 65,
        right: 65,
        height: 520,
        backgroundColor: "#0B1120",
        borderRadius: 32,
        border: "3.5px solid #10B981",
        boxShadow: "0 28px 80px rgba(16, 185, 129, 0.35)",
        padding: "28px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 34 }}>🛡️</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#10B981", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            The 4 Deadlock Rules
          </span>
        </div>
        <span style={{ backgroundColor: "rgba(16, 185, 129, 0.25)", color: "#10B981", border: "1.5px solid #10B981", padding: "6px 14px", borderRadius: 12, fontSize: 17, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          COFFMAN CONDITIONS
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "1.5px solid #1E293B" }}>
          <div style={{ color: "#FFD166", fontWeight: 900, fontSize: 18 }}>1. Mutual Exclusion</div>
          <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>1 resource per thread</div>
        </div>
        <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "1.5px solid #1E293B" }}>
          <div style={{ color: "#06B6D4", fontWeight: 900, fontSize: 18 }}>2. Hold & Wait</div>
          <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>Holding while waiting</div>
        </div>
        <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "1.5px solid #1E293B" }}>
          <div style={{ color: "#A855F7", fontWeight: 900, fontSize: 18 }}>3. No Preemption</div>
          <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>Cannot forcibly take</div>
        </div>
        <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: 16, border: "1.5px solid #F43F5E" }}>
          <div style={{ color: "#F43F5E", fontWeight: 900, fontSize: 18 }}>4. Circular Wait 🔄</div>
          <div style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>The fatal closed loop</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#03070D", padding: "16px 24px", borderRadius: 18, border: "1px solid rgba(255, 255, 255, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#F8FAFC", fontSize: 18 }}>Break any 1 condition to prevent deadlock!</span>
        <span style={{ color: "#10B981", fontWeight: 900, fontSize: 18, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          SOLVED ✓
        </span>
      </div>

      <div style={{ fontSize: 19, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
        Tag a developer who has caused a server deadlock! 👇
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC MID-SCREEN VISUAL ASSETS (Safe Zone: top: 920px)
// ═══════════════════════════════════════════════════════════════
const MidScreenDynamicBadges: React.FC<{
  frame: number;
  evLeftGrab: number;
  evStarve: number;
  evCountdown: number;
  evReveal: number;
  darkProgress: number;
}> = ({ frame, evLeftGrab, evStarve, evCountdown, evReveal, darkProgress }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 920,
        left: 70,
        right: 70,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 35,
      }}
    >
      {frame < evLeftGrab && (
        <div
          style={{
            backgroundColor: darkProgress < 0.5 ? "#E0F2FE" : "rgba(6, 182, 212, 0.15)",
            border: `2px solid ${darkProgress < 0.5 ? "#0284C7" : "#06B6D4"}`,
            padding: "12px 28px",
            borderRadius: 20,
            color: darkProgress < 0.5 ? "#0369A1" : "#06B6D4",
            fontSize: 22,
            fontWeight: 900,
            fontFamily: nemiTheme.typography.fontFamily.mono,
          }}
        >
          🥢 5 Masters • 5 Chopsticks
        </div>
      )}

      {frame >= evLeftGrab && frame < evStarve && (
        <div style={{ backgroundColor: "rgba(255, 209, 102, 0.15)", border: "2px solid #FFD166", padding: "12px 28px", borderRadius: 20, color: "#FFD166", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ⏳ Simultaneously Grabbed Left Chopstick!
        </div>
      )}

      {frame >= evStarve && frame < evCountdown && (
        <div style={{ backgroundColor: "rgba(244, 63, 94, 0.2)", border: "2.5px solid #F43F5E", padding: "12px 28px", borderRadius: 20, color: "#F43F5E", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          🛑 Unbroken Ring of Starvation!
        </div>
      )}

      {frame >= evCountdown && frame < evReveal && (
        <div style={{ backgroundColor: "rgba(255, 209, 102, 0.2)", border: "2.5px solid #FFD166", padding: "12px 28px", borderRadius: 20, color: "#FFD166", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          🤔 What is the computer science term?
        </div>
      )}

      {frame >= evReveal && (
        <div style={{ backgroundColor: "rgba(56, 189, 248, 0.2)", border: "2.5px solid #38BDF8", padding: "12px 28px", borderRadius: 20, color: "#38BDF8", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          ❄️ Multi-Threaded Resource Deadlock
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px, sides: 65px)
// ═══════════════════════════════════════════════════════════════
const DynamicKaraokeCaptions: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const subtitles = cuesData.subtitles || [];
  
  // Continuous search so small inter-word gaps don't cause container flicker
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
          border: "2px solid rgba(255, 209, 102, 0.55)",
          boxShadow: "0 14px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(255, 209, 102, 0.25)",
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

// ═══════════════════════════════════════════════════════════════
// SILKY SMOOTH CROSS-FADE STAGE WRAPPER
// ═══════════════════════════════════════════════════════════════
const StageWrapper: React.FC<{
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  endFrame: number;
}> = ({ children, frame, startFrame, endFrame }) => {
  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const enterOpacity = interpolate(frame, [startFrame, startFrame + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = interpolate(frame, [endFrame - 6, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = Math.min(enterOpacity, exitOpacity);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: opacity > 0.1 ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
};
