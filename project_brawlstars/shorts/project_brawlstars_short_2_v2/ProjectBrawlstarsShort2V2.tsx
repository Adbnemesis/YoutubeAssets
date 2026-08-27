import React from "react";
import { AbsoluteFill } from "remotion";
import { RankingVideoTemplate } from "../../components/RankingVideoTemplate";
import { mbgcSceneConfigV2 } from "./config";

/**
 * Short #2 v2 — Melodie / Bibi / Gale / Crow tier list.
 *
 * v2 fixes (verified against reference-frame analysis):
 *  - Pitch-black tier list, no neon glow on cards or letters
 *  - Battle camera zooms to the attacking brawler card
 *  - Clean single-projectile battle VFX (no full-board streaks)
 *
 * Same dialogue + BGM + winner (MELODIE) as v1.
 */
export const ProjectBrawlstarsShort2V2: React.FC = () => {
  return (
    <AbsoluteFill>
      <RankingVideoTemplate config={mbgcSceneConfigV2} />
    </AbsoluteFill>
  );
};

export { mbgcSceneConfigV2 };
