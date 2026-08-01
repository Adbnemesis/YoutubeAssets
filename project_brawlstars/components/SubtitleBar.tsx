import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { popIn } from "../motion";

export interface SubtitleWord {
  text: string;
  /** Frame when this word becomes active */
  frame: number;
}

export interface SubtitleBarProps {
  /** Words in order; active word = latest word whose frame has passed */
  words: SubtitleWord[];
  /** Distance from bottom in px */
  bottom?: number;
  /** Highlight color for the active word */
  activeColor?: string;
  /** Color of the bar border */
  borderColor?: string;
  /** Optional speaker image (e.g. brawler portrait) to show on the left */
  speakerImage?: string;
}

/**
 * Reusable word-level kinetic caption bar (YouTube Shorts retention style).
 * The active word pops with spring + glow, previous words stay lit.
 */
export const SubtitleBar: React.FC<SubtitleBarProps> = ({
  words,
  bottom = 90,
  activeColor = "#FFD60A",
  borderColor = "#22C55E",
  speakerImage,
}) => {
  const frame = useCurrentFrame();

  const activeIndex = (() => {
    let idx = -1;
    for (let i = 0; i < words.length; i++) {
      if (frame >= words[i].frame) idx = i;
    }
    return idx;
  })();

  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: 40,
        right: 40,
        minHeight: 130,
        backgroundColor: "rgba(2, 6, 23, 0.92)",
        border: `4px solid ${borderColor}`,
        borderRadius: 26,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "18px 24px",
        boxShadow: `0 12px 34px rgba(0,0,0,0.8), 0 0 24px ${borderColor}44`,
        zIndex: 30,
      }}
    >
      {speakerImage && (
        <div
          style={{
            width: 90,
            height: 90,
            marginRight: 24,
            flexShrink: 0,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.7))",
          }}
        >
          <img
            src={speakerImage}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px 16px",
        }}
      >
        {words.map((w, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          const scale = isActive
            ? popIn(Math.max(0, frame - w.frame), 30, 0, { damping: 10, stiffness: 220 })
            : 1;
          return (
            <span
              key={i}
              style={{
                color: isActive ? "#FFFFFF" : isPast ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.28)",
                fontSize: isActive ? 44 : 40,
                fontWeight: 900,
                transform: `scale(${isActive ? scale * 1.06 : 1})`,
                textShadow: isActive
                  ? `0 0 14px ${activeColor}, 0 3px 6px rgba(0,0,0,0.9)`
                  : "0 3px 6px rgba(0,0,0,0.7)",
                fontFamily: "'Space Grotesk', 'Montserrat', sans-serif",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
