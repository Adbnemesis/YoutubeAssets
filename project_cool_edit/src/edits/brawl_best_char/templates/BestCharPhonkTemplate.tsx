import React from "react";
import { Sequence, Audio, useCurrentFrame, interpolate, spring } from "remotion";
import { BestCharEditProps } from "../props";
import { BestCharCard } from "./BestCharCard";
import { BestCharWinner } from "./BestCharWinner";

export const BestCharPhonkTemplate: React.FC<BestCharEditProps> = (props) => {
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
    config: { damping: 12, stiffness: 200 },
  });

  const subTextOpacity = interpolate(frame, [12, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subTextScale = spring({
    frame: Math.max(0, frame - 12),
    fps: 30,
    config: { damping: 11, stiffness: 210 },
  });

  const bgPos = (frame * 10) % 100;
  const shakeX = frame >= 33 && frame < 40 ? Math.sin(frame * 3) * 6 : 0;
  const shakeY = frame >= 33 && frame < 40 ? Math.cos(frame * 3) * 6 : 0;

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#060810",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Dynamic Purple/Pink Radial Pulsating Background Glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, #7c3aed 0%, #ec4899 40%, transparent 75%)",
          opacity: 0.45,
          filter: "blur(70px)",
        }}
      />

      {/* Moving Speed Lines backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 3px, transparent 3px, transparent 14px)",
          backgroundPosition: `${bgPos}px ${bgPos}px`,
        }}
      />

      {/* Intro Header & Subtext */}
      <div
        style={{
          textAlign: "center",
          padding: "0 20px",
          zIndex: 10,
        }}
      >
        <div style={{ transform: `scale(${titleScale})` }}>
          <h1
            style={{
              fontFamily: "'Outfit', 'Impact', sans-serif",
              fontSize: 78,
              fontWeight: 900,
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: 4,
              textShadow: "0 0 30px #7c3aed, 0 0 60px #ec4899, 0 0 90px #000000",
              WebkitTextStroke: "3px #000000",
              margin: 0,
            }}
          >
            {intro.headerText}
          </h1>
        </div>

        <div style={{ transform: `scale(${subTextScale})`, opacity: subTextOpacity }}>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 48,
              fontWeight: 900,
              color: "#fbbf24",
              marginTop: 25,
              letterSpacing: 3,
              textShadow: "0 0 20px #f59e0b, 0 0 40px #d97706",
              WebkitTextStroke: "2px #000000",
            }}
          >
            {intro.subText}
          </p>
        </div>
      </div>
    </div>
  );
};
