import React from "react";
import { useCurrentFrame } from "remotion";

export interface FrankCharacterProps {
  height?: number;
  width?: number;
  isSpeaking?: boolean;
  frame?: number;
  pose?: "idle" | "smash" | "super_stun" | "victorious" | "attack" | "win" | "lose";
  expression?: "normal" | "happy" | "angry" | "sad" | "excited" | "shocked";

  // Brawl Stars Mechanics Controls
  attackProgress?: number;  // 0 to 1: Hammer slam arc & ground crack shockwave
  superStunProgress?: number; // 0 to 1: Wall-shattering two-handed slam & stun stars
  hammerAngle?: number;
  headAngle?: number;
  leftArmAngle?: number;
  rightArmAngle?: number;
  leftLegAngle?: number;
  rightLegAngle?: number;

  style?: React.CSSProperties;
}

// Unified face: eyes + brows + mouth + VFX per expression
// Frank: Frankenstein-style, small beady eyes, big rectangular mouth, bolts
const FrankFace: React.FC<{ isSpeaking?: boolean; frame?: number; expression?: string; eyeBlink?: number }> = ({
  isSpeaking = false,
  frame = 0,
  expression = "normal",
  eyeBlink = 1,
}) => {
  const speakCycle = Math.abs(Math.sin(frame * 0.3));

  switch (expression) {
    case "angry":
      return (
        <g>
          <ellipse cx="150" cy="145" rx="60" ry="52" fill="#EF4444" opacity="0.4" />
          {/* Sharp angry brows */}
          <path d="M 112 120 L 132 130" stroke="#09090B" strokeWidth="6" strokeLinecap="round" />
          <path d="M 188 120 L 168 130" stroke="#09090B" strokeWidth="6" strokeLinecap="round" />
          {/* White angry eyes */}
          <ellipse cx="125" cy="142" rx="12" ry="10" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <ellipse cx="175" cy="142" rx="12" ry="10" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <ellipse cx="125" cy="144" rx="5" ry="7" fill="#09090B" />
          <ellipse cx="175" cy="144" rx="5" ry="7" fill="#09090B" />
          {/* Big angry gritted teeth */}
          <rect x="126" y="168" width="48" height="22" rx="4" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <line x1="138" y1="168" x2="138" y2="190" stroke="#09090B" strokeWidth="2" />
          <line x1="150" y1="168" x2="150" y2="190" stroke="#09090B" strokeWidth="2" />
          <line x1="162" y1="168" x2="162" y2="190" stroke="#09090B" strokeWidth="2" />
          {/* Steam */}
          <circle cx="215" cy="95" r="11" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
          <circle cx="228" cy="87" r="9" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
        </g>
      );

    case "happy":
    case "excited":
      return (
        <g>
          {/* Happy arched brows */}
          <path d="M 112 126 Q 125 118 138 126" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 162 126 Q 175 118 188 126" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Squeezed shut happy eyes */}
          <path d="M 112 142 Q 125 130 138 142" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 162 142 Q 175 130 188 142" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Big grinning teeth */}
          <rect x="126" y="166" width="48" height="24" rx="5" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <line x1="138" y1="166" x2="138" y2="190" stroke="#09090B" strokeWidth="2" />
          <line x1="150" y1="166" x2="150" y2="190" stroke="#09090B" strokeWidth="2" />
          <line x1="162" y1="166" x2="162" y2="190" stroke="#09090B" strokeWidth="2" />
        </g>
      );

    case "sad":
      return (
        <g>
          {/* Sad tilted brows */}
          <path d="M 112 130 Q 125 122 138 130" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 162 130 Q 175 122 188 130" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Droopy sad eyes */}
          <ellipse cx="125" cy="144" rx="10" ry="12" fill="#09090B" />
          <circle cx="122" cy="139" r="3.5" fill="#FFFFFF" />
          <ellipse cx="175" cy="144" rx="10" ry="12" fill="#09090B" />
          <circle cx="172" cy="139" r="3.5" fill="#FFFFFF" />
          {/* Tear streams */}
          <rect x="120" y="152" width="9" height="35" rx="4.5" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="124" cy="192" r="10" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <rect x="171" y="152" width="9" height="35" rx="4.5" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="175" cy="192" r="10" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          {/* Frown */}
          <path d="M 138 180 Q 150 170 162 180" stroke="#09090B" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      );

    case "shocked":
      return (
        <g>
          {/* Raised worried brows */}
          <path d="M 112 124 Q 125 116 138 124" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 162 124 Q 175 116 188 124" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Wide open eyes */}
          <ellipse cx="125" cy="142" rx="14" ry="18" fill="#09090B" />
          <circle cx="122" cy="135" r="5" fill="#FFFFFF" />
          <ellipse cx="175" cy="142" rx="14" ry="18" fill="#09090B" />
          <circle cx="172" cy="135" r="5" fill="#FFFFFF" />
          {/* Big "O" mouth */}
          <rect x="136" y="170" width="28" height="22" rx="8" fill="#3B0764" stroke="#09090B" strokeWidth="3" />
          {/* Sweat drop */}
          <path d="M 210 90 Q 218 70 226 90 Q 218 105 210 90 Z" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="218" cy="82" r="3" fill="#FFFFFF" />
        </g>
      );

    case "normal":
    default:
      return (
        <g>
          {/* Flat brows */}
          <line x1="112" y1="128" x2="138" y2="128" stroke="#09090B" strokeWidth="5" strokeLinecap="round" />
          <line x1="162" y1="128" x2="188" y2="128" stroke="#09090B" strokeWidth="5" strokeLinecap="round" />
          {/* Small beady eyes */}
          <g transform={`scale(1, ${eyeBlink})`} style={{ transformOrigin: "150px 142px" }}>
            <ellipse cx="125" cy="142" rx="10" ry="12" fill="#09090B" />
            <circle cx="122" cy="138" r="3" fill="#FFFFFF" />
            <ellipse cx="175" cy="142" rx="10" ry="12" fill="#09090B" />
            <circle cx="172" cy="138" r="3" fill="#FFFFFF" />
          </g>
          {/* Gritted teeth mouth with dividers */}
          {isSpeaking ? (
            <rect x="135" y="172" width="30" height={10 + speakCycle * 12} rx="4" fill="#3B0764" stroke="#09090B" strokeWidth="3" />
          ) : (
            <g>
              <rect x="135" y="172" width="30" height="12" rx="3" fill="#F8FAFC" stroke="#09090B" strokeWidth="3" />
              <line x1="145" y1="172" x2="145" y2="184" stroke="#09090B" strokeWidth="2" />
              <line x1="155" y1="172" x2="155" y2="184" stroke="#09090B" strokeWidth="2" />
            </g>
          )}
        </g>
      );
  }
};

export const FrankCharacter: React.FC<FrankCharacterProps> = ({
  height = 420,
  width,
  isSpeaking = false,
  frame: overrideFrame,
  pose = "idle",
  expression = "dazed",
  attackProgress = 0,
  superStunProgress = 0,
  hammerAngle,
  headAngle = 0,
  leftArmAngle = 0,
  rightArmAngle = 0,
  leftLegAngle = 0,
  rightLegAngle = 0,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = overrideFrame !== undefined ? overrideFrame : currentFrame;
  const breath = Math.sin(frame * 0.08) * 3;
  const eyeBlink = frame % 90 > 86 ? 0.1 : 1;

  // Hammer Smash Arc (Raise overhead 180° -> Slam down)
  const smashArc = (attackProgress > 0 || superStunProgress > 0)
    ? -Math.sin((attackProgress || superStunProgress) * Math.PI) * 120
    : (pose === "smash" || pose === "super_stun" ? Math.sin(frame * 0.4) * 35 : 0);

  let hRot = hammerAngle !== undefined ? hammerAngle : -25 + smashArc;

  const calculatedWidth = width || height * 0.85;

  return (
    <div style={{ position: "relative", width: calculatedWidth, height, display: "inline-block", ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 320 420" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="160" cy="405" rx="90" ry="14" fill="#000000" opacity="0.25" />

        <g transform={`translate(0, ${breath})`}>
          {/* Ground Slam Shockwave & Stun Stars FX */}
          {(superStunProgress > 0 || pose === "super_stun") && (
            <g>
              {/* Shockwave Rings */}
              <ellipse cx="160" cy="390" rx="130" ry="20" stroke="#FBBF24" strokeWidth="8" fill="none" opacity="0.8" />
              <ellipse cx="160" cy="390" rx="90" ry="14" stroke="#EF4444" strokeWidth="6" fill="none" opacity="0.9" />
              {/* Yellow Stun Stars Overhead */}
              <g transform="translate(160, 40)">
                <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#FDE047" />
                <polygon points="-40,-5 -37,-2 -30,0 -37,2 -40,5 -43,2 -50,0 -43,-2" fill="#FDE047" />
                <polygon points="40,-5 43,-2 50,0 43,2 40,5 37,2 30,0 37,-2" fill="#FDE047" />
              </g>
            </g>
          )}

          {/* Tombstone Hammer (Joint Rigged) */}
          <g transform={`rotate(${hRot}, 90, 160)`}>
            <rect x="20" y="140" width="180" height="24" rx="6" transform="rotate(-30, 20, 140)" fill="#64748B" stroke="#09090B" strokeWidth="4" />
            <g transform="translate(10, 30) rotate(-30)">
              <rect x="0" y="0" width="70" height="110" rx="14" fill="#475569" stroke="#09090B" strokeWidth="5" />
              <circle cx="35" cy="40" r="14" fill="#CBD5E1" stroke="#09090B" strokeWidth="3" />
              <rect x="30" y="50" width="10" height="8" rx="2" fill="#CBD5E1" />
              <circle cx="30" cy="38" r="3" fill="#09090B" />
              <circle cx="40" cy="38" r="3" fill="#09090B" />
              <line x1="15" y1="75" x2="55" y2="75" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
            </g>
          </g>

          {/* Legs & Feet */}
          <g id="frank-legs">
            <g transform={`rotate(${leftLegAngle}, 114, 320)`}>
              <rect x="90" y="320" width="48" height="65" rx="12" fill="#DDD6FE" stroke="#581C87" strokeWidth="4" />
              <rect x="80" y="375" width="58" height="26" rx="10" fill="#DDD6FE" stroke="#581C87" strokeWidth="4" />
              <circle cx="85" cy="392" r="5" fill="#C4B5FD" />
              <circle cx="97" cy="392" r="5" fill="#C4B5FD" />
              <circle cx="109" cy="392" r="5" fill="#C4B5FD" />
              <path d="M 80 300 L 140 300 L 145 340 L 75 340 Z" fill="#2563EB" stroke="#09090B" strokeWidth="4" />
            </g>

            <g transform={`rotate(${rightLegAngle}, 204, 320)`}>
              <rect x="180" y="320" width="48" height="65" rx="12" fill="#DDD6FE" stroke="#581C87" strokeWidth="4" />
              <rect x="180" y="375" width="58" height="26" rx="10" fill="#DDD6FE" stroke="#581C87" strokeWidth="4" />
              <circle cx="209" cy="392" r="5" fill="#C4B5FD" />
              <circle cx="221" cy="392" r="5" fill="#C4B5FD" />
              <circle cx="233" cy="392" r="5" fill="#C4B5FD" />
              <path d="M 180 300 L 240 300 L 245 340 L 175 340 Z" fill="#2563EB" stroke="#09090B" strokeWidth="4" />
            </g>
          </g>

          {/* Torso & Vest */}
          <g id="frank-torso">
            <rect x="75" y="190" width="170" height="120" rx="24" fill="#C4B5FD" stroke="#581C87" strokeWidth="6" />
            <rect x="90" y="195" width="140" height="110" rx="16" fill="#1E293B" stroke="#09090B" strokeWidth="5" />
            <polygon points="120,195 160,230 200,195" fill="#93C5FD" opacity="0.4" />
            <polygon points="152,210 168,210 174,270 160,285 146,270" fill="#EC4899" stroke="#831843" strokeWidth="4" />
          </g>

          {/* Arms */}
          <g id="frank-left-arm" transform={`rotate(${leftArmAngle}, 60, 260)`}>
            <ellipse cx="60" cy="260" rx="35" ry="55" fill="#C4B5FD" stroke="#581C87" strokeWidth="5" />
          </g>
          <g id="frank-right-arm" transform={`rotate(${rightArmAngle}, 260, 240)`}>
            <ellipse cx="260" cy="240" rx="35" ry="55" fill="#C4B5FD" stroke="#581C87" strokeWidth="5" />
          </g>

          {/* Head & Headphones */}
          <g id="frank-head" transform={`rotate(${headAngle}, 160, 140)`}>
            <rect x="110" y="85" width="100" height="110" rx="14" fill="#C4B5FD" stroke="#581C87" strokeWidth="6" />
            <path d="M 110 85 C 110 85 120 70 130 85 C 140 70 150 85 160 70 C 170 85 180 70 190 85 C 200 70 210 85 210 85 L 210 110 L 110 110 Z" fill="#6B21A8" stroke="#09090B" strokeWidth="4" />
            <line x1="110" y1="110" x2="210" y2="110" stroke="#09090B" strokeWidth="3" />

            <path d="M 98 120 Q 160 70 222 120" stroke="#334155" strokeWidth="12" fill="none" />
            <rect x="92" y="115" width="20" height="45" rx="8" fill="#1E293B" stroke="#09090B" strokeWidth="4" />
            <rect x="208" y="115" width="20" height="45" rx="8" fill="#1E293B" stroke="#09090B" strokeWidth="4" />

            <rect x="125" y="125" width="70" height="12" rx="4" fill="#6B21A8" />

            {/* Unified face: eyes + brows + mouth + VFX */}
            <FrankFace isSpeaking={isSpeaking} frame={frame} expression={expression} eyeBlink={eyeBlink} />
          </g>
        </g>
      </svg>
    </div>
  );
};
