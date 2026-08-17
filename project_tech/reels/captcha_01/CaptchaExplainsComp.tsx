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
import { NemiMascot } from "../../src/components/NemiMascot";
import { NEMI_THEME } from "../../src/constants/nemiTheme";

const nemiTheme = {
  colors: {
    canvasLight: NEMI_THEME.colors.bg.cream,
    canvasDark: NEMI_THEME.colors.bg.cardDark,
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
  // EXACT BEAT TIMING BOUNDARIES (Chatterbox Neural ~22.06s @ 30fps)
  // ═══════════════════════════════════════════════════════════════
  // Beat 1: Hook & Click (0 - 99 frames | ~0 - 3.3s)
  // Beat 2: Bot 0.001s Speed & Block (100 - 250 frames | ~3.3 - 8.3s)
  // Beat 3: Trajectory Arena & Kinematics (251 - 365 frames | ~8.3 - 12.2s)
  // Beat 4: 8-12Hz Micro-Jitters & Biometrics (366 - 512 frames | ~12.2 - 17.1s)
  // Beat 5: Payoff & Takeaway Console (513 - 661 frames | ~17.1 - 22.06s)
  
  const isBeat1 = frame < 100;
  const isBeat2 = frame >= 100 && frame < 251;
  const isBeat3 = frame >= 251 && frame < 366;
  const isBeat4 = frame >= 366 && frame < 513;
  const isBeat5 = frame >= 513;

  // Global Camera Drift
  const cameraScale = interpolate(
    frame,
    [0, 100, 251, 366, 513, 661],
    [1.0, 1.02, 1.04, 1.05, 1.02, 1.0],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isBeat3 || isBeat4 ? "#0B0F17" : nemiTheme.colors.canvasLight,
        color: nemiTheme.colors.textHeading,
        fontFamily: nemiTheme.typography.fontFamily.sans,
        overflow: "hidden",
        transition: "background-color 0.4s ease",
      }}
    >
      {/* Master Audio Track (Chatterbox Neural + Dynamic BGM Story Arc) */}
      <Audio src={staticFile("reels/captcha_01/captcha_master_audio.mp3")} />

      {/* Deep Layer Technical Grid Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: isBeat3 || isBeat4
            ? "radial-gradient(circle at 50% 35%, rgba(6, 182, 212, 0.15), transparent 70%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
            : "radial-gradient(circle at 50% 35%, rgba(255, 209, 102, 0.2), transparent 70%), linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Global Camera Transform Container */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* TOP ZONE: UNIVERSAL BRAND HEADER & HEADLINE BANNER (Y: 60 - 340) */}
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
          {/* Category Pill Tag */}
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
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              SECURITY ARCHITECTURE
            </span>
            <span
              style={{
                backgroundColor: isBeat3 || isBeat4 ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.06)",
                color: isBeat3 || isBeat4 ? "#94A3B8" : "#475569",
                fontWeight: 700,
                fontSize: 14,
                padding: "6px 14px",
                borderRadius: 999,
                fontFamily: nemiTheme.typography.fontFamily.mono,
              }}
            >
              reCAPTCHA v2 / v3
            </span>
          </div>

          {/* Dynamic Narrative Headline */}
          <h1
            style={{
              fontSize: isBeat3 ? 56 : 62,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-2px",
              color: isBeat3 || isBeat4 ? "#F8FAFC" : nemiTheme.colors.textHeading,
              margin: 0,
              transition: "all 0.3s ease",
            }}
          >
            {isBeat1 && "How CAPTCHA Knows You're Human"}
            {isBeat2 && "Why 0.001s Clicks Get Blocked"}
            {isBeat3 && "The Movement Before The Click"}
            {isBeat4 && "Involuntary Muscle Tremors"}
            {isBeat5 && "How You Proved You're Human"}
          </h1>
        </div>

        {/* UPPER-MIDDLE HERO ZONE: MECHANISM & SIMULATION (Y: 380 - 840) */}
        {isBeat1 && <Beat1CaptchaWidget frame={frame} fps={fps} />}
        {isBeat2 && <Beat2BotFailure frame={frame} fps={fps} />}
        {isBeat3 && <Beat3TrajectoryArena frame={frame} fps={fps} />}
        {isBeat4 && <Beat4BiometricScan frame={frame} fps={fps} />}
        {isBeat5 && <Beat5TakeawayConsole frame={frame} fps={fps} />}

        {/* CENTER & LOWER-MIDDLE ZONE: ACTIVE NEMI MASCOT (Y: 980) */}
        <NemiActorSection frame={frame} fps={fps} />

        {/* LOWER CONTEXT ZONE: EDUCATIONAL CS CALLOUT BOX (Y: 1340 - 1580) */}
        <div
          style={{
            position: "absolute",
            top: 1340,
            left: 60,
            right: 60,
            backgroundColor: isBeat3 || isBeat4 ? "rgba(24, 24, 27, 0.9)" : "rgba(255, 255, 255, 0.95)",
            border: isBeat3 || isBeat4 ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 20,
            padding: "24px 28px",
            boxShadow: "0 16px 36px rgba(0, 0, 0, 0.06)",
            zIndex: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: isBeat3 || isBeat4 ? "#06B6D4" : "#D97706",
                fontFamily: nemiTheme.typography.fontFamily.mono,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              {isBeat1 && "💡 BEHAVIORAL TELEMETRY"}
              {isBeat2 && "⚠️ ZERO-LATENCY ANOMALY"}
              {isBeat3 && "📐 KINEMATIC TRAJECTORY PROFILING"}
              {isBeat4 && "🔬 BIOLOGICAL ENTROPY HARVESTING"}
              {isBeat5 && "🛡️ CORE TAKEAWAY"}
            </span>
          </div>
          <p
            style={{
              fontSize: 20,
              fontWeight: 600,
              lineHeight: 1.35,
              color: isBeat3 || isBeat4 ? "#E2E8F0" : "#334155",
              margin: 0,
            }}
          >
            {isBeat1 && "reCAPTCHA records mouse motion, velocity curves, and interaction entropy before the click."}
            {isBeat2 && "Instant 0.001s clicks lack physical momentum, immediately failing bot classification."}
            {isBeat3 && "Bots move in straight linear vectors. Humans follow curved Bezier paths with acceleration shifts."}
            {isBeat4 && "Involuntary 8–12 Hz muscle micro-tremors produce chaotic biometric entropy impossible for simple scripts."}
            {isBeat5 && "Your humanity was verified by physical trajectory dynamics before the click even occurred."}
          </p>
        </div>

        {/* BOTTOM SAFE ZONE: MINIMAL WATERMARK */}
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
              color: isBeat3 || isBeat4 ? "#94A3B8" : "#64748B",
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

// BEAT 1 COMPONENT: GRAND INTERACTIVE reCAPTCHA BOX
const Beat1CaptchaWidget: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const popSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const isClicked = frame >= 35;
  const isSpinning = frame >= 22 && frame < 35;

  const cursorX = interpolate(frame, [0, 28, 35], [750, 480, 460], { extrapolateRight: "clamp" });
  const cursorY = interpolate(frame, [0, 28, 35], [220, 560, 570], { extrapolateRight: "clamp" });
  const cursorClickScale = interpolate(frame, [33, 36, 42], [1.0, 0.8, 1.0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: 420,
        left: 80,
        right: 80,
        height: 380,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        border: "3px solid #E2E8F0",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 60px",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            border: isClicked ? "3px solid #10B981" : "3px solid #CBD5E1",
            backgroundColor: isClicked ? "#10B981" : "#F8FAFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            boxShadow: isClicked ? "0 0 24px rgba(16, 185, 129, 0.4)" : "none",
          }}
        >
          {isSpinning && (
            <div
              style={{
                width: 36,
                height: 36,
                border: "4px solid #06B6D4",
                borderTopColor: "transparent",
                borderRadius: "50%",
                transform: `rotate(${frame * 30}deg)`,
              }}
            />
          )}
          {isClicked && (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>

        <span
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#1E293B",
            letterSpacing: "-0.5px",
          }}
        >
          I'm not a robot
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            backgroundColor: "#0284C7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            fontWeight: 900,
            fontSize: 24,
          }}
        >
          🔄
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#64748B" }}>reCAPTCHA</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8" }}>Privacy - Terms</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          transform: `scale(${cursorClickScale})`,
          zIndex: 100,
          pointerEvents: "none",
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5">
          <path d="M3 3l7 18 3-7 7-3L3 3z" />
        </svg>
      </div>
    </div>
  );
};

// BEAT 2 COMPONENT: 0.001s BOT SCRIPT FAILURE
const Beat2BotFailure: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 100;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });
  const isAlertVisible = localFrame > 35;

  return (
    <div
      style={{
        position: "absolute",
        top: 400,
        left: 60,
        right: 60,
        height: 420,
        backgroundColor: "#18181B",
        borderRadius: 24,
        border: "2px solid #27272A",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.4)",
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#EF4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
        </div>
        <span style={{ fontSize: 14, color: "#71717A", fontFamily: nemiTheme.typography.fontFamily.mono }}>
          automated_clicker.py
        </span>
      </div>

      <div style={{ fontFamily: nemiTheme.typography.fontFamily.mono, fontSize: 24, lineHeight: 1.6, color: "#E4E4E7" }}>
        <span style={{ color: "#A855F7" }}>import</span> time, pyautogui<br />
        <span style={{ color: "#71717A" }}># Direct instant click without path</span><br />
        pyautogui.<span style={{ color: "#38BDF8" }}>click</span>(x=<span style={{ color: "#FBBF24" }}>420</span>, y=<span style={{ color: "#FBBF24" }}>550</span>)<br />
        <span style={{ color: "#4ADE80" }}>print</span>(<span style={{ color: "#F43F5E" }}>"Execution: 0.001s"</span>)
      </div>

      {isAlertVisible && (
        <div
          style={{
            backgroundColor: "rgba(244, 63, 94, 0.15)",
            border: "2px solid #F43F5E",
            borderRadius: 16,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 0 30px rgba(244, 63, 94, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 32 }}>❌</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#F43F5E", letterSpacing: "1px" }}>
                BOT DETECTED — ACCESS DENIED
              </div>
              <div style={{ fontSize: 14, color: "#FDA4AF", fontFamily: nemiTheme.typography.fontFamily.mono }}>
                Anomaly: 0ms Kinematic Motion | Score: 0.1 / 1.0
              </div>
            </div>
          </div>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#F43F5E", fontFamily: nemiTheme.typography.fontFamily.mono }}>
            0.001s
          </span>
        </div>
      )}
    </div>
  );
};

// BEAT 3 COMPONENT: OBSIDIAN MOUSE TRAJECTORY ARENA
const Beat3TrajectoryArena: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 251;
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
        border: "2px solid rgba(6, 182, 212, 0.3)",
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

          <path
            d="M 80,60 Q 300,20 420,180 T 820,260"
            fill="none"
            stroke="rgba(255, 209, 102, 0.4)"
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

          <circle
            cx={80 + progress * 740}
            cy={60 + Math.sin(progress * Math.PI) * 160 + progress * 140}
            r="10"
            fill="#06B6D4"
            style={{ filter: "drop-shadow(0 0 12px #06B6D4)" }}
          />
        </svg>

        <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 16 }}>
          <div style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "6px 14px", borderRadius: 8, border: "1px solid #334155" }}>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>Angular Jerk: </span>
            <span style={{ fontSize: 13, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>HIGH (Organic)</span>
          </div>
          <div style={{ backgroundColor: "rgba(0,0,0,0.6)", padding: "6px 14px", borderRadius: 8, border: "1px solid #334155" }}>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>Velocity Curve: </span>
            <span style={{ fontSize: 13, color: "#FFD166", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>Bell-Shaped</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// BEAT 4 COMPONENT: MAGNIFIED 8-12Hz MICRO-JITTER & ENTROPY SCAN
const Beat4BiometricScan: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 366;
  const popSpring = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 120 } });

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
        border: "2px solid #FFD166",
        boxShadow: "0 24px 60px rgba(255, 209, 102, 0.2)",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `scale(${popSpring})`,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🔬</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#FFD166", letterSpacing: "1px" }}>
            Involuntary Physiological Tremor (8–12 Hz)
          </span>
        </div>
        <span style={{ fontSize: 14, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          BIOMETRIC ENTROPY: 99.4%
        </span>
      </div>

      <div style={{ width: "100%", height: 180, position: "relative", display: "flex", alignItems: "center" }}>
        <svg width="100%" height="100%" viewBox="0 0 900 180">
          <line x1="0" y1="90" x2="900" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
          
          <path
            d={`M 0,90 ${Array.from({ length: 45 })
              .map((_, i) => {
                const x = i * 20;
                const noise = Math.sin((x + localFrame * 8) * 0.15) * 45 + Math.cos((x + localFrame * 12) * 0.3) * 20;
                return `L ${x},${90 + noise}`;
              })
              .join(" ")}`}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="4"
            style={{ filter: "drop-shadow(0 0 8px #06B6D4)" }}
          />
        </svg>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div style={{ backgroundColor: "#18181B", padding: "12px", borderRadius: 12, border: "1px solid #27272A" }}>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>Hand Tremor</div>
          <div style={{ fontSize: 16, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            10.4 Hz ✓
          </div>
        </div>
        <div style={{ backgroundColor: "#18181B", padding: "12px", borderRadius: 12, border: "1px solid #27272A" }}>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>Canvas Hash</div>
          <div style={{ fontSize: 16, color: "#38BDF8", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            0x8F4B... ✓
          </div>
        </div>
        <div style={{ backgroundColor: "#18181B", padding: "12px", borderRadius: 12, border: "1px solid #27272A" }}>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>TCP RTT Entropy</div>
          <div style={{ fontSize: 16, color: "#FFD166", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
            VERIFIED ✓
          </div>
        </div>
      </div>
    </div>
  );
};

// BEAT 5 COMPONENT: 3-POINT HIGH-DENSITY TAKEAWAY CONSOLE
const Beat5TakeawayConsole: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 513;
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
        <span style={{ fontSize: 14, color: "#10B981", fontWeight: 900, fontFamily: nemiTheme.typography.fontFamily.mono }}>
          PASSED (SCORE: 0.98)
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

// NEMI ACTOR SECTION: DYNAMIC PLACEMENT & REACTIONS
const NemiActorSection: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  let pose: "thinking" | "shocked" | "puzzled" | "explaining" | "pointing" | "aha" | "smug" = "thinking";
  let speechBubbleText: string | null = null;
  let nemiY = 980;

  if (frame < 69) {
    pose = "thinking";
  } else if (frame >= 69 && frame < 100) {
    pose = "shocked";
    speechBubbleText = "Wait, what?! 🤯";
  } else if (frame >= 100 && frame < 251) {
    pose = "puzzled";
    speechBubbleText = "Too fast for humans! 🤖";
  } else if (frame >= 251 && frame < 366) {
    pose = "pointing";
  } else if (frame >= 366 && frame < 513) {
    pose = "aha";
    speechBubbleText = "Aha! Hand tremors! 💡";
  } else {
    pose = "smug";
    speechBubbleText = "Shaky hands = Feature! 😎⚡";
    nemiY = 980;
  }

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
        transition: "all 0.3s ease",
      }}
    >
      {speechBubbleText && (
        <div
          style={{
            position: "absolute",
            top: -95,
            backgroundColor: nemiTheme.colors.brandYellow,
            color: "#18181B",
            fontWeight: 900,
            fontSize: 22,
            padding: "10px 24px",
            borderRadius: 999,
            boxShadow: "0 10px 28px rgba(0, 0, 0, 0.15)",
            border: "2px solid #FFFFFF",
            whiteSpace: "nowrap",
            zIndex: 60,
          }}
        >
          {speechBubbleText}
        </div>
      )}

      <NemiMascot pose={pose} scale={1.5} />
    </div>
  );
};
