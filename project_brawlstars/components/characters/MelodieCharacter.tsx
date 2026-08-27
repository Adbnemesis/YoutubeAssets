import React from "react";
import { useCurrentFrame } from "remotion";

export interface MelodieCharacterProps {
  height?: number;
  width?: number;
  isSpeaking?: boolean;
  frame?: number;
  pose?: "idle" | "sing" | "kpop_dash" | "victorious" | "attack" | "win" | "lose";
  expression?: "normal" | "happy" | "angry" | "sad" | "excited" | "shocked";

  // Brawl Stars Mechanics Controls
  noteOrbitAngle?: number;  // Rotation offset for 3 orbiting musical note pets
  singPulse?: boolean;       // Soundwave rings from golden mic
  dashProgress?: number;    // 0 to 1: K-pop dash dash effect
  micAngle?: number;
  headAngle?: number;
  leftArmAngle?: number;
  rightArmAngle?: number;
  leftLegAngle?: number;
  rightLegAngle?: number;

  style?: React.CSSProperties;
}

// Unified face: eyes + brows + mouth + VFX per expression
// Melodie: Big cute eyes with star pupils, K-pop idol expressions
const MelodieFace: React.FC<{ isSpeaking?: boolean; frame?: number; expression?: string; eyeBlink?: number }> = ({
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
          <ellipse cx="150" cy="140" rx="55" ry="50" fill="#EF4444" opacity="0.35" />
          {/* Sharp V-brows */}
          <path d="M 108 118 L 132 126" stroke="#09090B" strokeWidth="5" strokeLinecap="round" />
          <path d="M 192 118 L 168 126" stroke="#09090B" strokeWidth="5" strokeLinecap="round" />
          {/* Angry eyes */}
          <ellipse cx="122" cy="138" rx="12" ry="10" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <ellipse cx="178" cy="138" rx="12" ry="10" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <ellipse cx="122" cy="140" rx="5" ry="7" fill="#09090B" />
          <ellipse cx="178" cy="140" rx="5" ry="7" fill="#09090B" />
          {/* Angry teeth */}
          <rect x="132" y="162" width="36" height="16" rx="3" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <line x1="142" y1="162" x2="142" y2="178" stroke="#09090B" strokeWidth="2" />
          <line x1="150" y1="162" x2="150" y2="178" stroke="#09090B" strokeWidth="2" />
          <line x1="158" y1="162" x2="158" y2="178" stroke="#09090B" strokeWidth="2" />
          {/* Steam */}
          <circle cx="205" cy="95" r="9" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
          <circle cx="216" cy="88" r="7" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
        </g>
      );

    case "happy":
    case "excited":
      return (
        <g>
          {/* Happy arched brows */}
          <path d="M 108 120 Q 122 112 136 120" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 164 120 Q 178 112 192 120" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Squeezed shut happy eyes */}
          <path d="M 108 140 Q 122 128 136 140" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 164 140 Q 178 128 192 140" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Big open smile */}
          <path d="M 130 162 Q 150 182 170 162" fill="#BE185D" stroke="#09090B" strokeWidth="3" />
        </g>
      );

    case "sad":
      return (
        <g>
          {/* Sad tilted brows */}
          <path d="M 110 124 Q 122 116 134 124" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 166 124 Q 178 116 190 124" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Sad eyes */}
          <ellipse cx="122" cy="140" rx="10" ry="14" fill="#09090B" />
          <circle cx="119" cy="135" r="3.5" fill="#FFFFFF" />
          <ellipse cx="178" cy="140" rx="10" ry="14" fill="#09090B" />
          <circle cx="175" cy="135" r="3.5" fill="#FFFFFF" />
          {/* Tear streams */}
          <rect x="118" y="150" width="7" height="30" rx="3.5" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="121" cy="184" r="8" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <rect x="175" y="150" width="7" height="30" rx="3.5" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="178" cy="184" r="8" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          {/* Frown */}
          <path d="M 140 174 Q 150 166 160 174" stroke="#09090B" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );

    case "shocked":
      return (
        <g>
          {/* Raised brows */}
          <path d="M 108 118 Q 122 110 136 118" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 164 118 Q 178 110 192 118" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Wide open eyes */}
          <ellipse cx="122" cy="138" rx="14" ry="18" fill="#09090B" />
          <circle cx="119" cy="132" r="5" fill="#FFFFFF" />
          <ellipse cx="178" cy="138" rx="14" ry="18" fill="#09090B" />
          <circle cx="175" cy="132" r="5" fill="#FFFFFF" />
          {/* Small "O" mouth */}
          <ellipse cx="150" cy="170" rx="7" ry="9" fill="#BE185D" stroke="#09090B" strokeWidth="3" />
          {/* Sweat drop */}
          <path d="M 200 85 Q 208 65 216 85 Q 208 100 200 85 Z" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="208" cy="78" r="3" fill="#FFFFFF" />
        </g>
      );

    case "normal":
    default:
      return (
        <g>
          {/* Cute arched brows */}
          <path d="M 108 120 Q 122 114 136 122" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 164 122 Q 178 114 192 120" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Big cute eyes with star shimmer */}
          <g transform={`scale(1, ${eyeBlink})`} style={{ transformOrigin: "150px 138px" }}>
            <ellipse cx="122" cy="138" rx="12" ry="16" fill="#09090B" />
            <circle cx="119" cy="132" r="4" fill="#FFFFFF" />
            <circle cx="126" cy="142" r="2" fill="#EC4899" />
            <ellipse cx="178" cy="138" rx="12" ry="16" fill="#09090B" />
            <circle cx="175" cy="132" r="4" fill="#FFFFFF" />
            <circle cx="182" cy="142" r="2" fill="#EC4899" />
          </g>
          {/* Cute smile */}
          {isSpeaking ? (
            <ellipse cx="150" cy="170" rx={8 + speakCycle * 6} ry={4 + speakCycle * 7} fill="#BE185D" stroke="#09090B" strokeWidth="2" />
          ) : (
            <path d="M 140 168 Q 150 176 160 168" stroke="#09090B" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
        </g>
      );
  }
};

export const MelodieCharacter: React.FC<MelodieCharacterProps> = ({
  height = 420,
  width,
  isSpeaking = false,
  frame: overrideFrame,
  pose = "idle",
  expression = "popstar",
  noteOrbitAngle,
  singPulse = false,
  dashProgress = 0,
  micAngle,
  headAngle,
  leftArmAngle,
  rightArmAngle,
  leftLegAngle,
  rightLegAngle,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = overrideFrame !== undefined ? overrideFrame : currentFrame;
  const breath = Math.sin(frame * 0.08) * 3;
  const eyeBlink = frame % 90 > 86 ? 0.1 : 1;

  // Pose-driven body motion (so poses read clearly in the showcase)
  const poseBob =
    pose === "victorious" || pose === "win"
      ? Math.abs(Math.sin(frame * 0.2)) * 20
      : pose === "kpop_dash"
        ? Math.abs(Math.sin(frame * 0.4)) * 12
        : pose === "sing"
          ? Math.abs(Math.sin(frame * 0.14)) * 6
          : pose === "lose"
            ? 0
            : 4;
  const bodyLean =
    pose === "kpop_dash"
      ? -16
      : pose === "attack"
        ? 14
        : pose === "sing"
          ? -8
          : pose === "lose"
            ? 10
            : pose === "victorious" || pose === "win"
              ? 0
              : 4;
  const headTilt =
    pose === "kpop_dash"
      ? 8
      : pose === "attack"
        ? -8
        : pose === "sing"
          ? -6
          : pose === "victorious" || pose === "win"
            ? 10
            : 0;

  // Dynamic Orbiting Note Pets (Me-Me / Musical notes)
  const baseOrbit = noteOrbitAngle !== undefined ? noteOrbitAngle : frame * 0.05;
  const note1X = Math.cos(baseOrbit) * 110 + 150;
  const note1Y = Math.sin(baseOrbit) * 35 + 160;

  const note2X = Math.cos(baseOrbit + (Math.PI * 2) / 3) * 110 + 150;
  const note2Y = Math.sin(baseOrbit + (Math.PI * 2) / 3) * 35 + 160;

  const note3X = Math.cos(baseOrbit + (Math.PI * 4) / 3) * 110 + 150;
  const note3Y = Math.sin(baseOrbit + (Math.PI * 4) / 3) * 35 + 160;

  // Right arm holds the golden mic — pose-driven mic height
  const effMicAngle =
    micAngle !== undefined
      ? micAngle
      : pose === "sing"
        ? -70
        : pose === "victorious" || pose === "win"
          ? -20
          : pose === "kpop_dash"
            ? -45
            : pose === "attack"
              ? 30
              : -25;
  // Left arm — pose-driven
  const effLeftArm =
    leftArmAngle !== undefined
      ? leftArmAngle
      : pose === "victorious" || pose === "win"
        ? 110
        : pose === "kpop_dash"
          ? -60 + Math.sin(frame * 0.3) * 20
          : pose === "attack"
            ? -45
            : pose === "sing"
              ? -15
              : 0;
  // Legs — k-pop dance kick on beat, gentle sway otherwise
  const effLeftLeg =
    leftLegAngle !== undefined
      ? leftLegAngle
      : pose === "kpop_dash"
        ? Math.sin(frame * 0.5) * 18
        : pose === "lose"
          ? -14
          : Math.sin(frame * 0.1) * 4;
  const effRightLeg =
    rightLegAngle !== undefined
      ? rightLegAngle
      : pose === "kpop_dash"
        ? -Math.sin(frame * 0.5) * 18
        : pose === "lose"
          ? -20
          : -Math.sin(frame * 0.1) * 4;

  const singActive = singPulse || pose === "sing";
  const dashActive = dashProgress > 0 || pose === "kpop_dash";

  const calculatedWidth = width || height * 0.8;

  return (
    <div
      style={{
        position: "relative",
        width: calculatedWidth,
        height,
        display: "inline-block",
        transform: "perspective(1000px) rotateX(6deg)",
        ...style,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="melodieSkinGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF1F5" />
            <stop offset="70%" stopColor="#FCE7F3" />
            <stop offset="100%" stopColor="#F9A8D4" />
          </radialGradient>
          <linearGradient id="melodieHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F9A8D4" />
            <stop offset="70%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>
          <linearGradient id="melodieSkirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <filter id="celShadowMelodie" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        <ellipse cx="150" cy="405" rx="75" ry="12" fill="#000000" opacity="0.25" />

        {/* K-pop dash speed lines (Super) */}
        {dashActive && (
          <g transform="translate(150, 240)" opacity={0.8}>
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="-200"
                y1={-90 + i * 26}
                x2="-120"
                y2={-90 + i * 26}
                stroke="#FDE047"
                strokeWidth="5"
                strokeLinecap="round"
                opacity={0.9 - i * 0.08}
              />
            ))}
          </g>
        )}

        <g
          transform={`translate(0, ${breath + poseBob}) rotate(${bodyLean / 2}, 150, 260)`}
          filter="url(#celShadowMelodie)"
        >
          {/* Orbiting Note Pet 1 */}
          <g transform={`translate(${note1X}, ${note1Y})`}>
            <rect x="-18" y="-12" width="36" height="26" rx="10" fill="#DB2777" stroke="#831843" strokeWidth="3" />
            <circle cx="-5" cy="-2" r="3" fill="#FFFFFF" />
            <circle cx="5" cy="-2" r="3" fill="#FFFFFF" />
            <path d="M -7 4 Q 0 8 7 4" stroke="#000" strokeWidth="2" fill="none" />
          </g>

          {/* Orbiting Note Pet 2 */}
          <g transform={`translate(${note2X}, ${note2Y})`}>
            <circle cx="0" cy="0" r="14" fill="#A855F7" stroke="#581C87" strokeWidth="3" />
            <circle cx="-4" cy="-2" r="2.5" fill="#FFFFFF" />
            <circle cx="4" cy="-2" r="2.5" fill="#FFFFFF" />
            <path d="M -5 3 Q 0 7 5 3" stroke="#000" strokeWidth="2" fill="none" />
          </g>

          {/* Orbiting Note Pet 3 */}
          <g transform={`translate(${note3X}, ${note3Y})`}>
            <rect x="-14" y="-14" width="28" height="28" rx="8" fill="#EC4899" stroke="#831843" strokeWidth="3" />
            <circle cx="-4" cy="-2" r="2.5" fill="#FFFFFF" />
            <circle cx="4" cy="-2" r="2.5" fill="#FFFFFF" />
          </g>

          {/* Big Pink Cat-Ear Bow */}
          <polygon points="75,70 150,110 60,110" fill="#EC4899" stroke="#831843" strokeWidth="4" />
          <polygon points="225,70 150,110 240,110" fill="#EC4899" stroke="#831843" strokeWidth="4" />

          {/* Long Pink Back Hair */}
          <path d="M 80 110 Q 50 200 80 300 Q 150 240 220 300 Q 250 200 220 110 Z" fill="url(#melodieHairGrad)" stroke="#831843" strokeWidth="5" />

          {/* Legs */}
          <g id="melodie-legs">
            <g transform={`rotate(${effLeftLeg}, 122, 300)`}>
              <rect x="110" y="300" width="24" height="80" rx="8" fill="#FCE7F3" stroke="#831843" strokeWidth="3" />
              <rect x="98" y="365" width="42" height="38" rx="10" fill="#EC4899" stroke="#831843" strokeWidth="4" />
              <line x1="98" y1="380" x2="140" y2="380" stroke="#FDE047" strokeWidth="4" />
            </g>
            <g transform={`rotate(${effRightLeg}, 178, 300)`}>
              <rect x="166" y="300" width="24" height="80" rx="8" fill="#FCE7F3" stroke="#831843" strokeWidth="3" />
              <rect x="160" y="365" width="42" height="38" rx="10" fill="#EC4899" stroke="#831843" strokeWidth="4" />
              <line x1="160" y1="380" x2="202" y2="380" stroke="#FDE047" strokeWidth="4" />
            </g>
          </g>

          {/* Torso */}
          <g id="melodie-torso">
            <rect x="102" y="210" width="96" height="55" rx="12" fill="#18181B" stroke="#09090B" strokeWidth="4" />
            <circle cx="150" cy="235" r="8" fill="#EF4444" />

            <polygon points="90,260 210,260 220,300 80,300" fill="url(#melodieSkirtGrad)" stroke="#713F12" strokeWidth="4" />
            <line x1="110" y1="260" x2="105" y2="300" stroke="#713F12" strokeWidth="3" />
            <line x1="135" y1="260" x2="135" y2="300" stroke="#713F12" strokeWidth="3" />
            <line x1="165" y1="260" x2="165" y2="300" stroke="#713F12" strokeWidth="3" />

            <path d="M 95 205 Q 150 230 205 205 Q 180 195 150 200 Q 120 195 95 205 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
          </g>

          {/* Left Arm */}
          <g id="melodie-left-arm" transform={`rotate(${effLeftArm}, 80, 215)`}>
            <rect x="70" y="215" width="24" height="70" rx="10" fill="#FCE7F3" stroke="#831843" strokeWidth="3" />
            <circle cx="82" cy="255" r="14" fill="#EAB308" stroke="#713F12" strokeWidth="3" />
          </g>

          {/* Right Arm & Golden Mic */}
          <g id="melodie-right-arm" transform={`rotate(${effMicAngle}, 210, 230)`}>
            <rect x="206" y="215" width="24" height="60" rx="10" fill="#FCE7F3" stroke="#831843" strokeWidth="3" />
            <circle cx="218" cy="255" r="14" fill="#EAB308" stroke="#713F12" strokeWidth="3" />
            <rect x="214" y="270" width="8" height="25" fill="#EAB308" stroke="#713F12" strokeWidth="2" />
            <circle cx="218" cy="268" r="8" fill="#F472B6" stroke="#831843" strokeWidth="2" />

            {/* Sing Pulse Soundwaves FX */}
            {singActive && (
              <g transform="translate(218, 268)">
                <circle cx="0" cy="0" r="22" stroke="#EC4899" strokeWidth="3" fill="none" opacity="0.7" />
                <circle cx="0" cy="0" r="35" stroke="#FDE047" strokeWidth="2" fill="none" opacity="0.4" />
              </g>
            )}
          </g>

          {/* Head & Face */}
          <g id="melodie-head" transform={`rotate(${headAngle !== undefined ? headAngle : headTilt}, 150, 140)`}>
            <ellipse cx="150" cy="140" rx="58" ry="52" fill="url(#melodieSkinGrad)" stroke="#831843" strokeWidth="5" />

            {/* Unified face: eyes + brows + mouth + VFX */}
            <MelodieFace isSpeaking={isSpeaking} frame={frame} expression={expression} eyeBlink={eyeBlink} />
            <path d="M 92 100 Q 150 70 208 100 Q 180 140 165 95 Q 135 95 120 140 Z" fill="url(#melodieHairGrad)" stroke="#831843" strokeWidth="4" />
          </g>
        </g>
      </svg>
    </div>
  );
};
