import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { NEMI_THEME } from "../constants/nemiTheme";

export type AdaPose =
  | "thinking"
  | "explaining"
  | "pointing"
  | "aha"
  | "shocked"
  | "smug"
  | "coding";

export interface AdaMascotProps {
  pose?: AdaPose;
  scale?: number;
  flipX?: boolean;
  hairColor?: string;
  hairStreakColor?: string;
  headphoneColor?: string;
  hoodieColor?: string;
  accentColor?: string;
  style?: React.CSSProperties;
}

export const AdaMascot: React.FC<AdaMascotProps> = ({
  pose = "explaining",
  scale = 1.0,
  flipX = false,
  hairColor = "#2D1B4E", // Deep Indigo/Violet Hair
  hairStreakColor = "#06B6D4", // Neon Cyan Streak
  headphoneColor = "#8B5CF6", // Electric Purple Headphone
  hoodieColor = "#18181B", // Dark Tech Hoodie
  accentColor = "#FFD166", // Warm Yellow Accents
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps = 30 } = useVideoConfig();

  // Subtle breathing float animation
  const floatY = Math.sin((frame / fps) * Math.PI * 2) * 5;
  const headTilt =
    pose === "thinking"
      ? 7
      : pose === "aha"
      ? -4
      : pose === "smug"
      ? -5
      : pose === "shocked"
      ? 2
      : 0;

  // Eye blink animation cycle (every 90 frames)
  const blinkCycle = frame % 90;
  const isBlinking = blinkCycle > 84 && blinkCycle < 88;

  // Headphone LED pulse
  const ledGlowOpacity = interpolate(
    Math.sin((frame / fps) * Math.PI * 3),
    [-1, 1],
    [0.4, 0.95]
  );

  // Pointing / gesturing arm bounce
  const armBob =
    pose === "pointing" || pose === "explaining"
      ? Math.sin((frame / fps) * Math.PI * 3) * 2.5
      : 0;

  return (
    <div
      style={{
        transform: `scale(${scale}) scaleX(${flipX ? -1 : 1}) translateY(${floatY}px)`,
        transformOrigin: "bottom center",
        width: "200px",
        height: "240px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.35))",
        ...style,
      }}
    >
      <svg
        width="200"
        height="240"
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `rotate(${headTilt}deg)`,
          transformOrigin: "50% 75%",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="adaSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE0D2" />
            <stop offset="100%" stopColor="#FFCDB2" />
          </linearGradient>

          <linearGradient id="adaHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hairColor} />
            <stop offset="100%" stopColor="#1E1338" />
          </linearGradient>

          <linearGradient id="adaStreakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor={hairStreakColor} />
          </linearGradient>

          <linearGradient id="adaHeadphoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={headphoneColor} />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          <linearGradient id="adaLaptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <filter id="adaGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 1. BACK HAIR (Behind Head & Body) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <path
          d="M40 90 C30 140 35 180 50 200 C58 205 65 190 62 170 C60 140 65 110 70 95 Z"
          fill="url(#adaHairGrad)"
        />
        <path
          d="M160 90 C170 140 165 180 150 200 C142 205 135 190 138 170 C140 140 135 110 130 95 Z"
          fill="url(#adaHairGrad)"
        />
        {/* Twin Tail Back Waves */}
        <path
          d="M38 110 C20 130 18 165 32 185 C36 170 42 145 45 125 Z"
          fill={hairColor}
        />
        <path
          d="M162 110 C180 130 182 165 168 185 C164 170 158 145 155 125 Z"
          fill={hairColor}
        />

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 2. BODY / DEVELOPER HOODIE */}
        {/* ══════════════════════════════════════════════════════════ */}
        <g id="ada-body">
          {/* Main Hoodie Torso */}
          <path
            d="M45 175 C45 150 70 142 100 142 C130 142 155 150 155 175 L168 240 L32 240 Z"
            fill={hoodieColor}
          />
          {/* Hoodie Inner Neck Shadow */}
          <path
            d="M82 143 C88 152 112 152 118 143 C124 148 126 156 122 162 C114 172 86 172 78 162 C74 156 76 148 82 143 Z"
            fill="#0F0F12"
          />
          {/* Cute Visible Collar Neck */}
          <path
            d="M86 138 C86 148 114 148 114 138 Z"
            fill="url(#adaSkinGrad)"
          />

          {/* Hoodie Drawstrings & Neon Beads */}
          <path d="M84 156 L80 198" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="201" r="3.5" fill={accentColor} />
          <path d="M116 156 L120 198" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="120" cy="201" r="3.5" fill={accentColor} />

          {/* Developer Cyber Chest Badge */}
          <rect x="126" y="172" width="18" height="10" rx="3" fill="#1E293B" stroke={hairStreakColor} strokeWidth="1.5" />
          <circle cx="131" cy="177" r="1.5" fill="#10B981" />
          <line x1="135" y1="177" x2="140" y2="177" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 3. HEAD & FACE STRUCTURE */}
        {/* ══════════════════════════════════════════════════════════ */}
        <g id="ada-head">
          {/* Face Base */}
          <ellipse cx="100" cy="98" rx="52" ry="46" fill="url(#adaSkinGrad)" />

          {/* Cheerful Soft Pink Blush */}
          <ellipse cx="68" cy="112" rx="10" ry="5.5" fill="#FB7185" opacity="0.45" />
          <ellipse cx="132" cy="112" rx="10" ry="5.5" fill="#FB7185" opacity="0.45" />
          {/* Cute blush anime hatch marks */}
          <line x1="65" y1="110" x2="71" y2="114" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <line x1="129" y1="110" x2="135" y2="114" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

          {/* ─── EYES & EYEBROWS ─── */}
          {pose === "shocked" ? (
            /* Shocked Wide Eyes */
            <>
              {/* Left Eyebrow */}
              <path d="M68 72 Q78 65 88 74" stroke="#4A1E6D" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Right Eyebrow */}
              <path d="M112 74 Q122 65 132 72" stroke="#4A1E6D" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Left Eye */}
              <circle cx="78" cy="95" r="13" fill="#18181B" />
              <circle cx="78" cy="95" r="10" fill="#6366F1" />
              <circle cx="75" cy="91" r="4.5" fill="#FFFFFF" />
              <circle cx="82" cy="98" r="2.5" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="122" cy="95" r="13" fill="#18181B" />
              <circle cx="122" cy="95" r="10" fill="#6366F1" />
              <circle cx="119" cy="91" r="4.5" fill="#FFFFFF" />
              <circle cx="126" cy="98" r="2.5" fill="#FFFFFF" />
            </>
          ) : pose === "smug" ? (
            /* Smug Wink */
            <>
              {/* Left Eyebrow */}
              <path d="M68 76 Q78 72 88 78" stroke="#4A1E6D" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Right Eyebrow arched */}
              <path d="M112 73 Q122 66 132 73" stroke="#4A1E6D" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* Left Eye: Cool Wink Line */}
              <path d="M68 96 Q78 104 88 94" stroke="#18181B" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Upper Eyelash */}
              <path d="M86 93 L92 89" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />

              {/* Right Eye: Big Sparkling Anime Eye */}
              <ellipse cx="122" cy="95" rx="11" ry="13" fill="#18181B" />
              <ellipse cx="122" cy="97" rx="9" ry="10" fill="#7C3AED" />
              <ellipse cx="122" cy="100" rx="7" ry="6" fill="#06B6D4" />
              <circle cx="118" cy="90" r="4" fill="#FFFFFF" />
              <circle cx="125" cy="99" r="2.5" fill="#FFFFFF" />
              {/* Eyelash */}
              <path d="M111 86 Q122 81 133 87" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M131 85 L136 81" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : isBlinking ? (
            /* Blinking Curved Lines */
            <>
              <path d="M68 95 Q78 102 88 95" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M112 95 Q122 102 132 95" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            /* Standard Anime Chibi Sparkle Eyes */
            <>
              {/* Eyebrows */}
              <path d="M68 76 Q78 70 88 76" stroke="#4A1E6D" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M112 76 Q122 70 132 76" stroke="#4A1E6D" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Left Eye */}
              <ellipse cx="78" cy="95" rx="11" ry="13.5" fill="#18181B" />
              <ellipse cx="78" cy="97" rx="9" ry="10.5" fill="#6366F1" />
              <ellipse cx="78" cy="101" rx="7" ry="6" fill="#38BDF8" />
              <circle cx="74" cy="90" r="4.5" fill="#FFFFFF" />
              <circle cx="82" cy="99" r="2.5" fill="#FFFFFF" />
              {/* Eyelash */}
              <path d="M67 86 Q78 81 89 87" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M69 85 L64 81" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />

              {/* Right Eye */}
              <ellipse cx="122" cy="95" rx="11" ry="13.5" fill="#18181B" />
              <ellipse cx="122" cy="97" rx="9" ry="10.5" fill="#6366F1" />
              <ellipse cx="122" cy="101" rx="7" ry="6" fill="#38BDF8" />
              <circle cx="118" cy="90" r="4.5" fill="#FFFFFF" />
              <circle cx="126" cy="99" r="2.5" fill="#FFFFFF" />
              {/* Eyelash */}
              <path d="M111 86 Q122 81 133 87" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M131 85 L136 81" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* Cute Tiny Button Nose */}
          <ellipse cx="100" cy="106" rx="2" ry="1.5" fill="#E5989B" />

          {/* ─── MOUTH EXPRESSIONS ─── */}
          {pose === "aha" ? (
            /* Happy Open Smile */
            <path
              d="M91 114 Q100 126 109 114 C109 122 91 122 91 114 Z"
              fill="#F43F5E"
              stroke="#881337"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          ) : pose === "shocked" ? (
            /* O-Mouth */
            <ellipse cx="100" cy="118" rx="5.5" ry="7" fill="#881337" stroke="#F43F5E" strokeWidth="1.5" />
          ) : pose === "smug" ? (
            /* Confident Side Smirk */
            <path d="M93 116 Q102 121 110 114" stroke="#881337" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : pose === "thinking" ? (
            /* Puzzled Wavy Mouth */
            <path d="M93 117 Q97 121 101 117 Q105 120 108 117" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            /* Sweet Gentle Smile */
            <path d="M92 115 Q100 122 108 115" stroke="#881337" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          )}

          {/* ─── FRONT HAIR BANGS & NEON CYBER STREAK ─── */}
          {/* Main Bangs Left */}
          <path
            d="M50 82 C55 50 85 45 100 45 C115 45 145 50 150 82 C145 70 135 65 125 70 C110 75 105 60 95 62 C80 65 70 78 50 82 Z"
            fill="url(#adaHairGrad)"
          />
          {/* Left Side Bang Frame */}
          <path
            d="M52 78 C48 95 50 120 58 135 C62 135 63 125 60 108 C58 95 60 85 68 76 Z"
            fill="url(#adaHairGrad)"
          />
          {/* Right Side Bang Frame with Neon Streak */}
          <path
            d="M148 78 C152 95 150 120 142 135 C138 135 137 125 140 108 C142 95 140 85 132 76 Z"
            fill="url(#adaHairGrad)"
          />
          {/* Cyber Neon Cyan Hair Streak Accent */}
          <path
            d="M136 68 C144 85 145 110 138 128 C135 128 134 120 136 108 C138 95 136 82 130 74 Z"
            fill="url(#adaStreakGrad)"
            filter="url(#adaGlowCyan)"
          />
          {/* Top Hair Highlights */}
          <path
            d="M75 56 Q100 48 125 56"
            stroke="#A78BFA"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </g>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 4. OVERSIZED CYBER HEADPHONES */}
        {/* ══════════════════════════════════════════════════════════ */}
        <g id="ada-headphones">
          {/* Headphone Arch Band */}
          <path
            d="M44 82 C44 40 156 40 156 82"
            stroke="url(#adaHeadphoneGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M52 75 C52 46 148 46 148 75"
            stroke="#1E1B4B"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Earcup */}
          <g transform="translate(32, 70)">
            {/* Cushion */}
            <rect x="0" y="0" width="18" height="38" rx="9" fill="#18181B" stroke="#312E81" strokeWidth="2" />
            {/* Outer Shell */}
            <rect x="-8" y="4" width="12" height="30" rx="6" fill="url(#adaHeadphoneGrad)" />
            {/* Glowing LED Ring */}
            <circle cx="-2" cy="19" r="4.5" fill="#38BDF8" opacity={ledGlowOpacity} filter="url(#adaGlowCyan)" />
          </g>

          {/* Right Earcup */}
          <g transform="translate(150, 70)">
            {/* Cushion */}
            <rect x="0" y="0" width="18" height="38" rx="9" fill="#18181B" stroke="#312E81" strokeWidth="2" />
            {/* Outer Shell */}
            <rect x="14" y="4" width="12" height="30" rx="6" fill="url(#adaHeadphoneGrad)" />
            {/* Glowing LED Ring */}
            <circle cx="20" cy="19" r="4.5" fill="#38BDF8" opacity={ledGlowOpacity} filter="url(#adaGlowCyan)" />
          </g>
        </g>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 5. ARMS & PROPS (According to Pose) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {pose === "pointing" && (
          <g id="ada-pointing-arm" transform={`translate(0, ${armBob})`}>
            {/* Right Arm Pointing Upwards */}
            <path
              d="M152 175 L190 135 L208 115"
              stroke={hoodieColor}
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Hand & Index Finger */}
            <circle cx="208" cy="115" r="7.5" fill="url(#adaSkinGrad)" />
            <path d="M208 115 L218 102" stroke="#FFCDB2" strokeWidth="5.5" strokeLinecap="round" />
            {/* Energy Sparkle on Tip */}
            <circle cx="221" cy="98" r="3.5" fill={accentColor} filter="url(#adaGlowCyan)" />
          </g>
        )}

        {pose === "explaining" && (
          <g id="ada-explaining-arms" transform={`translate(0, ${armBob})`}>
            {/* Right Hand Gesturing Open */}
            <path
              d="M150 178 L185 170 L200 162"
              stroke={hoodieColor}
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="200" cy="162" r="7.5" fill="url(#adaSkinGrad)" />
            <path d="M200 162 L210 156" stroke="#FFCDB2" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        )}

        {pose === "thinking" && (
          <g id="ada-thinking-arm">
            {/* Hand Resting Under Chin */}
            <path
              d="M150 185 L142 145 L118 128"
              stroke={hoodieColor}
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="116" cy="126" r="7" fill="url(#adaSkinGrad)" />
          </g>
        )}

        {pose === "coding" && (
          <g id="ada-coding-laptop">
            {/* Holographic Glowing Mini Laptop/Tablet */}
            <g transform="translate(60, 175)">
              <rect x="0" y="0" width="80" height="52" rx="8" fill="url(#adaLaptopGrad)" stroke="#38BDF8" strokeWidth="2.5" filter="url(#adaGlowCyan)" />
              {/* Screen Content - Glowing Code Matrix Lines */}
              <line x1="12" y1="12" x2="40" y2="12" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
              <line x1="45" y1="12" x2="68" y2="12" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="22" x2="55" y2="22" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="32" x2="35" y2="32" stroke="#FFD166" strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="32" x2="65" y2="32" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
              <line x1="12" y1="42" x2="48" y2="42" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />

              {/* Cute Chibi Hands on Keyboard */}
              <circle cx="14" cy="50" r="6" fill="url(#adaSkinGrad)" />
              <circle cx="66" cy="50" r="6" fill="url(#adaSkinGrad)" />
            </g>
          </g>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 6. FLOATING REACTION BADGES */}
        {/* ══════════════════════════════════════════════════════════ */}
        {pose === "aha" && (
          <g id="badge-aha" transform="translate(138, 8)">
            <circle cx="16" cy="16" r="16" fill="#FEF08A" filter="url(#adaGlowCyan)" />
            <text x="7" y="22" fontSize="18">💡</text>
          </g>
        )}

        {pose === "smug" && (
          <g id="badge-smug" transform="translate(142, 12)">
            <text x="0" y="20" fontSize="22" filter="url(#adaGlowCyan)">✨</text>
          </g>
        )}

        {pose === "shocked" && (
          <g id="badge-shocked" transform="translate(140, 10)">
            <circle cx="15" cy="15" r="15" fill="#FEE2E2" />
            <text x="5" y="22" fontSize="18">⚡</text>
          </g>
        )}
      </svg>
    </div>
  );
};
