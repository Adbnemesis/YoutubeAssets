import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export interface MemeOverlayProps {
  memeType: string;
  text1?: string;
  text2?: string;
}

export const MemeOverlay: React.FC<MemeOverlayProps> = ({ memeType, text1, text2 }) => {
  if (memeType === "drake") {
    return (
      <AbsoluteFill style={{ backgroundColor: "white" }}>
        <Img src={staticFile("memes/drake_template.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", right: "2%", top: "5%", width: "45%", height: "40%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: "bold", textAlign: "center", color: "black", padding: 20 }}>
          {text1}
        </div>
        <div style={{ position: "absolute", right: "2%", bottom: "5%", width: "45%", height: "40%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: "bold", textAlign: "center", color: "black", padding: 20 }}>
          {text2}
        </div>
      </AbsoluteFill>
    );
  }

  if (memeType === "choice") {
    return (
      <AbsoluteFill style={{ backgroundColor: "white" }}>
        <Img src={staticFile("memes/choice_template.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", left: "10%", top: "15%", width: "35%", height: "30%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, fontWeight: "bold", textAlign: "center", color: "white", textShadow: "2px 2px 0 #000", transform: "rotate(-10deg)" }}>
          {text1}
        </div>
        <div style={{ position: "absolute", left: "55%", top: "15%", width: "35%", height: "30%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, fontWeight: "bold", textAlign: "center", color: "white", textShadow: "2px 2px 0 #000", transform: "rotate(10deg)" }}>
          {text2}
        </div>
      </AbsoluteFill>
    );
  }

  if (memeType === "stepped_shit") {
    return (
      <AbsoluteFill style={{ backgroundColor: "white" }}>
        <Img src={staticFile("memes/stepped_shit_template.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", left: "30%", bottom: "10%", width: "40%", height: "30%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: "bold", textAlign: "center", color: "black", transform: "rotate(15deg)" }}>
          {text1 || text2}
        </div>
      </AbsoluteFill>
    );
  }
  
  if (memeType === "spongebob_fire") {
    return (
      <AbsoluteFill style={{ backgroundColor: "white" }}>
        <Img src={staticFile("memes/spongebob_fire_paper_template.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", right: "20%", top: "40%", width: "30%", height: "30%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: "bold", textAlign: "center", color: "black", transform: "rotate(5deg)" }}>
          {text1 || text2}
        </div>
      </AbsoluteFill>
    );
  }

  const validSvgMemes = ["savage_roast", "plot_twist", "emotional_damage", "privacy_shield"];
  const finalMemeType = validSvgMemes.includes(memeType) ? memeType : "savage_roast";

  // Fallback for SVG memes or unknown
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Img src={staticFile(`memes/${finalMemeType}.svg`)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </AbsoluteFill>
  );
};
