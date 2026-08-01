import React from "react";
import { useCurrentFrame } from "remotion";

export interface KenjiCharacterProps {
  height?: number;
  width?: number;
  isSpeaking?: boolean;
  frame?: number;
  pose?: "idle" | "slash" | "sushi_slice" | "victorious" | "run" | "attack" | "win" | "lose";
  expression?: "normal" | "happy" | "angry" | "sad" | "excited" | "shocked";

  // Brawl Stars 2.5D Mechanics Controls
  attackProgress?: number;  // 0 to 1: Katana slash arc / lunge dash
  superHosomaki?: number;   // 0 to 1: Invincible frame Hosomaki X-slice
  walkCycle?: number;       // 0 to 1: Walking/running knee folding

  // Multi-Node Joint Angles
  katanaAngle?: number;
  headAngle?: number;
  leftHipAngle?: number;
  leftKneeAngle?: number;   // Knee folding node
  rightHipAngle?: number;
  rightKneeAngle?: number;  // Knee folding node
  leftShoulderAngle?: number;
  leftElbowAngle?: number;

  style?: React.CSSProperties;
}

// Unified face: eyes + brows + mouth + VFX per expression
// Kenji: Green blindfold, one eye peeking, serious samurai
const KenjiFace: React.FC<{ isSpeaking?: boolean; frame?: number; expression?: string; eyeBlink?: number }> = ({
  isSpeaking = false,
  frame = 0,
  expression = "normal",
  eyeBlink = 1,
}) => {
  const speakCycle = Math.abs(Math.sin(frame * 0.3));

  switch (expression) {
    case "angry":
      // ANGRY PIN: Red face under blindfold, gritted teeth, steam cloud
      return (
        <g>
          <ellipse cx="150" cy="145" rx="55" ry="48" fill="#EF4444" opacity="0.4" />
          {/* Gritted teeth */}
          <rect x="130" y="164" width="40" height="18" rx="4" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <line x1="140" y1="164" x2="140" y2="182" stroke="#09090B" strokeWidth="2" />
          <line x1="150" y1="164" x2="150" y2="182" stroke="#09090B" strokeWidth="2" />
          <line x1="160" y1="164" x2="160" y2="182" stroke="#09090B" strokeWidth="2" />
          {/* Steam cloud */}
          <circle cx="210" cy="90" r="10" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
          <circle cx="222" cy="83" r="8" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
          <circle cx="215" cy="77" r="6" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
        </g>
      );

    case "happy":
    case "excited":
      // HAPPY/GG PIN: Eyes hidden under blindfold, big teeth grin
      return (
        <g>
          {/* Big teeth grin */}
          <rect x="126" y="160" width="48" height="22" rx="5" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <line x1="138" y1="160" x2="138" y2="182" stroke="#09090B" strokeWidth="2" />
          <line x1="150" y1="160" x2="150" y2="182" stroke="#09090B" strokeWidth="2" />
          <line x1="162" y1="160" x2="162" y2="182" stroke="#09090B" strokeWidth="2" />
        </g>
      );

    case "sad":
      // SAD PIN: Tear stream, small frown
      return (
        <g>
          {/* Tear stream from under blindfold */}
          <rect x="142" y="152" width="8" height="30" rx="4" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="146" cy="186" r="9" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          {/* Small frown */}
          <path d="M 140 174 Q 150 166 160 174" stroke="#09090B" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );

    case "shocked":
      // SHOCKED/PHEW PIN: Eye peeking wide, sweat drop, "O" mouth
      return (
        <g>
          {/* Wide peeking eye */}
          <g transform={`scale(1, ${eyeBlink})`} style={{ transformOrigin: "165px 142px" }}>
            <ellipse cx="165" cy="142" rx="12" ry="14" fill="#09090B" />
            <circle cx="162" cy="137" r="4" fill="#FFFFFF" />
          </g>
          {/* "O" mouth */}
          <ellipse cx="150" cy="172" rx="7" ry="9" fill="#450A0A" stroke="#09090B" strokeWidth="3" />
          {/* Sweat drop */}
          <path d="M 205 85 Q 213 65 221 85 Q 213 100 205 85 Z" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="213" cy="78" r="3" fill="#FFFFFF" />
        </g>
      );

    case "normal":
    default:
      // NEUTRAL PIN: One eye peeking below blindfold, flat serious mouth
      return (
        <g>
          {/* One peeking eye */}
          <g transform={`scale(1, ${eyeBlink})`} style={{ transformOrigin: "165px 142px" }}>
            <ellipse cx="165" cy="142" rx="10" ry="12" fill="#09090B" />
            <circle cx="163" cy="138" r="3.5" fill="#FFFFFF" />
          </g>
          {/* Serious flat mouth */}
          {isSpeaking ? (
            <ellipse cx="150" cy="172" rx={7 + speakCycle * 5} ry={3 + speakCycle * 6} fill="#450A0A" stroke="#09090B" strokeWidth="2" />
          ) : (
            <line x1="140" y1="172" x2="160" y2="172" stroke="#09090B" strokeWidth="4" strokeLinecap="round" />
          )}
        </g>
      );
  }
};

export const KenjiCharacter: React.FC<KenjiCharacterProps> = ({
  height = 420,
  width,
  isSpeaking = false,
  frame: overrideFrame,
  pose = "idle",
  expression = "serious",
  attackProgress = 0,
  superHosomaki = 0,
  walkCycle,
  katanaAngle,
  headAngle = 0,
  leftHipAngle,
  leftKneeAngle,
  rightHipAngle,
  rightKneeAngle,
  leftShoulderAngle,
  leftElbowAngle,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = overrideFrame !== undefined ? overrideFrame : currentFrame;
  const breath = Math.sin(frame * 0.08) * 3;
  const eyeBlink = frame % 90 > 86 ? 0.1 : 1;

  // Slash Arc Animation
  const slashArc = attackProgress > 0 ? -Math.sin(attackProgress * Math.PI) * 110 : (pose === "slash" ? Math.sin(frame * 0.4) * 30 : 0);
  let swordRot = katanaAngle !== undefined ? katanaAngle : -35 + slashArc;

  // Multi-Node Knee & Hip Folding Calculations
  const currentWalk = walkCycle !== undefined ? walkCycle : (pose === "run" ? (frame * 0.2) % 1 : 0);
  const legSin = Math.sin(currentWalk * Math.PI * 2);

  const lHip = leftHipAngle !== undefined ? leftHipAngle : legSin * 25;
  const lKnee = leftKneeAngle !== undefined ? leftKneeAngle : Math.max(0, legSin * 40);

  const rHip = rightHipAngle !== undefined ? rightHipAngle : -legSin * 25;
  const rKnee = rightKneeAngle !== undefined ? rightKneeAngle : Math.max(0, -legSin * 40);

  const lShoulder = leftShoulderAngle !== undefined ? leftShoulderAngle : 0;
  const lElbow = leftElbowAngle !== undefined ? leftElbowAngle : 15;

  const calculatedWidth = width || height * 0.8;

  return (
    <div style={{ position: "relative", width: calculatedWidth, height, display: "inline-block", transform: "perspective(1000px) rotateX(8deg)", ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="kenjiSkinGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="70%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>

          <linearGradient id="kenjiKimonoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="65%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          <linearGradient id="kenjiKatanaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id="kenjiApronGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A3E635" />
            <stop offset="70%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#4D7C0F" />
          </linearGradient>

          <filter id="celShadowKenji" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        <ellipse cx="150" cy="405" rx="75" ry="12" fill="#000000" opacity="0.25" />

        <g transform={`translate(0, ${breath})`} filter="url(#celShadowKenji)">
          {/* Super Hosomaki Slash Trails */}
          {(superHosomaki > 0 || pose === "sushi_slice") && (
            <g transform="translate(150, 200)">
              <line x1="-120" y1="-90" x2="120" y2="90" stroke="#84CC16" strokeWidth="18" strokeLinecap="round" opacity="0.85" />
              <line x1="-120" y1="90" x2="120" y2="-90" stroke="#DC2626" strokeWidth="18" strokeLinecap="round" opacity="0.85" />
              <line x1="-120" y1="-90" x2="120" y2="90" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
              <line x1="-120" y1="90" x2="120" y2="-90" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            </g>
          )}

          {/* Topknot Bun */}
          <path d="M 100 80 Q 90 20 150 15 Q 210 20 200 80 Z" fill="#0F172A" stroke="#020617" strokeWidth="5" />

          {/* Katana Blade & Sheath */}
          <g transform={`rotate(${swordRot}, 210, 180)`}>
            <rect x="220" y="40" width="16" height="220" rx="4" fill="url(#kenjiKatanaGrad)" stroke="#0F172A" strokeWidth="4" />
            <rect x="214" y="32" width="28" height="14" rx="3" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
            <rect x="218" y="10" width="20" height="30" rx="4" fill="#18181B" stroke="#0F172A" strokeWidth="3" />
            <circle cx="240" cy="20" r="10" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          </g>

          {/* Multi-Node Jointed Legs */}
          <g id="kenji-legs">
            {/* Left Leg */}
            <g transform={`rotate(${lHip}, 120, 310)`}>
              <rect x="105" y="310" width="30" height="38" rx="8" fill="#F8FAFC" stroke="#09090B" strokeWidth="4" />
              <line x1="105" y1="330" x2="135" y2="330" stroke="#09090B" strokeWidth="3" />
              <g transform={`translate(105, 344) rotate(${lKnee}) translate(-105, -344)`}>
                <rect x="105" y="344" width="30" height="35" rx="8" fill="#F8FAFC" stroke="#09090B" strokeWidth="4" />
                <line x1="105" y1="355" x2="135" y2="355" stroke="#09090B" strokeWidth="3" />
                <circle cx="120" cy="344" r="4" fill="#E2E8F0" stroke="#09090B" strokeWidth="2" />
                <rect x="98" y="375" width="44" height="18" rx="4" fill="#18181B" stroke="#09090B" strokeWidth="3" />
              </g>
            </g>

            {/* Right Leg */}
            <g transform={`rotate(${rHip}, 180, 310)`}>
              <rect x="163" y="310" width="30" height="38" rx="8" fill="#F8FAFC" stroke="#09090B" strokeWidth="4" />
              <line x1="163" y1="330" x2="193" y2="330" stroke="#09090B" strokeWidth="3" />
              <g transform={`translate(163, 344) rotate(${rKnee}) translate(-163, -344)`}>
                <rect x="163" y="344" width="30" height="35" rx="8" fill="#F8FAFC" stroke="#09090B" strokeWidth="4" />
                <line x1="163" y1="355" x2="193" y2="355" stroke="#09090B" strokeWidth="3" />
                <circle cx="178" cy="344" r="4" fill="#E2E8F0" stroke="#09090B" strokeWidth="2" />
                <rect x="158" y="375" width="44" height="18" rx="4" fill="#18181B" stroke="#09090B" strokeWidth="3" />
              </g>
            </g>
          </g>

          {/* Red Octopus Kimono Jacket & Green Pleated Skirt */}
          <g id="kenji-torso">
            <rect x="95" y="200" width="110" height="115" rx="16" fill="url(#kenjiKimonoGrad)" stroke="#09090B" strokeWidth="5" />
            <path d="M 150 200 L 205 200 L 205 315 L 150 315 Z" fill="#F8FAFC" stroke="#09090B" strokeWidth="4" />

            <circle cx="120" cy="225" r="9" fill="#F8FAFC" stroke="#09090B" strokeWidth="3" />
            <circle cx="120" cy="225" r="4" fill="#DC2626" />
            <circle cx="138" cy="260" r="9" fill="#F8FAFC" stroke="#09090B" strokeWidth="3" />
            <circle cx="138" cy="260" r="4" fill="#DC2626" />

            <polygon points="95,270 205,270 215,315 85,315" fill="url(#kenjiApronGrad)" stroke="#3F6212" strokeWidth="4" />
            <line x1="115" y1="270" x2="110" y2="315" stroke="#3F6212" strokeWidth="3" />
            <line x1="135" y1="270" x2="135" y2="315" stroke="#3F6212" strokeWidth="3" />
            <line x1="165" y1="270" x2="165" y2="315" stroke="#3F6212" strokeWidth="3" />
            <line x1="185" y1="270" x2="190" y2="315" stroke="#3F6212" strokeWidth="3" />

            <rect x="135" y="260" width="30" height="20" rx="4" fill="#4D7C0F" stroke="#09090B" strokeWidth="3" />
          </g>

          {/* Multi-Node Jointed Arms */}
          <g id="kenji-arms" transform={`rotate(${lShoulder}, 80, 210)`}>
            <rect x="68" y="210" width="28" height="38" rx="10" fill="url(#kenjiSkinGrad)" stroke="#09090B" strokeWidth="4" />
            <g transform={`translate(68, 245) rotate(${lElbow}) translate(-68, -245)`}>
              <rect x="66" y="245" width="32" height="35" rx="4" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="3" />
            </g>
          </g>

          {/* Head & Face */}
          <g id="kenji-head" transform={`rotate(${headAngle}, 150, 145)`}>
            <ellipse cx="150" cy="145" rx="60" ry="55" fill="url(#kenjiSkinGrad)" stroke="#09090B" strokeWidth="5" />

            {/* Unified face: eyes + mouth + VFX */}
            <KenjiFace isSpeaking={isSpeaking} frame={frame} expression={expression} eyeBlink={eyeBlink} />

            {/* Scar */}
            <line x1="110" y1="160" x2="125" y2="150" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" />

            {/* Green blindfold (drawn on top of face) */}
            <rect x="90" y="110" width="120" height="35" rx="6" fill="#4D7C0F" stroke="#09090B" strokeWidth="4" />
          </g>
        </g>
      </svg>
    </div>
  );
};
