import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, spring, staticFile, Video, interpolate } from "remotion";

export const GridReveal: React.FC<{
  auraColor: string;
}> = ({ auraColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Central icon bounce
  const iconScale = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 150 },
  });

  // Exactly 0.29s between each beat = ~17.4 frames at 60fps
  const delay = Math.round(fps * 0.29);
  
  // Springs for 0 to 1 progress
  const p1Progress = spring({ fps, frame: frame - 0, config: { damping: 15, stiffness: 200 } });
  const p2Progress = spring({ fps, frame: frame - delay, config: { damping: 15, stiffness: 200 } });
  const p3Progress = spring({ fps, frame: frame - delay * 2, config: { damping: 15, stiffness: 200 } });
  const p4Progress = spring({ fps, frame: frame - delay * 3, config: { damping: 15, stiffness: 200 } });

  // Interpolate translate offsets based on progress
  const p1X = interpolate(p1Progress, [0, 1], [-100, 1]); // Top-Left (left property)
  const p2Y = interpolate(p2Progress, [0, 1], [-100, 1]); // Top-Right (top property)
  const p3Y = interpolate(p3Progress, [0, 1], [-100, 1]); // Bottom-Left (bottom property)
  const p4X = interpolate(p4Progress, [0, 1], [-100, 1]); // Bottom-Right (right property)

  const panelStyle = {
    width: "48%",
    height: "48%",
    position: "absolute" as const,
    boxShadow: `0 0 20px ${auraColor}`,
    borderRadius: "12px",
    overflow: "hidden",
    filter: `sepia(1) hue-rotate(200deg) saturate(3) brightness(0.8) drop-shadow(0 0 20px ${auraColor})`,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      {/* 4 Panel Grid in background */}
      <div style={{ ...panelStyle, top: "1%", left: `${p1X}%` }}>
        <Video src={staticFile("assets_cool_edit/clips/clip_01.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ ...panelStyle, top: `${p2Y}%`, right: "1%" }}>
        <Video src={staticFile("assets_cool_edit/clips/clip_02.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ ...panelStyle, bottom: `${p3Y}%`, left: "1%" }}>
        <Video src={staticFile("assets_cool_edit/clips/clip_03.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ ...panelStyle, bottom: "1%", right: `${p4X}%` }}>
        <Video src={staticFile("assets_cool_edit/clips/clip_04.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Central Icon */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img 
          src={staticFile("assets_cool_edit/images/kenji_base.png")} 
          style={{
            width: "60%",
            transform: `scale(${iconScale})`,
            filter: `drop-shadow(0 0 40px ${auraColor}) drop-shadow(0 0 80px ${auraColor})`,
            zIndex: 10
          }} 
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
