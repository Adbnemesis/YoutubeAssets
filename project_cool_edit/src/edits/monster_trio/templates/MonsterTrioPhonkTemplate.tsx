import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import { MonsterTrioEditProps } from "../props";
import { TrioBrawlerCard } from "./TrioBrawlerCard";
import { TrioClimaxFinale } from "./TrioClimaxFinale";
import { PhonkTransition } from "./PhonkTransition";

export const MonsterTrioPhonkTemplate: React.FC<MonsterTrioEditProps> = (props) => {
  const { watermarkText, brawlers, climax } = props;

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
        <Sequence from={444}>
          <Audio src={climax.voiceLines[0]} volume={0.9} />
        </Sequence>
      )}

      {/* Watermark Tag (Top Corner) */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          zIndex: 100,
          color: "rgba(255,255,255,0.7)",
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 2,
          fontFamily: "sans-serif",
          textShadow: "0 0 10px rgba(0,0,0,0.8)",
        }}
      >
        {watermarkText}
      </div>

      {/* Brawler 1 (Mortis): F000 - F139 */}
      {/* 1a. Intro Image Shake (F000 - F044) */}
      {brawlers[0] && (
        <Sequence from={0} durationInFrames={44}>
          <PhonkTransition accentColor={brawlers[0].accentColor}>
            <TrioBrawlerCard brawler={brawlers[0]} mode="image_shake" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 1b. Text Card Pop "MORTIS" (F044 - F076) */}
      {brawlers[0] && (
        <Sequence from={44} durationInFrames={32}>
          <PhonkTransition accentColor={brawlers[0].accentColor}>
            <TrioBrawlerCard brawler={brawlers[0]} mode="text_card" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 1c. Action Pose 2 (F076 - F139) */}
      {brawlers[0] && (
        <Sequence from={76} durationInFrames={63}>
          <PhonkTransition accentColor={brawlers[0].accentColor}>
            <TrioBrawlerCard brawler={brawlers[0]} mode="action_pose" />
          </PhonkTransition>
        </Sequence>
      )}

      {/* Brawler 2 (Edgar Overlaps Brawler 1): F139 - F267 */}
      {/* 2a. Intro Image Shake (F139 - F171) */}
      {brawlers[1] && (
        <Sequence from={139} durationInFrames={32}>
          <PhonkTransition accentColor={brawlers[1].accentColor}>
            <TrioBrawlerCard brawler={brawlers[1]} mode="image_shake" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 2b. Text Card Pop "EDGAR" (F171 - F204) */}
      {brawlers[1] && (
        <Sequence from={171} durationInFrames={33}>
          <PhonkTransition accentColor={brawlers[1].accentColor}>
            <TrioBrawlerCard brawler={brawlers[1]} mode="text_card" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 2c. Action Pose 2 (F204 - F267) */}
      {brawlers[1] && (
        <Sequence from={204} durationInFrames={63}>
          <PhonkTransition accentColor={brawlers[1].accentColor}>
            <TrioBrawlerCard brawler={brawlers[1]} mode="action_pose" />
          </PhonkTransition>
        </Sequence>
      )}

      {/* Brawler 3 (Crow Overlaps Brawler 2): F267 - F444 */}
      {/* 3a. Intro Image Shake (F267 - F299) */}
      {brawlers[2] && (
        <Sequence from={267} durationInFrames={32}>
          <PhonkTransition accentColor={brawlers[2].accentColor}>
            <TrioBrawlerCard brawler={brawlers[2]} mode="image_shake" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 3b. Text Card Pop "CROW" (F299 - F332) */}
      {brawlers[2] && (
        <Sequence from={299} durationInFrames={33}>
          <PhonkTransition accentColor={brawlers[2].accentColor}>
            <TrioBrawlerCard brawler={brawlers[2]} mode="text_card" />
          </PhonkTransition>
        </Sequence>
      )}
      {/* 3c. Action Pose 2 (F332 - F444) */}
      {brawlers[2] && (
        <Sequence from={332} durationInFrames={112}>
          <PhonkTransition accentColor={brawlers[2].accentColor}>
            <TrioBrawlerCard brawler={brawlers[2]} mode="action_pose" />
          </PhonkTransition>
        </Sequence>
      )}

      {/* Trio Climax Finale & Rapid Panel Sequence: F444 - F525 */}
      <Sequence from={444} durationInFrames={81}>
        <PhonkTransition accentColor={climax.accentColor}>
          <TrioClimaxFinale
            titleText={climax.titleText}
            accentColor={climax.accentColor}
            rapidPanels={climax.rapidPanels}
            victoryStance={climax.victoryStance}
          />
        </PhonkTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
