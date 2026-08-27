import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  TimelineReelProps,
  TENSION,
  RELIEF,
  FPS,
  secToFrame,
} from "./timeline_reel/types";
import { CutFlash } from "./timeline_reel/effects";
import { Captions } from "./timeline_reel/captions";
import { ClockHUD, EndCard } from "./timeline_reel/hud";
import {
  SceneDoorMistake,
  SceneEscapeAction,
  ScenePlunge,
  SceneSurfacePayoff,
  SceneWaterRise,
} from "./timeline_reel/scenes_simulation";

const SCENES: Record<string, React.FC> = {
  hook: ScenePlunge,
  door: SceneDoorMistake,
  chest: SceneWaterRise,
  escape: SceneEscapeAction,
  payoff: SceneSurfacePayoff,
};

export const TimelineReel: React.FC<TimelineReelProps> = (props) => {
  const { totalDuration, fps, beats } = props;
  const frame = useCurrentFrame();
  const durationInFrames = Math.ceil(totalDuration * fps);

  const lastBeatEnd =
    beats.length > 0 ? beats[beats.length - 1].start + beats[beats.length - 1].duration : 0;
  const endCardStart = secToFrame(lastBeatEnd + 0.15);

  // Find currently active beat
  const currentSec = frame / FPS;
  const activeBeat =
    beats.find((b) => currentSec >= b.start && currentSec < b.start + b.duration + b.gapAfter) ||
    beats[0];
  const isRelief = activeBeat?.id === "payoff";

  return (
    <AbsoluteFill
      style={{
        background: isRelief
          ? `linear-gradient(180deg, ${RELIEF.mid} 0%, ${RELIEF.deep} 100%)`
          : `linear-gradient(180deg, ${TENSION.surface} -10%, ${TENSION.mid} 40%, ${TENSION.abyss} 100%)`,
      }}
    >
      {/* One sequence per beat: Scene + Flash + Captions + VO + SFX */}
      {beats.map((b) => {
        const startF = secToFrame(b.start);
        const durF = secToFrame(b.duration + b.gapAfter);
        const Scene = SCENES[b.id];
        const beatRelief = b.id === "payoff";

        return (
          <Sequence key={b.id} from={startF} durationInFrames={durF}>
            {Scene ? <Scene /> : null}
            <CutFlash />
            <Captions
              vo={b.vo}
              words={b.words}
              beatDurationSec={b.duration}
              relief={beatRelief}
            />
            <Audio src={staticFile(`reel_001/${b.audio.split("/").pop()}`)} />

            {/* Per-beat event-driven SFX */}
            {b.id === "hook" && (
              <>
                <Sequence from={0} durationInFrames={secToFrame(1.2)}>
                  <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.8} />
                </Sequence>
                <Sequence from={0} durationInFrames={secToFrame(1.5)}>
                  <Audio src={staticFile("sfx/vine_boom.mp3")} volume={0.9} />
                </Sequence>
              </>
            )}

            {b.id === "door" && (
              <>
                <Sequence from={12} durationInFrames={secToFrame(1.0)}>
                  <Audio src={staticFile("sfx/click.mp3")} volume={0.85} />
                </Sequence>
                <Sequence from={40} durationInFrames={secToFrame(1.5)}>
                  <Audio src={staticFile("sfx/error.mp3")} volume={0.7} />
                </Sequence>
              </>
            )}

            {b.id === "escape" && (
              <>
                <Sequence from={40} durationInFrames={secToFrame(1.0)}>
                  <Audio src={staticFile("sfx/click.mp3")} volume={0.9} />
                </Sequence>
                <Sequence from={95} durationInFrames={secToFrame(1.5)}>
                  <Audio src={staticFile("sfx/vine_boom.mp3")} volume={0.9} />
                </Sequence>
              </>
            )}

            {b.id === "payoff" && (
              <Sequence from={0} durationInFrames={secToFrame(3.5)}>
                <Audio src={staticFile("sfx/chime.mp3")} volume={0.75} />
              </Sequence>
            )}
          </Sequence>
        );
      })}

      {/* Clean Countdown HUD */}
      <Sequence from={secToFrame(0)} durationInFrames={endCardStart}>
        <ClockHUD
          totalDuration={totalDuration}
          offsetSec={0}
          relief={isRelief}
        />
      </Sequence>

      {/* Continuous Tension Bed */}
      <Audio src={staticFile("sfx/riser.mp3")} volume={0.3} />
      <Sequence from={secToFrame(0.5)} durationInFrames={Math.max(1, endCardStart - secToFrame(0.5))}>
        <Audio src={staticFile("sfx/clock-ticking.mp3")} volume={0.2} loop />
      </Sequence>

      {/* End Card */}
      <Sequence from={endCardStart} durationInFrames={durationInFrames - endCardStart}>
        <EndCard {...props.endCard} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const calculateTimelineReelMetadata = ({ props }: { props: TimelineReelProps }) => ({
  fps: FPS,
  width: 1080,
  height: 1920,
  durationInFrames: Math.ceil(props.totalDuration * FPS),
});

