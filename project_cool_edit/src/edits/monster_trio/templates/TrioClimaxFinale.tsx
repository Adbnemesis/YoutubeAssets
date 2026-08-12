import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ClimaxPanel } from "../props";
import { PhonkBackdrop } from "./PhonkBackdrop";

interface TrioClimaxFinaleProps {
  rapidPanels: ClimaxPanel[];
}

export const TrioClimaxFinale: React.FC<TrioClimaxFinaleProps> = ({ rapidPanels }) => {
  const frame = useCurrentFrame(); // frame 0 is frame 395 (6.58s) in master timeline
  const { fps } = useVideoConfig();

  // 7 Panels spanning F395 (6.58s) to F525 (8.82s)
  // 6 sliding panels (16 frames each = 96 frames), plus 7th victory stance panel (frame 96 to 130)
  const panelDuration = 16;
  const rawIdx = Math.floor(frame / panelDuration);
  const panelIdx = Math.min(rapidPanels.length - 1, Math.max(0, rawIdx));
  const isVictoryStance = frame >= panelDuration * (rapidPanels.length - 1);

  const panel = isVictoryStance ? rapidPanels[rapidPanels.length - 1] : rapidPanels[panelIdx];

  // Alternating Slide Motion: Even indices (0, 2, 4) slide Left -> Right, Odd indices (1, 3, 5) slide Right -> Left
  const relativeFrame = frame % panelDuration;
  const isEvenPanel = panelIdx % 2 === 0;

  // Snappy spring slide — reduced travel (~30%) so each slide stays readable while the
  // whole card (brawler background + character) slides as one.
  const slideProgress = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const initialOffsetX = isEvenPanel ? 30 : -30;
  const slideX = interpolate(slideProgress, [0, 1], [initialOffsetX, 0]);

  // White flash burst cut on every panel entrance
  const showFlash = relativeFrame <= 2;

  // Previous panel stays visible underneath so the new panel + background slides over it
  const prevIdxRef = React.useRef(panelIdx);
  const prevPanel = prevIdxRef.current !== panelIdx ? rapidPanels[prevIdxRef.current] : null;
  prevIdxRef.current = panelIdx;

  const renderPanel = (p: ClimaxPanel, zIndex: number, slide?: number) => (
    <AbsoluteFill style={{ zIndex }}>
      <AbsoluteFill style={{ transform: slide !== undefined ? `translateX(${slide}%)` : undefined }}>
        <PhonkBackdrop
          backgroundImage={p.backgroundImage}
          accentColor={p.accentColor}
          boost={p.backgroundBoost ?? 1.2}
        >
          {/* Accent glow behind the character */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 45%, ${p.accentColor}55 0%, transparent 60%)`,
              mixBlendMode: "screen",
            }}
          />
          {/* Character Panel */}
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={p.image}
              style={{
                height: "90%",
                width: "auto",
                objectFit: "contain",
                filter: `drop-shadow(0 0 50px ${p.accentColor}) drop-shadow(0 0 120px ${p.accentColor}55)`,
              }}
            />
          </div>
        </PhonkBackdrop>
      </AbsoluteFill>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#080c14" }}>
      {prevPanel && renderPanel(prevPanel, 0)}
      {renderPanel(panel, 10, slideX)}

      {/* Flash Cut Overlay on Panel Cuts */}
      {showFlash && (
        <AbsoluteFill
          style={{
            backgroundColor: "#ffffff",
            opacity: 0.4,
            zIndex: 60,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};