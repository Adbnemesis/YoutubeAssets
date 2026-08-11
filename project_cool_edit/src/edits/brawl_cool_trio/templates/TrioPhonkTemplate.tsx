import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, Audio, useVideoConfig, useCurrentFrame, interpolate, spring, staticFile, random } from "remotion";
import { TrioCard, TrioCard as TrioCardType } from "./TrioCard";
import { FlashTransition } from "../../brawl_forms/templates/FlashTransition";

export interface TrioPhonkProps {
  audioSrc: string;
  title: string;
  cards: TrioCardType[];
}

export const TrioPhonkTemplate: React.FC<TrioPhonkProps> = ({ audioSrc, title, cards }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const sequences = useMemo(() => {
    return cards.map((card) => {
      const startFrame = Math.round(card.startTime * fps);
      const endFrame = Math.round(card.endTime * fps);
      return { ...card, startFrame, durationInFrames: endFrame - startFrame };
    });
  }, [cards, fps]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      {audioSrc && <Audio src={audioSrc} />}

      {/* Intro Title (Phase 1) */}
      {frame < Math.round(2.8 * fps) && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <div
            style={{
              fontSize: "110px",
              fontWeight: "900",
              color: "#fff",
              textAlign: "center",
              textTransform: "uppercase",
              lineHeight: 1.1,
              textShadow: "0 10px 20px rgba(0,0,0,0.9), 0 0 40px #3b82f6, 0 0 80px #ef4444",
              transform: `scale(${interpolate(spring({ fps, frame, config: { damping: 14, stiffness: 150 } }), [0, 1], [0.5, 1])}) translateY(${interpolate(frame, [0, Math.round(2.4 * fps)], [0, -40])}px)`,
              opacity: interpolate(frame, [Math.round(2.3 * fps), Math.round(2.8 * fps)], [1, 0]),
              fontFamily: "Impact, Arial, sans-serif",
              fontStyle: "italic",
              letterSpacing: "8px",
            }}
          >
            {title}
          </div>
        </AbsoluteFill>
      )}

      {/* Card Sequences */}
      {sequences.map((seq, i) => (
        <Sequence key={`card-${i}`} from={seq.startFrame} durationInFrames={seq.durationInFrames}>
          <TrioCard card={seq} clipIndex={i} />
          {/* External effects (Flash, Glitch, and Dark Fade are external overlays) */}
          {seq.effects?.includes("glitch") && (
            <Sequence from={0} durationInFrames={5}>
              <GlitchTransition intensity={1} />
            </Sequence>
          )}
          {seq.effects?.includes("heavy_glitch") && (
            <Sequence from={0} durationInFrames={8}>
              <GlitchTransition intensity={2} />
            </Sequence>
          )}
          {seq.effects?.includes("flash") && (
            <Sequence from={0} durationInFrames={6}>
              <FlashTransition />
            </Sequence>
          )}
          {seq.effects?.includes("dark_fade") && (
            <Sequence from={0} durationInFrames={8}>
              <DarkFadeEffect durationFrames={8} />
            </Sequence>
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// --- Custom Effects ---

const DarkFadeEffect: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, durationFrames], [1, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "black", opacity }} />;
};

const GlitchTransition: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();
  const duration = intensity > 1 ? 8 : 5;
  const opacity = interpolate(frame, [0, duration], [0.8 * intensity, 0], { extrapolateRight: "clamp" });
  
  if (opacity <= 0) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      {/* Chromatic Flash Layer */}
      <AbsoluteFill style={{ 
        backgroundColor: frame % 2 === 0 ? "rgba(255,0,0,0.5)" : "rgba(0,255,255,0.5)", 
        mixBlendMode: "overlay", 
        opacity 
      }} />
      
      {/* Scanline Flash */}
      <AbsoluteFill style={{
        background: `repeating-linear-gradient(${random(`angle-${frame}`) > 0.5 ? 0 : 90}deg, transparent, transparent 4px, rgba(255,255,255,0.8) 4px, rgba(255,255,255,0.8) 8px)`,
        mixBlendMode: "overlay",
        opacity: opacity * 0.7,
        transform: `translateY(${(random(`y-${frame}`) - 0.5) * 100}px)`
      }} />
      
      {/* Slice effect (random inverted bands) */}
      {[...Array(Math.floor(4 * intensity))].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: `${random(`t-${frame}-${i}`) * 100}%`,
          left: 0,
          width: "100%",
          height: `${random(`h-${frame}-${i}`) * 15 + 2}%`,
          backgroundColor: "white",
          mixBlendMode: "difference",
          opacity: opacity * 0.6
        }} />
      ))}
    </AbsoluteFill>
  );
};
