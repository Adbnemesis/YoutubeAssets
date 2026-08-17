import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundGlow } from "../components/BackgroundGlow";
import { BrandWatermark } from "../components/BrandWatermark";
import { CodeWindow } from "../components/CodeWindow";
import { CountdownTimer } from "../components/CountdownTimer";
import { HeaderHook } from "../components/HeaderHook";
import { RevealCard } from "../components/RevealCard";
import { THEME } from "../constants/theme";
import { OutputPredictorProps } from "../types";

export const OutputPredictorComp: React.FC<OutputPredictorProps> = ({
  seriesTitle = "WHAT DOES THIS PRINT?",
  difficulty = "MEDIUM",
  language = "JavaScript",
  hookQuestion = "95% of Engineers Get This Wrong",
  subHook = "What gets logged to the console?",
  codeLines = [],
  countdownSeconds = 5,
  options = [],
  correctOptionId = "B",
  explanationHeading = "Answer is undefined (Hoisting)",
  explanationPoints = [
    "var declarations are hoisted to the top of their scope.",
    "However, initializations are NOT hoisted.",
    "Accessing it before declaration yields undefined, not ReferenceError.",
  ],
  complexityTime = "O(1)",
  complexitySpace = "O(1)",
  callToAction = "Save this for your next interview 📌",
  brandTag = "@codemind.dev",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const thinkingDurationFrames = countdownSeconds * fps;
  const revealFrame = 45 + thinkingDurationFrames; // Hook frame ~ 45 + countdown

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.colors.bg.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "90px 40px 80px 40px",
        boxSizing: "border-box",
      }}
    >
      <BackgroundGlow />

      {/* Top Header */}
      <div style={{ zIndex: 10 }}>
        <HeaderHook
          seriesTitle={seriesTitle}
          difficulty={difficulty}
          hookQuestion={hookQuestion}
          subHook={subHook}
        />
      </div>

      {/* Center Stage: Code & Options or Reveal */}
      <div
        style={{
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
        }}
      >
        <CodeWindow
          lines={codeLines}
          language={language}
          filename={`puzzle.${language === "Python" ? "py" : language === "C++" ? "cpp" : "js"}`}
        />

        {/* Options grid (Before Reveal) */}
        {frame < revealFrame ? (
          <div
            style={{
              width: "920px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {options.map((opt) => (
              <div
                key={opt.id}
                style={{
                  padding: "16px 20px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(17, 24, 39, 0.7)",
                  border: "1.5px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(6, 182, 212, 0.15)",
                    color: THEME.colors.brand.cyanGlow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 800,
                    fontFamily: THEME.typography.fontDisplay,
                  }}
                >
                  {opt.id}
                </span>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    color: THEME.colors.text.primary,
                    fontFamily: THEME.typography.fontCode,
                  }}
                >
                  {opt.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Reveal Payoff Card */
          <RevealCard
            revealFrame={revealFrame}
            heading={explanationHeading}
            points={explanationPoints}
            complexityTime={complexityTime}
            complexitySpace={complexitySpace}
            isCorrectBadge={`CORRECT: OPTION [ ${correctOptionId} ]`}
          />
        )}
      </div>

      {/* Bottom Pacing: Countdown or Watermark */}
      <div style={{ zIndex: 10 }}>
        {frame < revealFrame ? (
          <CountdownTimer
            startFrame={30}
            durationFrames={thinkingDurationFrames}
            totalSeconds={countdownSeconds}
          />
        ) : (
          <BrandWatermark brandTag={brandTag} ctaText={callToAction} />
        )}
      </div>

      {/* Audio SFX Track Layers */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile("sounds/sub_impact.wav")} volume={0.8} />
      </Sequence>
      
      <Sequence from={12} durationInFrames={15}>
        <Audio src={staticFile("sounds/switch_clack.wav")} volume={0.5} />
      </Sequence>

      {/* Rhythmic Clock Ticks during countdown */}
      {Array.from({ length: countdownSeconds }).map((_, i) => (
        <Sequence key={i} from={30 + i * fps} durationInFrames={10}>
          <Audio src={staticFile("sounds/clock_tick.wav")} volume={0.4} />
        </Sequence>
      ))}

      {/* Reveal Chime */}
      <Sequence from={revealFrame} durationInFrames={60}>
        <Audio src={staticFile("sounds/correct_chime.wav")} volume={0.7} />
      </Sequence>
    </AbsoluteFill>
  );
};
