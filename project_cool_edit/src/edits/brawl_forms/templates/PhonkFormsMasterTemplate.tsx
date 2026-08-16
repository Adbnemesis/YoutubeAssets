import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, Audio, useVideoConfig, useCurrentFrame, spring, interpolate, staticFile } from "remotion";
import { MangaGridReveal, PanelConfig } from "./MangaGridReveal";
import { MangaPhonkClip } from "./MangaPhonkClip";
import { FlashTransition } from "./FlashTransition";
import { GlitchEffect } from "./GlitchEffect";

export interface IntroForm {
  iconSrc: string;
  auraColor: string;
  panels: PanelConfig[];
  startTime: number;          // in seconds
  endTime: number;            // in seconds
  sfxSrc?: string;            // Audio sound effect for this form
}

export interface DropClip {
  src: string;
  isSilhouette?: boolean;
  silhouetteColor?: string;
  videoStartFrame?: number;
}

export interface PhonkMasterProps {
  titleText?: string;
  subTitleText?: string;
  titleColor?: string;
  titleAccentColor?: string;
  audioSrc: string;
  introForms: IntroForm[];
  dropClips: DropClip[]; // Structured objects for the drop
  dropCuts: number[];   // Exact timestamps of scene cuts in seconds
}

const BRAWLER_GIF_FPS_MAP: Record<string, number> = {
  "brawler_gifs/surge_win.gif": 24,
  "brawler_gifs/max_win.gif": 24,
  "brawler_gifs/meg_win.gif": 24,
  "brawler_gifs/edgar_win.gif": 24,
  "brawler_gifs/mortis_win.gif": 24,
  "brawler_gifs/kenji_win.gif": 24,
  "brawler_gifs/crow_win.gif": 24,
  "brawler_gifs/leon_win.gif": 24,
  "brawler_gifs/tara_win.gif": 24,
  "brawler_gifs/bibi_win.gif": 24,
  "brawler_gifs/frank_win.gif": 10,
  "brawler_gifs/hank_win.gif": 24,
  "brawler_gifs/kaze_win.gif": 24,
};

export const PhonkFormsMasterTemplate: React.FC<PhonkMasterProps> = ({
  titleText = "PHONK",
  subTitleText,
  titleColor = "#a855f7",
  titleAccentColor = "#22c55e",
  audioSrc,
  introForms,
  dropClips,
  dropCuts,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Determine top line and bottom line title text
  let line1 = titleText;
  let line2 = subTitleText;

  if (!line2 && titleText.includes(" ")) {
    const parts = titleText.split(" ");
    line1 = parts[0];
    line2 = parts.slice(1).join(" ");
  }

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

      // Calculate smooth frame offset if this clip is a full-color reveal following a silhouette of the SAME src
      let videoStartFrame = clipInfo.videoStartFrame;
      if (videoStartFrame === undefined && index > 0) {
        const prevClipInfo = dropClips[(index - 1) % dropClips.length];
        if (prevClipInfo.isSilhouette && !clipInfo.isSilhouette && prevClipInfo.src === clipInfo.src) {
          const prevCutTime = dropCuts[index - 1];
          const elapsedTimeSeconds = cutTime - prevCutTime;
          const gifFps = BRAWLER_GIF_FPS_MAP[clipInfo.src] ?? 24;
          videoStartFrame = Math.round(elapsedTimeSeconds * gifFps);
        }
      }

      return {
        startFrame,
        durationInFrames,
        imageSrc: clipInfo.src,
        isSilhouette: clipInfo.isSilhouette,
        silhouetteColor: clipInfo.silhouetteColor,
        videoStartFrame,
        index
      };
    });
  }, [dropCuts, fps, dropClips]);

  // The Glitch transition happens at 9.37s to 10.13s (approx)
  const glitchStartFrame = Math.round(9.37 * fps);
  const glitchEndFrame = Math.round(10.13 * fps);
  const glitchDuration = glitchEndFrame - glitchStartFrame;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      {/* Dynamic Intro Title */}
      {frame < 75 && line1 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <div style={{
            fontSize: "100px",
            fontWeight: "900",
            color: "#fff",
            textAlign: "center",
            textTransform: "uppercase",
            lineHeight: 1.1,
            textShadow: `0 10px 20px rgba(0,0,0,0.8), 0 0 30px ${titleColor}, 0 0 60px ${titleAccentColor}`,
            transform: `scale(${interpolate(spring({ fps, frame, config: { damping: 14, stiffness: 150 } }), [0, 1], [0.5, 1])}) translateY(${interpolate(frame, [0, 75], [0, -50])}px)`,
            opacity: interpolate(frame, [50, 75], [1, 0]),
            fontFamily: "Impact, Arial, sans-serif",
            fontStyle: "italic",
            letterSpacing: "8px"
          }}>
            {line1}
            {line2 && (
              <>
                <br />
                <span style={{ color: titleColor, textShadow: `0 10px 20px rgba(0,0,0,0.8), 0 0 30px ${titleAccentColor}` }}>
                  {line2}
                </span>
              </>
            )}
          </div>
        </AbsoluteFill>
      )}

      {audioSrc && <Audio src={audioSrc} />}

      {/* Intro Form Sequences */}
      {introSequences.map((seq, i) => (
        <Sequence
          key={`intro-${i}`}
          from={seq.startFrame}
          durationInFrames={seq.durationInFrames}
        >
          {seq.sfxSrc && <Audio src={staticFile(seq.sfxSrc)} volume={0.8} />}
          <MangaGridReveal 
            auraColor={seq.auraColor} 
            iconSrc={seq.iconSrc} 
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
          form1IconSrc={introForms[0].iconSrc}
          form4IconSrc={introForms[3].iconSrc}
        />
      </Sequence>

      {/* Main Drop Gameplay Sequences */}
      {dropSequences.map((seq) => (
        <Sequence
          key={`drop-${seq.index}`}
          from={seq.startFrame}
          durationInFrames={seq.durationInFrames}
        >
          <MangaPhonkClip 
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
