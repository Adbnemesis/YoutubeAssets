import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { NEMI_THEME } from "../constants/nemiTheme";

export type NemiPose = "puzzled" | "thinking" | "aha" | "shocked" | "smug" | "explaining" | "pointing";

interface NemiMascotProps {
  pose?: NemiPose;
  scale?: number;
  flipX?: boolean;
}

export const NemiMascot: React.FC<NemiMascotProps> = ({
  pose = "thinking",
  scale = 1.0,
  flipX = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle breathing float animation
  const floatY = Math.sin((frame / fps) * Math.PI * 2) * 6;
  const headTilt = pose === "puzzled" ? 8 : pose === "aha" ? -4 : 0;

  // Eye blink animation (every 90 frames)
  const blinkCycle = frame % 90;
  const isBlinking = blinkCycle > 84 && blinkCycle < 88;

  // Glasses glint on "aha" or "smug"
  const glintOpacity = pose === "aha" || pose === "smug"
    ? interpolate(frame % 45, [0, 15, 30, 45], [0.2, 0.9, 0.2, 0.2])
    : 0.2;

  // Pointing arm bounce
  const pointBob = pose === "pointing"
    ? Math.sin((frame / fps) * Math.PI * 3) * 3
    : 0;

  return (
    <div
      style={{
        transform: `scale(${scale}) scaleX(${flipX ? -1 : 1}) translateY(${floatY}px)`,
        transformOrigin: "bottom center",
        width: "180px",
        height: "220px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15))",
      }}
    >
      <svg
        width="180"
        height="220"
        viewBox="0 0 180 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `rotate(${headTilt}deg)`, transformOrigin: "50% 70%" }}
      >
        {/* Nemi Body / Developer Hoodie */}
        <path
          d="M30 170 C30 145 60 135 90 135 C120 135 150 145 150 170 L160 220 L20 220 Z"
          fill="#18181B"
        />
        {/* Hoodie Strings & Accent Collar */}
        <path d="M75 145 L70 185" stroke="#FFD166" strokeWidth="4" strokeLinecap="round" />
        <path d="M105 145 L110 185" stroke="#FFD166" strokeWidth="4" strokeLinecap="round" />
        <circle cx="70" cy="188" r="4" fill="#FFD166" />
        <circle cx="110" cy="188" r="4" fill="#FFD166" />

        {/* Pointing Arm (only when pointing pose) */}
        {pose === "pointing" && (
          <g transform={`translate(0, ${pointBob})`}>
            <path
              d="M148 165 L190 140 L200 135"
              stroke={NEMI_THEME.colors.mascot.furDark}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="200" cy="135" r="6" fill={NEMI_THEME.colors.mascot.facePeach} />
          </g>
        )}

        {/* Ears */}
        {/* Left Ear */}
        <circle cx="32" cy="95" r="24" fill={NEMI_THEME.colors.mascot.furDark} />
        <circle cx="32" cy="95" r="14" fill={NEMI_THEME.colors.mascot.facePeach} />
        {/* Right Ear */}
        <circle cx="148" cy="95" r="24" fill={NEMI_THEME.colors.mascot.furDark} />
        <circle cx="148" cy="95" r="14" fill={NEMI_THEME.colors.mascot.facePeach} />

        {/* Head Base (Dark Fur) */}
        <ellipse cx="90" cy="95" rx="55" ry="50" fill={NEMI_THEME.colors.mascot.furDark} />

        {/* Spiky Hair Tufts on Top */}
        <path
          d="M75 50 L90 22 L98 48 L112 28 L115 52 Z"
          fill={NEMI_THEME.colors.mascot.furDark}
        />

        {/* Peach Heart-Shaped Face Mask */}
        <path
          d="M50 85 C50 65 70 65 90 75 C110 65 130 65 130 85 C130 115 110 132 90 132 C70 132 50 115 50 85 Z"
          fill={NEMI_THEME.colors.mascot.facePeach}
        />

        {/* Cheerful Blush */}
        <ellipse cx="62" cy="108" rx="8" ry="5" fill={NEMI_THEME.colors.mascot.blush} opacity="0.6" />
        <ellipse cx="118" cy="108" rx="8" ry="5" fill={NEMI_THEME.colors.mascot.blush} opacity="0.6" />

        {/* Eyes (Behind Glasses) */}
        {!isBlinking ? (
          <>
            <ellipse cx="72" cy="90" rx="7" ry="9" fill={NEMI_THEME.colors.mascot.eyePupil} />
            <circle cx="70" cy="87" r="3" fill="#FFFFFF" />
            <ellipse cx="108" cy="90" rx="7" ry="9" fill={NEMI_THEME.colors.mascot.eyePupil} />
            <circle cx="106" cy="87" r="3" fill="#FFFFFF" />
          </>
        ) : (
          <>
            {/* Blinking line */}
            <path d="M65 90 Q72 94 79 90" stroke={NEMI_THEME.colors.mascot.eyePupil} strokeWidth="3" strokeLinecap="round" />
            <path d="M101 90 Q108 94 115 90" stroke={NEMI_THEME.colors.mascot.eyePupil} strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* Oversized Yellow Glasses Frames */}
        {/* Left Rim */}
        <circle
          cx="72"
          cy="90"
          r="19"
          fill={NEMI_THEME.colors.mascot.glassesLens}
          stroke={NEMI_THEME.colors.mascot.glassesFrame}
          strokeWidth="5"
        />
        {/* Right Rim */}
        <circle
          cx="108"
          cy="90"
          r="19"
          fill={NEMI_THEME.colors.mascot.glassesLens}
          stroke={NEMI_THEME.colors.mascot.glassesFrame}
          strokeWidth="5"
        />
        {/* Bridge */}
        <path d="M89 90 L91 90" stroke={NEMI_THEME.colors.mascot.glassesFrame} strokeWidth="5" strokeLinecap="round" />

        {/* Lens Glint / Specular Flare */}
        <path
          d="M62 80 L76 72"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={glintOpacity}
        />
        <path
          d="M98 80 L112 72"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={glintOpacity}
        />

        {/* Cute Small Monkey Nose */}
        <ellipse cx="90" cy="106" rx="4" ry="3" fill="#4A2810" />

        {/* Mouth Expressions */}
        {pose === "aha" || pose === "smug" ? (
          /* Confident / Happy Smirk */
          <path d="M82 116 Q90 126 98 116" stroke="#4A2810" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        ) : pose === "puzzled" ? (
          /* Curious / Wavy Mouth */
          <path d="M83 118 Q88 122 93 116 Q96 118 99 116" stroke="#4A2810" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : pose === "shocked" ? (
          /* O-Shaped Surprise Mouth */
          <circle cx="90" cy="118" r="5" fill="#4A2810" />
        ) : pose === "pointing" ? (
          /* Determined side smirk for pointing */
          <path d="M83 116 Q90 120 100 114" stroke="#4A2810" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : (
          /* Gentle Neutral Smile */
          <path d="M84 116 Q90 121 96 116" stroke="#4A2810" strokeWidth="3" strokeLinecap="round" fill="none" />
        )}
      </svg>

      {/* Floating Reaction Badges */}
      {pose === "aha" && (
        <div
          style={{
            position: "absolute",
            top: "-25px",
            right: "20px",
            fontSize: "30px",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
          }}
        >
          💡
        </div>
      )}
    </div>
  );
};
