import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundGlow } from "../components/BackgroundGlow";
import { BrandWatermark } from "../components/BrandWatermark";
import { CodeWindow } from "../components/CodeWindow";
import { CountdownTimer } from "../components/CountdownTimer";
import { HeaderHook } from "../components/HeaderHook";
import { RevealCard } from "../components/RevealCard";
import { THEME } from "../constants/theme";
import { SpotTheBugProps } from "../types";

export const SpotTheBugComp: React.FC<SpotTheBugProps> = ({
  seriesTitle = "SPOT THE BUG",
  difficulty = "SENIOR",
  language = "Python",
  hookQuestion = "Can You Spot the Critical Bug?",
  buggyCodeLines = [],
  fixedCodeLines = [],
  buggyLineNumber = 3,
  countdownSeconds = 5,
  bugExplanation = "Default mutable argument bug in Python",
  whyItHappens = "Default arguments are evaluated once at function definition time, not on each call.",
  callToAction = "Did you spot it in under 5s? Drop it below 👇",
  brandTag = "@codemind.dev",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const thinkingDurationFrames = countdownSeconds * fps;
  const revealFrame = 35 + thinkingDurationFrames;
  const isRevealed = frame >= revealFrame;

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
          subHook="90% of candidates miss this edge-case."
        />
      </div>

      {/* Center Stage: Code Window */}
      <div
        style={{
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <CodeWindow
          lines={isRevealed ? fixedCodeLines : buggyCodeLines}
          language={language}
          filename={`bug_hunt.${language === "Python" ? "py" : "js"}`}
          activeLine={isRevealed ? buggyLineNumber : undefined}
          highlightType={isRevealed ? "fix" : "bug"}
        />

        {isRevealed && (
          <RevealCard
            revealFrame={revealFrame}
            heading={bugExplanation}
            points={[
              whyItHappens,
              `Fix: Replace default mutable parameter with None and assign inside function body.`,
            ]}
            isCorrectBadge={`BUG AT LINE ${buggyLineNumber}`}
          />
        )}
      </div>

      {/* Bottom Control */}
      <div style={{ zIndex: 10 }}>
        {!isRevealed ? (
          <CountdownTimer
            startFrame={25}
            durationFrames={thinkingDurationFrames}
            totalSeconds={countdownSeconds}
          />
        ) : (
          <BrandWatermark brandTag={brandTag} ctaText={callToAction} />
        )}
      </div>
    </AbsoluteFill>
  );
};
