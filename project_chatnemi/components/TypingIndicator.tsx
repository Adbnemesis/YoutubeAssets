import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const TypingIndicator: React.FC<{ name: string }> = ({ name }) => {
  const frame = useCurrentFrame();

  // Bouncing dot animation logic (a simple sin wave over time)
  const getDotStyle = (offset: number) => {
    // 30 fps, a full cycle takes about 1 second (30 frames)
    const cycle = (frame + offset) % 30;
    const yOffset = interpolate(cycle, [0, 15, 30], [0, -4, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return {
      width: 8,
      height: 8,
      backgroundColor: "white",
      borderRadius: "50%",
      marginRight: 4,
      transform: `translateY(${yOffset}px)`,
    };
  };

  return (
    <div
      style={{
        padding: "12px 16px 12px 72px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", marginRight: 8, marginTop: 4 }}>
        <div style={getDotStyle(0)} />
        <div style={getDotStyle(5)} />
        <div style={getDotStyle(10)} />
      </div>
      <div
        style={{
          color: "white",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {name}{" "}
        <span style={{ color: "#72767d", fontWeight: 500 }}>
          is typing...
        </span>
      </div>
    </div>
  );
};
