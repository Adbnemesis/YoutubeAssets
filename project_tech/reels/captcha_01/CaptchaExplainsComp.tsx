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
import { NemiMascot } from "../../src/components/NemiMascot";
import { NEMI_THEME } from "../../src/constants/nemiTheme";

const nemiTheme = {
  colors: {
    canvasLight: NEMI_THEME.colors.bg.cream,
    canvasDark: "#0A0D14",
    brandYellow: NEMI_THEME.colors.brand.yellow,
    accentCyan: NEMI_THEME.colors.brand.cyan,
    textHeading: NEMI_THEME.colors.text.headingDark,
    textLight: NEMI_THEME.colors.text.headingLight,
  },
  typography: {
    fontFamily: {
      sans: NEMI_THEME.typography.fontDisplay,
      mono: NEMI_THEME.typography.fontCode,
    },
  },
};

export const CaptchaExplainsComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══════════════════════════════════════════════════════════════
  // EXACT BEAT TIMING BOUNDARIES (Snappy Dual-Voice ~22.79s @ 30fps)
  // ═══════════════════════════════════════════════════════════════
  // Beat 1: Hook & Click (0 - 100 frames | ~0 - 3.3s)
  // Beat 2: Bot 0.001s Speed & Block (101 - 244 frames | ~3.4 - 8.1s)
  // Beat 3: Trajectory Arena & Kinematics (245 - 360 frames | ~8.2 - 12.0s)
  // Beat 4: 8-12Hz Micro-Jitters & Biometrics (361 - 535 frames | ~12.0 - 17.8s)
  // Beat 5: Payoff & Takeaway Console (536 - 683 frames | ~17.9 - 22.79s)
  
  const isBeat1 = frame < 101;
  const isBeat2 = frame >= 101 && frame < 245;
  const isBeat3 = frame >= 245 && frame < 361;
  const isBeat4 = frame >= 361 && frame < 536;
  const isBeat5 = frame >= 536;

  // Global Camera Drift & Impact Punch
  const cameraScale = interpolate(
    frame,
    [0, 36, 42, 101, 165, 245, 361, 536, 683],
    [1.0, 1.03, 1.01, 1.02, 1.04, 1.02, 1.05, 1.02, 1.0],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isBeat3 || isBeat4 || isBeat2 ? "#090D16" : nemiTheme.colors.canvasLight,
        color: isBeat3 || isBeat4 || isBeat2 ? "#F8FAFC" : nemiTheme.colors.textHeading,
        fontFamily: nemiTheme.typography.fontFamily.sans,
        overflow: "hidden",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* ══════════════════════════════════════════════════════════ */}
      {/* MASTER AUDIO TRACK (Chatterbox Deep Narrator + Snappy Ana Nemi) */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Audio src={staticFile("reels/captcha_01/captcha_master_audio.mp3")} />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* RICH SYNCHRONIZED SOUND EFFECTS LAYER */}
      {/* ══════════════════════════════════════════════════════════ */}
      {/* 1. Beat 1 Click Sound Effect (Frame 36) */}
      <Sequence from={36} durationInFrames={30}>
        <Audio src={staticFile("reels/captcha_01/sfx/click.mp3")} volume={0.8} />
      </Sequence>

      {/* 2. Beat 1 Nemi Shock Pop (Frame 67) */}
      <Sequence from={67} durationInFrames={35}>
        <Audio src={staticFile("reels/captcha_01/sfx/pop.mp3")} volume={0.7} />
      </Sequence>

      {/* 3. Beat 2 Code Typing SFX (Frame 105) */}
      <Sequence from={105} durationInFrames={45}>
        <Audio src={staticFile("reels/captcha_01/sfx/typing.mp3")} volume={0.45} />
      </Sequence>

      {/* 4. Beat 2 Bot Error Alarm SFX (Frame 165) */}
      <Sequence from={165} durationInFrames={45}>
        <Audio src={staticFile("reels/captcha_01/sfx/error.mp3")} volume={0.65} />
      </Sequence>

      {/* 5. Beat 3 Trajectory Whoosh (Frame 245) */}
      <Sequence from={245} durationInFrames={30}>
        <Audio src={staticFile("reels/captcha_01/sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>

      {/* 6. Beat 4 Biometric Scanner Whoosh (Frame 361) */}
      <Sequence from={361} durationInFrames={30}>
        <Audio src={staticFile("reels/captcha_01/sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>

      {/* 7. Beat 5 Nemi Aha Pop (Frame 539) */}
      <Sequence from={539} durationInFrames={35}>
        <Audio src={staticFile("reels/captcha_01/sfx/pop.mp3")} volume={0.7} />
      </Sequence>

      {/* 8. Beat 5 Humanity Verified Chime (Frame 612) */}
      <Sequence from={612} durationInFrames={60}>
        <Audio src={staticFile("reels/captcha_01/sfx/chime.mp3")} volume={0.85} />
      </Sequence>

      {/* Dynamic Cyber / Tech Grid Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: isBeat3 || isBeat4 || isBeat2
            ? "radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.18), transparent 70%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
            : "radial-gradient(circle at 50% 30%, rgba(255, 209, 102, 0.22), transparent 70%), linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Camera Scale Container */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* TOP ZONE: HEADER & DYNAMIC HEADLINE (Y: 60 - 340) */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 60,
            right: 60,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                backgroundColor: nemiTheme.colors.brandYellow,
                color: "#18181B",
                fontWeight: 900,
                fontSize: 15,
                letterSpacing: "2px",
                padding: "6px 16px",
                borderRadius: 999,
                textTransform: "uppercase",
                boxShadow: "0 4px 12px rgba(255, 209, 102, 0.3)",
              }}
            >
              SECURITY ARCHITECTURE
            </span>
            <span
              style={{
                backgroundColor: isBeat3 || isBeat4 || isBeat2 ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.06)",
                color: isBeat3 || isBeat4 || isBeat2 ? "#06B6D4" : "#475569",
                fontWeight: 800,
                fontSize: 14,
                padding: "6px 14px",
                borderRadius: 999,
                fontFamily: nemiTheme.typography.fontFamily.mono,
              }}
            >
              reCAPTCHA v2 / v3
            </span>
          </div>

          <h1
            style={{
              fontSize: isBeat3 ? 54 : 60,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-2px",
              color: isBeat3 || isBeat4 || isBeat2 ? "#F8FAFC" : nemiTheme.colors.textHeading,
              margin: 0,
              textShadow: isBeat3 || isBeat4 ? "0 4px 20px rgba(0,0,0,0.8)" : "none",
            }}
          >
            {isBeat1 && "How CAPTCHA Knows You're Human"}
            {isBeat2 && "Why 0.001s Clicks Get Blocked"}
            {isBeat3 && "The Movement Before The Click"}
            {isBeat4 && "Involuntary Muscle Tremors"}
            {isBeat5 && "How You Proved You're Human"}
          </h1>
        </div>

        {/* HERO INTERACTIVE UI ZONE (Y: 380 - 860) */}
        {isBeat1 && <Beat1CaptchaWidget frame={frame} fps={fps} />}
        {isBeat2 && <Beat2BotFailure frame={frame} fps={fps} />}
        {isBeat3 && <Beat3TrajectoryArena frame={frame} fps={fps} />}
        {isBeat4 && <Beat4BiometricScan frame={frame} fps={fps} />}
        {isBeat5 && <Beat5TakeawayConsole frame={frame} fps={fps} />}

        {/* CENTER MASCOT ZONE: NEMI ANIMATED REACTIONS (Y: 980) */}
        <NemiActorSection frame={frame} fps={fps} />

        {/* LOWER CONTEXT ZONE: HIGH-TECH CS CALLOUT (Y: 1340 - 1580) */}
        <div
          style={{
            position: "absolute",
            top: 1340,
            left: 60,
            right: 60,
            backgroundColor: isBeat3 || isBeat4 || isBeat2 ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(16px)",
            border: isBeat3 || isBeat4 || isBeat2 ? "1px solid rgba(6, 182, 212, 0.3)" : "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 22,
            padding: "24px 28px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
            zIndex: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: isBeat3 || isBeat4 || isBeat2 ? "#06B6D4" : "#D97706",
                fontFamily: nemiTheme.typography.fontFamily.mono,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              {isBeat1 && "💡 BEHAVIORAL TELEMETRY"}
              {isBeat2 && "⚠️ ZERO-LATENCY ANOMALY"}
              {isBeat3 && "📐 KINEMATIC TRAJECTORY PROFILING"}
              {isBeat4 && "🔬 BIOLOGICAL ENTROPY HARVESTING"}
              {isBeat5 && "🛡️ RECAPTCHA TAKEAWAY"}
            </span>
          </div>
          <p
            style={{
              fontSize: 20,
              fontWeight: 600,
              lineHeight: 1.35,
              color: isBeat3 || isBeat4 || isBeat2 ? "#E2E8F0" : "#334155",
              margin: 0,
            }}
          >
            {isBeat1 && "reCAPTCHA records mouse motion, velocity curves, and interaction entropy before the click."}
            {isBeat2 && "Instant 0.001s clicks lack physical acceleration, immediately failing bot classification."}
            {isBeat3 && "Bots move in straight linear vectors. Humans follow curved Bezier paths with acceleration shifts."}
            {isBeat4 && "Involuntary 8–12 Hz muscle micro-tremors produce chaotic biometric entropy impossible for simple scripts."}
            {isBeat5 && "Your humanity was verified by physical trajectory dynamics before the click even occurred."}
          </p>
        </div>

        {/* BOTTOM SAFE ZONE */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: nemiTheme.colors.brandYellow,
              boxShadow: `0 0 10px ${nemiTheme.colors.brandYellow}`,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: isBeat3 || isBeat4 || isBeat2 ? "#94A3B8" : "#64748B",
              letterSpacing: "1px",
              fontFamily: nemiTheme.typography.fontFamily.mono,
            }}
          >
            @nemi.explains
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 1: GRAND INTERACTIVE reCAPTCHA WIDGET WITH RIPPLE
// ═══════════════════════════════════════════════════════════════
const Beat1CaptchaWidget: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const popSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const isClicked = frame >= 36;
  const isSpinning = frame >= 24 && frame < 36;

  const cursorX = interpolate(frame, [0, 28, 36], [750, 480, 460], { extrapolateRight: "clamp" });
  const cursorY = interpolate(frame, [0, 28, 36], [220, 560, 570], { extrapolateRight: "clamp" });
  const cursorClickScale = interpolate(frame, [34, 36, 42], [1.0, 0.75, 1.0], { extrapolateRight: "clamp" });
  const rippleScale = interpolate(frame, [36, 50], [0.5, 2.2], { extrapolateRight: "clamp" });
  const rippleOpacity = interpolate(frame, [36, 50], [0.8, 0.0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: 400,
        left: 80,
        right: 80,
        height: 380,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        border: "3px solid #E2E8F0",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 60px",
        transform: `scale(${popSpring})`,
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      {/* Click Ripple Effect */}
      {isClicked && (
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 190,
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "rgba(16, 185, 129, 0.4)",
            transform: `translate(-50%, -50%) scale(${rippleScale})`,
            opacity: rippleOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 32, position: "relative", zIndex: 10 }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 14,
            border: isClicked ? "3px solid #10B981" : "3px solid #CBD5E1",
            backgroundColor: isClicked ? "#10B981" : "#F8FAFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isClicked ? "0 0 30px rgba(16, 185, 129, 0.5)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          {isSpinning && (
            <div
              style={{
                width: 38,
                height: 38,
                border: "4px solid #06B6D4",
                borderTopColor: "transparent",
                borderRadius: "50%",
                transform: `rotate(${frame * 30}deg)`,
              }}
            />
          )}
          {isClicked && (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>

        <span
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#1E293B",
            letterSpacing: "-0.5px",
          }}
        >
          I'm not a robot
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative", zIndex: 10 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 10,
            backgroundColor: "#0284C7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            fontSize: 26,
            boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
          }}
        >
          🔄
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#64748B" }}>reCAPTCHA</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>Privacy - Terms</span>
      </div>

      {/* Animated Mouse Cursor */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          transform: `scale(${cursorClickScale})`,
          zIndex: 100,
          pointerEvents: "none",
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.35))",
        }}
      >
        <svg width="46" height="46" viewBox="0 0 24 24" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5">
          <path d="M3 3l7 18 3-7 7-3L3 3z" />
        </svg>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 2: GLOWING PYTHON IDE & BOT 0.001s ALARM WITH GLITCH
// ═══════════════════════════════════════════════════════════════
const Beat2BotFailure: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 101;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isAlertVisible = localFrame > 60; // Trigger at frame 161 when c04_bot_block begins

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 60,
        right: 60,
        height: 440,
        backgroundColor: "#0F172A",
        borderRadius: 24,
        border: isAlertVisible ? "2px solid #F43F5E" : "2px solid #334155",
        boxShadow: isAlertVisible ? "0 0 40px rgba(244, 63, 94, 0.4)" : "0 24px 60px rgba(0, 0, 0, 0.6)",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
        transition: "border 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#EF4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
        </div>
        <span style={{ fontSize: 14, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          bot_exploit.py — [0.001s Instant Vector]
        </span>
      </div>

      <div style={{ fontFamily: nemiTheme.typography.fontFamily.mono, fontSize: 24, lineHeight: 1.6, color: "#F8FAFC" }}>
        <span style={{ color: "#C084FC" }}>import</span> time, pyautogui<br />
        <span style={{ color: "#64748B" }}># Instant synthetic click without trajectory</span><br />
        pyautogui.<span style={{ color: "#38BDF8" }}>click</span>(x=<span style={{ color: "#FBBF24" }}>420</span>, y=<span style={{ color: "#FBBF24" }}>550</span>)<br />
        <span style={{ color: "#4ADE80" }}>print</span>(<span style={{ color: "#F43F5E" }}>"Latency: 0.001s (0ms motion)"</span>)
      </div>

      {isAlertVisible && (
        <div
          style={{
            backgroundColor: "rgba(244, 63, 94, 0.2)",
            border: "2px solid #F43F5E",
            borderRadius: 16,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 0 30px rgba(244, 63, 94, 0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 36 }}>❌</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#F43F5E", letterSpacing: "1px" }}>
                BOT DETECTED — ACCESS DENIED
              </div>
              <div style={{ fontSize: 14, color: "#FDA4AF", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                Zero Physical Motion | Trajectory Jerk: 0.0 | Score: 0.05 / 1.0
              </div>
            </div>
          </div>
          <span style={{ fontSize: 28, fontWeight: 900, color: "#F43F5E", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            0.001s
          </span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 3: OBSIDIAN KINEMATIC MOUSE TRAJECTORY ARENA
// ═══════════════════════════════════════════════════════════════
const Beat3TrajectoryArena: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 245;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const progress = Math.min(localFrame / 90, 1.0);

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 60,
        right: 60,
        height: 440,
        backgroundColor: "#0B0F17",
        borderRadius: 24,
        border: "2px solid rgba(6, 182, 212, 0.4)",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
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
          📡 Kinematic Trajectory Profiling
        </span>
        <div style={{ display: "flex", gap: 20, fontSize: 13, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          <span style={{ color: "#EF4444" }}>● Bot: Linear (0 Jitter)</span>
          <span style={{ color: "#FFD166" }}>● Human: Bezier + Entropy</span>
        </div>
      </div>

      <div style={{ width: "100%", height: 320, position: "relative" }}>
        <svg width="100%" height="100%" viewBox="0 0 900 320" style={{ overflow: "visible" }}>
          <defs>
            <pattern id="arenaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="900" height="320" fill="url(#arenaGrid)" />

          {/* Bot Linear Line */}
          <line
            x1="80"
            y1="60"
            x2={80 + progress * 740}
            y2={60 + progress * 200}
            stroke="#EF4444"
            strokeWidth="4"
            strokeDasharray="6 6"
          />
          <rect x="800" y="240" width="40" height="40" rx="8" fill="none" stroke="#EF4444" strokeWidth="2" />

          {/* Human Curved Bezier Path */}
          <path
            d="M 80,60 Q 300,20 420,180 T 820,260"
            fill="none"
            stroke="rgba(255, 209, 102, 0.3)"
            strokeWidth="8"
          />
          <path
            d="M 80,60 Q 300,20 420,180 T 820,260"
            fill="none"
            stroke="#FFD166"
            strokeWidth="4"
            strokeDasharray="1000"
            strokeDashoffset={1000 * (1 - progress)}
          />

          {/* Animated Cursor Head */}
          <circle
            cx={80 + progress * 740}
            cy={60 + Math.sin(progress * Math.PI) * 160 + progress * 140}
            r="10"
            fill="#06B6D4"
            style={{ filter: "drop-shadow(0 0 14px #06B6D4)" }}
          />
        </svg>

        <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 16 }}>
          <div style={{ backgroundColor: "rgba(0,0,0,0.7)", padding: "8px 16px", borderRadius: 10, border: "1px solid #334155" }}>
            <span style={{ fontSize: 13, color: "#94A3B8" }}>Angular Jerk: </span>
            <span style={{ fontSize: 14, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>ORGANIC ✓</span>
          </div>
          <div style={{ backgroundColor: "rgba(0,0,0,0.7)", padding: "8px 16px", borderRadius: 10, border: "1px solid #334155" }}>
            <span style={{ fontSize: 13, color: "#94A3B8" }}>Velocity Profile: </span>
            <span style={{ fontSize: 14, color: "#FFD166", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>Bell-Shaped Curve</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 4: ULTRA HIGH-TECH 8-12Hz INVOLUNTARY MUSCLE TREMOR HUD
// ═══════════════════════════════════════════════════════════════
const Beat4BiometricScan: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 361;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  
  // Laser scanner sweep across the oscilloscope
  const scannerX = (localFrame * 14) % 860;

  // Jitter coordinates simulation for crosshair
  const jitterX = Math.sin(localFrame * 0.9) * 6 + Math.cos(localFrame * 1.7) * 3;
  const jitterY = Math.cos(localFrame * 1.1) * 7 + Math.sin(localFrame * 2.1) * 4;

  // FFT frequency bands (6Hz to 16Hz with peak at 10.4Hz)
  const fftBands = [
    { freq: "6Hz", val: 20 + Math.sin(localFrame * 0.2) * 8 },
    { freq: "8Hz", val: 55 + Math.sin(localFrame * 0.3) * 15 },
    { freq: "10Hz", val: 92 + Math.sin(localFrame * 0.4) * 8 },
    { freq: "12Hz", val: 78 + Math.cos(localFrame * 0.35) * 12 },
    { freq: "14Hz", val: 40 + Math.sin(localFrame * 0.25) * 10 },
    { freq: "16Hz", val: 18 + Math.cos(localFrame * 0.2) * 6 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 50,
        right: 50,
        height: 480,
        backgroundColor: "#070B12",
        borderRadius: 24,
        border: "2px solid rgba(6, 182, 212, 0.5)",
        boxShadow: "0 28px 70px rgba(6, 182, 212, 0.25), inset 0 0 40px rgba(6, 182, 212, 0.08)",
        padding: "22px 26px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#06B6D4", boxShadow: "0 0 12px #06B6D4" }} />
          <span style={{ fontSize: 17, fontWeight: 900, color: "#06B6D4", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            🔬 Biometric Muscle Tremor Sensor (8–12 Hz)
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "4px 12px", borderRadius: 8, border: "1px solid #10B981" }}>
          <span style={{ fontSize: 12, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            ENTROPY: 99.8% (ORGANIC)
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 18, height: 260, position: "relative" }}>
        <div
          style={{
            backgroundColor: "#03070D",
            borderRadius: 16,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 12,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", zIndex: 10, fontSize: 11, fontFamily: nemiTheme.typography.fontFamily.mono, color: "#64748B" }}>
            <span style={{ color: "#06B6D4" }}>CH1: Biological Tremor (10.4 Hz)</span>
            <span style={{ color: "#FFD166" }}>CH2: Motor Micro-Jitter</span>
          </div>

          <div style={{ width: "100%", height: 160, position: "relative" }}>
            <svg width="100%" height="100%" viewBox="0 0 600 160" style={{ overflow: "visible" }}>
              <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" />

              <path
                d={`M 0,80 ${Array.from({ length: 30 })
                  .map((_, i) => {
                    const x = i * 20;
                    const noise = Math.sin((x + localFrame * 6) * 0.2) * 28 + Math.cos((x + localFrame * 10) * 0.4) * 14;
                    return `L ${x},${80 + noise}`;
                  })
                  .join(" ")}`}
                fill="none"
                stroke="#FFD166"
                strokeWidth="2.5"
                opacity="0.8"
              />

              <path
                d={`M 0,80 ${Array.from({ length: 30 })
                  .map((_, i) => {
                    const x = i * 20;
                    const noise = Math.sin((x + localFrame * 8) * 0.18) * 48 + Math.cos((x + localFrame * 14) * 0.32) * 22;
                    return `L ${x},${80 + noise}`;
                  })
                  .join(" ")}`}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="4"
                style={{ filter: "drop-shadow(0 0 12px #06B6D4)" }}
              />
            </svg>

            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: scannerX * 0.7,
                width: 3,
                backgroundColor: "#38BDF8",
                boxShadow: "0 0 16px #38BDF8, 0 0 30px #0284C7",
                pointerEvents: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", zIndex: 10, fontSize: 11, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            <span style={{ color: "#EF4444" }}>● Bot Vector: 0.00 Hz (Flat)</span>
            <span style={{ color: "#10B981", fontWeight: 800 }}>● Human Tremor: 10.40 Hz (Organic Sine + Noise)</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              height: 125,
              backgroundColor: "#03070D",
              borderRadius: 14,
              border: "1px solid rgba(255, 209, 102, 0.4)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", border: "1px dashed rgba(255, 209, 102, 0.4)" }} />
            <div style={{ position: "absolute", width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255, 209, 102, 0.6)" }} />
            <div style={{ position: "absolute", width: "100%", height: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
            <div style={{ position: "absolute", width: 1, height: "100%", backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

            <div
              style={{
                transform: `translate(${jitterX}px, ${jitterY}px)`,
                filter: "drop-shadow(0 0 8px #FFD166)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFD166" stroke="#000" strokeWidth="1">
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
            </div>

            <div style={{ position: "absolute", bottom: 6, left: 8, fontSize: 10, color: "#FFD166", fontFamily: nemiTheme.typography.fontFamily.mono }}>
              ΔX: ±{Math.abs(jitterX).toFixed(1)}px | ΔY: ±{Math.abs(jitterY).toFixed(1)}px
            </div>
          </div>

          <div
            style={{
              height: 125,
              backgroundColor: "#03070D",
              borderRadius: 14,
              border: "1px solid rgba(6, 182, 212, 0.3)",
              padding: "8px 12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: nemiTheme.typography.fontFamily.mono, fontWeight: 700 }}>
              POWER SPECTRUM (PSD)
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 60 }}>
              {fftBands.map((band, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      width: 18,
                      height: `${band.val * 0.55}px`,
                      backgroundColor: band.freq === "10Hz" ? "#10B981" : "#06B6D4",
                      borderRadius: 4,
                      boxShadow: band.freq === "10Hz" ? "0 0 10px #10B981" : "none",
                      transition: "height 0.1s ease",
                    }}
                  />
                  <span style={{ fontSize: 9, color: band.freq === "10Hz" ? "#10B981" : "#64748B", fontFamily: nemiTheme.typography.fontFamily.mono, fontWeight: band.freq === "10Hz" ? 900 : 400 }}>
                    {band.freq}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <div style={{ backgroundColor: "#0F172A", padding: "12px 16px", borderRadius: 14, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Hand Tremor Peak</div>
            <div style={{ fontSize: 18, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
              10.4 Hz ✓
            </div>
          </div>
          <span style={{ fontSize: 20 }}>🦾</span>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "12px 16px", borderRadius: 14, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Canvas Fingerprint</div>
            <div style={{ fontSize: 18, color: "#38BDF8", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
              0x8F4B... ✓
            </div>
          </div>
          <span style={{ fontSize: 20 }}>🎨</span>
        </div>

        <div style={{ backgroundColor: "#0F172A", padding: "12px 16px", borderRadius: 14, border: "1px solid #1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748B" }}>TCP RTT Entropy</div>
            <div style={{ fontSize: 18, color: "#FFD166", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
              ORGANIC ✓
            </div>
          </div>
          <span style={{ fontSize: 20 }}>⚡</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// BEAT 5: 3-POINT CS TAKEAWAY CONSOLE & VERIFIED SCORE (0.98)
// ═══════════════════════════════════════════════════════════════
const Beat5TakeawayConsole: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 536;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 60,
        right: 60,
        backgroundColor: "#18181B",
        borderRadius: 24,
        border: "2px solid #27272A",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.4)",
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
          ⚡ HOW YOU PROVED YOU'RE HUMAN
        </span>
        <span style={{ fontSize: 15, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          PASSED (SCORE: 0.98 / 1.0)
        </span>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 20px", borderRadius: 14, borderLeft: "4px solid #06B6D4" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>01. Cursor Trajectory Dynamics</div>
        <div style={{ fontSize: 15, color: "#94A3B8", marginTop: 2 }}>
          Natural Bezier curves with acceleration & deceleration vs linear bot vectors.
        </div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 20px", borderRadius: 14, borderLeft: "4px solid #FFD166" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>02. Involuntary Muscle Tremors</div>
        <div style={{ fontSize: 15, color: "#94A3B8", marginTop: 2 }}>
          8–12 Hz biological hand micro-jitters create non-deterministic entropy.
        </div>
      </div>

      <div style={{ backgroundColor: "#27272A", padding: "14px 20px", borderRadius: 14, borderLeft: "4px solid #10B981" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#F8FAFC" }}>03. Deep Browser Telemetry</div>
        <div style={{ fontSize: 15, color: "#94A3B8", marginTop: 2 }}>
          Device canvas fingerprint, interaction history & TCP latency consistency.
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// NEMI ACTOR SECTION: SYNCHRONIZED REACTION TIMELINE
// ═══════════════════════════════════════════════════════════════
const NemiActorSection: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  let pose: "thinking" | "shocked" | "puzzled" | "explaining" | "pointing" | "aha" | "smug" = "thinking";
  let speechBubbleText: string | null = null;
  let nemiY = 980;

  if (frame < 67) {
    pose = "thinking";
  } else if (frame >= 67 && frame < 101) {
    pose = "shocked";
    speechBubbleText = "Wait, what?! 🤯";
  } else if (frame >= 101 && frame < 245) {
    pose = "puzzled";
    speechBubbleText = "Too fast for humans! 🤖";
  } else if (frame >= 245 && frame < 361) {
    pose = "pointing";
  } else if (frame >= 361 && frame < 536) {
    pose = "aha";
    speechBubbleText = "Aha! Hand tremors! 💡";
  } else {
    pose = "smug";
    speechBubbleText = "Shaky hands = Feature! 😎⚡";
    nemiY = 980;
  }

  const actorSpring = spring({ frame: frame % 120, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div
      style={{
        position: "absolute",
        top: nemiY,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 45,
      }}
    >
      {/* Speech Reaction Bubble */}
      {speechBubbleText && (
        <div
          style={{
            backgroundColor: nemiTheme.colors.brandYellow,
            color: "#18181B",
            fontWeight: 900,
            fontSize: 22,
            padding: "12px 28px",
            borderRadius: 20,
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
            marginBottom: 16,
            transform: `scale(${interpolate(frame % 30, [0, 15, 30], [1.0, 1.05, 1.0])})`,
            letterSpacing: "-0.5px",
          }}
        >
          {speechBubbleText}
        </div>
      )}

      {/* Animated Nemi Mascot */}
      <div style={{ transform: `translateY(${Math.sin(frame * 0.1) * 8}px)` }}>
        <NemiMascot pose={pose} scale={1.2} />
      </div>
    </div>
  );
};
