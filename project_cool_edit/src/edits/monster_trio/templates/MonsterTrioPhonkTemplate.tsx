import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import { MonsterTrioEditProps } from "../props";
import { TrioBrawlerCard } from "./TrioBrawlerCard";
import { TrioClimaxFinale } from "./TrioClimaxFinale";
import { PhonkTransition } from "./PhonkTransition";

export const MonsterTrioPhonkTemplate: React.FC<MonsterTrioEditProps> = (props) => {
  const { brawlers, climax } = props;

  return (
    <AbsoluteFill style={{ backgroundColor: "#080c14" }}>
      {/* Background Audio Phonk Track */}
      {props.audioTrack && <Audio src={props.audioTrack} />}

      {/* Brawler Voice Lines */}
      {brawlers[0]?.voiceLine && (
        <Sequence from={44}>
          <Audio src={brawlers[0].voiceLine} volume={0.85} />
        </Sequence>
      )}

      {brawlers[1]?.voiceLine && (
        <Sequence from={171}>
          <Audio src={brawlers[1].voiceLine} volume={0.85} />
        </Sequence>
      )}

      {brawlers[2]?.voiceLine && (
        <Sequence from={299}>
          <Audio src={brawlers[2].voiceLine} volume={0.85} />
        </Sequence>
      )}

      {climax.voiceLines?.[0] && (
        <Sequence from={395}>
          <Audio src={climax.voiceLines[0]} volume={0.9} />
        </Sequence>
      )}

      {/* Brawler 1 (Mortis): F000 - F139 */}
      {/* 1a. Intro Image Shake (F000 - F044) — rises from bottom + violent shake, chromatic cut */}
      {brawlers[0] && (
        <Sequence from={0} durationInFrames={44}>
          <PhonkTransition variant="chroma" accentColor={brawlers[0].accentColor}>
            <TrioBrawlerCard brawler={brawlers[0]} mode="image_shake" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 1b. Text Card Pop "MORTIS" (F044 - F076) — black flash cut */}
      {brawlers[0] && (
        <Sequence from={44} durationInFrames={32}>
          <PhonkTransition variant="blackFlash" accentColor={brawlers[0].accentColor}>
            <TrioBrawlerCard brawler={brawlers[0]} mode="text_card" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 1c. Action Pose 2 (F076 - F139) — exposure spike cut */}
      {brawlers[0] && (
        <Sequence from={76} durationInFrames={63} style={{ zIndex: 10 }}>
          <PhonkTransition variant="exposureSpike" accentColor={brawlers[0].accentColor}>
            <TrioBrawlerCard brawler={brawlers[0]} mode="action_pose" />
          </PhonkTransition>
        </Sequence>
      )}

      {/* Brawler 2 (Edgar): intro slides in OVER the tail of Mortis's action pose (F125-F170) */}
      {/* 2a. Intro Image Shake (F125 - F170) — 14f overlap with Mortis, slides in smaller then grows + shake */}
      {brawlers[1] && (
        <Sequence from={125} durationInFrames={46} style={{ zIndex: 20 }}>
          <PhonkTransition variant="chroma" accentColor={brawlers[1].accentColor}>
            <TrioBrawlerCard brawler={brawlers[1]} mode="image_shake" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 2b. Text Card Pop "EDGAR" (F171 - F204) — black flash cut */}
      {brawlers[1] && (
        <Sequence from={171} durationInFrames={33}>
          <PhonkTransition variant="blackFlash" accentColor={brawlers[1].accentColor}>
            <TrioBrawlerCard brawler={brawlers[1]} mode="text_card" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 2c. Action Pose 2 (F204 - F267) — exposure spike cut */}
      {brawlers[1] && (
        <Sequence from={204} durationInFrames={63} style={{ zIndex: 10 }}>
          <PhonkTransition variant="exposureSpike" accentColor={brawlers[1].accentColor}>
            <TrioBrawlerCard brawler={brawlers[1]} mode="action_pose" />
          </PhonkTransition>
        </Sequence>
      )}

      {/* Brawler 3 (Crow): intro slides in OVER the tail of Edgar's action pose (F253-F298) */}
      {/* 3a. Intro Image Shake (F253 - F298) — 14f overlap with Edgar, slides in smaller then grows + shake */}
      {brawlers[2] && (
        <Sequence from={253} durationInFrames={46} style={{ zIndex: 20 }}>
          <PhonkTransition variant="chroma" accentColor={brawlers[2].accentColor}>
            <TrioBrawlerCard brawler={brawlers[2]} mode="image_shake" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 3b. Text Card Pop "CROW" (F299 - F332) — black flash cut */}
      {brawlers[2] && (
        <Sequence from={299} durationInFrames={33}>
          <PhonkTransition variant="blackFlash" accentColor={brawlers[2].accentColor}>
            <TrioBrawlerCard brawler={brawlers[2]} mode="text_card" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 3c. Action Pose 2 (F332 - F395) — exposure spike cut */}
      {brawlers[2] && (
        <Sequence from={332} durationInFrames={63}>
          <PhonkTransition variant="exposureSpike" accentColor={brawlers[2].accentColor}>
            <TrioBrawlerCard brawler={brawlers[2]} mode="action_pose" />
          </PhonkTransition>
        </Sequence>
      )}

      {/* Trio Climax Finale & 7-Panel Rapid Alternating Slide Sequence: F395 - F525 (6.58s - 8.82s) */}
      <Sequence from={395} durationInFrames={130}>
        <PhonkTransition variant="exposureSpike" accentColor={climax.accentColor}>
          <TrioClimaxFinale rapidPanels={climax.rapidPanels} />
        </PhonkTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
