import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type AdaPose =
  | "neutral"
  | "explaining"
  | "pointing"
  | "thinking"
  | "aha"
  | "shocked"
  | "smug"
  | "coding";

export interface AdaMascotProps {
  pose?: AdaPose;
  scale?: number;
  flipX?: boolean;
  hairColor?: string;
  outfit?: "school-tie" | "developer-hoodie";
  showNemiShoulder?: boolean;
  showHeadphones?: boolean;
  style?: React.CSSProperties;
}

export const AdaMascot: React.FC<AdaMascotProps> = ({
  pose = "explaining",
  scale = 1.0,
  flipX = false,
  hairColor = "#2A2538", // Deep charcoal-indigo anime hair
  outfit = "school-tie",
  showNemiShoulder = true,
  showHeadphones = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps = 30 } = useVideoConfig();

  // Subtle breathing float animation
  const floatY = Math.sin((frame / fps) * Math.PI * 2) * 4;
  const headTilt =
    pose === "thinking"
      ? 6
      : pose === "aha"
      ? -4
      : pose === "smug"
      ? -4
      : pose === "shocked"
      ? 2
      : 0;

  // Eye blink animation cycle (every 90 frames)
  const blinkCycle = frame % 90;
  const isBlinking = blinkCycle > 84 && blinkCycle < 88;

  // Arm gesturing bounce
  const armBob =
    pose === "pointing" || pose === "explaining"
      ? Math.sin((frame / fps) * Math.PI * 3) * 2.5
      : 0;

  return (
    <div
      style={{
        transform: `scale(${scale}) scaleX(${flipX ? -1 : 1}) translateY(${floatY}px)`,
        transformOrigin: "bottom center",
        width: "280px",
        height: "360px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.25))",
        ...style,
      }}
    >
      <svg
        width="280"
        height="360"
        viewBox="0 0 280 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `rotate(${headTilt}deg)`,
          transformOrigin: "50% 80%",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Skin Gradient */}
          <linearGradient id="adaSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2EC" />
            <stop offset="100%" stopColor="#FDE2D6" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="adaHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hairColor} />
            <stop offset="60%" stopColor="#1E192A" />
            <stop offset="100%" stopColor="#3B2D54" />
          </linearGradient>

          {/* Hair Shine Highlight */}
          <linearGradient id="adaHairShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </linearGradient>

          {/* Shirt Shading */}
          <linearGradient id="adaShirt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Striped Tie Gradient */}
          <linearGradient id="adaTie" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 1. BACK HAIR (Shoulder Layers) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <g id="back-hair">
          {/* Main hair flow behind shoulders */}
          <path
            d="M50 140 C35 190 40 260 65 300 C80 310 90 280 85 240 C80 200 85 160 90 140 Z"
            fill="url(#adaHair)"
          />
          <path
            d="M230 140 C245 190 240 260 215 300 C200 310 190 280 195 240 C200 200 195 160 190 140 Z"
            fill="url(#adaHair)"
          />
          {/* Back center hair drape */}
          <path
            d="M75 140 C65 200 80 280 140 290 C200 280 215 200 205 140 Z"
            fill="#1E192A"
          />
        </g>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 2. BODY & OUTFIT (School Shirt + Tie or Hoodie) */}
        {/* ══════════════════════════════════════════════════════════ */}
        <g id="body-outfit">
          {outfit === "school-tie" ? (
            <>
              {/* White Collared School Shirt */}
              <path
                d="M60 240 C60 210 95 198 140 198 C185 198 220 210 220 240 L235 360 L45 360 Z"
                fill="url(#adaShirt)"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />

              {/* Collar Left */}
              <path
                d="M105 196 L136 232 L110 236 L86 204 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.5"
              />
              {/* Collar Right */}
              <path
                d="M175 196 L144 232 L170 236 L194 204 Z"
                fill="#FFFFFF"
                stroke="#94A3B8"
                strokeWidth="1.5"
              />

              {/* Exposed Neck */}
              <path
                d="M118 180 C118 206 162 206 162 180 Z"
                fill="url(#adaSkin)"
              />

              {/* Tie Knot */}
              <polygon points="132,230 148,230 144,248 136,248" fill="#1E293B" />
              {/* Main Tie Body with Stripes */}
              <path
                d="M136 248 L144 248 L150 330 L140 344 L130 330 Z"
                fill="url(#adaTie)"
              />
              {/* Tie Diagonal Stripes */}
              <line x1="135" y1="262" x2="146" y2="256" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="134" y1="282" x2="147" y2="276" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="133" y1="302" x2="148" y2="296" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="132" y1="322" x2="149" y2="316" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Developer Tech Hoodie */}
              <path
                d="M60 240 C60 205 95 195 140 195 C185 195 220 205 220 240 L235 360 L45 360 Z"
                fill="#18181B"
              />
              {/* Drawstrings */}
              <path d="M120 215 L115 270" stroke="#FFD166" strokeWidth="3" strokeLinecap="round" />
              <circle cx="115" cy="273" r="3.5" fill="#FFD166" />
              <path d="M160 215 L165 270" stroke="#FFD166" strokeWidth="3" strokeLinecap="round" />
              <circle cx="165" cy="273" r="3.5" fill="#FFD166" />
            </>
          )}
        </g>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 3. NEMI ON SHOULDER COMPANION */}
        {/* ══════════════════════════════════════════════════════════ */}
        {showNemiShoulder && (
          <g id="nemi-shoulder-companion" transform="translate(182, 175)">
            {/* Nemi Body */}
            <path d="M15 45 C15 35 28 32 40 32 C52 32 65 35 65 45 L68 70 L12 70 Z" fill="#18181B" />
            {/* Ears */}
            <circle cx="18" cy="24" r="10" fill="#2B2D42" />
            <circle cx="18" cy="24" r="6" fill="#FFCDB2" />
            <circle cx="62" cy="24" r="10" fill="#2B2D42" />
            <circle cx="62" cy="24" r="6" fill="#FFCDB2" />
            {/* Head Base */}
            <ellipse cx="40" cy="24" rx="22" ry="20" fill="#2B2D42" />
            {/* Face Peach Mask */}
            <path
              d="M24 20 C24 12 32 12 40 16 C48 12 56 12 56 20 C56 32 48 38 40 38 C32 38 24 32 24 20 Z"
              fill="#FFCDB2"
            />
            {/* Glasses */}
            <circle cx="32" cy="22" r="8" stroke="#FFD166" strokeWidth="2.5" fill="rgba(6,182,212,0.2)" />
            <circle cx="48" cy="22" r="8" stroke="#FFD166" strokeWidth="2.5" fill="rgba(6,182,212,0.2)" />
            <line x1="40" y1="22" x2="40" y2="22" stroke="#FFD166" strokeWidth="2.5" />
            {/* Eyes */}
            <circle cx="32" cy="22" r="3" fill="#111827" />
            <circle cx="31" cy="21" r="1" fill="#FFFFFF" />
            <circle cx="48" cy="22" r="3" fill="#111827" />
            <circle cx="47" cy="21" r="1" fill="#FFFFFF" />
            {/* Cute Smile */}
            <path d="M36 32 Q40 35 44 32" stroke="#4A2810" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Hand with Stylus */}
            <circle cx="14" cy="52" r="4" fill="#FFCDB2" />
            <line x1="12" y1="58" x2="16" y2="46" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 4. HEADPHONES AROUND NECK */}
        {/* ══════════════════════════════════════════════════════════ */}
        {showHeadphones && (
          <g id="neck-headphones">
            {/* Headphone band around neck */}
            <path
              d="M95 212 C95 238 185 238 185 212"
              stroke="#1E1B4B"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Earcup */}
            <g transform="translate(80, 185) rotate(-18)">
              <rect x="0" y="0" width="22" height="42" rx="11" fill="#1E293B" stroke="#475569" strokeWidth="2" />
              <circle cx="11" cy="21" r="5" fill="#38BDF8" />
            </g>
            {/* Right Earcup */}
            <g transform="translate(178, 180) rotate(18)">
              <rect x="0" y="0" width="22" height="42" rx="11" fill="#1E293B" stroke="#475569" strokeWidth="2" />
              <circle cx="11" cy="21" r="5" fill="#38BDF8" />
            </g>
          </g>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 5. HEAD & FACIAL FEATURES */}
        {/* ══════════════════════════════════════════════════════════ */}
        <g id="head-structure">
          {/* Head Shape */}
          <ellipse cx="140" cy="130" rx="66" ry="60" fill="url(#adaSkin)" />

          {/* Cute Anime Pink Blush */}
          <ellipse cx="98" cy="148" rx="13" ry="7" fill="#FB7185" opacity="0.4" />
          <ellipse cx="182" cy="148" rx="13" ry="7" fill="#FB7185" opacity="0.4" />
          {/* Soft Manga Blush Lines */}
          <line x1="94" y1="146" x2="102" y2="151" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
          <line x1="178" y1="146" x2="186" y2="151" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />

          {/* ─── EYES & EYEBROWS ─── */}
          {pose === "shocked" ? (
            /* Shocked Wide Eyes */
            <>
              {/* Eyebrows */}
              <path d="M100 96 Q112 88 124 98" stroke="#3B2D54" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M156 98 Q168 88 180 96" stroke="#3B2D54" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* Eyes */}
              <circle cx="112" cy="126" r="16" fill="#18181B" />
              <circle cx="112" cy="126" r="12" fill="#5B21B6" />
              <circle cx="108" cy="121" r="5.5" fill="#FFFFFF" />
              <circle cx="117" cy="130" r="3" fill="#FFFFFF" />

              <circle cx="168" cy="126" r="16" fill="#18181B" />
              <circle cx="168" cy="126" r="12" fill="#5B21B6" />
              <circle cx="164" cy="121" r="5.5" fill="#FFFFFF" />
              <circle cx="173" cy="130" r="3" fill="#FFFFFF" />
            </>
          ) : pose === "smug" ? (
            /* Smug Wink */
            <>
              {/* Left Eyebrow */}
              <path d="M100 102 Q112 98 124 104" stroke="#3B2D54" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Right Eyebrow arched */}
              <path d="M156 98 Q168 90 180 98" stroke="#3B2D54" strokeWidth="4" strokeLinecap="round" fill="none" />

              {/* Left Eye: Wink */}
              <path d="M98 128 Q112 138 126 126" stroke="#18181B" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M122 124 L130 119" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />

              {/* Right Eye: Big Anime Eye */}
              <ellipse cx="168" cy="126" rx="14" ry="17" fill="#18181B" />
              <ellipse cx="168" cy="129" rx="11" ry="13" fill="#5B21B6" />
              <ellipse cx="168" cy="133" rx="9" ry="8" fill="#38BDF8" />
              <circle cx="163" cy="120" r="5.5" fill="#FFFFFF" />
              <circle cx="173" cy="132" r="3" fill="#FFFFFF" />
              {/* Eyelash */}
              <path d="M154 114 Q168 108 182 116" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M180 113 L186 108" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : isBlinking ? (
            /* Blinking */
            <>
              <path d="M98 126 Q112 135 126 126" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M154 126 Q168 135 182 126" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            /* Standard Anime Eyes */
            <>
              {/* Eyebrows */}
              <path d="M100 102 Q112 94 124 102" stroke="#3B2D54" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M156 102 Q168 94 180 102" stroke="#3B2D54" strokeWidth="3.5" strokeLinecap="round" fill="none" />

              {/* Left Eye */}
              <ellipse cx="112" cy="126" rx="14" ry="17" fill="#18181B" />
              <ellipse cx="112" cy="129" rx="11" ry="13" fill="#5B21B6" />
              <ellipse cx="112" cy="133" rx="9" ry="8" fill="#38BDF8" />
              <circle cx="107" cy="120" r="5.5" fill="#FFFFFF" />
              <circle cx="117" cy="132" r="3" fill="#FFFFFF" />
              {/* Eyelash */}
              <path d="M98 114 Q112 108 126 116" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M100 113 L94 108" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />

              {/* Right Eye */}
              <ellipse cx="168" cy="126" rx="14" ry="17" fill="#18181B" />
              <ellipse cx="168" cy="129" rx="11" ry="13" fill="#5B21B6" />
              <ellipse cx="168" cy="133" rx="9" ry="8" fill="#38BDF8" />
              <circle cx="163" cy="120" r="5.5" fill="#FFFFFF" />
              <circle cx="173" cy="132" r="3" fill="#FFFFFF" />
              {/* Eyelash */}
              <path d="M154 114 Q168 108 182 116" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M180 113 L186 108" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {/* Cute Button Nose */}
          <ellipse cx="140" cy="140" rx="2" ry="1.5" fill="#E5989B" />

          {/* ─── MOUTH EXPRESSIONS ─── */}
          {pose === "aha" ? (
            /* Open Cheerful Smile */
            <path
              d="M128 152 Q140 166 152 152 C152 162 128 162 128 152 Z"
              fill="#F43F5E"
              stroke="#881337"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          ) : pose === "shocked" ? (
            /* O-Mouth */
            <ellipse cx="140" cy="156" rx="7" ry="9" fill="#881337" stroke="#F43F5E" strokeWidth="2" />
          ) : pose === "smug" ? (
            /* Confident Side Smirk */
            <path d="M130 154 Q142 160 154 150" stroke="#881337" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          ) : pose === "thinking" ? (
            /* Puzzled Wavy Mouth */
            <path d="M130 154 Q136 158 141 154 Q146 158 150 154" stroke="#881337" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : (
            /* Gentle Sweet Smile */
            <path d="M130 152 Q140 160 150 152" stroke="#881337" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          )}

          {/* ─── FRONT HAIR BANGS & ANIME STRANDS ─── */}
          {/* Main Top Hair Dome */}
          <path
            d="M75 110 C80 60 120 50 140 50 C160 50 200 60 205 110 C195 95 180 90 170 96 C150 102 145 82 135 84 C115 88 100 105 75 110 Z"
            fill="url(#adaHair)"
          />
          {/* Left Framing Bangs */}
          <path
            d="M78 105 C72 130 75 165 85 185 C90 185 92 172 88 148 C85 130 88 116 100 102 Z"
            fill="url(#adaHair)"
          />
          {/* Right Framing Bangs */}
          <path
            d="M202 105 C208 130 205 165 195 185 C190 185 188 172 192 148 C195 130 192 116 180 102 Z"
            fill="url(#adaHair)"
          />
          {/* Center Cute Ahoge / Forehead Strands */}
          <path
            d="M136 50 C132 30 144 20 148 18 C144 28 140 38 142 50 Z"
            fill="url(#adaHair)"
          />
          {/* Hair Gloss Highlight Arc */}
          <path
            d="M105 75 Q140 64 175 75"
            stroke="#C4B5FD"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
        </g>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 6. ARMS & PROPS (According to Pose) */}
        {/* ══════════════════════════════════════════════════════════ */}
        {pose === "pointing" && (
          <g id="pointing-arm" transform={`translate(0, ${armBob})`}>
            <path
              d="M210 245 L255 195 L278 165"
              stroke="#FFFFFF"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M210 245 L255 195 L278 165"
              stroke="#CBD5E1"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.3"
            />
            {/* Hand & Pointing Finger */}
            <circle cx="278" cy="165" r="9" fill="url(#adaSkin)" />
            <path d="M278 165 L292 148" stroke="#FDE2D6" strokeWidth="7" strokeLinecap="round" />
            <circle cx="295" cy="144" r="4" fill="#FFD166" />
          </g>
        )}

        {pose === "explaining" && (
          <g id="explaining-arm" transform={`translate(0, ${armBob})`}>
            <path
              d="M210 250 L250 240 L270 230"
              stroke="#FFFFFF"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="270" cy="230" r="9" fill="url(#adaSkin)" />
            <path d="M270 230 L282 222" stroke="#FDE2D6" strokeWidth="5.5" strokeLinecap="round" />
          </g>
        )}

        {pose === "thinking" && (
          <g id="thinking-arm">
            <path
              d="M210 260 L198 200 L165 175"
              stroke="#FFFFFF"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="162" cy="172" r="9" fill="url(#adaSkin)" />
          </g>
        )}

        {pose === "coding" && (
          <g id="coding-laptop" transform="translate(85, 240)">
            <rect x="0" y="0" width="110" height="70" rx="10" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
            <line x1="16" y1="16" x2="55" y2="16" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="62" y1="16" x2="94" y2="16" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="16" y1="30" x2="75" y2="30" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="16" y1="44" x2="48" y2="44" stroke="#FFD166" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="54" y1="44" x2="90" y2="44" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="20" cy="68" r="8" fill="url(#adaSkin)" />
            <circle cx="90" cy="68" r="8" fill="url(#adaSkin)" />
          </g>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* 7. REACTION BADGES */}
        {/* ══════════════════════════════════════════════════════════ */}
        {pose === "aha" && (
          <g id="badge-aha" transform="translate(195, 25)">
            <circle cx="20" cy="20" r="20" fill="#FEF08A" />
            <text x="9" y="27" fontSize="22">💡</text>
          </g>
        )}

        {pose === "smug" && (
          <g id="badge-smug" transform="translate(195, 30)">
            <text x="0" y="24" fontSize="28">✨</text>
          </g>
        )}

        {pose === "shocked" && (
          <g id="badge-shocked" transform="translate(195, 25)">
            <circle cx="18" cy="18" r="18" fill="#FEE2E2" />
            <text x="6" y="25" fontSize="22">⚡</text>
          </g>
        )}
      </svg>
    </div>
  );
};
