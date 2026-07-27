import React from "react";
import { interpolate } from "remotion";

export interface RoleCharacterProps {
  height?: number;
  isSpeaking?: boolean;
  frame?: number;
}

// Lip Sync Mouth
const DynamicMouth: React.FC<{ isSpeaking?: boolean; frame?: number }> = ({ isSpeaking = false, frame = 0 }) => {
  if (!isSpeaking) {
    return <path d="M140 160 Q 150 168 160 160" stroke="#000000" strokeWidth="4" fill="none" />;
  }
  const cycle = Math.abs(Math.sin(frame * 0.28));
  const rx = 10 + cycle * 6;
  const ry = 3 + cycle * 10;
  return <ellipse cx="150" cy="162" rx={rx} ry={ry} fill="#991B1B" stroke="#000000" strokeWidth="3" />;
};

// Anime Keyframed Speech Poses
const AnimeKeyframedRoleArms: React.FC<{ isSpeaking?: boolean; frame?: number; color: string; skinColor?: string }> = ({
  isSpeaking = false,
  frame = 0,
  color,
  skinColor = "#FED7AA"
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

// 1. Narrator / Host
export const ChibiNarrator: React.FC<RoleCharacterProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <svg width={height * 0.78} height={height} viewBox="0 0 300 380" fill="none">
    <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FED7AA" stroke="#000000" strokeWidth="6" />
    <path d="M70 120 Q 150 20 230 120 Q 180 50 150 70 Q 120 50 70 120 Z" fill="#78350F" stroke="#000000" strokeWidth="5" />

    <ellipse cx="115" cy="135" rx="16" ry="22" fill="#000000" />
    <circle cx="110" cy="125" r="5" fill="#FFFFFF" />
    <ellipse cx="185" cy="135" rx="16" ry="22" fill="#000000" />
    <circle cx="180" cy="125" r="5" fill="#FFFFFF" />
    <path d="M95 110 L 125 118" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
    <path d="M205 110 L 175 118" stroke="#000000" strokeWidth="5" strokeLinecap="round" />

    <DynamicMouth isSpeaking={isSpeaking} frame={frame} />

    <rect x="95" y="230" width="110" height="110" rx="22" fill="#16A34A" stroke="#000000" strokeWidth="6" />

    <AnimeKeyframedRoleArms isSpeaking={isSpeaking} frame={frame} color="#16A34A" />

    <rect x="110" y="335" width="32" height="40" rx="8" fill="#334155" />
    <rect x="158" y="335" width="32" height="40" rx="8" fill="#334155" />
  </svg>
);

// 2. Citizen
export const ChibiCitizen: React.FC<RoleCharacterProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <svg width={height * 0.78} height={height} viewBox="0 0 300 380" fill="none">
    <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FED7AA" stroke="#000000" strokeWidth="6" />
    <path d="M65 120 Q 150 20 235 120 Q 185 55 150 75 Q 115 55 65 120 Z" fill="#D97706" stroke="#000000" strokeWidth="5" />

    <ellipse cx="115" cy="135" rx="16" ry="22" fill="#000000" />
    <circle cx="110" cy="125" r="5" fill="#FFFFFF" />
    <ellipse cx="185" cy="135" rx="16" ry="22" fill="#000000" />
    <circle cx="180" cy="125" r="5" fill="#FFFFFF" />

    <ellipse cx="90" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />
    <ellipse cx="210" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />

    <DynamicMouth isSpeaking={isSpeaking} frame={frame} />

    <rect x="95" y="230" width="110" height="110" rx="22" fill="#2563EB" stroke="#000000" strokeWidth="6" />

    <AnimeKeyframedRoleArms isSpeaking={isSpeaking} frame={frame} color="#2563EB" />

    <rect x="110" y="335" width="32" height="40" rx="8" fill="#1E293B" />
    <rect x="158" y="335" width="32" height="40" rx="8" fill="#1E293B" />
  </svg>
);

// 3. Policeman
export const ChibiPoliceman: React.FC<RoleCharacterProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <svg width={height * 0.78} height={height} viewBox="0 0 300 380" fill="none">
    <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FED7AA" stroke="#000000" strokeWidth="6" />

    <path d="M60 90 Q 150 20 240 90 L 250 110 L 50 110 Z" fill="#1E3A8A" stroke="#000000" strokeWidth="5" />
    <rect x="50" y="105" width="200" height="15" fill="#000000" />
    <polygon points="150,55 156,70 172,70 159,80 164,95 150,85 136,95 141,80 128,70 144,70" fill="#F59E0B" />

    <rect x="90" y="120" width="50" height="35" rx="8" fill="#000000" stroke="#F59E0B" strokeWidth="3" />
    <rect x="160" y="120" width="50" height="35" rx="8" fill="#000000" stroke="#F59E0B" strokeWidth="3" />
    <line x1="140" y1="130" x2="160" y2="130" stroke="#F59E0B" strokeWidth="4" />

    <DynamicMouth isSpeaking={isSpeaking} frame={frame} />

    <rect x="95" y="230" width="110" height="110" rx="22" fill="#1E3A8A" stroke="#000000" strokeWidth="6" />
    <polygon points="150,230 160,250 140,250" fill="#FFFFFF" />
    <polygon points="120,260 130,270 120,280" fill="#F59E0B" />

    <AnimeKeyframedRoleArms isSpeaking={isSpeaking} frame={frame} color="#1E3A8A" />

    <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
    <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
  </svg>
);

// 4. Thief
export const ChibiThief: React.FC<RoleCharacterProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <svg width={height * 0.78} height={height} viewBox="0 0 300 380" fill="none">
    <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FED7AA" stroke="#000000" strokeWidth="6" />

    <path d="M60 110 Q 150 20 240 110 Z" fill="#0F172A" stroke="#000000" strokeWidth="5" />

    <path d="M80 120 Q 150 140 220 120 Q 220 155 150 155 Q 80 155 80 120 Z" fill="#000000" />
    <circle cx="115" cy="135" r="8" fill="#FFFFFF" />
    <circle cx="115" cy="135" r="4" fill="#000000" />
    <circle cx="185" cy="135" r="8" fill="#FFFFFF" />
    <circle cx="185" cy="135" r="4" fill="#000000" />

    <DynamicMouth isSpeaking={isSpeaking} frame={frame} />

    <rect x="95" y="230" width="110" height="110" rx="22" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
    <line x1="95" y1="250" x2="205" y2="250" stroke="#000000" strokeWidth="10" />
    <line x1="95" y1="280" x2="205" y2="280" stroke="#000000" strokeWidth="10" />
    <line x1="95" y1="310" x2="205" y2="310" stroke="#000000" strokeWidth="10" />

    <AnimeKeyframedRoleArms isSpeaking={isSpeaking} frame={frame} color="#FFFFFF" />

    <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
    <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
  </svg>
);

// 5. Judge
export const ChibiJudge: React.FC<RoleCharacterProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <svg width={height * 0.78} height={height} viewBox="0 0 300 380" fill="none">
    <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FED7AA" stroke="#000000" strokeWidth="6" />
    <path d="M55 130 Q 150 10 245 130 Q 230 60 150 50 Q 70 60 55 130 Z" fill="#94A3B8" stroke="#000000" strokeWidth="5" />

    <ellipse cx="115" cy="135" rx="16" ry="22" fill="#000000" />
    <circle cx="110" cy="125" r="5" fill="#FFFFFF" />
    <ellipse cx="185" cy="135" rx="16" ry="22" fill="#000000" />
    <circle cx="180" cy="125" r="5" fill="#FFFFFF" />

    <DynamicMouth isSpeaking={isSpeaking} frame={frame} />

    <rect x="95" y="230" width="110" height="110" rx="22" fill="#0F172A" stroke="#000000" strokeWidth="6" />
    <polygon points="135,230 150,260 165,230" fill="#FFFFFF" />

    <AnimeKeyframedRoleArms isSpeaking={isSpeaking} frame={frame} color="#0F172A" />

    <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
    <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
  </svg>
);

// 6. Doctor
export const ChibiDoctor: React.FC<RoleCharacterProps> = ({ isSpeaking = false, frame = 0, height = 380 }) => (
  <svg width={height * 0.78} height={height} viewBox="0 0 300 380" fill="none">
    <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FED7AA" stroke="#000000" strokeWidth="6" />
    <path d="M60 120 Q 150 15 240 120 Q 190 55 150 75 Q 110 55 60 120 Z" fill="#0284C7" stroke="#000000" strokeWidth="6" />

    <rect x="60" y="85" width="180" height="10" fill="#94A3B8" />
    <circle cx="150" cy="90" r="14" fill="#E2E8F0" stroke="#000000" strokeWidth="3" />

    <ellipse cx="115" cy="135" rx="16" ry="22" fill="#000000" />
    <circle cx="110" cy="125" r="5" fill="#FFFFFF" />
    <ellipse cx="185" cy="135" rx="16" ry="22" fill="#000000" />
    <circle cx="180" cy="125" r="5" fill="#FFFFFF" />

    <DynamicMouth isSpeaking={isSpeaking} frame={frame} />

    <rect x="95" y="230" width="110" height="110" rx="22" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
    <rect x="145" y="250" width="10" height="30" fill="#DC2626" />
    <rect x="135" y="260" width="30" height="10" fill="#DC2626" />

    <AnimeKeyframedRoleArms isSpeaking={isSpeaking} frame={frame} color="#FFFFFF" />

    <rect x="110" y="335" width="32" height="40" rx="8" fill="#000000" />
    <rect x="158" y="335" width="32" height="40" rx="8" fill="#000000" />
  </svg>
);
