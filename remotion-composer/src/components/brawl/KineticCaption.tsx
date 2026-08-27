import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface KineticCaptionProps {
  text: string;
  speaker: "Edgar" | "Kenji";
  speakerColor: string;
  startFrame: number;
  durationFrames: number;
}

/**
 * Word-by-word kinetic animated caption bar for high viewer retention.
 */
export const KineticCaption: React.FC<KineticCaptionProps> = ({
  text,
  speaker,
  speakerColor,
  startFrame,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame >= durationFrames) return null;

  const words = text.split(" ");
  // Calculate frames per word
  const framesPerWord = Math.max(3, Math.floor(durationFrames / words.length));
  const activeWordIndex = Math.min(
    words.length - 1,
    Math.floor(relFrame / framesPerWord)
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 40,
        right: 40,
        minHeight: 120,
        backgroundColor: "rgba(2, 6, 23, 0.94)",
        border: `4px solid ${speakerColor}`,
        borderRadius: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 28px",
        boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${speakerColor}44`,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 12px",
        }}
      >
        {words.map((word, idx) => {
          const isPast = idx < activeWordIndex;
          const isActive = idx === activeWordIndex;

          const wordSpring = isActive
            ? spring({
                frame: Math.max(0, relFrame - idx * framesPerWord),
                fps,
                config: { damping: 10, stiffness: 200 },
              })
            : 1;

          return (
            <span
              key={idx}
              style={{
                color: isActive ? "#FFFFFF" : isPast ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                fontSize: isActive ? 38 : 34,
                fontWeight: isActive ? 900 : 700,
                transform: `scale(${isActive ? wordSpring * 1.08 : 1})`,
                textShadow: isActive
                  ? `0 0 12px ${speakerColor}, 0 2px 4px rgba(0,0,0,0.8)`
                  : "0 2px 4px rgba(0,0,0,0.6)",
                transition: "color 0.1s ease, font-size 0.1s ease",
                fontFamily: "'Space Grotesk', 'Montserrat', sans-serif",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
