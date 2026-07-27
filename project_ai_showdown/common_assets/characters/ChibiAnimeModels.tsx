import React from "react";
import { Img, staticFile, interpolate } from "remotion";

export interface ChibiModelProps {
  height?: number;
  isSpeaking?: boolean;
  frame?: number;
}

// Lip Sync Mouth Component
const ChibiMouth: React.FC<{ isSpeaking?: boolean; frame?: number; expression?: "smile" | "smirk" | "happy" }> = ({
  isSpeaking = false,
  frame = 0,
  expression = "smile"
}) => {
  if (!isSpeaking) {
    if (expression === "smirk") {
      return <path d="M140 162 Q 155 170 165 158" stroke="#000000" strokeWidth="4" fill="none" />;
    }
    if (expression === "happy") {
      return <path d="M135 158 Q 150 172 165 158" stroke="#000000" strokeWidth="4" fill="none" />;
    }
    return <path d="M140 160 Q 150 168 160 160" stroke="#000000" strokeWidth="4" fill="none" />;
  }

  const cycle = Math.abs(Math.sin(frame * 0.28));
  const rx = 10 + cycle * 6;
  const ry = 3 + cycle * 10;
  return <ellipse cx="150" cy="162" rx={rx} ry={ry} fill="#991B1B" stroke="#000000" strokeWidth="3" />;
};

// Keyframed Speech Poses
const AnimeKeyframedArms: React.FC<{ isSpeaking?: boolean; frame?: number; color: string; skinColor?: string }> = ({
  isSpeaking = false,
  frame = 0,
  color,
  skinColor = "#FFE4E6"
}) => {
  if (!isSpeaking) {
    return (
      <g>
        <g transform="rotate(2, 75, 235)">
          <rect x="62" y="235" width="28" height="78" rx="14" fill={color} stroke="#000000" strokeWidth="5" />
          <circle cx="76" cy="318" r="14" fill={skinColor} stroke="#000000" strokeWidth="4" />
        </g>
        <g transform="rotate(-2, 225, 235)">
          <rect x="210" y="235" width="28" height="78" rx="14" fill={color} stroke="#000000" strokeWidth="5" />
          <circle cx="224" cy="318" r="14" fill={skinColor} stroke="#000000" strokeWidth="4" />
        </g>
      </g>
    );
  }

  const poseIndex = Math.floor(frame / 50) % 3;
  const poseProgress = (frame % 50) / 50;

  const transition = interpolate(poseProgress, [0, 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const breath = Math.sin(frame * 0.06) * 1.5;

  let leftAngle = 0;
  let rightAngle = 0;
  let rightY = 0;
  let leftY = 0;

  if (poseIndex === 0) {
    leftAngle = 4 * transition;
    rightAngle = -6 * transition;
    rightY = -4 * transition;
  } else if (poseIndex === 1) {
    leftAngle = -2 * transition;
    rightAngle = -26 * transition;
    rightY = -12 * transition;
  } else {
    leftAngle = 14 * transition;
    rightAngle = -14 * transition;
    leftY = -6 * transition;
    rightY = -6 * transition;
  }

  return (
    <g>
      <g transform={`rotate(${leftAngle}, 75, 235) translate(0, ${leftY + breath})`}>
        <rect x="62" y="235" width="28" height="78" rx="14" fill={color} stroke="#000000" strokeWidth="5" />
        <circle cx="76" cy="318" r="15" fill={skinColor} stroke="#000000" strokeWidth="4" />
      </g>
      <g transform={`rotate(${rightAngle}, 225, 235) translate(0, ${rightY + breath})`}>
        <rect x="210" y="235" width="28" height="78" rx="14" fill={color} stroke="#000000" strokeWidth="5" />
        <circle cx="224" cy="318" r="15" fill={skinColor} stroke="#000000" strokeWidth="4" />
      </g>
    </g>
  );
};

// Original Logo Badge on Model Shirts
const OriginalShirtLogoBadge: React.FC<{ model: string; color: string }> = ({ model, color }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "22%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 48,
        height: 48,
        borderRadius: "50%",
        backgroundColor: "#FFFFFF",
        border: "3px solid #000000",
        boxShadow: `0 0 12px ${color}`,
        display: "flex",
        alignItems: "center",
        justify: "center",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      <Img
        src={staticFile(`avatars/logos/original/${model}_logo.png`)}
        alt={model}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

// 1. ChatGPT
export const ChibiChatGPT: React.FC<ChibiModelProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <div style={{ position: "relative", width: height * 0.78, height }}>
    <svg width="100%" height="100%" viewBox="0 0 300 380" fill="none">
      <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FFE4E6" stroke="#000000" strokeWidth="6" />
      <path d="M60 120 Q 150 15 240 120 Q 190 55 150 75 Q 110 55 60 120 Z" fill="#10A37F" stroke="#000000" strokeWidth="6" />

      <rect x="75" y="195" width="25" height="40" rx="8" fill="#1E293B" stroke="#000000" strokeWidth="4" />
      <rect x="200" y="195" width="25" height="40" rx="8" fill="#1E293B" stroke="#000000" strokeWidth="4" />
      <path d="M85 200 Q 150 230 215 200" stroke="#1E293B" strokeWidth="8" fill="none" />

      <ellipse cx="115" cy="135" rx="16" ry="22" fill="#000000" />
      <circle cx="110" cy="125" r="5" fill="#FFFFFF" />
      <path d="M170 135 Q 185 125 200 135" stroke="#000000" strokeWidth="5" fill="none" strokeLinecap="round" />

      <ellipse cx="90" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="210" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />

      <ChibiMouth isSpeaking={isSpeaking} frame={frame} expression="smirk" />

      <rect x="95" y="230" width="110" height="110" rx="22" fill="#10A37F" stroke="#000000" strokeWidth="6" />

      <AnimeKeyframedArms isSpeaking={isSpeaking} frame={frame} color="#10A37F" />

      <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
      <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
    </svg>
    <OriginalShirtLogoBadge model="chatgpt" color="#10A37F" />
  </div>
);

// 2. Grok
export const ChibiGrok: React.FC<ChibiModelProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <div style={{ position: "relative", width: height * 0.78, height }}>
    <svg width="100%" height="100%" viewBox="0 0 300 380" fill="none">
      <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FFE4E6" stroke="#000000" strokeWidth="6" />
      <path d="M60 120 Q 150 15 240 120 Q 190 55 150 75 Q 110 55 60 120 Z" fill="#0F172A" stroke="#000000" strokeWidth="6" />

      <rect x="90" y="70" width="120" height="35" rx="10" fill="#1E293B" stroke="#000000" strokeWidth="5" />
      <circle cx="120" cy="87" r="10" fill="#000000" stroke="#38BDF8" strokeWidth="3" />
      <circle cx="180" cy="87" r="10" fill="#000000" stroke="#38BDF8" strokeWidth="3" />
      <line x1="130" y1="87" x2="170" y2="87" stroke="#38BDF8" strokeWidth="4" />

      <polygon points="100,125 130,135 105,142" fill="#000000" />
      <polygon points="200,125 170,135 195,142" fill="#000000" />

      <ellipse cx="90" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="210" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />

      <ChibiMouth isSpeaking={isSpeaking} frame={frame} expression="smirk" />

      <rect x="95" y="230" width="110" height="110" rx="22" fill="#0F172A" stroke="#000000" strokeWidth="6" />

      <AnimeKeyframedArms isSpeaking={isSpeaking} frame={frame} color="#0F172A" />

      <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
      <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
    </svg>
    <OriginalShirtLogoBadge model="grok" color="#0F172A" />
  </div>
);

// 3. Claude
export const ChibiClaude: React.FC<ChibiModelProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <div style={{ position: "relative", width: height * 0.78, height }}>
    <svg width="100%" height="100%" viewBox="0 0 300 380" fill="none">
      <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FFE4E6" stroke="#000000" strokeWidth="6" />
      <path d="M60 120 Q 150 15 240 120 Q 190 55 150 75 Q 110 55 60 120 Z" fill="#D97706" stroke="#000000" strokeWidth="6" />

      <ellipse cx="150" cy="48" rx="68" ry="26" fill="#78350F" stroke="#000000" strokeWidth="5" />
      <circle cx="150" cy="22" r="7" fill="#F59E0B" />

      <ellipse cx="115" cy="135" rx="24" ry="18" fill="none" stroke="#000000" strokeWidth="4" />
      <ellipse cx="185" cy="135" rx="24" ry="18" fill="none" stroke="#000000" strokeWidth="4" />
      <line x1="139" y1="135" x2="161" y2="135" stroke="#000000" strokeWidth="4" />
      <circle cx="115" cy="135" r="5" fill="#000000" />
      <circle cx="185" cy="135" r="5" fill="#000000" />

      <ellipse cx="90" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="210" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />

      <ChibiMouth isSpeaking={isSpeaking} frame={frame} expression="smile" />

      <rect x="95" y="230" width="110" height="110" rx="22" fill="#D97706" stroke="#000000" strokeWidth="6" />
      <polygon points="135,225 150,233 165,225 165,241 150,233 135,241" fill="#DC2626" stroke="#000000" strokeWidth="2" />

      <AnimeKeyframedArms isSpeaking={isSpeaking} frame={frame} color="#D97706" />

      <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
      <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
    </svg>
    <OriginalShirtLogoBadge model="claude" color="#D97706" />
  </div>
);

// 4. Gemini
export const ChibiGemini: React.FC<ChibiModelProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <div style={{ position: "relative", width: height * 0.78, height }}>
    <svg width="100%" height="100%" viewBox="0 0 300 380" fill="none">
      <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FFE4E6" stroke="#000000" strokeWidth="6" />
      <path d="M60 120 Q 150 15 240 120 Q 190 55 150 75 Q 110 55 60 120 Z" fill="#2563EB" stroke="#000000" strokeWidth="6" />

      <path d="M65 80 Q 150 30 235 80" stroke="#60A5FA" strokeWidth="12" fill="none" />

      <ellipse cx="115" cy="135" rx="20" ry="26" fill="#000000" />
      <circle cx="108" cy="122" r="7" fill="#60A5FA" />
      <circle cx="118" cy="140" r="4" fill="#FFFFFF" />
      <ellipse cx="185" cy="135" rx="20" ry="26" fill="#000000" />
      <circle cx="178" cy="122" r="7" fill="#60A5FA" />
      <circle cx="188" cy="140" r="4" fill="#FFFFFF" />

      <ellipse cx="90" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="210" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />

      <ChibiMouth isSpeaking={isSpeaking} frame={frame} expression="happy" />

      <rect x="95" y="230" width="110" height="110" rx="22" fill="#2563EB" stroke="#000000" strokeWidth="6" />

      <AnimeKeyframedArms isSpeaking={isSpeaking} frame={frame} color="#2563EB" />

      <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
      <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
    </svg>
    <OriginalShirtLogoBadge model="gemini" color="#2563EB" />
  </div>
);

// 5. Kimi
export const ChibiKimi: React.FC<ChibiModelProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <div style={{ position: "relative", width: height * 0.78, height }}>
    <svg width="100%" height="100%" viewBox="0 0 300 380" fill="none">
      <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FFE4E6" stroke="#000000" strokeWidth="6" />
      <path d="M60 120 Q 150 15 240 120 Q 190 55 150 75 Q 110 55 60 120 Z" fill="#06B6D4" stroke="#000000" strokeWidth="6" />

      <polygon points="75,65 95,20 125,55" fill="#06B6D4" stroke="#000000" strokeWidth="5" />
      <polygon points="225,65 205,20 175,55" fill="#06B6D4" stroke="#000000" strokeWidth="5" />

      <path d="M100 135 Q 115 115 130 135" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M170 135 Q 185 115 200 135" stroke="#000000" strokeWidth="6" fill="none" strokeLinecap="round" />

      <ellipse cx="90" cy="155" rx="14" ry="7" fill="#F43F5E" opacity="0.7" />
      <ellipse cx="210" cy="155" rx="14" ry="7" fill="#F43F5E" opacity="0.7" />

      <ChibiMouth isSpeaking={isSpeaking} frame={frame} expression="happy" />

      <rect x="95" y="230" width="110" height="110" rx="22" fill="#06B6D4" stroke="#000000" strokeWidth="6" />

      <AnimeKeyframedArms isSpeaking={isSpeaking} frame={frame} color="#06B6D4" />

      <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
      <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
    </svg>
    <OriginalShirtLogoBadge model="kimi" color="#06B6D4" />
  </div>
);

// 6. Qwen
export const ChibiQwen: React.FC<ChibiModelProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <div style={{ position: "relative", width: height * 0.78, height }}>
    <svg width="100%" height="100%" viewBox="0 0 300 380" fill="none">
      <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FFE4E6" stroke="#000000" strokeWidth="6" />
      <path d="M60 120 Q 150 15 240 120 Q 190 55 150 75 Q 110 55 60 120 Z" fill="#9333EA" stroke="#000000" strokeWidth="6" />

      <polygon points="215,65 220,77 233,77 222,85 226,98 215,90 204,98 208,85 197,77 210,77" fill="#F59E0B" stroke="#000000" strokeWidth="2" />

      <ellipse cx="115" cy="135" rx="16" ry="18" fill="#000000" />
      <circle cx="110" cy="127" r="4" fill="#FFFFFF" />
      <ellipse cx="185" cy="135" rx="16" ry="18" fill="#000000" />
      <circle cx="180" cy="127" r="4" fill="#FFFFFF" />

      <ellipse cx="90" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="210" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />

      <ChibiMouth isSpeaking={isSpeaking} frame={frame} expression="smile" />

      <rect x="95" y="230" width="110" height="110" rx="22" fill="#9333EA" stroke="#000000" strokeWidth="6" />

      <AnimeKeyframedArms isSpeaking={isSpeaking} frame={frame} color="#9333EA" />

      <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
      <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
    </svg>
    <OriginalShirtLogoBadge model="qwen" color="#9333EA" />
  </div>
);

// 7. Llama
export const ChibiLlama: React.FC<ChibiModelProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <div style={{ position: "relative", width: height * 0.78, height }}>
    <svg width="100%" height="100%" viewBox="0 0 300 380" fill="none">
      <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FFE4E6" stroke="#000000" strokeWidth="6" />
      <path d="M60 120 Q 150 15 240 120 Q 190 55 150 75 Q 110 55 60 120 Z" fill="#4F46E5" stroke="#000000" strokeWidth="6" />

      <path d="M60 100 Q 150 40 240 100" stroke="#4F46E5" strokeWidth="16" fill="none" />
      <rect x="230" y="90" width="40" height="12" rx="6" fill="#1E1B4B" />

      <path d="M100 135 Q 115 125 130 135" stroke="#000000" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="185" cy="135" rx="16" ry="22" fill="#000000" />
      <circle cx="180" cy="125" r="5" fill="#FFFFFF" />

      <ellipse cx="90" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />
      <ellipse cx="210" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />

      <ChibiMouth isSpeaking={isSpeaking} frame={frame} expression="smirk" />

      <rect x="95" y="230" width="110" height="110" rx="22" fill="#4F46E5" stroke="#000000" strokeWidth="6" />

      <AnimeKeyframedArms isSpeaking={isSpeaking} frame={frame} color="#4F46E5" />

      <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
      <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
    </svg>
    <OriginalShirtLogoBadge model="llama" color="#4F46E5" />
  </div>
);
