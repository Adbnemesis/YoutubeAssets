import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { RankingVideoConfig } from "../types";
import { beatToFrame } from "../beatGrid";
import { Background } from "./Background";
import { CameraSystem } from "./CameraSystem";
import { IntroTitle } from "./IntroTitle";
import { IntroRoster } from "./IntroRoster";
import { TierList } from "./TierList";
import { WinnerReveal } from "./WinnerReveal";
import { FlashOverlay } from "./FlashOverlay";
import { WhooshTransition } from "./WhooshTransition";
import { SubtitleBar } from "./SubtitleBar";
import { AudioTracks } from "./AudioTracks";
import { popIn } from "../motion";
import { ensureBrawlFont } from "../fonts";

export interface RankingVideoTemplateProps {
  config: RankingVideoConfig;
}

export const RankingVideoTemplate: React.FC<RankingVideoTemplateProps> = ({
  config,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ensure font is loaded
  ensureBrawlFont();

  const introVisible = frame < config.gridRevealFrame;

  // brawlerId -> defeatFrame, used to mute defeated brawlers' SFX/voices mid-fight
  const defeatFrames: Record<string, number> = {};
  for (const e of config.tierList.entries) {
    if (e.defeatFrame !== undefined) defeatFrames[e.id] = e.defeatFrame;
  }

  return (
    <AbsoluteFill>
      <AudioTracks
        audio={config.audio}
        fightTurns={config.fight?.turns}
        defeatFrames={defeatFrames}
      />

      <CameraSystem
        camera={config.camera}
        zoomOut={config.cameraZoomOut}
        push={{
          from: beatToFrame(12, fps),
          to: beatToFrame(19, fps),
          max: 1.04,
        }}
      >
        {/* Background — color switches on every beat */}
        <Background colorCycle={config.colorCycle} introColor="#080604" particles={!introVisible} />

        {/* TIER LIST — fills the screen from frame 0 (zoomed + warm during the intro) */}
        <TierList
          config={config.tierList}
          settleFrame={0}
          slamFrame={config.slamFrame}
          fight={config.fight}
        />

        {/* INTRO — rotating word + floating pin over the tier list */}
        {introVisible && (
          <>
            {/* subtle warm glow behind the title only */}
            <AbsoluteFill
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(255,200,120,0.10) 0%, rgba(0,0,0,0) 55%)",
                zIndex: 8,
              }}
            />
          </>
        )}

        {/* WINNER phases — title / spin / outro */}
        <WinnerReveal
          phases={config.winner.phases}
          entries={config.tierList.entries}
          colorCycle={config.colorCycle}
        />

      </CameraSystem>

      {/* INTRO TITLE — fixed overlay OUTSIDE the camera, so the dialogue text
          and Kenji emote stay in place while the camera zooms into the icons. */}
      {introVisible && (
        <IntroTitle words={config.titleWords} centerY={0.42} />
      )}

      {/* Beat flashes */}
      <FlashOverlay events={config.flashes} />

      {/* Red-tinted grid reveal (reference: red flash decays over ~1.5s) */}
      {(() => {
        const revealStart = config.gridRevealFrame;
        if (frame < revealStart) return null;
        const tint = interpolate(frame, [revealStart, revealStart + 48], [0.55, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (tint <= 0) return null;
        return (
          <AbsoluteFill
            style={{
              backgroundColor: "#FF3B30",
              opacity: tint,
              zIndex: 20,
            }}
          />
        );
      })()}

      {/* Whoosh wipes — the grid wipe uses the reference's red blur */}
      {config.transitions.map((t, i) => (
        <WhooshTransition
          key={i}
          startFrame={t.frame}
          color={i === 0 ? "#FF2A2A" : "#FFFFFF"}
        />
      ))}

      {/* End fade to gray → black (reference ends with a gray fade) */}
      {(() => {
        const fadeStart = config.durationInFrames - 30;
        const gray = interpolate(frame, [fadeStart, config.durationInFrames - 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const black = interpolate(frame, [config.durationInFrames - 14, config.durationInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const grayOpacity = Math.max(0, gray - black);
        const blackOpacity = black;
        if (grayOpacity <= 0 && blackOpacity <= 0) return null;
        return (
          <AbsoluteFill style={{ zIndex: 120 }}>
            <AbsoluteFill style={{ backgroundColor: "#8A8A8A", opacity: grayOpacity }} />
            <AbsoluteFill style={{ backgroundColor: "#000000", opacity: blackOpacity }} />
          </AbsoluteFill>
        );
      })()}
    </AbsoluteFill>
  );
};


