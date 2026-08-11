import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, Audio, useVideoConfig } from "remotion";
import { DynamicGridReveal, PanelConfig } from "./DynamicGridReveal";
import { DynamicPhonkClip } from "./DynamicPhonkClip";
import { FlashTransition } from "./FlashTransition";
import { GlitchEffect } from "./GlitchEffect";

export interface IntroForm {
  iconSrc: string;
  auraColor: string;
  panels: PanelConfig[];
  startTime: number;          // in seconds
  endTime: number;            // in seconds
}

export interface DropClip {
  src: string;
  isSilhouette?: boolean;
  silhouetteColor?: string;
  videoStartFrame?: number;
}

export interface PhonkMasterProps {
  audioSrc: string;
  introForms: IntroForm[];
  dropClips: DropClip[]; // Structured objects for the drop
  dropCuts: number[];   // Exact timestamps of scene cuts in seconds
}

export const MasterPhonkTemplate: React.FC<PhonkMasterProps> = ({
  audioSrc,
  introForms,
  dropClips,
  dropCuts,
}) => {
  const { fps } = useVideoConfig();

  // 1. Calculate Intro Sequences
  const introSequences = useMemo(() => {
    return introForms.map((form) => {
      const startFrame = Math.round(form.startTime * fps);
      const endFrame = Math.round(form.endTime * fps);
      return {
        ...form,
        startFrame,
        durationInFrames: endFrame - startFrame,
      };
    });
  }, [introForms, fps]);

  // 2. Calculate Drop Sequences exactly based on hardcoded cuts
  const dropSequences = useMemo(() => {
    return dropCuts.map((cutTime, index) => {
      let startFrame = Math.round(cutTime * fps);
      
      // Calculate duration until the NEXT cut
      let nextStartFrame;
      if (index < dropCuts.length - 1) {
        nextStartFrame = Math.round(dropCuts[index + 1] * fps);
      } else {
        // Last clip gets a default 1-second duration
        nextStartFrame = startFrame + fps;
      }
      
      let durationInFrames = nextStartFrame - startFrame;
      
      // If the NEXT clip is a silhouette, extend THIS clip's duration so it stays as the background!
      if (index < dropCuts.length - 1) {
        const nextClipInfo = dropClips[(index + 1) % dropClips.length];
        if (nextClipInfo.isSilhouette) {
           const afterNextStartFrame = index < dropCuts.length - 2 
                ? Math.round(dropCuts[index + 2] * fps) 
                : Math.round(dropCuts[index + 1] * fps) + fps;
           durationInFrames = afterNextStartFrame - startFrame;
        }
      }

      // Cycle through provided drop clips
      const clipInfo = dropClips[index % dropClips.length];

      return {
        startFrame,
        durationInFrames,
        imageSrc: clipInfo.src,
        isSilhouette: clipInfo.isSilhouette,
        silhouetteColor: clipInfo.silhouetteColor,
        videoStartFrame: clipInfo.videoStartFrame,
        index
      };
    });
  }, [dropCuts, fps, dropClips]);

  // The Glitch transition happens at 9.37s to 10.13s (approx)
  // Let's use 9.37s to 10.13s exactly
  const glitchStartFrame = Math.round(9.37 * fps);
  const glitchEndFrame = Math.round(10.13 * fps);
  const glitchDuration = glitchEndFrame - glitchStartFrame;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {audioSrc && <Audio src={audioSrc} />}

      {/* Intro Form Sequences */}
      {introSequences.map((seq, i) => (
        <Sequence
          key={`intro-${i}`}
          from={seq.startFrame}
          durationInFrames={seq.durationInFrames}
        >
          <DynamicGridReveal 
            auraColor={seq.auraColor} 
            iconText={`FORM ${i + 1}`} 
            panels={seq.panels} 
          />
        </Sequence>
      ))}

      {/* White Flashes between forms */}
      {introSequences.map((seq, i) => {
        // No flash at the very start of Form 1
        if (i === 0) return null;
        return (
          <Sequence key={`flash-${i}`} from={seq.startFrame} durationInFrames={6}>
            <FlashTransition />
          </Sequence>
        );
      })}

      {/* Big white flash before drops */}
      <Sequence from={Math.round(10.53 * fps)} durationInFrames={6}>
        <FlashTransition />
      </Sequence>

      {/* Glitch Transition Layer */}
      <Sequence from={glitchStartFrame} durationInFrames={glitchDuration}>
        <GlitchEffect 
          form1Panels={introForms[0].panels} 
          form4Panels={introForms[3].panels} 
        />
      </Sequence>

      {/* Main Drop Gameplay Sequences */}
      {dropSequences.map((seq) => (
        <Sequence
          key={`drop-${seq.index}`}
          from={seq.startFrame}
          durationInFrames={seq.durationInFrames}
        >
          <DynamicPhonkClip 
            imageSrc={seq.imageSrc} 
            clipIndex={seq.index + 1}
            isSilhouette={seq.isSilhouette}
            silhouetteColor={seq.silhouetteColor}
            videoStartFrame={seq.videoStartFrame}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
