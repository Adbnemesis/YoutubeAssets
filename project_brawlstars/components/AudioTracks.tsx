import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig, interpolate } from "remotion";
import { AudioConfig, FightTurn } from "../types";
import { secondsToFrame, beatToFrame } from "../beatGrid";

export interface AudioTracksProps {
  audio: AudioConfig;
  /** Fight turn voice lines (played on their attack beats) */
  fightTurns?: FightTurn[];
  /** brawlerId -> frame at which the brawler is defeated (stops their SFX/voices) */
  defeatFrames?: Record<string, number>;
}

/**
 * Schedules the BGM (with ducking under voice), the voice track and
 * beat-locked SFX. Everything is config-driven.
 */
export const AudioTracks: React.FC<AudioTracksProps> = ({ audio, fightTurns, defeatFrames }) => {
  const { fps, durationInFrames } = useVideoConfig();

  // A brawler's SFX/voice is muted once they are defeated in the fight.
  const aliveAt = (brawlerId: string, frame: number): boolean => {
    if (!defeatFrames) return true;
    const defeat = defeatFrames[brawlerId];
    if (defeat === undefined) return true;
    return frame < defeat;
  };

  const bgmVolumeAt = (frame: number): number => {
    let vol = audio.bgmVolume ?? 1;

    // Intro voice duck: low during the dialogue, ramp back up to full
    if (audio.duck) {
      const fromF = secondsToFrame(audio.duck.from, fps);
      const toF = secondsToFrame(audio.duck.to, fps);
      if (frame >= fromF && frame < toF) {
        const ramp = Math.min(1, (toF - frame) / 8);
        vol *= interpolate(ramp, [0, 1], [1, audio.duck.volume]);
      }
    }

    // Fight duck: drop to near-silence during the battle, slam back at the drop
    if (audio.fightDuck) {
      const fromF = secondsToFrame(audio.fightDuck.from, fps);
      const toF = secondsToFrame(audio.fightDuck.to, fps);
      const enterStart = fromF - 10;
      if (frame >= enterStart && frame <= toF) {
        const enter = Math.min(1, Math.max(0, (frame - enterStart) / 10));
        const exit = Math.min(1, Math.max(0, (toF - frame) / 5));
        const ramp = Math.min(enter, exit);
        vol *= interpolate(ramp, [0, 1], [1, audio.fightDuck.volume]);
      }
    }

    const fadeFrames = audio.fadeOutFrames ?? 24;
    const fadeStart = durationInFrames - fadeFrames;
    if (frame >= fadeStart) {
      vol *= interpolate(frame, [fadeStart, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    return Math.max(0, Math.min(1, vol));
  };

  return (
    <>
      <Audio
        src={staticFile(audio.bgmSrc)}
        startFrom={secondsToFrame(audio.bgmStartSeconds, fps)}
        volume={bgmVolumeAt}
      />
      {audio.voiceSrc && (
        <Audio
          src={staticFile(audio.voiceSrc)}
          volume={audio.voiceVolume ?? 1}
        />
      )}
      {audio.sfx.map((sfx, i) =>
        sfx.brawlerId && !aliveAt(sfx.brawlerId, sfx.frame) ? null : (
          <Sequence key={i} from={Math.max(0, sfx.frame)}>
            <Audio src={staticFile(sfx.src)} volume={sfx.volume ?? 1} />
          </Sequence>
        )
      )}

      {/* Fight voice lines — brawlers taunt as they attack (spaced, no overlap) */}
      {fightTurns
        ?.filter((turn) => turn.voiceSrc)
        .map((turn, i) => {
          const beatFrame = beatToFrame(turn.beat, fps);
          if (!aliveAt(turn.id, beatFrame)) return null;
          return (
            <Sequence key={`v${i}`} from={Math.max(0, beatFrame)}>
              <Audio
                src={staticFile(`brawl/${turn.voiceSrc}`)}
                startFrom={secondsToFrame(turn.voiceFrom, fps)}
                endAt={secondsToFrame(turn.voiceTo, fps)}
                volume={1}
              />
            </Sequence>
          );
        })}
    </>
  );
};
