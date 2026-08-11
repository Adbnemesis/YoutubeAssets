import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import { MonsterTrioEditProps } from "../props";
import { TrioIntroHook } from "./TrioIntroHook";
import { TrioBrawlerCard } from "./TrioBrawlerCard";
import { TrioClimaxFinale } from "./TrioClimaxFinale";

export const MonsterTrioPhonkTemplate: React.FC<MonsterTrioEditProps> = (props) => {
  const { intro, brawlers, climax } = props;

  return (
    <AbsoluteFill style={{ backgroundColor: "#080c14" }}>
      {/* Background Audio Phonk Track */}
      {props.audioTrack && <Audio src={props.audioTrack} />}

      {/* Timestamped Brawler Voice Lines */}
      {brawlers[0]?.voiceLine && (
        <Sequence from={76}>
          <Audio src={brawlers[0].voiceLine} volume={0.85} />
        </Sequence>
      )}

      {brawlers[1]?.voiceLine && (
        <Sequence from={204}>
          <Audio src={brawlers[1].voiceLine} volume={0.85} />
        </Sequence>
      )}

      {brawlers[2]?.voiceLine && (
        <Sequence from={332}>
          <Audio src={brawlers[2].voiceLine} volume={0.85} />
        </Sequence>
      )}

      {climax.voiceLines?.[0] && (
        <Sequence from={444}>
          <Audio src={climax.voiceLines[0]} volume={0.9} />
        </Sequence>
      )}

      {/* Scene 1: F000 - F043 (44f) -> Intro Hook */}
      <Sequence from={0} durationInFrames={44}>
        <TrioIntroHook logoText={intro.logoText} watermarkText={intro.watermarkText} />
      </Sequence>

      {/* Scene 2 & 3: F044 - F075 (32f) -> Brawler 1 Dark Strobe Transition */}
      <Sequence from={44} durationInFrames={32}>
        <AbsoluteFill style={{ backgroundColor: "#04060a" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(4,6,10,0.95) 75%)",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: F076 - F138 (63f) -> Brawler 1 Main Card (Mortis) */}
      {brawlers[0] && (
        <Sequence from={76} durationInFrames={63}>
          <TrioBrawlerCard brawler={brawlers[0]} startFrame={76} />
        </Sequence>
      )}

      {/* Scene 5: F139 - F170 (32f) -> Brawler 1 Secondary Action Pose */}
      {brawlers[0]?.secondaryPose && (
        <Sequence from={139} durationInFrames={32}>
          <TrioBrawlerCard
            brawler={{ ...brawlers[0], image: brawlers[0].secondaryPose }}
            startFrame={139}
          />
        </Sequence>
      )}

      {/* Scene 6 & 7: F171 - F203 (33f) -> Brawler 2 Dark Strobe Transition */}
      <Sequence from={171} durationInFrames={33}>
        <AbsoluteFill style={{ backgroundColor: "#04060a" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(4,6,10,0.95) 75%)",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 8: F204 - F264 (61f) -> Brawler 2 Main Card (Edgar) */}
      {brawlers[1] && (
        <Sequence from={204} durationInFrames={61}>
          <TrioBrawlerCard brawler={brawlers[1]} startFrame={204} />
        </Sequence>
      )}

      {/* Scene 9: F265 - F298 (34f) -> Brawler 2 Secondary Action Pose */}
      {brawlers[1]?.secondaryPose && (
        <Sequence from={265} durationInFrames={34}>
          <TrioBrawlerCard
            brawler={{ ...brawlers[1], image: brawlers[1].secondaryPose }}
            startFrame={265}
          />
        </Sequence>
      )}

      {/* Scene 10 & 11: F299 - F331 (33f) -> Brawler 3 Dark Strobe Transition */}
      <Sequence from={299} durationInFrames={33}>
        <AbsoluteFill style={{ backgroundColor: "#04060a" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(4,6,10,0.95) 75%)",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 12 & 13: F332 - F411 (80f) -> Brawler 3 Main Card (Crow) */}
      {brawlers[2] && (
        <Sequence from={332} durationInFrames={80}>
          <TrioBrawlerCard brawler={brawlers[2]} startFrame={332} />
        </Sequence>
      )}

      {/* Scene 14 & 15: F412 - F443 (32f) -> Brawler 3 Secondary Action Pose */}
      {brawlers[2]?.secondaryPose && (
        <Sequence from={412} durationInFrames={32}>
          <TrioBrawlerCard
            brawler={{ ...brawlers[2], image: brawlers[2].secondaryPose }}
            startFrame={412}
          />
        </Sequence>
      )}

      {/* Scene 16, 17, 18, 19: F444 - F524 (81f) -> Climax 15-Frame Rapid Cuts & Victory Stance */}
      <Sequence from={444} durationInFrames={81}>
        <TrioClimaxFinale
          titleText={climax.titleText}
          accentColor={climax.accentColor}
          rapidPanels={climax.rapidPanels}
          victoryStance={climax.victoryStance}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
