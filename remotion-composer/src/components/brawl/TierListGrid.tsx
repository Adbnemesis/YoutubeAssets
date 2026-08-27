import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TierGridItem {
  id: string;
  name: string;
  tier: "S" | "A" | "B" | "C" | "D" | "F";
  imageSrc: string; // Path relative to public/
  borderColor: string;
  /** Frame when this item should appear in the grid */
  appearFrame: number;
  /** If true, shows fire emoji and extra glow */
  isHot?: boolean;
}

export interface TierGridConfig {
  /** Which tiers to display (default: S, A, B, C, D) */
  visibleTiers?: ("S" | "A" | "B" | "C" | "D" | "F")[];
  /** Tier colors override */
  tierColors?: Partial<Record<string, { bg: string; text: string }>>;
}

export interface TierListGridProps {
  items: TierGridItem[];
  config?: TierGridConfig;
  /** Whether the S-tier should glow (activated when S-tier has items) */
  sTierGlow?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_TIER_COLORS: Record<string, { bg: string; text: string }> = {
  S: { bg: "#FF4D4D", text: "#FFFFFF" },
  A: { bg: "#FF9F43", text: "#FFFFFF" },
  B: { bg: "#FED330", text: "#1E293B" },
  C: { bg: "#26DE81", text: "#FFFFFF" },
  D: { bg: "#45AAF2", text: "#FFFFFF" },
  F: { bg: "#A55EEA", text: "#FFFFFF" },
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

const TierPortraitIcon: React.FC<{
  item: TierGridItem;
  frame: number;
  fps: number;
}> = ({ item, frame, fps }) => {
  const relFrame = Math.max(0, frame - item.appearFrame);

  if (frame < item.appearFrame) return null;

  // Spring entrance
  const entranceScale = spring({
    frame: relFrame,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.8 },
  });

  // Glitch flicker (frames 2-5 relative)
  let flickerOpacity = 1;
  if (relFrame >= 2 && relFrame <= 5) {
    const pattern = [1, 0.3, 0.8, 0.5];
    flickerOpacity = pattern[relFrame - 2] ?? 1;
  }

  // Hot pulse
  const hotPulse = item.isHot
    ? 1 + Math.sin(frame * 0.06) * 0.03
    : 1;

  const iconSize = 80;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        backgroundColor: `${item.borderColor}22`,
        padding: "6px 14px 6px 6px",
        borderRadius: 14,
        border: `2px solid ${item.borderColor}`,
        boxShadow: [
          `0 0 12px ${item.borderColor}55`,
          `0 4px 12px rgba(0,0,0,0.3)`,
        ].join(", "),
        transform: `scale(${entranceScale * hotPulse})`,
        opacity: flickerOpacity,
      }}
    >
      {/* Portrait image */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: 12,
          overflow: "hidden",
          border: "2px solid #FFFFFF",
          flexShrink: 0,
        }}
      >
        <Img
          src={staticFile(item.imageSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Name */}
      <span
        style={{
          color: "#FFFFFF",
          fontSize: 26,
          fontWeight: 900,
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          fontFamily: "'Space Grotesk', 'Montserrat', sans-serif",
        }}
      >
        {item.name}
      </span>

      {/* Hot fire */}
      {item.isHot && (
        <span
          style={{
            fontSize: 22,
            filter: "drop-shadow(0 0 6px rgba(255,0,0,0.8))",
          }}
        >
          🔥
        </span>
      )}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

/**
 * Reusable tier list grid that displays tiers and animated brawler icons.
 * Handles all tier row rendering, icon placement animation, and glow effects.
 */
export const TierListGrid: React.FC<TierListGridProps> = ({
  items,
  config = {},
  sTierGlow = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visibleTiers = config.visibleTiers || (["S", "A", "B", "C", "D"] as const);
  const tierColors = { ...DEFAULT_TIER_COLORS, ...config.tierColors };

  // Grid entrance spring
  const gridEntrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
  });

  return (
    <div
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        borderRadius: 24,
        border: "3px solid #334155",
        boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transform: `scale(${gridEntrance})`,
        transformOrigin: "top center",
      }}
    >
      {visibleTiers.map((tierKey) => {
        const colorInfo = tierColors[tierKey] || DEFAULT_TIER_COLORS.S;
        const tierItems = items.filter(
          (item) => item.tier === tierKey && frame >= item.appearFrame
        );

        // S-tier glow when populated
        const hasGlow = tierKey === "S" && sTierGlow && tierItems.length > 0;

        return (
          <div
            key={tierKey}
            style={{
              flex: 1,
              display: "flex",
              minHeight: 100,
              backgroundColor: "#1E293B",
              borderRadius: 16,
              overflow: "hidden",
              border: `2px solid ${hasGlow ? "#FF4D4D88" : "#334155"}`,
              position: "relative",
              boxShadow: hasGlow
                ? `0 0 20px rgba(255, 77, 77, 0.4), 0 0 40px rgba(255, 77, 77, 0.2)`
                : "none",
            }}
          >
            {/* Tier label */}
            <div
              style={{
                width: 100,
                backgroundColor: colorInfo.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                fontWeight: 900,
                color: colorInfo.text,
                boxShadow: "inset -4px 0 10px rgba(0,0,0,0.2)",
                textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                fontFamily: "'Space Grotesk', 'Montserrat', sans-serif",
                flexShrink: 0,
              }}
            >
              {tierKey}
            </div>

            {/* Tier content — brawler icons */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {tierItems.map((item) => (
                <TierPortraitIcon
                  key={item.id}
                  item={item}
                  frame={frame}
                  fps={fps}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* S-tier glow animation keyframes */}
      {sTierGlow && (
        <style>
          {`
            @keyframes sTierPulse {
              0%, 100% { box-shadow: 0 0 10px rgba(255, 77, 77, 0.3); }
              50% { box-shadow: 0 0 30px rgba(255, 77, 77, 0.7), 0 0 60px rgba(255, 77, 77, 0.4); }
            }
          `}
        </style>
      )}
    </div>
  );
};
