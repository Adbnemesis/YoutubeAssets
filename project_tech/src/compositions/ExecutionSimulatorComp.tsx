import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../constants/theme";

export const ExecutionSimulatorComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timings
  // 0s-2s (0-60f): Hook zoom + typing
  // 2s-5s (60-150f): Line by line execution trace
  // 5s-8s (150-240f): The Collision & Brain Melt Moment (Array coercion)
  // 8s-12s (240-360f): Emerald Transformation & Payoff

  // Camera Zoom & Shake
  const isImpact = frame >= 150 && frame <= 170;
  const shakeX = isImpact ? Math.sin(frame * 2.5) * 12 : 0;
  const shakeY = isImpact ? Math.cos(frame * 2.5) * 8 : 0;

  const cameraScale = interpolate(
    frame,
    [0, 30, 60, 150, 160, 240, 260],
    [0.9, 1.0, 1.02, 1.02, 1.08, 1.08, 1.0],
    { extrapolateRight: "clamp" }
  );

  // Active execution line
  const activeLine = frame < 60 ? 1 : frame < 120 ? 2 : frame < 240 ? 3 : 4;

  // Typing effect on Line 3
  const typedChars = Math.min(22, Math.floor(interpolate(frame, [10, 50], [0, 22])));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050811",
        overflow: "hidden",
        transform: `scale(${cameraScale}) translate(${shakeX}px, ${shakeY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px 40px",
        fontFamily: THEME.typography.fontDisplay,
      }}
    >
      {/* Background Animated Cyber Grid & Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.18) 0%, transparent 60%),
            radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 60%),
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 50px 50px, 50px 50px",
          zIndex: 0,
        }}
      />

      {/* Top Kinetic Hook Header */}
      <div style={{ zIndex: 10, textAlign: "center", width: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "9999px",
            backgroundColor: isImpact ? "rgba(244, 63, 94, 0.2)" : "rgba(6, 182, 212, 0.15)",
            border: `1.5px solid ${isImpact ? THEME.colors.brand.rose : THEME.colors.brand.cyan}`,
            boxShadow: isImpact ? "0 0 25px rgba(244, 63, 94, 0.4)" : "0 0 20px rgba(6, 182, 212, 0.2)",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "2px", color: isImpact ? "#FB7185" : "#22D3EE" }}>
            {isImpact ? "⚠️ RUNTIME COERCION WARNING" : "⚡ LIVE ENGINE EXECUTION TRACE"}
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "46px",
            fontWeight: 900,
            lineHeight: "1.15",
            color: "#FFFFFF",
            letterSpacing: "-1px",
            textShadow: "0 4px 30px rgba(0,0,0,0.9)",
          }}
        >
          {frame < 150 ? "What Happens Under The Hood?" : frame < 240 ? "JavaScript Did WHAT?!" : "The 30-Year-Old Coercion Trap"}
        </h1>
      </div>

      {/* Center Visual: The Live Memory Execution Stage */}
      <div
        style={{
          zIndex: 10,
          width: "940px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Code Editor Window */}
        <div
          style={{
            borderRadius: "24px",
            backgroundColor: "rgba(11, 15, 25, 0.95)",
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.9)",
            overflow: "hidden",
          }}
        >
          {/* Editor Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5F56" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27C93F" }} />
            </div>
            <span style={{ fontSize: "16px", color: "#94A3B8", fontWeight: 600 }}>v8_runtime_eval.js</span>
            <span style={{ fontSize: "12px", color: "#06B6D4", fontWeight: 800 }}>NODE v20.11</span>
          </div>

          {/* Code Lines with Kinetic Execution Glow */}
          <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Line 1 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "8px 14px",
                borderRadius: "10px",
                backgroundColor: activeLine === 1 ? "rgba(6, 182, 212, 0.18)" : "transparent",
                borderLeft: activeLine === 1 ? "4px solid #06B6D4" : "4px solid transparent",
              }}
            >
              <span style={{ color: "#64748B", width: "30px", fontSize: "22px" }}>1</span>
              <code style={{ fontSize: "26px", color: "#F8FAFC", fontFamily: THEME.typography.fontCode }}>
                <span style={{ color: "#F472B6", fontWeight: 700 }}>const</span> a = [
                <span style={{ color: "#FBBF24" }}>1</span>, <span style={{ color: "#FBBF24" }}>2</span>, <span style={{ color: "#FBBF24" }}>3</span>];
              </code>
            </div>

            {/* Line 2 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "8px 14px",
                borderRadius: "10px",
                backgroundColor: activeLine === 2 ? "rgba(6, 182, 212, 0.18)" : "transparent",
                borderLeft: activeLine === 2 ? "4px solid #06B6D4" : "4px solid transparent",
              }}
            >
              <span style={{ color: "#64748B", width: "30px", fontSize: "22px" }}>2</span>
              <code style={{ fontSize: "26px", color: "#F8FAFC", fontFamily: THEME.typography.fontCode }}>
                <span style={{ color: "#F472B6", fontWeight: 700 }}>const</span> b = [
                <span style={{ color: "#FBBF24" }}>4</span>, <span style={{ color: "#FBBF24" }}>5</span>, <span style={{ color: "#FBBF24" }}>6</span>];
              </code>
            </div>

            {/* Line 3 (The Trap Line) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "8px 14px",
                borderRadius: "10px",
                backgroundColor: activeLine === 3 ? "rgba(244, 63, 94, 0.22)" : "transparent",
                borderLeft: activeLine === 3 ? "4px solid #F43F5E" : "4px solid transparent",
                boxShadow: activeLine === 3 ? "0 0 20px rgba(244, 63, 94, 0.3)" : "none",
              }}
            >
              <span style={{ color: "#64748B", width: "30px", fontSize: "22px" }}>3</span>
              <code style={{ fontSize: "26px", color: "#F8FAFC", fontFamily: THEME.typography.fontCode }}>
                <span style={{ color: "#60A5FA", fontWeight: 700 }}>console</span>.
                <span style={{ color: "#34D399" }}>log</span>(a + b);
              </code>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Memory Stage / Coercion Reactor */}
        <div
          style={{
            padding: "24px",
            borderRadius: "24px",
            backgroundColor: "rgba(17, 24, 39, 0.9)",
            border: "1.5px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#94A3B8", letterSpacing: "1px" }}>
              V8 ENGINE INTERNAL HEAP & STACK
            </span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: isImpact ? "#FB7185" : "#34D399" }}>
              {frame < 150 ? "● PARSING ARRAYS" : frame < 240 ? "⚡ IMPLICIT TYPE CAST" : "✔ OUTPUT COMMITTED"}
            </span>
          </div>

          {/* Visual Memory Blocks Colliding / Transforming */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "20px 0",
              minHeight: "120px",
            }}
          >
            {frame < 150 ? (
              <>
                {/* Array A Card */}
                <div
                  style={{
                    padding: "16px 28px",
                    borderRadius: "16px",
                    backgroundColor: "rgba(6, 182, 212, 0.15)",
                    border: "2px solid #06B6D4",
                    boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#22D3EE",
                    fontFamily: THEME.typography.fontCode,
                  }}
                >
                  a: [1, 2, 3]
                </div>

                <span style={{ fontSize: "32px", fontWeight: 900, color: "#F43F5E" }}>+</span>

                {/* Array B Card */}
                <div
                  style={{
                    padding: "16px 28px",
                    borderRadius: "16px",
                    backgroundColor: "rgba(139, 92, 246, 0.15)",
                    border: "2px solid #8B5CF6",
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                    fontSize: "26px",
                    fontWeight: 800,
                    color: "#A78BFA",
                    fontFamily: THEME.typography.fontCode,
                  }}
                >
                  b: [4, 5, 6]
                </div>
              </>
            ) : frame < 240 ? (
              /* Coercion Explosion Stage */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  animation: "pulse 0.2s infinite",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(244, 63, 94, 0.2)",
                      border: "2px dashed #F43F5E",
                      color: "#FB7185",
                      fontSize: "22px",
                      fontWeight: 800,
                    }}
                  >
                    "1,2,3"
                  </div>
                  <span style={{ fontSize: "28px", fontWeight: 900, color: "#FBBF24" }}>+</span>
                  <div
                    style={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(244, 63, 94, 0.2)",
                      border: "2px dashed #F43F5E",
                      color: "#FB7185",
                      fontSize: "22px",
                      fontWeight: 800,
                    }}
                  >
                    "4,5,6"
                  </div>
                </div>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#FB7185", letterSpacing: "1px" }}>
                  ⚡ Binary '+' forces .toString() on both arrays!
                </span>
              </div>
            ) : (
              /* The Emerald Final Result */
              <div
                style={{
                  padding: "20px 40px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  border: "2.5px solid #10B981",
                  boxShadow: "0 0 40px rgba(16, 185, 129, 0.4)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#34D399", letterSpacing: "2px" }}>
                  FINAL TERMINAL OUTPUT
                </span>
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    fontFamily: THEME.typography.fontCode,
                  }}
                >
                  "1,2,34,5,6"
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Kinetic Bar & Call to Action */}
      <div
        style={{
          zIndex: 10,
          width: "940px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 28px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>📌</span>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#F8FAFC" }}>
            {frame < 240 ? "Did you guess string concatenation?" : "Fix: Use [...a, ...b] to merge!"}
          </span>
        </div>
        <span style={{ fontSize: "16px", fontWeight: 800, color: "#06B6D4", letterSpacing: "1px" }}>
          @codemind.dev
        </span>
      </div>

      {/* Audio SFX Sync */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.8} />
      </Sequence>
      
      <Sequence from={15} durationInFrames={40}>
        <Audio src={staticFile("sounds/switch_clack.wav")} volume={0.5} />
      </Sequence>

      <Sequence from={60} durationInFrames={10}>
        <Audio src={staticFile("sounds/clock_tick.wav")} volume={0.4} />
      </Sequence>

      <Sequence from={120} durationInFrames={10}>
        <Audio src={staticFile("sounds/clock_tick.wav")} volume={0.4} />
      </Sequence>

      {/* Impact explosion at frame 150 */}
      <Sequence from={150} durationInFrames={30}>
        <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.9} />
      </Sequence>

      {/* Victory chime at frame 240 */}
      <Sequence from={240} durationInFrames={60}>
        <Audio src={staticFile("sounds/correct_chime.wav")} volume={0.7} />
      </Sequence>
    </AbsoluteFill>
  );
};
