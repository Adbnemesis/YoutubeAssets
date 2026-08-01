import React from "react";
import { useCurrentFrame } from "remotion";

export interface ShellyCharacterProps {
  height?: number;
  width?: number;
  isSpeaking?: boolean;
  frame?: number;
  pose?: "idle" | "aim" | "super_blast" | "victorious" | "cross_arms" | "attack" | "win" | "lose";
  expression?: "normal" | "happy" | "angry" | "sad" | "excited" | "shocked";

  // Brawl Stars Mechanics Controls
  attackProgress?: number;  // 0 to 1: Shotgun firing recoil & shell pellet spray
  superProgress?: number;   // 0 to 1: Super Shell explosion cone & wall shatter
  shotgunAngle?: number;    // degrees rotation of gun arm
  headAngle?: number;
  leftArmAngle?: number;
  rightArmAngle?: number;
  leftLegAngle?: number;
  rightLegAngle?: number;

  style?: React.CSSProperties;
}

// Unified face component: eyes + eyebrows + mouth + VFX per expression
// Matches official Brawl Stars Pin emotes exactly
const ShellyFace: React.FC<{
  isSpeaking?: boolean;
  frame?: number;
  expression?: string;
  eyeBlink?: number;
}> = ({ isSpeaking = false, frame = 0, expression = "normal", eyeBlink = 1 }) => {
  // Speaking mouth animation
  const speakCycle = Math.abs(Math.sin(frame * 0.3));

  switch (expression) {
    case "angry":
      // ANGRY PIN: Red face overlay, sharp V-brows, white angry eyes, big gritted teeth
      return (
        <g>
          {/* Red face overlay */}
          <ellipse cx="150" cy="140" rx="62" ry="56" fill="#EF4444" opacity="0.45" />
          {/* Sharp angry V-brows */}
          <path d="M 100 112 L 130 124" stroke="#09090B" strokeWidth="7" strokeLinecap="round" />
          <path d="M 200 112 L 170 124" stroke="#09090B" strokeWidth="7" strokeLinecap="round" />
          {/* White angry eyes */}
          <ellipse cx="118" cy="138" rx="16" ry="14" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <ellipse cx="182" cy="138" rx="16" ry="14" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <ellipse cx="118" cy="140" rx="6" ry="8" fill="#09090B" />
          <ellipse cx="182" cy="140" rx="6" ry="8" fill="#09090B" />
          {/* Big gritted teeth mouth */}
          <rect x="126" y="160" width="48" height="22" rx="4" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <line x1="138" y1="160" x2="138" y2="182" stroke="#09090B" strokeWidth="2" />
          <line x1="150" y1="160" x2="150" y2="182" stroke="#09090B" strokeWidth="2" />
          <line x1="162" y1="160" x2="162" y2="182" stroke="#09090B" strokeWidth="2" />
          {/* Steam cloud */}
          <circle cx="210" cy="90" r="12" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
          <circle cx="224" cy="82" r="10" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
          <circle cx="216" cy="76" r="8" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
        </g>
      );

    case "happy":
    case "excited":
      // HAPPY/EXCITED PIN: Eyes squeezed shut (happy arcs), big open teeth grin
      return (
        <g>
          {/* Happy eyebrows (raised) */}
          <path d="M 104 112 Q 118 106 132 114" stroke="#C084FC" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 168 114 Q 182 106 196 112" stroke="#C084FC" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Squeezed shut happy eyes (upward arcs) */}
          <path d="M 104 138 Q 118 126 132 138" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 168 138 Q 182 126 196 138" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Big open teeth grin */}
          <rect x="122" y="158" width="56" height="26" rx="6" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <line x1="134" y1="158" x2="134" y2="184" stroke="#09090B" strokeWidth="2" />
          <line x1="146" y1="158" x2="146" y2="184" stroke="#09090B" strokeWidth="2" />
          <line x1="158" y1="158" x2="158" y2="184" stroke="#09090B" strokeWidth="2" />
          <line x1="170" y1="158" x2="170" y2="184" stroke="#09090B" strokeWidth="2" />
        </g>
      );

    case "sad":
      // SAD PIN: Tilted sad brows, teardrop streams, small frown
      return (
        <g>
          {/* Sad tilted brows */}
          <path d="M 104 120 Q 118 112 132 120" stroke="#C084FC" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 168 120 Q 182 112 196 120" stroke="#C084FC" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Sad eyes (droopy, looking down) */}
          <ellipse cx="118" cy="138" rx="12" ry="16" fill="#09090B" />
          <circle cx="115" cy="132" r="4" fill="#FFFFFF" />
          <ellipse cx="182" cy="138" rx="12" ry="16" fill="#09090B" />
          <circle cx="179" cy="132" r="4" fill="#FFFFFF" />
          {/* Teardrop streams */}
          <rect x="104" y="148" width="10" height="45" rx="5" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="109" cy="196" r="12" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <rect x="186" y="148" width="10" height="45" rx="5" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="191" cy="196" r="12" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          {/* Small frown */}
          <path d="M 140 174 Q 150 166 160 174" stroke="#09090B" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );

    case "shocked":
      // SHOCKED/PHEW PIN: Wide open black eyes, sweat drop, small "O" mouth
      return (
        <g>
          {/* Raised worried brows */}
          <path d="M 104 114 Q 118 108 132 116" stroke="#C084FC" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 168 116 Q 182 108 196 114" stroke="#C084FC" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Wide open black eyes */}
          <ellipse cx="118" cy="136" rx="16" ry="20" fill="#09090B" />
          <circle cx="114" cy="130" r="5" fill="#FFFFFF" />
          <ellipse cx="182" cy="136" rx="16" ry="20" fill="#09090B" />
          <circle cx="178" cy="130" r="5" fill="#FFFFFF" />
          {/* Small "O" mouth */}
          <ellipse cx="150" cy="170" rx="8" ry="10" fill="#701A75" stroke="#09090B" strokeWidth="3" />
          {/* Sweat drop */}
          <path d="M 210 85 Q 218 65 226 85 Q 218 100 210 85 Z" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="218" cy="78" r="3" fill="#FFFFFF" />
        </g>
      );

    case "normal":
    default:
      // NEUTRAL PIN: V-shaped brows, black oval eyes, gritted teeth
      return (
        <g>
          {/* V-shaped confident brows */}
          <path d="M 104 114 Q 118 108 132 116" stroke="#C084FC" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 168 116 Q 182 108 196 114" stroke="#C084FC" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Black oval eyes with shine */}
          <g transform={`scale(1, ${eyeBlink})`} style={{ transformOrigin: "150px 135px" }}>
            <ellipse cx="118" cy="135" rx="14" ry="18" fill="#09090B" />
            <circle cx="115" cy="128" r="4" fill="#FFFFFF" />
            <ellipse cx="182" cy="135" rx="14" ry="18" fill="#09090B" />
            <circle cx="179" cy="128" r="4" fill="#FFFFFF" />
          </g>
          {/* Gritted teeth mouth */}
          {isSpeaking ? (
            <ellipse cx="150" cy="168" rx={9 + speakCycle * 5} ry={3 + speakCycle * 7} fill="#701A75" stroke="#1E1B4B" strokeWidth="3" />
          ) : (
            <g>
              <rect x="128" y="162" width="44" height="18" rx="4" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
              <line x1="140" y1="162" x2="140" y2="180" stroke="#09090B" strokeWidth="2" />
              <line x1="150" y1="162" x2="150" y2="180" stroke="#09090B" strokeWidth="2" />
              <line x1="160" y1="162" x2="160" y2="180" stroke="#09090B" strokeWidth="2" />
            </g>
          )}
        </g>
      );
  }
};

export const ShellyCharacter: React.FC<ShellyCharacterProps> = ({
  height = 420,
  width,
  isSpeaking = false,
  frame: overrideFrame,
  pose = "idle",
  expression = "confident",
  attackProgress = 0,
  superProgress = 0,
  shotgunAngle,
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
  const eyeBlink = frame % 100 > 96 ? 0.1 : 1;

  // Shotgun Recoil & Shell Ejection Mechanics
  const recoilX = (attackProgress > 0 || superProgress > 0) ? -Math.sin((attackProgress || superProgress) * Math.PI) * 20 : 0;
  const recoilRot = (attackProgress > 0 || superProgress > 0) ? -Math.sin((attackProgress || superProgress) * Math.PI) * 15 : 0;

  let gunRot = shotgunAngle !== undefined ? shotgunAngle : (pose === "aim" ? -65 : (pose === "super_blast" ? -75 : -15));
  gunRot += recoilRot;

  const calculatedWidth = width || height * 0.8;

  return (
    <div style={{ position: "relative", width: calculatedWidth, height, display: "inline-block", ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="150" cy="405" rx="75" ry="12" fill="#000000" opacity="0.25" />

        <g transform={`translate(${recoilX}, ${breath})`}>
          {/* Super Shell Blast Cone & Pellets FX */}
          {(superProgress > 0 || pose === "super_blast") && (
            <g transform="translate(250, 70)">
              <polygon points="0,0 120,-60 120,60" fill="#F59E0B" opacity="0.6" />
              <polygon points="0,0 100,-40 100,40" fill="#EF4444" opacity="0.8" />
              <polygon points="0,0 70,-20 70,20" fill="#FFFFFF" />
              {/* Flying Shell Pellets */}
              <circle cx="110" cy="-30" r="6" fill="#FDE047" />
              <circle cx="115" cy="0" r="8" fill="#FDE047" />
              <circle cx="105" cy="25" r="6" fill="#FDE047" />
            </g>
          )}

          {/* Ponytail Hair */}
          <path d="M 60 110 Q 30 70 50 30 Q 90 10 150 15 Q 210 10 250 30 Q 270 70 240 110 Q 200 130 150 130 Q 100 130 60 110 Z" fill="#A855F7" stroke="#581C87" strokeWidth="6" />

          {/* Legs */}
          <g id="shelly-legs">
            <g transform={`rotate(${leftLegAngle}, 120, 305)`}>
              <rect x="105" y="305" width="32" height="80" rx="10" fill="#1E3A8A" stroke="#0F172A" strokeWidth="4" />
              <line x1="133" y1="310" x2="133" y2="380" stroke="#F59E0B" strokeWidth="4" />
              <rect x="92" y="375" width="48" height="30" rx="8" fill="#0F172A" stroke="#020617" strokeWidth="4" />
              <rect x="96" y="392" width="40" height="8" rx="2" fill="#94A3B8" />
            </g>
            <g transform={`rotate(${rightLegAngle}, 180, 305)`}>
              <rect x="163" y="305" width="32" height="80" rx="10" fill="#1E3A8A" stroke="#0F172A" strokeWidth="4" />
              <line x1="167" y1="310" x2="167" y2="380" stroke="#F59E0B" strokeWidth="4" />
              <rect x="160" y="375" width="48" height="30" rx="8" fill="#0F172A" stroke="#020617" strokeWidth="4" />
              <rect x="164" y="392" width="40" height="8" rx="2" fill="#94A3B8" />
            </g>
          </g>

          {/* Torso & Shirt */}
          <g id="shelly-torso">
            <rect x="98" y="210" width="104" height="105" rx="16" fill="#C084FC" stroke="#581C87" strokeWidth="5" />
            <polygon points="120,210 150,230 180,210" fill="#DDD6FE" stroke="#581C87" strokeWidth="3" />
            <circle cx="150" cy="245" r="4" fill="#FFFFFF" stroke="#581C87" strokeWidth="2" />
            <circle cx="150" cy="265" r="4" fill="#FFFFFF" stroke="#581C87" strokeWidth="2" />
            <circle cx="150" cy="285" r="4" fill="#FFFFFF" stroke="#581C87" strokeWidth="2" />

            <rect x="94" y="300" width="112" height="18" rx="4" fill="#78350F" stroke="#451A03" strokeWidth="4" />
            <rect x="140" y="296" width="20" height="26" rx="4" fill="#CBD5E1" stroke="#334155" strokeWidth="3" />
          </g>

          {/* Left Arm & Bandage Wrap */}
          <g id="shelly-left-arm" transform={`rotate(${leftArmAngle}, 80, 230)`}>
            <rect x="68" y="215" width="28" height="75" rx="12" fill="#FDBA74" stroke="#78350F" strokeWidth="4" />
            <rect x="64" y="210" width="34" height="18" rx="6" fill="#DDD6FE" stroke="#581C87" strokeWidth="3" />
            <rect x="65" y="262" width="32" height="24" rx="4" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="3" />
          </g>

          {/* Head & Face */}
          <g id="shelly-head" transform={`rotate(${headAngle}, 150, 140)`}>
            <ellipse cx="150" cy="140" rx="64" ry="58" fill="#FDBA74" stroke="#78350F" strokeWidth="5" />

            <g transform="rotate(12, 185, 155)">
              <rect x="175" y="148" width="22" height="12" rx="3" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
              <rect x="183" y="150" width="6" height="8" fill="#F59E0B" />
            </g>

            {/* Nose */}
            <path d="M 148 148 Q 150 152 153 148" stroke="#78350F" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Unified face: eyes + brows + mouth + VFX */}
            <ShellyFace isSpeaking={isSpeaking} frame={frame} expression={expression} eyeBlink={eyeBlink} />
            <path d="M 85 110 C 65 70 80 40 100 30 C 115 50 125 40 135 15 C 150 35 160 20 175 25 C 185 45 195 30 215 45 C 230 75 235 95 215 120 C 190 85 150 70 85 110 Z" fill="#C084FC" stroke="#581C87" strokeWidth="5" />
          </g>

          {/* Yellow Bandanna */}
          <g id="shelly-bandanna">
            <path d="M 92 170 Q 150 215 208 170 Q 180 205 150 210 Q 120 205 92 170 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="4" />
            <rect x="94" y="165" width="112" height="18" rx="8" fill="#FBBF24" stroke="#B45309" strokeWidth="4" />
          </g>

          {/* Right Arm & Shotgun (Joint Rigged) */}
          <g id="shelly-shotgun-arm" transform={`rotate(${gunRot}, 210, 210)`}>
            <rect x="180" y="160" width="30" height="70" rx="8" transform="rotate(-30, 180, 160)" fill="#78350F" stroke="#451A03" strokeWidth="4" />
            <rect x="190" y="90" width="16" height="85" rx="4" transform="rotate(-30, 190, 90)" fill="#475569" stroke="#0F172A" strokeWidth="4" />
            <rect x="204" y="98" width="16" height="85" rx="4" transform="rotate(-30, 204, 98)" fill="#64748B" stroke="#0F172A" strokeWidth="4" />
            <rect x="215" y="65" width="22" height="35" rx="4" transform="rotate(-30, 215, 65)" fill="#EA580C" stroke="#7C2D12" strokeWidth="3" />
            <rect x="200" y="215" width="28" height="60" rx="12" fill="#FDBA74" stroke="#78350F" strokeWidth="4" />
            <rect x="196" y="210" width="34" height="18" rx="6" fill="#DDD6FE" stroke="#581C87" strokeWidth="3" />
          </g>
        </g>
      </svg>
    </div>
  );
};
