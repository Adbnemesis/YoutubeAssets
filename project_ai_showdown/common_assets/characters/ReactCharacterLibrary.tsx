import React from "react";

/**
 * Universal React Character Library for OpenMontage / Remotion Video Productions
 * Supports 6 distinct popular YouTube visual styles:
 * 1. StickmanAnime - ScariestAI clean vector stickman body
 * 2. ChibiAnime - Expressive anime character avatar
 * 3. PixelHero - Retro 8-bit / 16-bit arcade pixel sprite
 * 4. CorporateVector - Flat tech vector character (Kurzgesagt style)
 * 5. SphereBot3D - Glossy 3D orb bot figure
 * 6. HumanNarrator - Human participant / yellow sweater character
 */

export interface CharacterProps {
  color?: string;
  height?: number;
  isSpeaking?: boolean;
}

// 1. ScariestAI 2D Anime Stickman
export const StickmanAnime: React.FC<CharacterProps> = ({ color = "#10A37F", height = 420 }) => (
  <svg width={height * 0.57} height={height} viewBox="0 0 240 420" fill="none">
    {/* Neck */}
    <rect x="106" y="70" width="28" height="40" rx="6" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
    {/* Torso Hoodie */}
    <rect x="60" y="105" width="120" height="190" rx="30" fill="#FFFFFF" stroke="#000000" strokeWidth="7" />
    {/* Arms */}
    <rect x="18" y="115" width="38" height="150" rx="19" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
    <circle cx="37" cy="275" r="22" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
    <rect x="184" y="115" width="38" height="150" rx="19" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
    <circle cx="203" cy="275" r="22" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
    {/* Legs */}
    <rect x="72" y="285" width="42" height="180" rx="20" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
    <rect x="126" y="285" width="42" height="180" rx="20" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
    {/* Shoes */}
    <rect x="52" y="380" width="60" height="32" rx="12" fill="#000000" stroke="#000000" strokeWidth="4" />
    <rect x="128" y="380" width="60" height="32" rx="12" fill="#000000" stroke="#000000" strokeWidth="4" />
  </svg>
);

// 2. 2D Chibi Anime Avatar
export const ChibiAnime: React.FC<CharacterProps> = ({ color = "#EC4899", height = 400 }) => (
  <svg width={height * 0.75} height={height} viewBox="0 0 300 400" fill="none">
    {/* Large Head */}
    <ellipse cx="150" cy="130" rx="90" ry="85" fill="#FFE4E6" stroke="#000000" strokeWidth="6" />
    {/* Anime Hair */}
    <path d="M60 120 Q 150 20 240 120 Q 190 60 150 80 Q 110 60 60 120 Z" fill={color} stroke="#000000" strokeWidth="6" />
    {/* Expressive Sparkle Eyes */}
    <ellipse cx="115" cy="135" rx="18" ry="24" fill="#000000" />
    <circle cx="110" cy="125" r="6" fill="#FFFFFF" />
    <ellipse cx="185" cy="135" rx="18" ry="24" fill="#000000" />
    <circle cx="180" cy="125" r="6" fill="#FFFFFF" />
    {/* Blush */}
    <ellipse cx="90" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />
    <ellipse cx="210" cy="155" rx="12" ry="6" fill="#F43F5E" opacity="0.6" />
    {/* Cute Mouth */}
    <path d="M140 155 Q 150 165 160 155" stroke="#000000" strokeWidth="4" fill="none" />
    {/* Small Body */}
    <rect x="105" y="210" width="90" height="120" rx="20" fill={color} stroke="#000000" strokeWidth="6" />
    <rect x="110" y="325" width="30" height="60" rx="10" fill="#000000" />
    <rect x="160" y="325" width="30" height="60" rx="10" fill="#000000" />
  </svg>
);

// 3. Flat Tech Vector Avatar (Kurzgesagt Style)
export const CorporateVector: React.FC<CharacterProps> = ({ color = "#3B82F6", height = 400 }) => (
  <svg width={height * 0.7} height={height} viewBox="0 0 280 400" fill="none">
    {/* Geometric Head */}
    <rect x="80" y="40" width="120" height="130" rx="35" fill="#FDBA74" />
    {/* Glasses */}
    <rect x="85" y="90" width="45" height="30" rx="8" fill="#1E293B" />
    <rect x="150" y="90" width="45" height="30" rx="8" fill="#1E293B" />
    <rect x="130" y="102" width="20" height="6" fill="#1E293B" />
    {/* Minimal Body */}
    <rect x="50" y="175" width="180" height="180" rx="40" fill={color} />
    <rect x="110" y="350" width="24" height="45" fill="#1E293B" />
    <rect x="146" y="350" width="24" height="45" fill="#1E293B" />
  </svg>
);

// 4. Glossy 3D Sphere Bot Avatar
export const SphereBot3D: React.FC<CharacterProps> = ({ color = "#06B6D4", height = 400 }) => (
  <svg width={height * 0.75} height={height} viewBox="0 0 300 400" fill="none">
    <defs>
      <radialGradient id="sphereGrad" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor={color} />
        <stop offset="100%" stopColor="#0F172A" />
      </radialGradient>
    </defs>
    {/* Floating 3D Orb Head */}
    <circle cx="150" cy="130" r="85" fill="url(#sphereGrad)" stroke="#FFFFFF" strokeWidth="4" />
    {/* Digital Visor */}
    <rect x="90" y="110" width="120" height="40" rx="20" fill="#000000" />
    <circle cx="120" cy="130" r="10" fill="#10B981" />
    <circle cx="180" cy="130" r="10" fill="#10B981" />
    {/* Floating Ring Torso */}
    <ellipse cx="150" cy="270" rx="95" ry="35" fill="url(#sphereGrad)" opacity="0.9" />
  </svg>
);

// 5. Human Participant / Yellow Sweater Character
export const HumanNarrator: React.FC<CharacterProps> = ({ height = 460 }) => (
  <svg width={height * 0.52} height={height} viewBox="0 0 240 460" fill="none">
    <ellipse cx="120" cy="75" rx="50" ry="55" fill="#FED7AA" stroke="#000000" strokeWidth="6" />
    <path d="M70 70 Q 120 20 170 70 Q 120 40 70 70 Z" fill="#78350F" stroke="#000000" strokeWidth="5" />
    <circle cx="95" cy="70" r="6" fill="#000000" />
    <circle cx="145" cy="70" r="6" fill="#000000" />
    <path d="M85 58 L 105 64" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
    <path d="M155 58 L 135 64" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
    <path d="M105 92 Q 120 84 135 92" stroke="#000000" strokeWidth="4" fill="none" />
    <rect x="104" y="125" width="32" height="30" fill="#FED7AA" stroke="#000000" strokeWidth="5" />
    <rect x="55" y="150" width="130" height="180" rx="26" fill="#EAB308" stroke="#000000" strokeWidth="7" />
    <rect x="18" y="160" width="36" height="140" rx="18" fill="#EAB308" stroke="#000000" strokeWidth="6" />
    <circle cx="36" cy="310" r="20" fill="#FED7AA" stroke="#000000" strokeWidth="5" />
    <rect x="186" y="160" width="36" height="110" rx="18" fill="#EAB308" stroke="#000000" strokeWidth="6" />
    <circle cx="204" cy="280" r="20" fill="#FED7AA" stroke="#000000" strokeWidth="5" />
    <rect x="68" y="325" width="46" height="120" rx="16" fill="#334155" stroke="#000000" strokeWidth="6" />
    <rect x="126" y="325" width="46" height="120" rx="16" fill="#334155" stroke="#000000" strokeWidth="6" />
    <rect x="52" y="420" width="60" height="30" rx="10" fill="#000000" stroke="#000000" strokeWidth="4" />
    <rect x="128" y="420" width="60" height="30" rx="10" fill="#000000" stroke="#000000" strokeWidth="4" />
  </svg>
);

export * from "./ChibiAnimeModels";
export * from "./ChibiRoleCharacters";
