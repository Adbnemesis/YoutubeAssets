import React from "react";
import { Composition, registerRoot } from "remotion";
import { EdgarCharacter } from "./edgar/EdgarCharacter";
import { ShellyCharacter } from "./shelly/ShellyCharacter";
import { KenjiCharacter } from "./kenji/KenjiCharacter";
import { MelodieCharacter } from "./melodie/MelodieCharacter";
import { FrankCharacter } from "./frank/FrankCharacter";
import { BrawlStarsRosterShowcase } from "./BrawlStarsRosterShowcase";
import { BrawlerExpressionsShowcase } from "./BrawlerExpressionsShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BrawlerExpressionsShowcase"
        component={BrawlerExpressionsShowcase}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EdgarShowcase"
        component={() => (
          <div style={{ backgroundColor: "#0F172A", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <EdgarCharacter height={500} frame={10} pose="idle" />
          </div>
        )}
        durationInFrames={150}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="ShellyShowcase"
        component={() => (
          <div style={{ backgroundColor: "#0F172A", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ShellyCharacter height={500} frame={10} pose="idle" />
          </div>
        )}
        durationInFrames={150}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="KenjiShowcase"
        component={() => (
          <div style={{ backgroundColor: "#0F172A", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <KenjiCharacter height={500} frame={10} pose="idle" />
          </div>
        )}
        durationInFrames={150}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="MelodieShowcase"
        component={() => (
          <div style={{ backgroundColor: "#0F172A", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <MelodieCharacter height={500} frame={10} pose="idle" />
          </div>
        )}
        durationInFrames={150}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="FrankShowcase"
        component={() => (
          <div style={{ backgroundColor: "#0F172A", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <FrankCharacter height={500} frame={10} pose="idle" />
          </div>
        )}
        durationInFrames={150}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="BrawlStarsRoster"
        component={BrawlStarsRosterShowcase}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
