import React from "react";
import { Sequence, Audio, useCurrentFrame, interpolate, spring } from "remotion";
import { BestCharEditProps } from "../props";
import { BestCharCard } from "./BestCharCard";
import { BestCharWinner } from "./BestCharWinner";

export const BestCharPhonkTemplate: React.FC<BestCharEditProps> = (props) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
        position: "relative",
      }}
    >
      {/* Audio Track */}
      {props.audioTrack && <Audio src={props.audioTrack} />}

      {/* 1. Intro Hook Phase (Frames 0 -> 64) */}
      <Sequence from={props.intro.startFrame} durationInFrames={props.intro.endFrame - props.intro.startFrame}>
        <IntroSequence intro={props.intro} />
      </Sequence>

      {/* 2. Contender Cards Phase */}
      {props.contenders.map((contender) => {
        const duration = contender.endFrame - contender.startFrame;
        return (
          <Sequence key={contender.id} from={contender.startFrame} durationInFrames={duration}>
            <BestCharCard contender={contender} />
          </Sequence>
        );
      })}

      {/* 3. Climax Winner Reveal Phase */}
      <Sequence
        from={props.winner.startFrame}
        durationInFrames={props.winner.endFrame - props.winner.startFrame}
      >
        <BestCharWinner winner={props.winner} />
      </Sequence>
    </div>
  );
};

const IntroSequence: React.FC<{ intro: BestCharEditProps["intro"] }> = ({ intro }) => {
  const frame = useCurrentFrame();

  const titleScale = spring({
    frame,
    fps: 30,
    config: { damping: 14, stiffness: 180 },
  });

  const subTextOpacity = interpolate(frame, [15, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#080a10",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `scale(${titleScale})`,
          padding: "0 20px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Outfit', 'Impact', sans-serif",
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: 4,
            textShadow: "0 0 20px #8b5cf6, 0 0 40px #ec4899",
            WebkitTextStroke: "2px #000000",
            margin: 0,
          }}
        >
          {intro.headerText}
        </h1>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 42,
            fontWeight: 800,
            color: "#fbbf24",
            marginTop: 20,
            opacity: subTextOpacity,
            letterSpacing: 2,
            textShadow: "0 0 15px #f59e0b",
          }}
        >
          {intro.subText}
        </p>
      </div>
    </div>
  );
};
