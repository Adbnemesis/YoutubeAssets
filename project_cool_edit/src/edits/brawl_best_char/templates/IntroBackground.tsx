import React from "react";
import { useCurrentFrame, staticFile, Img } from "remotion";

export const IntroBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Rotation angle for anime sunburst radial beams
  const rotation = frame * 0.7;
  const bgPos = (frame * 14) % 100;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#06070e",
        zIndex: 0,
      }}
    >
      {/* Background Brawler Collage Layer (Dimmed & Blurred) */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 10,
          opacity: 0.18,
          filter: "blur(8px) grayscale(60%)",
          transform: "scale(1.1)",
        }}
      >
        <Img src={staticFile("images/mortis/mortis_panel_1.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <Img src={staticFile("images/edgar/edgar_panel_1.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <Img src={staticFile("images/crow/crow_panel_1.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <Img src={staticFile("images/kenji/kenji_panel_15.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Rotating Anime Sunburst Radial Light Beams */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 1600,
          height: 1600,
          marginTop: -800,
          marginLeft: -800,
          backgroundImage:
            "conic-gradient(from 0deg, rgba(124, 58, 237, 0.25) 0deg 15deg, transparent 15deg 30deg, rgba(236, 72, 153, 0.25) 30deg 45deg, transparent 45deg 60deg)",
          transform: `rotate(${rotation}deg)`,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Moving Speed Lines Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 3px, transparent 3px, transparent 16px)",
          backgroundPosition: `${bgPos}px ${bgPos}px`,
          pointerEvents: "none",
        }}
      />

      {/* Pulsating Center Glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.6) 0%, rgba(236, 72, 153, 0.3) 45%, transparent 75%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
