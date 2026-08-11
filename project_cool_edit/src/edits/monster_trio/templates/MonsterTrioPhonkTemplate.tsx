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

      {/* Phase 1: Intro Hook & Title Entrance (F000 - F044) */}
      <Sequence from={0} durationInFrames={44}>
        <TrioIntroHook titleText={intro.titleText} subText={intro.subText} />
      </Sequence>

      {/* Phase 2 — Character 1 (Mortis): F044 - F171 */}
      {/* F044 - F076: Dark Strobe Flash */}
      <Sequence from={44} durationInFrames={32}>
        <AbsoluteFill style={{ backgroundColor: "#04060a" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(4,6,10,0.95) 75%)",
            }}
          />
        </AbsoluteFill>
      </Sequence>
      {/* F076 - F139: Main Card Spotlight */}
      {brawlers[0] && (
        <Sequence from={76} durationInFrames={63}>
          <TrioBrawlerCard brawler={brawlers[0]} startFrame={76} />
        </Sequence>
      )}
      {/* F139 - F171: Secondary Action Stance */}
      {brawlers[0]?.secondaryPose && (
        <Sequence from={139} durationInFrames={32}>
          <TrioBrawlerCard
            brawler={{ ...brawlers[0], image: brawlers[0].secondaryPose }}
            startFrame={139}
          />
        </Sequence>
      )}

      {/* Phase 2 — Character 2 (Edgar): F171 - F299 */}
      {/* F171 - F204: Dark Strobe Flash */}
      <Sequence from={171} durationInFrames={33}>
        <AbsoluteFill style={{ backgroundColor: "#04060a" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle, rgba(239,68,68,0.25) 0%, rgba(4,6,10,0.95) 75%)",
            }}
          />
        </AbsoluteFill>
      </Sequence>
      {/* F204 - F267: Main Card Spotlight */}
      {brawlers[1] && (
        <Sequence from={204} durationInFrames={63}>
          <TrioBrawlerCard brawler={brawlers[1]} startFrame={204} />
        </Sequence>
      )}
      {/* F267 - F299: Secondary Action Stance */}
      {brawlers[1]?.secondaryPose && (
        <Sequence from={267} durationInFrames={32}>
          <TrioBrawlerCard
            brawler={{ ...brawlers[1], image: brawlers[1].secondaryPose }}
            startFrame={267}
          />
        </Sequence>
      )}

      {/* Phase 2 — Character 3 (Crow): F299 - F444 */}
      {/* F299 - F332: Dark Strobe Flash */}
      <Sequence from={299} durationInFrames={33}>
        <AbsoluteFill style={{ backgroundColor: "#04060a" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(4,6,10,0.95) 75%)",
            }}
          />
        </AbsoluteFill>
      </Sequence>
      {/* F332 - F412: Main Card Spotlight */}
      {brawlers[2] && (
        <Sequence from={332} durationInFrames={80}>
          <TrioBrawlerCard brawler={brawlers[2]} startFrame={332} />
        </Sequence>
      )}
      {/* F412 - F444: Secondary Action Stance */}
      {brawlers[2]?.secondaryPose && (
        <Sequence from={412} durationInFrames={32}>
          <TrioBrawlerCard
            brawler={{ ...brawlers[2], image: brawlers[2].secondaryPose }}
            startFrame={412}
          />
        </Sequence>
      )}

      {/* Phase 3 & 4: Climax 15-Frame Rapid Cuts & Victory Stance (F444 - F525) */}
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
