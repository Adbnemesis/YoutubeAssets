import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, random, Img, staticFile } from "remotion";

export interface PanelConfig {
  quadrant: 1 | 2 | 3 | 4; // 1=TL, 2=TR, 3=BL, 4=BR
  startOffsetSeconds: number; // e.g. 1.05s
  color: string;
  imageSrc?: string;
}

export const DynamicGridReveal: React.FC<{
  auraColor: string;
  iconSrc: string;
  panels: PanelConfig[];
  forceComplete?: boolean;
}> = ({ auraColor, iconSrc, panels, forceComplete }) => {
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

    // 3D Rotation for dynamic entry
    const rotateY = forceComplete ? 0 : interpolate(progress, [0, 1], [45, 0]);
    const rotateX = forceComplete ? 0 : interpolate(progress, [0, 1], [-20, 0]);

    // Premium Aesthetic: strong outer glow + dynamic drop shadow
    const baseStyle = {
      width: "48%",
      height: "48%",
      position: "absolute" as const,
      boxShadow: forceComplete ? `0 0 30px ${auraColor}` : `0 20px 40px rgba(0,0,0,0.8), 0 0 30px ${auraColor}`,
      border: `2px solid ${auraColor}`,
      borderRadius: "12px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "40px",
      fontWeight: "bold",
      color: "white",
      backgroundColor: panel.color,
      transform: `scale(${scaleBump}) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      overflow: "hidden", // So image doesn't break border radius
    };

    const InnerContent = panel.imageSrc ? (
      <Img src={staticFile(panel.imageSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    ) : (
      <div>PANEL {panel.quadrant}</div>
    );

    if (panel.quadrant === 1) {
      return <div key="q1" style={{ ...baseStyle, top: "1%", left: val === 1 ? "1%" : `${val}%` }}>{InnerContent}</div>;
    }
    if (panel.quadrant === 2) {
      return <div key="q2" style={{ ...baseStyle, right: "1%", top: val === 1 ? "1%" : `${val}%` }}>{InnerContent}</div>;
    }
    if (panel.quadrant === 3) {
      return <div key="q3" style={{ ...baseStyle, left: "1%", bottom: val === 1 ? "1%" : `${val}%` }}>{InnerContent}</div>;
    }
    if (panel.quadrant === 4) {
      return <div key="q4" style={{ ...baseStyle, bottom: "1%", right: val === 1 ? "1%" : `${val}%` }}>{InnerContent}</div>;
    }
  };

  let wrapperTransform = "none";
  if (!forceComplete) {
    // Sort panels by offset to find the 2nd, 3rd, 4th
    const sortedOffsets = [...panels].map(p => p.startOffsetSeconds).sort((a, b) => a - b);
    
    // Ignore the 1st panel (index 0). Only shake for index 1, 2, 3.
    const shakeHitFrames = sortedOffsets.slice(1).map(offset => Math.round(offset * fps));
    
    for (const hitFrame of shakeHitFrames) {
      const shakeProgress = frame - hitFrame;
      if (shakeProgress >= 0 && shakeProgress < 10) {
        // A little violent shake (20px instead of 10px)
        const shakeX = (random(`shakeX-${frame}-${hitFrame}`) - 0.5) * 20;
        const shakeY = (random(`shakeY-${frame}-${hitFrame}`) - 0.5) * 20;
        wrapperTransform = `translate(${shakeX}px, ${shakeY}px)`;
        break; // Only apply one shake at a time
      }
    }
  }

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at center, ${auraColor}44 0%, #050505 70%)`, transform: wrapperTransform }}>
      {panels.map(renderPanel)}

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{
          width: "300px",
          height: "300px",
          backgroundColor: "transparent",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${iconScale})`,
          boxShadow: `0 0 40px ${auraColor}, 0 0 80px ${auraColor}`,
          zIndex: 10,
        }}>
          {iconSrc ? (
            <Img src={staticFile(iconSrc)} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.8))" }} />
          ) : (
            <div>ICON</div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
