import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export interface PanelConfig {
  quadrant: 1 | 2 | 3 | 4; // 1=TL, 2=TR, 3=BL, 4=BR
  startOffsetSeconds: number; // e.g. 1.05s
  color: string;
}

export const DynamicGridReveal: React.FC<{
  auraColor: string;
  iconText: string;
  panels: PanelConfig[];
  forceComplete?: boolean;
}> = ({ auraColor, iconText, panels, forceComplete }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 150 },
  });

  const renderPanel = (panel: PanelConfig) => {
    const startFrame = Math.round(panel.startOffsetSeconds * fps);
    if (frame < startFrame && !forceComplete) return null;

    const progress = spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 14, stiffness: 120 },
    });

    const val = forceComplete ? 1 : interpolate(progress, [0, 1], [-100, 1]);
    
    // Aesthetic Polish: Scale bump when it lands
    const scaleBump = forceComplete ? 1 : interpolate(progress, [0, 0.8, 1], [1, 1.05, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Premium Aesthetic: inner shadow + strong outer glow
    const baseStyle = {
      width: "48%",
      height: "48%",
      position: "absolute" as const,
      boxShadow: `inset 0 0 20px rgba(0,0,0,0.8), 0 0 30px ${auraColor}`,
      border: `2px solid ${auraColor}`,
      borderRadius: "12px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "40px",
      fontWeight: "bold",
      color: "white",
      backgroundColor: panel.color,
      transform: `scale(${scaleBump})`,
    };

    if (panel.quadrant === 1) {
      return <div key="q1" style={{ ...baseStyle, top: "1%", left: val === 1 ? "1%" : `${val}%` }}>PANEL 1</div>;
    }
    if (panel.quadrant === 2) {
      return <div key="q2" style={{ ...baseStyle, right: "1%", top: val === 1 ? "1%" : `${val}%` }}>PANEL 2</div>;
    }
    if (panel.quadrant === 3) {
      return <div key="q3" style={{ ...baseStyle, left: "1%", bottom: val === 1 ? "1%" : `${val}%` }}>PANEL 3</div>;
    }
    if (panel.quadrant === 4) {
      return <div key="q4" style={{ ...baseStyle, bottom: "1%", right: val === 1 ? "1%" : `${val}%` }}>PANEL 4</div>;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      {panels.map(renderPanel)}

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{
          width: "300px",
          height: "300px",
          backgroundColor: auraColor,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "50px",
          fontWeight: "bold",
          color: "black",
          transform: `scale(${iconScale})`,
          boxShadow: `0 0 40px ${auraColor}, 0 0 80px ${auraColor}`,
          zIndex: 10
        }}>
          {iconText}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
