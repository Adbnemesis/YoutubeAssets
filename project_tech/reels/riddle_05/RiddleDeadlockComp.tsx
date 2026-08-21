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
import cuesData from "../../src/data/riddle_05_cues.json";

export const nemiTheme = {
  colors: {
    brandYellow: "#FFD166",
    brandCyan: "#06B6D4",
    brandPurple: "#A855F7",
    brandGreen: "#10B981",
    brandCoral: "#F43F5E",
    brandIce: "#38BDF8",
    canvasDark: "#070B12",
    cardDark: "#0F172A",
    textLight: "#F8FAFC",
    textMuted: "#94A3B8",
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

  // ─── Smooth Steady Cinematic Camera (No Jerking / Wobble) ───
  const cameraScale = interpolate(frame, [0, totalFrames], [1.0, 1.02], {
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
        backgroundColor: nemiTheme.colors.canvasDark,
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
      <Sequence from={evSetup.start_frame} durationInFrames={30}>
        <Audio src={staticFile("reels/riddle_05/sfx/pop.mp3")} volume={1.0} />
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
      {/* STATIC HIGH-RES STUDIO GLOW (NO FLICKERING ORBS) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
        <div
          style={{
            position: "absolute",
            top: 200,
            left: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: frame >= evReveal.start_frame
              ? "radial-gradient(circle, rgba(244, 63, 94, 0.18) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 600,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: frame >= evReveal.start_frame
              ? "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(0,0,0,0) 70%)"
              : "radial-gradient(circle, rgba(255, 209, 102, 0.12) 0%, rgba(0,0,0,0) 70%)",
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
              color: frame >= evReveal.start_frame ? nemiTheme.colors.brandCoral : nemiTheme.colors.brandYellow,
              textTransform: "uppercase",
            }}
          >
            {frame >= evReveal.start_frame ? "DEADLOCK DETECTED" : "LOGIC PUZZLE"}
          </span>
        </div>

        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            padding: "12px 24px",
            borderRadius: 24,
            border: "2px solid #1E293B",
            fontSize: 20,
            fontWeight: 900,
            color: frame >= evReveal.start_frame ? "#F43F5E" : "#FFD166",
            fontFamily: nemiTheme.typography.fontFamily.mono,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
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
            color: "#F8FAFC",
            letterSpacing: "-1.5px",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Can You Solve This:{" "}
          <span style={{ color: frame >= evReveal.start_frame ? "#F43F5E" : "#FFD166" }}>
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
        <StageWrapper frame={frame} startFrame={0} endFrame={evCountdown.start_frame}>
          <Beat1PhilosophersTable frame={frame} fps={fps} evLeftGrab={evLeftGrab.start_frame} evStarve={evStarve.start_frame} />
        </StageWrapper>

        {/* BEAT 3: 3-SECOND TICKING COUNTDOWN & NEMI WRONG GUESS */}
        <StageWrapper frame={frame} startFrame={evCountdown.start_frame} endFrame={evReveal.start_frame}>
          <Beat2CountdownAndGuess frame={frame} fps={fps} startFrame={evCountdown.start_frame} nemiGuessFrame={evNemiGuess.start_frame} />
        </StageWrapper>

        {/* BEAT 4: THE REVELATION — OS THREAD DEADLOCK */}
        <StageWrapper frame={frame} startFrame={evReveal.start_frame} endFrame={evPayoff.start_frame}>
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
        />

        {/* ══════════════════════════════════════════════════════ */}
        {/* DYNAMIC VIRAL KARAOKE CAPTIONS (Safe Zone: top: 1140px) */}
        {/* Hidden when Nemi's Speech Bubble is active */}
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
// STAGE 1: THE 5 PHILOSOPHERS TABLE WITH INTERACTIVE CHOPSTICKS
// ═══════════════════════════════════════════════════════════════
const Beat1PhilosophersTable: React.FC<{
  frame: number;
  fps: number;
  evLeftGrab: number;
  evStarve: number;
}> = ({ frame, fps, evLeftGrab, evStarve }) => {
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const isLeftGrabbed = frame >= evLeftGrab;
  const isStarving = frame >= evStarve;

  // 5 Philosophers at 72 deg angles around center (240, 210)
  const philosophers = [
    { id: 0, label: "P1", angle: -90 },
    { id: 1, label: "P2", angle: -18 },
    { id: 2, label: "P3", angle: 54 },
    { id: 3, label: "P4", angle: 126 },
    { id: 4, label: "P5", angle: 198 },
  ];

  const tableRadius = 160;
  const centerX = 240;
  const centerY = 210;

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
        border: `3px solid ${isStarving ? "#F43F5E" : isLeftGrabbed ? "#FFD166" : "#06B6D4"}`,
        boxShadow: `0 24px 70px ${isStarving ? "rgba(244, 63, 94, 0.3)" : "rgba(6, 182, 212, 0.25)"}`,
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        transform: `scale(${pop})`,
        zIndex: 30,
      }}
    >
      {/* Top Table Status Bar */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🥢</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#F8FAFC" }}>The Dining Table</span>
        </div>
        <div
          style={{
            backgroundColor: isStarving ? "rgba(244, 63, 94, 0.25)" : "rgba(6, 182, 212, 0.2)",
            color: isStarving ? "#F43F5E" : "#06B6D4",
            border: `1.5px solid ${isStarving ? "#F43F5E" : "#06B6D4"}`,
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

      {/* SVG Circular Table Diagram */}
      <div style={{ position: "relative", width: 480, height: 390 }}>
        <svg width="480" height="390" viewBox="0 0 480 420">
          {/* Outer Table Circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={tableRadius}
            fill="#111C35"
            stroke={isStarving ? "#F43F5E" : "#1E293B"}
            strokeWidth="4"
          />

          {/* Central Rice Bowl */}
          <circle cx={centerX} cy={centerY} r={50} fill="#1E293B" stroke="#334155" strokeWidth="3" />
          <text x={centerX} y={centerY + 8} textAnchor="middle" fill="#FFD166" fontSize="28" fontWeight="900">
            🍜
          </text>

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

          {/* Render 5 Philosophers & 5 Chopsticks */}
          {philosophers.map((p, idx) => {
            const rad = (p.angle * Math.PI) / 180;
            const px = centerX + tableRadius * Math.cos(rad);
            const py = centerY + tableRadius * Math.sin(rad);

            // Chopstick angle halfway between this and next philosopher
            const nextP = philosophers[(idx + 1) % 5];
            const midAngle = p.angle + 36;
            const midRad = (midAngle * Math.PI) / 180;
            const cx = centerX + (tableRadius - 52) * Math.cos(midRad);
            const cy = centerY + (tableRadius - 52) * Math.sin(midRad);

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

                {/* Chopstick Icon */}
                <circle cx={cx} cy={cy} r={20} fill={isLeftGrabbed ? "#FFD166" : "#334155"} />
                <text x={cx} y={cy + 6} textAnchor="middle" fill="#0F172A" fontSize="16" fontWeight="900">
                  🥢
                </text>

                {/* Philosopher Node */}
                <circle
                  cx={px}
                  cy={py}
                  r={30}
                  fill={isStarving ? "#F43F5E" : isLeftGrabbed ? "#FFD166" : "#06B6D4"}
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
                <text x={px} y={py + 8} textAnchor="middle" fill="#0F172A" fontSize="20" fontWeight="900">
                  {isStarving ? "💀" : "🧙‍♂️"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ fontSize: 18, color: "#94A3B8", textAlign: "center", fontFamily: nemiTheme.typography.fontFamily.mono }}>
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
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
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
        border: "3px solid #FFD166",
        boxShadow: "0 28px 70px rgba(255, 209, 102, 0.35)",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        transform: `scale(${pop})`,
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
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });

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
        border: "3px solid #F43F5E",
        boxShadow: "0 28px 80px rgba(244, 63, 94, 0.45)",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${pop})`,
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
  const localFrame = frame - startFrame;
  const pop = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });

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
        border: "3px solid #10B981",
        boxShadow: "0 28px 80px rgba(16, 185, 129, 0.35)",
        padding: "28px 34px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${pop})`,
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
}> = ({ frame, evLeftGrab, evStarve, evCountdown, evReveal }) => {
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
        <div style={{ backgroundColor: "rgba(6, 182, 212, 0.15)", border: "2px solid #06B6D4", padding: "12px 28px", borderRadius: 20, color: "#06B6D4", fontSize: 22, fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
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
  const currentChunk = subtitles.find(
    (chunk: any) => frame >= chunk.start_frame && frame <= chunk.end_frame + 2
  );

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
// SILKY SMOOTH STAGE WRAPPER
// ═══════════════════════════════════════════════════════════════
const StageWrapper: React.FC<{
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  endFrame: number;
}> = ({ children, frame, startFrame, endFrame }) => {
  if (frame < startFrame - 4 || frame > endFrame + 4) {
    return null;
  }

  const enterOpacity = interpolate(frame, [startFrame, startFrame + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = interpolate(frame, [endFrame - 4, endFrame], [1, 0], {
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
