import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, staticFile } from "remotion";

export const GlitchTransition: React.FC = () => {
  const frame = useCurrentFrame();

  // Rapidly cycle colors and scales every frame
  const colors = ["#ff00ff", "#00ffff", "#ffff00", "#ff0000"];
  const color = colors[frame % colors.length];
  
  const scales = [1.5, 2.0, 1.2, 3.0, 1.8];
  const scale = scales[frame % scales.length];
  
  const translations = ["translate(-20px, 10px)", "translate(30px, -20px)", "translate(-10px, -30px)", "translate(20px, 20px)"];
  const transform = translations[frame % translations.length];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(2px) contrast(2)" }}>
        <Img 
          src={staticFile("assets_cool_edit/images/kenji_base.png")}
          style={{
            width: "80%",
            position: "absolute",
            top: "10%",
            left: "10%",
            transform: `scale(${scale}) ${transform}`,
            filter: `drop-shadow(10px 10px 0px ${color}) hue-rotate(${frame * 40}deg)`,
            opacity: 0.8,
            mixBlendMode: "screen"
          }} 
        />
        <Img 
          src={staticFile("assets_cool_edit/images/kenji_base.png")}
          style={{
            width: "100%",
            position: "absolute",
            top: "0%",
            left: "0%",
            transform: `scale(${scale * 1.2}) ${transform}`,
            filter: `drop-shadow(-10px -10px 0px ${colors[(frame+1) % colors.length]})`,
            opacity: 0.5,
            mixBlendMode: "difference"
          }} 
        />
      </AbsoluteFill>
      {/* Rapid flashes */}
      <AbsoluteFill style={{ backgroundColor: frame % 3 === 0 ? "white" : "transparent", opacity: 0.7 }} />
    </AbsoluteFill>
  );
};
