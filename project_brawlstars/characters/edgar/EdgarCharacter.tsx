import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";

export interface EdgarCharacterProps {
  height?: number;
  width?: number;
  isSpeaking?: boolean;
  frame?: number;
  pose?: "idle" | "attack" | "super_vault" | "thumbs_down" | "cross_arms" | "victorious" | "run" | "jump" | "win" | "lose" | "walk";
  expression?: "normal" | "happy" | "angry" | "sad" | "excited" | "shocked";

  // Brawl Stars 2.5D Mechanics Controls
  attackProgress?: number; // 0 to 1: scarf punches extension
  jumpProgress?: number;   // 0 to 1: Vault super jump height curve
  walkCycle?: number;      // 0 to 1: Leg walking cycle (knee folding)

  // Multi-Node Joint Angles
  headAngle?: number;
  leftHipAngle?: number;
  leftKneeAngle?: number;  // Knee fold node
  rightHipAngle?: number;
  rightKneeAngle?: number; // Knee fold node
  leftShoulderAngle?: number;
  leftElbowAngle?: number;
  rightShoulderAngle?: number;
  rightElbowAngle?: number;

  scarfWaveSpeed?: number;
  lifestealAura?: boolean;
  style?: React.CSSProperties;
}

// Unified face: eyes + brows + mouth + VFX per expression
// Matches official Brawl Stars Pin emotes
const EdgarFace: React.FC<{ isSpeaking?: boolean; frame?: number; expression?: string; eyeBlink?: number }> = ({
  isSpeaking = false,
  frame = 0,
  expression = "normal",
  eyeBlink = 1,
}) => {
  const speakCycle = Math.abs(Math.sin(frame * 0.3));

  switch (expression) {
    case "angry":
      // ANGRY PIN: Red face, one big white eye visible, jagged teeth, steam cloud
      return (
        <g>
          <ellipse cx="150" cy="140" rx="60" ry="56" fill="#EF4444" opacity="0.45" />
          {/* Sharp angry brow */}
          <path d="M 95 118 L 130 128" stroke="#09090B" strokeWidth="6" strokeLinecap="round" />
          {/* One big white angry eye (visible under hair) */}
          <circle cx="115" cy="138" r="16" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
          <ellipse cx="115" cy="140" rx="5" ry="7" fill="#09090B" />
          {/* Jagged gritted teeth */}
          <path d="M 130 168 L 135 160 L 142 168 L 149 160 L 156 168 L 163 160 L 168 168 Z" fill="#FFFFFF" stroke="#09090B" strokeWidth="2" />
          {/* Steam cloud */}
          <circle cx="68" cy="95" r="11" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
          <circle cx="56" cy="87" r="9" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
          <circle cx="62" cy="80" r="7" fill="#BFDBFE" stroke="#09090B" strokeWidth="2" />
        </g>
      );

    case "happy":
      // HAPPY/CLAP PIN: Slanted smug brow, small cocky smirk
      return (
        <g>
          {/* Angry/determined brow line */}
          <path d="M 96 120 L 128 128" stroke="#09090B" strokeWidth="5" strokeLinecap="round" />
          {/* Slanted cocky eye */}
          <ellipse cx="115" cy="138" rx="12" ry="10" fill="#09090B" />
          <circle cx="112" cy="134" r="3" fill="#FFFFFF" />
          {/* Small cocky smirk */}
          <path d="M 134 166 Q 148 172 158 164" stroke="#09090B" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );

    case "excited":
      // GG/EXCITED PIN: Eyes hidden behind hair, just the scarf visible, thumbs up vibe
      return (
        <g>
          {/* Eyes fully hidden - relaxed brow */}
          <ellipse cx="115" cy="140" rx="12" ry="8" fill="#09090B" />
          <circle cx="112" cy="136" r="3" fill="#FFFFFF" />
          {/* Subtle content smirk */}
          <path d="M 136 164 Q 150 170 162 162" stroke="#09090B" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );

    case "sad":
      // SAD PIN: Droopy eye, tear stream, small frown
      return (
        <g>
          {/* Sad tilted brow */}
          <path d="M 100 126 Q 116 118 130 126" stroke="#09090B" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Droopy sad eye */}
          <ellipse cx="115" cy="140" rx="10" ry="14" fill="#09090B" />
          <circle cx="112" cy="134" r="3.5" fill="#FFFFFF" />
          {/* Tear stream */}
          <rect x="110" y="150" width="8" height="35" rx="4" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="114" cy="188" r="10" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          {/* Small frown */}
          <path d="M 138 170 Q 150 162 160 170" stroke="#09090B" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );

    case "shocked":
      // SHOCKED/PHEW PIN: Wide open eye, sweat drop, small "O" mouth
      return (
        <g>
          {/* Raised worried brow */}
          <path d="M 96 118 L 130 126" stroke="#09090B" strokeWidth="5" strokeLinecap="round" />
          {/* Wide open eye */}
          <ellipse cx="115" cy="136" rx="16" ry="20" fill="#09090B" />
          <circle cx="111" cy="129" r="5" fill="#FFFFFF" />
          {/* Small "O" mouth */}
          <ellipse cx="150" cy="170" rx="7" ry="9" fill="url(#edgarMouthGrad)" stroke="#09090B" strokeWidth="3" />
          {/* Sweat drop */}
          <path d="M 210 80 Q 218 60 226 80 Q 218 95 210 80 Z" fill="#67E8F9" stroke="#09090B" strokeWidth="2" />
          <circle cx="218" cy="73" r="3" fill="#FFFFFF" />
        </g>
      );

    case "normal":
    default:
      // NEUTRAL PIN: One visible eye under emo bangs, flat/smirk mouth, scarf
      return (
        <g>
          {/* Confident brow line */}
          <path d="M 98 116 L 128 124" stroke="#09090B" strokeWidth="5" strokeLinecap="round" />
          {/* One visible eye with blink */}
          <g transform={`scale(1, ${eyeBlink})`} style={{ transformOrigin: "115px 135px" }}>
            <ellipse cx="115" cy="135" rx="14" ry="18" fill="#09090B" />
            <circle cx="112" cy="128" r="4.5" fill="#FFFFFF" />
          </g>
          {/* Smirk mouth */}
          {isSpeaking ? (
            <ellipse cx="150" cy="168" rx={8 + speakCycle * 6} ry={3 + speakCycle * 8} fill="url(#edgarMouthGrad)" stroke="#1E1B4B" strokeWidth="3" />
          ) : (
            <path d="M 138 165 Q 152 170 164 162" stroke="#09090B" strokeWidth="4" fill="none" strokeLinecap="round" />
          )}
        </g>
      );
  }
};

export const EdgarCharacter: React.FC<EdgarCharacterProps> = ({
  height = 420,
  width,
  isSpeaking = false,
  frame: overrideFrame,
  pose = "idle",
  expression = "smirk",
  attackProgress = 0,
  jumpProgress = 0,
  walkCycle,
  headAngle = 0,
  leftHipAngle,
  leftKneeAngle,
  rightHipAngle,
  rightKneeAngle,
  leftShoulderAngle,
  leftElbowAngle,
  rightShoulderAngle,
  rightElbowAngle,
  scarfWaveSpeed = 0.15,
  lifestealAura = false,
  style,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = overrideFrame !== undefined ? overrideFrame : currentFrame;

  // Jump vault height curve
  const vaultY = jumpProgress > 0 ? -Math.sin(jumpProgress * Math.PI) * 140 : 0;
  const shadowScale = jumpProgress > 0 ? 1 - Math.sin(jumpProgress * Math.PI) * 0.5 : 1;

  // Scarf punch extension math
  const punchExt = attackProgress > 0 ? Math.sin(attackProgress * Math.PI) * 85 : (pose === "attack" ? Math.sin(frame * 0.4) * 40 : 0);

  // Scarf wave motion
  const wave1 = Math.sin(frame * scarfWaveSpeed) * 8;
  const wave2 = Math.cos(frame * (scarfWaveSpeed + 0.03) + 0.8) * 10;
  const breath = Math.sin(frame * 0.08) * 3;
  const eyeBlink = frame % 90 > 86 ? 0.1 : 1;

  // Dynamic Walk Cycle
  const currentWalk = walkCycle !== undefined ? walkCycle : (pose === "run" ? (frame * 0.2) % 1 : 0);
  const legSin = Math.sin(currentWalk * Math.PI * 2);

  // Computed Multi-Node Knee Angles
  const lHip = leftHipAngle !== undefined ? leftHipAngle : (jumpProgress > 0 ? -25 : legSin * 25);
  const lKnee = leftKneeAngle !== undefined ? leftKneeAngle : (jumpProgress > 0 ? 45 : Math.max(0, legSin * 35));

  const rHip = rightHipAngle !== undefined ? rightHipAngle : (jumpProgress > 0 ? 25 : -legSin * 25);
  const rKnee = rightKneeAngle !== undefined ? rightKneeAngle : (jumpProgress > 0 ? 30 : Math.max(0, -legSin * 35));

  // Computed Arm Angles
  const lShoulder = leftShoulderAngle !== undefined ? leftShoulderAngle : (pose === "cross_arms" ? 45 : Math.sin(frame * 0.1) * 4);
  const lElbow = leftElbowAngle !== undefined ? leftElbowAngle : (pose === "cross_arms" ? -35 : 10);

  const rShoulder = rightShoulderAngle !== undefined ? rightShoulderAngle : (pose === "cross_arms" ? -45 : (pose === "thumbs_down" ? -90 : -Math.sin(frame * 0.1) * 4));
  const rElbow = rightElbowAngle !== undefined ? rightElbowAngle : (pose === "cross_arms" ? 35 : (pose === "thumbs_down" ? 45 : 10));

  const calculatedWidth = width || height * 0.8;

  return (
    <div
      style={{
        position: "relative",
        width: calculatedWidth,
        height: height,
        display: "inline-block",
        transform: "perspective(1000px) rotateX(8deg)", // Subtle 2.5D Isometric Tilt
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 2.5D Cel-Shading Gradients & Filters */}
        <defs>
          {/* Skin Shading */}
          <radialGradient id="edgarSkinGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFF7ED" />
            <stop offset="70%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FDBA74" />
          </radialGradient>

          {/* Vest Red Cel Shading */}
          <linearGradient id="edgarVestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="65%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Scarf Purple Cel Shading */}
          <linearGradient id="edgarScarfGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7E22CE" />
            <stop offset="50%" stopColor="#581C87" />
            <stop offset="100%" stopColor="#3B0764" />
          </linearGradient>

          {/* Hair Dark Shading */}
          <linearGradient id="edgarHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3F3F46" />
            <stop offset="40%" stopColor="#18181B" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>

          {/* Pants Cel Shading */}
          <linearGradient id="edgarPantsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#312E81" />
            <stop offset="50%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Sneaker Blue Shading */}
          <linearGradient id="edgarShoeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="70%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Mouth Dark Gradient */}
          <linearGradient id="edgarMouthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9D174D" />
            <stop offset="100%" stopColor="#500724" />
          </linearGradient>

          {/* 2.5D Drop Shadow Filter */}
          <filter id="celShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 2.5D Projection Shadow */}
        <ellipse cx="150" cy="405" rx={75 * shadowScale} ry={14 * shadowScale} fill="#000000" opacity={0.35 * shadowScale} />

        <g transform={`translate(0, ${breath + vaultY})`} filter="url(#celShadow)">
          {/* Lifesteal Healing Aura FX */}
          {lifestealAura && (
            <g transform="translate(150, 220)">
              <circle cx="0" cy="0" r="115" fill="#10B981" opacity="0.25" />
              <circle cx="0" cy="0" r="90" fill="#A855F7" opacity="0.2" />
            </g>
          )}

          {/* Back Hair Tufts */}
          <path d="M 75 110 Q 60 70 95 50 Q 150 20 205 50 Q 240 70 225 110 Z" fill="url(#edgarHairGrad)" stroke="#09090B" strokeWidth="5" />

          {/* Multi-Node Jointed Legs (Thigh -> Knee Fold -> Shin -> Foot) */}
          <g id="edgar-legs">
            {/* Left Leg */}
            <g transform={`rotate(${lHip}, 118, 305)`}>
              <rect x="105" y="305" width="28" height="42" rx="10" fill="url(#edgarPantsGrad)" stroke="#09090B" strokeWidth="4" />
              <line x1="110" y1="310" x2="110" y2="345" stroke="#EC4899" strokeWidth="3.5" />
              {/* Knee Joint -> Lower Shin & Shoe */}
              <g transform={`translate(105, 342) rotate(${lKnee}) translate(-105, -342)`}>
                <rect x="105" y="342" width="28" height="40" rx="8" fill="url(#edgarPantsGrad)" stroke="#09090B" strokeWidth="4" />
                <line x1="110" y1="342" x2="110" y2="380" stroke="#EC4899" strokeWidth="3.5" />
                <circle cx="119" cy="342" r="5" fill="#27272A" stroke="#09090B" strokeWidth="2" />
                {/* 2.5D Sneaker Foot */}
                <rect x="92" y="378" width="48" height="26" rx="8" fill="url(#edgarShoeGrad)" stroke="#1E1B4B" strokeWidth="4" />
                <rect x="92" y="394" width="48" height="10" rx="3" fill="#F8FAFC" />
                <path d="M 94 380 L 138 380" stroke="#93C5FD" strokeWidth="2.5" />
              </g>
            </g>

            {/* Right Leg */}
            <g transform={`rotate(${rHip}, 180, 305)`}>
              <rect x="165" y="305" width="28" height="42" rx="10" fill="url(#edgarPantsGrad)" stroke="#09090B" strokeWidth="4" />
              <line x1="190" y1="310" x2="190" y2="345" stroke="#EC4899" strokeWidth="3.5" />
              {/* Knee Joint -> Lower Shin & Shoe */}
              <g transform={`translate(165, 342) rotate(${rKnee}) translate(-165, -342)`}>
                <rect x="165" y="342" width="28" height="40" rx="8" fill="url(#edgarPantsGrad)" stroke="#09090B" strokeWidth="4" />
                <line x1="190" y1="342" x2="190" y2="380" stroke="#EC4899" strokeWidth="3.5" />
                <circle cx="179" cy="342" r="5" fill="#27272A" stroke="#09090B" strokeWidth="2" />
                {/* 2.5D Sneaker Foot */}
                <rect x="160" y="378" width="48" height="26" rx="8" fill="url(#edgarShoeGrad)" stroke="#1E1B4B" strokeWidth="4" />
                <rect x="160" y="394" width="48" height="10" rx="3" fill="#F8FAFC" />
                <path d="M 162 380 L 206 380" stroke="#93C5FD" strokeWidth="2.5" />
              </g>
            </g>
          </g>

          {/* Torso & Vest */}
          <g id="edgar-torso">
            <rect x="100" y="215" width="100" height="105" rx="16" fill="#27272A" stroke="#09090B" strokeWidth="5" />
            <path d="M 100 215 L 130 215 L 140 315 L 100 315 Z" fill="url(#edgarVestGrad)" stroke="#09090B" strokeWidth="4" />
            <path d="M 200 215 L 170 215 L 160 315 L 200 315 Z" fill="url(#edgarVestGrad)" stroke="#09090B" strokeWidth="4" />

            {/* Vest Rim Light Highlight */}
            <path d="M 102 217 L 128 217" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" />
            <path d="M 172 217 L 198 217" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" />

            {/* Skull Badge */}
            <circle cx="118" cy="245" r="9" fill="#F8FAFC" stroke="#09090B" strokeWidth="2" />
            <rect x="114" y="251" width="8" height="5" rx="1" fill="#F8FAFC" />
            <circle cx="115" cy="244" r="2.5" fill="#09090B" />
            <circle cx="121" cy="244" r="2.5" fill="#09090B" />

            {/* Star Pin */}
            <polygon points="182,238 185,245 192,245 186,249 188,256 182,251 176,256 178,249 172,245 179,245" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />

            {/* Spiked Belt */}
            <rect x="96" y="305" width="108" height="18" rx="4" fill="#18181B" stroke="#09090B" strokeWidth="4" />
            <circle cx="112" cy="314" r="3" fill="#E2E8F0" />
            <circle cx="130" cy="314" r="3" fill="#E2E8F0" />
            <rect x="142" y="301" width="16" height="24" rx="4" fill="#94A3B8" stroke="#09090B" strokeWidth="3" />
            <circle cx="146" cy="309" r="2" fill="#09090B" />
            <circle cx="154" cy="309" r="2" fill="#09090B" />
            <circle cx="170" cy="314" r="3" fill="#E2E8F0" />
            <circle cx="188" cy="314" r="3" fill="#E2E8F0" />
          </g>

          {/* Multi-Node Jointed Arms */}
          <g id="edgar-left-arm" transform={`rotate(${lShoulder}, 80, 230)`}>
            <rect x="68" y="220" width="26" height="42" rx="10" fill="#27272A" stroke="#09090B" strokeWidth="4" />
            <g transform={`translate(68, 258) rotate(${lElbow}) translate(-68, -258)`}>
              <rect x="68" y="258" width="26" height="38" rx="10" fill="#27272A" stroke="#09090B" strokeWidth="4" />
              <rect x="64" y="278" width="30" height="34" rx="8" fill="#6B21A8" stroke="#09090B" strokeWidth="4" />
              <path d="M 72 288 L 86 302 M 86 288 L 72 302" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>

          <g id="edgar-right-arm" transform={`rotate(${rShoulder}, 220, 230)`}>
            <rect x="206" y="220" width="26" height="42" rx="10" fill="#27272A" stroke="#09090B" strokeWidth="4" />
            <g transform={`translate(206, 258) rotate(${rElbow}) translate(-206, -258)`}>
              <rect x="206" y="258" width="26" height="38" rx="10" fill="#27272A" stroke="#09090B" strokeWidth="4" />
              <rect x="206" y="278" width="30" height="34" rx="8" fill="#6B21A8" stroke="#09090B" strokeWidth="4" />
              <path d="M 214 288 L 228 302 M 228 288 L 214 302" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>

          {/* Head & Bangs */}
          <g id="edgar-head" transform={`rotate(${headAngle}, 150, 140)`}>
            <ellipse cx="150" cy="140" rx="62" ry="58" fill="url(#edgarSkinGrad)" stroke="#09090B" strokeWidth="5" />

            {/* Ear */}
            <ellipse cx="88" cy="142" rx="10" ry="14" fill="url(#edgarSkinGrad)" stroke="#09090B" strokeWidth="4" />
            {/* Unified face: eyes + brows + mouth + VFX */}
            <EdgarFace isSpeaking={isSpeaking} frame={frame} expression={expression} eyeBlink={eyeBlink} />

            <path d="M 80 135 C 75 70 120 30 160 30 C 210 30 235 70 230 120 C 210 80 180 65 145 65 C 110 65 85 95 80 135 Z" fill="url(#edgarHairGrad)" stroke="#09090B" strokeWidth="5" />
            <path d="M 125 55 C 160 55 210 80 215 155 C 190 120 165 110 130 95 C 120 90 115 75 125 55 Z" fill="url(#edgarHairGrad)" stroke="#09090B" strokeWidth="4" />
            {/* Hair Highlight */}
            <path d="M 130 65 Q 165 75 190 120" stroke="#71717A" strokeWidth="3" fill="none" opacity="0.6" />
          </g>

          {/* Living Scarf (Punch Extension Mechanics) */}
          <g id="edgar-scarf">
            <path
              d={`M 115 195 Q ${90 - wave1 - punchExt} ${230 + wave2} ${70 - wave1 * 1.5 - punchExt * 1.5} ${280 + wave1}`}
              stroke="url(#edgarScarfGrad)"
              strokeWidth="28"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M 115 195 Q ${90 - wave1 - punchExt} ${230 + wave2} ${70 - wave1 * 1.5 - punchExt * 1.5} ${280 + wave1}`}
              stroke="#DDD6FE"
              strokeWidth="24"
              strokeDasharray="14 14"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx={65 - wave1 * 1.5 - punchExt * 1.5} cy={285 + wave1} r="16" fill="#4C1D95" stroke="#1E1B4B" strokeWidth="4" />

            <path
              d={`M 185 195 Q ${210 + wave2 + punchExt} ${235 - wave1} ${235 + wave2 * 1.5 + punchExt * 1.5} ${285 - wave2}`}
              stroke="url(#edgarScarfGrad)"
              strokeWidth="28"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M 185 195 Q ${210 + wave2 + punchExt} ${235 - wave1} ${235 + wave2 * 1.5 + punchExt * 1.5} ${285 - wave2}`}
              stroke="#DDD6FE"
              strokeWidth="24"
              strokeDasharray="14 14"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx={240 + wave2 * 1.5 + punchExt * 1.5} cy={290 - wave2} r="16" fill="#4C1D95" stroke="#1E1B4B" strokeWidth="4" />

            <rect x="95" y="175" width="110" height="42" rx="20" fill="url(#edgarScarfGrad)" stroke="#1E1B4B" strokeWidth="5" />
            <line x1="115" y1="175" x2="115" y2="217" stroke="#EDE9FE" strokeWidth="8" />
            <line x1="140" y1="175" x2="140" y2="217" stroke="#EDE9FE" strokeWidth="8" />
            <line x1="165" y1="175" x2="165" y2="217" stroke="#EDE9FE" strokeWidth="8" />
            <line x1="190" y1="175" x2="190" y2="217" stroke="#EDE9FE" strokeWidth="8" />
          </g>
        </g>
      </svg>
    </div>
  );
};
