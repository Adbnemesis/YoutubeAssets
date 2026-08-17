import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../constants/theme";

export const KineticAlgorithmDuelComp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-60f / 0-2s): Hook & Setup [Target = 9]
  // Phase 2 (60-180f / 2-6s): The Race Begins!
  // Phase 3 (180-240f / 6-8s): Brute Force Crashes / Two Pointers Wins!
  // Phase 4 (240-360f / 8-12s): The Complexity Chart & Lesson

  const isCrash = frame >= 180 && frame <= 210;
  const shake = isCrash ? Math.sin(frame * 3) * 14 : 0;

  // Brute force counter (explodes to 100,000)
  const bruteSteps = Math.min(100000, Math.floor(interpolate(frame, [60, 180], [1, 100000], { extrapolateRight: "clamp" })));

  // Two pointers steps (1 -> 4 -> DONE)
  const twoPointerSteps = Math.min(4, Math.floor(interpolate(frame, [60, 150], [1, 4], { extrapolateRight: "clamp" })));

  // Animated Array Elements: [2, 7, 11, 15], Target = 9
  const arrayData = [2, 7, 11, 15];
  
  // Left Pointer moves: 0 -> 0
  // Right Pointer moves: 3 (15) -> 2 (11) -> 1 (7) [2 + 7 = 9 Found!]
  const rightPointerIndex = frame < 90 ? 3 : frame < 120 ? 2 : 1;
  const leftPointerIndex = 0;

  const sum = arrayData[leftPointerIndex] + arrayData[rightPointerIndex];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060A14",
        overflow: "hidden",
        transform: `translate(${shake}px, ${shake}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "70px 40px",
        fontFamily: THEME.typography.fontDisplay,
      }}
    >
      {/* Dynamic Cyber Grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.2) 0%, transparent 60%),
            radial-gradient(circle at 50% 80%, rgba(244, 63, 94, 0.15) 0%, transparent 60%),
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 60px 60px, 60px 60px",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div style={{ zIndex: 10, textAlign: "center", width: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 22px",
            borderRadius: "9999px",
            backgroundColor: "rgba(6, 182, 212, 0.15)",
            border: "1.5px solid #06B6D4",
            boxShadow: "0 0 25px rgba(6, 182, 212, 0.3)",
            marginBottom: "14px",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "2px", color: "#22D3EE" }}>
            ⚔️ ALGORITHM SHOWDOWN
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "44px",
            fontWeight: 900,
            lineHeight: "1.15",
            color: "#FFFFFF",
            letterSpacing: "-0.5px",
            textShadow: "0 4px 30px rgba(0,0,0,0.9)",
          }}
        >
          {frame < 180 ? "O(N²) Loops vs O(N) Pointers" : "Two Pointers Crushes Brute Force!"}
        </h1>
        <p style={{ margin: "8px 0 0 0", fontSize: "20px", color: "#94A3B8", fontWeight: 600 }}>
          Problem: Find 2 numbers that sum to <span style={{ color: "#FBBF24", fontWeight: 800 }}>TARGET = 9</span>
        </p>
      </div>

      {/* Center Stage: The Live Array Visualizer with Moving Pointers */}
      <div
        style={{
          zIndex: 10,
          width: "940px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Animated Array Box */}
        <div
          style={{
            padding: "30px 20px",
            borderRadius: "24px",
            backgroundColor: "rgba(11, 15, 25, 0.95)",
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 20px" }}>
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#64748B", letterSpacing: "1px" }}>
              SORTED ARRAY IN MEMORY
            </span>
            <span style={{ fontSize: "16px", fontWeight: 800, color: sum === 9 ? "#34D399" : "#FBBF24" }}>
              Current Sum: {arrayData[leftPointerIndex]} + {arrayData[rightPointerIndex]} = {sum} {sum === 9 ? "✔ TARGET MATCH!" : sum > 9 ? "(Too High -> Move Right Pointer Left)" : ""}
            </span>
          </div>

          {/* Array Cells */}
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-end" }}>
            {arrayData.map((val, idx) => {
              const isLeft = idx === leftPointerIndex;
              const isRight = idx === rightPointerIndex;
              const isMatch = (isLeft || isRight) && sum === 9;

              let borderColor = "rgba(255, 255, 255, 0.15)";
              let bgColor = "rgba(255, 255, 255, 0.03)";
              let textColor = "#FFFFFF";

              if (isMatch) {
                borderColor = "#10B981";
                bgColor = "rgba(16, 185, 129, 0.25)";
                textColor = "#34D399";
              } else if (isLeft) {
                borderColor = "#06B6D4";
                bgColor = "rgba(6, 182, 212, 0.2)";
                textColor = "#22D3EE";
              } else if (isRight) {
                borderColor = "#8B5CF6";
                bgColor = "rgba(139, 92, 246, 0.2)";
                textColor = "#A78BFA";
              }

              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  {/* Top Pointer Badge */}
                  <div style={{ height: "30px" }}>
                    {isLeft && (
                      <span style={{ fontSize: "14px", fontWeight: 900, color: "#06B6D4", padding: "4px 10px", borderRadius: "6px", backgroundColor: "rgba(6, 182, 212, 0.2)" }}>
                        LEFT (0)
                      </span>
                    )}
                    {isRight && (
                      <span style={{ fontSize: "14px", fontWeight: 900, color: "#8B5CF6", padding: "4px 10px", borderRadius: "6px", backgroundColor: "rgba(139, 92, 246, 0.2)" }}>
                        RIGHT ({idx})
                      </span>
                    )}
                  </div>

                  {/* Cell Box */}
                  <div
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "20px",
                      backgroundColor: bgColor,
                      border: `3px solid ${borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "44px",
                      fontWeight: 900,
                      color: textColor,
                      boxShadow: isMatch ? "0 0 40px rgba(16, 185, 129, 0.5)" : isLeft || isRight ? "0 0 25px rgba(6, 182, 212, 0.3)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {val}
                  </div>

                  {/* Index Label */}
                  <span style={{ fontSize: "16px", color: "#64748B", fontWeight: 700 }}>
                    Index [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Race Meters: Brute Force vs Two Pointers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Brute Force Card */}
          <div
            style={{
              padding: "20px 24px",
              borderRadius: "20px",
              backgroundColor: "rgba(17, 24, 39, 0.9)",
              border: isCrash ? "2px solid #F43F5E" : "1.5px solid rgba(255, 255, 255, 0.1)",
              boxShadow: isCrash ? "0 0 30px rgba(244, 63, 94, 0.3)" : "none",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#F43F5E" }}>BRUTE FORCE O(N²)</span>
              <span style={{ fontSize: "14px", color: "#FB7185", fontWeight: 700 }}>
                {isCrash ? "💥 TIMEOUT CRASH" : "RUNNING..."}
              </span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: 900, color: "#FFFFFF" }}>
              {bruteSteps.toLocaleString()} <span style={{ fontSize: "18px", color: "#94A3B8" }}>ops</span>
            </div>
            <span style={{ fontSize: "14px", color: "#64748B" }}>Nested Loops: 10,000 items = 100,000,000 ops</span>
          </div>

          {/* Two Pointers Card */}
          <div
            style={{
              padding: "20px 24px",
              borderRadius: "20px",
              backgroundColor: "rgba(17, 24, 39, 0.9)",
              border: frame >= 150 ? "2px solid #10B981" : "1.5px solid rgba(255, 255, 255, 0.1)",
              boxShadow: frame >= 150 ? "0 0 30px rgba(16, 185, 129, 0.3)" : "none",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#10B981" }}>TWO POINTERS O(N)</span>
              <span style={{ fontSize: "14px", color: "#34D399", fontWeight: 700 }}>
                {frame >= 150 ? "⚡ INSTANT PASS" : "CALCULATING..."}
              </span>
            </div>
            <div style={{ fontSize: "32px", fontWeight: 900, color: "#34D399" }}>
              {twoPointerSteps} <span style={{ fontSize: "18px", color: "#94A3B8" }}>ops</span>
            </div>
            <span style={{ fontSize: "14px", color: "#64748B" }}>Linear Scan: 10,000 items = 10,000 ops max</span>
          </div>
        </div>
      </div>

      {/* Bottom Takeaway */}
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
        <span style={{ fontSize: "20px", fontWeight: 700, color: "#F8FAFC" }}>
          Never write nested loops on sorted arrays. Save this trick 📌
        </span>
        <span style={{ fontSize: "16px", fontWeight: 800, color: "#06B6D4" }}>
          @codemind.dev
        </span>
      </div>

      {/* Audio SFX */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.8} />
      </Sequence>
      <Sequence from={60} durationInFrames={15}>
        <Audio src={staticFile("sounds/clock_tick.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={90} durationInFrames={15}>
        <Audio src={staticFile("sounds/clock_tick.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={120} durationInFrames={15}>
        <Audio src={staticFile("sounds/clock_tick.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={150} durationInFrames={60}>
        <Audio src={staticFile("sounds/correct_chime.wav")} volume={0.8} />
      </Sequence>
      <Sequence from={180} durationInFrames={30}>
        <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.9} />
      </Sequence>
    </AbsoluteFill>
  );
};
