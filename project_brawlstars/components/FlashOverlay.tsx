import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { flashCurve } from "../beatGrid";
import { FlashEvent } from "../types";

export interface FlashOverlayProps {
  events: FlashEvent[];
}

/** Stack of screen flashes fired from an event list (usually one per drop beat). */
export const FlashOverlay: React.FC<FlashOverlayProps> = ({ events }) => {
  const frame = useCurrentFrame();

  return (
    <>
      {events.map((ev, i) => {
        const opacity = flashCurve(
          frame,
          ev.frame,
          ev.maxOpacity ?? 0.7,
          ev.duration ?? 4
        );
        if (opacity <= 0) return null;
        return (
          <AbsoluteFill
            key={i}
            style={{
              backgroundColor: ev.color ?? "#FFFFFF",
              opacity,
              pointerEvents: "none",
              zIndex: 90,
            }}
          />
        );
      })}
    </>
  );
};
