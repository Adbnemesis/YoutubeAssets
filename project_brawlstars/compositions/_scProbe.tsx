import React from "react";
import { Composition, AbsoluteFill, registerRoot } from "remotion";
import { ScEffect } from "../components/ScEffect";

const Probe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ScEffect brawler="gale" part="gale_006_atk_projectile" x={1080*0.55} y={500} scale={4} loop speed={1} />
      <ScEffect brawler="gale" part="gale_006_atk_hit_bullet_01" x={1080*0.75} y={700} scale={4} loop speed={1} />
    </AbsoluteFill>
  );
};

const Root: React.FC = () => (
  <Composition id="ScProbe" component={Probe} durationInFrames={30} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
