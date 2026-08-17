import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NemiMascot } from "../components/NemiMascot";
import { NEMI_THEME } from "../constants/nemiTheme";

/**
 * QUESTION SCENE — Big typography question on cream.
 * Nemi stands at the side, reacting.
 * Creates the curiosity gap.
 */

interface QuestionSceneProps {
  startFrame: number;
  endFrame: number;
  questionText: string;
  nemiSpeech?: string;
}

export const QuestionScene: React.FC<QuestionSceneProps> = ({
  startFrame,
  endFrame,
  questionText,
  nemiSpeech,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0) return null;

  const textSpring = spring({ frame: local, fps, config: { damping: 12, stiffness: 180, mass: 0.7 } });
  const nemiSpring = spring({ frame: Math.max(0, local - 8), fps, config: NEMI_THEME.springs.bouncy });

  return (
    <>
      {/* Cream background with subtle vignette */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: NEMI_THEME.colors.bg.cream }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.06) 100%)",
        }}
      />

      {/* Big centered question */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.15,
            textAlign: "center",
            color: NEMI_THEME.colors.text.headingDark,
            letterSpacing: -2,
            transform: `scale(${textSpring}) translateY(${(1 - textSpring) * 40}px)`,
            opacity: textSpring,
          }}
        >
          {questionText}
        </h1>

        {/* Yellow underline accent */}
        <div
          style={{
            width: interpolate(local, [10, 25], [0, 200], { extrapolateRight: "clamp" }),
            height: 6,
            borderRadius: 3,
            backgroundColor: NEMI_THEME.colors.brand.yellow,
            marginTop: 20,
          }}
        />
      </div>

      {/* Nemi at left side */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 40,
          zIndex: 30,
          transform: `scale(${nemiSpring})`,
          transformOrigin: "bottom left",
        }}
      >
        <NemiMascot pose="puzzled" scale={1.2} />
      </div>

      {/* Nemi speech bubble */}
      {nemiSpeech && local > 25 && (
        <div
          style={{
            position: "absolute",
            bottom: 380,
            left: 50,
            zIndex: 31,
            padding: "14px 22px",
            borderRadius: "20px 20px 20px 4px",
            backgroundColor: "#FFF",
            border: `2px solid ${NEMI_THEME.colors.bg.borderMuted}`,
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            opacity: interpolate(local, [25, 33], [0, 1], { extrapolateRight: "clamp" }),
            maxWidth: 400,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 800, color: NEMI_THEME.colors.text.headingDark, lineHeight: 1.3 }}>
            {nemiSpeech}
          </span>
        </div>
      )}

      {/* Brand pill top-right */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 40,
          padding: "6px 16px",
          borderRadius: 9999,
          backgroundColor: NEMI_THEME.colors.bg.cardCharcoal,
          opacity: 0.8,
          zIndex: 20,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, color: NEMI_THEME.colors.brand.yellow, fontFamily: NEMI_THEME.typography.fontHeading }}>
          ⚡ NEMI EXPLAINS
        </span>
      </div>
    </>
  );
};
