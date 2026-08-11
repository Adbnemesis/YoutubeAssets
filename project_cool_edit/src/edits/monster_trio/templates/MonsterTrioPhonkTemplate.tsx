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

      {/* Brawler Voice Lines */}
      {brawlers[0]?.voiceLine && (
        <Sequence from={44}>
          <Audio src={brawlers[0].voiceLine} volume={0.8} />
        </Sequence>
      )}

      {brawlers[1]?.voiceLine && (
        <Sequence from={89}>
          <Audio src={brawlers[1].voiceLine} volume={0.8} />
        </Sequence>
      )}

      {brawlers[2]?.voiceLine && (
        <Sequence from={139}>
          <Audio src={brawlers[2].voiceLine} volume={0.8} />
        </Sequence>
      )}

      {climax.voiceLines?.[0] && (
        <Sequence from={225}>
          <Audio src={climax.voiceLines[0]} volume={0.9} />
        </Sequence>
      )}

      {climax.voiceLines?.[1] && (
        <Sequence from={270}>
          <Audio src={climax.voiceLines[1]} volume={0.9} />
        </Sequence>
      )}

      {/* Phase 1: Intro Hook & Title Entrance (F000 - F044) */}
      <Sequence from={0} durationInFrames={44}>
        <TrioIntroHook titleText={intro.titleText} subText={intro.subText} />
      </Sequence>

      {/* Phase 2: Brawler 1 Spotlight - Mortis (F044 - F089) */}
      {brawlers[0] && (
        <Sequence from={44} durationInFrames={45}>
          <TrioBrawlerCard brawler={brawlers[0]} />
        </Sequence>
      )}

      {/* Phase 2: Brawler 2 Spotlight - Edgar (F089 - F139) */}
      {brawlers[1] && (
        <Sequence from={89} durationInFrames={50}>
          <TrioBrawlerCard brawler={brawlers[1]} />
        </Sequence>
      )}

      {/* Phase 2: Brawler 3 Spotlight - Crow (F139 - F189) */}
      {brawlers[2] && (
        <Sequence from={139} durationInFrames={50}>
          <TrioBrawlerCard brawler={brawlers[2]} />
        </Sequence>
      )}

      {/* Phase 2: Brawler 2 Secondary Stance (F189 - F225) */}
      {brawlers[1]?.secondaryPose && (
        <Sequence from={189} durationInFrames={36}>
          <TrioBrawlerCard
            brawler={{
              ...brawlers[1],
              image: brawlers[1].secondaryPose,
              startFrame: 189,
              endFrame: 225,
            }}
          />
        </Sequence>
      )}

      {/* Phase 3 & Phase 4: Climax Shockwave & 15-Frame Rapid Cut Finale (F225 - F525) */}
      <Sequence from={225} durationInFrames={300}>
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
